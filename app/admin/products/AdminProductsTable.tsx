"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductItem } from "@/lib/catalog/products";
import { handleToggleActive } from "./actions";
import DriveMediaPickerModal from "@/components/admin/DriveMediaPickerModal";
import DriveConnectionsModal from "@/components/admin/DriveConnectionsModal";
import { ExternalLink, Copy, Check, HardDrive, Package, Network } from "lucide-react";

interface AdminProductsTableProps {
  products: ProductItem[];
}

export default function AdminProductsTable({ products }: AdminProductsTableProps) {
  const [activeProductForMedia, setActiveProductForMedia] = useState<ProductItem | null>(null);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(`${id}.jpg`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-2 text-sm font-medium text-gray-900">No products found</p>
        <p className="text-xs text-gray-500">Run seed.sql or add a product above to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-2.5">
        <div className="text-xs font-semibold text-gray-600">
          Showing {products.length} products
        </div>
        <button
          type="button"
          onClick={() => setIsConnectionsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-xs hover:bg-blue-100 transition-colors"
        >
          <Network className="h-3.5 w-3.5" />
          <span>Drive &amp; Supabase Image Connections</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3.5">Image (Google Drive)</th>
              <th className="px-4 py-3.5">Product Details</th>
              <th className="px-4 py-3.5">SKU / Drive ID</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Stock</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((p) => {
              const driveImageUrl = `/api/media/drive/product/${p.id}`;
              const isCopied = copiedId === p.id;

              return (
                <tr key={p.id} className="hover:bg-gray-50/60">
                  {/* Thumbnail & Drive Modal Opener */}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setActiveProductForMedia(p)}
                      className="group relative flex h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 hover:border-blue-500 transition-colors"
                      title="Click to manage image in Google Drive"
                    >
                      <Image
                        src={driveImageUrl}
                        alt={p.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <HardDrive className="h-4 w-4 text-white" />
                      </div>
                    </button>
                  </td>

                  {/* Product Details */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 hover:text-blue-600 hover:underline"
                      >
                        <span className="line-clamp-1">{p.name}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 text-gray-400" />
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.categories?.name || "Uncategorized"} • {p.brands?.name || "Shiva Electrical"}
                    </div>
                  </td>

                  {/* SKU & Drive ID Copy */}
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs font-semibold text-gray-700">{p.sku}</div>
                    <div className="mt-1 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyId(p.id)}
                        className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-600 hover:bg-slate-200 border border-slate-200"
                        title="Copy filename for Google Drive: [id].jpg"
                      >
                        {isCopied ? <Check className="h-2.5 w-2.5 text-green-600" /> : <Copy className="h-2.5 w-2.5" />}
                        <span>{isCopied ? "Copied" : "Copy Drive Name"}</span>
                      </button>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ₹{p.price.toLocaleString("en-IN")}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                        p.stock_quantity <= p.low_stock_threshold
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.stock_quantity} units
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveProductForMedia(p)}
                        className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
                        title="Import or assign photo from Google Drive"
                      >
                        <HardDrive className="h-3 w-3" />
                        <span>Drive Media</span>
                      </button>

                      <form action={handleToggleActive.bind(null, p.id, p.is_active)}>
                        <button
                          type="submit"
                          className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline"
                        >
                          {p.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Drive Media Picker Modal */}
      {activeProductForMedia && (
        <DriveMediaPickerModal
          isOpen={true}
          productId={activeProductForMedia.id}
          productName={activeProductForMedia.name}
          onClose={() => setActiveProductForMedia(null)}
        />
      )}

      {/* Drive Connections Full Manager Modal */}
      <DriveConnectionsModal
        isOpen={isConnectionsModalOpen}
        onClose={() => setIsConnectionsModalOpen(false)}
      />
    </>
  );
}
