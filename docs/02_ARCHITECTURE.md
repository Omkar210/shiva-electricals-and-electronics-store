# Shiva Electrical & Electronics --- System Architecture

**Architecture status:** Living technical specification

------------------------------------------------------------------------

## 1. Architecture Principles

1.  Start with a modular monolith.
2.  Keep application logic stateless where possible.
3.  Keep business-critical state in PostgreSQL.
4.  Use Supabase for managed backend capabilities.
5.  Use Vercel for application deployment.
6.  Use CDN/cache aggressively for public catalog content.
7.  Keep private/admin data uncached publicly.
8.  Prefer simple architecture until real measurements justify
    complexity.
9.  Design clear boundaries so services can be extracted later.
10. Security is part of architecture, not a later patch.

------------------------------------------------------------------------

## 2. Target Stack

### Frontend/application

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Accessible component primitives as needed

### Backend/data

-   Supabase PostgreSQL
-   Supabase Auth
-   Supabase Storage
-   Supabase Edge Functions where useful
-   PostgreSQL functions/RPC only where they provide a clear
    transactional/data-layer benefit

### Deployment

-   GitHub
-   Vercel
-   Optional Cloudflare for DNS/CDN/security

### Validation/testing

-   TypeScript
-   ESLint
-   Prettier
-   Unit/integration testing framework selected by implementation
-   End-to-end testing framework selected by implementation

------------------------------------------------------------------------

## 3. High-Level Architecture

``` text
Customer
   |
   v
CDN / Edge Cache
   |
   v
Vercel / Next.js
   |
   +---- Public catalog
   +---- Customer UI
   +---- Server-side application logic
   +---- Admin UI
   |
   v
Supabase
   |
   +---- Auth
   +---- PostgreSQL
   +---- Storage
   +---- Edge Functions
```

------------------------------------------------------------------------

## 4. Data Flow Rules

### Public catalog

Prefer:

``` text
Browser → CDN/cache → Next.js → Supabase
```

with caching/revalidation for safe public data.

### Customer-private data

Prefer:

``` text
Browser → authenticated application → authorized Supabase query
```

No public caching.

### Admin operations

Prefer:

``` text
Admin Browser
   ↓
Authenticated session
   ↓
Server-side authorization
   ↓
Validated mutation
   ↓
Database transaction
   ↓
Audit log
```

------------------------------------------------------------------------

## 5. Suggested Database Model

### profiles

-   id
-   full_name
-   phone
-   role
-   created_at
-   updated_at

Roles:

-   customer
-   staff
-   admin

### categories

-   id
-   name
-   slug
-   description
-   image_url
-   is_active
-   created_at
-   updated_at

### brands

-   id
-   name
-   slug
-   is_active

### products

-   id
-   category_id
-   brand_id
-   name
-   slug
-   sku
-   description
-   price
-   mrp
-   stock_quantity
-   low_stock_threshold
-   compatibility
-   warranty
-   is_active
-   created_at
-   updated_at

Do not blindly combine all fields into JSON. Use structured relational
fields for data that is queried or filtered frequently.

### product_images

-   id
-   product_id
-   storage_path
-   alt_text
-   sort_order
-   is_primary

### inventory_transactions

-   id
-   product_id
-   quantity_change
-   transaction_type
-   reason
-   reference_id
-   created_by
-   created_at

### delivery_zones

-   id
-   pincode
-   town
-   zone_name
-   delivery_charge
-   estimated_delivery
-   minimum_order
-   is_active

### addresses

-   id
-   user_id
-   name
-   phone
-   address_line_1
-   address_line_2
-   landmark
-   city
-   state
-   pincode
-   created_at

### carts

-   id
-   user_id
-   created_at
-   updated_at

### cart_items

-   id
-   cart_id
-   product_id
-   quantity
-   created_at
-   updated_at

### orders

-   id
-   order_number
-   user_id
-   delivery_address_snapshot
-   subtotal
-   delivery_fee
-   discount
-   total
-   payment_status
-   order_status
-   created_at
-   updated_at

### order_items

-   id
-   order_id
-   product_id
-   product_name_snapshot
-   sku_snapshot
-   unit_price
-   quantity
-   subtotal

Snapshot fields are intentional. Historical orders must remain
understandable even if the product later changes.

### order_status_history

-   id
-   order_id
-   old_status
-   new_status
-   changed_by
-   note
-   created_at

### audit_logs

-   id
-   actor_id
-   action
-   entity_type
-   entity_id
-   metadata
-   created_at

------------------------------------------------------------------------

## 6. Database Rules

Use:

-   Primary keys.
-   Foreign keys.
-   Unique constraints.
-   Check constraints where useful.
-   Indexes based on real query patterns.
-   Transactions for critical state changes.

Potential indexes:

-   products.slug
-   products.sku
-   products.category_id
-   products.brand_id
-   products.is_active
-   orders.user_id
-   orders.order_number
-   orders.order_status
-   orders.created_at
-   delivery_zones.pincode

Do not add indexes blindly. Validate with query patterns.

------------------------------------------------------------------------

## 7. Authentication and Authorization

Supabase Auth handles identity.

Authorization must be enforced at the database/application boundary.

Use Row Level Security for customer-private tables where appropriate.

Example principle:

``` text
Customer → own profile
Customer → own addresses
Customer → own cart
Customer → own orders

Staff → operational permissions only

Admin → administrative permissions
```

Never rely only on hiding buttons in the frontend.

------------------------------------------------------------------------

## 8. Product Images

Use object storage rather than database blobs.

Flow:

``` text
Admin
 ↓
Validate file
 ↓
Upload to Storage
 ↓
Store path/metadata in product_images
 ↓
CDN-optimized delivery
```

Do not store huge base64 images in PostgreSQL.

------------------------------------------------------------------------

## 9. Scalability Strategy

The 1M+ interaction requirement is an architectural target, not a
guarantee.

### Read-heavy traffic

Use:

-   CDN.
-   Static generation/revalidation where appropriate.
-   Server-side caching.
-   Database indexes.
-   Pagination.
-   Efficient queries.
-   Optimized images.

### Dynamic traffic

Keep dynamic operations limited to:

-   Authentication.
-   Cart changes.
-   Checkout.
-   Order operations.
-   Account data.
-   Admin operations.
-   Inventory mutations.

### Database scaling path

Start with one managed PostgreSQL instance.

If real load requires it:

``` text
Optimize query
   ↓
Indexes
   ↓
Caching
   ↓
Connection management
   ↓
Read scaling / replicas
   ↓
Partitioning or specialized services where justified
```

Do not jump directly to distributed systems.

------------------------------------------------------------------------

## 10. Caching Rules

Safe candidates:

-   Public product listings.
-   Public category pages.
-   Product details that are safe to cache.
-   Static assets.
-   Images.

Do not publicly cache:

-   Customer orders.
-   Customer addresses.
-   Cart data.
-   Admin pages.
-   Private account data.

Inventory-sensitive pages should use appropriate revalidation or
server-side checks. Do not let stale cache cause overselling.

------------------------------------------------------------------------

## 11. API/Server Action Rules

Every mutation must:

1.  Authenticate where required.
2.  Authorize.
3.  Validate input.
4.  Validate current database state.
5.  Perform transaction-safe mutation.
6.  Return a controlled result.
7.  Log important failures.
8.  Avoid leaking sensitive internal details.

Never trust:

-   Client price.
-   Client total.
-   Client role.
-   Client stock.
-   Client discount.
-   Client order status.

------------------------------------------------------------------------

## 12. Order + Inventory Consistency

Order creation is business-critical.

The system must avoid:

``` text
Two customers buy the last item
→ both orders succeed
→ stock becomes negative
```

Use appropriate transaction/locking/atomic update strategy.

Do not implement stock decrement as a naive:

``` text
SELECT stock
UPDATE stock
```

without concurrency protection.

------------------------------------------------------------------------

## 13. Payment Architecture

Use an abstraction:

``` text
PaymentProvider
   ├── createPayment()
   ├── verifyPayment()
   └── handleWebhook()
```

Do not couple order logic tightly to a single provider.

Never mark an order as paid solely because the browser says payment
succeeded.

------------------------------------------------------------------------

## 14. Observability

Track:

-   Application errors.
-   API errors.
-   Failed orders.
-   Failed payments.
-   Slow queries where measurable.
-   Authentication failures.
-   Admin mutations.
-   Inventory anomalies.

Do not log passwords, tokens, payment secrets, or sensitive personal
information.

------------------------------------------------------------------------

## 15. Deployment Environments

At minimum:

``` text
Local
Preview
Production
```

Separate:

-   Supabase environments/projects where practical.
-   Environment variables.
-   Secrets.
-   Database migrations.

Never commit `.env` secrets.

Commit only `.env.example`.

------------------------------------------------------------------------

## 16. Recommended Repository Structure

``` text
app/
components/
lib/
types/
hooks/
features/
supabase/
  migrations/
  functions/
public/
tests/
docs/
```

Feature logic should be modular enough to locate product/order/inventory
functionality without creating unnecessary abstraction layers.
