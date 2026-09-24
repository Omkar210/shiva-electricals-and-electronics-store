"use client";

import { useState, useTransition } from "react";
import { DeliveryZoneModal } from "./DeliveryZoneModal";
import {
  toggleDeliveryZoneActiveAction,
  deleteDeliveryZoneAction,
} from "./actions";
import type { DeliveryZoneRecord } from "@/lib/checkout/delivery";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface DeliveryZoneTableProps {
  zones: DeliveryZoneRecord[];
}

export function DeliveryZoneTable({ zones }: DeliveryZoneTableProps) {
  const [selectedZone, setSelectedZone] = useState<DeliveryZoneRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmZone, setDeleteConfirmZone] = useState<DeliveryZoneRecord | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    setSelectedZone(null);
    setIsModalOpen(true);
  };

  const handleEdit = (zone: DeliveryZoneRecord) => {
    setSelectedZone(zone);
    setIsModalOpen(true);
  };

  const handleToggle = (zone: DeliveryZoneRecord) => {
    startTransition(async () => {
      await toggleDeliveryZoneActiveAction(zone.id, !zone.is_active);
    });
  };

  const handleDelete = (zone: DeliveryZoneRecord) => {
    startTransition(async () => {
      await deleteDeliveryZoneAction(zone.id);
      setDeleteConfirmZone(null);
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Table Top Actions */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{zones.length}</strong> configured service areas
          </p>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Service Pincode
          </button>
        </div>

        {/* Zones Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          {zones.length === 0 ? (
            <div className="p-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-sm font-bold text-gray-900">No Delivery Zones Found</h3>
              <p className="mt-1 text-xs text-gray-500">
                Configure your town pincodes and delivery fees to start accepting doorstep delivery orders.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Pincode</th>
                    <th scope="col" className="px-4 py-3.5">Town &amp; Locality</th>
                    <th scope="col" className="px-4 py-3.5">Zone Cluster</th>
                    <th scope="col" className="px-4 py-3.5">Delivery Fee</th>
                    <th scope="col" className="px-4 py-3.5">Min. Order</th>
                    <th scope="col" className="px-4 py-3.5">Estimated ETA</th>
                    <th scope="col" className="px-4 py-3.5">Status</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {zones.map((zone) => (
                    <tr
                      key={zone.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Pincode */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-gray-900 text-sm">
                          {zone.pincode}
                        </span>
                      </td>

                      {/* Town */}
                      <td className="px-4 py-3.5 font-semibold text-gray-900">
                        {zone.town}
                      </td>

                      {/* Zone Cluster */}
                      <td className="px-4 py-3.5 text-gray-600">
                        {zone.zone_name}
                      </td>

                      {/* Delivery Charge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {zone.delivery_charge === 0 ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            FREE
                          </span>
                        ) : (
                          <span className="font-bold text-gray-900">
                            ₹{zone.delivery_charge.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>

                      {/* Minimum Order */}
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                        {zone.minimum_order > 0 ? (
                          <span>₹{zone.minimum_order.toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>

                      {/* Estimated ETA */}
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{zone.estimated_delivery}</span>
                        </div>
                      </td>

                      {/* Active Status Switch */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggle(zone)}
                          disabled={isPending}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            zone.is_active ? "bg-emerald-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              zone.is_active ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(zone)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 cursor-pointer"
                            title="Edit Delivery Zone"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmZone(zone)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                            title="Delete Delivery Zone"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      <DeliveryZoneModal
        key={selectedZone?.id ?? "new-zone"}
        zone={selectedZone}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="rounded-xl bg-red-100 p-2.5">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Delete Delivery Zone?</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {deleteConfirmZone.town} ({deleteConfirmZone.pincode})
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Customers ordering with pincode <strong>{deleteConfirmZone.pincode}</strong> will no longer be eligible for automated local delivery checkout.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmZone(null)}
                disabled={isPending}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmZone)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Zone"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
