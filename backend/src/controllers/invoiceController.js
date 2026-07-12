const path = require('path');
const { ApiResponse } = require('../utils/ApiResponse');
const invoiceService = require('../services/invoiceService');

exports.getInvoices = async (req, res, next) => {
  try {
    const data = await invoiceService.getInvoices(req.query, req.user);
    ApiResponse.paginated(res, data.invoices, data.pagination);
  } catch (e) { next(e); }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    ApiResponse.success(res, { invoice });
  } catch (e) { next(e); }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body.poId || req.params.poId, req.user);
    ApiResponse.created(res, { invoice });
  } catch (e) { next(e); }
};

exports.markPaid = async (req, res, next) => {
  try {
    const invoice = await invoiceService.markInvoicePaid(req.params.id, req.user);
    ApiResponse.success(res, { invoice }, 'Invoice marked as paid');
  } catch (e) { next(e); }
};

exports.emailInvoice = async (req, res, next) => {
  try {
    const { invoice, emailSent, emailMock } = await invoiceService.emailInvoice(req.params.id, req.user);
    const message = emailSent
      ? 'Invoice emailed successfully'
      : 'Invoice recorded — email logged to server (SMTP not configured or failed)';
    ApiResponse.success(res, { invoice, emailSent, emailMock }, message);
  } catch (e) { next(e); }
};

exports.downloadPDF = async (req, res, next) => {
  try {
    const pdfPath = await invoiceService.getInvoicePDF(req.params.id);
    res.download(pdfPath, path.basename(pdfPath));
  } catch (e) { next(e); }
};

exports.printInvoice = async (req, res, next) => {
  try {
    const pdfPath = await invoiceService.getInvoicePDF(req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(path.resolve(pdfPath));
  } catch (e) { next(e); }
};
