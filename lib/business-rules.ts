/**
 * Authoritative Business Rules & Pure Logic Engine for Shiva Electrical & Electronics.
 * Strictly adheres to RULES.md and DESIGN.md constraints.
 */

export type OrderStatusType =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "FAILED";

export interface StateTransitionResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates order status transitions strictly against the defined finite state machine.
 */
export function validateStatusTransition(
  oldStatus: OrderStatusType,
  newStatus: OrderStatusType,
): StateTransitionResult {
  if (oldStatus === newStatus) {
    return { valid: true };
  }

  switch (oldStatus) {
    case "PLACED":
      if (newStatus === "CONFIRMED" || newStatus === "CANCELLED") {
        return { valid: true };
      }
      break;

    case "CONFIRMED":
      if (newStatus === "PACKED" || newStatus === "CANCELLED") {
        return { valid: true };
      }
      break;

    case "PACKED":
      if (newStatus === "OUT_FOR_DELIVERY" || newStatus === "CANCELLED") {
        return { valid: true };
      }
      break;

    case "OUT_FOR_DELIVERY":
      if (
        newStatus === "DELIVERED" ||
        newStatus === "CANCELLED" ||
        newStatus === "FAILED"
      ) {
        return { valid: true };
      }
      break;

    case "FAILED":
      if (newStatus === "OUT_FOR_DELIVERY" || newStatus === "CANCELLED") {
        return { valid: true };
      }
      break;

    case "DELIVERED":
      if (newStatus === "RETURN_REQUESTED") {
        return { valid: true };
      }
      break;

    case "RETURN_REQUESTED":
      if (newStatus === "RETURNED" || newStatus === "DELIVERED") {
        return { valid: true };
      }
      break;

    case "CANCELLED":
    case "RETURNED":
      // Terminal states — cannot transition to any other status
      return {
        valid: false,
        error: `Cannot transition from terminal status '${oldStatus}'.`,
      };
  }

  return {
    valid: false,
    error: `Illegal state transition from '${oldStatus}' to '${newStatus}'.`,
  };
}

/**
 * Authoritative financial calculation for order pricing.
 * Prevents negative values and client manipulation.
 */
export function calculateOrderFinancials({
  items,
  deliveryFee = 0,
  discount = 0,
}: {
  items: { unitPrice: number; quantity: number }[];
  deliveryFee?: number;
  discount?: number;
}): {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemCount: number;
} {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    const qty = Math.max(0, Math.floor(item.quantity));
    const price = Math.max(0, item.unitPrice);
    subtotal += price * qty;
    itemCount += qty;
  }

  const safeDeliveryFee = Math.max(0, deliveryFee);
  const safeDiscount = Math.min(subtotal, Math.max(0, discount));
  const total = subtotal + safeDeliveryFee - safeDiscount;

  return {
    subtotal,
    deliveryFee: safeDeliveryFee,
    discount: safeDiscount,
    total,
    itemCount,
  };
}

/**
 * Pincode format validation (must be exactly 6 numeric digits).
 */
export function validatePincodeFormat(pincode: string): {
  valid: boolean;
  cleanPincode: string;
  error?: string;
} {
  const clean = (pincode || "").trim().replace(/\D/g, "");

  if (!clean || clean.length !== 6) {
    return {
      valid: false,
      cleanPincode: clean,
      error: "Please enter a valid 6-digit postal pincode.",
    };
  }

  return {
    valid: true,
    cleanPincode: clean,
  };
}

/**
 * Validates delivery fee and minimum order rules against zone specifications.
 */
export function evaluateZoneEligibility({
  subtotal,
  zone,
}: {
  subtotal: number;
  zone: {
    town: string;
    minimum_order: number;
    delivery_charge: number;
    is_active: boolean;
  } | null;
}): {
  eligible: boolean;
  deliveryCharge: number;
  error?: string;
} {
  if (!zone || !zone.is_active) {
    return {
      eligible: false,
      deliveryCharge: 0,
      error: "Delivery is not currently available for this pincode.",
    };
  }

  if (zone.minimum_order > 0 && subtotal < zone.minimum_order) {
    return {
      eligible: false,
      deliveryCharge: zone.delivery_charge,
      error: `Minimum order for delivery to ${zone.town} is ₹${zone.minimum_order}. Current subtotal: ₹${subtotal}.`,
    };
  }

  return {
    eligible: true,
    deliveryCharge: Number(zone.delivery_charge) || 0,
  };
}

/**
 * Determines whether a customer account is permitted to self-cancel an order.
 */
export function canCustomerCancelOrder({
  orderStatus,
  orderUserId,
  currentUserId,
}: {
  orderStatus: string;
  orderUserId: string | null;
  currentUserId: string;
}): { canCancel: boolean; error?: string } {
  if (!currentUserId || orderUserId !== currentUserId) {
    return {
      canCancel: false,
      error: "You are not authorized to cancel this order.",
    };
  }

  if (orderStatus !== "PLACED") {
    return {
      canCancel: false,
      error: `Orders in '${orderStatus}' status cannot be self-cancelled. Please contact store support.`,
    };
  }

  return { canCancel: true };
}
