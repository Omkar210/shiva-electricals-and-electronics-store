import { notFound } from "next/navigation";
import Link from "next/link";
import { requireStaffOrAdmin } from "@/lib/auth/roles";
import { getAdminOrderById } from "@/lib/orders/service";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { AdminOrderStatusForm } from "./AdminOrderStatusForm";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Clock,
  History,
  CreditCard,
} from "lucide-react";
import type { Metadata } from "next";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Details #${id.slice(0, 8)} — Admin Portal`,
  };
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  await requireStaffOrAdmin("/admin/orders");
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  const addr = order.delivery_address_snapshot;
  const items = order.order_items || [];
  const history = order.order_status_history || [];

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>

      {/* Order Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl sm:text-2xl font-black text-gray-900">
              {order.order_number}
            </span>
            <OrderStatusBadge status={order.order_status} size="md" />
          </div>
          <p className="text-xs text-gray-500">
            Placed on {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${
              order.payment_status === "PAID"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            Payment: {order.payment_status}
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Items, Address, Audit Log) - 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Items Table */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-3.5 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                Ordered Items ({items.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:px-6 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{item.product_name_snapshot}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                      <span>SKU: {item.sku_snapshot}</span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <span>Rate: ₹{item.unit_price.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="text-right font-bold text-gray-900">
                    ₹{item.subtotal.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Customer Contact */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-3">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>Customer &amp; Delivery Destination</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1.5">
                <p className="font-semibold text-gray-900 text-sm">{addr.name}</p>
                <p className="text-gray-600">{addr.address_line_1}</p>
                {addr.address_line_2 && <p className="text-gray-600">{addr.address_line_2}</p>}
                {addr.landmark && <p className="text-gray-500">Landmark: {addr.landmark}</p>}
                <p className="text-gray-600 font-medium">{addr.city}, {addr.state} — {addr.pincode}</p>
              </div>

              <div className="space-y-2 rounded-xl bg-gray-50/70 p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-blue-600" />
                  <a
                    href={`tel:${addr.phone}`}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {addr.phone}
                  </a>
                </div>
                <div className="text-[11px] text-gray-500 space-y-0.5">
                  <p>Zone: <strong>{addr.zone_name || "Direct Local"} ({addr.town})</strong></p>
                  <p>Estimated Window: <strong>{addr.estimated_delivery || "Standard"}</strong></p>
                  <p>Payment Mode: <strong>{addr.payment_method || "COD"}</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Trail & Status History Log */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-3">
              <History className="h-4 w-4 text-purple-600" />
              <span>Status Audit Log &amp; Timeline</span>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-gray-400">No status updates recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-xs"
                  >
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 text-blue-700">
                      <Clock className="h-3.5 w-3.5" />
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          {record.old_status ? `${record.old_status} → ${record.new_status}` : record.new_status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(record.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      {record.note && (
                        <p className="text-gray-600 text-[11px] italic">
                          &ldquo;{record.note}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Control Panel & Financials) - 1 Col */}
        <div className="space-y-6">
          {/* Order Status Action Panel */}
          <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              Order Action &amp; Transition
            </h2>

            <AdminOrderStatusForm
              orderId={order.id}
              currentStatus={order.order_status}
              currentPaymentStatus={order.payment_status}
            />
          </div>

          {/* Financial Breakdown */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3 text-xs">
            <h2 className="font-bold uppercase tracking-wider text-gray-500 text-[11px] border-b border-gray-100 pb-2">
              Financial Summary
            </h2>

            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-gray-900">
                {order.delivery_fee === 0 ? "FREE" : `₹${order.delivery_fee.toLocaleString("en-IN")}`}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-semibold">-₹{order.discount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-gray-900">
              <span>Total Amount</span>
              <span className="text-blue-600">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
