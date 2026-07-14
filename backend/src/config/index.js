require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://[YOUR_NAME]:[PASSWORD]@cluster0.edp4acr.mongodb.net/vendorbridge?retryWrites=true&w=majority&appName=Cluster0',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') console.error('CRITICAL: JWT_ACCESS_SECRET is not set in production!');
      return 'vendorbridge_access_secret_change_in_production';
    })(),
    refreshSecret: process.env.JWT_REFRESH_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') console.error('CRITICAL: JWT_REFRESH_SECRET is not set in production!');
      return 'vendorbridge_refresh_secret_change_in_production';
    })(),
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  },
  email: {
    enabled: process.env.SMTP_ENABLED !== 'false',
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
    from: process.env.EMAIL_FROM || 'VendorBridge <noreply@vendorbridge.com>',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
    path: process.env.UPLOAD_PATH || 'uploads',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};
