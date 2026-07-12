const mongoose = require('mongoose');
const { APPROVAL_STATUS, APPROVAL_TYPES } = require('../config/constants');

const stepSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    status: { type: String, enum: ['waiting', 'pending', 'approved', 'rejected'], default: 'waiting' },
    comment: String,
    date: Date,
  },
  { _id: true }
);

const approvalSchema = new mongoose.Schema(
  {
    approvalNumber: { type: String, unique: true, trim: true },
    title: { type: String, required: true },
    type: { type: String, enum: APPROVAL_TYPES, required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    referenceModel: { type: String, required: true },
    amount: { type: Number, default: 0 },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: APPROVAL_STATUS, default: 'pending' },
    currentStep: { type: Number, default: 1 },
    totalSteps: { type: Number, default: 1 },
    steps: [stepSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

approvalSchema.index({ status: 1, type: 1, requester: 1 });
approvalSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Approval', approvalSchema);
