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
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 sm:p-12 text-center space-y-4 shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-sm">
          <Truck className="h-8 w-8" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Doorstep Delivery &amp; Service Coverage
        </h1>
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
          Shiva Electrical &amp; Electronics provides same-day local delivery and expert installation for RO water purifiers, replacement filter sets, and home electrical supplies.
        </p>

        {/* Live Pincode Checker Card */}
        <div className="mx-auto max-w-xl pt-4">
          <DeliveryCheck />
        </div>
      </div>

      {/* Trust Highlights Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="rounded-lg bg-blue-100 p-2.5 text-blue-800 w-fit">
            <Clock className="h-6 w-6" />
          </div>
          <h2 className="font-bold text-slate-900 text-lg">Same-Day Local Dispatch</h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Orders confirmed before 4 PM within central town limits are dispatched for same-day delivery via direct store staff.
          </p>
        </div>

        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-800 w-fit">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-bold text-slate-900 text-lg">Doorstep Installation</h2>
          <p className="text-base text-slate-600 leading-relaxed">
            RO purifiers and ceiling fans come with expert doorstep setup, water TDS testing, and plumbing connection by certified technicians.
          </p>
        </div>

        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="rounded-lg bg-indigo-100 p-2.5 text-indigo-800 w-fit">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="font-bold text-slate-900 text-lg">Pay on Delivery (COD)</h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Inspect your order upon doorstep arrival before paying via cash or UPI scan. Zero online payment risk.
          </p>
        </div>
      </div>

      {/* Coverage Directory Table */}
      <div className="rounded-xl border-2 border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b-2 border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-700" />
              <span>Serviced Pincodes Directory ({zones.length} active zones)</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Direct doorstep delivery and technician service are active for the following postal areas:
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-base font-bold text-blue-700 hover:underline"
          >
            <span>Browse Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-slate-200 text-left text-base">
            <thead className="bg-slate-100 text-sm font-bold text-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4">Pincode</th>
                <th scope="col" className="px-6 py-4">Town &amp; Locality</th>
                <th scope="col" className="px-6 py-4">Zone Area</th>
                <th scope="col" className="px-6 py-4">Delivery Fee</th>
                <th scope="col" className="px-6 py-4">Minimum Order</th>
                <th scope="col" className="px-6 py-4">Expected Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {zones.map((zone) => (
                <tr key={zone.pincode} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-800 text-base whitespace-nowrap">
                    {zone.pincode}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {zone.town}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {zone.zone_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {zone.delivery_charge === 0 ? (
                      <span className="rounded-md bg-emerald-50 border border-emerald-300 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        FREE
                      </span>
                    ) : (
                      <span className="font-bold text-slate-900">
                        ₹{zone.delivery_charge.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                    {zone.minimum_order > 0 ? (
                      `₹${zone.minimum_order.toLocaleString("en-IN")}`
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap font-medium">
                    {zone.estimated_delivery}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nearby Town Off-Matrix Transport Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 rounded-xl border-2 border-amber-300 bg-amber-50 p-6 sm:p-8">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-amber-950">
            Don&apos;t see your pincode listed above?
          </h2>
          <p className="text-base text-amber-900 max-w-2xl leading-relaxed">
            We routinely deliver large RO units and commercial electrical orders to nearby towns, talukas, and rural areas by special appointment. Call our store team to arrange delivery.
          </p>
        </div>

        <a
          href="tel:+919876543210"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-amber-800 px-6 text-base font-bold text-white shadow-xs hover:bg-amber-900 shrink-0 transition-colors"
        >
          <PhoneCall className="h-5 w-5" />
          <span>Call: +91 98765 43210</span>
        </a>
      </div>
    </div>
  );
}
