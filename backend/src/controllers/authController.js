const { ApiResponse } = require('../utils/ApiResponse');
const authService = require('../services/authService');

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    ApiResponse.created(res, { user }, 'Account created successfully');
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body.email, req.body.password);
    authService.setTokenCookies(res, accessToken, refreshToken);
    ApiResponse.success(res, { user, accessToken, refreshToken }, 'Login successful');
  } catch (e) { next(e); }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.user._id, res);
    ApiResponse.success(res, null, 'Logged out successfully');
  } catch (e) { next(e); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.body.refreshToken || req.cookies.refreshToken;
    const data = await authService.refreshAccessToken(token);
    authService.setTokenCookies(res, data.accessToken, req.cookies.refreshToken);
    ApiResponse.success(res, data, 'Token refreshed');
  } catch (e) { next(e); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    ApiResponse.success(res, null, 'If that email exists, a reset link was sent');
  } catch (e) { next(e); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    ApiResponse.success(res, null, 'Password reset successful');
  } catch (e) { next(e); }
};

exports.changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);
    ApiResponse.success(res, null, 'Password changed successfully');
  } catch (e) { next(e); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    ApiResponse.success(res, { user });
  } catch (e) { next(e); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    ApiResponse.success(res, { user }, 'Profile updated');
  } catch (e) { next(e); }
};

exports.getMe = async (req, res) => {
  ApiResponse.success(res, { user: authService.sanitizeUser(req.user) });
};
