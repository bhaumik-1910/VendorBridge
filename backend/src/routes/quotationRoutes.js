const express = require('express');
const quotationController = require('../controllers/quotationController');
const quotationValidator = require('../validators/quotationValidator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/constants');

const router = express.Router();
router.use(protect);

router.get('/', quotationController.getQuotations);
router.get('/compare/:rfqId', authorize(ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.MANAGER), quotationController.compareQuotations);
router.get('/:id', quotationController.getQuotation);
router.post('/', authorize(ROLES.VENDOR, ROLES.ADMIN), quotationValidator.submitQuotation, validate, quotationController.submitQuotation);
router.put('/:id', authorize(ROLES.VENDOR, ROLES.ADMIN), quotationController.updateQuotation);
router.patch('/:id/select', authorize(ROLES.ADMIN, ROLES.PROCUREMENT, ROLES.MANAGER), quotationController.selectWinner);
router.post('/:id/attachments', authorize(ROLES.VENDOR, ROLES.ADMIN), (req, res, next) => { req.uploadFolder = 'quotations'; next(); }, upload.single('file'), quotationController.uploadAttachment);
router.get('/:id/attachments/:attachmentId/download', quotationController.downloadAttachment);

module.exports = router;
