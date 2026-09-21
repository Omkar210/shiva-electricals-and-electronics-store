import { MapPin } from "lucide-react";

export default function AdminDeliveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Delivery Zones</h1>
        <p className="text-sm text-gray-500">Configure local town and nearby town pincodes, delivery charges, and ETAs</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-xs">
        <MapPin className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-base font-semibold text-gray-900">Delivery Zone Matrix</h2>
        <p className="mt-1 text-sm text-gray-500">Manage pincodes, delivery fees, and minimum order rules per PRD Section 7.9.</p>
      </div>
    </div>
  );
}
