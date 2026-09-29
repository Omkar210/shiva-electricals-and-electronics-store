"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";
import {
  listFilesInDriveFolder,
  type DriveFolderFile,
} from "@/lib/storage/google-drive";

/**
 * Server Action: Retrieves all files currently available in the configured Google Drive folder.
 * Accessible exclusively by administrators.
 */
export async function getDriveFilesAction(): Promise<{
  success: boolean;
  files: DriveFolderFile[];
  error?: string;
}> {
  await requireRole(["admin"]);
  try {
    const files = await listFilesInDriveFolder();
    return { success: true, files };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, files: [], error: message };
  }
}

/**
 * Server Action: Imports and links a selected Google Drive file to a specific product.
 */
export async function importDriveFileAction({
  productId,
  fileId,
  fileName,
  mimeType,
  sizeBytes,
  isPrimary = true,
}: {
  productId: string;
  fileId: string;
  fileName: string;
  mimeType?: string;
  sizeBytes?: number;
  isPrimary?: boolean;
}): Promise<{ success: boolean; imageId?: string; error?: string }> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  if (isPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
  }

  const storagePath = `/api/media/drive/product/${productId}`;

  const { data: existingImg } = await supabase
    .from("product_images")
    .select("id")
    .eq("product_id", productId)
    .eq("storage_provider", "google_drive")
    .maybeSingle();

  if (existingImg?.id) {
    const { error: updateError } = await supabase
      .from("product_images")
      .update({
        storage_path: storagePath,
        alt_text: fileName,
        is_primary: isPrimary,
        external_id: fileId,
        file_size_bytes: sizeBytes || null,
        mime_type: mimeType || "image/jpeg",
        file_metadata: {
          drive_file_id: fileId,
          drive_file_name: fileName,
          imported_at: new Date().toISOString(),
        },
      })
      .eq("id", existingImg.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/", "layout");
    return { success: true, imageId: existingImg.id };
  }

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      storage_path: storagePath,
      alt_text: fileName,
      is_primary: isPrimary,
      sort_order: 0,
      storage_provider: "google_drive",
      external_id: fileId,
      file_size_bytes: sizeBytes || null,
      mime_type: mimeType || "image/jpeg",
      file_metadata: {
        drive_file_id: fileId,
        drive_file_name: fileName,
        imported_at: new Date().toISOString(),
      },
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, imageId: data.id };
}

/**
 * Server Action: Scans Google Drive folder for files matching any product ID and auto-links them.
 */
export async function syncAllDriveImagesByProductIdAction(): Promise<{
  success: boolean;
  matchedCount: number;
  synced: Array<{ productId: string; productName: string; driveFileId: string }>;
  error?: string;
}> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  try {
    const driveFiles = await listFilesInDriveFolder();
    const { data: products } = await supabase
      .from("products")
      .select("id, name, sku");

    if (!products || products.length === 0) {
      return { success: true, matchedCount: 0, synced: [] };
    }

    const synced: Array<{ productId: string; productName: string; driveFileId: string }> = [];

    for (const prod of products) {
      const match = driveFiles.find((f) => {
        const base = f.name.split(".")[0];
        return base.includes(prod.id) || f.name.startsWith(prod.id);
      });

      if (match) {
        await supabase
          .from("product_images")
          .update({ is_primary: false })
          .eq("product_id", prod.id);

        const storagePath = `/api/media/drive/product/${prod.id}`;

        const { data: existingImg } = await supabase
          .from("product_images")
          .select("id")
          .eq("product_id", prod.id)
          .eq("storage_provider", "google_drive")
          .maybeSingle();

        if (existingImg?.id) {
          await supabase
            .from("product_images")
            .update({
              storage_path: storagePath,
              alt_text: prod.name,
              is_primary: true,
              external_id: match.id,
              file_size_bytes: match.sizeBytes || null,
              mime_type: match.mimeType,
              file_metadata: { drive_file_id: match.id, auto_synced: true },
            })
            .eq("id", existingImg.id);
        } else {
          await supabase.from("product_images").insert({
            product_id: prod.id,
            storage_path: storagePath,
            alt_text: prod.name,
            is_primary: true,
            sort_order: 0,
            storage_provider: "google_drive",
            external_id: match.id,
            file_size_bytes: match.sizeBytes || null,
            mime_type: match.mimeType,
            file_metadata: { drive_file_id: match.id, auto_synced: true },
          });
        }

        synced.push({
          productId: prod.id,
          productName: prod.name,
          driveFileId: match.id,
        });
      }
    }

    revalidatePath("/", "layout");
    return { success: true, matchedCount: synced.length, synced };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, matchedCount: 0, synced: [], error: message };
  }
}

export interface DriveProductConnection {
  productId: string;
  productName: string;
  sku: string;
  hasDriveImage: boolean;
  driveFileId: string | null;
  driveFileName: string | null;
  storagePath: string;
  fileSizeBytes: number | null;
  linkedAt: string | null;
}

/**
 * Server Action: Fetches all products and their current Google Drive connection status and metadata.
 */
export async function getDriveProductConnectionsAction(): Promise<{
  success: boolean;
  connections: DriveProductConnection[];
  error?: string;
}> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  try {
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id, name, sku")
      .order("created_at", { ascending: false });

    if (prodErr || !products) {
      return { success: false, connections: [], error: prodErr?.message || "Failed to load products" };
    }

    const { data: allImages } = await supabase
      .from("product_images")
      .select("id, product_id, storage_path, storage_provider, external_id, alt_text, file_size_bytes, created_at, file_metadata");

    const imagesList = allImages || [];

    const connections: DriveProductConnection[] = products.map((prod) => {
      const driveImg = imagesList.find(
        (img) =>
          img.product_id === prod.id &&
          (img.storage_provider === "google_drive" || img.storage_path?.includes("/api/media/drive/"))
      );

      const metadata = driveImg?.file_metadata as Record<string, unknown> | undefined;
      const fileName =
        (metadata?.drive_file_name as string) ||
        driveImg?.alt_text ||
        (driveImg?.external_id ? `${prod.id}.jpg` : null);

      return {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        hasDriveImage: Boolean(driveImg?.external_id),
        driveFileId: driveImg?.external_id || null,
        driveFileName: fileName,
        storagePath: `/api/media/drive/product/${prod.id}`,
        fileSizeBytes: driveImg?.file_size_bytes || null,
        linkedAt: (metadata?.synced_at as string) || driveImg?.created_at || null,
      };
    });

    return { success: true, connections };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, connections: [], error: message };
  }
}

import {
  validateSafeExternalUrl,
  validateImageMagicBytes,
} from "@/lib/security/validation";
import {
  checkRateLimit,
  getClientIp,
  GENERIC_RATE_LIMIT_ERROR,
} from "@/lib/security/rate-limit";

/**
 * Server Action: Uploads an image file directly to Google Drive (via Webhook or Drive API)
 * and records the connection metadata in Supabase.
 */
export async function uploadProductImageToDriveAction(
  formData: FormData
): Promise<{ success: boolean; driveFileId?: string; error?: string }> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  // Rate limiting to defend against abuse / resource exhaustion
  const ip = await getClientIp();
  const mediaLimit = checkRateLimit("media", ip);
  if (!mediaLimit.allowed) {
    return { success: false, error: GENERIC_RATE_LIMIT_ERROR };
  }

  const productId = formData.get("productId") as string;
  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || "";

  if (!productId) {
    return { success: false, error: "Product ID is required." };
  }

  if (!file || file.size === 0) {
    return { success: false, error: "Please select an image file to upload." };
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!validTypes.includes(file.type)) {
    return { success: false, error: "Only JPEG, PNG, WebP, and AVIF image formats are supported." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Magic bytes verification
    const signatureCheck = validateImageMagicBytes(buffer);
    if (!signatureCheck.valid) {
      return { success: false, error: signatureCheck.error || "Invalid image signature." };
    }

    let driveFileId: string | null = null;
    const fileName = `${productId}.jpg`;

    // 1. If Google Apps Script Web App or custom Drive upload URL is provided
    const uploadUrl = process.env.GOOGLE_DRIVE_UPLOAD_URL;
    if (uploadUrl) {
      // Defend against SSRF (OWASP A10): Ensure destination URL is valid HTTPS to allowed hosts
      const urlCheck = validateSafeExternalUrl(uploadUrl);
      if (!urlCheck.valid) {
        throw new Error(`Insecure or unapproved Drive webhook URL: ${urlCheck.error}`);
      }

      const base64Data = buffer.toString("base64");

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
          fileName,
          mimeType: file.type,
          base64: base64Data,
          productId,
        }),
      });

      if (!uploadRes.ok) {
        throw new Error(`Drive webhook upload failed with HTTP ${uploadRes.status}`);
      }

      const json = await uploadRes.json();
      driveFileId = json.fileId || json.id;
    } else {
      // 2. Try direct Google Drive API upload
      const { uploadToGoogleDrive } = await import("@/lib/storage/google-drive");
      const buffer = Buffer.from(await file.arrayBuffer());
      const driveResult = await uploadToGoogleDrive(buffer, fileName, file.type);
      driveFileId = driveResult.fileId;
    }

    if (!driveFileId) {
      throw new Error("Could not retrieve Google Drive file ID after upload.");
    }

    // 3. Save / Update connection metadata in Supabase
    const storagePath = `/api/media/drive/product/${productId}`;

    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

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
          storage_path: storagePath,
          alt_text: altText || fileName,
          is_primary: true,
          external_id: driveFileId,
          file_size_bytes: file.size,
          mime_type: file.type,
          file_metadata: {
            drive_file_id: driveFileId,
            drive_file_name: fileName,
            uploaded_at: new Date().toISOString(),
          },
        })
        .eq("id", existingImg.id);
    } else {
      await supabase.from("product_images").insert({
        product_id: productId,
        storage_path: storagePath,
        alt_text: altText || fileName,
        is_primary: true,
        sort_order: 0,
        storage_provider: "google_drive",
        external_id: driveFileId,
        file_size_bytes: file.size,
        mime_type: file.type,
        file_metadata: {
          drive_file_id: driveFileId,
          drive_file_name: fileName,
          uploaded_at: new Date().toISOString(),
        },
      });
    }

    revalidatePath("/", "layout");
    return { success: true, driveFileId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

/**
 * Server Action: Unlinks a Google Drive image from a product in Supabase.
 */
export async function unlinkProductDriveImageAction(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .eq("storage_provider", "google_drive");

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

