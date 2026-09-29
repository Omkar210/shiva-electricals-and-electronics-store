"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { handleCreateProduct, type ProductActionResult } from "../actions";
import type { CategoryItem } from "@/lib/catalog/categories";
import DriveMediaPickerModal from "@/components/admin/DriveMediaPickerModal";
import ProductImageScanner from "@/components/admin/ProductImageScanner";
import type { ExtractedProductData } from "@/lib/ai/product-scanner";
import {
  AlertCircle,
  Plus,
  HardDrive,
  Check,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

interface ProductFormProps {
  categories: CategoryItem[];
  brands: { id: string; name: string }[];
}

export default function ProductForm({ categories, brands }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState<ProductActionResult | null, FormData>(
    handleCreateProduct,
    null,
  );

  // Form Fields State (Allows AI auto-fill and Admin manual review/edits)
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [description, setDescription] = useState("");
  const [compatibility, setCompatibility] = useState("");
  const [warranty, setWarranty] = useState("");

  // Scanned Images State
  const [scannedFiles, setScannedFiles] = useState<File[]>([]);
  const [hasScanned, setHasScanned] = useState(false);

  // Drive Picker State
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [selectedDriveFile, setSelectedDriveFile] = useState<{
    id: string;
    name: string;
    proxyUrl: string;
  } | null>(null);

  /**
   * Called when AI multi-angle scan finishes:
   * Auto-populates all form fields for Admin review and modification.
   */
  const handleScanComplete = (data: ExtractedProductData, files: File[]) => {
    setHasScanned(true);
    setScannedFiles(files);

    if (data.name) setName(data.name);
    if (data.sku) setSku(data.sku);

    // Auto-match Brand if detected
    if (data.brand) {
      const brandLower = data.brand.toLowerCase();
      const matched = brands.find(
        (b) =>
          b.name.toLowerCase().includes(brandLower) ||
          brandLower.includes(b.name.toLowerCase()),
      );
      if (matched) {
        setBrandId(matched.id);
      }
    }

    // Auto-match Category if suggested
    if (data.category_suggestion) {
      const catLower = data.category_suggestion.toLowerCase();
      const matchedCat = categories.find(
        (c) =>
          c.name.toLowerCase().includes(catLower) ||
          catLower.includes(c.name.toLowerCase()),
      );
      if (matchedCat) {
        setCategoryId(matchedCat.id);
      }
    }

    if (data.mrp) setMrp(String(data.mrp));
    if (data.price) setPrice(String(data.price));
    if (data.description) setDescription(data.description);
    if (data.compatibility) setCompatibility(data.compatibility);
    if (data.warranty) setWarranty(data.warranty);
  };

  /**
   * Form submission wrapper to append all multi-angle scanned files to FormData
   */
  const handleFormSubmit = (formData: FormData) => {
    if (scannedFiles.length > 0) {
      scannedFiles.forEach((file) => {
        formData.append("files", file);
      });
    }
    formAction(formData);
  };

  return (
    <div className="space-y-6">
      {/* 1. Multi-Angle Image Scanner Section */}
      <ProductImageScanner
        onScanComplete={handleScanComplete}
        brands={brands}
        categories={categories}
      />

      {/* 2. Main Verification & Creation Form */}
      <form
        action={handleFormSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8"
      >
        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {hasScanned && (
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3 text-xs text-indigo-900">
            <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Review &amp; Verify Mode:</strong> The fields below were populated by the AI image scanner. You can modify any incorrect details before creating the product.
            </span>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Basic Identification
            </h2>
            {hasScanned && (
              <span className="text-[11px] text-indigo-600 font-medium">
                Auto-extracted
              </span>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-gray-700">
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                value={sku}
                onChange={(e) => setSku(e.target.value)}
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
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
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
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
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
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
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
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                value={compatibility}
                onChange={(e) => setCompatibility(e.target.value)}
                placeholder="e.g. Fits standard 10-inch RO bowl / 230V 50Hz"
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
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="e.g. 1 Year Comprehensive Manufacturer Warranty"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>
        </div>

        {/* Product Media Section */}
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Product Media &amp; Images
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsDriveModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
            >
              <HardDrive className="h-3.5 w-3.5" />
              <span>Select from Google Drive</span>
            </button>
          </div>

          {/* Scanned Images Notice */}
          {scannedFiles.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs text-indigo-950">
              <Layers className="h-4 w-4 text-indigo-600 shrink-0" />
              <div className="flex-1">
                <strong>{scannedFiles.length} Multi-Angle Scanned Photos Attached</strong>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  These photos will be uploaded directly to Google Drive (or storage) and linked to this product upon saving.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setScannedFiles([])}
                className="text-indigo-600 hover:text-indigo-900 text-[11px] underline"
              >
                Detach
              </button>
            </div>
          )}

          {/* Drive Selected File */}
          {selectedDriveFile ? (
            <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <Image
                  src={selectedDriveFile.proxyUrl}
                  alt={selectedDriveFile.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-bold text-gray-900">Google Drive Image Selected</span>
                </div>
                <p className="truncate text-xs text-gray-600 font-mono mt-0.5">{selectedDriveFile.name}</p>
                <input type="hidden" name="driveFileId" value={selectedDriveFile.id} />
                <input type="hidden" name="driveFileName" value={selectedDriveFile.name} />
              </div>
              <button
                type="button"
                onClick={() => setSelectedDriveFile(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-gray-700"
                title="Remove selected image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div>
              <label htmlFor="file" className="block text-xs font-semibold text-gray-700">
                Or Upload Additional Primary Photo
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="mt-1 block w-full text-xs text-gray-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          )}
        </div>

        {/* Drive Picker Modal */}
        <DriveMediaPickerModal
          isOpen={isDriveModalOpen}
          onClose={() => setIsDriveModalOpen(false)}
          onSelectImage={(file) => {
            setSelectedDriveFile({
              id: file.id,
              name: file.name,
              proxyUrl: file.proxyUrl,
            });
          }}
        />

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
    </div>
  );
}
