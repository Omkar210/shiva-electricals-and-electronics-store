import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/roles";
import { getCart, clearCart } from "@/lib/cart/service";
import { validateDeliveryZone } from "@/lib/checkout/delivery";
import type { OrderStatus } from "@/types/database";

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

export interface OrderStatusHistoryItem {
  id: string;
  old_status: string | null;
  new_status: string;
  note: string | null;
  changed_by?: string | null;
  created_at: string;
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
  updated_at?: string;
  order_items: ConfirmedOrderItem[];
  order_status_history?: OrderStatusHistoryItem[];
}

import crypto from "crypto";

/**
 * Generates an authoritative, cryptographically secure order number.
 * Format: SE-YYYYMMDD-XXXXXX (e.g. SE-20260924-482109)
 */
function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = crypto.randomInt(100000, 999999);
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
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    supabase = await createClient();
  }

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
        updated_at,
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

/**
 * Lists all orders placed by a specific customer account, newest first.
 */
export async function listCustomerOrders(userId: string): Promise<ConfirmedOrderDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
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
        updated_at,
        order_items (
          id,
          product_id,
          product_name_snapshot,
          sku_snapshot,
          unit_price,
          quantity,
          subtotal
        )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }

  return (data || []) as unknown as ConfirmedOrderDetails[];
}

export interface AdminOrderListFilter {
  status?: string;
  search?: string;
}

/**
 * Lists orders for store staff / admin with filtering and search.
 */
export async function listAdminOrders(
  filter?: AdminOrderListFilter,
): Promise<ConfirmedOrderDetails[]> {
  const supabase = await createClient();

  let query = supabase
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
        updated_at,
        order_items (
          id,
          product_id,
          product_name_snapshot,
          sku_snapshot,
          unit_price,
          quantity,
          subtotal
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (filter?.status && filter.status !== "ALL") {
    query = query.eq("order_status", filter.status as OrderStatus);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching admin orders:", error);
    return [];
  }

  let results = (data || []) as unknown as ConfirmedOrderDetails[];

  if (filter?.search?.trim()) {
    const q = filter.search.toLowerCase().trim();
    results = results.filter((o) => {
      const addr = o.delivery_address_snapshot;
      return (
        o.order_number.toLowerCase().includes(q) ||
        addr?.name?.toLowerCase().includes(q) ||
        addr?.phone?.includes(q) ||
        addr?.pincode?.includes(q) ||
        addr?.town?.toLowerCase().includes(q)
      );
    });
  }

  return results;
}

/**
 * Retrieves comprehensive order details for staff/admin management,
 * including full status history and actor notes.
 */
export async function getAdminOrderById(orderId: string): Promise<ConfirmedOrderDetails | null> {
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
        updated_at,
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
          changed_by,
          created_at
        )
      `,
    )
    .eq("id", orderId)
    .single();

  if (error || !order) return null;
  return order as unknown as ConfirmedOrderDetails;
}

/**
 * Executes a concurrency-safe order status transition via atomic PostgreSQL RPC.
 */
export async function transitionOrderStatus({
  orderId,
  newStatus,
  note,
  paymentStatus,
}: {
  orderId: string;
  newStatus: string;
  note?: string;
  paymentStatus?: string;
}): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Authentication required to update order status." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("transition_order_status", {
    p_order_id: orderId,
    p_new_status: newStatus,
    p_changed_by: user.id,
    p_note: note || null,
    p_payment_status: paymentStatus || null,
  });

  if (error) {
    console.error("Order status transition error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Allows a customer to cancel their own order provided it is still in PLACED state.
 */
export async function cancelCustomerOrder({
  orderNumber,
  reason,
}: {
  orderNumber: string;
  reason?: string;
}): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Please log in to manage your order." };
  }

  const supabase = await createClient();
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, user_id, order_status")
    .eq("order_number", orderNumber)
    .single();

  if (fetchError || !order) {
    return { success: false, error: "Order not found." };
  }

  if (order.user_id !== user.id) {
    return { success: false, error: "You are not authorized to cancel this order." };
  }

  if (order.order_status !== "PLACED") {
    return {
      success: false,
      error: `Orders in '${order.order_status}' status cannot be self-cancelled. Please contact Shiva Electrical store support.`,
    };
  }

  return transitionOrderStatus({
    orderId: order.id,
    newStatus: "CANCELLED",
    note: reason ? `Customer cancellation: ${reason}` : "Customer cancelled order from account portal.",
  });
}

/**
 * Look up a guest order by order number and phone number verification.
 */
export async function lookupGuestOrder({
  orderNumber,
  phone,
}: {
  orderNumber: string;
  phone: string;
}): Promise<ConfirmedOrderDetails | null> {
  const order = await getOrderByNumber(orderNumber.trim());
  if (!order) return null;

  const rawPhone = phone.replace(/\D/g, "");
  const orderPhone = (order.delivery_address_snapshot?.phone || "").replace(/\D/g, "");

  if (orderPhone.endsWith(rawPhone) || rawPhone.endsWith(orderPhone)) {
    return order;
  }

  return null;
}

