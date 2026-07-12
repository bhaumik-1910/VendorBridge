const { ApiResponse } = require('../utils/ApiResponse');
const userService = require('../services/userService');

exports.getUsers = async (req, res, next) => {
  try {
    const data = await userService.getUsers(req.query);
    ApiResponse.paginated(res, data.users, data.pagination);
  } catch (e) { next(e); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    ApiResponse.success(res, { user });
  } catch (e) { next(e); }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    ApiResponse.created(res, { user });
  } catch (e) { next(e); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    ApiResponse.success(res, { user }, 'User updated');
  } catch (e) { next(e); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    ApiResponse.success(res, null, 'User deleted');
  } catch (e) { next(e); }
};

exports.updateRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    ApiResponse.success(res, { user }, 'Role updated');
  } catch (e) { next(e); }
};
