# Shiva Electrical & Electronics --- Product Requirements Document (PRD)

**Document status:** Living specification\
**Owner:** Shiva Electrical & Electronics\
**Primary implementation agent:** Antigravity\
**Repository:** GitHub\
**Deployment target:** Vercel\
**Backend target:** Supabase\
**Primary market:** Local town + nearby towns in India

------------------------------------------------------------------------

## 1. Product Vision

Build a production-grade, mobile-first local commerce platform for
**Shiva Electrical & Electronics**, a shop selling:

-   RO/water purifiers
-   RO spare parts and consumables
-   Fans
-   Electrical/electronic products
-   Related services where applicable

The platform must allow real customers to discover products, verify
availability, place orders, request local delivery, and track order
status.

It must also provide a secure admin system for the shop owner/admin to
manage products, inventory, orders, customers, delivery areas, pricing,
content, and operational data.

The website is not merely a portfolio/demo project. Treat it as a real
business system whose data and workflows may affect actual customers and
business operations.

------------------------------------------------------------------------

## 2. Goals

### Primary goals

1.  Establish a professional online presence for Shiva Electrical &
    Electronics.
2.  Allow customers to discover and search products.
3.  Display accurate product information, pricing, stock status, and
    delivery availability.
4.  Support cart and order workflows.
5.  Support local delivery in the shop's town and nearby towns.
6.  Give the business owner a secure admin dashboard.
7.  Keep inventory and order information consistent.
8.  Provide strong SEO for local product discovery.
9.  Be mobile-first and fast.
10. Use a scalable architecture that can grow toward 1M+ user
    interactions.
11. Keep initial infrastructure inexpensive and use free/open-source
    technologies wherever practical.
12. Make the codebase maintainable enough for future developers.

### Secondary goals

-   Product reviews.
-   Coupons/offers.
-   Customer notifications.
-   Service/installation requests.
-   Product compatibility information.
-   Analytics and business reporting.
-   AI-assisted product discovery only after the core system is
    reliable.

------------------------------------------------------------------------

## 3. Non-Goals for Initial MVP

Do NOT build these as mandatory MVP features:

-   Complex microservice architecture.
-   Custom AI chatbot.
-   Custom payment gateway.
-   Nationwide logistics.
-   Nationwide marketplace.
-   Native Android/iOS applications.
-   Fraud detection AI.
-   Over-engineered event-driven infrastructure.
-   Custom search engine.
-   Real-time GPS delivery tracking.

These can be evaluated after the core product is stable.

------------------------------------------------------------------------

## 4. Target Users

### 4.1 Customer

A local customer who wants to:

-   Browse products.
-   Search for a product or spare part.
-   Understand compatibility.
-   Check price.
-   Check stock.
-   Check whether delivery is available.
-   Add products to cart.
-   Place an order.
-   View order status.
-   Contact the shop when necessary.

### 4.2 Shop Admin

The owner/admin needs to:

-   Manage products.
-   Manage categories and brands.
-   Manage prices.
-   Manage inventory.
-   View and process orders.
-   Manage delivery zones.
-   Manage customers.
-   View sales metrics.
-   Manage website content.
-   Review audit logs.

### 4.3 Staff / Operations User

Optional role for future use:

-   View orders.
-   Update operational order status.
-   Assist with delivery.
-   Limited inventory operations.

Staff must not automatically receive full admin privileges.

------------------------------------------------------------------------

## 5. Core Customer Journeys

### Journey A --- Product discovery

Home → Category → Product listing → Product detail → Cart

### Journey B --- Search

Search → Results → Filters → Product detail → Cart

### Journey C --- Local delivery check

Product/Cart → Enter PIN code → Check delivery zone → Show delivery
availability, charge, and ETA

### Journey D --- Checkout

Cart → Address → Delivery check → Payment/COD option → Order
confirmation

### Journey E --- Existing customer

Login → Account → Orders → Order detail → Status

### Journey F --- Product support

Product → Compatibility/specification → Contact/request support

------------------------------------------------------------------------

## 6. Core Admin Journeys

### Product management

Admin login → Dashboard → Products → Create/Edit → Upload media → Set
price → Set stock → Publish

### Order management

Admin login → Orders → Open order → Verify → Confirm → Pack → Dispatch →
Deliver

### Inventory management

Inventory → Stock level → Stock adjustment → Record reason → Audit trail

### Delivery management

Delivery zones → Add/edit pincode → Set charge → Set estimated delivery
time → Enable/disable

------------------------------------------------------------------------

## 7. Functional Requirements

### 7.1 Homepage

Must include:

-   Shop identity.
-   Main product categories.
-   Search.
-   Featured products.
-   Popular products.
-   Delivery/service message.
-   Trust indicators.
-   Contact information.
-   Clear calls to action.
-   Mobile-friendly navigation.

### 7.2 Categories

Initial categories should support at least:

-   RO Purifiers
-   RO Spare Parts
-   Fans
-   Electrical/Electronics
-   Services

Categories must be data-driven rather than hard-coded.

### 7.3 Product listing

Support:

-   Pagination or cursor-based loading where appropriate.
-   Search.
-   Category filtering.
-   Brand filtering.
-   Price filtering.
-   Availability filtering.
-   Sorting.
-   Responsive product cards.

### 7.4 Product details

A product may contain:

-   Name
-   SKU
-   Brand
-   Category
-   Price
-   MRP
-   Discount
-   Stock status
-   Images
-   Description
-   Specifications
-   Compatibility
-   Warranty
-   Delivery information
-   Related products

Do not display technical fields that are unavailable rather than
inventing values.

### 7.5 Cart

Support:

-   Add item.
-   Remove item.
-   Change quantity.
-   Stock validation.
-   Price validation.
-   Persistent cart for authenticated customers.
-   Guest cart if implemented.
-   Clear cart.

### 7.6 Checkout

Support:

-   Customer identity.
-   Address.
-   Pincode.
-   Delivery availability.
-   Delivery fee.
-   Order summary.
-   Payment method abstraction.
-   Order confirmation.

Payment integration should be isolated behind a service interface so it
can be replaced or added later.

### 7.7 Orders

Order lifecycle:

`PLACED → CONFIRMED → PACKED → OUT_FOR_DELIVERY → DELIVERED`

Alternative states:

`CANCELLED`, `RETURN_REQUESTED`, `RETURNED`, `FAILED`

Every meaningful state change should be auditable.

### 7.8 Inventory

Support:

-   Current stock.
-   Reserved stock where required.
-   Low-stock threshold.
-   Stock adjustment.
-   Inventory transaction history.

Never silently mutate inventory without a traceable reason.

### 7.9 Delivery zones

Support:

-   Pincode.
-   City/town.
-   Zone name.
-   Delivery availability.
-   Delivery charge.
-   Estimated delivery time.
-   Minimum order if needed.
-   Active/inactive status.

### 7.10 Customer account

Support:

-   Profile.
-   Addresses.
-   Orders.
-   Order details.
-   Basic account settings.

### 7.11 Admin dashboard

At minimum:

-   Today's orders.
-   Sales summary.
-   Pending orders.
-   Low-stock products.
-   Recent orders.
-   Basic revenue/order charts.
-   Operational alerts.

### 7.12 Audit logs

Record sensitive business/admin actions such as:

-   Product price change.
-   Stock change.
-   Order status change.
-   User role change.
-   Delivery-zone change.
-   Product publish/unpublish.

------------------------------------------------------------------------

## 8. Non-Functional Requirements

### Performance

-   Mobile-first.
-   Minimize JavaScript shipped to the browser.
-   Optimize images.
-   Use caching for public catalog content.
-   Avoid unnecessary database queries.
-   Avoid waterfall requests.
-   Use pagination/cursors for large datasets.

### Scalability

Design toward:

-   Large product catalog.
-   Large customer base.
-   Large order history.
-   High read traffic.
-   CDN caching.
-   Horizontally scalable stateless application layer.

Do not claim a specific traffic capacity without testing.

### Reliability

-   Validate critical operations server-side.
-   Handle partial failures.
-   Avoid duplicate order creation.
-   Use idempotency where appropriate.
-   Keep order and inventory operations transaction-safe.

### Security

-   Never expose service-role credentials in browser code.
-   Use server-side authorization.
-   Use Supabase Row Level Security where appropriate.
-   Validate all untrusted input.
-   Protect admin routes.
-   Apply least privilege.
-   Do not trust client-provided price, stock, role, or order totals.

### Accessibility

Target WCAG-informed practices:

-   Keyboard navigation.
-   Semantic HTML.
-   Accessible labels.
-   Good contrast.
-   Visible focus states.
-   Meaningful error messages.
-   Alt text for meaningful images.

### SEO

Support:

-   Metadata.
-   Product metadata.
-   Category metadata.
-   Sitemap.
-   Robots configuration.
-   Canonical URLs where needed.
-   Structured data where appropriate.
-   Local-business information.

------------------------------------------------------------------------

## 9. Business Rules

1.  Product prices are controlled by the database/admin, not the client.
2.  Inventory availability is validated server-side.
3.  Customer cannot access another customer's private order data.
4.  Admin access requires explicit authorization.
5.  Disabled products should not be purchasable.
6.  Disabled delivery zones should reject new deliveries.
7.  Historical orders should preserve the price and product information
    applicable when the order was created.
8.  Product deletion should normally be soft deletion/deactivation if
    historical orders reference it.
9.  Every stock adjustment should have a reason.
10. Every important admin mutation should be auditable.
11. Never fabricate product specifications, prices, stock,
    compatibility, warranty, or delivery claims.
12. Customer-facing UI should clearly distinguish "in stock", "out of
    stock", and "availability unknown".
13. If payment integration is unavailable, do not simulate successful
    payment.
14. Do not expose internal database IDs unnecessarily in public URLs if
    a safe slug can be used.
15. Do not hard-code business data that belongs in the database.

------------------------------------------------------------------------

## 10. MVP Acceptance Criteria

MVP is acceptable only when:

-   A customer can browse categories.
-   A customer can search products.
-   A customer can view product details.
-   A customer can add/remove/change cart items.
-   A customer can check delivery availability.
-   A customer can create an order through the supported payment/COD
    flow.
-   Admin can log in securely.
-   Admin can manage products.
-   Admin can manage inventory.
-   Admin can manage orders.
-   Admin can manage delivery zones.
-   RLS/authorization prevents unauthorized access.
-   Critical workflows have tests.
-   Production environment variables are separated from local
    development.
-   The application can be deployed to Vercel with Supabase as the
    hosted backend.
-   No secrets are committed to GitHub.

------------------------------------------------------------------------

## 11. Success Metrics

Track eventually:

-   Product page views.
-   Search queries.
-   Add-to-cart rate.
-   Checkout initiation.
-   Order completion.
-   Average order value.
-   Delivery-zone demand.
-   Top products.
-   Low-stock frequency.
-   Customer repeat rate.
-   Search-to-product conversion.

Do not optimize for vanity traffic alone. The core business outcome is
useful local product discovery and completed business transactions.
