const mongoose = require('mongoose');
const { PO_STATUS } = require('../config/constants');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: true }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: { type: String, unique: true, trim: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
    status: { type: String, enum: PO_STATUS, default: 'pending' },
    items: [itemSchema],
    subtotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    deliveryDate: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

purchaseOrderSchema.index({ poNumber: 'text', status: 1 });
purchaseOrderSchema.index({ vendor: 1, isDeleted: 1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
