const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();
router.use(protect);

router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoice);
router.get('/:id/pdf', invoiceController.downloadPDF);
router.get('/:id/print', invoiceController.printInvoice);
router.post('/', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), invoiceController.createInvoice);
router.post('/from-po/:poId', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), invoiceController.createInvoice);
router.patch('/:id/paid', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), invoiceController.markPaid);
router.post('/:id/email', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), invoiceController.emailInvoice);

module.exports = router;
