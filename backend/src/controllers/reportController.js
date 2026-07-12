const { ApiResponse } = require('../utils/ApiResponse');
const reportService = require('../services/reportService');

exports.getSpendingReport = async (req, res, next) => {
  try {
    const report = await reportService.getSpendingReport(req.query.from, req.query.to);
    ApiResponse.success(res, { report });
  } catch (e) { next(e); }
};

exports.getVendorPerformance = async (req, res, next) => {
  try {
    const report = await reportService.getVendorPerformanceReport();
    ApiResponse.success(res, { report });
  } catch (e) { next(e); }
};

exports.getGrowthReport = async (req, res, next) => {
  try {
    const report = await reportService.getProcurementGrowthReport();
    ApiResponse.success(res, { report });
  } catch (e) { next(e); }
};

exports.getMonthlyReport = async (req, res, next) => {
  try {
    const report = await reportService.getMonthlyReport();
    ApiResponse.success(res, { report });
  } catch (e) { next(e); }
};

exports.exportReport = async (req, res, next) => {
  try {
    const data = await reportService.exportReportData(req.params.type || req.query.type);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=report-${req.params.type || 'monthly'}.json`);
    res.send(JSON.stringify({ success: true, data }, null, 2));
  } catch (e) { next(e); }
};

exports.getFullReports = async (req, res, next) => {
  try {
    const [spending, vendorPerformance, growth, monthly] = await Promise.all([
      reportService.getSpendingReport(),
      reportService.getVendorPerformanceReport(),
      reportService.getProcurementGrowthReport(),
      reportService.getMonthlyReport(),
    ]);
    ApiResponse.success(res, { spending, vendorPerformance, growth, monthly });
  } catch (e) { next(e); }
};
