import Link from "next/link";
import { requireAuth } from "@/lib/auth/roles";
import { logout } from "@/app/auth/actions";
import {
  User,
  Package,
  MapPin,
  ShieldCheck,
  LogOut,
  AlertTriangle,
} from "lucide-react";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const profile = await requireAuth("/account");
  const resolvedParams = await searchParams;
  const isUnauthorizedRole = resolvedParams.error === "unauthorized_role";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {isUnauthorizedRole && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm">
            <strong>Access Denied:</strong> Your account has customer permissions. You do not have access to administrative management pages.
          </p>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {profile.full_name || "Valued Customer"}
                </h1>
                <p className="text-sm text-blue-100">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  profile.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : profile.role === "staff"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* My Orders */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2.5 text-blue-700">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">My Orders</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Track deliveries and view order history
                </p>
              </div>
            </div>
            <Link
              href="/orders"
              className="mt-4 inline-flex text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              View Orders &rarr;
            </Link>
          </div>

          {/* Addresses */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Saved Addresses</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Manage doorstep delivery addresses
                </p>
              </div>
            </div>
            <span className="mt-4 text-xs text-gray-400">
              Configured during checkout
            </span>
          </div>

          {/* Admin Dashboard (if staff or admin) */}
          {(profile.role === "admin" || profile.role === "staff") && (
            <div className="flex flex-col justify-between rounded-xl border border-purple-100 bg-purple-50/60 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-100 p-2.5 text-purple-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-purple-950">Staff &amp; Admin</h2>
                  <p className="mt-1 text-xs text-purple-700">
                    Product, inventory, orders &amp; delivery zones
                  </p>
                </div>
              </div>
              <Link
                href="/admin"
                className="mt-4 inline-flex text-xs font-medium text-purple-700 hover:text-purple-800 hover:underline"
              >
                Go to Admin Portal &rarr;
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/40 px-6 py-4">
          <span className="text-xs text-gray-500">
            Phone: {profile.phone || "Not provided"}
          </span>

          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
