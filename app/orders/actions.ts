"use server";

import { revalidatePath } from "next/cache";
import { cancelCustomerOrder } from "@/lib/orders/service";

export interface CancelOrderActionState {
  success?: boolean;
  error?: string;
}

export async function cancelCustomerOrderAction(
  orderNumber: string,
  reason?: string,
): Promise<CancelOrderActionState> {
  const result = await cancelCustomerOrder({
    orderNumber,
    reason,
  });

  if (!result.success) {
    return { error: result.error || "Failed to cancel order." };
  }

  revalidatePath(`/orders/${orderNumber}`);
  revalidatePath("/orders");
  revalidatePath("/account");
  revalidatePath("/admin/orders");

  return { success: true };
}

export interface VerifyOrderResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: Validates guest phone against the order record to prevent IDOR data harvesting.
 * Protected by strict IP rate limiting.
 */
export async function verifyGuestOrderAccessAction(
  orderNumber: string,
  phone: string,
): Promise<VerifyOrderResult> {
  const { lookupGuestOrder } = await import("@/lib/orders/service");
  const { setOrderAuthCookie } = await import("@/lib/orders/auth");
  const { checkRateLimit, getClientIp, GENERIC_RATE_LIMIT_ERROR } = await import("@/lib/security/rate-limit");

  const ip = await getClientIp();
  const rateLimit = checkRateLimit("public", `${ip}:order_verify`, {
    maxRequests: 5,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return { success: false, error: GENERIC_RATE_LIMIT_ERROR };
  }

  const cleanOrderNumber = orderNumber?.trim();
  const cleanPhone = phone?.trim();

  if (!cleanOrderNumber || !cleanPhone) {
    return { success: false, error: "Please enter both your order number and 10-digit mobile number." };
  }

  const order = await lookupGuestOrder({
    orderNumber: cleanOrderNumber,
    phone: cleanPhone,
  });

  if (!order) {
    return {
      success: false,
      error: "Order number and mobile number combination could not be verified. Please check and try again.",
    };
  }

  await setOrderAuthCookie(order.order_number);
  return { success: true };
}
