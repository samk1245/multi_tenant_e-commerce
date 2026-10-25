# 🛍️ OmniStore &bull; Enterprise Multi-Tenant E-Commerce Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.7-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

An enterprise-grade, multi-tenant digital commerce platform built with a high-performance MERN architecture. **OmniStore** powers multiple isolated lifestyle and luxury storefronts under a unified catalog engine with 3D micro-interactions, an AI-powered 24/7 customer support desk, a 6-tier interactive payment suite, an address manager, real-time courier shipment tracking, and GST-compliant tax invoicing.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    Client["Client Web Browser (React 18 + Vite)"]
    
    subgraph Frontend Layer
        Storefront["Storefront Engine (3D Tilt & Micro-Interactions)"]
        Cart["Cart & Wishlist Drawers"]
        Checkout["Checkout Flow (Address Selector + 6-in-1 Payment Suite)"]
        Comparison["Product Comparison Engine"]
        Tracker["Live Courier Order Tracker"]
        Support["24/7 AI Customer Support Desk"]
    end

    subgraph Backend Services (Node.js & Express 5)
        TenantMiddleware["Tenant Resolution Middleware (Slug / Header / Subdomain)"]
        AuthService["Authentication & Address Book API"]
        ProductService["Product Catalog & Review System"]
        OrderService["Order Processing & Inventory Validation"]
        PaymentGateway["Payment Adapters (UPI QR, Cards, NetBank, COD, EMI)"]
        ShippingAdapter["Logistics & Live Courier Tracking"]
        TicketService["Customer Support Ticketing System"]
    end

    subgraph Persistence Layer
        MongoDB[("MongoDB (Multi-Tenant Scoped Database)")]
    end

    Client --> Frontend Layer
    Frontend Layer --> TenantMiddleware
    TenantMiddleware --> AuthService
    TenantMiddleware --> ProductService
    TenantMiddleware --> OrderService
    TenantMiddleware --> PaymentGateway
    TenantMiddleware --> ShippingAdapter
    TenantMiddleware --> TicketService
    AuthService --> MongoDB
    ProductService --> MongoDB
    OrderService --> MongoDB
    PaymentGateway --> MongoDB
    TicketService --> MongoDB
```

---

## 🏪 6 Distinct Flagship Tenant Storefronts

OmniStore comes pre-configured with 6 specialized tenant stores (85+ verified products):

| Store Logo | Storefront Name | Domain / Slug | Specialized Catalog |
|:---:|:---|:---|:---|
| 👟 | **Urban Sneaker Vault** | `sneaker-vault` | Limited Retro High-Tops, Carbon Runners, Streetwear Hoodies, Tactical Cargoes |
| 🛋️ | **Nordic Minimalist Living** | `nordic-home` | Scandinavian Bouclé Armchairs, Handblown Lunar Lighting, Solid Oak Floating Furniture |
| ☕ | **Artisan Roastery & Brews** | `artisan-roastery` | Single-Origin Beans, CNC Conical Burr Hand Grinders, Nitro Cold Brew Steep Pouches |
| 🎧 | **Apex Tech & Audio** | `apex-tech` | ANC Headphones, Dual-Motor Electric Standing Desks, Audiophile 32-Bit USB-C DACs |
| 👗 | **Maison Luxe & Thread** | `maison-luxe` | Mongolian Cashmere Coats, Italian Saffiano Leather Briefcases, Skeleton Automatic Chronographs |
| 🎮 | **Zenith Esports & Pro Gaming** | `zenith-gaming` | 8000Hz Esports Mice, 0.1mm Rapid-Trigger Keyboards, 360Hz QD-OLED Monitors, Planar Headsets |

---

## 🚀 Key Features

### 1. Multi-Tenant Isolation & Theme Customization
- Dynamic tenant resolution via `x-tenant-slug`, `x-tenant-id`, or custom hostname.
- Storefront color themes, custom logo badges, contact emails, and hero banners adapt instantly on tenant switch.
- Merchant administrative dashboard for live catalog creation, revenue analytics, and order management.

### 2. 3D Interactive Product Catalog
- **3D Physics Card Tilt**: Real-time cursor perspective tilt with dynamic specular glare simulation.
- **Stock Urgency Badges**: Real-time alerts (`In Stock`, `⚡ Hurry! Only 2 left in stock!`, `Sold Out`).
- **Pincode Delivery Estimator**: Instant delivery date calculation, express shipping status, and COD eligibility checker for Indian postal codes.
- **Customer Reviews & Upvotes**: Verified buyer ratings with star distribution breakdown and thumbs-up helpfulness counters.

### 3. Product Comparison Engine
- Select up to 4 items simultaneously for a side-by-side comparison matrix.
- Floating bottom comparison dock with live thumbnail previews.
- Compares pricing, discounts, customer ratings, live stock, brand origin, and specifications.

### 4. 6-in-1 Interactive Payment Suite
- **Instant UPI & Dynamic QR Code**: Generates dynamic UPI QR codes with real-time countdown security timer (10:00), 1-click UPI ID copy, and VPA verification.
- **3D Realistic Credit/Debit Card**: Card preview with dynamic brand auto-detection (Visa, MasterCard, RuPay, Amex), formatted 16-digit spacing, and RBI-compliant tokenization.
- **Net Banking**: Quick selection across top Indian banks (HDFC, SBI, ICICI, Axis, Kotak, PNB) plus searchable 30+ bank directory.
- **Anti-Spam Cash on Delivery (COD)**: 4-digit dynamic security Captcha verification to eliminate fraudulent orders.
- **EMI & Buy Now Pay Later**: 0% No Cost EMI calculation across 3-month and 6-month tenures.
- **OmniCoins Loyalty Redemption**: Immediate discount deduction using saved loyalty reward points.

### 5. Multi-Address Book Management
- Full CRUD operations: Add new address, edit existing destination, delete address, and toggle default shipping address.
- Seamless synchronization between customer profile and checkout modal with fallback offline persistence.

### 6. Official GST-Compliant Tax Invoices
- Itemized tax breakdown with HSN/SAC codes (`640411`), CGST (9%), SGST (9%), seller GSTIN credentials, and authorized digital stamp.
- One-click **"Print Invoice"** button with dedicated `@media print` formatting for pristine PDF exporting.

### 7. Real-Time Courier Order Tracking
- Public and customer lookup by Order Reference (`ORD-XXXX-XXXX`) or Courier Tracking AWB (`DLV...`, `BD...`).
- Visual 4-stage tracking timeline (Order Confirmed → Packed at Hub → In Transit → Delivered).

### 8. 24/7 AI Customer Support Desk
- Floating multi-tab customer support desk widget:
  - **AI Assistant**: Simulates live support queries regarding returns, order status, discount coupons, and human agent escalations.
  - **Knowledge Base**: Expandable accordion FAQs for delivery, returns, payments, and coupons.
  - **Support Ticketing**: Official ticket submission generating unique tracking identifiers (`TKT-XXXXX-IN`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3.4, Lucide Icons |
| **Backend** | Node.js, Express 5, Morgan, Helmet, CORS, Cookie-Parser |
| **Database** | MongoDB with Mongoose 9 ODM |
| **Security & Auth** | JSON Web Tokens (JWT), BCryptJS, Express Rate Limit |
| **DevOps & Tooling** | GitHub Actions CI, Nodemon, PostCSS, Autoprefixer |

---

## 📡 REST API Reference

### Stores & Tenants
- `GET /api/tenants` &bull; List all active tenant stores
- `POST /api/tenants` &bull; Create a new tenant storefront
- `GET /api/tenants/:id/analytics` &bull; Store analytics (revenue, order counts, averages)

### Products & Reviews
- `GET /api/products?tenantSlug=:slug` &bull; Fetch tenant product catalog with filters
- `GET /api/products/:id` &bull; Fetch single product with specifications
- `POST /api/products/:id/reviews` &bull; Submit customer review
- `POST /api/products/:id/reviews/:reviewId/helpful` &bull; Upvote review helpfulness

### Orders & Logistics
- `POST /api/orders` &bull; Place order with server-side pricing and inventory deduction
- `GET /api/orders?email=:email` &bull; Fetch user order history
- `GET /api/orders/:id/tracking` &bull; Fetch live shipment courier tracking details

### Addresses & Support
- `GET /api/auth/addresses?email=:email` &bull; Retrieve saved shipping addresses
- `POST /api/auth/addresses?email=:email` &bull; Add new shipping address
- `PUT /api/auth/addresses/:id?email=:email` &bull; Edit existing address
- `DELETE /api/auth/addresses/:id?email=:email` &bull; Delete address
- `POST /api/tickets` &bull; File customer support ticket

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- Node.js (v18.0 or higher)
- MongoDB Server running locally on port `27017`

### 1. Clone the repository
```bash
git clone https://github.com/samk1245/multi_tenant_e-commerce.git
cd multi_tenant_e-commerce
```

### 2. Backend Configuration & Seeder
```bash
cd backend
npm install
npm run seed     # Seeds 6 stores and 85+ products into MongoDB
npm run dev      # Runs backend API on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev      # Runs frontend app on http://localhost:5174
```

### 4. Open in Browser
Visit **[http://localhost:5174](http://localhost:5174)** in your web browser.

---

## 🧪 Testing & Build Verification

```bash
# Verify frontend production build
cd frontend
npm run build

# Verify backend syntax
cd ../backend
node -e "require('./src/server.js');"
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
