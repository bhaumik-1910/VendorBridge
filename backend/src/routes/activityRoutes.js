const express = require('express');
const activityController = require('../controllers/activityController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();
router.use(protect);

router.get('/', activityController.getActivityLogs);
router.get('/audit', authorize(ROLES.ADMIN), activityController.getAuditLogs);

module.exports = router;
