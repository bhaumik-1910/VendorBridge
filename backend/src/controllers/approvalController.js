const { ApiResponse } = require('../utils/ApiResponse');
const approvalService = require('../services/approvalService');

exports.getApprovals = async (req, res, next) => {
  try {
    const data = await approvalService.getApprovals(req.query, req.user);
    ApiResponse.paginated(res, data.approvals, data.pagination);
  } catch (e) { next(e); }
};

exports.getApproval = async (req, res, next) => {
  try {
    const approval = await approvalService.getApprovalById(req.params.id);
    ApiResponse.success(res, { approval });
  } catch (e) { next(e); }
};

exports.createApproval = async (req, res, next) => {
  try {
    const approval = await approvalService.createApproval(req.body, req.user);
    ApiResponse.created(res, { approval });
  } catch (e) { next(e); }
};

exports.approve = async (req, res, next) => {
  try {
    const approval = await approvalService.processApproval(req.params.id, 'approved', req.body.comment, req.user);
    ApiResponse.success(res, { approval }, 'Approved successfully');
  } catch (e) { next(e); }
};

exports.reject = async (req, res, next) => {
  try {
    const approval = await approvalService.processApproval(req.params.id, 'rejected', req.body.comment, req.user);
    ApiResponse.success(res, { approval }, 'Rejected');
  } catch (e) { next(e); }
};
