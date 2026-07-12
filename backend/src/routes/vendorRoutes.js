const express = require('express');
const vendorController = require('../controllers/vendorController');
const vendorValidator = require('../validators/vendorValidator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/categories', protect, vendorController.getCategories);
router.post('/categories', protect, authorize(ROLES.ADMIN, ROLES.PROCUREMENT), vendorController.createCategory);

router.get('/', protect, vendorController.getVendors);
router.get('/:id', protect, vendorController.getVendor);
router.post('/', protect, authorize(ROLES.ADMIN, ROLES.PROCUREMENT), vendorValidator.createVendor, validate, vendorController.createVendor);
router.put('/:id', protect, authorize(ROLES.ADMIN, ROLES.PROCUREMENT), vendorValidator.updateVendor, validate, vendorController.updateVendor);
router.delete('/:id', protect, authorize(ROLES.ADMIN), vendorController.deleteVendor);
router.post('/:id/documents', protect, authorize(ROLES.ADMIN, ROLES.PROCUREMENT), (req, res, next) => { req.uploadFolder = 'vendors'; next(); }, upload.single('file'), vendorController.uploadDocument);
router.get('/:id/documents/:docId/download', protect, vendorController.downloadDocument);
router.delete('/:id/documents/:docId', protect, authorize(ROLES.ADMIN, ROLES.PROCUREMENT), vendorController.deleteDocument);

module.exports = router;
