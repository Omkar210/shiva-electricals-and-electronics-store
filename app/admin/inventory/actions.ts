"use server";

import { revalidatePath } from "next/cache";
import { adjustProductInventory } from "@/lib/inventory/service";
import type { InventoryTransactionType } from "@/types/database";

export interface AdjustStockResult {
  success?: boolean;
  error?: string;
}

export async function adjustStockAction(
  productId: string,
  quantityChange: number,
  transactionType: InventoryTransactionType,
  reason: string,
  referenceId?: string,
): Promise<AdjustStockResult> {
  const result = await adjustProductInventory({
    productId,
    quantityChange,
    transactionType,
    reason,
    referenceId,
  });

  if (!result.success) {
    return { error: result.error || "Failed to update inventory." };
  }

  revalidatePath("/admin/inventory");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/", "layout");

  return { success: true };
}
