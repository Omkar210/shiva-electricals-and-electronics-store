import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canCustomerCancelOrder,
  calculateOrderFinancials,
  canUploadProductMedia,
} from "../lib/business-rules.ts";

describe("Security & Authorization Guardrails", () => {
  describe("Customer Self-Cancellation Permissions", () => {
    const userId = "usr_authenticated_123";
    const otherUserId = "usr_stranger_456";

    it("permits order cancellation when user is the owner and status is PLACED", () => {
      const result = canCustomerCancelOrder({
        orderStatus: "PLACED",
        orderUserId: userId,
        currentUserId: userId,
      });

      assert.equal(result.canCancel, true);
      assert.equal(result.error, undefined);
    });

    it("strictly blocks cancellation if requester is not the order owner", () => {
      const result = canCustomerCancelOrder({
        orderStatus: "PLACED",
        orderUserId: otherUserId,
        currentUserId: userId,
      });

      assert.equal(result.canCancel, false);
      assert.ok(result.error?.includes("not authorized"));
    });

    it("strictly blocks cancellation if order owner is null (guest order)", () => {
      const result = canCustomerCancelOrder({
        orderStatus: "PLACED",
        orderUserId: null,
        currentUserId: userId,
      });

      assert.equal(result.canCancel, false);
      assert.ok(result.error?.includes("not authorized"));
    });

    it("prevents customer self-cancellation once order is CONFIRMED or in processing", () => {
      const confirmed = canCustomerCancelOrder({
        orderStatus: "CONFIRMED",
        orderUserId: userId,
        currentUserId: userId,
      });
      assert.equal(confirmed.canCancel, false);
      assert.ok(confirmed.error?.includes("cannot be self-cancelled"));

      const packed = canCustomerCancelOrder({
        orderStatus: "PACKED",
        orderUserId: userId,
        currentUserId: userId,
      });
      assert.equal(packed.canCancel, false);

      const outForDelivery = canCustomerCancelOrder({
        orderStatus: "OUT_FOR_DELIVERY",
        orderUserId: userId,
        currentUserId: userId,
      });
      assert.equal(outForDelivery.canCancel, false);

      const delivered = canCustomerCancelOrder({
        orderStatus: "DELIVERED",
        orderUserId: userId,
        currentUserId: userId,
      });
      assert.equal(delivered.canCancel, false);
    });
  });

  describe("Tampering & Payload Injection Protection", () => {
    it("neutralizes negative quantity injection attacks", () => {
      const result = calculateOrderFinancials({
        items: [
          { unitPrice: 15000, quantity: -2 }, // Injection attempt
          { unitPrice: 500, quantity: 1 },
        ],
        deliveryFee: 100,
      });

      // Quantity must be sanitized to 0
      assert.equal(result.itemCount, 1);
      assert.equal(result.subtotal, 500);
      assert.equal(result.total, 600);
    });

    it("neutralizes negative price injection attacks", () => {
      const result = calculateOrderFinancials({
        items: [
          { unitPrice: -5000, quantity: 2 }, // Injection attempt
          { unitPrice: 1000, quantity: 1 },
        ],
      });

      // Unit price sanitized to 0
      assert.equal(result.subtotal, 1000);
      assert.equal(result.total, 1000);
    });

    it("ensures subtotal and total can never drop below zero regardless of discount manipulation", () => {
      const result = calculateOrderFinancials({
        items: [{ unitPrice: 200, quantity: 1 }],
        deliveryFee: 50,
        discount: 9999999, // Giant discount injection
      });

      assert.equal(result.subtotal, 200);
      assert.equal(result.discount, 200); // Capped at subtotal
      assert.equal(result.total, 50); // Subtotal(200) - Disc(200) + Del(50) = 50
    });
  });

  describe("Media Upload Role Authorization", () => {
    it("strictly allows admin role to upload media", () => {
      assert.equal(canUploadProductMedia("admin"), true);
    });

    it("blocks staff role from uploading media", () => {
      assert.equal(canUploadProductMedia("staff"), false);
    });

    it("blocks customer role from uploading media", () => {
      assert.equal(canUploadProductMedia("customer"), false);
    });

    it("blocks unauthenticated or undefined roles from uploading media", () => {
      assert.equal(canUploadProductMedia(undefined), false);
      assert.equal(canUploadProductMedia(null), false);
      assert.equal(canUploadProductMedia("guest"), false);
      assert.equal(canUploadProductMedia(""), false);
    });
  });

  describe("Configurable Rate Limiting Guardrails", () => {
    // Dynamically import rate limit utilities
    it("enforces sliding window limits and blocks on exceeding threshold", async () => {
      const { checkRateLimit, resetRateLimit } = await import("../lib/security/rate-limit.ts");
      const testKey = "test_attacker_ip";

      resetRateLimit("auth", testKey);

      // Max 5 attempts
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit("auth", testKey, { maxRequests: 5, windowMs: 1000 });
        assert.equal(res.allowed, true, `Attempt ${i + 1} should be allowed`);
      }

      // 6th attempt must be rejected
      const blockedRes = checkRateLimit("auth", testKey, { maxRequests: 5, windowMs: 1000 });
      assert.equal(blockedRes.allowed, false);
      assert.ok(blockedRes.retryAfterSeconds > 0);

      // Reset and verify clean state
      resetRateLimit("auth", testKey);
      const afterReset = checkRateLimit("auth", testKey, { maxRequests: 5, windowMs: 1000 });
      assert.equal(afterReset.allowed, true);
    });

    it("maintains strict isolation between different rate limit buckets", async () => {
      const { checkRateLimit, resetRateLimit } = await import("../lib/security/rate-limit.ts");
      const clientKey = "shared_client_ip";

      resetRateLimit("auth", clientKey);
      resetRateLimit("public", clientKey);

      // Exhaust auth bucket (limit 2 for test)
      checkRateLimit("auth", clientKey, { maxRequests: 2, windowMs: 5000 });
      checkRateLimit("auth", clientKey, { maxRequests: 2, windowMs: 5000 });
      const authBlocked = checkRateLimit("auth", clientKey, { maxRequests: 2, windowMs: 5000 });
      assert.equal(authBlocked.allowed, false);

      // Public bucket for the exact same IP must remain unaffected
      const publicAllowed = checkRateLimit("public", clientKey, { maxRequests: 10, windowMs: 5000 });
      assert.equal(publicAllowed.allowed, true);
    });
  });

  describe("Open Redirect Protection", () => {
    it("blocks absolute URLs to external domains", async () => {
      const { validateSafeRedirect } = await import("../lib/security/validation.ts");
      assert.equal(validateSafeRedirect("https://malicious.com"), "/account");
      assert.equal(validateSafeRedirect("http://evil.com/login"), "/account");
    });

    it("blocks protocol-relative URLs", async () => {
      const { validateSafeRedirect } = await import("../lib/security/validation.ts");
      assert.equal(validateSafeRedirect("//malicious.com"), "/account");
      assert.equal(validateSafeRedirect("//evil.com/phishing"), "/account");
    });

    it("blocks backslash bypass attempts", async () => {
      const { validateSafeRedirect } = await import("../lib/security/validation.ts");
      assert.equal(validateSafeRedirect("/\\malicious.com"), "/account");
      assert.equal(validateSafeRedirect("\\\\evil.com"), "/account");
    });

    it("blocks javascript: and data: pseudo-protocols", async () => {
      const { validateSafeRedirect } = await import("../lib/security/validation.ts");
      assert.equal(validateSafeRedirect("javascript:alert(1)"), "/account");
      assert.equal(validateSafeRedirect("/javascript:alert(1)"), "/account");
      assert.equal(validateSafeRedirect("data:text/html,<script>alert(1)</script>"), "/account");
    });

    it("allows valid, sanitized internal application paths", async () => {
      const { validateSafeRedirect } = await import("../lib/security/validation.ts");
      assert.equal(validateSafeRedirect("/orders"), "/orders");
      assert.equal(validateSafeRedirect("/checkout"), "/checkout");
      assert.equal(validateSafeRedirect("/admin/products"), "/admin/products");
    });
  });

  describe("Server-Side Request Forgery (SSRF) Protection", () => {
    it("blocks loopback and private IPv4 ranges", async () => {
      const { validateSafeExternalUrl } = await import("../lib/security/validation.ts");

      assert.equal(validateSafeExternalUrl("http://127.0.0.1/upload").valid, false);
      assert.equal(validateSafeExternalUrl("https://127.0.0.1:8080").valid, false);
      assert.equal(validateSafeExternalUrl("https://10.0.0.5/api").valid, false);
      assert.equal(validateSafeExternalUrl("https://192.168.1.100").valid, false);
      assert.equal(validateSafeExternalUrl("https://172.16.0.1").valid, false);
    });

    it("blocks cloud metadata service (AWS/GCP/Azure 169.254.169.254)", async () => {
      const { validateSafeExternalUrl } = await import("../lib/security/validation.ts");
      const res = validateSafeExternalUrl("https://169.254.169.254/latest/meta-data/");
      assert.equal(res.valid, false);
      assert.ok(res.error?.includes("prohibited"));
    });

    it("blocks insecure plain HTTP URLs", async () => {
      const { validateSafeExternalUrl } = await import("../lib/security/validation.ts");
      const res = validateSafeExternalUrl("http://script.google.com/macros/s/xyz");
      assert.equal(res.valid, false);
      assert.ok(res.error?.includes("HTTPS"));
    });

    it("permits approved HTTPS Google domains", async () => {
      const { validateSafeExternalUrl } = await import("../lib/security/validation.ts");
      const res = validateSafeExternalUrl("https://script.google.com/macros/s/xyz/exec");
      assert.equal(res.valid, true);
    });
  });

  describe("Deep Image Magic Bytes Verification (File Upload Hardening)", () => {
    it("validates authentic JPEG file signatures", async () => {
      const { validateImageMagicBytes } = await import("../lib/security/validation.ts");
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      const res = validateImageMagicBytes(jpegBuffer);
      assert.equal(res.valid, true);
      assert.equal(res.detectedMime, "image/jpeg");
    });

    it("validates authentic PNG file signatures", async () => {
      const { validateImageMagicBytes } = await import("../lib/security/validation.ts");
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
      const res = validateImageMagicBytes(pngBuffer);
      assert.equal(res.valid, true);
      assert.equal(res.detectedMime, "image/png");
    });

    it("validates authentic WebP file signatures", async () => {
      const { validateImageMagicBytes } = await import("../lib/security/validation.ts");
      // 'RIFF' + 4 dummy bytes + 'WEBP'
      const webpBuffer = Buffer.from("RIFF\x00\x00\x00\x00WEBP", "ascii");
      const res = validateImageMagicBytes(webpBuffer);
      assert.equal(res.valid, true);
      assert.equal(res.detectedMime, "image/webp");
    });

    it("strictly rejects executable or script payloads masquerading with image extensions", async () => {
      const { validateImageMagicBytes } = await import("../lib/security/validation.ts");
      const fakeImage = Buffer.from("<?php echo 'malicious'; ?>", "utf-8");
      const res = validateImageMagicBytes(fakeImage);
      assert.equal(res.valid, false);
      assert.ok(res.error?.includes("signature"));
    });

    it("strictly rejects HTML/SVG scripts masquerading as image files", async () => {
      const { validateImageMagicBytes } = await import("../lib/security/validation.ts");
      const htmlPayload = Buffer.from("<script>alert('XSS')</script>", "utf-8");
      const res = validateImageMagicBytes(htmlPayload);
      assert.equal(res.valid, false);
    });
  });
});
