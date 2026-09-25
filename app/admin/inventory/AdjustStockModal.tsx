"use client";

import { useState, useTransition } from "react";
import { adjustStockAction } from "@/app/admin/inventory/actions";
import type { InventoryTransactionType } from "@/types/database";
import { Dialog } from "@/components/ui/dialog";
import {
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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Inventory Stock"
      description={`${product.name} (SKU: ${product.sku})`}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-900 border-2 border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-1">
            <label htmlFor="tx-type" className="block text-sm font-bold text-slate-800">
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
              className="w-full rounded-lg border-2 border-slate-300 p-3 text-base text-slate-900 focus:border-blue-700 focus:outline-none"
            >
              <option value="PURCHASE">PURCHASE — New Stock Receipt / Supplier Inward (+)</option>
              <option value="RETURN">RETURN — Customer / Service RMA Return (+)</option>
              <option value="ADJUSTMENT">ADJUSTMENT — Audit Count Correction (+ or -)</option>
              <option value="DAMAGE">DAMAGE — Broken, Defective or Written-Off (-)</option>
            </select>
          </div>

          {/* If Adjustment: Add or Subtract toggle */}
          {transactionType === "ADJUSTMENT" && (
            <div className="flex items-center gap-3 text-sm font-bold">
              <span className="text-slate-700">Direction:</span>
              <button
                type="button"
                onClick={() => setIsReduction(false)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 cursor-pointer border ${
                  !isReduction ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold" : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Units (+)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsReduction(true)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 cursor-pointer border ${
                  isReduction ? "bg-red-100 text-red-900 border-red-300 font-bold" : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <MinusCircle className="h-4 w-4" />
                <span>Deduct Units (-)</span>
              </button>
            </div>
          )}

          {/* Quantity Input */}
          <div className="space-y-1">
            <label htmlFor="units" className="block text-sm font-bold text-slate-800">
              Units Quantity *
            </label>
            <input
              type="number"
              id="units"
              min="1"
              value={units}
              onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full rounded-lg border-2 border-slate-300 p-3 text-base font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          {/* Stock Projection Preview */}
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50/60 p-4 text-sm space-y-1.5">
            <div className="flex justify-between text-slate-700">
              <span>Current Stock on Hand:</span>
              <strong className="text-slate-900">{product.stock_quantity} units</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Calculated Change:</span>
              <strong className={calculatedChange >= 0 ? "text-emerald-800" : "text-red-700"}>
                {calculatedChange > 0 ? `+${calculatedChange}` : calculatedChange} units
              </strong>
            </div>
            <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-slate-900">
              <span>New Resulting Stock:</span>
              <span className={`text-base ${isInvalidStock ? "text-red-700" : "text-blue-800 font-extrabold"}`}>
                {projectedStock} units
              </span>
            </div>
            {isInvalidStock && (
              <p className="text-xs text-red-700 pt-1 font-bold flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Negative stock is not permitted by database rules.
              </p>
            )}
          </div>

          {/* Mandatory Reason */}
          <div className="space-y-1">
            <label htmlFor="reason" className="block text-sm font-bold text-slate-800">
              Reason for Adjustment *
            </label>
            <textarea
              id="reason"
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Received shipment from Eureka Forbes; Physical count discrepancy in aisle 3"
              className="w-full rounded-lg border-2 border-slate-300 p-3 text-base text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          {/* Optional Reference ID */}
          <div className="space-y-1">
            <label htmlFor="ref-id" className="block text-sm font-bold text-slate-800">
              Reference / Invoice ID (Optional)
            </label>
            <input
              type="text"
              id="ref-id"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="e.g. PO-84920, INV-2026-091"
              className="w-full rounded-lg border-2 border-slate-300 p-3 text-base text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-11 rounded-lg border-2 border-slate-300 px-5 text-sm font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || isInvalidStock}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Stock Adjustment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
