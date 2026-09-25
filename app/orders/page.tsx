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
      <div className="space-y-2 border-b-2 border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Order Tracking &amp; History
        </h1>
        <p className="text-base text-slate-600">
          Check real-time delivery status, view digital invoices, and track your packages.
        </p>
      </div>

      {/* Guest or Logged Out Banner */}
      {!user && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 rounded-xl border-2 border-blue-200 bg-blue-50/70 p-6 shadow-2xs">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-blue-950">
              Have an account with us?
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              Sign in to view all your past orders, delivery addresses, and technician service records in one place.
            </p>
          </div>
          <Link
            href="/login?redirect=/orders"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 shrink-0 transition-colors"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In to Account</span>
          </Link>
        </div>
      )}

      {/* Authenticated Customer Orders */}
      {user && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Your Placed Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-xl border-2 border-slate-200 bg-white p-10 text-center shadow-xs space-y-4">
              <ShoppingBag className="mx-auto h-16 w-16 text-slate-300" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  You haven&apos;t placed any orders yet
                </h3>
                <p className="text-base text-slate-600 max-w-sm mx-auto">
                  Browse our certified RO purifiers, filter sets, and fans to place your first order.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const addr = order.delivery_address_snapshot;
                const itemsCount = (order.order_items || []).reduce(
                  (acc, it) => acc + it.quantity,
                  0,
                );

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xs transition hover:border-blue-400"
                  >
                    {/* Top Order Metadata Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 bg-slate-50 p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-extrabold text-slate-900">
                          Order #{order.order_number}
                        </span>
                        <OrderStatusBadge status={order.order_status} size="sm" />
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-base text-slate-800">
                          <Package className="h-5 w-5 text-slate-500" />
                          <span>
                            <strong className="text-slate-900">{itemsCount}</strong> item{itemsCount === 1 ? "" : "s"} ordered
                          </span>
                        </div>

                        {addr && (
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>
                              Delivering to {addr.name} ({addr.town || addr.city}, {addr.pincode})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Total</span>
                          <span className="text-xl font-black text-slate-900">
                            ₹{order.total.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <Link
                          href={`/orders/${order.order_number}`}
                          className="flex h-11 items-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
                        >
                          <span>Track Delivery</span>
                          <ArrowRight className="h-4 w-4" />
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
