import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/roles";
import { scanProductImages, InputImageBuffer } from "@/lib/ai/product-scanner";
import { validateImageMagicBytes } from "@/lib/security/validation";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Strict API Security Guardrail Limits
const MIN_IMAGES = 1;
const MAX_IMAGES = 8;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per image
const MAX_TOTAL_BATCH_BYTES = 25 * 1024 * 1024; // 25MB total batch payload limit
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Extracts client IP safely from request headers for rate limiting.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Validates Origin/Referer header to prevent Cross-Site Request Forgery (CSRF).
 */
function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return true; // Non-browser or direct curl request fallback

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

/**
 * Admin-Only API Route with Multi-Tier Guardrails:
 * 1. Role Guardrail: Admin role strictly enforced
 * 2. CSRF Guardrail: Origin & host matching
 * 3. Rate Limit Guardrail: 10 requests / minute sliding window
 * 4. Payload Guardrail: Max 8 images, 10MB per image, 25MB batch cap
 * 5. Magic Byte Guardrail: Deep binary header inspection (OWASP A04)
 * 6. AI Prompt & Output Guardrail: Sanitizes outputs against prompt injection
 */
export async function POST(request: NextRequest) {
  try {
    // Guardrail 1: Role Authorization (Strictly Admin only)
    await requireRole(["admin"], "/login");

    // Guardrail 2: Cross-Site Request Forgery (CSRF) Origin Verification
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: "Forbidden: Cross-site request rejected by CSRF guardrail." },
        { status: 403 },
      );
    }

    // Guardrail 3: Sliding-Window Rate Limiting (10 scans per minute)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit("media", clientIp, {
      maxRequests: 10,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${rateLimit.retryAfterSeconds} seconds before scanning again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    // Guardrail 4: File Count Bounds
    if (!files || files.length < MIN_IMAGES) {
      return NextResponse.json(
        { error: "Please upload at least one product photo (front, back, label, or packaging)." },
        { status: 400 },
      );
    }

    if (files.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_IMAGES} photos allowed per scanning session.` },
        { status: 400 },
      );
    }

    let totalBatchBytes = 0;
    const imageBuffers: InputImageBuffer[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file || file.size === 0) continue;

      totalBatchBytes += file.size;

      // Guardrail 5: Individual File Size & Total Batch Size Caps (DoS Prevention)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Image "${file.name}" exceeds the 10MB limit.` },
          { status: 400 },
        );
      }

      if (totalBatchBytes > MAX_TOTAL_BATCH_BYTES) {
        return NextResponse.json(
          { error: "Total batch size of uploaded images exceeds the 25MB safety limit." },
          { status: 400 },
        );
      }

      // Guardrail 6: Allowed MIME Type Whitelist
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File "${file.name}" is not an authorized image format. Only JPEG, PNG, WebP, and AVIF are permitted.` },
          { status: 400 },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Guardrail 7: Deep Magic Byte Binary Signature Verification (OWASP A04)
      const sig = validateImageMagicBytes(buffer);
      if (!sig.valid) {
        return NextResponse.json(
          { error: `Image "${file.name}" failed binary signature verification: ${sig.error}` },
          { status: 400 },
        );
      }

      imageBuffers.push({
        buffer,
        mimeType: file.type,
        name: file.name,
      });
    }

    if (imageBuffers.length === 0) {
      return NextResponse.json(
        { error: "No valid image files provided." },
        { status: 400 },
      );
    }

    // Guardrail 8: AI Multimodal Processing with Prompt Defense & Output Sanitization
    const extractedData = await scanProductImages(imageBuffers);

    return NextResponse.json({
      success: true,
      imageCount: imageBuffers.length,
      data: extractedData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Scanning failed";
    console.error("Multi-angle image scan error:", error);

    // If requireRole redirected (unauthorized)
    if (message.includes("NEXT_REDIRECT")) {
      return NextResponse.json(
        { error: "Unauthorized: Only administrators have permission to use the AI Product Scanner." },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: `Failed to scan product images: ${message}` },
      { status: 500 },
    );
  }
}
