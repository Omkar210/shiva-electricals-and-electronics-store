"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Truck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "available" | "unavailable">("idle");
  const [zoneDetails, setZoneDetails] = useState<{
    town: string;
    deliveryCharge: number;
    estimatedDelivery: string;
    minimumOrder: number;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length !== 6) return;

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
    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
        <Truck className="h-4 w-4 text-blue-600" />
        <span>Check Local Delivery Availability</span>
      </div>

      <form onSubmit={handleCheck} className="mt-2.5 flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit Pincode"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />
        <button
          type="submit"
          disabled={status === "loading" || pincode.length !== 6}
          className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Check"
          )}
        </button>
      </form>

      {status === "available" && zoneDetails && (
        <div className="mt-3 flex items-start gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold">
              Delivery Available to {zoneDetails.town}!
            </p>
            <p className="mt-0.5 text-[11px] text-gray-600">
              Estimated Delivery: <strong>{zoneDetails.estimatedDelivery}</strong> | Delivery Fee:{" "}
              {zoneDetails.deliveryCharge === 0
                ? "FREE"
                : `₹${zoneDetails.deliveryCharge}`}
            </p>
          </div>
        </div>
      )}

      {status === "unavailable" && (
        <div className="mt-3 flex items-start gap-2 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">Not currently in direct local zone</p>
            <p className="mt-0.5 text-[11px] text-gray-600">
              Direct local delivery is not yet automated for this pincode. Please contact the shop directly for nearby town delivery arrangements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
