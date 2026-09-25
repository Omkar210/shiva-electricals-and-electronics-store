# Shiva Electrical & Electronics — Design System & Living Contract

> **One-liner:** *Modern technology underneath. Familiar simplicity on top.* Built specifically for customers aged 40–70, prioritizing high contrast, large legible typography (16–18px body), clear 48px touch targets, explicit button wording, and zero confusing decorative gimmicks.

---

## 1. Target Audience & Core Principles

* **Target Demographic:** Adults and seniors aged 40–70 looking for genuine RO water purifiers, replacement filter cartridges, home electricals, and certified local technician installation.
* **Core Philosophy:** **Clarity > Decoration.** Every element on screen must inform, guide, or reassure the user.
* **Design Tenets:**
  1. **Familiarity Over Novelty:** Prefer standard ecommerce conventions over clever micro-interactions.
  2. **High Visual Legibility:** Never drop below 14px for metadata; use 16px for body text; ensure minimum 4.5:1 contrast against all backgrounds.
  3. **Generous Touch & Click Targets:** Every interactive button, input, or link must have a target of at least 44px–48px height.
  4. **Plain Language & Phone Reassurance:** Clear plain-English/local copy with visible phone numbers for older users who prefer speaking with a human technician.

---

## 2. Color Palette & Token Budget

Tokens are defined in [app/globals.css](file:///d:/learning/Shiva_Electrical/app/globals.css) and consumed via Tailwind classes.

| Token Role | Hex / Class | Purpose & Accessibility |
| :--- | :--- | :--- |
| **Primary Brand** | `#1d4ed8` (`blue-700`) | Primary buttons, active tabs, verified store badges. Contrast > 7:1 on white. |
| **Primary Hover** | `#1e40af` (`blue-800`) | Interactive hover & focus states. |
| **Brand Soft Surface** | `#eff6ff` (`blue-50`) | Highlight panels, hero trust cards, delivery zones. |
| **Canvas Background** | `#ffffff` / `#f8fafc` (`slate-50`) | Clean background, high visual rest. |
| **Surface Card** | `#ffffff` with `#e2e8f0` border | Content containers with solid boundary lines. |
| **Primary Text** | `#0f172a` (`slate-900`) | Headings and titles. Deep contrast. |
| **Body Text** | `#334155` (`slate-700`) | Standard readable paragraphs and specs. |
| **Secondary / Subtext**| `#475569` (`slate-600`) | Captions, dates, SKU numbers. Never lower contrast. |
| **Success (In-Stock)** | `#047857` (`emerald-700`) on `#ecfdf5` | Positive fulfillment, available inventory. |
| **Warning (Low-Stock)** | `#b45309` (`amber-700`) on `#fffbeb` | Pincode alerts, low stock indicators. |
| **Danger (Out-of-Stock)**| `#b91c1c` (`red-700`) on `#fef2f2` | Critical error alerts, order cancellations. |

---

## 3. Typography Scale & Hierarchy

All typography uses **Inter** via `next/font/google` in [app/layout.tsx](file:///d:/learning/Shiva_Electrical/app/layout.tsx).

* **Page Title (H1):** `text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight` (28–36px)
* **Section Heading (H2):** `text-xl sm:text-2xl font-bold text-slate-900 leading-snug` (22–26px)
* **Card Title / Subhead (H3):** `text-lg font-semibold text-slate-900` (18–20px)
* **Default Body:** `text-base text-slate-700 leading-relaxed` (16px, 1.6 line height)
* **Form Inputs & Button Text:** `text-base font-semibold` (16px — prevents automatic mobile zoom)
* **Labels & Metadata Floor:** `text-sm font-medium text-slate-600` (14px — strict lower boundary for readability)

---

## 4. Component Rules

### Buttons ([components/ui/button.tsx](file:///d:/learning/Shiva_Electrical/components/ui/button.tsx))
* Minimum height: 44px (small/inline) to 48px–50px (default/primary).
* Corner radius: `rounded-lg` (8px).
* Font weight: `font-semibold text-base`.
* Every primary action must have an explicit verb label: *"Add to Cart"*, *"Call for Installation"*, *"Verify Pincode"*, *"Place Order Now"*.
* Never use ambiguous icon-only buttons for primary workflows. Always include clear accompanying text.

### Form Inputs ([components/ui/input.tsx](file:///d:/learning/Shiva_Electrical/components/ui/input.tsx))
* Height: 48px.
* Border: `border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20`.
* Labels: Always visible `<label>` positioned directly above the input with `text-sm font-bold text-slate-800`. Never rely on placeholder text as the label.
* Error states: Explicit message below the input with red border and clear instructions on how to fix.

### Cards & Grouping ([components/ui/card.tsx](file:///d:/learning/Shiva_Electrical/components/ui/card.tsx))
* Containers use `rounded-xl border border-slate-200 bg-white shadow-xs`.
* Do not nest cards inside cards. Use subtle spacing and divider lines (`border-slate-100`) to organize content.

### Dialogs & Modals ([components/ui/dialog.tsx](file:///d:/learning/Shiva_Electrical/components/ui/dialog.tsx))
* Backdrop: `bg-slate-900/60 backdrop-blur-xs`.
* Prominent close button with both an `X` icon and accessible text label.
* Trap focus inside dialog; close on ESC key; close on backdrop click.

---

## 5. Senior-Friendly Usability Checklist (Per Page)

Before shipping any page update:
- [ ] Is all body text at least 16px? Is all secondary text at least 14px?
- [ ] Do all clickable buttons and form inputs meet the 48px touch target standard?
- [ ] Is there a visible contact phone number (`+91 98765 43210`) easily accessible for assistance?
- [ ] Are buttons labeled with clear, unambiguous action verbs?
- [ ] Are stock statuses (In Stock / Out of Stock) indicated with both clear text and colored badges?
- [ ] Does keyboard navigation show a bold focus ring (`outline: 2px solid #1d4ed8`)?
- [ ] Are all forms resilient with helpful plain-language error messages?
