# Shiva Electrical & Electronics --- Design System & UX Specification

**Design objective:** Local trust + modern commerce + fast task
completion.

------------------------------------------------------------------------

## 1. Brand Direction

The design should communicate:

-   Reliability.
-   Local presence.
-   Technical expertise.
-   Genuine products.
-   Fast service.
-   Practicality.

Avoid a generic "AI startup" aesthetic.

Avoid excessive gradients, glassmorphism, unnecessary animations, and
visual clutter.

------------------------------------------------------------------------

## 2. Visual Principles

### Primary principle

Customers should find a product quickly.

### Secondary principle

Customers should understand whether the product is available and
deliverable.

### Tertiary principle

Customers should trust the shop enough to order/contact.

------------------------------------------------------------------------

## 3. Layout

Use a responsive layout:

``` text
Desktop
------------------------------------------------
Header
------------------------------------------------
Main content
------------------------------------------------
Footer
------------------------------------------------

Mobile
------------------------
Header
Search
Content
Bottom navigation/action
------------------------
```

Use consistent max-width containers.

Avoid excessive horizontal whitespace on mobile.

------------------------------------------------------------------------

## 4. Navigation

Desktop:

-   Home
-   Categories
-   Products
-   Services
-   About
-   Contact
-   Cart
-   Account

Mobile:

-   Home
-   Categories
-   Search
-   Cart
-   Account

Admin navigation is separate.

------------------------------------------------------------------------

## 5. Header

Must provide:

-   Logo/shop name.
-   Search.
-   Category access.
-   Cart.
-   Account.
-   Mobile menu.

Search should be visually prominent because product discovery is core.

------------------------------------------------------------------------

## 6. Product Card

A product card should communicate:

``` text
[Image]

Product Name
Brand / short descriptor

₹Price
MRP / discount if applicable

✓ In stock
or
Out of stock

[View Product]
[Add to Cart]
```

Do not overcrowd the card.

------------------------------------------------------------------------

## 7. Product Page

Recommended order:

1.  Product images.
2.  Product name.
3.  Price.
4.  Availability.
5.  Delivery check.
6.  Quantity.
7.  Add to cart.
8.  Description.
9.  Specifications.
10. Compatibility.
11. Warranty.
12. Related products.
13. Support/contact.

------------------------------------------------------------------------

## 8. Search UX

Search should:

-   Show suggestions when useful.
-   Handle common spelling differences.
-   Show zero-result guidance.
-   Preserve query.
-   Provide filters.

Example zero state:

``` text
No products found for "xyz"

Try:
- Checking spelling
- Searching a shorter term
- Browsing categories

[Browse RO Spare Parts]
```

------------------------------------------------------------------------

## 9. Checkout UX

Keep checkout focused.

Steps:

``` text
Cart
 ↓
Address
 ↓
Delivery
 ↓
Payment
 ↓
Review
 ↓
Confirmation
```

Do not force unnecessary fields.

Show total clearly.

------------------------------------------------------------------------

## 10. Order Confirmation

Display:

-   Order number.
-   Items.
-   Total.
-   Delivery address summary.
-   Expected delivery information.
-   Order status.
-   Contact/support option.

------------------------------------------------------------------------

## 11. Admin UX

Admin is an operational tool, not a marketing website.

Prioritize:

-   Tables.
-   Filters.
-   Search.
-   Bulk operations where safe.
-   Clear status badges.
-   Fast editing.
-   Inventory visibility.
-   Alerts.

Dashboard should show operational information before decorative charts.

------------------------------------------------------------------------

## 12. Status Colors

Color must never be the only status indicator.

Example:

``` text
✓ Delivered
● Confirmed
● Packed
→ Out for delivery
! Attention
× Cancelled
```

Use icon/text + color.

------------------------------------------------------------------------

## 13. Loading States

Use skeletons for content-heavy areas.

Avoid full-screen loading spinners unless the entire application truly
cannot render.

------------------------------------------------------------------------

## 14. Empty States

Every list should have a useful empty state.

Examples:

-   No products.
-   Empty cart.
-   No orders.
-   No search results.
-   No low-stock items.

------------------------------------------------------------------------

## 15. Error States

Errors should tell the user:

1.  What happened.
2.  What they can do.
3.  Whether the action was saved.

Example:

``` text
We couldn't place your order.

Your cart has not been charged.

[Try Again]
[Contact Shop]
```

------------------------------------------------------------------------

## 16. Typography

Prioritize readability.

Use a clean modern sans-serif font.

Hierarchy:

-   Page title.
-   Section heading.
-   Product name.
-   Price.
-   Supporting text.

Avoid using many font families.

------------------------------------------------------------------------

## 17. Images

Product images should:

-   Have consistent aspect ratio.
-   Use optimized formats where supported.
-   Be responsive.
-   Include useful alt text.
-   Have predictable object positioning.

Do not stretch product images.

------------------------------------------------------------------------

## 18. Responsive Breakpoints

Do not design only for one desktop width.

Test at minimum:

-   Small mobile.
-   Standard mobile.
-   Tablet.
-   Laptop.
-   Large desktop.

------------------------------------------------------------------------

## 19. Accessibility

Minimum:

-   Keyboard navigation.
-   Focus indicators.
-   Semantic elements.
-   Labels.
-   Accessible dialogs.
-   Accessible error messages.
-   Sufficient contrast.
-   Touch targets appropriate for mobile.

------------------------------------------------------------------------

## 20. Motion

Use motion only to communicate:

-   State changes.
-   Navigation.
-   Feedback.

Avoid animation that slows task completion.

Respect reduced-motion preferences.

------------------------------------------------------------------------

## 21. Local Business Trust

Include genuine business information once provided:

-   Shop location.
-   Service area.
-   Phone/WhatsApp.
-   Business hours.
-   Delivery information.
-   Warranty/return policy.
-   Installation/service availability.

Never invent these values.

------------------------------------------------------------------------

## 22. Design Acceptance Test

A page is not design-complete if:

-   Mobile layout breaks.
-   Buttons are ambiguous.
-   Important information is hidden.
-   Error states are missing.
-   Loading state is broken.
-   Text is unreadable.
-   Checkout requires unnecessary steps.
-   Admin needs excessive clicks for routine operations.
