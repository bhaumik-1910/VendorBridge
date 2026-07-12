const mongoose = require('mongoose');
const { QUOTATION_STATUS } = require('../config/constants');

const lineItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    filePath: String,
    mimeType: String,
    size: Number,
  },
  { _id: true }
);

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: { type: String, unique: true, trim: true },
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    unitPrice: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 0 },
    deliveryDays: { type: Number, required: true, min: 1 },
    notes: { type: String, trim: true },
    lineItems: [lineItemSchema],
    attachments: [attachmentSchema],
    status: { type: String, enum: QUOTATION_STATUS, default: 'draft' },
    recommended: { type: Boolean, default: false },
    submittedAt: Date,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

quotationSchema.index({ rfq: 1, vendor: 1 });
quotationSchema.index({ status: 1, price: 1 });
quotationSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Quotation', quotationSchema);
