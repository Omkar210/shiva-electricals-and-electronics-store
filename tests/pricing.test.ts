import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateOrderFinancials } from "../lib/business-rules.ts";

describe("Pricing & Cart Calculations", () => {
  it("calculates accurate subtotal and total for standard line items", () => {
    const result = calculateOrderFinancials({
      items: [
        { unitPrice: 14500, quantity: 1 }, // RO Purifier
        { unitPrice: 350, quantity: 2 },   // Filter Candles
      ],
      deliveryFee: 100,
      discount: 500,
    });

    assert.equal(result.itemCount, 3);
    assert.equal(result.subtotal, 15200);
    assert.equal(result.deliveryFee, 100);
    assert.equal(result.discount, 500);
    assert.equal(result.total, 14800);
  });

  it("handles free delivery fee correctly", () => {
    const result = calculateOrderFinancials({
      items: [{ unitPrice: 2200, quantity: 2 }],
      deliveryFee: 0,
    });

    assert.equal(result.subtotal, 4400);
    assert.equal(result.deliveryFee, 0);
    assert.equal(result.total, 4400);
  });

  it("prevents negative delivery fees or negative discounts from corrupting totals", () => {
    const result = calculateOrderFinancials({
      items: [{ unitPrice: 1000, quantity: 1 }],
      deliveryFee: -50,
      discount: -100,
    });

    assert.equal(result.deliveryFee, 0);
    assert.equal(result.discount, 0);
    assert.equal(result.total, 1000);
  });

  it("caps discount so total cannot be less than zero", () => {
    const result = calculateOrderFinancials({
      items: [{ unitPrice: 500, quantity: 1 }],
      deliveryFee: 50,
      discount: 1000, // Excessive discount attempt
    });

    // Discount capped at subtotal (500)
    assert.equal(result.discount, 500);
    assert.equal(result.total, 50); // Subtotal(500) - Disc(500) + Delivery(50) = 50
  });

  it("handles empty items array safely without crashing", () => {
    const result = calculateOrderFinancials({
      items: [],
      deliveryFee: 100,
    });

    assert.equal(result.itemCount, 0);
    assert.equal(result.subtotal, 0);
    assert.equal(result.total, 100);
  });
});
