const express = require('express');
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/signup', authValidator.signup, validate, authController.signup);
router.post('/login', authValidator.login, validate, authController.login);
router.post('/forgot-password', authValidator.forgotPassword, validate, authController.forgotPassword);
router.post('/reset-password', authValidator.resetPassword, validate, authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

router.use(protect);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authValidator.changePassword, validate, authController.changePassword);

module.exports = router;
