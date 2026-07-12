# VendorBridge Backend API

Production-ready Node.js + Express + MongoDB backend for VendorBridge Procurement ERP.

## Quick Start

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run seed    # Optional: populate demo data
npm run dev
```

API runs at **http://localhost:5000/api/v1**

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT + Refresh Tokens
- bcrypt, Helmet, CORS, Rate Limiting
- Multer, PDFKit, Nodemailer
- Express Validator

## Demo Login (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vendorbridge.com | Password@123 |
| Procurement | sarah.chen@acmecorp.com | Password@123 |
| Manager | david.miller@acmecorp.com | Password@123 |
| Vendor | contact@techsupply.com | Password@123 |

## Project Structure

```
backend/
├── src/
│   ├── config/         # DB, constants, seed
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Auth, validation, upload
│   ├── validators/     # Express validator rules
│   ├── utils/          # Email, PDF, tokens
│   └── helpers/        # Activity & notification helpers
├── uploads/            # File uploads
├── logs/               # Server logs
├── API_DOCUMENTATION.md
├── MONGODB_SETUP_GUIDE.txt
└── PROJECT_COMPLETE_EXPLANATION.txt
```

See `API_DOCUMENTATION.md` for full endpoint reference.
