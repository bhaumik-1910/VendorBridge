const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

connectDB();

const server = app.listen(config.port, () => {
  console.log(`VendorBridge API running in ${config.env} mode on port ${config.port}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
