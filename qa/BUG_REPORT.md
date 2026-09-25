# QA Defect & Bug Report

**Application**: Shiva Electrical & Electronics  
**Target URL**: `http://localhost:3000`  
**Test Cycle**: Comprehensive Multi-Agent QA Testing Cycle  
**Date**: September 25, 2026  
**Status**: Completed  

---

## 1. Executive Summary & Defect Metrics

### Testing Runs & Pass/Fail Ratio
- **Total Test Cases Executed**: 35
- **Passed**: 32 (91.4%)
- **Confirmed Bugs**: 4
- **Critical Blockers (P0)**: 0
- **Major Features Defective (P1)**: 1
- **Important Defect with Workaround (P2)**: 0
- **Minor Defect / Inconsistency (P3)**: 1
- **Cosmetic / Visual / Semantic (P4)**: 2

### Severity Distribution
```
[P0 - Blocker]   : 0  (0.0%)
[P1 - Major]     : 1 (25.0%)
[P2 - Important] : 0  (0.0%)
[P3 - Minor]     : 1 (25.0%)
[P4 - Cosmetic]  : 2 (50.0%)
```

---

## 2. Confirmed Defect Details

### BUG-001 [Severity: P1 — Major Feature / Setup Defect]
- **Bug ID**: `BUG-SHIVA-001`
- **Severity**: **P1 (Major)**
- **Title**: Invalid Non-Hex Characters in UUID Primary Keys in `seed.sql` Breaks Database Migration & Seeding
- **Target File / URL**: [seed.sql](file:///d:/learning/Shiva_Electrical/supabase/seed.sql#L42)
- **Status**: **CONFIRMED BUG**
- **Evidence Path**: [qa/evidence/TEST-CONCURRENCY-01-report.json](file:///d:/learning/Shiva_Electrical/qa/evidence/TEST-CONCURRENCY-01-report.json)

#### Reproduction Steps
1. Attempt to execute the standard project seed script `supabase/seed.sql` against the Supabase PostgreSQL database.
2. Observe product insertion queries:
   ```sql
   INSERT INTO public.products (id, category_id, brand_id, name, slug, sku, ...)
   VALUES ('p1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', ...);
   ```

#### Expected Behavior
The database seed script should execute cleanly and populate the catalog with demo products, allowing the storefront and admin interfaces to render initial items out of the box.

#### Actual Behavior
PostgreSQL rejects the queries with error code `22P02` because the character `'p'` is not a valid hexadecimal character in UUID representation:
```
code: '22P02',
message: 'invalid input syntax for type uuid: "p1000000-0000-0000-0000-000000000001"'
```
As a result, no products were seeded, leaving the catalog at `/products` empty (0 items) on fresh deployments until manually corrected with valid hex UUIDs (e.g., `a1000000-...`).

#### Console / Network Error Snippet
```json
{
  "code": "22P02",
  "details": null,
  "hint": null,
  "message": "invalid input syntax for type uuid: \"p1000000-0000-0000-0000-000000000001\""
}
```

#### Impact Analysis
**High**. Any new developer onboarding or CI/CD automated staging build running `supabase db reset` or `supabase db seed` will fail to seed products, resulting in an empty storefront and broken catalog tests.

---

### BUG-002 [Severity: P3 — Minor Defect / SEO & Metadata Mismatch]
- **Bug ID**: `BUG-SHIVA-002`
- **Severity**: **P3 (Minor)**
- **Title**: `generateMetadata` Sets Misleading "Confirmed" Title on Non-Existent Order 404 Pages
- **Target File / URL**: [page.tsx](file:///d:/learning/Shiva_Electrical/app/checkout/confirmation/%5BorderNumber%5D/page.tsx#L19-L26) (`http://localhost:3000/checkout/confirmation/SE-NONEXISTENT-9999`)
- **Status**: **CONFIRMED BUG**
- **Evidence Path**: [qa/evidence/TEST-ADVERSARIAL-02-fake-order-meta-mismatch.png](file:///d:/learning/Shiva_Electrical/qa/evidence/TEST-ADVERSARIAL-02-fake-order-meta-mismatch.png)

#### Reproduction Steps
1. Navigate to an arbitrary or forged order confirmation URL:
   `http://localhost:3000/checkout/confirmation/SE-NONEXISTENT-9999`
2. Inspect the browser document `<title>` in the browser tab and DOM `<head>`.
3. Compare the title with the page body.

#### Expected Behavior
When an order number does not exist, the page metadata title should reflect a 404 or "Order Not Found", matching the `notFound()` page rendered by the body.

#### Actual Behavior
The `<title>` is generated purely by interpolating the raw route parameter without verifying order existence:
```ts
export async function generateMetadata({ params }: ConfirmationPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Order ${orderNumber} Confirmed` };
}
```
The browser tab displays:
`Order SE-NONEXISTENT-9999 Confirmed | Shiva Electrical & Electronics`, while the body displays `404 Page not found`.

#### Impact Analysis
**Low to Medium**. Causes confusing user experience if an invalid link is shared or bookmarked; search engines indexing deep links may index 404 pages as successful orders.

---

### BUG-003 [Severity: P4 — Cosmetic / Accessibility / Semantic HTML]
- **Bug ID**: `BUG-SHIVA-003`
- **Severity**: **P4 (Cosmetic / Accessibility)**
- **Title**: Nested `<main>` Landmark Elements Violate HTML5 & WAI-ARIA Specifications
- **Target File / URL**: [layout.tsx](file:///d:/learning/Shiva_Electrical/app/admin/layout.tsx#L95) and [layout.tsx](file:///d:/learning/Shiva_Electrical/app/layout.tsx#L41)
- **Status**: **CONFIRMED BUG**
- **Evidence Path**: Playwright strict mode resolution log: `locator('main') resolved to 2 elements`

#### Reproduction Steps
1. Navigate to any admin portal route, e.g. `http://localhost:3000/admin/products`.
2. Inspect the DOM hierarchy in Developer Tools or query `document.querySelectorAll('main')`.
3. Observe:
   - Root layout (`app/layout.tsx`): `<main class="flex-1">`
   - Child admin layout (`app/admin/layout.tsx`): `<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">`

#### Expected Behavior
An HTML document should have exactly one top-level `<main>` landmark. Sub-layouts should use `<section>`, `<div>`, or `<div role="region">`.

#### Actual Behavior
Two nested `<main>` landmark elements are rendered in the DOM. This causes:
1. Screen readers to announce multiple primary content areas, confusing visually impaired users.
2. Playwright test scripts using `page.locator('main')` to fail with strict mode violation (`strict mode violation: locator('main') resolved to 2 elements`).

#### Impact Analysis
**Low**. Does not prevent functional use, but violates accessibility standards and breaks clean test automation locators.

---

### BUG-004 [Severity: P4 — Minor / Cosmetic]
- **Bug ID**: `BUG-SHIVA-004`
- **Severity**: **P4 (Cosmetic)**
- **Title**: Missing Static `/favicon.ico` Generates Recurring 404 Console Errors
- **Target URL**: `http://localhost:3000/favicon.ico`
- **Status**: **CONFIRMED BUG**
- **Evidence Path**: [qa/evidence/TEST-SMOKE-console.log](file:///d:/learning/Shiva_Electrical/qa/evidence/TEST-SMOKE-console.log)

#### Reproduction Steps
1. Open Chrome DevTools Network / Console tabs.
2. Navigate to `http://localhost:3000`.
3. Observe console error:
   ```
   [ERROR] Failed to load resource: the server responded with a status of 404 (Not Found) @ http://localhost:3000/favicon.ico:0
   ```

#### Expected Behavior
A valid favicon asset or `app/icon.png` / `app/favicon.ico` should be present in the public/app directory to return HTTP 200.

#### Actual Behavior
Returns HTTP 404 (Not Found) on every fresh tab load.

#### Impact Analysis
**Minimal**. Cosmetic defect; pollutes client-side error logs and monitoring.
