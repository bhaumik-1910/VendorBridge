const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { AppError } = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, buildSort } = require('../utils/pagination');
const { ROLES } = require('../config/constants');

const getUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isDeleted: false };
  if (query.role) filter.role = query.role;
  if (query.search) filter.$or = [
    { name: new RegExp(query.search, 'i') },
    { email: new RegExp(query.search, 'i') },
  ];
  const [users, total] = await Promise.all([
    User.find(filter).select('-password -refreshToken').sort(buildSort(query.sortBy, query.order)).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return { users, pagination: buildPaginationMeta(total, page, limit) };
};

const getUserById = async (id) => {
  const user = await User.findOne({ _id: id, isDeleted: false }).select('-password -refreshToken');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const createUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new AppError('Email already exists', 409);
  data.password = await bcrypt.hash(data.password, 12);
  return User.create(data);
};

const updateUser = async (id, data) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 12);
  const user = await User.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true }).select('-password');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findOneAndUpdate({ _id: id }, { isDeleted: true, isActive: false }, { new: true });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateUserRole = async (id, role) => {
  if (!Object.values(ROLES).includes(role)) throw new AppError('Invalid role', 400);
  return updateUser(id, { role });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, updateUserRole };
