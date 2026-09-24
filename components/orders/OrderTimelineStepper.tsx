import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { OrderStatusHistoryItem } from "@/lib/orders/service";

interface OrderTimelineStepperProps {
  currentStatus: string;
  history?: OrderStatusHistoryItem[];
}

const STEPS = [
  { key: "PLACED", label: "Order Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "PACKED", label: "Packed", icon: Package },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export function OrderTimelineStepper({
  currentStatus,
  history = [],
}: OrderTimelineStepperProps) {
  const isCancelled = currentStatus === "CANCELLED";

  if (isCancelled) {
    const cancelHistory = history.find((h) => h.new_status === "CANCELLED");
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-red-600 p-2 text-white">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-red-900">This order has been cancelled</h3>
            <p className="text-xs text-red-700">
              {cancelHistory?.note || "The order was cancelled. Reserved inventory was restored to the store stock."}
            </p>
            {cancelHistory && (
              <span className="inline-block text-[11px] text-red-500 font-mono mt-1">
                Cancelled on: {new Date(cancelHistory.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Find index of current status in steps
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
        Fulfillment Progress
      </h3>

      <div className="relative">
        {/* Progress Bar Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-0 hidden sm:block" />

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
          {STEPS.map((step, index) => {
            const isCompleted = currentIndex >= index;
            const isCurrent = currentIndex === index;
            const StepIcon = step.icon;

            // Match step with history timestamp
            const stepRecord = history.find((h) => h.new_status === step.key);

            return (
              <div
                key={step.key}
                className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-2 sm:text-center"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isCurrent
                      ? "border-blue-600 bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs"
                      : isCompleted
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                </div>

                <div className="space-y-0.5 sm:text-center">
                  <p
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? "text-blue-700"
                        : isCompleted
                          ? "text-gray-900"
                          : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  {stepRecord ? (
                    <p className="text-[10px] text-gray-400">
                      {new Date(stepRecord.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  ) : isCurrent ? (
                    <span className="inline-block text-[10px] font-medium text-blue-600">
                      In Progress
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
