# Shiva Electrical & Electronics ⚡💧

A high-performance, production-ready local e-commerce and service platform built for **Shiva Electrical & Electronics** — specializing in RO water purifiers, genuine spare parts, domestic and commercial fans, electrical supplies, doorstep installation, and Annual Maintenance Contracts (AMC).

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

---

## 🌟 Key Features

### 🛒 Customer Storefront & Catalog
- **Water Purification & Electrical Catalog**: High-clarity browsing across RO purifiers (Domestic, Commercial, Alkaline, UV+UF), genuine replacement filters (sediment, carbon, membrane, UV lamps), ceiling/exhaust fans, and electrical accessories.
- **Search & URL Filter Bar**: Instant search, category pills, price sorting, and in-stock toggling with zero-result recovery guidance.
- **Rich Product Detail Pages**: High-resolution image galleries, technical specifications, fitment compatibility guides, warranty badges, and schema.org JSON-LD microdata.
- **Unified Cart System**: Seamless guest session support via encrypted cookies with automatic merge to PostgreSQL carts upon customer authentication.
- **Live Postal Pincode Coverage**: Real-time 6-digit delivery checker verifying serviceability, minimum order thresholds, and exact delivery fees before checkout.

### 📦 Order Lifecycle & Fulfillment
- **Atomic Order Placement**: Server-authoritative price recalculation via PostgreSQL function `place_order_atomic`, preventing client-side price tampering and overselling.
- **Immutable Historical Snapshots**: Line items and delivery addresses are frozen at the exact time of order placement (`product_name_snapshot`, `sku_snapshot`, `unit_price`, `quantity`, `delivery_address_snapshot`).
- **Live 5-Step Visual Stepper**: Customer tracking at `/orders/[orderNumber]` (`Placed` ➔ `Confirmed` ➔ `Packed` ➔ `Out for Delivery` ➔ `Delivered`).
- **Customer Self-Cancellation**: Order cancellation permitted exclusively while status is `PLACED`, triggering atomic inventory return to stock.

### 🛡️ Inventory Central & Dispatch Operations
- **Atomic Stock Adjustments**: PostgreSQL function `adjust_product_inventory` with `FOR UPDATE` row locks, negative stock guards, and mandatory audit logging for purchases, returns, damages, and adjustments.
- **Delivery Matrix Console**: Administrative portal at `/admin/delivery` to create, edit, toggle, and manage pincodes, towns, delivery charges, and SLAs.
- **Operational Command Center**: Real-time admin dashboard at `/admin` displaying Gross Sales, Today's Revenue, Average Order Value (AOV), Pending Order Queue with one-click quick confirmation, and low-stock reorder watches.

### 🔍 Search Engine Optimization & Crawling
- **Dynamic XML Sitemap**: Generated on demand at `/sitemap.xml` crawling active categories, products, and static storefront routes.
- **Strict Crawler Rules**: `/robots.txt` ensures catalog discoverability while shielding private admin, cart, and account routes.
- **Schema.org Structured Data**: Integrated `HomeGoodsStore` / `LocalBusiness` and `Product` + `Offer` JSON-LD schemas for Google Rich Snippets.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16 App Router](https://nextjs.org/) (Turbopack, Server Actions, SSR) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 6](https://www.typescriptlang.org/) (Strict mode) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) with `@tailwindcss/postcss` |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL 15+, Row Level Security, SSR Auth) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Testing** | Node 24 Native TypeScript Test Runner (`node --test`) |
| **Code Quality** | ESLint 9 (Flat Config), Prettier 3 |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v22+ or v24+ recommended
- **npm**: v10+
- **Supabase Account**: A free or pro Supabase cloud project (or local Supabase CLI)

### 1. Clone the Repository
```bash
git clone https://github.com/Omkar210/aquapure-store.git
cd aquapure-store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Duplicate the example environment file:
```bash
cp .env.example .env.local
```
Fill in your credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup & Migrations
Execute the migrations in sequential order using the Supabase SQL Editor or Supabase CLI:
1. `supabase/migrations/20260922000000_initial_schema.sql` (Tables, triggers, RLS, indexes, seed data)
2. `supabase/migrations/20260922000001_storage_setup.sql` (Storage buckets and public image policies)
3. `supabase/migrations/20260924000000_order_placement_rpc.sql` (Atomic checkout RPC)
4. `supabase/migrations/20260924000001_order_status_transitions.sql` (Order status state machine & inventory return RPC)
5. `supabase/migrations/20260924000002_inventory_adjustments.sql` (Atomic inventory adjustment RPC)

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

The project includes an isolated pure business logic engine and automated unit tests covering critical financial and operational logic:

```bash
# Run all unit tests
npm test

# Run TypeScript typecheck (zero errors)
npm run typecheck

# Run ESLint (zero errors or warnings)
npm run lint

# Run production build
npm run build
```

### Test Suites (`tests/`)
- `pricing.test.ts`: Line item totals, free delivery edge cases, negative number tampering, discount capping.
- `state-machine.test.ts`: Status transition matrix, terminal state immutability, skip rejection.
- `delivery.test.ts`: 6-digit postal pincode validation, whitespace sanitization, zone eligibility, minimum order enforcement.
- `security.test.ts`: Customer self-cancellation authorization, guest order protection, injection sanitization.

---

## 🚢 Production Deployment

### Deploying on Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the `aquapure-store` repository.
4. Set the Framework Preset to **Next.js**.
5. Configure Environment Variables under **Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (Set to your custom domain or `https://<project-name>.vercel.app`)
6. Click **Deploy**.

### Supabase Production Configuration
1. **Authentication Redirects**: Under **Supabase Dashboard > Authentication > URL Configuration**:
   - Set **Site URL** to `https://your-domain.com`.
   - Add `https://your-domain.com/auth/callback` to **Redirect URLs**.
2. **Assign Admin Role**: After registering your administrator account, set the user's role to `admin` in the `profiles` table:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'owner@shivaelectrical.in';
   ```

---

## 📂 Project Structure

```text
├── app/                        # Next.js 16 App Router routes
│   ├── (storefront)/           # Public customer routes (/, /products, /cart, /checkout, /orders, /delivery)
│   ├── admin/                  # Protected administrative command center (/admin, /admin/orders, /admin/inventory, /admin/delivery)
│   ├── auth/                   # Authentication routes and Supabase callback handler
│   ├── layout.tsx              # Root layout with Schema.org JSON-LD & Navigation
│   ├── robots.ts               # Search crawler governance
│   └── sitemap.ts              # Dynamic XML sitemap generator
├── components/                 # Reusable React 19 UI components
│   ├── cart/                   # Cart view, add-to-cart buttons
│   ├── common/                 # Header, Footer, Badge, Modal, Shell
│   ├── orders/                 # Live tracking stepper, cancellation action
│   └── products/               # Product card, gallery, specs table, filter bar
├── docs/                       # Authoritative engineering documentation
│   ├── 00_MASTER_PROMPT.md     # Master operating instructions
│   ├── 01_PRD.md               # Product Requirements Document
│   ├── 02_ARCHITECTURE.md      # System architecture & database specs
│   ├── 03_RULES.md             # Security, data integrity & business rules
│   ├── 04_DESIGN.md            # Mobile-first design system specifications
│   ├── 05_TASKS.md             # Detailed engineering task checklist
│   └── 06_MEMORY.md            # Durable project context and Decision Log (DEC-001 through DEC-012)
├── lib/                        # Business logic, services & Supabase SSR clients
│   ├── auth/                   # Role verification and authorization guards
│   ├── business-rules.ts       # Pure business rules engine (pricing, state machine, delivery)
│   ├── cart/                   # Unified cart service (cookie + DB sync)
│   └── supabase/               # Browser, Server, Admin clients & Edge Middleware
├── supabase/                   # Supabase configuration & migrations
│   └── migrations/             # Idempotent PostgreSQL migrations & atomic RPCs
└── tests/                      # Automated unit test suites (node:test)
```

---

## 📄 License & Ownership

Proprietary software developed for **Shiva Electrical & Electronics**. All rights reserved.
