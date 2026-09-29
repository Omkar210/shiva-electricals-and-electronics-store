import Link from "next/link";
import { ShieldCheck, Truck, Wrench, PhoneCall, Clock, MapPin, Mail, Scale } from "lucide-react";

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
              <h3 className="text-base font-bold text-slate-900">Verified Genuine Spares</h3>
              <p className="text-sm text-slate-600">Sourced from authentic brand distribution</p>
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
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 font-bold text-white">
                SE
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Shiva Electrical &amp; Electronics
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600 max-w-md">
              Your trusted local store for certified RO water purifiers, genuine replacement spare parts, and home electrical appliances with professional technician support.
            </p>
            <div className="space-y-2 pt-1 text-sm text-slate-700">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-700 shrink-0 mt-1" />
                <span>Shop No. 4, Market Yard Commercial Complex, Main Market Road, Solapur, Maharashtra - 413001, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-700 shrink-0" />
                <a href="mailto:contact@shivaelectrical.in" className="hover:underline text-blue-700 font-medium">contact@shivaelectrical.in</a>
              </p>
            </div>
            <div className="pt-2">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5 text-base font-bold text-blue-800 hover:bg-blue-100 transition-colors"
              >
                <PhoneCall className="h-5 w-5 text-blue-700" />
                <span>Call Shop: +91 98765 43210</span>
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
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

          {/* Column 3: Customer Services */}
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

          {/* Column 4: Legal & Compliance */}
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-blue-700" />
              Legal &amp; Compliance
            </h4>
            <ul className="mt-4 space-y-3 text-base">
              <li>
                <Link href="/privacy-policy" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Refund &amp; Return Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-slate-600 hover:text-blue-700 hover:underline">
                  Cookie Policy
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Grievance Officer:<br />
                <a href="mailto:grievance@shivaelectrical.in" className="text-blue-700 hover:underline font-medium">grievance@shivaelectrical.in</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Operating Hours & Business Disclosures */}
        <div className="mt-10 border-t border-slate-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Clock className="h-4 w-4 text-blue-700" />
              Store Timings &amp; Service Hours
            </p>
            <p>
              Monday – Saturday: 9:00 AM – 8:30 PM | Sunday: 10:00 AM – 2:00 PM
            </p>
          </div>
          <div>
            <p className="font-bold text-slate-900 mb-1">
              Statutory Disclosures &amp; Fair Use
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Shiva Electrical &amp; Electronics is a registered retail business. All third-party trademarks and brand logos (AquaPure, Kent, Aquaguard, Havells, Crompton, Anchor, Usha) are the property of their respective owners and used nominatively for identification and compatibility fitment.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm font-medium text-slate-500">
          &copy; {new Date().getFullYear()} Shiva Electrical &amp; Electronics. All rights reserved. GST compliant.
        </div>
      </div>
    </footer>
  );
}
