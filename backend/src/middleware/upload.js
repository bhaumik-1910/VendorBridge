const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { AppError } = require('../utils/ApiResponse');

const uploadDir = path.join(process.cwd(), config.upload.path);
['vendors', 'rfqs', 'quotations', 'invoices'].forEach((dir) => {
  const full = path.join(uploadDir, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.uploadFolder || 'general';
    const dest = path.join(uploadDir, folder);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error(`File type ${ext} is not allowed. Use PDF, DOC, XLS, or images.`));
};

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter,
});

module.exports = upload;
