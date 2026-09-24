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
