"use client";

import { useState, useTransition } from "react";
import { saveDeliveryZoneAction } from "./actions";
import type { DeliveryZoneRecord } from "@/lib/checkout/delivery";
import { MapPin, X, Loader2 } from "lucide-react";

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {zone ? "Edit Delivery Zone" : "Add Service Pincode"}
              </h3>
              <p className="text-xs text-gray-500">
                Configure delivery rates, dispatch timelines, and minimum order values.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pincode & Town */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="pincode-input" className="block text-xs font-semibold text-gray-700">
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
                className="w-full rounded-xl border border-gray-300 p-2.5 font-mono text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="town-input" className="block text-xs font-semibold text-gray-700">
                Town / City Name *
              </label>
              <input
                id="town-input"
                type="text"
                required
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="e.g. Solapur Central"
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Zone Classification */}
          <div className="space-y-1">
            <label htmlFor="zone-class" className="block text-xs font-semibold text-gray-700">
              Zone Cluster / Classification
            </label>
            <input
              id="zone-class"
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="e.g. Direct Local Zone, Outer Town, Industrial Area"
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Delivery Charge & Minimum Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="charge-input" className="block text-xs font-semibold text-gray-700">
                Delivery Charge (₹)
              </label>
              <input
                id="charge-input"
                type="number"
                min="0"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400">Set 0 for Free Delivery</span>
            </div>

            <div className="space-y-1">
              <label htmlFor="min-order-input" className="block text-xs font-semibold text-gray-700">
                Minimum Order Value (₹)
              </label>
              <input
                id="min-order-input"
                type="number"
                min="0"
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400">0 for no minimum restriction</span>
            </div>
          </div>

          {/* Estimated Delivery Timeline */}
          <div className="space-y-1">
            <label htmlFor="eta-input" className="block text-xs font-semibold text-gray-700">
              Estimated Delivery SLA / Window
            </label>
            <input
              id="eta-input"
              type="text"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              placeholder="e.g. Same-day (within 2-4 hours), Next-day 11 AM"
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="active-check"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label htmlFor="active-check" className="text-xs font-medium text-gray-700 cursor-pointer">
              Active Zone (Allow storefront checkout and delivery verification)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                zone ? "Save Changes" : "Create Delivery Zone"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
