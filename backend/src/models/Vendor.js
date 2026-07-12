const mongoose = require('mongoose');
const { VENDOR_STATUS, VENDOR_RISK } = require('../config/constants');

const documentSchema = new mongoose.Schema(
  {
    name: String,
    fileName: String,
    filePath: String,
    mimeType: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const vendorSchema = new mongoose.Schema(
  {
    vendorCode: { type: String, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorCategory' },
    status: { type: String, enum: VENDOR_STATUS, default: 'pending' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    risk: { type: String, enum: VENDOR_RISK, default: 'low' },
    gst: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    totalOrders: { type: Number, default: 0 },
    onTimeDelivery: { type: Number, default: 0, min: 0, max: 100 },
    spend: { type: Number, default: 0 },
    joined: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    documents: [documentSchema],
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

vendorSchema.index({ name: 'text', email: 'text', category: 'text' });
vendorSchema.index({ status: 1, risk: 1, category: 1 });
vendorSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
