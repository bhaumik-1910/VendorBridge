const crypto = require('crypto');

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashed };
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateCode = (prefix, year = new Date().getFullYear()) => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
};

module.exports = { generateResetToken, hashToken, generateCode };
