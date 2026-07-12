const mongoose = require('mongoose');
const { RFQ_STATUS } = require('../config/constants');

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    filePath: String,
    mimeType: String,
    size: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const rfqSchema = new mongoose.Schema(
  {
    rfqNumber: { type: String, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'units' },
    category: { type: String, trim: true },
    budget: { type: Number, default: 0 },
    status: { type: String, enum: RFQ_STATUS, default: 'draft' },
    deadline: { type: Date, required: true },
    vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
    attachments: [attachmentSchema],
    responses: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: Date,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

rfqSchema.index({ title: 'text', rfqNumber: 'text', description: 'text' });
rfqSchema.index({ status: 1, deadline: 1, category: 1 });
rfqSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('RFQ', rfqSchema);
