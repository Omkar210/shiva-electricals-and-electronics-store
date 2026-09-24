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
} from "lucide-react";

export default async function Navbar() {
  const [profile, cartCount] = await Promise.all([
    getCurrentProfile(),
    getCartItemCount(),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      {/* Top Banner for Local Trust */}
      <div className="bg-blue-600 px-4 py-1.5 text-center text-xs font-medium text-white sm:px-6">
        <span>⚡ Fast Local Delivery &amp; Certified Installation Services in Town &amp; Nearby Areas</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-2 text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-xs">
            SE
          </div>
          <div>
            <span className="block text-base font-bold leading-tight tracking-tight text-gray-900">
              Shiva Electrical
            </span>
            <span className="block text-xs font-medium text-blue-600">
              &amp; Electronics
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 max-w-md md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search RO purifiers, spare filters, fans..."
              className="w-full rounded-full border border-gray-200 bg-gray-50/70 py-2 pl-10 pr-4 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#categories"
            className="hidden items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 md:flex"
          >
            <Package className="h-4 w-4 text-gray-500" />
            Catalog
          </Link>

          <Link
            href="/#services"
            className="hidden items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 md:flex"
          >
            <Wrench className="h-4 w-4 text-gray-500" />
            Services
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-xs">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Auth */}
          {profile ? (
            <div className="flex items-center gap-1">
              {(profile.role === "admin" || profile.role === "staff") && (
                <Link
                  href="/admin"
                  className="hidden items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 sm:flex"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
              >
                <User className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">
                  {profile.full_name?.split(" ")[0] || "Account"}
                </span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              <User className="h-3.5 w-3.5" />
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
