const express = require('express');
const rfqController = require('../controllers/rfqController');
const rfqValidator = require('../validators/rfqValidator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/constants');

const router = express.Router();
router.use(protect);

router.get('/', rfqController.getRFQs);
router.get('/:id', rfqController.getRFQ);
router.post('/', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), rfqValidator.createRFQ, validate, rfqController.createRFQ);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), rfqValidator.updateRFQ, validate, rfqController.updateRFQ);
router.delete('/:id', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), rfqController.deleteRFQ);
router.patch('/:id/publish', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), rfqController.publishRFQ);
router.patch('/:id/draft', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), rfqController.saveDraft);
router.patch('/:id/vendors', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), rfqController.assignVendors);
router.post('/:id/attachments', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), (req, res, next) => { req.uploadFolder = 'rfqs'; next(); }, upload.single('file'), rfqController.uploadAttachment);
router.get('/:id/attachments/:attachmentId/download', rfqController.downloadAttachment);
router.delete('/:id/attachments/:attachmentId', authorize(ROLES.ADMIN, ROLES.PROCUREMENT), rfqController.deleteAttachment);

module.exports = router;
