import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, requireStaffOrAdmin } from "@/lib/auth/roles";
import type { InventoryTransactionType } from "@/types/database";

export interface InventoryItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brand: {
    id: string;
    name: string;
  } | null;
  stockStatus: "OUT_OF_STOCK" | "LOW_STOCK" | "HEALTHY";
}

export interface InventoryMetrics {
  totalProducts: number;
  totalUnits: number;
  totalValuation: number;
  lowStockCount: number;
  outOfStockCount: number;
  healthyCount: number;
}

export interface InventoryTransactionItem {
  id: string;
  product_id: string;
  quantity_change: number;
  transaction_type: InventoryTransactionType;
  reason: string;
  reference_id: string | null;
  created_by: string | null;
  created_at: string;
  product?: {
    name: string;
    sku: string;
  };
}

export interface InventoryFilterOptions {
  status?: string;
  search?: string;
  categoryId?: string;
}

/**
 * Calculates authoritative inventory KPIs across the entire store catalog.
 */
export async function getInventoryMetrics(): Promise<InventoryMetrics> {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, price, stock_quantity, low_stock_threshold");

  if (error || !products) {
    console.error("Error fetching inventory metrics:", error);
    return {
      totalProducts: 0,
      totalUnits: 0,
      totalValuation: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      healthyCount: 0,
    };
  }

  let totalUnits = 0;
  let totalValuation = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let healthyCount = 0;

  for (const p of products) {
    const qty = p.stock_quantity || 0;
    const threshold = p.low_stock_threshold || 5;
    totalUnits += qty;
    totalValuation += qty * (p.price || 0);

    if (qty === 0) {
      outOfStockCount++;
    } else if (qty <= threshold) {
      lowStockCount++;
    } else {
      healthyCount++;
    }
  }

  return {
    totalProducts: products.length,
    totalUnits,
    totalValuation,
    lowStockCount,
    outOfStockCount,
    healthyCount,
  };
}

/**
 * Lists catalog products with real-time stock levels and health statuses.
 */
export async function listInventoryItems(
  options?: InventoryFilterOptions,
): Promise<InventoryItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
        id,
        name,
        slug,
        sku,
        price,
        stock_quantity,
        low_stock_threshold,
        is_active,
        category:categories (
          id,
          name,
          slug
        ),
        brand:brands (
          id,
          name
        )
      `,
    )
    .order("stock_quantity", { ascending: true })
    .order("name", { ascending: true });

  if (options?.categoryId && options.categoryId !== "ALL") {
    query = query.eq("category_id", options.categoryId);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Error fetching inventory items:", error);
    return [];
  }

  interface RawProductRow {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    stock_quantity: number;
    low_stock_threshold: number;
    is_active: boolean;
    category: { id: string; name: string; slug: string } | null;
    brand: { id: string; name: string } | null;
  }

  let items: InventoryItem[] = (data as unknown as RawProductRow[]).map((p) => {
    let stockStatus: "OUT_OF_STOCK" | "LOW_STOCK" | "HEALTHY" = "HEALTHY";
    if (p.stock_quantity === 0) {
      stockStatus = "OUT_OF_STOCK";
    } else if (p.stock_quantity <= p.low_stock_threshold) {
      stockStatus = "LOW_STOCK";
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      stock_quantity: p.stock_quantity,
      low_stock_threshold: p.low_stock_threshold,
      is_active: p.is_active,
      category: p.category,
      brand: p.brand,
      stockStatus,
    };
  });

  // Filter by status tab if requested
  if (options?.status && options.status !== "ALL") {
    items = items.filter((item) => item.stockStatus === options.status);
  }

  // Filter by search query if present
  if (options?.search?.trim()) {
    const q = options.search.toLowerCase().trim();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category?.name?.toLowerCase().includes(q) ||
        item.brand?.name?.toLowerCase().includes(q),
    );
  }

  return items;
}

/**
 * Fetches immutable transaction audit logs for a single product or the entire catalog.
 */
export async function getInventoryTransactions(
  productId?: string,
  limit = 50,
): Promise<InventoryTransactionItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("inventory_transactions")
    .select(
      `
        id,
        product_id,
        quantity_change,
        transaction_type,
        reason,
        reference_id,
        created_by,
        created_at,
        product:products (
          name,
          sku
        )
      `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Error fetching inventory transactions:", error);
    return [];
  }

  interface RawTransactionRow {
    id: string;
    product_id: string;
    quantity_change: number;
    transaction_type: string;
    reason: string;
    reference_id: string | null;
    created_by: string | null;
    created_at: string;
    product?: {
      name: string;
      sku: string;
    };
  }

  return (data as unknown as RawTransactionRow[]).map((t) => ({
    id: t.id,
    product_id: t.product_id,
    quantity_change: t.quantity_change,
    transaction_type: t.transaction_type as InventoryTransactionType,
    reason: t.reason,
    reference_id: t.reference_id,
    created_by: t.created_by,
    created_at: t.created_at,
    product: t.product,
  }));
}

/**
 * Executes a concurrency-safe atomic inventory adjustment.
 */
export async function adjustProductInventory({
  productId,
  quantityChange,
  transactionType,
  reason,
  referenceId,
}: {
  productId: string;
  quantityChange: number;
  transactionType: InventoryTransactionType;
  reason: string;
  referenceId?: string;
}): Promise<{ success: boolean; error?: string }> {
  await requireStaffOrAdmin("/admin/inventory");
  const user = await getCurrentUser();

  if (quantityChange === 0) {
    return { success: false, error: "Quantity change cannot be zero." };
  }

  if (!reason?.trim()) {
    return { success: false, error: "Please provide a valid reason for this stock adjustment." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("adjust_product_inventory", {
    p_product_id: productId,
    p_quantity_change: quantityChange,
    p_transaction_type: transactionType,
    p_reason: reason.trim(),
    p_reference_id: referenceId?.trim() || null,
    p_created_by: user?.id || null,
  });

  if (error) {
    console.error("Inventory adjustment RPC error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
