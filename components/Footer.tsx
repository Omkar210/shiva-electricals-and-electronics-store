import Link from "next/link";
import { ShieldCheck, Truck, Wrench, PhoneCall, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-slate-200 bg-white text-slate-700">
      {/* Trust Badges - High-Contrast & Senior-Friendly */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-800 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">100% Genuine Products</h3>
              <p className="text-sm text-slate-600">Original filters, membranes &amp; fans</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800 shrink-0">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Doorstep Technician</h3>
              <p className="text-sm text-slate-600">Certified home installation &amp; demo</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-800 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Direct Local Delivery</h3>
              <p className="text-sm text-slate-600">Fast doorstep service in your town</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-900 shrink-0">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Direct Shop Support</h3>
              <p className="text-sm text-slate-600">Talk directly with our technicians</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 font-bold text-white">
                SE
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Shiva Electrical
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              Your authorized local store for certified RO water purifiers, genuine replacement spare parts, and home electrical appliances.
            </p>
            <div className="pt-2">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5 text-base font-bold text-blue-800 hover:bg-blue-100 transition-colors"
              >
                <PhoneCall className="h-5 w-5 text-blue-700" />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900">
              Shop Categories
            </h4>
            <ul className="mt-4 space-y-3 text-base">
              <li>
                <Link href="/products?category=ro-purifiers" className="text-slate-600 hover:text-blue-700 hover:underline">
                  RO Water Purifiers
                </Link>
              </li>
              <li>
                <Link href="/products?category=ro-spare-parts" className="text-slate-600 hover:text-blue-700 hover:underline">
                  RO Spare Parts &amp; Filter Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=fans" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Ceiling &amp; Exhaust Fans
                </Link>
              </li>
              <li>
                <Link href="/products?category=electrical-electronics" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Electrical Wiring &amp; Appliances
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900">
              Customer Services
            </h4>
            <ul className="mt-4 space-y-3 text-base">
              <li>
                <Link href="/orders" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Delivery Coverage &amp; Pincodes
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Doorstep Installation &amp; Demo
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Annual Maintenance (AMC) Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="h-5 w-5 text-blue-700" />
              Store Timings &amp; Location
            </h4>
            <div className="mt-4 space-y-2 text-base text-slate-600">
              <p>
                <strong className="text-slate-900">Monday – Saturday:</strong><br />
                9:00 AM – 8:30 PM
              </p>
              <p>
                <strong className="text-slate-900">Sunday:</strong><br />
                10:00 AM – 2:00 PM
              </p>
              <p className="pt-2 text-sm text-slate-500">
                Solapur &amp; Nearby District Pincodes
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm font-medium text-slate-500">
          &copy; {new Date().getFullYear()} Shiva Electrical &amp; Electronics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
