const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const vendorRoutes = require('./vendorRoutes');
const rfqRoutes = require('./rfqRoutes');
const quotationRoutes = require('./quotationRoutes');
const approvalRoutes = require('./approvalRoutes');
const purchaseOrderRoutes = require('./purchaseOrderRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const notificationRoutes = require('./notificationRoutes');
const activityRoutes = require('./activityRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const reportRoutes = require('./reportRoutes');
const contactRoutes = require('./contactRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'VendorBridge API is running', version: '1.0.0' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vendors', vendorRoutes);
router.use('/rfqs', rfqRoutes);
router.use('/quotations', quotationRoutes);
router.use('/approvals', approvalRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activity', activityRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
