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
