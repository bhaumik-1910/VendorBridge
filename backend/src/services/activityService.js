const { ActivityLog, AuditLog } = require('../models');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const getActivityLogs = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.type) filter.type = query.type;
  if (query.userId) filter.user = query.userId;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }
  if (query.search) {
    filter.$or = [
      { action: new RegExp(query.search, 'i') },
      { target: new RegExp(query.search, 'i') },
      { userName: new RegExp(query.search, 'i') },
    ];
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter).populate('user', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(limit),
    ActivityLog.countDocuments(filter),
  ]);
  return { logs, pagination: buildPaginationMeta(total, page, limit) };
};

const getAuditLogs = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.resource) filter.resource = query.resource;
  if (query.action) filter.action = query.action;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    AuditLog.countDocuments(filter),
  ]);
  return { logs, pagination: buildPaginationMeta(total, page, limit) };
};

module.exports = { getActivityLogs, getAuditLogs };
