const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { generateResetToken, hashToken } = require('../utils/generateCode');
const { sendPasswordResetEmail } = require('../utils/emailService');
const logActivity = require('../helpers/activityLogger');
const config = require('../config');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  company: user.company,
  role: user.role,
  avatar: user.avatar,
  vendorProfile: user.vendorProfile,
  lastLogin: user.lastLogin,
});

const setTokenCookies = (res, accessToken, refreshToken) => {
  const cookieOpts = {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
  };
  res.cookie('accessToken', accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const signup = async (data) => {
  const exists = await User.findOne({ email: data.email, isDeleted: false });
  if (exists) throw new AppError('Email already registered', 409);

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await User.create({ ...data, password: hashed });

  await logActivity({ user, action: 'Registered account', target: user.email, type: 'system' });
  return sanitizeUser(user);
};

const login = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail, isDeleted: false }).select('+password +refreshToken');

  if (!user) throw new AppError('User does not exist', 401);
  if (!user.isActive) throw new AppError('Account inactive. Contact your administrator.', 403);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid email or password', 401);

  user.lastLogin = new Date();
  const refreshToken = generateRefreshToken({ id: user._id });
  user.refreshToken = refreshToken;
  await user.save();

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  await logActivity({ user, action: 'Logged in', target: user.email, type: 'system' });

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

const logout = async (userId, res) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

const refreshAccessToken = async (refreshToken) => {
  const { verifyRefreshToken } = require('../utils/tokenUtils');
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken) throw new AppError('Invalid refresh token', 401);
  return {
    accessToken: generateAccessToken({ id: user._id, role: user.role }),
    user: sanitizeUser(user),
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase().trim(), isDeleted: false });
  if (!user) return false;

  const { token, hashed } = generateResetToken();
  user.resetPasswordToken = hashed;
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetUrl);
  return true;
};

const resetPassword = async (token, password) => {
  const user = await User.findOne({
    resetPasswordToken: hashToken(token),
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire +password');

  if (!user) throw new AppError('Invalid or expired reset token', 400);
  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return true;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new AppError('Current password is incorrect', 400);
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).populate('vendorProfile');
  if (!user) throw new AppError('User not found', 404);
  return sanitizeUser(user);
};

const updateProfile = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
  return sanitizeUser(user);
};

module.exports = {
  signup,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
  sanitizeUser,
  setTokenCookies,
};
