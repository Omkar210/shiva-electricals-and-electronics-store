"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, type AuthActionResult } from "@/app/auth/actions";
import { LogIn, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const errorParam = searchParams.get("error");

  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    login,
    null,
  );

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
            <LogIn className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Log In to Your Account
          </h1>
          <p className="text-base text-slate-600">
            Enter your details to track orders and manage delivery addresses
          </p>
        </div>

        {errorParam === "auth_callback_failed" && (
          <div className="flex items-start gap-2.5 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-700 mt-0.5" />
            <span>The login link expired or is invalid. Please log in with your email and password below.</span>
          </div>
        )}

        {state?.error && (
          <div className="flex items-start gap-2.5 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-700 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirectUrl} />

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-slate-800 mb-1"
            >
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              placeholder="e.g. yourname@gmail.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-slate-800 mb-1"
            >
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-lg border-2 border-slate-300 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-base font-bold text-white shadow-xs hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <span>Log In to Account</span>
            )}
          </button>
        </form>

        <div className="border-t border-slate-200 pt-4 text-center text-sm font-medium text-slate-700 space-y-2">
          <p>
            Do not have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-blue-700 hover:underline"
            >
              Create a free account
            </Link>
          </p>
          <p className="text-xs text-slate-500">
            Need help logging in? Call shop support at{" "}
            <a href="tel:+919876543210" className="font-bold text-slate-800 underline">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
