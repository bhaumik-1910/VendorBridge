const app = require('../src/app');
const connectDB = require('../src/config/db');

// Connect to MongoDB
connectDB();

// Export the Express app as Serverless function handler
module.exports = app;
