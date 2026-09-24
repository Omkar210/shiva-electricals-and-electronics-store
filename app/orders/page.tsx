import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/roles";
import { listCustomerOrders } from "@/lib/orders/service";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { GuestOrderLookup } from "@/components/orders/GuestOrderLookup";
import {
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  ShoppingBag,
  LogIn,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders & Tracking",
  description: "Track your Shiva Electrical & Electronics orders and delivery status.",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = user ? await listCustomerOrders(user.id) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          Order History &amp; Tracking
        </h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Check live delivery status, view invoices, or track your packages.
        </p>
      </div>

      {/* Guest or Logged Out Banner */}
      {!user && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-6">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-blue-950">
              Have an account with us?
            </h2>
            <p className="text-xs text-blue-700">
              Sign in to view all your past orders, doorstep delivery addresses, and AMC service records in one place.
            </p>
          </div>
          <Link
            href="/login?redirect=/orders"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 shrink-0"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </div>
      )}

      {/* Authenticated Customer Orders */}
      {user && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Your Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs space-y-4">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">
                  You haven&apos;t placed any orders yet
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Explore our RO water purifiers, spare filters, ceiling fans, and electrical supplies.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const addr = order.delivery_address_snapshot;
                const itemsCount = (order.order_items || []).reduce(
                  (acc, it) => acc + it.quantity,
                  0,
                );

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition hover:border-gray-300"
                  >
                    {/* Top Order Metadata Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/50 p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-gray-900 sm:text-sm">
                          {order.order_number}
                        </span>
                        <OrderStatusBadge status={order.order_status} size="sm" />
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span>
                            <strong>{itemsCount}</strong> item{itemsCount === 1 ? "" : "s"} ordered
                          </span>
                        </div>

                        {addr && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span>
                              Delivering to {addr.name} ({addr.town || addr.city}, {addr.pincode})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-gray-400 block">Total</span>
                          <span className="text-base font-extrabold text-blue-600">
                            ₹{order.total.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <Link
                          href={`/orders/${order.order_number}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-blue-600 transition"
                        >
                          View &amp; Track
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Guest Order Lookup Form */}
      <GuestOrderLookup />
    </div>
  );
}
