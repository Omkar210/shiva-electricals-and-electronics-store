import { cookies } from "next/headers";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth/roles";
import type { ConfirmedOrderDetails } from "./service";

/**
 * Grants browser authorization for an order via an HttpOnly cookie.
 */
export async function setOrderAuthCookie(orderNumber: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(`shiva_order_auth_${orderNumber.trim()}`, "authorized", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days retention
    path: "/",
  });
}

/**
 * Determines whether the current request is authorized to view full order PII and tracking.
 */
export async function isOrderAuthorized(
  order: ConfirmedOrderDetails,
): Promise<{ authorized: boolean; reason?: "OWNER" | "STAFF" | "COOKIE" | "UNAUTHORIZED" }> {
  // 1. Check if authenticated staff/admin
  const profile = await getCurrentProfile();
  if (profile && (profile.role === "admin" || profile.role === "staff")) {
    return { authorized: true, reason: "STAFF" };
  }

  // 2. Check if authenticated owner
  const user = await getCurrentUser();
  if (user && order.user_id && user.id === order.user_id) {
    return { authorized: true, reason: "OWNER" };
  }

  // 3. Check for secure ephemeral guest authorization cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(`shiva_order_auth_${order.order_number}`);
  if (authCookie && authCookie.value === "authorized") {
    return { authorized: true, reason: "COOKIE" };
  }

  return { authorized: false, reason: "UNAUTHORIZED" };
}
