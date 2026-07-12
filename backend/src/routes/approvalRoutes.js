const express = require('express');
const approvalController = require('../controllers/approvalController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();
router.use(protect);

router.get('/', approvalController.getApprovals);
router.get('/:id', approvalController.getApproval);
router.post('/', authorize(ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.MANAGER), approvalController.createApproval);
router.patch('/:id/approve', authorize(ROLES.ADMIN, ROLES.MANAGER), approvalController.approve);
router.patch('/:id/reject', authorize(ROLES.ADMIN, ROLES.MANAGER), approvalController.reject);

module.exports = router;
