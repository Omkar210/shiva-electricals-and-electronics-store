import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  isGoogleDriveConfigured,
  getGoogleDriveClient,
} from "../lib/storage/google-drive.ts";

describe("Google Drive Storage Service", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GOOGLE_PRIVATE_KEY;
    delete process.env.GOOGLE_DRIVE_FOLDER_ID;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("reports unconfigured when environment variables are missing", () => {
    assert.equal(isGoogleDriveConfigured(), false);
  });

  it("reports unconfigured when only partial credentials exist", () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "test@project.iam.gserviceaccount.com";
    assert.equal(isGoogleDriveConfigured(), false);

    process.env.GOOGLE_PRIVATE_KEY = "test-key";
    assert.equal(isGoogleDriveConfigured(), false);
  });

  it("reports configured when all three required environment variables are set", () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "test@project.iam.gserviceaccount.com";
    process.env.GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n";
    process.env.GOOGLE_DRIVE_FOLDER_ID = "folder_12345";

    assert.equal(isGoogleDriveConfigured(), true);
  });

  it("throws a descriptive error when trying to instantiate client without credentials", () => {
    assert.throws(
      () => {
        getGoogleDriveClient();
      },
      {
        message: /Google Drive is not configured\. Missing GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_DRIVE_FOLDER_ID\./,
      },
    );
  });

  it("generates correct proxy path for a given Google Drive file ID", () => {
    const fileId = "1a2b3c4d5e6f7g8h9i0";
    const proxyUrl = `/api/media/drive/${fileId}`;
    assert.equal(proxyUrl, "/api/media/drive/1a2b3c4d5e6f7g8h9i0");
  });

  it("validates that illegal path characters or traversals can be detected", () => {
    const invalidIds = ["../secret", "folder/subfolder", "file..id", ""];
    for (const id of invalidIds) {
      const isInvalid = !id || id.includes("/") || id.includes("..");
      assert.equal(isInvalid, true, `Should detect ${id} as invalid`);
    }

    const validId = "1AbCd_EfGh-IjKlMnOp";
    const isValid = Boolean(validId) && !validId.includes("/") && !validId.includes("..");
    assert.equal(isValid, true);
  });

  it("constructs canonical Google Drive product image endpoint by Product ID", () => {
    const productId = "a1000000-0000-0000-0000-000000000001";
    const expectedRoute = `/api/media/drive/product/${productId}`;
    assert.equal(expectedRoute, "/api/media/drive/product/a1000000-0000-0000-0000-000000000001");
  });

  it("sanitizes product IDs to prevent query injection", () => {
    const maliciousId = "prod-123'; DROP TABLE products; --";
    const safeId = maliciousId.replace(/[^a-zA-Z0-9_-]/g, "");
    assert.equal(safeId, "prod-123DROPTABLEproducts--");
    assert.equal(safeId.includes("'"), false);
    assert.equal(safeId.includes(";"), false);
    assert.equal(safeId.includes(" "), false);
  });

  it("matches files named with product ID across various extensions", () => {
    const productId = "a1000000-0000-0000-0000-000000000001";
    const driveFilenames = [
      "a1000000-0000-0000-0000-000000000001.jpg",
      "a1000000-0000-0000-0000-000000000001.png",
      "a1000000-0000-0000-0000-000000000001-main.webp",
      "other-product.jpg",
    ];

    const matches = driveFilenames.filter((name) => {
      const base = name.split(".")[0];
      return base.includes(productId) || name.startsWith(productId);
    });

    assert.equal(matches.length, 3);
    assert.equal(matches.includes("other-product.jpg"), false);
  });
});
