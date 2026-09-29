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
  Package,
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
          error: `Pincode ${clean} is outside our direct local delivery zone. Please call the shop (+91 98765 43210) for nearby delivery arrangements.`,
        });
      } else if (data.minimum_order > 0 && cart.subtotal < data.minimum_order) {
        setPincodeStatus("invalid");
        setZoneDetails({
          town: data.town,
          zoneName: data.zone_name,
          deliveryCharge: data.delivery_charge,
          estimatedDelivery: data.estimated_delivery,
          minimumOrder: data.minimum_order,
          error: `Minimum order for doorstep delivery to ${data.town} is ₹${data.minimum_order}. Your cart subtotal is ₹${cart.subtotal}.`,
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
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Back to Cart"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Delivery &amp; Checkout
          </h1>
        </div>

        {state?.error && (
          <div className="flex items-start gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-950">
            <AlertCircle className="h-6 w-6 shrink-0 text-red-700 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Please review your information:</p>
              <p className="mt-0.5 text-red-800">{state.error}</p>
            </div>
          </div>
        )}

        {/* 1. Customer Contact */}
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
            1. Customer Contact Details
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-800 mb-1">
                Your Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={profile?.full_name || ""}
                placeholder="e.g. Ramesh Sharma"
                className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-slate-800 mb-1">
                Mobile Number (for Delivery Driver) *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                defaultValue={profile?.phone || ""}
                placeholder="10-digit mobile number"
                className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-1">
              Email Address (Optional, for digital receipt)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={profile?.email || ""}
              placeholder="you@example.com"
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
            />
          </div>
        </div>

        {/* 2. Delivery Address */}
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
            2. Doorstep Delivery Address
          </h2>

          <div>
            <label htmlFor="addressLine1" className="block text-sm font-bold text-slate-800 mb-1">
              House / Flat No., Building &amp; Street Address *
            </label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              required
              placeholder="e.g. Flat 202, Gokul Residency, Main Market Road"
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="addressLine2" className="block text-sm font-bold text-slate-800 mb-1">
                Colony, Sector or Mohalla
              </label>
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                placeholder="e.g. Sector 4, Near Gandhi Chowk"
                className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label htmlFor="landmark" className="block text-sm font-bold text-slate-800 mb-1">
                Nearby Landmark
              </label>
              <input
                id="landmark"
                name="landmark"
                type="text"
                placeholder="e.g. Opposite Water Tank or High School"
                className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="pincode" className="block text-sm font-bold text-slate-800 mb-1">
                6-digit Pincode *
              </label>
              <div className="relative">
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="e.g. 413001"
                  className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base font-bold tracking-wider text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
                />
                {pincodeStatus === "loading" && (
                  <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-blue-700" />
                )}
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-bold text-slate-800 mb-1">
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
                className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-bold text-slate-800 mb-1">
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                defaultValue="Maharashtra"
                className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 bg-slate-50 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>
          </div>

          {/* Delivery Zone Feedback */}
          {pincodeStatus === "valid" && zoneDetails && (
            <div className="flex items-start gap-3 rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4 text-emerald-950">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-700 mt-0.5" />
              <div>
                <p className="text-base font-bold text-emerald-900">
                  Doorstep Delivery Confirmed for {zoneDetails.town} ({zoneDetails.zoneName})
                </p>
                <p className="mt-1 text-sm font-medium text-emerald-800">
                  Estimated Arrival: <strong className="text-slate-900">{zoneDetails.estimatedDelivery}</strong> | Delivery Fee:{" "}
                  <strong className="text-slate-900">
                    {zoneDetails.deliveryCharge === 0 ? "FREE" : `₹${zoneDetails.deliveryCharge}`}
                  </strong>
                </p>
              </div>
            </div>
          )}

          {pincodeStatus === "invalid" && zoneDetails?.error && (
            <div className="flex items-start gap-3 rounded-lg border-2 border-amber-300 bg-amber-50 p-4 text-amber-950">
              <AlertCircle className="h-6 w-6 shrink-0 text-amber-700 mt-0.5" />
              <p className="text-sm font-semibold">{zoneDetails.error}</p>
            </div>
          )}
        </div>

        {/* 3. Payment Method */}
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
            3. Payment Method
          </h2>

          <div>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-blue-700 bg-blue-50/50 p-4">
              <div className="flex items-center gap-3.5">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  defaultChecked
                  className="h-5 w-5 text-blue-700 focus:ring-blue-700 cursor-pointer"
                />
                <div>
                  <span className="block text-base font-bold text-slate-900">
                    Pay on Delivery (Cash or UPI at Doorstep)
                  </span>
                  <span className="block text-sm text-slate-600 mt-0.5">
                    Inspect your product upon delivery, then pay with cash or any UPI app (GPay, PhonePe, Paytm).
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2.5 text-blue-800">
                <DollarSign className="h-6 w-6" />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Order Summary & Confirmation Column */}
      <div className="space-y-4 lg:col-span-5">
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
            Review Your Order
          </h2>

          {/* Items List */}
          <div className="max-h-72 space-y-3.5 overflow-y-auto divide-y-2 divide-slate-100 pr-1">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3.5 pt-3.5 first:pt-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {item.product?.primary_image ? (
                    <Image
                      src={item.product.primary_image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <Package className="h-6 w-6 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {item.product?.name}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    Qty: {item.quantity} × ₹{item.product?.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  ₹{item.lineTotal.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-3 border-t-2 border-slate-200 pt-4 text-base">
            <div className="flex justify-between text-slate-700">
              <span>Items Total</span>
              <span className="font-bold text-slate-900">
                ₹{cart.subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-slate-700">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-900">
                {pincodeStatus === "valid"
                  ? deliveryFee === 0
                    ? "FREE"
                    : `₹${deliveryFee.toLocaleString("en-IN")}`
                  : "Enter pincode to see"}
              </span>
            </div>

            <div className="border-t-2 border-slate-200 pt-3 flex justify-between text-lg font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-2xl font-black text-blue-700">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Form Consent Checkbox (DPDP Act & CPA Rules Compliant) */}
          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 space-y-2">
            <label htmlFor="checkout-consent" className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id="checkout-consent"
                name="consent"
                required
                className="mt-1 h-5 w-5 rounded border-2 border-slate-400 text-blue-700 focus:ring-2 focus:ring-blue-700 cursor-pointer shrink-0"
              />
              <span className="text-sm font-medium text-slate-700 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="font-bold text-blue-700 underline hover:text-blue-800">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/refund-policy" target="_blank" className="font-bold text-blue-700 underline hover:text-blue-800">
                  Refund &amp; Return Policy
                </Link>
                , and I consent to Shiva Electrical collecting my delivery contact details to fulfill this order under the{" "}
                <Link href="/privacy-policy" target="_blank" className="font-bold text-blue-700 underline hover:text-blue-800">
                  Privacy Policy (DPDP Act 2023)
                </Link>
                . <span className="text-red-700 font-bold">*</span>
              </span>
            </label>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isPending || pincodeStatus !== "valid"}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 active:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Confirming Your Order...</span>
              </>
            ) : pincodeStatus !== "valid" ? (
              <span>Enter Valid Pincode Above to Proceed</span>
            ) : (
              <span>Place Order (Pay ₹{grandTotal.toLocaleString("en-IN")} on Delivery)</span>
            )}
          </button>

          <div className="space-y-2 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Zero advance payment required. Inspect upon doorstep delivery.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-700 shrink-0" />
              <span>Direct delivery by our verified local store staff.</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
