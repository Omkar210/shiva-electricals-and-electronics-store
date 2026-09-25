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
  PhoneCall,
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
    title: `Order #${orderNumber} Details & Tracking`,
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
          className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Order Header Card */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-slate-100 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Order Details &amp; Receipt
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              #{order.order_number}
            </h1>
            <p className="text-sm font-medium text-slate-600">
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
          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5 space-y-2 text-base">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
              <MapPin className="h-5 w-5 text-blue-700" />
              <span>Doorstep Delivery Address</span>
            </div>
            <p className="font-bold text-slate-900">{address.name}</p>
            <p className="text-slate-700">{address.address_line_1}</p>
            {address.address_line_2 && <p className="text-slate-700">{address.address_line_2}</p>}
            {address.landmark && <p className="text-slate-600">Landmark: {address.landmark}</p>}
            <p className="text-slate-800 font-semibold">{address.city}, {address.state} — {address.pincode}</p>
            <p className="text-slate-900 font-bold pt-1">Contact: {address.phone}</p>
          </div>

          {/* Delivery & Payment Info */}
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50/60 p-5 space-y-3 text-base">
            <div className="flex items-center gap-2 font-bold text-blue-900 border-b border-blue-200 pb-2">
              <Truck className="h-5 w-5 text-blue-700" />
              <span>Logistics &amp; Payment Status</span>
            </div>
            <div className="space-y-1.5 text-slate-800">
              <p>Delivery Area: <strong>{address.zone_name || "Local Zone"} ({address.town})</strong></p>
              <p>Estimated Delivery: <strong>{address.estimated_delivery || "Standard delivery"}</strong></p>
            </div>
            <div className="border-t border-blue-200 pt-2 flex items-center justify-between text-slate-900 font-bold">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-5 w-5 text-blue-700" />
                <span>Payment Terms:</span>
              </div>
              <span>
                {order.payment_status === "PAID" ? (
                  <span className="text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full text-sm font-bold">PAID</span>
                ) : (
                  <span className="text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-sm font-bold">Pay on Delivery</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Ordered Items Breakdown */}
        <div className="space-y-3 pt-4">
          <h2 className="text-lg font-bold text-slate-900">
            Ordered Products ({items.length})
          </h2>

          <div className="divide-y-2 divide-slate-100 rounded-xl border-2 border-slate-200 bg-white">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 text-base">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-slate-400" />
                    <span className="font-bold text-slate-900">{item.product_name_snapshot}</span>
                  </div>
                  <div className="text-sm font-mono text-slate-600 pl-7">
                    SKU: {item.sku_snapshot} | Qty: {item.quantity} × ₹{item.unit_price.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="text-right text-lg font-extrabold text-slate-900">
                  ₹{item.subtotal.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-2.5 border-t-2 border-slate-200 pt-5 text-base">
          <div className="flex justify-between text-slate-700">
            <span>Items Subtotal</span>
            <span className="font-bold text-slate-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Local Delivery Fee</span>
            <span className="font-bold text-slate-900">
              {order.delivery_fee === 0 ? "FREE" : `₹${order.delivery_fee.toLocaleString("en-IN")}`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>Promotional Discount</span>
              <span>-₹{order.discount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="border-t-2 border-slate-200 pt-3 flex justify-between text-lg font-extrabold text-slate-900">
            <span>Total Payable Amount</span>
            <span className="text-2xl font-black text-blue-700">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Support Reassurance Card */}
        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <PhoneCall className="h-6 w-6 text-blue-700 shrink-0" />
            <div>
              <p className="text-base font-bold text-slate-900">Need to schedule or modify delivery time?</p>
              <p className="text-sm text-slate-600">Call our shop technician directly to arrange delivery hours.</p>
            </div>
          </div>
          <a
            href="tel:+919876543210"
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-bold text-white hover:bg-blue-800 transition-colors shrink-0"
          >
            <span>Call Shop: +91 98765 43210</span>
          </a>
        </div>
      </div>
    </div>
  );
}
