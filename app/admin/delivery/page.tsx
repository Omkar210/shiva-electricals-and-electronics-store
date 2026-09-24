import { requireStaffOrAdmin } from "@/lib/auth/roles";
import { listAdminDeliveryZones } from "@/lib/checkout/delivery";
import { DeliverySearch } from "./DeliverySearch";
import { DeliveryZoneTable } from "./DeliveryZoneTable";
import {
  MapPin,
  CheckCircle2,
  Truck,
  Building2,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Zones Matrix — Admin Portal",
};

interface AdminDeliveryPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function AdminDeliveryPage({
  searchParams,
}: AdminDeliveryPageProps) {
  await requireStaffOrAdmin("/admin/delivery");
  const { search } = await searchParams;

  const allZones = await listAdminDeliveryZones();
  const filteredZones = await listAdminDeliveryZones(search);

  // Compute operational statistics
  const totalPincodes = allZones.length;
  const activeZones = allZones.filter((z) => z.is_active).length;
  const freeDeliveryZones = allZones.filter((z) => z.is_active && z.delivery_charge === 0).length;
  const uniqueTowns = new Set(allZones.map((z) => z.town.toLowerCase().trim())).size;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Delivery Zones Matrix
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Configure serviced postal pincodes, local delivery rates, dispatch timelines, and minimum order rules.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Mapped Pincodes */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Mapped Pincodes</span>
            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">
            {totalPincodes}
          </p>
          <span className="text-[11px] text-gray-400">Postal codes configured</span>
        </div>

        {/* Active Zones */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold">Active Checkout Zones</span>
            <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-900">
            {activeZones}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">
            Accepting automated orders
          </span>
        </div>

        {/* Free Delivery Zones */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-semibold">Free Delivery Zones</span>
            <div className="rounded-lg bg-indigo-100 p-1.5 text-indigo-700">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-900">
            {freeDeliveryZones}
          </p>
          <span className="text-[11px] text-indigo-700 font-medium">
            ₹0 delivery charge pincodes
          </span>
        </div>

        {/* Towns Covered */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold">Towns &amp; Localities</span>
            <div className="rounded-lg bg-amber-100 p-1.5 text-amber-700">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-900">
            {uniqueTowns}
          </p>
          <span className="text-[11px] text-amber-700">
            Distinct coverage clusters
          </span>
        </div>
      </div>

      {/* Search and Table */}
      <div className="space-y-4">
        <DeliverySearch />
        <DeliveryZoneTable zones={filteredZones} />
      </div>
    </div>
  );
}
