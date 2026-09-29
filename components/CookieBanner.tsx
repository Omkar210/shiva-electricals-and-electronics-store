"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  try {
    return localStorage.getItem("se_cookie_ack");
  } catch {
    return "acknowledged";
  }
}

function getServerSnapshot() {
  return "acknowledged";
}

export default function CookieBanner() {
  const ack = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isVisible = ack === null;

  const handleAcknowledge = () => {
    try {
      localStorage.setItem("se_cookie_ack", "acknowledged");
      window.dispatchEvent(new Event("storage"));
    } catch {
      // ignore storage error
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie &amp; Privacy Notice"
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-slate-300 bg-white p-4 shadow-xl sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-800 shrink-0">
            <Cookie className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Essential Cookies &amp; Privacy Transparency</span>
              <span className="rounded bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-xs font-bold text-emerald-900">
                Zero Ad-Tracking
              </span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 max-w-3xl">
              We use strictly necessary cookies to keep track of items in your shopping cart and maintain secure sessions. We respect India&apos;s DPDP Act and <strong>never use third-party advertising or cross-site tracking cookies</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
          <Link
            href="/cookie-policy"
            className="flex h-11 items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-700 outline-none"
          >
            Read Cookie Policy
          </Link>

          <button
            type="button"
            onClick={handleAcknowledge}
            className="flex h-11 items-center justify-center rounded-lg bg-blue-700 px-5 text-sm font-bold text-white shadow-xs hover:bg-blue-800 active:bg-blue-900 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-700 outline-none"
          >
            Accept &amp; Close
          </button>
        </div>
      </div>
    </aside>
  );
}
