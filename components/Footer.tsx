import Link from "next/link";
import { ShieldCheck, Truck, Wrench, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 text-gray-600">
      {/* Trust Badges */}
      <div className="border-b border-gray-200/70 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">100% Genuine</h3>
              <p className="text-xs text-gray-500">Certified parts &amp; purifiers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">Expert Technicians</h3>
              <p className="text-xs text-gray-500">Doorstep setup &amp; service</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">Local Delivery</h3>
              <p className="text-xs text-gray-500">Town &amp; nearby regions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900">Local Support</h3>
              <p className="text-xs text-gray-500">Direct shop assistance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900">
              Shiva Electrical &amp; Electronics
            </h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Your trusted local destination for water purification solutions, genuine RO spares, fans, and home electrical appliances.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Product Categories
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/#categories" className="hover:text-blue-600">
                  RO Water Purifiers
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-blue-600">
                  RO Spare Parts &amp; Filters
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-blue-600">
                  Ceiling &amp; Exhaust Fans
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-blue-600">
                  Electrical Accessories &amp; Wiring
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Customer &amp; Services
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/account" className="hover:text-blue-600">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-blue-600">
                  Track Delivery
                </Link>
              </li>
              <li>
                <span className="text-gray-400">Doorstep Installation</span>
              </li>
              <li>
                <span className="text-gray-400">Annual Maintenance (AMC)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Local Service Hours
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Monday – Saturday: 9:00 AM – 8:30 PM<br />
              Sunday: 10:00 AM – 2:00 PM<br />
              Local delivery scheduled daily.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Shiva Electrical &amp; Electronics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
