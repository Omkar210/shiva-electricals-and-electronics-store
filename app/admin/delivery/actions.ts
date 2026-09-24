"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import {
  createDeliveryZone,
  updateDeliveryZone,
  toggleDeliveryZoneActive,
  deleteDeliveryZone,
  type DeliveryZoneInput,
} from "@/lib/checkout/delivery";

export interface DeliveryZoneActionResult {
  success?: boolean;
  error?: string;
}

export async function saveDeliveryZoneAction(
  id: string | null,
  input: DeliveryZoneInput,
): Promise<DeliveryZoneActionResult> {
  // Only admins can modify delivery zones per RLS & rules
  await requireRole(["admin"], "/admin/delivery");

  let result: { success: boolean; error?: string };

  if (id) {
    result = await updateDeliveryZone(id, input);
  } else {
    result = await createDeliveryZone(input);
  }

  if (!result.success) {
    return { error: result.error || "Failed to save delivery zone." };
  }

  revalidatePath("/admin/delivery");
  revalidatePath("/admin");
  revalidatePath("/checkout");
  revalidatePath("/products");
  revalidatePath("/", "layout");

  return { success: true };
}

export async function toggleDeliveryZoneActiveAction(
  id: string,
  isActive: boolean,
): Promise<DeliveryZoneActionResult> {
  await requireRole(["admin"], "/admin/delivery");

  const result = await toggleDeliveryZoneActive(id, isActive);
  if (!result.success) {
    return { error: result.error || "Failed to update zone status." };
  }

  revalidatePath("/admin/delivery");
  revalidatePath("/admin");
  revalidatePath("/checkout");
  revalidatePath("/", "layout");

  return { success: true };
}

export async function deleteDeliveryZoneAction(
  id: string,
): Promise<DeliveryZoneActionResult> {
  await requireRole(["admin"], "/admin/delivery");

  const result = await deleteDeliveryZone(id);
  if (!result.success) {
    return { error: result.error || "Failed to delete delivery zone." };
  }

  revalidatePath("/admin/delivery");
  revalidatePath("/admin");
  revalidatePath("/checkout");
  revalidatePath("/", "layout");

  return { success: true };
}
