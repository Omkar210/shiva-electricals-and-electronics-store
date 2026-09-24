import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validatePincodeFormat,
  evaluateZoneEligibility,
} from "../lib/business-rules.ts";

describe("Delivery Matrix & Zone Eligibility Rules", () => {
  describe("Pincode Format Validation", () => {
    it("accepts valid 6-digit postal pincodes", () => {
      const result = validatePincodeFormat("416416");
      assert.equal(result.valid, true);
      assert.equal(result.cleanPincode, "416416");
      assert.equal(result.error, undefined);
    });

    it("cleans leading and trailing whitespaces and internal formatting", () => {
      const result = validatePincodeFormat("  416 416  ");
      assert.equal(result.valid, true);
      assert.equal(result.cleanPincode, "416416");
    });

    it("rejects invalid pincodes with non-digit characters or wrong lengths", () => {
      // Too short
      assert.equal(validatePincodeFormat("41641").valid, false);

      // Too long
      assert.equal(validatePincodeFormat("4164160").valid, false);

      // Alpha characters
      assert.equal(validatePincodeFormat("ABCDEF").valid, false);

      // Empty string or null-like
      assert.equal(validatePincodeFormat("").valid, false);
    });
  });

  describe("Zone Eligibility Evaluation", () => {
    const activeZone = {
      town: "Sangli City",
      minimum_order: 500,
      delivery_charge: 50,
      is_active: true,
    };

    it("grants eligibility when order subtotal meets minimum order requirement", () => {
      const result = evaluateZoneEligibility({
        subtotal: 750,
        zone: activeZone,
      });

      assert.equal(result.eligible, true);
      assert.equal(result.deliveryCharge, 50);
      assert.equal(result.error, undefined);
    });

    it("grants eligibility when order subtotal exactly equals minimum order requirement", () => {
      const result = evaluateZoneEligibility({
        subtotal: 500,
        zone: activeZone,
      });

      assert.equal(result.eligible, true);
      assert.equal(result.deliveryCharge, 50);
    });

    it("rejects order when subtotal is below minimum order requirement with descriptive message", () => {
      const result = evaluateZoneEligibility({
        subtotal: 350,
        zone: activeZone,
      });

      assert.equal(result.eligible, false);
      assert.equal(result.deliveryCharge, 50);
      assert.ok(result.error?.includes("Minimum order for delivery to Sangli City is ₹500"));
      assert.ok(result.error?.includes("Current subtotal: ₹350"));
    });

    it("rejects delivery if zone is marked inactive", () => {
      const inactiveZone = {
        ...activeZone,
        is_active: false,
      };

      const result = evaluateZoneEligibility({
        subtotal: 2000,
        zone: inactiveZone,
      });

      assert.equal(result.eligible, false);
      assert.ok(result.error?.includes("not currently available"));
    });

    it("rejects delivery gracefully if zone is not found (null zone)", () => {
      const result = evaluateZoneEligibility({
        subtotal: 5000,
        zone: null,
      });

      assert.equal(result.eligible, false);
      assert.ok(result.error?.includes("not currently available"));
    });
  });
});
