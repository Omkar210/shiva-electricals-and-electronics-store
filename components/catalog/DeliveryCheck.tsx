"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Truck, CheckCircle2, AlertCircle, Loader2, PhoneCall } from "lucide-react";

export default function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "available" | "unavailable">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [zoneDetails, setZoneDetails] = useState<{
    town: string;
    deliveryCharge: number;
    estimatedDelivery: string;
    minimumOrder: number;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanPin = pincode.trim().replace(/\D/g, "");
    if (!cleanPin || cleanPin.length !== 6) {
      setValidationError("Please enter a complete 6-digit postal pincode (e.g. 413001).");
      return;
    }

    setStatus("loading");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("delivery_zones")
      .select("town, delivery_charge, estimated_delivery, minimum_order, is_active")
      .eq("pincode", cleanPin)
      .single();

    if (error || !data || !data.is_active) {
      setStatus("unavailable");
      setZoneDetails(null);
    } else {
      setStatus("available");
      setZoneDetails({
        town: data.town,
        deliveryCharge: data.delivery_charge,
        estimatedDelivery: data.estimated_delivery,
        minimumOrder: data.minimum_order,
      });
    }
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50/60 p-5 sm:p-6 shadow-2xs">
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-blue-700 p-2 text-white">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900">
            Check Doorstep Delivery in Your Area
          </h4>
          <p className="text-sm text-slate-600">
            Enter your 6-digit postal pincode to see delivery speed and fees
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="mt-4 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            id="pincode-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setValidationError(null);
              setPincode(e.target.value.replace(/\D/g, ""));
            }}
            placeholder="Enter 6-digit Pincode (e.g. 413001)"
            className="h-12 w-full rounded-lg border-2 border-slate-300 bg-white px-4 text-base font-semibold tracking-wider text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
            aria-label="Enter 6-digit postal pincode"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <span>Verify Pincode</span>
          )}
        </button>
      </form>

      {/* Validation helper message */}
      {validationError && (
        <div className="mt-3 rounded-lg border-2 border-amber-300 bg-amber-50 p-3 text-sm font-bold text-amber-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Available Notice */}
      {status === "available" && zoneDetails && (
        <div className="mt-4 rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4 text-emerald-950">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-base font-bold text-emerald-900">
                Doorstep Delivery is Available for {zoneDetails.town}!
              </p>
              <p className="text-sm font-medium text-emerald-800">
                Delivery Schedule: <strong className="text-slate-900">{zoneDetails.estimatedDelivery}</strong>
              </p>
              <p className="text-sm font-medium text-emerald-800">
                Delivery Fee:{" "}
                <strong className="text-slate-900">
                  {zoneDetails.deliveryCharge === 0 ? "FREE (No Charge)" : `₹${zoneDetails.deliveryCharge}`}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Outside Zone Notice with Direct Call Assistance */}
      {status === "unavailable" && (
        <div className="mt-4 rounded-lg border-2 border-amber-300 bg-amber-50 p-4 text-amber-950">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-base font-bold text-amber-900">
                Pincode {pincode} is outside our automated daily zone
              </p>
              <p className="text-sm text-amber-800">
                We still deliver to nearby talukas and districts by special appointment! Call our shop to arrange doorstep delivery:
              </p>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-3.5 py-2 text-sm font-bold text-white hover:bg-amber-800 transition-colors"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call Shop for Assistance: +91 98765 43210</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
