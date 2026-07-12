const mongoose = require('mongoose');
const { INVOICE_STATUS } = require('../config/constants');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, trim: true },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amount: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: INVOICE_STATUS, default: 'pending' },
    issued: { type: Date, default: Date.now },
    due: { type: Date, required: true },
    paid: Date,
    pdfPath: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 'text', status: 1 });
invoiceSchema.index({ vendor: 1, isDeleted: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
