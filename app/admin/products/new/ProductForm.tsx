"use client";

import { useActionState } from "react";
import Link from "next/link";
import { handleCreateProduct, type ProductActionResult } from "../actions";
import type { CategoryItem } from "@/lib/catalog/categories";
import { AlertCircle, Plus, Image as ImageIcon } from "lucide-react";

interface ProductFormProps {
  categories: CategoryItem[];
  brands: { id: string; name: string }[];
}

export default function ProductForm({ categories, brands }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState<ProductActionResult | null, FormData>(
    handleCreateProduct,
    null,
  );

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8"
    >
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
          Basic Identification
        </h2>

        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-gray-700">
            Product Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. AquaPure Elite RO+UV+UF (8L)"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="sku" className="block text-xs font-semibold text-gray-700">
              SKU (Stock Keeping Unit) *
            </label>
            <input
              id="sku"
              name="sku"
              type="text"
              required
              placeholder="e.g. RO-AP-ELITE-001"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 font-mono text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-xs font-semibold text-gray-700">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brandId" className="block text-xs font-semibold text-gray-700">
              Brand
            </label>
            <select
              id="brandId"
              name="brandId"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
          Authoritative Pricing &amp; Inventory
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="price" className="block text-xs font-semibold text-gray-700">
              Selling Price (₹) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              min="0"
              placeholder="12999"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label htmlFor="mrp" className="block text-xs font-semibold text-gray-700">
              MRP (₹)
            </label>
            <input
              id="mrp"
              name="mrp"
              type="number"
              step="0.01"
              min="0"
              placeholder="15999"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label htmlFor="stockQuantity" className="block text-xs font-semibold text-gray-700">
              Initial Stock Qty *
            </label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              defaultValue="10"
              min="0"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label htmlFor="lowStockThreshold" className="block text-xs font-semibold text-gray-700">
              Low Stock Alert Limit
            </label>
            <input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              defaultValue="5"
              min="0"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
          Details &amp; Specifications
        </h2>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Detailed features, purification stages, or electrical capacity..."
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="compatibility" className="block text-xs font-semibold text-gray-700">
              Compatibility Information
            </label>
            <input
              id="compatibility"
              name="compatibility"
              type="text"
              placeholder="e.g. Fits standard 10-inch RO bowl / Kent, Aquaguard"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label htmlFor="warranty" className="block text-xs font-semibold text-gray-700">
              Warranty &amp; Service Terms
            </label>
            <input
              id="warranty"
              name="warranty"
              type="text"
              placeholder="e.g. 1 Year Comprehensive Manufacturer Warranty"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>
      </div>

      {/* Product Image - Admin Access Only */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Product Media (Admin Access Only)
          </h2>
        </div>

        <div>
          <label htmlFor="file" className="block text-xs font-semibold text-gray-700">
            Primary Product Image
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="mt-1 block w-full text-xs text-gray-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1.5 text-[11px] text-gray-400">
            Supported formats: JPEG, PNG, WebP, AVIF up to 10MB. Stored directly to Google Drive.
          </p>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
        <Link
          href="/admin/products"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Creating Product..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}
