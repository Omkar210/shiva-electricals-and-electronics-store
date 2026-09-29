# Vulnerability Findings & Remediation Log

This document provides a detailed breakdown of all security weaknesses identified during the audit, their technical root causes, CVSS v3.1 severity scores, remediation implementations, and verification evidence.

---

### Finding 1: Insecure Direct Object Reference (IDOR) & PII Harvesting on Order Details
- **Vulnerability Type**: CWE-639 (Authorization Bypass Through User-Controlled Key) / OWASP 2025 A01 (Broken Access Control)
- **Severity**: **HIGH** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N — Base Score 7.5)
- **Affected Endpoints**:
  - `app/orders/[orderNumber]/page.tsx`
  - `app/checkout/confirmation/[orderNumber]/page.tsx`
- **Root Cause**:
  `getOrderByNumber` invoked `createAdminClient()`, querying the database with service-role permissions. The rendering component accepted any `orderNumber` parameter from the URL route without checking if the requester was the authenticated account owner, a staff/admin member, or held a valid session cookie for that order. Anyone knowing or brute-forcing an order number format could view customer full names, mobile phone numbers, exact doorstep delivery addresses, landmarks, ordered products, and invoice figures.
- **Remediation**:
  1. Implemented `isOrderAuthorized(order)` server guard in `lib/orders/auth.ts`:
     - Checks if caller is authenticated staff/admin (`profile.role === 'admin' || 'staff'`).
     - Checks if caller is the authenticated owner (`user.id === order.user_id`).
     - Checks if caller possesses the cryptographically set HttpOnly session cookie `shiva_order_auth_${orderNumber}` established during checkout.
  2. Implemented `OrderVerificationCard.tsx` client component: If an unauthenticated visitor accesses an order route without an active session cookie, sensitive PII is suppressed, and they must verify the 10-digit mobile number associated with the order.
  3. Created `verifyGuestOrderAccessAction` in `app/orders/actions.ts` protected by strict IP rate limiting (5 attempts/min) to prevent brute-forcing mobile numbers against order IDs.
  4. Strengthened `generateOrderNumber()` in `lib/orders/service.ts` from `Math.random` to cryptographically secure `crypto.randomInt(100000, 999999)`.
- **Verification**: Verified via Next.js server component rendering and automated unit tests.

---

### Finding 2: Server-Side Request Forgery (SSRF) Risk via Google Drive Webhook URL
- **Vulnerability Type**: CWE-918 (Server-Side Request Forgery) / OWASP 2025 A10 (Server-Side Request Forgery)
- **Severity**: **MEDIUM** (CVSS:3.1/AV:N/AC:H/PR:H/UI:N/S:C/C:H/I:L/A:N — Base Score 6.6)
- **Affected Endpoint**:
  - `app/admin/products/media-actions.ts` (`uploadProductImageToDriveAction`)
- **Root Cause**:
  `uploadProductImageToDriveAction` read `process.env.GOOGLE_DRIVE_UPLOAD_URL` and performed an outbound `fetch(uploadUrl, ...)` with an image payload without protocol validation, loopback prevention, or domain allowlisting. If configured with a malicious or internal IP, it could hit internal cloud metadata services (e.g., `http://169.254.169.254/`) or internal network services.
- **Remediation**:
  Created `validateSafeExternalUrl(url)` in `lib/security/validation.ts`:
  - Enforces `https:` protocol only.
  - Blocks `localhost`, `.local`, `.internal`, and `.lan` hostnames.
  - Blocks RFC1918 private IPv4 ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopbacks (`127.0.0.0/8`), link-local/cloud metadata (`169.254.0.0/16`), and direct IPv6 literal notations.
  - Enforces strict domain allowlisting matching approved Google infrastructure (`script.google.com`, `googleapis.com`, `drive.google.com`).
- **Verification**: Automated tests in `tests/security.test.ts` verify blocking of internal IP addresses and acceptance of valid Google hosts.

---

### Finding 3: Missing Rate Limiting Across Authentication & Critical Actions
- **Vulnerability Type**: CWE-307 (Improper Restriction of Excessive Authentication Attempts) / OWASP API4:2023 (Unrestricted Resource Consumption)
- **Severity**: **HIGH** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:H — Base Score 8.6)
- **Affected Actions**:
  - `app/auth/actions.ts` (`login`, `signup`)
  - `app/checkout/actions.ts` (`handlePlaceOrder`)
  - `app/admin/products/media-actions.ts` (`uploadProductImageToDriveAction`)
- **Root Cause**:
  Endpoints lacked request frequency tracking, sliding-window throttling, and IP-based rate limiting. Adversaries could conduct automated credential stuffing, mass account creation, order flooding, and media upload resource exhaustion.
- **Remediation**:
  Built `lib/security/rate-limit.ts` providing:
  - In-memory sliding-window log with automatic 5-minute memory eviction.
  - Independent, isolated buckets:
    - `auth`: 5 requests per 60s window (IP and email keys).
    - `checkout`: 5 requests per 120s window (IP and phone keys).
    - `media`: 15 requests per 60s window (IP key).
    - `public`: 60 requests per 60s window (IP key).
  - Environment-configurable overrides (`RATE_LIMIT_AUTH_MAX`, `RATE_LIMIT_CHECKOUT_MAX`, etc.).
  - Returns `GENERIC_RATE_LIMIT_ERROR`: `"Too many requests. For your security, please slow down and try again shortly."` without disclosing bucket status, attempt counters, or account existence.
- **Verification**: Unit tests in `tests/security.test.ts` verify sliding window enforcement and strict bucket isolation.

---

### Finding 4: Open Redirect Vulnerability in Authentication Flow
- **Vulnerability Type**: CWE-601 (URL Redirection to Untrusted Site) / OWASP 2025 A07
- **Severity**: **MEDIUM** (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N — Base Score 6.1)
- **Affected Endpoint**:
  - `app/auth/actions.ts` (`login`)
- **Root Cause**:
  The `redirect` parameter from `formData.get("redirect")` was passed directly to Next.js `redirect(redirectTo)`. Attackers could forge phishing links like `/login?redirect=https://evil.com` or `//evil.com`, redirecting victim users to external credential-stealing portals post-authentication.
- **Remediation**:
  Implemented `validateSafeRedirect(url, fallback)` in `lib/security/validation.ts`:
  - Rejects URLs not starting with `/`.
  - Rejects protocol-relative URLs (`//`).
  - Rejects backslash obfuscation (`/\`, `\\`).
  - Rejects URL schemes or pseudo-protocols (`javascript:`, `data:`, `http:`).
  - Rejects control characters or line breaks.
  - Falls back safely to `/account`.
- **Verification**: 5 dedicated test assertions in `tests/security.test.ts`.

---

### Finding 5: MIME-Type Spoofing & Arbitrary File Upload Vulnerability
- **Vulnerability Type**: CWE-434 (Unrestricted Upload of File with Dangerous Type) / OWASP 2025 A04
- **Severity**: **HIGH** (CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H — Base Score 7.2)
- **Affected Modules**:
  - `lib/catalog/media.ts` (`uploadProductImage`)
  - `app/admin/products/media-actions.ts` (`uploadProductImageToDriveAction`)
- **Root Cause**:
  Validation relied solely on client-supplied `file.type` and file extension strings without inspecting raw binary payloads. An attacker with compromised admin credentials or manipulated multipart headers could upload web shells, HTML files containing stored XSS payloads, or polyglots.
- **Remediation**:
  Implemented `validateImageMagicBytes(buffer)` in `lib/security/validation.ts`:
  - Inspects file headers directly from raw `Buffer`:
    - JPEG: `FF D8 FF`
    - PNG: `89 50 4E 47 0D 0A 1A 0A`
    - WebP: `RIFF` ... `WEBP`
    - AVIF: `ftypavif` / `ftypavis` / `ftypmif1`
  - Rejects any file failing binary signature verification prior to external storage dispatch.
- **Verification**: Verified with authentic images and malicious mock payloads (PHP, HTML scripts) in `tests/security.test.ts`.

---

### Finding 6: Missing HTTP Security Headers & Clickjacking Exposure
- **Vulnerability Type**: CWE-1021 (Improper Restriction of Rendered UI Layers) / CWE-693 (Protection Mechanism Failure)
- **Severity**: **MEDIUM** (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N — Base Score 5.4)
- **Root Cause**:
  `next.config.ts` lacked security header configurations. The application did not declare Content-Security-Policy, HSTS, frame-ancestors, or nosniff headers, leaving users vulnerable to clickjacking inside iframes and MIME-confusion attacks.
- **Remediation**:
  Added global security headers in `next.config.ts`:
  - `Content-Security-Policy`: Restricts scripts, styles, images (`*.supabase.co`, `images.unsplash.com`, `drive.google.com`, `lh3.googleusercontent.com`), frames (`frame-ancestors 'none'`), and forms.
  - `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`
  - `X-Frame-Options`: `DENY`
  - `X-Content-Type-Options`: `nosniff`
  - `Referrer-Policy`: `strict-origin-when-cross-origin`
  - `Permissions-Policy`: `camera=(), microphone=(), geolocation=(), browsing-topics=()`
- **Verification**: Verified during `next build` header generation and routing tests.

---

### Finding 7: Information Disclosure in Media Streaming API 500 Responses
- **Vulnerability Type**: CWE-209 (Generation of Error Message Containing Sensitive Information) / OWASP 2025 A05
- **Severity**: **LOW** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N — Base Score 5.3)
- **Affected Routes**:
  - `app/api/media/drive/[fileId]/route.ts`
  - `app/api/media/drive/product/[productId]/route.ts`
- **Root Cause**:
  On runtime errors, routes returned `new Response(\`Failed to retrieve file: \${message}\`, { status: 500 })`. Exception strings could leak Google Drive API internal errors, service account identity details, or system stack traces.
- **Remediation**:
  Replaced dynamic exception echoes with sanitized generic client error responses (`"Failed to retrieve media file"` / `"Failed to retrieve product media"`) while preserving detailed diagnostic logs strictly in server-side `console.error`.
- **Verification**: Inspected route handlers and confirmed sanitized string responses.
