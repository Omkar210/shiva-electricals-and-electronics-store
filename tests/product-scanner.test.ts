import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { scanProductImages, type InputImageBuffer } from "../lib/ai/product-scanner.ts";
import { canUploadProductMedia } from "../lib/business-rules.ts";

describe("AI Product Scanner Service", () => {
  it("rejects empty image array with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await scanProductImages([]);
      },
      {
        message: /At least one image is required for scanning\./,
      },
    );
  });

  it("extracts structured product data from multi-angle images using heuristic fallback", async () => {
    // Simulated multi-angle images
    const dummyImages: InputImageBuffer[] = [
      {
        buffer: Buffer.from("dummy-front-view-bytes"),
        mimeType: "image/jpeg",
        name: "kent-grand-plus-front.jpg",
      },
      {
        buffer: Buffer.from("dummy-label-view-bytes"),
        mimeType: "image/jpeg",
        name: "kent-grand-plus-specs-plate.jpg",
      },
      {
        buffer: Buffer.from("dummy-box-view-bytes"),
        mimeType: "image/jpeg",
        name: "kent-grand-plus-box.jpg",
      },
    ];

    const result = await scanProductImages(dummyImages);

    assert.ok(result.name, "Product name should be extracted");
    assert.ok(result.sku, "SKU should be detected/generated");
    assert.ok(result.description, "Description should be generated");
    assert.ok(result.compatibility, "Compatibility should be extracted");
    assert.ok(result.warranty, "Warranty should be extracted");
    assert.ok(Array.isArray(result.detected_text_snippets), "Text snippets array should exist");
    assert.ok(result.detected_text_snippets.length > 0, "Should have detected text snippets");
  });

  it("strictly restricts product scanning privilege to Admin role", () => {
    // Only Admin can upload media / scan products
    assert.equal(canUploadProductMedia("admin"), true);
    assert.equal(canUploadProductMedia("staff"), false);
    assert.equal(canUploadProductMedia("customer"), false);
    assert.equal(canUploadProductMedia("guest"), false);
    assert.equal(canUploadProductMedia(null), false);
    assert.equal(canUploadProductMedia(undefined), false);
  });

  it("enforces sanitization guardrail against XSS and control characters in AI output", async () => {
    const { sanitizeExtractedData } = await import("../lib/ai/product-scanner.ts");

    const maliciousData = {
      name: '<script>alert("pwned")</script>AquaPure Pro',
      brand: '<img src=x onerror=alert(1)>Kent',
      sku: "RO-001\0\x08",
      mrp: 15000,
      price: 12000,
      description: "<b>Features:</b> <script>stealCookies()</script>RO+UV purifier.",
      compatibility: "Standard 230V <iframe src=attacker.com>",
      warranty: "1 Year <svg onload=alert(2)>",
      specifications: {
        "<b>Power</b>": "60W <script>",
      },
      detected_text_snippets: ["<script>evil()</script>Label text"],
    };

    const sanitized = sanitizeExtractedData(maliciousData);

    assert.equal(sanitized.name.includes("<script>"), false);
    assert.equal(sanitized.name, "AquaPure Pro");
    assert.equal(sanitized.brand?.includes("<img"), false);
    assert.equal(sanitized.brand, "Kent");
    assert.equal(sanitized.sku.includes("\0"), false);
    assert.equal(sanitized.description.includes("<script>"), false);
    assert.equal(sanitized.compatibility.includes("<iframe"), false);
    assert.equal(sanitized.warranty.includes("<svg"), false);
    assert.equal(sanitized.detected_text_snippets[0].includes("<script>"), false);
  });
});
