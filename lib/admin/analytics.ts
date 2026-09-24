import { createClient } from "@/lib/supabase/server";

export interface DashboardMetrics {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrdersCount: number;
  processingOrdersCount: number;
  inTransitOrdersCount: number;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
  averageOrderValue: number;
  totalProductsCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  activeZonesCount: number;
}

export interface RecentAuditLogItem {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Computes authoritative analytics and operational KPIs for the Admin Command Center.
 */
export async function getAdminDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const [
    { data: orders },
    { data: products },
    { count: activeZonesCount },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, order_status, created_at"),
    supabase
      .from("products")
      .select("id, stock_quantity, low_stock_threshold"),
    supabase
      .from("delivery_zones")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const allOrders = orders || [];
  const allProducts = products || [];

  // Financial aggregates
  let totalRevenue = 0;
  let todayRevenue = 0;
  let validOrdersCount = 0;

  const todayStr = new Date().toISOString().slice(0, 10);

  // Status breakdown
  let pendingOrdersCount = 0;
  let processingOrdersCount = 0;
  let inTransitOrdersCount = 0;
  let deliveredOrdersCount = 0;
  let cancelledOrdersCount = 0;

  for (const o of allOrders) {
    const status = o.order_status;
    const amount = Number(o.total) || 0;

    if (status === "PLACED") pendingOrdersCount++;
    else if (status === "CONFIRMED" || status === "PACKED") processingOrdersCount++;
    else if (status === "OUT_FOR_DELIVERY") inTransitOrdersCount++;
    else if (status === "DELIVERED") deliveredOrdersCount++;
    else if (status === "CANCELLED") cancelledOrdersCount++;

    if (status !== "CANCELLED" && status !== "FAILED") {
      totalRevenue += amount;
      validOrdersCount++;

      if (o.created_at && o.created_at.startsWith(todayStr)) {
        todayRevenue += amount;
      }
    }
  }

  const averageOrderValue = validOrdersCount > 0 ? Math.round(totalRevenue / validOrdersCount) : 0;

  // Inventory aggregates
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const p of allProducts) {
    const qty = p.stock_quantity || 0;
    const threshold = p.low_stock_threshold || 5;

    if (qty === 0) outOfStockCount++;
    else if (qty <= threshold) lowStockCount++;
  }

  return {
    totalRevenue,
    todayRevenue,
    totalOrders: allOrders.length,
    pendingOrdersCount,
    processingOrdersCount,
    inTransitOrdersCount,
    deliveredOrdersCount,
    cancelledOrdersCount,
    averageOrderValue,
    totalProductsCount: allProducts.length,
    lowStockCount,
    outOfStockCount,
    activeZonesCount: activeZonesCount || 0,
  };
}

/**
 * Fetches recent audit logs for the store control center.
 */
export async function getRecentAuditLogs(limit = 6): Promise<RecentAuditLogItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, action, entity_type, entity_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data as unknown as RecentAuditLogItem[];
}
