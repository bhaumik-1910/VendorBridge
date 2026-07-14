# VendorBridge Frontend

React + Vite frontend for the VendorBridge Procurement & Vendor Management ERP.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM
- Recharts
- Lucide React Icons

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
frontend/
├── public/          # Static assets (favicon)
├── src/
│   ├── components/  # UI components & widgets
│   ├── context/     # Theme & role context
│   ├── data/        # Static dummy data
│   ├── layout/      # Sidebar, Topbar, layouts
│   ├── pages/       # All application screens
│   └── utils/       # Chart theme helpers
├── index.html
├── package.json
└── vite.config.js
```

## Screens

| Route | Screen |
|-------|--------|
| `/login` | Login |
| `/signup` | Signup |
| `/dashboard` | Dashboard |
| `/vendors` | Vendor Management |
| `/vendors/:id` | Vendor Details |
| `/rfq` | RFQ Listing |
| `/rfq/create` | RFQ Creation |
| `/quotations/submit` | Quotation Submit |
| `/quotations/compare` | Quotation Comparison |
| `/approvals` | Approval Workflow |
| `/purchase-orders` | Purchase Orders |
| `/invoices` | Invoices |
| `/activity` | Activity Logs |
| `/reports` | Reports & Analytics |

## Features

- Light / Dark mode toggle (saved to localStorage)
- Role-based UI (Admin, Procurement Officer, Vendor, Manager)
- Premium ERP dashboard with charts and widgets
