const express = require('express');
const poController = require('../controllers/purchaseOrderController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();
router.use(protect);

router.get('/', poController.getPOs);
router.get('/:id', poController.getPO);
router.post('/', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), poController.createPO);
router.post('/from-quotation/:quotationId', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), poController.createFromQuotation);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), poController.updatePO);
router.patch('/:id/status', authorize(ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.MANAGER), poController.updateStatus);

module.exports = router;
