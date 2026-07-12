const mongoose = require('mongoose');

const User = require('./User');
const Vendor = require('./Vendor');
const VendorCategory = require('./VendorCategory');
const RFQ = require('./RFQ');
const Quotation = require('./Quotation');
const Approval = require('./Approval');
const PurchaseOrder = require('./PurchaseOrder');
const Invoice = require('./Invoice');
const Notification = require('./Notification');
const ActivityLog = require('./ActivityLog');
const AuditLog = require('./AuditLog');

module.exports = {
  User,
  Vendor,
  VendorCategory,
  RFQ,
  Quotation,
  Approval,
  PurchaseOrder,
  Invoice,
  Notification,
  ActivityLog,
  AuditLog,
};
