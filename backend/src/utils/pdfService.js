const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const generateInvoicePDF = (invoice, vendor, po, outputName) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(process.cwd(), config.upload.path, 'invoices');
    ensureDir(dir);
    const filePath = path.join(dir, outputName);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(22).text('INVOICE', { align: 'right' });
    doc.fontSize(10).text(`Invoice #: ${invoice.invoiceNumber}`, { align: 'right' });
    doc.moveDown();
    doc.fontSize(14).text('VendorBridge ERP');
    doc.fontSize(10).text('Acme Corporation - Procurement Dept');
    doc.moveDown();
    doc.text(`Bill From: ${vendor.name}`);
    doc.text(`Email: ${vendor.email}`);
    doc.text(`GST: ${vendor.gst || 'N/A'}`);
    doc.moveDown();
    doc.text(`PO Reference: ${po.poNumber}`);
    doc.text(`Issued: ${new Date(invoice.issued).toDateString()}`);
    doc.text(`Due: ${new Date(invoice.due).toDateString()}`);
    doc.moveDown();
    doc.text('Items:', { underline: true });
    po.items.forEach((item) => {
      doc.text(`${item.name} x ${item.qty} @ $${item.unitPrice} = $${(item.qty * item.unitPrice).toFixed(2)}`);
    });
    doc.moveDown();
    doc.text(`Subtotal: $${invoice.amount.toFixed(2)}`);
    doc.text(`Tax: $${invoice.tax.toFixed(2)}`);
    doc.fontSize(12).text(`Total: $${invoice.total.toFixed(2)}`, { bold: true });
    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = { generateInvoicePDF };
