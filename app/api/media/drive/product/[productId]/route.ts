import { NextRequest } from "next/server";
import {
  getGoogleDriveFileStream,
  findDriveFileByProductId,
} from "@/lib/storage/google-drive";
import { createAdminClient } from "@/lib/supabase/admin";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    productId: string;
  }>;
}

function generateFallbackSvg(productId: string, name?: string, sku?: string) {
  const title = (name || "Genuine Product").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sub = (sku || productId).replace(/&/g, "&amp;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="bolt" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#60a5fa" />
        <stop offset="100%" stop-color="#2563eb" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bg)" rx="16" />
    <circle cx="400" cy="220" r="110" fill="#1e293b" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6 6" />
    <path d="M405 150L365 240H425L395 310L465 210H405L425 150H405Z" fill="url(#bolt)" />
    <text x="400" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="400" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#94a3b8" text-anchor="middle">SKU: ${sub}</text>
    <rect x="200" y="455" width="400" height="38" rx="19" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <text x="400" y="479" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#60a5fa" text-anchor="middle">SHIVA ELECTRICAL &amp; ELECTRONICS • GOOGLE DRIVE</text>
    <text x="400" y="535" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Drive Image: Upload ${productId}.jpg to Google Drive folder</text>
  </svg>`;
}

/**
 * Access Google Drive product images directly by their Product ID:
 * GET /api/media/drive/product/[productId]
 *
 * 1. Checks if an image is already registered in 'product_images' table with external_id.
 * 2. If not, queries Google Drive folder for files named after the productId (e.g. <productId>.jpg).
 * 3. Streams binary image content directly from Google Drive with HTTP immutable caching.
 * 4. If image not yet uploaded to Drive, returns clean SVG placeholder by default.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { productId } = await params;
  const allowFallback = request.nextUrl.searchParams.get("fallback") !== "false";

  if (
    !productId ||
    typeof productId !== "string" ||
    productId.includes("/") ||
    productId.includes("..")
  ) {
    return new Response("Invalid Product ID", { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    let driveFileId: string | null = null;

    // 1. Check if there is an image in Supabase product_images for this productId
    const { data: dbImage } = await supabase
      .from("product_images")
      .select("external_id, storage_provider, storage_path")
      .eq("product_id", productId)
      .eq("storage_provider", "google_drive")
      .order("is_primary", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dbImage?.external_id) {
      driveFileId = dbImage.external_id;
    } else {
      // 2. Query Google Drive folder directly for files matching this productId
      const matched = await findDriveFileByProductId(productId);
      if (matched?.id) {
        driveFileId = matched.id;

        // Auto-link in database for instantaneous future resolution
        const { data: existingImg } = await supabase
          .from("product_images")
          .select("id")
          .eq("product_id", productId)
          .eq("storage_provider", "google_drive")
          .maybeSingle();

        if (existingImg?.id) {
          await supabase
            .from("product_images")
            .update({
              storage_path: `/api/media/drive/product/${productId}`,
              alt_text: matched.name,
              is_primary: true,
              external_id: matched.id,
              file_size_bytes: matched.sizeBytes || null,
              mime_type: matched.mimeType || "image/jpeg",
              file_metadata: { drive_file_id: matched.id, auto_detected: true },
            })
            .eq("id", existingImg.id);
        } else {
          await supabase.from("product_images").insert({
            product_id: productId,
            storage_path: `/api/media/drive/product/${productId}`,
            alt_text: matched.name,
            is_primary: true,
            sort_order: 0,
            storage_provider: "google_drive",
            external_id: matched.id,
            file_size_bytes: matched.sizeBytes || null,
            mime_type: matched.mimeType || "image/jpeg",
            file_metadata: { drive_file_id: matched.id, auto_detected: true },
          });
        }
      }
    }

    if (!driveFileId) {
      if (!allowFallback) {
        return new Response("Product image not found in Google Drive", {
          status: 404,
        });
      }

      // Fetch basic product info for the branded placeholder
      const { data: product } = await supabase
        .from("products")
        .select("name, sku")
        .eq("id", productId)
        .maybeSingle();

      const svg = generateFallbackSvg(productId, product?.name, product?.sku);
      return new Response(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // 3. Stream binary file directly from Google Drive
    const { stream, mimeType, sizeBytes } =
      await getGoogleDriveFileStream(driveFileId);

    const webStream = Readable.toWeb(stream);

    const headers: Record<string, string> = {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    };

    if (sizeBytes && !isNaN(sizeBytes)) {
      headers["Content-Length"] = String(sizeBytes);
    }

    return new Response(webStream as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load product media";
    console.error(
      `Google Drive product image retrieval error for ${productId}:`,
      message,
    );

    if (message.includes("not found") || message.includes("404")) {
      if (!allowFallback) {
        return new Response("Image not found in Google Drive", { status: 404 });
      }
      const svg = generateFallbackSvg(productId);
      return new Response(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    return new Response(`Failed to retrieve image: ${message}`, {
      status: 500,
    });
  }
}
