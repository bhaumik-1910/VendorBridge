const { RFQ, Vendor, Quotation } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, buildSort } = require('../utils/pagination');
const logActivity = require('../helpers/activityLogger');
const { createNotification } = require('../helpers/notificationHelper');
const { sendRFQInvitation } = require('../utils/emailService');

const generateRFQNumber = async () => {
  const year = new Date().getFullYear();
  const count = await RFQ.countDocuments({ createdAt: { $gte: new Date(`${year}-01-01`) } });
  return `RFQ-${year}-${String(count + 1).padStart(3, '0')}`;
};

const getRFQs = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.search) filter.$or = [
    { title: new RegExp(query.search, 'i') },
    { rfqNumber: new RegExp(query.search, 'i') },
  ];
  if (user.role === 'vendor' && user.vendorProfile) {
    filter.vendors = user.vendorProfile;
    filter.status = { $in: ['open', 'evaluating', 'closed'] };
  }
  const [rfqs, total] = await Promise.all([
    RFQ.find(filter)
      .populate('vendors', 'name email vendorCode category')
      .populate('createdBy', 'name email')
      .sort(buildSort(query.sortBy || 'createdAt', query.order))
      .skip(skip).limit(limit),
    RFQ.countDocuments(filter),
  ]);
  return { rfqs, pagination: buildPaginationMeta(total, page, limit) };
};

const getRFQById = async (id) => {
  const rfq = await RFQ.findOne({ _id: id, isDeleted: false })
    .populate('vendors', 'name email vendorCode rating')
    .populate('createdBy', 'name email');
  if (!rfq) throw new AppError('RFQ not found', 404);
  return rfq;
};

const createRFQ = async (data, user) => {
  data.rfqNumber = await generateRFQNumber();
  data.createdBy = user._id;
  data.status = data.status || 'draft';
  const rfq = await RFQ.create(data);
  await logActivity({ user, action: 'Created RFQ', target: rfq.rfqNumber, targetId: rfq._id, type: 'rfq' });
  return rfq;
};

const updateRFQ = async (id, data, user) => {
  const rfq = await RFQ.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true, runValidators: true });
  if (!rfq) throw new AppError('RFQ not found', 404);
  await logActivity({ user, action: 'Updated RFQ', target: rfq.rfqNumber, targetId: rfq._id, type: 'rfq' });
  return rfq;
};

const deleteRFQ = async (id, user) => {
  const rfq = await RFQ.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true });
  if (!rfq) throw new AppError('RFQ not found', 404);
  await logActivity({ user, action: 'Deleted RFQ', target: rfq.rfqNumber, targetId: rfq._id, type: 'rfq' });
  return rfq;
};

const publishRFQ = async (id, user) => {
  const rfq = await getRFQById(id);
  rfq.status = 'open';
  rfq.publishedAt = new Date();
  await rfq.save();

  const vendors = await Vendor.find({ _id: { $in: rfq.vendors } });
  for (const vendor of vendors) {
    await sendRFQInvitation(vendor.email, rfq.title, rfq.rfqNumber);
    if (vendor.user) {
      await createNotification({
        userId: vendor.user,
        title: 'New RFQ Invitation',
        message: `You are invited to quote on ${rfq.rfqNumber}`,
        type: 'info',
        link: `/quotations/submit?rfq=${rfq._id}`,
      });
    }
  }

  await logActivity({ user, action: 'Published RFQ', target: rfq.rfqNumber, targetId: rfq._id, type: 'rfq' });
  return rfq;
};

const saveDraft = async (id, data, user) => {
  data.status = 'draft';
  return updateRFQ(id, data, user);
};

const assignVendors = async (id, vendorIds, user) => {
  return updateRFQ(id, { vendors: vendorIds }, user);
};

const addAttachment = async (id, file, user) => {
  const rfq = await getRFQById(id);
  rfq.attachments.push({
    originalName: file.originalname,
    fileName: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    size: file.size,
    uploadedBy: user._id,
  });
  await rfq.save();
  await logActivity({ user, action: 'Uploaded RFQ attachment', target: rfq.rfqNumber, targetId: rfq._id, type: 'rfq' });
  return rfq;
};

const getAttachment = async (rfqId, attachmentId) => {
  const rfq = await getRFQById(rfqId);
  const attachment = rfq.attachments.id(attachmentId);
  if (!attachment) throw new AppError('Attachment not found', 404);
  return { rfq, attachment };
};

const deleteAttachment = async (rfqId, attachmentId, user) => {
  const { rfq, attachment } = await getAttachment(rfqId, attachmentId);
  rfq.attachments.pull(attachmentId);
  await rfq.save();
  await logActivity({ user, action: 'Deleted RFQ attachment', target: attachment.originalName, targetId: rfq._id, type: 'rfq' });
  return rfq;
};

module.exports = {
  getRFQs, getRFQById, createRFQ, updateRFQ, deleteRFQ,
  publishRFQ, saveDraft, assignVendors, addAttachment, getAttachment, deleteAttachment,
};
