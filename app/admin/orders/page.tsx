import Link from "next/link";
import { requireStaffOrAdmin } from "@/lib/auth/roles";
import { listAdminOrders } from "@/lib/orders/service";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { AdminOrderFilters } from "./AdminOrderFilters";
import { AdminOrderQuickAction } from "./AdminOrderQuickAction";
import {
  ShoppingCart,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  ArrowRight,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Management — Admin Portal",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  await requireStaffOrAdmin("/admin/orders");
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status;
  const searchFilter = resolvedParams.search;

  // Fetch all orders to compute operational badges
  const allOrders = await listAdminOrders();

  // Filtered orders for the current table view
  const filteredOrders = await listAdminOrders({
    status: statusFilter,
    search: searchFilter,
  });

  // Calculate metrics
  const newOrdersCount = allOrders.filter((o) => o.order_status === "PLACED").length;
  const processingCount = allOrders.filter((o) => ["CONFIRMED", "PACKED"].includes(o.order_status)).length;
  const inTransitCount = allOrders.filter((o) => o.order_status === "OUT_FOR_DELIVERY").length;
  const deliveredCount = allOrders.filter((o) => o.order_status === "DELIVERED").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Order Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Process customer orders, verify dispatch queues, and manage doorstep deliveries.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold">New Orders</span>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-900">{newOrdersCount}</p>
          <span className="text-[11px] text-amber-600">Awaiting confirmation</span>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-indigo-700">
            <Package className="h-4 w-4" />
            <span className="text-xs font-semibold">In Preparation</span>
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-900">{processingCount}</p>
          <span className="text-[11px] text-indigo-600">Confirmed or Packed</span>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-purple-700">
            <Truck className="h-4 w-4" />
            <span className="text-xs font-semibold">Out for Delivery</span>
          </div>
          <p className="mt-2 text-2xl font-black text-purple-900">{inTransitCount}</p>
          <span className="text-[11px] text-purple-600">With local delivery driver</span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-semibold">Delivered</span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-900">{deliveredCount}</p>
          <span className="text-[11px] text-emerald-600">Completed orders</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <AdminOrderFilters />

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-3 text-sm font-bold text-gray-900">No Orders Found</h3>
            <p className="mt-1 text-xs text-gray-500">
              {searchFilter || statusFilter
                ? "Try adjusting your search query or status filter."
                : "Customer orders will appear here as soon as they are placed."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Order #</th>
                  <th scope="col" className="px-4 py-3.5">Customer</th>
                  <th scope="col" className="px-4 py-3.5">Destination</th>
                  <th scope="col" className="px-4 py-3.5">Items</th>
                  <th scope="col" className="px-4 py-3.5">Total</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-4 py-3.5">Payment</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredOrders.map((order) => {
                  const addr = order.delivery_address_snapshot;
                  const itemsCount = (order.order_items || []).reduce(
                    (acc, it) => acc + it.quantity,
                    0,
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Order Number */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono font-bold text-blue-600 hover:text-blue-800 hover:underline block"
                        >
                          {order.order_number}
                        </Link>
                        <span className="text-[11px] text-gray-400">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-gray-900">{addr?.name || "Customer"}</div>
                        {addr?.phone && (
                          <a
                            href={`tel:${addr.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-blue-600"
                          >
                            <Phone className="h-3 w-3" />
                            {addr.phone}
                          </a>
                        )}
                      </td>

                      {/* Destination */}
                      <td className="px-4 py-3.5 text-gray-600">
                        <div>{addr?.town || addr?.city || "Local"}</div>
                        <span className="font-mono text-[11px] text-gray-400">
                          {addr?.pincode}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{itemsCount}</span> items
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                        ₹{order.total.toLocaleString("en-IN")}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <OrderStatusBadge status={order.order_status} size="sm" />
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            order.payment_status === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <AdminOrderQuickAction
                            orderId={order.id}
                            currentStatus={order.order_status}
                          />

                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <span>View</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
