# VendorBridge

Procurement & Vendor Management ERP.

## Project Structure

```
odoo-ksv/
├── frontend/     # React + Vite UI
├── backend/      # Node.js + Express API
└── README.md
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
API: http://localhost:5000/api/v1

Demo login: `sarah.chen@acmecorp.com` / `Password@123`
