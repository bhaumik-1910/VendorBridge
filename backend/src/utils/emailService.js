const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

const PLACEHOLDER_PATTERNS = [
  'your_email',
  'your_app_password',
  'example.com',
  'changeme',
  'password@',
];

const isPlaceholder = (value) => {
  if (!value) return true;
  const lower = String(value).toLowerCase();
  return PLACEHOLDER_PATTERNS.some((p) => lower.includes(p));
};

const isEmailConfigured = () => {
  if (process.env.SMTP_ENABLED === 'false') return false;
  const { host, user, pass } = config.email;
  if (!host || !user || !pass) return false;
  if (isPlaceholder(user) || isPlaceholder(pass)) return false;
  return true;
};

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: { user: config.email.user, pass: config.email.pass },
  });
  return transporter;
};

/**
 * Sends email when SMTP is configured; otherwise logs to console (dev-safe).
 * Never throws — callers should not fail core workflows because email failed.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const payload = { to, subject, text: text || subject };

  if (!isEmailConfigured()) {
    console.log('\n[Email — mock mode, SMTP not configured]');
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    if (html?.includes('reset-password')) {
      const match = html.match(/href="([^"]+)"/);
      if (match) console.log(`  Reset link: ${match[1]}`);
    }
    console.log('');
    return { sent: false, mock: true };
  }

  try {
    const transport = getTransporter();
    const info = await transport.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
      text: text || subject,
    });
    console.log(`[Email sent] ${to} — ${subject} (${info.messageId || 'ok'})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Email failed]', err.message);
    console.log('[Email — fallback mock]');
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    if (html?.includes('reset-password')) {
      const match = html.match(/href="([^"]+)"/);
      if (match) console.log(`  Reset link (use in browser): ${match[1]}`);
    }
    return { sent: false, mock: true, error: err.message };
  }
};

const sendPasswordResetEmail = (to, resetUrl) =>
  sendEmail({
    to,
    subject: 'VendorBridge - Password Reset',
    html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>Link expires in 1 hour.</p>`,
    text: `Reset your password: ${resetUrl}`,
  });

const sendRFQInvitation = (to, rfqTitle, rfqNumber) =>
  sendEmail({
    to,
    subject: `New RFQ Invitation: ${rfqNumber}`,
    html: `<p>You have been invited to submit a quotation for <strong>${rfqTitle}</strong> (${rfqNumber}).</p>`,
  });

const sendApprovalRequest = (to, title) =>
  sendEmail({
    to,
    subject: 'Approval Required - VendorBridge',
    html: `<p>An approval request requires your action: <strong>${title}</strong></p>`,
  });

const sendInvoiceEmail = (to, invoiceNumber, total) =>
  sendEmail({
    to,
    subject: `Invoice ${invoiceNumber} - VendorBridge`,
    html: `<p>Invoice <strong>${invoiceNumber}</strong> has been issued. Total: $${total}</p>`,
  });

const sendPONotification = (to, poNumber) =>
  sendEmail({
    to,
    subject: `Purchase Order ${poNumber}`,
    html: `<p>Purchase Order <strong>${poNumber}</strong> has been created.</p>`,
  });

module.exports = {
  sendEmail,
  isEmailConfigured,
  sendPasswordResetEmail,
  sendRFQInvitation,
  sendApprovalRequest,
  sendInvoiceEmail,
  sendPONotification,
};
