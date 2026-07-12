const { Vendor, VendorCategory } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, buildSort } = require('../utils/pagination');
const logActivity = require('../helpers/activityLogger');

const generateVendorCode = async () => {
  const count = await Vendor.countDocuments();
  return `V${String(count + 1).padStart(3, '0')}`;
};

const getVendors = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.risk) filter.risk = query.risk;
  if (query.search) filter.$or = [
    { name: new RegExp(query.search, 'i') },
    { email: new RegExp(query.search, 'i') },
    { vendorCode: new RegExp(query.search, 'i') },
    { category: new RegExp(query.search, 'i') },
  ];
  const [vendors, total] = await Promise.all([
    Vendor.find(filter).sort(buildSort(query.sortBy || 'createdAt', query.order)).skip(skip).limit(limit),
    Vendor.countDocuments(filter),
  ]);
  return { vendors, pagination: buildPaginationMeta(total, page, limit) };
};

const getVendorById = async (id) => {
  const vendor = await Vendor.findOne({ _id: id, isDeleted: false });
  if (!vendor) throw new AppError('Vendor not found', 404);
  return vendor;
};

const createVendor = async (data, user) => {
  data.vendorCode = data.vendorCode || (await generateVendorCode());
  data.createdBy = user._id;
  const vendor = await Vendor.create(data);
  await logActivity({ user, action: 'Created Vendor', target: vendor.vendorCode, targetId: vendor._id, type: 'vendor' });
  return vendor;
};

const updateVendor = async (id, data, user) => {
  const vendor = await Vendor.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true, runValidators: true });
  if (!vendor) throw new AppError('Vendor not found', 404);
  await logActivity({ user, action: 'Updated Vendor', target: vendor.vendorCode, targetId: vendor._id, type: 'vendor' });
  return vendor;
};

const deleteVendor = async (id, user) => {
  const vendor = await Vendor.findOneAndUpdate({ _id: id }, { isDeleted: true, status: 'inactive' }, { new: true });
  if (!vendor) throw new AppError('Vendor not found', 404);
  await logActivity({ user, action: 'Deleted Vendor', target: vendor.vendorCode, targetId: vendor._id, type: 'vendor' });
  return vendor;
};

const addVendorDocument = async (id, file, user) => {
  const vendor = await getVendorById(id);
  vendor.documents.push({
    name: file.originalname,
    fileName: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    size: file.size,
  });
  await vendor.save();
  await logActivity({ user, action: 'Uploaded vendor document', target: vendor.vendorCode, targetId: vendor._id, type: 'vendor' });
  return vendor;
};

const getVendorDocument = async (vendorId, docId) => {
  const vendor = await getVendorById(vendorId);
  const doc = vendor.documents.id(docId);
  if (!doc) throw new AppError('Document not found', 404);
  return { vendor, doc };
};

const deleteVendorDocument = async (vendorId, docId, user) => {
  const { vendor, doc } = await getVendorDocument(vendorId, docId);
  vendor.documents.pull(docId);
  await vendor.save();
  await logActivity({ user, action: 'Deleted vendor document', target: doc.name, targetId: vendor._id, type: 'vendor' });
  return vendor;
};

const getCategories = async () => VendorCategory.find({ isDeleted: false, isActive: true });
const createCategory = async (data) => VendorCategory.create(data);

module.exports = {
  getVendors, getVendorById, createVendor, updateVendor, deleteVendor,
  addVendorDocument, getVendorDocument, deleteVendorDocument,
  getCategories, createCategory,
};
