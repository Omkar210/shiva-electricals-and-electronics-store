import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";
import {
  isGoogleDriveConfigured,
  uploadToGoogleDrive,
  deleteFromGoogleDrive,
} from "@/lib/storage/google-drive";

/**
 * Uploads an image either to Google Drive (if configured/selected)
 * or falls back to 'product-images' Supabase Storage bucket,
 * and creates a comprehensive record in the 'product_images' table.
 */
export async function uploadProductImage(
  productId: string,
  formData: FormData,
) {
  // Strictly Admin-only: No staff, customer, or guest access
  await requireRole(["admin"]);
  const supabase = await createClient();

  const file = formData.get("file") as File;
  const altText = (formData.get("altText") as string) || "";
  const isPrimary = formData.get("isPrimary") === "true";

  if (!file || file.size === 0) {
    throw new Error("Please select a valid image file.");
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and AVIF images are supported.");
  }

  // Max 10MB (allow larger files now that we support external storage)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image file size must be less than 10MB.");
  }

  // Determine whether to use Google Drive
  const preferGoogleDrive = process.env.STORAGE_PROVIDER === "google_drive";
  const useGoogleDrive = preferGoogleDrive || isGoogleDriveConfigured();

  let storagePath: string;
  let storageProvider: "google_drive" | "supabase" = "supabase";
  let externalId: string | null = null;
  let fileMetadata: Record<string, unknown> = { original_name: file.name };

  if (useGoogleDrive) {
    // 1. Upload to Google Drive
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const sanitizedName = `${productId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const driveResult = await uploadToGoogleDrive(buffer, sanitizedName, file.type);

    storagePath = driveResult.proxyUrl;
    storageProvider = "google_drive";
    externalId = driveResult.fileId;
    fileMetadata = {
      ...fileMetadata,
      drive_view_link: driveResult.webViewLink,
      drive_file_id: driveResult.fileId,
    };
  } else {
    // 2. Fallback: Upload to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError || !uploadData) {
      throw new Error(`Upload failed: ${uploadError?.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(uploadData.path);

    storagePath = publicUrl;
    storageProvider = "supabase";
    externalId = uploadData.path;
  }

  // If this is set as primary, unmark other images
  if (isPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
  }

  // Insert image metadata record into Supabase PostgreSQL
  const { error: dbError } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_path: storagePath,
    alt_text: altText,
    is_primary: isPrimary,
    sort_order: 0,
    storage_provider: storageProvider,
    external_id: externalId,
    file_size_bytes: file.size,
    mime_type: file.type,
    file_metadata: fileMetadata,
  });

  if (dbError) {
    // If saving DB metadata fails, attempt cleanup on the uploaded file
    if (useGoogleDrive && externalId) {
      await deleteFromGoogleDrive(externalId).catch(() => {});
    }
    throw new Error(`Failed to save image record: ${dbError.message}`);
  }

  revalidatePath("/", "layout");
  return { publicUrl: storagePath, provider: storageProvider };
}

/**
 * Deletes a product image from the appropriate storage provider (Google Drive or Supabase)
 * and removes its database record.
 */
export async function deleteProductImage(imageId: string, storagePath: string) {
  await requireRole(["admin"]);
  const supabase = await createClient();

  // Query image details to determine the provider
  const { data: imgRecord } = await supabase
    .from("product_images")
    .select("storage_provider, external_id")
    .eq("id", imageId)
    .maybeSingle();

  const isDrive =
    imgRecord?.storage_provider === "google_drive" ||
    storagePath.includes("/api/media/drive/");

  if (isDrive) {
    const fileId = imgRecord?.external_id || storagePath.split("/api/media/drive/")[1];
    if (fileId) {
      await deleteFromGoogleDrive(fileId).catch((err) => {
        console.warn(`Could not delete file from Google Drive (${fileId}):`, err);
      });
    }
  } else {
    // Supabase storage cleanup
    const pathParts = storagePath.split("product-images/");
    const relativePath = pathParts[1] || storagePath;
    await supabase.storage.from("product-images").remove([relativePath]);
  }

  // Delete DB record
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) {
    throw new Error(`Failed to delete image record: ${error.message}`);
  }

  revalidatePath("/", "layout");
}
