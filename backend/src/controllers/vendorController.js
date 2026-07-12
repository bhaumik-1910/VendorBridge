const { ApiResponse } = require('../utils/ApiResponse');
const vendorService = require('../services/vendorService');

exports.getVendors = async (req, res, next) => {
  try {
    const data = await vendorService.getVendors(req.query);
    ApiResponse.paginated(res, data.vendors, data.pagination);
  } catch (e) { next(e); }
};

exports.getVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    ApiResponse.success(res, { vendor });
  } catch (e) { next(e); }
};

exports.createVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.createVendor(req.body, req.user);
    ApiResponse.created(res, { vendor });
  } catch (e) { next(e); }
};

exports.updateVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.updateVendor(req.params.id, req.body, req.user);
    ApiResponse.success(res, { vendor }, 'Vendor updated');
  } catch (e) { next(e); }
};

exports.deleteVendor = async (req, res, next) => {
  try {
    await vendorService.deleteVendor(req.params.id, req.user);
    ApiResponse.success(res, null, 'Vendor deleted');
  } catch (e) { next(e); }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'No file uploaded', 400);
    const vendor = await vendorService.addVendorDocument(req.params.id, req.file, req.user);
    ApiResponse.success(res, { vendor }, 'Document uploaded');
  } catch (e) { next(e); }
};

exports.downloadDocument = async (req, res, next) => {
  try {
    const { doc } = await vendorService.getVendorDocument(req.params.id, req.params.docId);
    return res.download(doc.filePath, doc.name);
  } catch (e) { next(e); }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const vendor = await vendorService.deleteVendorDocument(req.params.id, req.params.docId, req.user);
    ApiResponse.success(res, { vendor }, 'Document deleted');
  } catch (e) { next(e); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await vendorService.getCategories();
    ApiResponse.success(res, { categories });
  } catch (e) { next(e); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await vendorService.createCategory(req.body);
    ApiResponse.created(res, { category });
  } catch (e) { next(e); }
};
