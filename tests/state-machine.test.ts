import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateStatusTransition } from "../lib/business-rules.ts";

describe("Order Fulfillment State Machine", () => {
  it("allows identical status transitions as idempotent operations", () => {
    assert.equal(validateStatusTransition("PLACED", "PLACED").valid, true);
    assert.equal(validateStatusTransition("CONFIRMED", "CONFIRMED").valid, true);
    assert.equal(validateStatusTransition("DELIVERED", "DELIVERED").valid, true);
  });

  it("permits standard order advancement sequence", () => {
    // 1. PLACED -> CONFIRMED
    assert.equal(validateStatusTransition("PLACED", "CONFIRMED").valid, true);

    // 2. CONFIRMED -> PACKED
    assert.equal(validateStatusTransition("CONFIRMED", "PACKED").valid, true);

    // 3. PACKED -> OUT_FOR_DELIVERY
    assert.equal(validateStatusTransition("PACKED", "OUT_FOR_DELIVERY").valid, true);

    // 4. OUT_FOR_DELIVERY -> DELIVERED
    assert.equal(validateStatusTransition("OUT_FOR_DELIVERY", "DELIVERED").valid, true);
  });

  it("permits order cancellations at appropriate stages", () => {
    assert.equal(validateStatusTransition("PLACED", "CANCELLED").valid, true);
    assert.equal(validateStatusTransition("CONFIRMED", "CANCELLED").valid, true);
    assert.equal(validateStatusTransition("PACKED", "CANCELLED").valid, true);
    assert.equal(validateStatusTransition("OUT_FOR_DELIVERY", "CANCELLED").valid, true);
  });

  it("permits delivery failure and subsequent re-dispatch", () => {
    assert.equal(validateStatusTransition("OUT_FOR_DELIVERY", "FAILED").valid, true);
    assert.equal(validateStatusTransition("FAILED", "OUT_FOR_DELIVERY").valid, true);
    assert.equal(validateStatusTransition("FAILED", "CANCELLED").valid, true);
  });

  it("strictly rejects illegal state skips", () => {
    // Cannot jump directly from PLACED to DELIVERED
    const skip1 = validateStatusTransition("PLACED", "DELIVERED");
    assert.equal(skip1.valid, false);

    // Cannot jump directly from PLACED to PACKED (must be confirmed first)
    const skip2 = validateStatusTransition("PLACED", "PACKED");
    assert.equal(skip2.valid, false);

    // Cannot jump directly from CONFIRMED to DELIVERED
    const skip3 = validateStatusTransition("CONFIRMED", "DELIVERED");
    assert.equal(skip3.valid, false);
  });

  it("strictly enforces terminal state immutability", () => {
    // Cannot transition from CANCELLED to anything
    const cancelReopen = validateStatusTransition("CANCELLED", "CONFIRMED");
    assert.equal(cancelReopen.valid, false);

    const cancelDeliver = validateStatusTransition("CANCELLED", "DELIVERED");
    assert.equal(cancelDeliver.valid, false);

    // Cannot un-deliver an order back to PLACED
    const deliverBacktrack = validateStatusTransition("DELIVERED", "PLACED");
    assert.equal(deliverBacktrack.valid, false);
  });
});
