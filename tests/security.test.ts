import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canCustomerCancelOrder,
  calculateOrderFinancials,
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
});
