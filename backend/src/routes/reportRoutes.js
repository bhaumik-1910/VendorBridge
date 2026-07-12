const express = require('express');
const reportController = require('../controllers/reportController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.MANAGER));

router.get('/', reportController.getFullReports);
router.get('/spending', reportController.getSpendingReport);
router.get('/vendor-performance', reportController.getVendorPerformance);
router.get('/growth', reportController.getGrowthReport);
router.get('/monthly', reportController.getMonthlyReport);
router.get('/export/:type', reportController.exportReport);

module.exports = router;
