const { ApiResponse } = require('../utils/ApiResponse');
const dashboardService = require('../services/dashboardService');

exports.getStats = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardStats(req.user);
    ApiResponse.success(res, data);
  } catch (e) { next(e); }
};

exports.getKPIs = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getKPIs();
    ApiResponse.success(res, { kpis });
  } catch (e) { next(e); }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await dashboardService.getVendorLeaderboard();
    ApiResponse.success(res, { leaderboard });
  } catch (e) { next(e); }
};

exports.getMonthlySpending = async (req, res, next) => {
  try {
    const monthlySpending = await dashboardService.getMonthlySpending();
    ApiResponse.success(res, { monthlySpending });
  } catch (e) { next(e); }
};

exports.getVendorPerformance = async (req, res, next) => {
  try {
    const vendorPerformance = await dashboardService.getVendorPerformance();
    ApiResponse.success(res, { vendorPerformance });
  } catch (e) { next(e); }
};

exports.getProcurementStatus = async (req, res, next) => {
  try {
    const status = await dashboardService.getProcurementStatus();
    ApiResponse.success(res, { status });
  } catch (e) { next(e); }
};

exports.getHeatmap = async (req, res, next) => {
  try {
    const heatmapData = await dashboardService.getHeatmapData();
    ApiResponse.success(res, { heatmapData });
  } catch (e) { next(e); }
};

exports.getFullDashboard = async (req, res, next) => {
  try {
    const [stats, kpis, leaderboard, monthlySpending, vendorPerformance, status, heatmapData] = await Promise.all([
      dashboardService.getDashboardStats(req.user),
      dashboardService.getKPIs(),
      dashboardService.getVendorLeaderboard(),
      dashboardService.getMonthlySpending(),
      dashboardService.getVendorPerformance(),
      dashboardService.getProcurementStatus(),
      dashboardService.getHeatmapData(),
    ]);
    ApiResponse.success(res, { ...stats, kpis, leaderboard, monthlySpending, vendorPerformance, status, heatmapData });
  } catch (e) { next(e); }
};
