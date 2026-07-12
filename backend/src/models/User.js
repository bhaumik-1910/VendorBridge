const mongoose = require('mongoose');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    company: { type: String, trim: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.PROCUREMENT },
    avatar: { type: String, default: '' },
    vendorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ isDeleted: 1 });

userSchema.pre('save', function (next) {
  if (!this.avatar && this.name) {
    this.avatar = this.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
