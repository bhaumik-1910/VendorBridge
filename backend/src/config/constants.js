const ROLES = {
  ADMIN: 'admin',
  PROCUREMENT: 'procurement',
  VENDOR: 'vendor',
  MANAGER: 'manager',
};

const ROLE_LABELS = {
  admin: 'Admin',
  procurement: 'Procurement Officer',
  vendor: 'Vendor',
  manager: 'Manager / Approver',
};

const VENDOR_STATUS = ['active', 'pending', 'inactive'];
const VENDOR_RISK = ['low', 'medium', 'high'];
const RFQ_STATUS = ['draft', 'open', 'closed', 'evaluating'];
const QUOTATION_STATUS = ['draft', 'submitted', 'approved', 'rejected'];
const APPROVAL_STATUS = ['pending', 'approved', 'rejected'];
const APPROVAL_TYPES = ['purchase_order', 'rfq', 'vendor', 'quotation'];
const PO_STATUS = ['pending', 'approved', 'in_transit', 'delivered', 'cancelled'];
const INVOICE_STATUS = ['pending', 'paid', 'overdue', 'cancelled'];
const NOTIFICATION_TYPES = ['info', 'warning', 'alert', 'success'];
const ACTIVITY_TYPES = ['rfq', 'quotation', 'approval', 'vendor', 'invoice', 'system', 'purchase_order'];

module.exports = {
  ROLES,
  ROLE_LABELS,
  VENDOR_STATUS,
  VENDOR_RISK,
  RFQ_STATUS,
  QUOTATION_STATUS,
  APPROVAL_STATUS,
  APPROVAL_TYPES,
  PO_STATUS,
  INVOICE_STATUS,
  NOTIFICATION_TYPES,
  ACTIVITY_TYPES,
};
