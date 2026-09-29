"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import {
  checkRateLimit,
  getClientIp,
  resetRateLimit,
  GENERIC_RATE_LIMIT_ERROR,
} from "@/lib/security/rate-limit";
import { validateSafeRedirect } from "@/lib/security/validation";

export interface AuthActionResult {
  error?: string;
  success?: string;
}

/**
 * Handles email + password login with defensive rate limiting and redirect validation.
 */
export async function login(
  _prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const ip = await getClientIp();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const rawRedirect = formData.get("redirect") as string;
  const safeRedirect = validateSafeRedirect(rawRedirect, "/account");

  // 1. IP and Account rate limiting (5 attempts per minute window)
  const ipLimit = checkRateLimit("auth", ip);
  if (!ipLimit.allowed) {
    return { error: GENERIC_RATE_LIMIT_ERROR };
  }

  if (email) {
    const accountLimit = checkRateLimit("auth", email);
    if (!accountLimit.allowed) {
      return { error: GENERIC_RATE_LIMIT_ERROR };
    }
  }

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Defense against user enumeration (OWASP A07): Always return generic credential failure
    return { error: "Invalid email or password. Please check your credentials and try again." };
  }

  // Clear rate limit bucket on successful authentication
  resetRateLimit("auth", email);

  revalidatePath("/", "layout");
  redirect(safeRedirect);
}

/**
 * Handles new customer registration.
 */
export async function signup(
  _prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const ip = await getClientIp();
  const ipLimit = checkRateLimit("auth", ip);
  if (!ipLimit.allowed) {
    return { error: GENERIC_RATE_LIMIT_ERROR };
  }

  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const consent = formData.get("consent");

  if (!consent) {
    return { error: "You must accept the Terms & Conditions and Privacy Policy to register." };
  }

  if (!fullName) {
    return { error: "Please enter your full name." };
  }

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null,
      },
    },
  });

  if (error) {
    return { error: error.message || "Failed to create account. Please try again." };
  }

  // If email confirmation is required by Supabase project settings:
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "An account with this email already exists." };
  }

  if (!data.session) {
    return {
      success:
        "Account created! Please check your email inbox to confirm your email before logging in.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

/**
 * Handles user sign out.
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
