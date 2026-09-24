"use client";

import { useState, useTransition } from "react";
import { adjustStockAction } from "@/app/admin/inventory/actions";
import type { InventoryTransactionType } from "@/types/database";
import {
  Boxes,
  X,
  Loader2,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

interface AdjustStockModalProps {
  product: {
    id: string;
    name: string;
    sku: string;
    stock_quantity: number;
    low_stock_threshold: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function AdjustStockModal({
  product,
  isOpen,
  onClose,
}: AdjustStockModalProps) {
  const [transactionType, setTransactionType] =
    useState<InventoryTransactionType>("PURCHASE");
  const [units, setUnits] = useState<number>(10);
  const [isReduction, setIsReduction] = useState(false);
  const [reason, setReason] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  // Calculate net quantity change
  let calculatedChange = units;
  if (transactionType === "DAMAGE") {
    calculatedChange = -Math.abs(units);
  } else if (transactionType === "PURCHASE" || transactionType === "RETURN") {
    calculatedChange = Math.abs(units);
  } else if (transactionType === "ADJUSTMENT") {
    calculatedChange = isReduction ? -Math.abs(units) : Math.abs(units);
  }

  const projectedStock = product.stock_quantity + calculatedChange;
  const isInvalidStock = projectedStock < 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (units <= 0) {
      setError("Please enter a positive number of units.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a specific reason for this inventory adjustment.");
      return;
    }

    if (isInvalidStock) {
      setError(`Cannot reduce stock by ${Math.abs(calculatedChange)} units. Current stock is ${product.stock_quantity}.`);
      return;
    }

    startTransition(async () => {
      const result = await adjustStockAction(
        product.id,
        calculatedChange,
        transactionType,
        reason.trim(),
        referenceId.trim() || undefined,
      );

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Adjust Inventory</h3>
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{product.name}</span> (SKU: {product.sku})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-1">
            <label htmlFor="tx-type" className="block text-xs font-semibold text-gray-700">
              Adjustment Type
            </label>
            <select
              id="tx-type"
              value={transactionType}
              onChange={(e) => {
                const val = e.target.value as InventoryTransactionType;
                setTransactionType(val);
                if (val === "DAMAGE") setIsReduction(true);
                if (val === "PURCHASE" || val === "RETURN") setIsReduction(false);
              }}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            >
              <option value="PURCHASE">PURCHASE — New Stock Receipt / Supplier Inward (+)</option>
              <option value="RETURN">RETURN — Customer / Service RMA Return (+)</option>
              <option value="ADJUSTMENT">ADJUSTMENT — Audit Count Correction (+ or -)</option>
              <option value="DAMAGE">DAMAGE — Broken, Defective or Written-Off (-)</option>
            </select>
          </div>

          {/* If Adjustment: Add or Subtract toggle */}
          {transactionType === "ADJUSTMENT" && (
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-gray-600">Adjustment Direction:</span>
              <button
                type="button"
                onClick={() => setIsReduction(false)}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 cursor-pointer ${
                  !isReduction ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-gray-100 text-gray-600"
                }`}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Add Stock (+)
              </button>
              <button
                type="button"
                onClick={() => setIsReduction(true)}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 cursor-pointer ${
                  isReduction ? "bg-red-100 text-red-800 font-bold" : "bg-gray-100 text-gray-600"
                }`}
              >
                <MinusCircle className="h-3.5 w-3.5" />
                Deduct Stock (-)
              </button>
            </div>
          )}

          {/* Quantity Input */}
          <div className="space-y-1">
            <label htmlFor="units" className="block text-xs font-semibold text-gray-700">
              Units Quantity
            </label>
            <input
              type="number"
              id="units"
              min="1"
              value={units}
              onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Stock Projection Preview */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Current In-Store Stock:</span>
              <strong className="text-gray-900">{product.stock_quantity} units</strong>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Adjustment delta:</span>
              <strong className={calculatedChange >= 0 ? "text-emerald-600" : "text-red-600"}>
                {calculatedChange > 0 ? `+${calculatedChange}` : calculatedChange} units
              </strong>
            </div>
            <div className="border-t border-blue-200/60 pt-2 flex justify-between font-bold text-gray-900">
              <span>Projected Resulting Stock:</span>
              <span className={`text-sm ${isInvalidStock ? "text-red-600" : "text-blue-700"}`}>
                {projectedStock} units
              </span>
            </div>
            {isInvalidStock && (
              <p className="text-[11px] text-red-600 pt-1 font-semibold flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Negative stock is not permitted by database rules.
              </p>
            )}
          </div>

          {/* Mandatory Reason */}
          <div className="space-y-1">
            <label htmlFor="reason" className="block text-xs font-semibold text-gray-700">
              Mandatory Adjustment Reason *
            </label>
            <textarea
              id="reason"
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Received shipment from Eureka Forbes; Physical count discrepancy in aisle 3"
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Optional Reference ID */}
          <div className="space-y-1">
            <label htmlFor="ref-id" className="block text-xs font-semibold text-gray-700">
              Reference / Document ID (Optional)
            </label>
            <input
              type="text"
              id="ref-id"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="e.g. PO-84920, INV-2026-091, RMA-431"
              className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || isInvalidStock}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Recording Adjustment...
                </>
              ) : (
                "Save & Log Transaction"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
