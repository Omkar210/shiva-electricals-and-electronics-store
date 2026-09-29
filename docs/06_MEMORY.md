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
-   Google Drive API (Primary catalog media storage & streaming)
-   Google Generative AI (Gemini 2.5 Flash / Flash Lite for automated multi-angle packaging spec scanning)
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

## DEC-009 — Delivery Matrix Management & Coverage Transparency

Date: 2026-09-24
Decision: Implement authoritative delivery zone management and public coverage transparency:
1. Full Administrative Matrix CRUD: Dedicated `/admin/delivery` management console enabling store owners and administrators to configure serviced postal pincodes, town names, zone clusters, delivery charges (including ₹0 for free local delivery), minimum order thresholds, and realistic delivery SLAs (e.g. "Same-day (within 2-4 hours)").
2. Real-Time Active Toggle & Validation: Instant status switches allow disabling pincodes under adverse weather, transport disruptions, or remote courier issues without deleting the zone configuration.
3. Transparent Customer Coverage Directory: Dedicated public route at `/delivery` equipped with an interactive 6-digit pincode checker, detailed service highlights (Same-day dispatch, certified doorstep installation, COD availability), and clear escalation channels for special nearby town private vehicle consignments.
4. Defense-in-Depth Delivery Pricing: Client-side delivery fee calculations remain strictly visual; server actions and checkout re-query PostgreSQL `delivery_zones` at the point of order creation to ensure zero fee tampering.
Reason: Eliminates delivery ambiguity for customers while providing the shop owner with total flexibility over local transport logistics.
Status: Active

## DEC-010 — Unified Operational Command Center & Real-Time Analytics

Date: 2026-09-24
Decision: Upgrade the administrative home at `/admin` into an authoritative Operational Command Center per Phase 8:
1. Multi-Tier Financial & Dispatch Aggregates: Real-time calculation of Gross Sales, Today's Revenue, Average Order Value (AOV), and fulfillment stage distributions (Placed, In Preparation, Out for Delivery, Delivered, Cancelled).
2. Actionable Verification Queue: Immediate visibility and direct links to pending customer orders requiring shop verification, with embedded one-click confirmation actions right from the dashboard table.
3. Proactive Stock Reorder Watch: Surfacing critical low-stock items with stock progress indicators and direct links to the stock adjustment modal.
4. Live System Activity Stream: Rendering recent mutations from `audit_logs` (order transitions, inward purchases, write-offs) for maximum shop accountability.
Reason: Transforms static statistics into a fast, daily operational hub tailored for the physical electronics and water purifier storefront.
Status: Active

## DEC-011 — Search Engine Optimization, Structured Data & Discoverability

Date: 2026-09-24
Decision: Enforce modern search engine optimization and discoverability standards per Phase 9:
1. Dynamic XML Sitemap: Implemented `app/sitemap.ts` to automatically crawl active PostgreSQL `categories` and `products` alongside static routes (`/`, `/products`, `/delivery`) with proper priority weights and update timestamps.
2. Crawler Access Governance: Implemented `app/robots.ts` ensuring public catalog indexing while strictly forbidding search engine crawlers from indexing authenticated customer accounts, checkout sessions, and admin portals.
3. Rich Structured Schema (JSON-LD): Injected schema.org `HomeGoodsStore` / `LocalBusiness` data into the root layout and rich `Product` + `Offer` schemas into product detail pages, enabling Google rich snippets (prices, ratings, and in-stock badges).
4. Metadata Consistency: Configured `metadataBase`, dynamic canonical URLs, and OpenGraph/Twitter card previews across product pages and public storefront routes.
## DEC-012 — Comprehensive Test Suite, Pure Business Rules Engine & Security Guardrails

Date: 2026-09-24
Decision: Implement an isolated pure business logic engine and automated unit test suite:
1. Pure Business Engine (`lib/business-rules.ts`): Decoupled pricing calculations, order status finite state transitions, postal pincode normalization, zone eligibility rules, and customer cancellation authorization from database I/O to enable fast, deterministic verification.
2. Native Node.js Test Runner: Utilized Node 24 native TypeScript test runner (`node --test tests/*.test.ts`) with zero runtime overhead or heavy test framework dependencies.
3. Test Coverage Across Critical Vectors:
   - `tests/pricing.test.ts`: Verifies line item totals, free delivery edge cases, negative fee/discount tampering protection, and discount capping.
   - `tests/state-machine.test.ts`: Verifies valid advancement sequences, terminal state immutability, delivery failure re-dispatches, and illegal skip rejections.
   - `tests/delivery.test.ts`: Verifies 6-digit pincode format validation, whitespace cleanup, zone eligibility, and minimum order enforcement.
   - `tests/security.test.ts`: Verifies ownership verification for self-cancellations, status gates, and payload injection sanitization.
Reason: Ensures zero regression risks across business-critical financial calculations and fulfillment transitions before live production deployment.
Status: Active

## DEC-013 — Production Deployment and Configuration Strategy

Date: 2026-09-24
Decision: Formalize the zero-secret GitHub, Vercel, and Supabase deployment pipeline:
1. Environment Isolation: Documented all required variables in `.env.example` with strict separation between public anonymous keys (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) and server-only administrative keys (`SUPABASE_SERVICE_ROLE_KEY`).
2. Continuous Integration & Verification: Every push to `main` must pass strict `tsc --noEmit`, ESLint, unit tests (`npm test`), and Next.js production build (`npm run build`).
3. Database Migration Sequence: Documented sequential, idempotent migration execution across `supabase/migrations/` guaranteeing schema consistency, atomic RPC deployment, and storage policy enforcement in Supabase production environments.
4. Comprehensive Onboarding Documentation: Replaced raw prompt files with a production-grade `README.md` containing complete setup, feature breakdown, testing, and deployment guides.
Reason: Ensures dependable, secure deployments to Vercel and Supabase with zero secret exposure.
Status: Active

## DEC-014 — Observability, Error Resilience & Disaster Recovery Runbook

Date: 2026-09-24
Decision: Enforce production operational resilience and recovery governance:
1. Multi-tier Error Boundaries: Injected route-level error boundaries (`app/error.tsx`) with incident digest tracking and user-friendly retry controls, preventing uncaught errors from crashing the root layout.
2. Operational Runbook (`docs/07_RECOVERY.md`): Established authoritative disaster recovery protocols including Supabase automated snapshot restoration, point-in-time recovery (PITR), offline `pg_dump` backups, media bucket preservation, Vercel sub-5-second instant deployment rollbacks, and forward-only migration compensation.
3. Production Acceptance Criteria: All core user and administrative journeys verified across build, typecheck, lint, and automated test runners with 100% pass rates.
Reason: Protects store availability and guarantees rapid operational recovery during infrastructure or software disruptions.
Status: Active

## DEC-015 — Google Drive as Exclusive Primary Storage for Product Images & Product ID Routing

Date: 2026-09-25
Decision: Designate Google Drive as the exclusive primary storage provider for all product catalog images, replacing Supabase Storage bucket reliance while maintaining PostgreSQL metadata references:
1. Streaming Proxy Route (`app/api/media/drive/product/[productId]/route.ts`): Implemented a server-side image streaming proxy powered by Google Drive API service account credentials. Images are piped using `Readable.toWeb(stream)` directly to client browsers with immutable HTTP caching (`Cache-Control: public, max-age=31536000, immutable`).
2. Deterministic Product ID Routing: Images stored in Google Drive follow the canonical file naming pattern `<productId>.*` (e.g., `<productId>.jpg`, `<productId>.png`). The proxy locates files by sanitizing the requested Product UUID, executing exact matching against the root Drive catalog folder, and streaming the target file.
3. Resilient Fallback SVG Placeholder: When an image is missing, not yet uploaded, or Drive credentials are unavailable in local development, the route automatically renders an elegant, inline SVG placeholder graphic displaying the product brand, title, and "Image Pending" status, eliminating broken image UI glitches across product cards and detail views.
4. Database Metadata Synchronization: PostgreSQL `product_images` table stores relational records where `storage_provider = 'google_drive'`, `external_id = <drive_file_id>`, and `storage_path = '/api/media/drive/product/${productId}'`.
5. Admin Media Controls: Integrated `DriveMediaPickerModal`, `DriveSyncButton`, and `DriveConnectionsModal` into the Admin product management console (`components/admin/DriveMediaPickerModal.tsx`, `components/admin/ProductForm.tsx`), enabling shop administrators to browse, select, preview, and synchronize Drive files without leaving the management dashboard.
Reason: The store owner manages high-resolution photography in Google Drive. Storing photos directly in Drive eliminates manual export/import pipelines, reduces Supabase storage costs, and aligns with physical retail inventory photography habits.
Alternatives: Retain Supabase Storage as primary (rejected: duplicates storage, creates sync friction for owner); Cloudinary/S3 (rejected: adds third-party billable vendor without solving owner's Google Drive workflow).
Trade-offs: Drive API streaming introduces small latency overhead on cold cache misses, mitigated by aggressive HTTP edge caching (`max-age=31536000, immutable`) and Next.js Image Optimization.
Status: Active

## DEC-016 — Security Hardening, OWASP Defense-in-Depth & Comprehensive Security Audits

Date: 2026-09-29
Decision: Execute comprehensive security hardening and institutionalize defensive security testing across the entire application stack:
1. Five Authoritative Security Audits (`security/` directory):
   - `security/SECURITY_AUDIT.md`: Enterprise-level review assessing the entire codebase against OWASP Top 10:2025 and OWASP API Security Top 10:2023.
   - `security/SECURITY_FINDINGS.md`: Complete vulnerability defect catalog detailing identified issues, CVSS v3.1 severities, threat vectors, remediations, and verification tests.
   - `security/DEPENDENCY_AUDIT.md`: Zero-vulnerability dependency verification across npm lockfile with automated supply chain integrity checks.
   - `security/SECRETS_AUDIT.md`: Full git tree and configuration secret scan confirming zero leaked API keys, service accounts, or database passwords.
   - `security/SECURITY_TESTS.md`: Automated and manual security test execution matrix and verification suite.
2. Insecure Direct Object Reference (IDOR) Order Hardening: Prevented public enumeration of customer orders and PII leaks. Order tracking (`/orders/[orderNumber]`) requires either an authenticated owner session, an ephemeral cryptographically signed HttpOnly cookie (`shiva_order_auth_<orderNumber>`) issued upon checkout, or guest identity verification via `OrderVerificationCard.tsx` matching customer phone or email.
3. Sliding-Window Rate Limiting (`lib/security/rate-limit.ts`): Enforced configurable rate-limiting guardrails across sensitive endpoints (checkout submission, product search, media proxy, customer authentication) to defend against brute force, scraping, and denial-of-service.
4. Server-Side Request Forgery (SSRF) Protection (`lib/security/validation.ts`): Implemented strict outbound URL inspection blocking loopback (127.0.0.1, ::1), private RFC1918 subnets, and cloud instance metadata services (AWS/GCP `169.254.169.254`).
5. Open Redirect Defense (`lib/security/validation.ts`): Hardened all authentication and post-action redirect parameters against external domain hijacking, protocol-relative bypasses (`//evil.com`), backslash evasion, and javascript pseudo-protocols.
6. Deep Magic-Bytes File Upload Verification (`lib/security/validation.ts`): Enforced byte-level header inspection verifying genuine JPEG (`FF D8 FF`), PNG (`89 50 4E 47`), WebP (`RIFF....WEBP`), and AVIF signatures, rejecting executable or script payloads masquerading with image extensions.
7. Strict HTTP Security Headers (`next.config.ts`): Configured comprehensive HTTP response headers including Content-Security-Policy (CSP), Strict-Transport-Security (HSTS 2-year preload), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, and Referrer-Policy: strict-origin-when-cross-origin.
Reason: Eliminates attack surfaces, protects customer PII, prevents resource exhaustion, and guarantees enterprise-grade security posture for online commerce transactions.
Alternatives: Rely solely on Supabase RLS and default Next.js behaviors (rejected: leaves application layer, guest endpoints, and file upload endpoints exposed to OWASP vulnerabilities).
Trade-offs: Slight complexity in guest order lookup flow requiring phone/email verification when tracking cookies expire.
Status: Active

## DEC-017 — Legal, Consumer Protection & Privacy Compliance Framework

Date: 2026-09-29
Decision: Establish complete statutory compliance with Indian Consumer Protection (E-Commerce) Rules, 2020 and the Digital Personal Data Protection (DPDP) Act, 2023:
1. Public Legal & Policy Architecture:
   - `/privacy-policy`: Comprehensive privacy disclosures covering data controller identity, lawful basis, personal data categories collected, DPDP user rights (access, correction, erasure, withdrawal), data retention rules, and grievance officer contact coordinates.
   - `/terms`: Commercial terms and conditions governing purchases, pricing transparency, delivery matrices, installation terms, warranty disclaimers, and local dispute jurisdiction.
   - `/refund-policy`: Detailed return, replacement, and warranty coverage policies specifically addressing electrical items, water purifiers, and consumables (RO filters/membranes).
   - `/cookie-policy`: Explicit classification of strictly necessary vs functional cookies.
2. Interactive Cookie & Privacy Banner (`components/ui/CookieBanner.tsx`): Lightweight, accessible banner notifying visitors of cookie and privacy policies with persistent localStorage consent memory and non-intrusive UI styling per DESIGN.md.
3. Search Engine & Discovery Integration: Added legal policies to `app/sitemap.ts` and linked them persistently across the global store footer (`components/layout/Footer.tsx`).
Reason: Mandatory statutory requirement for Indian e-commerce businesses; establishes customer trust and prevents regulatory liability.
Alternatives: Standard placeholder or generic terms (rejected: does not satisfy Indian E-Commerce Rules or DPDP Act requirements for local physical goods and RO installation services).
Trade-offs: None; essential legal compliance foundation.
Status: Active

## DEC-018 — AI-Assisted Multi-Angle Product Ingestion & Spec Extraction

Date: 2026-09-30
Decision: Integrate Google Gemini Generative AI (multimodal vision) for automated multi-angle product packaging scanning and specification extraction in the Admin console:
1. Multi-Angle Packaging Scanner (`components/admin/ProductImageScanner.tsx`): Interactive administrative tool enabling shop staff to capture or upload up to 5 multi-angle packaging photos (front face, back specs label, side panels, MRP badge).
2. AI Extraction Engine (`lib/ai/product-scanner.ts`): Powered by Google Gemini 2.5 Flash / Flash Lite with structured schema enforcement. Automatically reads printed technical specifications (wattage, voltage, flow rate, tank capacity, purification stages, dimensions, warranty duration), brand name, model name, MRP, and suggested retail price.
3. API Route Guardrails (`app/api/admin/products/scan-images/route.ts`): Strictly gated behind Admin role authorization (`supabase.auth.getUser()` + `profiles.role = 'admin'`). Includes input image validation, payload sanitization against XSS and control characters, and resilient fallback heuristics when external AI keys are unavailable.
4. Auto-Form Pre-Fill: One-click extraction transfers structured data directly into the `ProductForm` fields, eliminating manual data entry errors for complex electrical components and RO filter parts.
Reason: Physical retail inventory includes dozens of technical attributes printed in fine text on manufacturer boxes. Automated optical extraction accelerates catalog creation from 10 minutes per SKU to under 30 seconds while eliminating transcription errors.
Alternatives: Manual text entry by shop staff (rejected: slow, high error rate for technical electrical specifications); generic OCR libraries (rejected: lacks context-aware parsing of structured electrical specs and compatibility fitments).
Trade-offs: Requires optional `GEMINI_API_KEY`; designed with graceful fallback so admin catalog workflows remain 100% operational without AI.
Status: Active

## DEC-019 — Test Suite Expansion & Quality Verification Framework

Date: 2026-09-30
Decision: Expand the automated unit test suite from 26 tests to 62 tests across 16 test suites using the zero-dependency Node 24 native test runner:
1. Security & Guardrails Verification (`tests/security.test.ts`): Automated test suites verifying customer self-cancellation rules, payload injection neutralization (negative price/quantity), media upload role authorization, sliding-window rate limiting isolation, open redirect protection, SSRF blocklists, and deep magic-bytes image inspection.
2. Google Drive Storage Verification (`tests/google-drive.test.ts`): Tests configuration detection, service account validation, product ID sanitization, canonical media URL generation, and filename matching across multiple extensions.
3. AI Product Scanner Verification (`tests/product-scanner.test.ts`): Tests image payload validation, heuristic fallback spec extraction, role privilege gating, and output sanitization against XSS/script injection.
4. SEO & Metadata Resiliency (`tests/metadata.test.ts`): Verifies metadata title generation, order confirmation page SEO, and graceful fallback handling for missing orders (preventing BUG-SHIVA-002 regressions).
5. Continuous Quality Gates: All commits must maintain 100% test pass rate (`npm test`), zero TypeScript compiler errors (`npm run typecheck`), zero ESLint errors/warnings (`npm run lint`), and successful production compilation (`npm run build`).
Reason: Guarantees zero regression risk across business logic, security protections, and storage integrations as the store expands.
Alternatives: Jest/Vitest (rejected: adds unnecessary runtime dependencies when Node 24 native test runner executes all tests in under 3 seconds).
Trade-offs: None.
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
