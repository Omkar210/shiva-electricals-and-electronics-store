"use server";

import { revalidatePath } from "next/cache";
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/cart/service";

export async function handleAddToCart(productId: string, quantity = 1) {
  await addToCart(productId, quantity);
  revalidatePath("/", "layout");
}

export async function handleUpdateQuantity(productId: string, quantity: number) {
  await updateCartItemQuantity(productId, quantity);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function handleRemoveItem(productId: string) {
  await removeFromCart(productId);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function handleClearCart() {
  await clearCart();
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}
