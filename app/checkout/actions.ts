"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { placeOrder, type CheckoutInput, type PlaceOrderResult } from "@/lib/orders/service";

export async function handlePlaceOrder(
  _prevState: PlaceOrderResult | null,
  formData: FormData,
): Promise<PlaceOrderResult> {
  const input: CheckoutInput = {
    name: (formData.get("name") as string) || "",
    phone: (formData.get("phone") as string) || "",
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

  revalidatePath("/", "layout");
  redirect(`/checkout/confirmation/${result.orderNumber}`);
}
