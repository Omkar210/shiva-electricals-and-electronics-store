"use client";

import { useState } from "react";
import Link from "next/link";
import { AdjustStockModal } from "./AdjustStockModal";
import type { InventoryItem } from "@/lib/inventory/service";
import {
  Boxes,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdjust = (product: InventoryItem) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <Boxes className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-3 text-sm font-bold text-gray-900">No Products Match Filters</h3>
            <p className="mt-1 text-xs text-gray-500">
              Try adjusting your search query, status tab, or category filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Product &amp; SKU</th>
                  <th scope="col" className="px-4 py-3.5">Category</th>
                  <th scope="col" className="px-4 py-3.5">Selling Price</th>
                  <th scope="col" className="px-4 py-3.5">In Stock</th>
                  <th scope="col" className="px-4 py-3.5">Stock Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {items.map((item) => {
                  const isOutOfStock = item.stockStatus === "OUT_OF_STOCK";
                  const isLowStock = item.stockStatus === "LOW_STOCK";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Product Name & SKU */}
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/products/${item.slug}`}
                          target="_blank"
                          className="font-bold text-gray-900 hover:text-blue-600 inline-flex items-center gap-1 group"
                        >
                          <span>{item.name}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 text-gray-400" />
                        </Link>
                        <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                          SKU: {item.sku}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 text-gray-600">
                        {item.category?.name || "General"}
                      </td>

                      {/* Selling Price */}
                      <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                        ₹{item.price.toLocaleString("en-IN")}
                      </td>

                      {/* In Stock Quantity */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-sm ${
                              isOutOfStock
                                ? "text-red-600"
                                : isLowStock
                                  ? "text-amber-600"
                                  : "text-gray-900"
                            }`}
                          >
                            {item.stock_quantity}
                          </span>
                          <span className="text-[11px] text-gray-400">units</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block">
                          Alert threshold: {item.low_stock_threshold}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
                            <XCircle className="h-3 w-3" />
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Healthy ({item.stock_quantity})
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenAdjust(item)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer shadow-2xs"
                          >
                            <Boxes className="h-3.5 w-3.5" />
                            Adjust Stock
                          </button>

                          <Link
                            href={`/admin/inventory/audit?productId=${item.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-2xs"
                            title="View Transaction Audit Trail"
                          >
                            <History className="h-3.5 w-3.5" />
                            Audit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedProduct && (
        <AdjustStockModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
