# Shiva Electrical & Electronics --- Project Memory

This document stores durable project context and decisions.

It must be updated when a decision is likely to remain relevant across
future implementation sessions.

------------------------------------------------------------------------

# 1. Project Identity

Project name:

**Shiva Electrical & Electronics Website**

Business type:

Local electrical/electronics retail business.

Primary products:

-   RO purifiers
-   RO spare parts
-   Fans
-   Electrical/electronic products

Business objective:

Create an online local commerce platform that increases product
discoverability, supports local delivery, and gives the shop owner an
operational admin system.

------------------------------------------------------------------------

# 2. Deployment Direction

Target:

``` text
GitHub
   ↓
Vercel
   ↓
Next.js application
   ↓
Supabase
```

Optional:

``` text
Cloudflare
```

for DNS/CDN/security.

------------------------------------------------------------------------

# 3. Architecture Decision

Use a modular monolith first.

Do not start with microservices.

Reason:

-   Lower operational complexity.
-   Easier development.
-   Easier debugging.
-   Suitable for initial local commerce workload.
-   Clear boundaries can support future extraction.

------------------------------------------------------------------------

# 4. Data Decision

PostgreSQL is the primary source of truth.

Business-critical state includes:

-   Products.
-   Prices.
-   Inventory.
-   Customers.
-   Addresses.
-   Orders.
-   Payments.
-   Delivery zones.
-   Audit records.

------------------------------------------------------------------------

# 5. Scalability Goal

The application should be architected with a path toward 1M+ user
interactions.

This is not a claim that the initial free infrastructure can support
that traffic.

Scale through:

-   CDN caching.
-   Static/revalidated pages.
-   Efficient queries.
-   Indexes.
-   Image optimization.
-   Stateless application design.
-   Managed database scaling.
-   Measurement-driven optimization.

------------------------------------------------------------------------

# 6. Business Differentiator

The key business advantage is local commerce:

``` text
Local availability
+
Local knowledge
+
Local delivery
+
RO spare-part expertise
+
Shop/service support
```

Do not turn the website into a generic nationwide marketplace unless the
business strategy changes.

------------------------------------------------------------------------

# 7. AI Strategy

AI is optional and should be introduced only when it solves a real
business problem.

Potential future use cases:

-   Natural-language product search.
-   Product compatibility assistant.
-   Customer support assistant.
-   Product recommendations.

AI must not invent:

-   Stock.
-   Price.
-   Compatibility.
-   Warranty.
-   Delivery availability.

AI should retrieve authoritative business data before answering
business-specific questions.

------------------------------------------------------------------------

# 8. Current Technology Direction

Preferred:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Supabase
-   PostgreSQL
-   Supabase Auth
-   Supabase Storage
-   Vercel
-   GitHub

Additional dependencies must be justified.

------------------------------------------------------------------------

# 9. Known Unknowns

These must be collected from the business owner before production:

-   Exact shop address.
-   Town and nearby towns.
-   Delivery pincodes.
-   Delivery charges.
-   Delivery time.
-   Phone number.
-   WhatsApp number.
-   Business hours.
-   Actual product catalog.
-   Actual product images.
-   Product prices.
-   Stock.
-   Brands.
-   Warranty policy.
-   Return policy.
-   Installation/service policy.
-   Payment methods.
-   Delivery staff/process.
-   GST/business information if required.
-   Final branding assets.

Never invent these values.

------------------------------------------------------------------------

# 10. Decision Log

Use this format for durable decisions:

``` text
## DEC-XXX — Title

Date:
Decision:
Reason:
Alternatives:
Trade-offs:
Status:
```

## DEC-001 — Foundation Stack Versions

Date: 2026-09-21
Decision: Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, ESLint 9 (flat config)
Reason: Latest stable versions; Next.js 16 removed built-in lint command (use ESLint directly); ESLint 9 requires flat config format; Tailwind CSS 4 uses @tailwindcss/postcss plugin
Alternatives: Older versions considered but latest provides best long-term support
Trade-offs: Newer versions mean some community guides may be outdated
Status: Active

## DEC-002 — Supabase Client and Security Architecture

Date: 2026-09-22
Decision: Use @supabase/ssr with separate browser (`client.ts`), server (`server.ts` with Next.js cookies), and admin (`admin.ts` with server-only guard) clients, plus root Next.js 16 `proxy.ts` for session refreshing.
Reason: Prevents service-role secret leakage, ensures RLS enforcement on all standard user requests, supports Next.js 16 App Router streaming and Server Actions.
Alternatives: Single generic supabase client (rejected: leaks secrets or bypasses auth context).
Trade-offs: Requires discipline to never import admin client outside server tasks.
Status: Active

## DEC-003 — Domain & Service Architecture Learned from AquaPure Store Reference

Date: 2026-09-22
Decision: Adopt the core service and catalog classification modeled in the owner's aquapure-store reference:
1. Catalog tiers: Standard RO, Premium RO+UV+UF+Alkaline, Compact Wall-Mount, Gravity Non-electric, and Commercial (50L/hr).
2. Service modules: Installation Services, Annual Maintenance Contracts (AMC with scheduled filter changes), Water Quality / TDS Testing, and 24/7 Repair & Spare Part replacement.
3. Trust badges: Certified Quality (ISI standard), Expert Installation by local technicians, Genuine Spare Parts, and Clear Warranty terms.
4. Preserved legacy repo: Archived the prior Vite/Convex experiment in `legacy-aquapure-store` branch on GitHub; active `main` tracks this production Next.js + Supabase platform.
Reason: Aligns with owner's domain expectations for water purification commerce while integrating with Shiva Electrical & Electronics's broader electrical catalog (fans, wiring, accessories).
Status: Active

## DEC-004 — Authentication & Role Authorization Enforcement

Date: 2026-09-22
Decision: Implement defense-in-depth authentication & authorization:
1. Edge Middleware (`proxy.ts` / `middleware.ts`): Intercepts requests to `/account` and `/admin`, redirecting unauthenticated users to `/login?redirect=...`. Also redirects logged-in users away from auth forms.
2. Server Guards (`lib/auth/roles.ts`): Cryptographically verifies user identity via `supabase.auth.getUser()`, queries the `profiles` table to read authoritative role (`customer`, `staff`, `admin`), and forbids non-staff/admin users from loading `/admin` routes.
3. Database RLS: PostgreSQL policies enforce that even if an HTTP request bypassed the application layer, only matching `auth.uid()` or verified `role = 'admin'` rows can be queried or mutated.
Reason: Strictly complies with RULES.md Sections 5 & 16: "Frontend route protection is not sufficient alone. Enforce authorization at data/application boundary."
Status: Active

## DEC-005 — Catalog Architecture & Discovery UX

Date: 2026-09-22
Decision: Implement mobile-first catalog navigation per DESIGN.md:
1. Product Information Architecture: Product images -> Name/Brand/SKU -> Selling Price & MRP discount -> In-stock verification -> Delivery pincode check -> CTAs -> Detailed Description -> Technical Specifications -> Compatibility & Fitment -> Warranty -> Related products.
2. Search & Filtering: URL searchParams driven (`/products?q=...&category=...&sort=...&inStock=true`) so that filter states are bookmarkable, shareable, and fully compatible with SSR.
3. Media Storage: Supabase Storage bucket `product-images` with RLS policies allowing public reads and restricted admin uploads. Next.js image optimization configured with remote patterns.
4. Zero-Result Recovery: Search queries resulting in 0 matches provide clear reset controls and category redirection rather than blank dead ends.
Reason: Maximizes local discovery, supports quick mobile purchasing decisions, and respects architectural caching rules.
Status: Active

## DEC-006 — Atomic Concurrency-Safe Order Creation & Cart Architecture

Date: 2026-09-24
Decision: Enforce strict transactional integrity across cart and order creation per Sections 12-15 of MASTER PROMPT:
1. Authoritative Server-Side Calculation: The client sends only item IDs, quantities, and delivery address. The server re-fetches authoritative prices and active statuses from PostgreSQL, completely eliminating client-side price tampering.
2. Concurrency-Safe Inventory Decrement: Implemented atomic PostgreSQL function `place_order_atomic` using conditional updates (`WHERE id = v_product_id AND stock_quantity >= v_qty AND is_active = true`). If stock is insufficient, the entire transaction aborts, preventing race conditions and negative inventory.
3. Historical Data Snapshots: Order items store immutable snapshots (`product_name_snapshot`, `sku_snapshot`, `unit_price`, `quantity`, `subtotal`), and orders store `delivery_address_snapshot` as JSONB. Future catalog edits will never alter past order records.
4. Comprehensive Audit Trail: Atomic insertion of initial order history (`order_status_history` -> 'PLACED') and inventory audit logs (`inventory_transactions` -> 'SALE').
5. Unified Cart Storage: Uses an encrypted/HTTP-only cookie for guest sessions with seamless automatic sync to PostgreSQL `carts` & `cart_items` upon user login.
6. Initial Payment Abstraction: Cash on Delivery / Pay on Delivery (COD/POD) for local fulfillment, designed to cleanly accept online payment gateway webhooks.
Reason: Protects store financial and stock integrity under concurrent customer access.
Status: Active

## DEC-007 — Order Management State Machine, Audit Trails & Stock Restoration

Date: 2026-09-24
Decision: Implement transactional order fulfillment and lifecycle tracking per Phase 5:
1. Valid State Machine: Strictly controlled transitions:
   - PLACED -> CONFIRMED or CANCELLED
   - CONFIRMED -> PACKED or CANCELLED
   - PACKED -> OUT_FOR_DELIVERY or CANCELLED
   - OUT_FOR_DELIVERY -> DELIVERED, CANCELLED, or FAILED
   - DELIVERED & CANCELLED are terminal states
2. Automatic Stock Restoration on Cancellation: Atomic PostgreSQL RPC `transition_order_status` inspects all `order_items` when status transitions to `CANCELLED`, restores the quantity to `products.stock_quantity`, and records audit entries in `inventory_transactions` with `transaction_type = 'RETURN'`.
3. Comprehensive Multi-tier Audit Trail: Every transition writes to `order_status_history` (with changed_by, old_status, new_status, note, and timestamp) and `audit_logs` (with action = 'ORDER_STATUS_TRANSITION').
4. Customer Tracking Experience: Dedicated `/orders` dashboard and `/orders/[orderNumber]` live tracking page with a visual stepper (`OrderTimelineStepper`), delivery snapshot details, itemized cost summary, and self-cancellation button available exclusively while the order remains in `PLACED` status.
5. Admin Operational Control Center: Staff and admin portal at `/admin/orders` featuring live status tabs, order search, operational metric badges (New, In Preparation, Out for Delivery, Delivered), one-click quick progression actions, and detailed order review at `/admin/orders/[id]`.
Reason: Ensures strict operational control for shop staff while delivering transparency to customers and protecting inventory counts.
Status: Active

## DEC-008 — Inventory Central, Atomic Adjustments & Audit Trail

Date: 2026-09-24
Decision: Enforce strict transactional inventory management per Section 15 of RULES.md:
1. Concurrency-Safe Atomic Stock Adjustments: Atomic PostgreSQL function `adjust_product_inventory` locks the product row (`FOR UPDATE`), checks that `stock_quantity + quantity_change >= 0`, updates the stock, writes an immutable row to `inventory_transactions`, and logs to `audit_logs`.
2. Prohibited Silent Drift: Manual stock quantity updates directly in the application layer without a transaction record are strictly forbidden. Every adjustment specifies a mandatory reason, transaction type (`PURCHASE`, `RETURN`, `ADJUSTMENT`, `DAMAGE`), and optional reference document ID (PO, RMA, invoice).
3. Inventory Central UI: Admin dashboard at `/admin/inventory` featuring live KPI cards (Total Stock Units, Low Stock Warnings, Out of Stock Count, Total Stock Valuation in ₹), status tabs (`ALL`, `LOW_STOCK`, `OUT_OF_STOCK`, `HEALTHY`), and search/category filters.
4. Comprehensive Audit Trail: Dedicated `/admin/inventory/audit` log page displaying the chronological history of all inward purchases, order sales, returns, and write-offs.
Reason: Prevents overselling, protects against stock drift, and provides store owners with full accountability over high-value electrical and water purifier inventory.
Status: Active



------------------------------------------------------------------------

# 11. Open Questions

Keep unresolved business questions here.

Examples:

-   Which pincodes are supported?
-   Is COD supported?
-   Which payment gateway will be used?
-   Are all products deliverable?
-   How are installation requests handled?
-   What is the return window?
-   Who can modify inventory?
-   Can staff cancel orders?

------------------------------------------------------------------------

# 12. Memory Rules

Only store durable information.

Do not store:

-   Temporary debugging details.
-   Random implementation thoughts.
-   Secrets.
-   Passwords.
-   API keys.
-   Customer personal data unless specifically required and
    appropriately handled.

When a decision changes:

1.  Update the decision.
2.  Record why.
3.  Update affected architecture/task documents.
4.  Avoid leaving contradictory instructions.

------------------------------------------------------------------------

# 13. Session Continuity

At the beginning of each major implementation session:

1.  Read this memory.
2.  Read current tasks.
3.  Inspect actual repository state.
4.  Check recent changes.
5.  Identify unfinished work.
6.  Continue from verified state.

Do not assume that previous agent output equals current repository
state.
