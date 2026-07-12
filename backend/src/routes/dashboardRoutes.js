const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const protect = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', dashboardController.getFullDashboard);
router.get('/stats', dashboardController.getStats);
router.get('/kpis', dashboardController.getKPIs);
router.get('/leaderboard', dashboardController.getLeaderboard);
router.get('/spending', dashboardController.getMonthlySpending);
router.get('/vendor-performance', dashboardController.getVendorPerformance);
router.get('/procurement-status', dashboardController.getProcurementStatus);
router.get('/heatmap', dashboardController.getHeatmap);

module.exports = router;
