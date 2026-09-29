import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getOrderByNumber } from "@/lib/orders/service";
import { isOrderAuthorized } from "@/lib/orders/auth";
import {
  CheckCircle2,
  Package,
  MapPin,
  Truck,
  PhoneCall,
  ArrowRight,
  Receipt,
} from "lucide-react";
import type { Metadata } from "next";

interface ConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: ConfirmationPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return {
      title: "Order Not Found",
    };
  }
  return {
    title: `Order ${orderNumber} Confirmed`,
  };
}

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  // Prevent IDOR access: Only the session who placed it, owner, or staff may view full confirmation
  const { authorized } = await isOrderAuthorized(order);
  if (!authorized) {
    redirect(`/orders/${orderNumber}`);
  }

  const address = order.delivery_address_snapshot;
  const items = order.order_items || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Success Hero Banner */}
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-xs text-gray-600 sm:text-sm">
          Thank you for choosing Shiva Electrical &amp; Electronics. We have received your order and our shop team is preparing it for dispatch.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-gray-800 shadow-xs border border-emerald-200">
          <Receipt className="h-4 w-4 text-emerald-600" />
          <span>Order Number: <strong className="font-mono text-emerald-700">{order.order_number}</strong></span>
        </div>
      </div>

      {/* 2. Order Summary Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                {order.order_status}
              </span>
              <span className="text-xs text-gray-500">
                Payment: <strong className="text-gray-700">{order.payment_status} (Pay on Delivery)</strong>
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-gray-500">
            Ordered On: <strong>{new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</strong>
          </div>
        </div>

        {/* 3. Delivery & Dispatch Details */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Shipping Address Snapshot */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>Delivery Address</span>
            </div>
            <p className="font-semibold text-gray-800">{address.name}</p>
            <p className="text-gray-600">{address.address_line_1}</p>
            {address.address_line_2 && <p className="text-gray-600">{address.address_line_2}</p>}
            {address.landmark && <p className="text-gray-500">Landmark: {address.landmark}</p>}
            <p className="text-gray-600">{address.city}, {address.state} — {address.pincode}</p>
            <p className="text-gray-700 font-medium">Contact: {address.phone}</p>
          </div>

          {/* Delivery Window & Service Zone */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Delivery Logistics</span>
            </div>
            <p className="text-gray-700">
              Zone: <strong>{address.zone_name || "Direct Local Zone"} ({address.town})</strong>
            </p>
            <p className="text-gray-700">
              Estimated Delivery: <strong>{address.estimated_delivery || "Within standard zone window"}</strong>
            </p>
            <p className="text-[11px] text-gray-500 pt-1">
              Our delivery driver will call on <strong>{address.phone}</strong> before arrival. Please keep exact cash or UPI QR scanner ready.
            </p>
          </div>
        </div>

        {/* 4. Ordered Items Breakdown */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Items in this Order
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

        {/* 5. Authoritative Financials */}
        <div className="space-y-2 border-t border-gray-100 pt-4 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Items Subtotal</span>
            <span className="font-semibold text-gray-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Local Delivery Fee</span>
            <span className="font-semibold text-gray-900">
              {order.delivery_fee === 0 ? "FREE" : `₹${order.delivery_fee.toLocaleString("en-IN")}`}
            </span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
            <span>Total Payable on Delivery</span>
            <span className="text-lg text-blue-600">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* 6. Post-Order Navigation & Shop Help */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <PhoneCall className="h-4 w-4 text-blue-600" />
          <span>Have an inquiry about this order? Call our store directly.</span>
        </div>
      </div>
    </div>
  );
}
