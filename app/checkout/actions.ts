"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { placeOrder, type CheckoutInput, type PlaceOrderResult } from "@/lib/orders/service";
import { setOrderAuthCookie } from "@/lib/orders/auth";
import {
  checkRateLimit,
  getClientIp,
  GENERIC_RATE_LIMIT_ERROR,
} from "@/lib/security/rate-limit";

export async function handlePlaceOrder(
  _prevState: PlaceOrderResult | null,
  formData: FormData,
): Promise<PlaceOrderResult> {
  const ip = await getClientIp();
  const phone = (formData.get("phone") as string)?.trim() || "";

  // 1. Sliding-window rate limit checks (prevents automated checkout spam)
  const ipLimit = checkRateLimit("checkout", ip);
  if (!ipLimit.allowed) {
    return { success: false, error: GENERIC_RATE_LIMIT_ERROR };
  }

  if (phone) {
    const phoneLimit = checkRateLimit("checkout", phone);
    if (!phoneLimit.allowed) {
      return { success: false, error: GENERIC_RATE_LIMIT_ERROR };
    }
  }

  const consent = formData.get("consent");
  if (!consent) {
    return {
      success: false,
      error: "You must accept the Terms & Conditions, Refund Policy, and Privacy Policy to place your order.",
    };
  }

  const input: CheckoutInput = {
    name: (formData.get("name") as string) || "",
    phone,
    email: (formData.get("email") as string) || "",
    addressLine1: (formData.get("addressLine1") as string) || "",
    addressLine2: (formData.get("addressLine2") as string) || undefined,
    landmark: (formData.get("landmark") as string) || undefined,
    city: (formData.get("city") as string) || "",
    state: (formData.get("state") as string) || "Maharashtra",
    pincode: (formData.get("pincode") as string) || "",
    paymentMethod: ((formData.get("paymentMethod") as string) || "COD") as "COD" | "ONLINE",
  };

  const result = await placeOrder(input);

  if (!result.success || !result.orderNumber) {
    return result;
  }

  // Grant secure browser session cookie authorization for this order
  await setOrderAuthCookie(result.orderNumber);

  revalidatePath("/", "layout");
  redirect(`/checkout/confirmation/${result.orderNumber}`);
}
