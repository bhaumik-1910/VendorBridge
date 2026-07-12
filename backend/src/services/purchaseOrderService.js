const { PurchaseOrder, Quotation, Vendor } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const logActivity = require('../helpers/activityLogger');
const { createNotification } = require('../helpers/notificationHelper');
const { sendPONotification } = require('../utils/emailService');

const calcTotals = (items) => {
  let subtotal = 0;
  let taxTotal = 0;
  items.forEach((item) => {
    const line = item.qty * item.unitPrice;
    subtotal += line;
    taxTotal += (line * (item.tax || 0)) / 100;
  });
  return { subtotal, taxTotal, grandTotal: subtotal + taxTotal };
};

const generatePONumber = async () => {
  const year = new Date().getFullYear();
  const count = await PurchaseOrder.countDocuments();
  return `PO-${year}-${String(count + 891).padStart(4, '0')}`;
};

const getPurchaseOrders = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  if (query.status) filter.status = query.status;
  if (user.role === 'vendor' && user.vendorProfile) filter.vendor = user.vendorProfile;

  const [orders, total] = await Promise.all([
    PurchaseOrder.find(filter)
      .populate('vendor', 'name email vendorCode')
      .populate('rfq', 'rfqNumber title')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit),
    PurchaseOrder.countDocuments(filter),
  ]);
  return { orders, pagination: buildPaginationMeta(total, page, limit) };
};

const getPOById = async (id) => {
  const po = await PurchaseOrder.findOne({ _id: id, isDeleted: false })
    .populate('vendor').populate('rfq').populate('quotation').populate('approvedBy', 'name');
  if (!po) throw new AppError('Purchase order not found', 404);
  return po;
};

const createPO = async (data, user) => {
  data.poNumber = await generatePONumber();
  data.createdBy = user._id;
  const totals = calcTotals(data.items);
  Object.assign(data, totals);

  const po = await PurchaseOrder.create(data);
  const vendor = await Vendor.findById(po.vendor);

  if (vendor?.email) await sendPONotification(vendor.email, po.poNumber);
  if (vendor?.user) {
    await createNotification({
      userId: vendor.user,
      title: 'New Purchase Order',
      message: `PO ${po.poNumber} has been issued`,
      type: 'info',
      link: '/purchase-orders',
    });
  }

  await logActivity({ user, action: 'Created PO', target: po.poNumber, targetId: po._id, type: 'purchase_order' });
  return po;
};

const createPOFromQuotation = async (quotationId, user) => {
  const quotation = await Quotation.findById(quotationId).populate('rfq');
  if (!quotation) throw new AppError('Quotation not found', 404);

  const items = quotation.lineItems?.length
    ? quotation.lineItems.map((i) => ({ ...i.toObject(), tax: 18 }))
    : [{ name: quotation.rfq?.title || 'Procurement Item', qty: quotation.rfq?.quantity || 1, unitPrice: quotation.price, tax: 18 }];

  return createPO({
    vendor: quotation.vendor,
    rfq: quotation.rfq?._id,
    quotation: quotation._id,
    items,
    status: 'pending',
    deliveryDate: new Date(Date.now() + quotation.deliveryDays * 86400000),
  }, user);
};

const updatePO = async (id, data, user) => {
  if (data.items) Object.assign(data, calcTotals(data.items));
  const po = await PurchaseOrder.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true, runValidators: true });
  if (!po) throw new AppError('Purchase order not found', 404);
  await logActivity({ user, action: 'Updated PO', target: po.poNumber, targetId: po._id, type: 'purchase_order' });
  return po;
};

const updatePOStatus = async (id, status, user) => {
  const data = { status };
  if (status === 'approved') data.approvedBy = user._id;
  return updatePO(id, data, user);
};

module.exports = {
  getPurchaseOrders, getPOById, createPO, createPOFromQuotation, updatePO, updatePOStatus,
};
