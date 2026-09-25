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
  { key: "PLACED", label: "Order Received", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed by Shop", icon: CheckCircle },
  { key: "PACKED", label: "Packed & Ready", icon: Package },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
  { key: "DELIVERED", label: "Delivered to Doorstep", icon: CheckCircle2 },
];

export function OrderTimelineStepper({
  currentStatus,
  history = [],
}: OrderTimelineStepperProps) {
  const isCancelled = currentStatus === "CANCELLED";

  if (isCancelled) {
    const cancelHistory = history.find((h) => h.new_status === "CANCELLED");
    return (
      <div className="rounded-xl border-2 border-red-300 bg-red-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-red-700 p-3 text-white shrink-0">
            <XCircle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-red-950">
              This order has been cancelled
            </h3>
            <p className="text-base text-red-800 leading-relaxed">
              {cancelHistory?.note || "The order was cancelled. Reserved inventory was restored to the store stock."}
            </p>
            {cancelHistory && (
              <p className="text-sm font-bold text-red-700">
                Cancellation Date: {new Date(cancelHistory.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Find index of current status in steps
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6">
        Order Fulfillment Progress
      </h3>

      <div className="relative">
        {/* Progress Bar Line for desktop */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-slate-200 -z-0 hidden sm:block" />

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-3 relative z-10">
          {STEPS.map((step, index) => {
            const isCompleted = currentIndex >= index;
            const isCurrent = currentIndex === index;
            const StepIcon = step.icon;

            const stepRecord = history.find((h) => h.new_status === step.key);

            return (
              <div
                key={step.key}
                className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-3 sm:text-center"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isCurrent
                      ? "border-blue-700 bg-blue-700 text-white ring-4 ring-blue-100 shadow-sm"
                      : isCompleted
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  <StepIcon className="h-6 w-6 stroke-[2.5]" />
                </div>

                <div className="space-y-1 sm:text-center">
                  <p
                    className={`text-sm sm:text-base font-bold ${
                      isCurrent
                        ? "text-blue-800"
                        : isCompleted
                          ? "text-slate-900"
                          : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  {stepRecord ? (
                    <p className="text-xs sm:text-sm font-medium text-slate-600">
                      {new Date(stepRecord.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  ) : isCurrent ? (
                    <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">
                      In Progress Now
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
