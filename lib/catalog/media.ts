import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

/**
 * Uploads an image to the 'product-images' Supabase Storage bucket
 * and creates a record in the 'product_images' table.
 */
export async function uploadProductImage(
  productId: string,
  formData: FormData,
) {
  await requireRole(["admin", "staff"]);
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

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image file size must be less than 5MB.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError || !uploadData) {
    throw new Error(`Upload failed: ${uploadError?.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(uploadData.path);

  // If this is set as primary, unmark other images
  if (isPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
  }

  // Insert image metadata record
  const { error: dbError } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_path: publicUrl,
    alt_text: altText,
    is_primary: isPrimary,
    sort_order: 0,
  });

  if (dbError) {
    throw new Error(`Failed to save image record: ${dbError.message}`);
  }

  revalidatePath("/", "layout");
  return { publicUrl };
}

/**
 * Deletes a product image from storage and database.
 */
export async function deleteProductImage(imageId: string, storagePath: string) {
  await requireRole(["admin"]);
  const supabase = await createClient();

  // Extract relative path from URL if publicUrl is stored
  const pathParts = storagePath.split("product-images/");
  const relativePath = pathParts[1] || storagePath;

  await supabase.storage.from("product-images").remove([relativePath]);
  await supabase.from("product_images").delete().eq("id", imageId);

  revalidatePath("/", "layout");
}
