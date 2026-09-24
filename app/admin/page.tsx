import Link from "next/link";
import { requireStaffOrAdmin } from "@/lib/auth/roles";
import {
  getAdminDashboardMetrics,
  getRecentAuditLogs,
} from "@/lib/admin/analytics";
import { listAdminOrders } from "@/lib/orders/service";
import { listInventoryItems } from "@/lib/inventory/service";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { AdminOrderQuickAction } from "./orders/AdminOrderQuickAction";
import {
  IndianRupee,
  ShoppingCart,
  Boxes,
  Truck,
  Package,
  Clock,
  ArrowRight,
  Plus,
  History,
  AlertTriangle,
  Building2,
  Phone,
  Radio,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Command Center — Shiva Electrical",
};

export default async function AdminDashboardPage() {
  await requireStaffOrAdmin("/admin");

  const [metrics, recentOrders, lowStockProducts, recentAuditLogs] =
    await Promise.all([
      getAdminDashboardMetrics(),
      listAdminOrders(),
      listInventoryItems({ status: "LOW_STOCK" }),
      getRecentAuditLogs(5),
    ]);

  const topRecentOrders = recentOrders.slice(0, 5);
  const criticalStockItems = lowStockProducts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Operational Command Center
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              <Radio className="h-3 w-3 animate-pulse text-emerald-600" />
              Live Store
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time daily shop operations, sales aggregates, order queues, and inventory alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 cursor-pointer"
          >
            <Boxes className="h-4 w-4 text-gray-500" />
            Adjust Stock
          </Link>
        </div>
      </div>

      {/* Row 1: Primary Financial & Order KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Gross Sales */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Gross Sales</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 pt-1">
            ₹{metrics.totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium block">
            Across {metrics.totalOrders} total store orders
          </span>
        </div>

        {/* Today's Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Today&apos;s Sales</span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-600 pt-1">
            ₹{metrics.todayRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-gray-400 block">
            Orders placed today
          </span>
        </div>

        {/* Pending Orders Queue (Urgent Attention) */}
        <Link
          href="/admin/orders?status=PLACED"
          className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs hover:border-amber-400 transition block space-y-1"
        >
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-semibold">Awaiting Verification</span>
            <div className="rounded-xl bg-amber-100 p-2 text-amber-800">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-900 pt-1">
            {metrics.pendingOrdersCount}
          </p>
          <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
            Needs store confirmation &rarr;
          </span>
        </Link>

        {/* Average Order Value */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Average Order Value</span>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 pt-1">
            ₹{metrics.averageOrderValue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-purple-700 block">
            Per fulfilled checkout
          </span>
        </div>
      </div>

      {/* Row 2: Operational Dispatch & Inventory Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Packing / Processing */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-700">
            <Package className="h-4 w-4" />
            <span className="text-xs font-semibold">In Preparation</span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-900">{metrics.processingOrdersCount}</p>
          <span className="text-[11px] text-gray-400">Confirmed or Packed</span>
        </div>

        {/* Out for Delivery */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-purple-700">
            <Truck className="h-4 w-4" />
            <span className="text-xs font-semibold">Out for Delivery</span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-900">{metrics.inTransitOrdersCount}</p>
          <span className="text-[11px] text-gray-400">With local delivery driver</span>
        </div>

        {/* Low Stock Items */}
        <Link
          href="/admin/inventory?status=LOW_STOCK"
          className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 shadow-2xs hover:border-amber-300 transition block"
        >
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-semibold">Low Stock Items</span>
          </div>
          <p className="mt-2 text-xl font-bold text-amber-900">{metrics.lowStockCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Reorder required &rarr;</span>
        </Link>

        {/* Active Pincodes */}
        <Link
          href="/admin/delivery"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs hover:border-blue-300 transition block"
        >
          <div className="flex items-center gap-2 text-blue-700">
            <Building2 className="h-4 w-4" />
            <span className="text-xs font-semibold">Delivery Zones</span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-900">{metrics.activeZonesCount}</p>
          <span className="text-[11px] text-blue-600 font-medium">Active pincodes &rarr;</span>
        </Link>
      </div>

      {/* Main Two-Column Operational Queue */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Orders Stream & Fast Advancement (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-gray-900">
                Recent Customer Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View All Orders ({metrics.totalOrders}) &rarr;
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
            {topRecentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No orders placed yet. Orders will appear here in real-time.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {topRecentOrders.map((order) => {
                  const addr = order.delivery_address_snapshot;
                  const itemsCount = (order.order_items || []).reduce(
                    (acc, it) => acc + it.quantity,
                    0,
                  );

                  return (
                    <div
                      key={order.id}
                      className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50/70 transition-colors text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-mono font-bold text-blue-600 hover:underline"
                          >
                            {order.order_number}
                          </Link>
                          <OrderStatusBadge status={order.order_status} size="sm" />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                          <span className="font-semibold text-gray-700">{addr?.name || "Customer"}</span>
                          {addr?.phone && (
                            <a
                              href={`tel:${addr.phone}`}
                              className="inline-flex items-center gap-1 hover:text-blue-600"
                            >
                              <Phone className="h-3 w-3" />
                              {addr.phone}
                            </a>
                          )}
                          <span>•</span>
                          <span>{addr?.town || addr?.city || "Local"} ({addr?.pincode})</span>
                          <span>•</span>
                          <span>{itemsCount} item{itemsCount === 1 ? "" : "s"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <span className="font-black text-gray-900 text-sm">
                          ₹{order.total.toLocaleString("en-IN")}
                        </span>

                        <div className="flex items-center gap-2">
                          <AdminOrderQuickAction
                            orderId={order.id}
                            currentStatus={order.order_status}
                          />

                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          >
                            <span>Details</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inventory Watch & Audit Stream (1 Col) */}
        <div className="space-y-6">
          {/* Low Stock Watch */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Critical Stock Alerts
                </h2>
              </div>
              <Link
                href="/admin/inventory"
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Inventory &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {criticalStockItems.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center">
                  All active items are above low-stock thresholds.
                </p>
              ) : (
                criticalStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/40 p-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                      <span className="font-mono text-[10px] text-gray-400">SKU: {item.sku}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-800">
                        {item.stock_quantity} left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Audit Log Stream */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-purple-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Recent System Actions
                </h2>
              </div>
              <Link
                href="/admin/inventory/audit"
                className="text-[11px] font-semibold text-purple-600 hover:underline"
              >
                Full Log &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentAuditLogs.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center">
                  No administrative actions logged yet.
                </p>
              ) : (
                recentAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="space-y-0.5 rounded-xl border border-gray-100 bg-gray-50/60 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-[11px]">
                        {log.action}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">
                        {new Date(log.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {log.metadata && (
                      <p className="text-[11px] text-gray-500 truncate">
                        {typeof log.metadata === "object"
                          ? Object.entries(log.metadata)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" | ")
                          : String(log.metadata)}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
