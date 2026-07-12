const { Quotation, RFQ, Vendor } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const logActivity = require('../helpers/activityLogger');
const { createNotification } = require('../helpers/notificationHelper');

const generateQuotationNumber = async () => {
  const count = await Quotation.countDocuments();
  return `QT-${String(count + 1).padStart(3, '0')}`;
};

const getQuotations = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  if (query.rfqId) filter.rfq = query.rfqId;
  if (query.status) filter.status = query.status;
  if (user.role === 'vendor' && user.vendorProfile) filter.vendor = user.vendorProfile;

  const [quotations, total] = await Promise.all([
    Quotation.find(filter)
      .populate('rfq', 'rfqNumber title deadline budget')
      .populate('vendor', 'name rating onTimeDelivery vendorCode')
      .sort({ price: 1 })
      .skip(skip).limit(limit),
    Quotation.countDocuments(filter),
  ]);
  return { quotations, pagination: buildPaginationMeta(total, page, limit) };
};

const getQuotationById = async (id) => {
  const q = await Quotation.findOne({ _id: id, isDeleted: false })
    .populate('rfq').populate('vendor').populate('submittedBy', 'name email');
  if (!q) throw new AppError('Quotation not found', 404);
  return q;
};

const submitQuotation = async (data, user) => {
  const rfq = await RFQ.findOne({ _id: data.rfq, isDeleted: false });
  if (!rfq) throw new AppError('RFQ not found', 404);
  if (!['open', 'evaluating'].includes(rfq.status)) throw new AppError('RFQ is not accepting quotations', 400);

  const vendorId = user.vendorProfile || data.vendor;
  if (!vendorId) throw new AppError('Vendor profile required', 400);

  data.quotationNumber = await generateQuotationNumber();
  data.vendor = vendorId;
  data.submittedBy = user._id;
  data.status = 'submitted';
  data.submittedAt = new Date();

  const quotation = await Quotation.create(data);
  rfq.responses = await Quotation.countDocuments({ rfq: rfq._id, status: 'submitted', isDeleted: false });
  await rfq.save();

  await logActivity({ user, action: 'Submitted Quotation', target: quotation.quotationNumber, targetId: quotation._id, type: 'quotation' });
  await createNotification({
    userId: rfq.createdBy,
    title: 'New quotation received',
    message: `Quotation ${quotation.quotationNumber} submitted for ${rfq.rfqNumber}`,
    type: 'info',
  });

  return quotation;
};

const updateQuotation = async (id, data, user) => {
  const quotation = await Quotation.findOne({ _id: id, isDeleted: false, status: { $in: ['draft', 'submitted'] } });
  if (!quotation) throw new AppError('Quotation not found or cannot be edited', 404);
  Object.assign(quotation, data);
  await quotation.save();
  await logActivity({ user, action: 'Updated Quotation', target: quotation.quotationNumber, targetId: quotation._id, type: 'quotation' });
  return quotation;
};

const compareQuotations = async (rfqId) => {
  const rfq = await RFQ.findById(rfqId).populate('createdBy', 'name email');
  if (!rfq) throw new AppError('RFQ not found', 404);

  // We find 'submitted' quotations, but also 'approved' or 'rejected' if they were part of this RFQ cycle
  const quotations = await Quotation.find({ rfq: rfqId, isDeleted: false })
    .populate('vendor', 'name rating onTimeDelivery risk vendorCode')
    .sort({ price: 1 });

  if (!quotations.length) throw new AppError(`No quotations received for ${rfq.rfqNumber}`, 404);

  const activeQuotes = quotations.filter(q => ['submitted', 'approved'].includes(q.status));
  const prices = activeQuotes.map((q) => q.price);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const comparison = quotations.map((q) => {
    // Weighted Score: 40% Price, 25% Delivery, 20% Rating, 15% Performance (onTimeDelivery)
    // Normalized Price Score (Lower is better): (1 - (price - min) / (max - min)) or if only 1 quote, 100
    let priceScore = 100;
    if (maxPrice > lowestPrice) {
      priceScore = ((maxPrice - q.price) / (maxPrice - lowestPrice)) * 100;
    }

    // Delivery Score (Lower days is better): Normalize against 30 days max or max in set
    const maxDelivery = Math.max(...quotations.map(qu => qu.deliveryDays), 30);
    const deliveryScore = ((maxDelivery - q.deliveryDays) / maxDelivery) * 100;

    const ratingScore = (q.vendor?.rating || 0) * 20; // 0-5 -> 0-100
    const performanceScore = q.vendor?.onTimeDelivery || 0;

    const totalScore = Math.round(
      (priceScore * 0.4) +
      (deliveryScore * 0.25) +
      (ratingScore * 0.2) +
      (performanceScore * 0.15)
    );

    return {
      ...q.toObject(),
      score: totalScore,
      isLowestPrice: q.price === lowestPrice && q.price > 0,
      scores: { priceScore, deliveryScore, ratingScore, performanceScore }
    };
  });

  const sortedByScore = [...comparison].sort((a, b) => b.score - a.score);
  const recommended = sortedByScore[0];

  return {
    rfq,
    quotations: comparison,
    summary: {
      count: quotations.length,
      lowestPrice,
      highestPrice: maxPrice,
      avgDelivery: Math.round(quotations.reduce((s, q) => s + q.deliveryDays, 0) / quotations.length),
      recommendedVendorId: recommended.vendor?._id,
      recommendedQuotationId: recommended._id,
      recommendationReason: `Vendor ${recommended.vendor?.name} achieved the highest weighted score of ${recommended.score}/100 based on price, delivery, and performance.`,
    },
  };
};

const selectWinner = async (quotationId, user) => {
  const winner = await getQuotationById(quotationId);
  await Quotation.updateMany({ rfq: winner.rfq, _id: { $ne: quotationId } }, { recommended: false });
  winner.recommended = true;
  winner.status = 'approved';
  await winner.save();
  await Quotation.updateMany({ rfq: winner.rfq, _id: { $ne: quotationId }, status: 'submitted' }, { status: 'rejected' });
  await RFQ.findByIdAndUpdate(winner.rfq, { status: 'evaluating' });
  return winner;
};

const addAttachment = async (id, file, user) => {
  const quotation = await getQuotationById(id);
  quotation.attachments.push({
    originalName: file.originalname,
    fileName: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    size: file.size,
  });
  await quotation.save();
  await logActivity({ user, action: 'Uploaded quotation attachment', target: quotation.quotationNumber, targetId: quotation._id, type: 'quotation' });
  return quotation;
};

const getAttachment = async (quotationId, attachmentId) => {
  const quotation = await getQuotationById(quotationId);
  const attachment = quotation.attachments.id(attachmentId);
  if (!attachment) throw new AppError('Attachment not found', 404);
  return { quotation, attachment };
};

module.exports = {
  getQuotations, getQuotationById, submitQuotation, updateQuotation,
  compareQuotations, selectWinner, addAttachment, getAttachment,
};
