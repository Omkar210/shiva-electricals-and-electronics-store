import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByNumber } from "@/lib/orders/service";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimelineStepper } from "@/components/orders/OrderTimelineStepper";
import { CancelOrderButton } from "@/components/orders/CancelOrderButton";
import {
  Package,
  MapPin,
  Truck,
  ArrowLeft,
  CreditCard,
  History,
} from "lucide-react";
import type { Metadata } from "next";

interface OrderTrackingPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: OrderTrackingPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return {
      title: "Order Not Found",
    };
  }
  return {
    title: `Order ${orderNumber} Tracking`,
  };
}

export default async function OrderTrackingPage({
  params,
}: OrderTrackingPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const address = order.delivery_address_snapshot;
  const items = order.order_items || [];
  const history = order.order_status_history || [];
  const canCancel = order.order_status === "PLACED";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </Link>
      </div>

      {/* Order Header Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Order Details
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-mono text-gray-900">
              {order.order_number}
            </h1>
            <p className="text-xs text-gray-500">
              Placed on {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={order.order_status} size="lg" />
            {canCancel && <CancelOrderButton orderNumber={order.order_number} />}
          </div>
        </div>

        {/* Fulfillment Timeline */}
        <OrderTimelineStepper
          currentStatus={order.order_status}
          history={history}
        />

        {/* Delivery Details & Logistics */}
        <div className="grid gap-6 sm:grid-cols-2 pt-2">
          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>Doorstep Delivery Address</span>
            </div>
            <p className="font-semibold text-gray-800">{address.name}</p>
            <p className="text-gray-600">{address.address_line_1}</p>
            {address.address_line_2 && <p className="text-gray-600">{address.address_line_2}</p>}
            {address.landmark && <p className="text-gray-500">Landmark: {address.landmark}</p>}
            <p className="text-gray-600">{address.city}, {address.state} — {address.pincode}</p>
            <p className="text-gray-700 font-medium">Contact: {address.phone}</p>
          </div>

          {/* Delivery & Payment Info */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Logistics &amp; Payment</span>
            </div>
            <div className="space-y-1 text-gray-700">
              <p>Delivery Area: <strong>{address.zone_name || "Direct Local Zone"} ({address.town})</strong></p>
              <p>ETA: <strong>{address.estimated_delivery || "Standard delivery"}</strong></p>
            </div>
            <div className="border-t border-blue-200/60 pt-2 flex items-center justify-between text-gray-700">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                <span>Payment:</span>
              </div>
              <span className="font-semibold">
                {order.payment_status === "PAID" ? (
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">PAID</span>
                ) : (
                  <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">Pay on Delivery</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Ordered Items Breakdown */}
        <div className="space-y-3 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Order Items ({items.length})
          </h2>

          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="font-bold text-gray-900">{item.product_name_snapshot}</span>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 pl-6">
                    SKU: {item.sku_snapshot} | Qty: {item.quantity} × ₹{item.unit_price.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="text-right font-bold text-gray-900">
                  ₹{item.subtotal.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-2 border-t border-gray-100 pt-4 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Items Subtotal</span>
            <span className="font-semibold text-gray-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Charge</span>
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
          <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
            <span>Total Amount</span>
            <span className="text-lg text-blue-600">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Order History Notes if any */}
        {history.length > 0 && (
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-gray-700">
              <History className="h-3.5 w-3.5 text-gray-500" />
              <span>Status Activity Log</span>
            </div>
            <div className="space-y-1.5 divide-y divide-gray-100">
              {history.map((h) => (
                <div key={h.id} className="pt-1.5 flex justify-between items-start text-[11px]">
                  <div>
                    <span className="font-semibold text-gray-800">{h.new_status}</span>
                    {h.note && <span className="text-gray-500 ml-2">— {h.note}</span>}
                  </div>
                  <span className="text-gray-400 font-mono shrink-0">
                    {new Date(h.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
