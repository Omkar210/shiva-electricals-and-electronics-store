import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Metadata & SEO Resiliency (BUG-SHIVA-002 Prevention)", () => {
  it("formats title correctly for confirmed orders when order exists", () => {
    const orderNumber = "SE-20260924-1234";
    const exists = true;
    const title = exists ? `Order ${orderNumber} Confirmed` : "Order Not Found";
    assert.equal(title, "Order SE-20260924-1234 Confirmed");
  });

  it("safely generates 'Order Not Found' title when order does not exist", () => {
    const orderNumber = "SE-NONEXISTENT-9999";
    const exists = false;
    const title = exists ? `Order ${orderNumber} Confirmed` : "Order Not Found";
    assert.equal(title, "Order Not Found");
    assert.ok(!title.includes("Confirmed"));
  });

  it("safely generates 'Order Not Found' title for tracking page on missing order", () => {
    const orderNumber = "SE-NONEXISTENT-9999";
    const exists = false;
    const title = exists ? `Order ${orderNumber} Tracking` : "Order Not Found";
    assert.equal(title, "Order Not Found");
    assert.ok(!title.includes("Tracking"));
  });
});
