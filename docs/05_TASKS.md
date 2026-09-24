# Shiva Electrical & Electronics --- Engineering Task Plan

This document is a living execution backlog.

------------------------------------------------------------------------

# Phase 0 --- Discovery & Repository Setup

## T001 --- Inspect environment

Status: DONE

-   Inspect repository.
-   Inspect existing files.
-   Inspect package manager.
-   Identify existing framework.
-   Identify environment variables.
-   Identify existing Supabase/Vercel configuration.
-   Do not overwrite working code.

Acceptance:

-   Repository state understood.
-   Existing architecture documented.

------------------------------------------------------------------------

## T002 --- Establish project documentation

Status: DONE

Create:

``` text
docs/
  PRD.md
  ARCHITECTURE.md
  RULES.md
  DESIGN.md
  TASKS.md
  MEMORY.md
```

Acceptance:

-   Documents are available in repository.
-   Agent can reference them during future work.

------------------------------------------------------------------------

# Phase 1 --- Application Foundation

## T010 --- Next.js foundation

Status: DONE

-   Configure TypeScript.
-   Configure linting.
-   Configure formatting.
-   Configure environment variables.
-   Establish app routing.
-   Establish error/loading conventions.

Acceptance:

-   Local app starts.
-   Production build succeeds.

------------------------------------------------------------------------

## T011 --- Supabase integration

Status: DONE

-   Configure Supabase client.
-   Configure server-side access.
-   Configure browser-safe access.
-   Configure environment variables.
-   Document setup.

Acceptance:

-   Application can connect to Supabase without exposing secrets.

------------------------------------------------------------------------

## T012 --- Database migrations

Status: DONE

Create initial schema for:

-   profiles
-   categories
-   brands
-   products
-   product_images
-   inventory_transactions
-   delivery_zones
-   addresses
-   carts
-   cart_items
-   orders
-   order_items
-   order_status_history
-   audit_logs

Acceptance:

-   Migration runs successfully.
-   Foreign keys and constraints are valid.

------------------------------------------------------------------------

# Phase 2 --- Authentication & Authorization

## T020 --- Customer authentication

Status: DONE

-   Signup/login.
-   Session management.
-   Logout.
-   Protected account routes.

Acceptance:

-   User cannot access another customer's account data.

## T021 --- Admin authorization

Status: DONE

-   Define roles.
-   Protect admin routes.
-   Add RLS policies.
-   Verify server-side authorization.

Acceptance:

-   Customer cannot access admin operations.
-   Staff/admin permissions follow defined rules.

------------------------------------------------------------------------

# Phase 3 --- Catalog

## T030 --- Categories

Status: DONE

-   CRUD.
-   Slugs.
-   Active/inactive state.
-   Public category pages.

## T031 --- Products

Status: DONE

-   CRUD.
-   SKU.
-   Price.
-   MRP.
-   Stock.
-   Description.
-   Specifications.
-   Compatibility.
-   Warranty.
-   Active/inactive.

## T032 --- Product media

Status: DONE

-   Storage upload.
-   Image metadata.
-   Primary image.
-   Ordering.
-   Delete/replace.

## T033 --- Search and filtering

Status: DONE

-   Keyword search.
-   Category.
-   Brand.
-   Price.
-   Availability.
-   Sorting.

Acceptance:

-   Search is useful on mobile.
-   No unnecessary database scans.

------------------------------------------------------------------------

# Phase 4 --- Cart & Checkout

## T040 --- Cart

Status: DONE

-   Add.
-   Remove.
-   Quantity update.
-   Stock validation.
-   Price validation.

## T041 --- Delivery validation

Status: DONE

-   Pincode lookup.
-   Delivery zone.
-   Charge.
-   ETA.

## T042 --- Order creation

Status: DONE

-   Validate customer.
-   Validate products.
-   Validate stock.
-   Calculate server-side totals.
-   Create order transactionally.
-   Record item snapshots.
-   Record order history.

Acceptance:

-   Duplicate submission does not create duplicate orders.
-   Client cannot manipulate final price.

------------------------------------------------------------------------

# Phase 5 --- Order Management

## T050 --- Customer order history

Status: DONE

-   List orders.
-   Order detail.
-   Status timeline.

## T051 --- Admin order management

Status: DONE

-   Search.
-   Filter.
-   View.
-   Confirm.
-   Pack.
-   Dispatch.
-   Deliver.
-   Cancel where permitted.

## T052 --- Audit trail

Status: DONE

-   Record important status mutations.
-   Record admin actions.


------------------------------------------------------------------------

# Phase 6 --- Inventory

## T060 --- Inventory dashboard

Status: DONE

-   Current stock.
-   Low stock.
-   Out of stock.

## T061 --- Inventory mutations

Status: DONE

-   Add stock.
-   Remove stock.
-   Adjustment reason.
-   Transaction history.

## T062 --- Concurrency safety

Status: DONE

-   Prevent overselling.
-   Test concurrent order scenarios.

------------------------------------------------------------------------

# Phase 7 --- Delivery

## T070 --- Delivery zones

Status: DONE

-   CRUD.
-   Pincode.
-   Town.
-   Fee.
-   ETA.
-   Active/inactive.

## T071 --- Delivery workflow

Status: DONE

-   Delivery assignment abstraction.
-   Status.
-   Notes.
-   Public coverage directory and live pincode lookup.

Do not implement live GPS tracking unless explicitly required.

------------------------------------------------------------------------

# Phase 8 --- Admin Dashboard

## T080 --- Dashboard

Status: DONE

Display:

-   Sales & revenue aggregates.
-   Orders total & status breakdown.
-   Pending orders queue (needs confirmation).
-   Low stock warnings & reorder watch.
-   Recent orders stream with one-click quick actions.
-   Recent system audit logs.

## T081 --- Admin search/filtering

Status: DONE

Make common operational tasks fast.
- Fast status tabs and live search across Orders, Inventory, Delivery Zones, and Products.

------------------------------------------------------------------------

# Phase 9 --- SEO & Performance

## T090 --- SEO

Status: DONE

-   Root & route metadata with metadataBase and title templates.
-   Dynamic sitemap generator (`app/sitemap.ts`).
-   Authoritative robots.txt (`app/robots.ts`).
-   Dynamic canonical URLs on product and public pages.
-   Product structured data (Schema.org/Product & Offer).
-   LocalBusiness structured data on root layout.

## T091 --- Performance

Status: DONE

-   Next.js Image optimization with responsive remote patterns.
-   Targeted server-action route revalidations (`revalidatePath`).
-   Concurrently loaded SSR queries with `Promise.all`.
-   Indexed database lookups on SKU, slug, pincode, and status.

------------------------------------------------------------------------

# Phase 10 --- Testing & Security

## T100 --- Unit tests

Status: DONE

Focus on:
-   Cart totals and subtotal arithmetic (`tests/pricing.test.ts`).
-   Delivery calculation and zone eligibility (`tests/delivery.test.ts`).
-   Product and pincode validation (`tests/delivery.test.ts`).
-   State machine transitions and immutability (`tests/state-machine.test.ts`).
-   Payload tampering and negative values sanitization (`tests/security.test.ts`).

## T101 --- Integration tests

Status: DONE

Focus on:
-   Supabase auth & role guards (`lib/auth/roles.ts`).
-   Atomic order placement PostgreSQL RPC (`place_order_atomic`).
-   Atomic inventory adjustments and audit trail (`adjust_product_inventory`).
-   Atomic order fulfillment transitions and stock return (`transition_order_status`).

## T102 --- E2E tests & core flow verification

Status: DONE

Core flows verified across Next.js 16 SSR and client routes:
-   Browse → category / product list.
-   Search → filtered catalog with zero-result recovery.
-   Product → dynamic slug detail with specs, fitment, and schema.org JSON-LD.
-   Cart → dynamic cart service with local storage & SSR sync.
-   Checkout → pincode coverage check and atomic order creation.
-   Customer tracking → 5-step visual stepper and self-cancellation.
-   Admin dashboard → operational queue, inventory central, and delivery matrix.

## T103 --- Security review

Status: DONE

Checked:
-   Supabase PostgreSQL Row Level Security (RLS) on all 14 tables.
-   Edge proxy middleware and server role verification guards.
-   Input validation and 6-digit pincode format sanitization.
-   Zero hardcoded production secrets (strictly env-based).
-   Client-side price tampering rejection (authoritative server-side calculation).
-   IDOR protection on customer order lookup and self-cancellation.

------------------------------------------------------------------------

# Phase 11 --- Deployment

## T110 --- GitHub

-   Clean repository.
-   README.
-   Environment example.
-   No secrets.

## T111 --- Vercel

-   Production deployment.
-   Preview deployments.
-   Environment variables.

## T112 --- Supabase production

-   Production schema.
-   Migrations.
-   RLS.
-   Storage policies.

------------------------------------------------------------------------

# Phase 12 --- Production Readiness

## T120 --- Observability

-   Error monitoring.
-   Logs.
-   Operational alerts.

## T121 --- Backup/recovery documentation

Document:

-   Database recovery.
-   Storage recovery.
-   Deployment rollback.
-   Migration rollback strategy.

## T122 --- Production acceptance test

Run all critical flows.

------------------------------------------------------------------------

# Phase 13 --- Future Enhancements

Possible later features:

-   WhatsApp integration.
-   Online payment provider.
-   Reviews.
-   Coupons.
-   Product recommendations.
-   AI product assistant.
-   Advanced analytics.
-   Delivery staff portal.
-   PWA enhancements.
-   Search ranking improvements.

Do not begin these before core commerce workflows are stable unless
explicitly instructed.

------------------------------------------------------------------------

# Execution Protocol

For each task:

``` text
1. Read relevant documents.
2. Inspect current implementation.
3. Define exact acceptance criteria.
4. Implement smallest correct change.
5. Run tests/checks.
6. Fix failures.
7. Verify user flow.
8. Update task status.
9. Record durable architectural decisions.
10. Report what changed and what was verified.
```

Never mark a task complete merely because code was written.
