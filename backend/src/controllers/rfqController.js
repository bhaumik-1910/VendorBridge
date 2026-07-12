const { ApiResponse } = require('../utils/ApiResponse');
const rfqService = require('../services/rfqService');

exports.getRFQs = async (req, res, next) => {
  try {
    const data = await rfqService.getRFQs(req.query, req.user);
    ApiResponse.paginated(res, data.rfqs, data.pagination);
  } catch (e) { next(e); }
};

exports.getRFQ = async (req, res, next) => {
  try {
    const rfq = await rfqService.getRFQById(req.params.id);
    ApiResponse.success(res, { rfq });
  } catch (e) { next(e); }
};

exports.createRFQ = async (req, res, next) => {
  try {
    const rfq = await rfqService.createRFQ(req.body, req.user);
    ApiResponse.created(res, { rfq });
  } catch (e) { next(e); }
};

exports.updateRFQ = async (req, res, next) => {
  try {
    const rfq = await rfqService.updateRFQ(req.params.id, req.body, req.user);
    ApiResponse.success(res, { rfq }, 'RFQ updated');
  } catch (e) { next(e); }
};

exports.deleteRFQ = async (req, res, next) => {
  try {
    await rfqService.deleteRFQ(req.params.id, req.user);
    ApiResponse.success(res, null, 'RFQ deleted');
  } catch (e) { next(e); }
};

exports.publishRFQ = async (req, res, next) => {
  try {
    const rfq = await rfqService.publishRFQ(req.params.id, req.user);
    ApiResponse.success(res, { rfq }, 'RFQ published');
  } catch (e) { next(e); }
};

exports.saveDraft = async (req, res, next) => {
  try {
    const rfq = await rfqService.saveDraft(req.params.id, req.body, req.user);
    ApiResponse.success(res, { rfq }, 'Draft saved');
  } catch (e) { next(e); }
};

exports.assignVendors = async (req, res, next) => {
  try {
    const vendorIds = req.body.vendorIds || req.body.vendors || [];
    const rfq = await rfqService.assignVendors(req.params.id, vendorIds, req.user);
    ApiResponse.success(res, { rfq }, 'Vendors assigned');
  } catch (e) { next(e); }
};

exports.uploadAttachment = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'No file uploaded', 400);
    const rfq = await rfqService.addAttachment(req.params.id, req.file, req.user);
    ApiResponse.success(res, { rfq }, 'Attachment uploaded');
  } catch (e) { next(e); }
};

exports.downloadAttachment = async (req, res, next) => {
  try {
    const { attachment } = await rfqService.getAttachment(req.params.id, req.params.attachmentId);
    return res.download(attachment.filePath, attachment.originalName);
  } catch (e) { next(e); }
};

exports.deleteAttachment = async (req, res, next) => {
  try {
    const rfq = await rfqService.deleteAttachment(req.params.id, req.params.attachmentId, req.user);
    ApiResponse.success(res, { rfq }, 'Attachment deleted');
  } catch (e) { next(e); }
};
