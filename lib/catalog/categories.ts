import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

/**
 * Fetch categories. Defaults to returning only active categories for public catalog.
 */
export async function getCategories(options: { onlyActive?: boolean } = {}): Promise<CategoryItem[]> {
  const { onlyActive = true } = options;
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select("id, name, slug, description, image_url, is_active, created_at")
    .order("name", { ascending: true });

  if (onlyActive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as CategoryItem[];
}

/**
 * Fetch a single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url, is_active, created_at")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as CategoryItem;
}

/**
 * Admin action: Create a new category.
 */
export async function createCategory(formData: FormData) {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const slug =
    (formData.get("slug") as string)?.trim().toLowerCase() ||
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const description = (formData.get("description") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;

  if (!name || !slug) {
    throw new Error("Category name and slug are required.");
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description,
    image_url: imageUrl,
    is_active: true,
  });

  if (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }

  revalidatePath("/", "layout");
}

/**
 * Admin action: Update category.
 */
export async function updateCategory(id: string, formData: FormData) {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  const description = (formData.get("description") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const isActive = formData.get("isActive") === "true";

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      description,
      image_url: imageUrl,
      is_active: isActive,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }

  revalidatePath("/", "layout");
}
