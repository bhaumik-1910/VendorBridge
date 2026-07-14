# 🤝 VendorBridge: Procurement & Vendor Management ERP

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?logo=nodedotjs)](https://nodejs.org)

**VendorBridge** is a modern, enterprise-grade, end-to-end Procurement and Vendor Management ERP system. It streamlines interactions between Procurement Officers, Managers, Administrators, and external Vendors—offering automatic RFQ pipelines, Quotation comparisons, Purchase Order (PO) generations, invoicing, audit logs, and approval workflows.

---

## 🎨 Features & Capabilities

### 🖥️ Frontend (React & Tailwind CSS v4)
*   **Role-Based Dashboards:** Unique UI interfaces tailored for **Administrators**, **Procurement Officers**, **Managers**, and **Vendors**.
*   **RFQ Management Panel:** Quick RFQ creation, inviting specific vendors, tracking statuses, and submission metrics.
*   **Quotation Compare Engine:** Side-by-side product pricing comparison with automated highlights of the lowest bid.
*   **Purchase Orders & Invoices:** Interactive lists, generation progress trackers, and direct digital PDF exports.
*   **Visual Workflows:** Dynamic visual flowcharts representing Multi-stage approval cycles.
*   **Activity Logs & Reports:** Operational tracking, search filters, and interactive data visualization utilizing **Recharts**.
*   **Dark Mode & Theming:** Premium, high-contrast dark mode with persistence in `localStorage`.

### ⚙️ Backend (Node.js, Express & MongoDB)
*   **Robust Security:** Encrypted passwords via `bcryptjs`, route security with `helmet`, input sanitation (`mongo-sanitize`, `xss-clean`), and Request Rate Limiting.
*   **JWT Multi-Token Auth:** Standard Access Token + HTTP-only Refresh Token cookie architecture for secure authentication.
*   **Document Engines:** Live server-side PDF generator using `pdfkit` for POs and Invoices.
*   **Database Aggregations:** MongoDB Atlas queries with multi-document population, search keywords, and dashboard analytics.
*   **Notification Engine:** Automated generation of in-app activity logs and alerts for system actions (submission, approvals, etc.).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Recharts, React Router DOM v7 |
| **Backend API** | Node.js, Express, Mongoose, Multer (uploads), PDFKit, Nodemailer |
| **Database** | MongoDB / MongoDB Atlas |

---

## 📂 Project Structure

```text
VendorBridge/
├── frontend/               # React client SPA (Vite + CSS)
│   ├── src/
│   │   ├── components/     # Reusable UI parts & cards
│   │   ├── context/        # Theme & Auth contexts
│   │   ├── layout/         # Header, Navigation Sidebar, Main layout
│   │   ├── pages/          # Dashboard, RFQ, Invoicing, Approvals, Profile pages
│   │   └── utils/          # Helpers & Axios Interceptors
│   └── vercel.json         # SPA configuration for Vercel
│
├── backend/                # Express API REST server
│   ├── src/
│   │   ├── config/         # Database connector & Global project constants
│   │   ├── controllers/    # Request control flow handlers
│   │   ├── middleware/     # Role check, Token Validation, Error handler middlewares
│   │   ├── models/         # MongoDB Mongoose schemas
│   │   ├── routes/         # Router mounts for all entity controllers
│   │   └── services/       # Core business operations and DB logic
│   ├── api/index.js        # Vercel serverless entrypoint
│   └── vercel.json         # Serverless rules & routing config for Vercel
```

---

## ⚡ Quick Start (Local Run)

### 1. Clone the project and configure Backend
```bash
git clone <your-repo-link>
cd VendorBridge/backend
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vendorbridge
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
CLIENT_URL=http://localhost:5173
```

Install packages and seed the dummy database:
```bash
npm install
npm run seed       # Seeds roles, admin logins, default vendors, and RFQs
npm run dev        # Backend boots up on http://localhost:5000
```

### 2. Configure & Boot Frontend
In a new terminal window:
```bash
cd VendorBridge/frontend
npm install
npm run dev        # Frontend boots up on http://localhost:5173
```

---

## 🔐 Credentials for Demo (after seeding)

Use these accounts to test role-based dashboard views:

| Role Name | Email | Password |
|---|---|---|
| **Administrator** | `admin@vendorbridge.com` | `Password@123` |
| **Procurement Officer** | `sarah.chen@acmecorp.com` | `Password@123` |
| **Approving Manager** | `david.miller@acmecorp.com` | `Password@123` |
| **External Vendor** | `contact@techsupply.com` | `Password@123` |

---

## 🚀 Cloud Deployment

This project is pre-configured for instant deployment on **Vercel**:
*   To deploy the API backend, import the `/backend` folder with Vercel's Node framework preset.
*   To deploy the React client, import the `/frontend` folder with Vercel's Vite preset.
*   Find detailed step-by-step instructions in the deployment guide artifact generated in your workspace settings.
