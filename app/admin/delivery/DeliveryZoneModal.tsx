"use client";

import { useState, useTransition } from "react";
import { saveDeliveryZoneAction } from "./actions";
import type { DeliveryZoneRecord } from "@/lib/checkout/delivery";
import { Dialog } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface DeliveryZoneModalProps {
  zone: DeliveryZoneRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeliveryZoneModal({
  zone,
  isOpen,
  onClose,
}: DeliveryZoneModalProps) {
  const [pincode, setPincode] = useState(zone?.pincode ?? "");
  const [town, setTown] = useState(zone?.town ?? "");
  const [zoneName, setZoneName] = useState(zone?.zone_name ?? "Direct Local");
  const [deliveryCharge, setDeliveryCharge] = useState(zone?.delivery_charge ?? 0);
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    zone?.estimated_delivery ?? "Same-day delivery (within 4 hours)",
  );
  const [minimumOrder, setMinimumOrder] = useState(zone?.minimum_order ?? 0);
  const [isActive, setIsActive] = useState(zone?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPin = pincode.trim().replace(/\D/g, "");
    if (!cleanPin || cleanPin.length !== 6) {
      setError("Please provide a valid 6-digit postal pincode.");
      return;
    }

    if (!town.trim()) {
      setError("Town / Locality name is required.");
      return;
    }

    startTransition(async () => {
      const result = await saveDeliveryZoneAction(zone?.id || null, {
        pincode: cleanPin,
        town: town.trim(),
        zoneName: zoneName.trim() || "Direct Local",
        deliveryCharge: Math.max(0, deliveryCharge),
        estimatedDelivery: estimatedDelivery.trim() || "Same-day delivery (within 4 hours)",
        minimumOrder: Math.max(0, minimumOrder),
        isActive,
      });

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={zone ? "Edit Delivery Zone" : "Add Serviceable Pincode"}
      description="Configure delivery charge, estimated time, and minimum order rules."
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-900 border-2 border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pincode & Town */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="pincode-input" className="block text-sm font-bold text-slate-800">
                Pincode (6-digit) *
              </label>
              <input
                id="pincode-input"
                type="text"
                maxLength={6}
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 413001"
                className="w-full rounded-lg border-2 border-slate-300 p-3 font-mono text-base font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="town-input" className="block text-sm font-bold text-slate-800">
                Town / City Name *
              </label>
              <input
                id="town-input"
                type="text"
                required
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="e.g. Solapur Central"
                className="w-full rounded-lg border-2 border-slate-300 p-3 text-base text-slate-900 focus:border-blue-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Zone Classification */}
          <div className="space-y-1">
            <label htmlFor="zone-class" className="block text-sm font-bold text-slate-800">
              Zone Area / Cluster Name
            </label>
            <input
              id="zone-class"
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="e.g. Direct Local Zone, Outer Ring Road"
              className="w-full rounded-lg border-2 border-slate-300 p-3 text-base text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          {/* Delivery Charge & Minimum Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="charge-input" className="block text-sm font-bold text-slate-800">
                Delivery Charge (₹)
              </label>
              <input
                id="charge-input"
                type="number"
                min="0"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-lg border-2 border-slate-300 p-3 text-base font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              <span className="text-xs text-slate-500">Set 0 for Free Delivery</span>
            </div>

            <div className="space-y-1">
              <label htmlFor="min-order-input" className="block text-sm font-bold text-slate-800">
                Minimum Order Value (₹)
              </label>
              <input
                id="min-order-input"
                type="number"
                min="0"
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-lg border-2 border-slate-300 p-3 text-base font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
              />
              <span className="text-xs text-slate-500">0 for no minimum restriction</span>
            </div>
          </div>

          {/* Estimated Delivery Timeline */}
          <div className="space-y-1">
            <label htmlFor="eta-input" className="block text-sm font-bold text-slate-800">
              Estimated Delivery Timeframe
            </label>
            <input
              id="eta-input"
              type="text"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              placeholder="e.g. Same-day (within 2-4 hours)"
              className="w-full rounded-lg border-2 border-slate-300 p-3 text-base text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="active-check"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 rounded border-slate-400 text-blue-700 focus:ring-blue-700 cursor-pointer"
            />
            <label htmlFor="active-check" className="text-sm font-bold text-slate-800 cursor-pointer">
              Active Zone (Enable checkout and verification for this pincode)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-11 rounded-lg border-2 border-slate-300 px-5 text-sm font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{zone ? "Save Changes" : "Create Delivery Zone"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
