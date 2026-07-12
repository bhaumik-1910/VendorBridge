const { Approval, User } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const logActivity = require('../helpers/activityLogger');
const { createNotification } = require('../helpers/notificationHelper');
const { sendApprovalRequest } = require('../utils/emailService');

const generateApprovalNumber = async () => {
  const count = await Approval.countDocuments();
  return `APR-${String(count + 1).padStart(3, '0')}`;
};

const getApprovals = async (query, user) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;
  if (user.role === 'manager') filter.status = query.status || 'pending';

  const [approvals, total] = await Promise.all([
    Approval.find(filter)
      .populate('requester', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit),
    Approval.countDocuments(filter),
  ]);
  return { approvals, pagination: buildPaginationMeta(total, page, limit) };
};

const getApprovalById = async (id) => {
  const approval = await Approval.findOne({ _id: id, isDeleted: false }).populate('requester', 'name email');
  if (!approval) throw new AppError('Approval not found', 404);
  return approval;
};

const createApproval = async (data, user) => {
  data.approvalNumber = await generateApprovalNumber();
  data.requester = user._id;
  const approval = await Approval.create(data);

  const pendingStep = approval.steps.find((s) => s.status === 'pending');
  if (pendingStep?.approver) {
    const approver = await User.findById(pendingStep.approver);
    if (approver) {
      await sendApprovalRequest(approver.email, approval.title);
      await createNotification({
        userId: approver._id,
        title: 'Approval required',
        message: approval.title,
        type: 'warning',
        link: '/approvals',
      });
    }
  }

  await logActivity({ user, action: 'Created Approval Request', target: approval.approvalNumber, targetId: approval._id, type: 'approval' });
  return approval;
};

const processApproval = async (id, action, comment, user) => {
  const approval = await getApprovalById(id);
  if (approval.status !== 'pending') throw new AppError('Approval already processed', 400);

  const stepIndex = approval.currentStep - 1;
  const step = approval.steps[stepIndex];
  if (!step) throw new AppError('Invalid approval step', 400);

  step.status = action;
  step.comment = comment;
  step.date = new Date();
  step.name = user.name;

  if (action === 'rejected') {
    approval.status = 'rejected';
  } else if (approval.currentStep >= approval.totalSteps) {
    approval.status = 'approved';
  } else {
    approval.currentStep += 1;
    const nextStep = approval.steps[approval.currentStep - 1];
    if (nextStep) nextStep.status = 'pending';
  }

  await approval.save();
  await logActivity({
    user,
    action: action === 'approved' ? 'Approved Request' : 'Rejected Request',
    target: approval.approvalNumber,
    targetId: approval._id,
    type: 'approval',
  });

  return approval;
};

module.exports = { getApprovals, getApprovalById, createApproval, processApproval };
