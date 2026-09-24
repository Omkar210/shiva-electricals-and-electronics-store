"use server";

import { revalidatePath } from "next/cache";
import { requireStaffOrAdmin } from "@/lib/auth/roles";
import { transitionOrderStatus } from "@/lib/orders/service";

export interface AdminOrderActionState {
  success?: boolean;
  error?: string;
}

export async function adminTransitionOrderStatusAction(
  orderId: string,
  newStatus: string,
  note?: string,
  paymentStatus?: string,
): Promise<AdminOrderActionState> {
  await requireStaffOrAdmin("/admin/orders");

  const result = await transitionOrderStatus({
    orderId,
    newStatus,
    note,
    paymentStatus,
  });

  if (!result.success) {
    return { error: result.error || "Failed to update order status." };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/orders");

  return { success: true };
}
