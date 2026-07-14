const { ApiResponse } = require('../utils/ApiResponse');
const quotationService = require('../services/quotationService');

exports.getQuotations = async (req, res, next) => {
  try {
    const data = await quotationService.getQuotations(req.query, req.user);
    ApiResponse.paginated(res, data.quotations, data.pagination);
  } catch (e) { next(e); }
};

exports.getQuotation = async (req, res, next) => {
  try {
    const quotation = await quotationService.getQuotationById(req.params.id);
    ApiResponse.success(res, { quotation });
  } catch (e) { next(e); }
};

exports.submitQuotation = async (req, res, next) => {
  try {
    const quotation = await quotationService.submitQuotation(req.body, req.user);
    ApiResponse.created(res, { quotation }, 'Quotation submitted');
  } catch (e) { next(e); }
};

exports.updateQuotation = async (req, res, next) => {
  try {
    const quotation = await quotationService.updateQuotation(req.params.id, req.body, req.user);
    ApiResponse.success(res, { quotation }, 'Quotation updated');
  } catch (e) { next(e); }
};

const aiService = require('../services/aiAnalysisService');

exports.compareQuotations = async (req, res, next) => {
  try {
    const comparison = await quotationService.compareQuotations(req.params.rfqId);

    // Add AI Insights
    comparison.aiInsights = await aiService.analyzeQuotations(comparison.rfq, comparison.quotations);

    ApiResponse.success(res, comparison);
  } catch (e) { next(e); }
};

exports.selectWinner = async (req, res, next) => {
  try {
    const quotation = await quotationService.selectWinner(req.params.id, req.user);
    ApiResponse.success(res, { quotation }, 'Winning quotation selected');
  } catch (e) { next(e); }
};

exports.uploadAttachment = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'No file uploaded', 400);
    const quotation = await quotationService.addAttachment(req.params.id, req.file, req.user);
    ApiResponse.success(res, { quotation }, 'Attachment uploaded');
  } catch (e) { next(e); }
};

exports.downloadAttachment = async (req, res, next) => {
  try {
    const { attachment } = await quotationService.getAttachment(req.params.id, req.params.attachmentId);
    return res.download(attachment.filePath, attachment.originalName);
  } catch (e) { next(e); }
};
