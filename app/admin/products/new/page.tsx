import Link from "next/link";
import { getCategories } from "@/lib/catalog/categories";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { ArrowLeft } from "lucide-react";
import ProductForm from "./ProductForm";

export default async function NewProductPage() {
  // Strictly enforce admin-only access; staff and customers cannot access this page
  await requireRole(["admin"], "/admin/products");

  const supabase = await createClient();
  const [categories, { data: brands }] = await Promise.all([
    getCategories({ onlyActive: false }),
    supabase.from("brands").select("id, name").order("name"),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Add New Product
          </h1>
          <p className="text-xs text-gray-500">
            Create an authoritative catalog item with pricing, inventory, and compatibility
          </p>
        </div>
      </div>

      <ProductForm categories={categories} brands={brands || []} />
    </div>
  );
}
