const express = require('express');
const userController = require('../controllers/userController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/role', userController.updateRole);

module.exports = router;
