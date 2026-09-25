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
  ArrowRight,
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {isUnauthorizedRole && (
        <div className="flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-base text-amber-950">
          <AlertTriangle className="h-6 w-6 shrink-0 text-amber-700 mt-0.5" />
          <p>
            <strong>Access Notice:</strong> Your account is registered as a customer account. Administrative management pages are restricted to authorized store staff.
          </p>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-xs">
        <div className="border-b-2 border-blue-950 bg-blue-900 px-6 py-8 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/20">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {profile.full_name || "Valued Customer"}
                </h1>
                <p className="text-base text-blue-200 mt-0.5">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-white/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-white/30">
                Account: {profile.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* My Orders */}
          <div className="flex flex-col justify-between rounded-xl border-2 border-slate-200 bg-slate-50 p-5 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="rounded-lg bg-blue-100 p-2.5 text-blue-800">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Order History</h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  Track delivery progress, view invoices &amp; items
                </p>
              </div>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-base font-bold text-blue-700 hover:underline"
            >
              <span>View All Orders</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Addresses */}
          <div className="flex flex-col justify-between rounded-xl border-2 border-slate-200 bg-slate-50 p-5 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-800">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Doorstep Delivery</h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  Delivery addresses and regional pincodes
                </p>
              </div>
            </div>
            <Link
              href="/delivery"
              className="inline-flex items-center gap-1.5 text-base font-bold text-emerald-800 hover:underline"
            >
              <span>Check Delivery Zones</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Admin Dashboard (if staff or admin) */}
          {(profile.role === "admin" || profile.role === "staff") && (
            <div className="flex flex-col justify-between rounded-xl border-2 border-purple-200 bg-purple-50 p-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="rounded-lg bg-purple-100 p-2.5 text-purple-800">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-purple-950">Store Portal</h2>
                  <p className="mt-1 text-sm text-purple-800 leading-relaxed">
                    Manage inventory, products, orders &amp; staff
                  </p>
                </div>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-base font-bold text-purple-800 hover:underline"
              >
                <span>Open Store Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between border-t-2 border-slate-100 bg-white px-6 py-4 gap-4">
          <span className="text-sm font-semibold text-slate-700">
            Registered Phone: <strong className="text-slate-900">{profile.phone || "Not provided"}</strong>
          </span>

          <form action={logout}>
            <button
              type="submit"
              className="flex h-11 items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-red-600" />
              <span>Sign Out of Account</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
