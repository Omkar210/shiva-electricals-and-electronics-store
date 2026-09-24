"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { handlePlaceOrder } from "./actions";
import { createClient } from "@/lib/supabase/client";
import type { CartState } from "@/lib/cart/service";
import type { CurrentUserProfile } from "@/lib/auth/roles";
import type { PlaceOrderResult } from "@/lib/orders/service";
import {
  Truck,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  DollarSign,
} from "lucide-react";

interface CheckoutFormProps {
  cart: CartState;
  profile: CurrentUserProfile | null;
}

export default function CheckoutForm({ cart, profile }: CheckoutFormProps) {
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [zoneDetails, setZoneDetails] = useState<{
    town: string;
    zoneName: string;
    deliveryCharge: number;
    estimatedDelivery: string;
    minimumOrder: number;
    error?: string;
  } | null>(null);

  const [state, formAction, isPending] = useActionState<PlaceOrderResult | null, FormData>(
    handlePlaceOrder,
    null,
  );

  const handlePincodeChange = async (value: string) => {
    const clean = value.trim().replace(/\D/g, "");
    setPincode(clean);

    if (clean.length === 6) {
      setPincodeStatus("loading");
      const supabase = createClient();
      const { data, error } = await supabase
        .from("delivery_zones")
        .select("town, zone_name, delivery_charge, estimated_delivery, minimum_order, is_active")
        .eq("pincode", clean)
        .single();

      if (error || !data || !data.is_active) {
        setPincodeStatus("invalid");
        setZoneDetails({
          town: "",
          zoneName: "",
          deliveryCharge: 0,
          estimatedDelivery: "",
          minimumOrder: 0,
          error: `Pincode ${clean} is not within our direct delivery zones. Please call the shop for nearby arrangements.`,
        });
      } else if (data.minimum_order > 0 && cart.subtotal < data.minimum_order) {
        setPincodeStatus("invalid");
        setZoneDetails({
          town: data.town,
          zoneName: data.zone_name,
          deliveryCharge: data.delivery_charge,
          estimatedDelivery: data.estimated_delivery,
          minimumOrder: data.minimum_order,
          error: `Minimum order for delivery to ${data.town} is ₹${data.minimum_order}. Your cart subtotal is ₹${cart.subtotal}.`,
        });
      } else {
        setPincodeStatus("valid");
        setZoneDetails({
          town: data.town,
          zoneName: data.zone_name,
          deliveryCharge: Number(data.delivery_charge),
          estimatedDelivery: data.estimated_delivery,
          minimumOrder: Number(data.minimum_order),
        });
      }
    } else {
      setPincodeStatus("idle");
      setZoneDetails(null);
    }
  };

  const deliveryFee = zoneDetails && pincodeStatus === "valid" ? zoneDetails.deliveryCharge : 0;
  const grandTotal = cart.subtotal + deliveryFee;

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-12">
      {/* Checkout Inputs Column */}
      <div className="space-y-6 lg:col-span-7">
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Secure Checkout
          </h1>
        </div>

        {state?.error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="font-semibold">{state.error}</p>
          </div>
        )}

        {/* 1. Customer Contact */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            1. Contact Details
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={profile?.full_name || ""}
                placeholder="Ramesh Sharma"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-gray-700">
                Phone Number (for Delivery Driver) *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                defaultValue={profile?.phone || ""}
                placeholder="10-digit mobile number"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
              Email Address (for Order Updates)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={profile?.email || ""}
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>

        {/* 2. Delivery Address */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            2. Delivery Address
          </h2>

          <div>
            <label htmlFor="addressLine1" className="block text-xs font-semibold text-gray-700">
              House / Building / Street Address *
            </label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              required
              placeholder="Flat 202, Gokul Residency, Main Market Road"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="addressLine2" className="block text-xs font-semibold text-gray-700">
                Area / Colony / Sector
              </label>
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                placeholder="Sector 4"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label htmlFor="landmark" className="block text-xs font-semibold text-gray-700">
                Nearby Landmark
              </label>
              <input
                id="landmark"
                name="landmark"
                type="text"
                placeholder="Opposite Water Tank"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="pincode" className="block text-xs font-semibold text-gray-700">
                Pincode *
              </label>
              <div className="relative mt-1">
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="6-digit PIN"
                  className="block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
                {pincodeStatus === "loading" && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                )}
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-gray-700">
                Town / City *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={zoneDetails?.town || ""}
                onChange={(e) =>
                  setZoneDetails((prev) => (prev ? { ...prev, town: e.target.value } : null))
                }
                placeholder="City/Town"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-xs font-semibold text-gray-700">
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                defaultValue="Maharashtra"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {/* Delivery Zone Feedback */}
          {pincodeStatus === "valid" && zoneDetails && (
            <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold">
                  Delivery Verified for {zoneDetails.town} ({zoneDetails.zoneName})
                </p>
                <p className="mt-0.5 text-[11px] text-gray-600">
                  Estimated Delivery: <strong>{zoneDetails.estimatedDelivery}</strong> | Delivery Fee:{" "}
                  {zoneDetails.deliveryCharge === 0 ? "FREE" : `₹${zoneDetails.deliveryCharge}`}
                </p>
              </div>
            </div>
          )}

          {pincodeStatus === "invalid" && zoneDetails?.error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <p>{zoneDetails.error}</p>
            </div>
          )}
        </div>

        {/* 3. Payment Method */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            3. Payment Method
          </h2>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-blue-600 bg-blue-50/30 p-4">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-sm font-bold text-gray-900">
                    Pay on Delivery (Cash / UPI at Doorstep)
                  </span>
                  <span className="block text-xs text-gray-500">
                    Pay our delivery driver using Cash or any UPI App upon inspecting your order.
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                <DollarSign className="h-5 w-5" />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Order Summary & Confirmation Column */}
      <div className="space-y-4 lg:col-span-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-gray-900">Order Items</h2>

          {/* Items List */}
          <div className="max-h-60 space-y-3 overflow-y-auto divide-y divide-gray-100 pr-1">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 pt-3 first:pt-0">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  {item.product?.primary_image && (
                    <Image
                      src={item.product.primary_image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-900">
                    {item.product?.name}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Qty: {item.quantity} × ₹{item.product?.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-xs font-bold text-gray-900">
                  ₹{item.lineTotal.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2.5 border-t border-gray-100 pt-4 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">
                ₹{cart.subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Local Delivery Fee</span>
              <span className="font-semibold text-gray-900">
                {pincodeStatus === "valid"
                  ? deliveryFee === 0
                    ? "FREE"
                    : `₹${deliveryFee.toLocaleString("en-IN")}`
                  : "Enter pincode above"}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
              <span>Total Payable</span>
              <span className="text-lg text-blue-600">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isPending || pincodeStatus !== "valid"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Confirming Order...</span>
              </>
            ) : pincodeStatus !== "valid" ? (
              "Enter Valid Delivery Pincode"
            ) : (
              `Place Order (Pay ₹${grandTotal.toLocaleString("en-IN")} on Delivery)`
            )}
          </button>

          <div className="space-y-2 border-t border-gray-100 pt-4 text-[11px] text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>No online pre-payment required. Pay after delivery.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Local doorstep dispatch within stated zone window.</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
