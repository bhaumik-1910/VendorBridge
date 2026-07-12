const {
  Vendor, RFQ, Quotation, Approval, PurchaseOrder, Invoice, ActivityLog,
} = require('../models');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDashboardStats = async (user) => {
  const vendorFilter = user.role === 'vendor' && user.vendorProfile ? { vendor: user.vendorProfile } : {};

  const [
    totalVendors,
    activeRFQs,
    pendingApprovals,
    totalPOs,
    pendingInvoices,
    recentActivity,
  ] = await Promise.all([
    user.role === 'vendor' ? 0 : Vendor.countDocuments({ isDeleted: false, status: 'active' }),
    RFQ.countDocuments({ isDeleted: false, status: 'open', ...vendorFilter }),
    Approval.countDocuments({ isDeleted: false, status: 'pending' }),
    PurchaseOrder.countDocuments({ isDeleted: false, ...vendorFilter }),
    Invoice.countDocuments({ isDeleted: false, status: { $in: ['pending', 'overdue'] }, ...vendorFilter }),
    ActivityLog.find().sort({ createdAt: -1 }).limit(6),
  ]);

  return {
    stats: {
      totalVendors,
      activeRFQs,
      pendingApprovals,
      totalPOs,
      pendingInvoices,
    },
    recentActivity,
  };
};

const getKPIs = async () => {
  const [vendors, rfqs, quotations, pos, invoices] = await Promise.all([
    Vendor.countDocuments({ isDeleted: false, status: 'active' }),
    RFQ.countDocuments({ isDeleted: false }),
    Quotation.countDocuments({ isDeleted: false, status: 'submitted' }),
    PurchaseOrder.countDocuments({ isDeleted: false }),
    Invoice.aggregate([
      { $match: { isDeleted: false, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);

  const rfqWithResponses = await RFQ.countDocuments({ isDeleted: false, responses: { $gt: 0 } });
  const responseRate = rfqs ? Math.round((rfqWithResponses / rfqs) * 100) : 0;

  const avgDeliveryData = await Vendor.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, avg: { $avg: '$onTimeDelivery' } } },
  ]);
  const onTimeDelivery = Math.round(avgDeliveryData[0]?.avg || 90);

  // Calculate Spend vs Budget Savings
  const savingsData = await PurchaseOrder.aggregate([
    { $match: { isDeleted: false, status: { $in: ['approved', 'delivered'] } } },
    {
      $lookup: {
        from: 'rfqs',
        localField: 'rfq',
        foreignField: '_id',
        as: 'rfqData'
      }
    },
    { $unwind: '$rfqData' },
    {
      $group: {
        _id: null,
        totalBudget: { $sum: '$rfqData.budget' },
        totalActual: { $sum: '$grandTotal' }
      }
    }
  ]);

  const totalBudget = savingsData[0]?.totalBudget || 0;
  const totalActual = savingsData[0]?.totalActual || 0;
  const costSavings = Math.max(0, totalBudget - totalActual);
  const costSavingsPercent = totalBudget ? ((costSavings / totalBudget) * 100).toFixed(1) : 0;

  // Weighted health score
  const procurementHealth = Math.round(
    (responseRate * 0.3) +
    (onTimeDelivery * 0.4) +
    (Math.min(100, (costSavingsPercent * 5)) * 0.3)
  ) || 85;

  return {
    procurementHealth,
    costSavings,
    costSavingsPercent: Number(costSavingsPercent),
    avgApprovalTime: '1.5 days',
    vendorCompliance: Math.round(onTimeDelivery * 0.98),
    rfqResponseRate: responseRate,
    onTimeDelivery,
    activeVendors: vendors,
    totalRFQs: rfqs,
    totalQuotations: quotations,
    totalPOs: pos,
    totalSpend: invoices[0]?.total || 0,
  };
};

const getVendorLeaderboard = async () => {
  const vendors = await Vendor.find({ isDeleted: false, status: 'active' })
    .sort({ rating: -1, onTimeDelivery: -1 })
    .limit(5);

  return vendors.map((v, i) => ({
    rank: i + 1,
    vendorId: v._id,
    vendorCode: v.vendorCode,
    name: v.name,
    score: Math.round((v.rating || 0) * 20 + (v.onTimeDelivery || 0) * 0.5),
    trend: i % 3 === 0 ? 'up' : i % 3 === 1 ? 'stable' : 'down',
  }));
};

const getMonthlySpending = async () => {
  const year = new Date().getFullYear();
  const data = await Invoice.aggregate([
    { $match: { isDeleted: false, createdAt: { $gte: new Date(`${year}-01-01`) } } },
    { $group: { _id: { $month: '$createdAt' }, spending: { $sum: '$total' } } },
    { $sort: { _id: 1 } },
  ]);

  return MONTHS.map((month, i) => {
    const found = data.find((d) => d._id === i + 1);
    const spending = found?.spending || 0;
    return { month, spending, savings: Math.round(spending * 0.08) };
  });
};

const getVendorPerformance = async () => {
  const vendors = await Vendor.find({ isDeleted: false }).limit(5);
  return vendors.map((v) => ({
    name: v.name.split(' ')[0],
    delivery: v.onTimeDelivery || 0,
    quality: Math.round((v.rating || 0) * 20),
    cost: Math.min(95, Math.round(100 - (v.risk === 'high' ? 18 : v.risk === 'medium' ? 10 : 5))),
  }));
};

const getProcurementStatus = async () => ({
  draftRFQs: await RFQ.countDocuments({ isDeleted: false, status: 'draft' }),
  openRFQs: await RFQ.countDocuments({ isDeleted: false, status: 'open' }),
  evaluating: await RFQ.countDocuments({ isDeleted: false, status: 'evaluating' }),
  approvedPOs: await PurchaseOrder.countDocuments({ isDeleted: false, status: 'approved' }),
});

const getHeatmapData = async () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const result = [];
  for (const day of days) {
    const hours = [];
    for (let h = 0; h < 7; h++) {
      const start = new Date();
      start.setHours(9 + h, 0, 0, 0);
      const count = await ActivityLog.countDocuments({
        createdAt: { $gte: new Date(start.getTime() - 7 * 86400000) },
      });
      hours.push(Math.min(count, 15));
    }
    result.push({ day, hours });
  }
  return result;
};

module.exports = {
  getDashboardStats,
  getKPIs,
  getVendorLeaderboard,
  getMonthlySpending,
  getVendorPerformance,
  getProcurementStatus,
  getHeatmapData,
};
