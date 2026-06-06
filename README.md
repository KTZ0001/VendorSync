# VendorSync

VendorSync is a robust, enterprise-grade procurement management solution designed to streamline the lifecycle of supplier relationships, RFQs, quotations, purchase orders, and invoicing.

## 🚀 Features

- **Vendor Management:** Onboard, track, and manage supplier profiles with ease.
- **RFQ Lifecycle:** Create, publish, and manage Requests for Quotations (RFQs).
- **Automated Quotation Comparison:** Seamlessly compare vendor quotations to make data-driven decisions.
- **Purchase Order (PO) Management:** Convert successful quotations into formal purchase orders.
- **Invoicing:** Track invoices related to purchase orders.
- **Role-Based Access Control:** Secure access with distinct roles for Procurement Officers, Managers, Vendors, and Administrators.

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Tokens) with Passport.js

### Frontend
- **Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management/Data Fetching:** Axios

## 📦 Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v20 or higher)
- npm

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KTZ0001/vendorsync.git
   cd vendorsync
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file if necessary and run database migrations
   npx prisma generate
   npx prisma db push
   npm run start:dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🔐 Authentication
The system uses JWT-based authentication. Users must be registered and authenticated to access the procurement features. Use the seeded admin account to get started:
- **Email:** `admin@vendorsync.com`
- **Password:** `password123`

## 📄 License
This project is licensed under the UNLICENSED license.
