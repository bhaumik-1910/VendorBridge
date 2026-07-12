require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const {
  User, Vendor, VendorCategory, RFQ, Quotation, Approval,
  PurchaseOrder, Invoice, Notification, ActivityLog,
} = require('../models');

const seed = async () => {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Vendor.deleteMany({}), VendorCategory.deleteMany({}),
    RFQ.deleteMany({}), Quotation.deleteMany({}), Approval.deleteMany({}),
    PurchaseOrder.deleteMany({}), Invoice.deleteMany({}),
    Notification.deleteMany({}), ActivityLog.deleteMany({}),
  ]);

  const password = await bcrypt.hash('Password@123', 12);

  const categories = await VendorCategory.insertMany([
    { name: 'IT Equipment' }, { name: 'Raw Materials' }, { name: 'Office Supplies' },
    { name: 'Logistics' }, { name: 'Manufacturing' },
  ]);

  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@vendorbridge.com', password, company: 'Acme Corp', role: 'admin', avatar: 'AU' },
    { name: 'Sarah Chen', email: 'sarah.chen@acmecorp.com', password, company: 'Acme Corp', role: 'procurement', avatar: 'SC' },
    { name: 'David Miller', email: 'david.miller@acmecorp.com', password, company: 'Acme Corp', role: 'manager', avatar: 'DM' },
    { name: 'Michael Torres', email: 'contact@techsupply.com', password, company: 'TechSupply Global', role: 'vendor', avatar: 'MT' },
  ]);

  const vendors = await Vendor.insertMany([
    { vendorCode: 'V001', name: 'TechSupply Global', category: 'IT Equipment', status: 'active', rating: 4.8, risk: 'low', gst: '27AABCT1234F1Z5', email: 'contact@techsupply.com', phone: '+1 (555) 234-5678', address: '1200 Innovation Drive, San Jose, CA', contactPerson: 'Michael Torres', totalOrders: 156, onTimeDelivery: 96, spend: 485000, user: users[3]._id },
    { vendorCode: 'V002', name: 'GreenLeaf Materials', category: 'Raw Materials', status: 'active', rating: 4.5, risk: 'low', gst: '29AABCG5678H2Z3', email: 'sales@greenleaf.com', phone: '+1 (555) 345-6789', address: '450 Industrial Park, Portland, OR', contactPerson: 'Lisa Park', totalOrders: 89, onTimeDelivery: 92, spend: 312000 },
    { vendorCode: 'V006', name: 'DataCore Systems', category: 'IT Equipment', status: 'active', rating: 4.9, risk: 'low', gst: '36AABCD1234M6Z2', email: 'enterprise@datacore.com', phone: '+1 (555) 789-0123', address: '1 Cloud Avenue, Seattle, WA', contactPerson: 'Anna Martinez', totalOrders: 112, onTimeDelivery: 98, spend: 620000 },
    { vendorCode: 'V004', name: 'OfficePro Solutions', category: 'Office Supplies', status: 'active', rating: 4.6, risk: 'low', gst: '07AABCO3456K4Z1', email: 'orders@officepro.com', phone: '+1 (555) 567-8901', address: '200 Commerce Blvd, Austin, TX', contactPerson: 'Emma Davis', totalOrders: 234, onTimeDelivery: 94, spend: 89000 },
  ]);

  await User.findByIdAndUpdate(users[3]._id, { vendorProfile: vendors[0]._id });

  const rfqs = await RFQ.insertMany([
    { rfqNumber: 'RFQ-2024-001', title: 'Enterprise Server Infrastructure', description: 'High-performance servers for data center expansion', quantity: 24, unit: 'units', status: 'open', deadline: new Date('2024-12-15'), vendors: [vendors[0]._id, vendors[2]._id], category: 'IT Equipment', budget: 480000, responses: 2, createdBy: users[1]._id, publishedAt: new Date() },
    { rfqNumber: 'RFQ-2024-002', title: 'Office Furniture Bulk Order', description: 'Ergonomic desks and chairs', quantity: 150, unit: 'sets', status: 'draft', deadline: new Date('2024-12-20'), vendors: [vendors[3]._id], category: 'Office Supplies', budget: 75000, createdBy: users[1]._id },
    { rfqNumber: 'RFQ-2024-003', title: 'Raw Steel Sheets — Q1 Supply', description: 'Grade A steel sheets', quantity: 5000, unit: 'kg', status: 'closed', deadline: new Date('2024-11-30'), vendors: [vendors[1]._id], category: 'Raw Materials', budget: 120000, responses: 1, createdBy: users[1]._id },
  ]);

  const quotations = await Quotation.insertMany([
    { quotationNumber: 'QT-001', rfq: rfqs[0]._id, vendor: vendors[0]._id, submittedBy: users[3]._id, price: 465000, deliveryDays: 21, notes: 'Includes 3-year warranty', status: 'submitted', submittedAt: new Date() },
    { quotationNumber: 'QT-002', rfq: rfqs[0]._id, vendor: vendors[2]._id, price: 442000, deliveryDays: 18, notes: 'Free migration support', status: 'submitted', recommended: true, submittedAt: new Date() },
    { quotationNumber: 'QT-003', rfq: rfqs[2]._id, vendor: vendors[1]._id, price: 112000, deliveryDays: 14, notes: 'Bulk discount applied', status: 'approved', recommended: true, submittedAt: new Date() },
  ]);

  const pos = await PurchaseOrder.insertMany([
    { poNumber: 'PO-2024-0892', vendor: vendors[2]._id, rfq: rfqs[0]._id, quotation: quotations[1]._id, status: 'approved', items: [{ name: 'Dell PowerEdge R750', qty: 12, unitPrice: 18500, tax: 18 }, { name: 'Network Switch 48-port', qty: 6, unitPrice: 4200, tax: 18 }], subtotal: 247200, taxTotal: 44496, grandTotal: 291696, deliveryDate: new Date('2024-12-05'), approvedBy: users[2]._id, createdBy: users[1]._id },
    { poNumber: 'PO-2024-0891', vendor: vendors[1]._id, rfq: rfqs[2]._id, quotation: quotations[2]._id, status: 'in_transit', items: [{ name: 'Grade A Steel Sheet 2mm', qty: 5000, unitPrice: 22.4, tax: 12 }], subtotal: 112000, taxTotal: 13440, grandTotal: 125440, deliveryDate: new Date('2024-11-20'), approvedBy: users[1]._id, createdBy: users[1]._id },
  ]);

  await Invoice.insertMany([
    { invoiceNumber: 'INV-2024-1205', purchaseOrder: pos[1]._id, vendor: vendors[1]._id, amount: 112000, tax: 13440, total: 125440, status: 'paid', issued: new Date('2024-11-05'), due: new Date('2024-12-05'), paid: new Date('2024-11-28'), createdBy: users[1]._id },
    { invoiceNumber: 'INV-2024-1204', purchaseOrder: pos[0]._id, vendor: vendors[2]._id, amount: 247200, tax: 44496, total: 291696, status: 'pending', issued: new Date('2024-11-12'), due: new Date('2024-12-12'), createdBy: users[1]._id },
  ]);

  await Approval.insertMany([
    { approvalNumber: 'APR-001', title: 'PO-2024-0892 — DataCore Systems', type: 'purchase_order', referenceId: pos[0]._id, referenceModel: 'PurchaseOrder', amount: 291696, requester: users[1]._id, status: 'pending', currentStep: 2, totalSteps: 3, steps: [
      { role: 'Procurement Officer', name: 'Sarah Chen', status: 'approved', date: new Date(), comment: 'Best value quotation selected' },
      { role: 'Department Manager', name: 'David Miller', status: 'pending' },
      { role: 'Finance Director', name: 'Rachel Green', status: 'waiting' },
    ]},
  ]);

  await Notification.insertMany([
    { user: users[1]._id, title: 'New quotation received', message: 'DataCore Systems submitted a quote for RFQ-2024-001', type: 'info' },
    { user: users[2]._id, title: 'Approval required', message: 'PO-2024-0892 needs your approval', type: 'warning' },
  ]);

  await ActivityLog.insertMany([
    { user: users[1]._id, userName: 'Sarah Chen', action: 'Created RFQ', target: 'RFQ-2024-001', type: 'rfq' },
    { user: users[3]._id, userName: 'Michael Torres', action: 'Submitted Quotation', target: 'QT-001', type: 'quotation' },
  ]);

  console.log('Seed completed!');
  console.log('Login credentials (all use Password@123):');
  console.log('  Admin: admin@vendorbridge.com');
  console.log('  Procurement: sarah.chen@acmecorp.com');
  console.log('  Manager: david.miller@acmecorp.com');
  console.log('  Vendor: contact@techsupply.com');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
