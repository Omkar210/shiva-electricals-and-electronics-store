import Link from "next/link";
import { getActiveDeliveryZones } from "@/lib/checkout/delivery";
import DeliveryCheck from "@/components/catalog/DeliveryCheck";
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Coverage & Pincode Checker",
  description:
    "Check doorstep delivery availability, local shipping rates, and estimated delivery windows across our serviced towns and pincodes.",
};

export default async function DeliveryCoveragePage() {
  const zones = await getActiveDeliveryZones();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Hero Section */}
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-8 sm:p-12 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
          <Truck className="h-7 w-7" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900">
          Doorstep Delivery &amp; Service Coverage
        </h1>
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-gray-600 leading-relaxed">
          Shiva Electrical &amp; Electronics provides same-day local delivery and expert installation for RO water purifiers, replacement filters, ceiling fans, and home electrical supplies.
        </p>

        {/* Live Pincode Checker Card */}
        <div className="mx-auto max-w-md pt-4">
          <DeliveryCheck />
        </div>
      </div>

      {/* Trust Highlights Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-2">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-600 w-fit">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-gray-900 text-sm">Same-Day Local Dispatch</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Orders confirmed before 4 PM within central town limits are dispatched for same-day delivery via direct store transport.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-2">
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 w-fit">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-gray-900 text-sm">Doorstep Installation</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            RO purifiers and major appliances come with expert doorstep setup, water TDS testing, and plumbing connection by certified technicians.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-2">
          <div className="rounded-xl bg-purple-50 p-2 text-purple-600 w-fit">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-gray-900 text-sm">Pay on Delivery (COD)</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Inspect your order upon doorstep arrival before paying via cash or UPI scan. Zero online payment risk.
          </p>
        </div>
      </div>

      {/* Coverage Directory Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Serviced Pincodes Directory ({zones.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live automated checkout is active for the following postal areas:
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Browse Store Catalog
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-3.5">Pincode</th>
                <th scope="col" className="px-6 py-3.5">Town &amp; Locality</th>
                <th scope="col" className="px-6 py-3.5">Zone Area</th>
                <th scope="col" className="px-6 py-3.5">Delivery Fee</th>
                <th scope="col" className="px-6 py-3.5">Minimum Order</th>
                <th scope="col" className="px-6 py-3.5">Expected Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {zones.map((zone) => (
                <tr key={zone.pincode} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 text-sm whitespace-nowrap">
                    {zone.pincode}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {zone.town}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {zone.zone_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {zone.delivery_charge === 0 ? (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        FREE
                      </span>
                    ) : (
                      <span className="font-bold text-gray-900">
                        ₹{zone.delivery_charge.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {zone.minimum_order > 0 ? (
                      `₹${zone.minimum_order.toLocaleString("en-IN")}`
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {zone.estimated_delivery}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nearby Town Off-Matrix Transport Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-amber-950">
            Don&apos;t see your pincode listed?
          </h2>
          <p className="text-xs text-amber-800 max-w-xl">
            We routinely deliver large RO units and commercial electrical consignments to nearby towns and rural areas via private vehicle transport. Contact our store team to arrange special delivery.
          </p>
        </div>

        <a
          href="tel:9876543210"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 shrink-0"
        >
          <PhoneCall className="h-4 w-4" />
          Call Store Support
        </a>
      </div>
    </div>
  );
}
