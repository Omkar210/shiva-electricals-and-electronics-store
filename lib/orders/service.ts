import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/roles";
import { getCart, clearCart } from "@/lib/cart/service";
import { validateDeliveryZone } from "@/lib/checkout/delivery";

export interface CheckoutInput {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "COD" | "ONLINE";
}

export interface PlaceOrderResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

export interface OrderAddressSnapshot {
  name: string;
  phone: string;
  email: string | null;
  address_line_1: string;
  address_line_2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  town?: string;
  zone_name?: string;
  estimated_delivery?: string;
  payment_method?: string;
}

export interface ConfirmedOrderItem {
  id: string;
  product_id: string | null;
  product_name_snapshot: string;
  sku_snapshot: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface ConfirmedOrderDetails {
  id: string;
  order_number: string;
  user_id: string | null;
  delivery_address_snapshot: OrderAddressSnapshot;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  order_items: ConfirmedOrderItem[];
}

/**
 * Generates an authoritative, human-readable order number.
 * Format: SE-YYYYMMDD-XXXX (e.g. SE-20260924-4821)
 */
function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SE-${dateStr}-${randomSuffix}`;
}

/**
 * Executes a server-validated, atomic order placement transaction.
 * Strictly adheres to MASTER PROMPT Section 12, 13, 14 & 15.
 */
export async function placeOrder(input: CheckoutInput): Promise<PlaceOrderResult> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  // 1. Validate customer input
  if (!input.name?.trim()) return { success: false, error: "Please enter your full name." };
  if (!input.phone?.trim() || input.phone.trim().replace(/\D/g, "").length < 10) {
    return { success: false, error: "Please provide a valid 10-digit mobile phone number." };
  }
  if (!input.addressLine1?.trim()) {
    return { success: false, error: "Please enter your street address / house details." };
  }
  if (!input.pincode?.trim()) {
    return { success: false, error: "Please enter your delivery postal pincode." };
  }

  // 2. Fetch authoritative cart
  const cart = await getCart();
  if (cart.items.length === 0) {
    return { success: false, error: "Your cart is empty. Please add items before placing an order." };
  }

  if (cart.hasOutOfStock) {
    return {
      success: false,
      error: "One or more items in your cart exceed available store inventory. Please review your cart.",
    };
  }

  // 3. Validate delivery zone server-side (never trusting client delivery calculation)
  const deliveryResult = await validateDeliveryZone(input.pincode, cart.subtotal);
  if (!deliveryResult.valid) {
    return {
      success: false,
      error: deliveryResult.error || "Delivery is unavailable for this address.",
    };
  }

  // 4. Calculate authoritative totals
  const subtotal = cart.subtotal;
  const deliveryFee = deliveryResult.deliveryCharge;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  const orderNumber = generateOrderNumber();

  // 5. Construct address snapshot (historical record)
  const addressSnapshot = {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    address_line_1: input.addressLine1.trim(),
    address_line_2: input.addressLine2?.trim() || null,
    landmark: input.landmark?.trim() || null,
    city: input.city?.trim() || deliveryResult.town || "Local Area",
    state: input.state?.trim() || "State",
    pincode: input.pincode.trim(),
    town: deliveryResult.town,
    zone_name: deliveryResult.zoneName,
    estimated_delivery: deliveryResult.estimatedDelivery,
    payment_method: input.paymentMethod,
  };

  // 6. Construct items payload with historical snapshots
  const itemsPayload = cart.items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.product!.price,
    product_name_snapshot: item.product!.name,
    sku_snapshot: item.product!.sku,
    subtotal: item.lineTotal,
  }));

  // 7. Execute atomic database transaction via RPC
  const { error: rpcError } = await supabase.rpc("place_order_atomic", {
    p_user_id: user?.id || null,
    p_order_number: orderNumber,
    p_address_snapshot: addressSnapshot,
    p_subtotal: subtotal,
    p_delivery_fee: deliveryFee,
    p_discount: discount,
    p_total: total,
    p_items: itemsPayload,
  });

  if (rpcError) {
    console.error("Order placement RPC error:", rpcError);
    return {
      success: false,
      error: rpcError.message || "Failed to finalize order. Please verify stock availability and try again.",
    };
  }

  // 8. If authenticated user, optionally save address for future checkout
  if (user) {
    try {
      await supabase.from("addresses").insert({
        user_id: user.id,
        name: input.name.trim(),
        phone: input.phone.trim(),
        address_line_1: input.addressLine1.trim(),
        address_line_2: input.addressLine2?.trim() || null,
        landmark: input.landmark?.trim() || null,
        city: input.city?.trim() || deliveryResult.town || "Local Area",
        state: input.state?.trim() || "State",
        pincode: input.pincode.trim(),
      });
    } catch {
      // Non-critical background save failure
    }
  }

  // 9. Clear guest cart cookie
  await clearCart();

  return {
    success: true,
    orderNumber,
  };
}

/**
 * Retrieves order details by order number for confirmation or tracking.
 */
export async function getOrderByNumber(orderNumber: string) {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        user_id,
        delivery_address_snapshot,
        subtotal,
        delivery_fee,
        discount,
        total,
        payment_status,
        order_status,
        created_at,
        order_items (
          id,
          product_id,
          product_name_snapshot,
          sku_snapshot,
          unit_price,
          quantity,
          subtotal
        ),
        order_status_history (
          id,
          old_status,
          new_status,
          note,
          created_at
        )
      `,
    )
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) return null;
  return order as unknown as ConfirmedOrderDetails;
}
