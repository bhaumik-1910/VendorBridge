const path = require('path');
const fs = require('fs');
const { Invoice, PurchaseOrder } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const logActivity = require('../helpers/activityLogger');
const { createNotification } = require('../helpers/notificationHelper');
const { sendInvoiceEmail } = require('../utils/emailService');
const { generateInvoicePDF } = require('../utils/pdfService');

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Invoice.countDocuments();
  return `INV-${year}-${String(count + 1200).padStart(4, '0')}`;
};

const getInvoices = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  if (query.status) filter.status = query.status;
  if (user.role === 'vendor' && user.vendorProfile) filter.vendor = user.vendorProfile;

  const [invoices, total] = await Promise.all([
    Invoice.find(filter)
      .populate('vendor', 'name email gst')
      .populate('purchaseOrder', 'poNumber items')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit),
    Invoice.countDocuments(filter),
  ]);
  return { invoices, pagination: buildPaginationMeta(total, page, limit) };
};

const getInvoiceById = async (id) => {
  const invoice = await Invoice.findOne({ _id: id, isDeleted: false })
    .populate('vendor').populate('purchaseOrder');
  if (!invoice) throw new AppError('Invoice not found', 404);
  return invoice;
};

const createInvoice = async (poId, user) => {
  const po = await PurchaseOrder.findOne({ _id: poId, isDeleted: false }).populate('vendor');
  if (!po) throw new AppError('Purchase order not found', 404);

  const existing = await Invoice.findOne({ purchaseOrder: poId, isDeleted: false });
  if (existing) throw new AppError('Invoice already exists for this PO', 409);

  const invoiceNumber = await generateInvoiceNumber();
  const due = new Date(Date.now() + 30 * 86400000);

  const invoice = await Invoice.create({
    invoiceNumber,
    purchaseOrder: po._id,
    vendor: po.vendor._id,
    amount: po.subtotal,
    tax: po.taxTotal,
    total: po.grandTotal,
    due,
    createdBy: user._id,
  });

  const pdfName = `${invoiceNumber}.pdf`;
  const pdfPath = await generateInvoicePDF(invoice, po.vendor, po, pdfName);
  invoice.pdfPath = pdfPath;
  await invoice.save();

  await logActivity({ user, action: 'Generated Invoice', target: invoiceNumber, targetId: invoice._id, type: 'invoice' });
  return invoice;
};

const markInvoicePaid = async (id, user) => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { status: 'paid', paid: new Date() },
    { new: true }
  );
  if (!invoice) throw new AppError('Invoice not found', 404);
  await logActivity({ user, action: 'Processed Payment', target: invoice.invoiceNumber, targetId: invoice._id, type: 'invoice' });
  return invoice;
};

const emailInvoice = async (id, user) => {
  const invoice = await getInvoiceById(id);
  const result = await sendInvoiceEmail(invoice.vendor.email, invoice.invoiceNumber, invoice.total.toFixed(2));
  await logActivity({ user, action: 'Sent Invoice Email', target: invoice.invoiceNumber, targetId: invoice._id, type: 'invoice' });
  return { invoice, emailSent: result.sent, emailMock: result.mock };
};

const getInvoicePDF = async (id) => {
  const invoice = await getInvoiceById(id);
  if (!invoice.pdfPath || !fs.existsSync(invoice.pdfPath)) {
    const po = await PurchaseOrder.findById(invoice.purchaseOrder);
    const pdfName = `${invoice.invoiceNumber}.pdf`;
    invoice.pdfPath = await generateInvoicePDF(invoice, invoice.vendor, po, pdfName);
    await invoice.save();
  }
  return invoice.pdfPath;
};

module.exports = {
  getInvoices, getInvoiceById, createInvoice, markInvoicePaid, emailInvoice, getInvoicePDF,
};
