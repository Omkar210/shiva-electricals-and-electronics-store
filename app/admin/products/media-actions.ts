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
