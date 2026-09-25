import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/roles";
import { getCartItemCount } from "@/lib/cart/service";
import {
  ShoppingBag,
  User,
  ShieldCheck,
  Search,
  Wrench,
  Package,
  Truck,
  PhoneCall,
} from "lucide-react";

export default async function Navbar() {
  const [profile, cartCount] = await Promise.all([
    getCurrentProfile(),
    getCartItemCount(),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-xs">
      {/* Top Banner for Local Trust & Direct Phone Assistance */}
      <div className="bg-blue-900 px-4 py-2 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">⚡ Direct Store Delivery</span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span className="text-slate-100">Genuine RO Purifiers, Spares &amp; Doorstep Installation</span>
          </div>
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 rounded-md bg-blue-800 px-3 py-1 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
            aria-label="Call store support at +91 98765 43210"
          >
            <PhoneCall className="h-4 w-4 text-emerald-400" />
            <span>Call Shop: +91 98765 43210</span>
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 font-extrabold text-white text-lg shadow-sm">
            SE
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-bold leading-tight tracking-tight text-slate-900">
              Shiva Electrical
            </span>
            <span className="block text-sm font-semibold text-blue-700">
              &amp; Electronics Store
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 max-w-md md:block">
          <form action="/products" method="GET" className="relative">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder="Search RO filters, ceiling fans, spares..."
              className="h-11 w-full rounded-lg border-2 border-slate-300 bg-white py-2 pl-11 pr-4 text-base text-slate-900 placeholder:text-slate-500 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
            />
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main Navigation">
          <Link
            href="/products"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700 md:flex transition-colors"
          >
            <Package className="h-4 w-4 text-slate-600" />
            <span>Products</span>
          </Link>

          <Link
            href="/#services"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700 md:flex transition-colors"
          >
            <Wrench className="h-4 w-4 text-slate-600" />
            <span>Services</span>
          </Link>

          <Link
            href="/delivery"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700 sm:flex transition-colors"
          >
            <Truck className="h-4 w-4 text-slate-600" />
            <span>Delivery</span>
          </Link>

          {/* Cart with Explicit Visible Text */}
          <Link
            href="/cart"
            className="relative flex h-11 items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-3.5 text-base font-bold text-slate-800 hover:border-blue-700 hover:text-blue-700 transition-colors shadow-2xs"
            aria-label={`Shopping Cart with ${cartCount} items`}
          >
            <ShoppingBag className="h-5 w-5 text-blue-700" />
            <span className="hidden xs:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-700 px-1.5 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : (
              <span className="text-slate-500 font-normal text-sm">(0)</span>
            )}
          </Link>

          {/* User Account / Auth */}
          {profile ? (
            <div className="flex items-center gap-2">
              {(profile.role === "admin" || profile.role === "staff") && (
                <Link
                  href="/admin"
                  className="hidden items-center gap-1.5 rounded-lg bg-purple-50 border border-purple-200 px-3 py-2 text-sm font-bold text-purple-800 hover:bg-purple-100 sm:flex"
                >
                  <ShieldCheck className="h-4 w-4 text-purple-700" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/account"
                className="flex h-11 items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-3.5 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <User className="h-4 w-4 text-blue-700" />
                <span className="hidden sm:inline">
                  {profile.full_name?.split(" ")[0] || "Account"}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex h-11 items-center gap-2 rounded-lg bg-blue-700 px-4 text-base font-bold text-white shadow-xs hover:bg-blue-800 active:bg-blue-900 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Log In</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
