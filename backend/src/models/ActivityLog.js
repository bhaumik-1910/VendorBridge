const mongoose = require('mongoose');
const { ACTIVITY_TYPES } = require('../config/constants');

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    action: { type: String, required: true },
    target: String,
    targetId: mongoose.Schema.Types.ObjectId,
    type: { type: String, enum: ACTIVITY_TYPES, default: 'system' },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

activityLogSchema.index({ type: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
