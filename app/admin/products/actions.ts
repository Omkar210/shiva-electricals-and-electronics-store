"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProduct, toggleProductActive } from "@/lib/catalog/products";

export interface ProductActionResult {
  error?: string;
  success?: string;
}

export async function handleCreateProduct(
  _prevState: ProductActionResult | null,
  formData: FormData,
): Promise<ProductActionResult> {
  try {
    await createProduct(formData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return { error: message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function handleToggleActive(id: string, currentStatus: boolean) {
  await toggleProductActive(id, !currentStatus);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
