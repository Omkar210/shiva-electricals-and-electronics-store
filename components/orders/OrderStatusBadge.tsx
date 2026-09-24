import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export function OrderStatusBadge({ status, size = "md" }: OrderStatusBadgeProps) {
  const normalized = status.toUpperCase();

  let colorClasses = "bg-gray-100 text-gray-800 border-gray-200";
  let Icon = Clock;
  let label = status;

  switch (normalized) {
    case "PLACED":
      colorClasses = "bg-amber-50 text-amber-800 border-amber-200";
      Icon = Clock;
      label = "Order Placed";
      break;
    case "CONFIRMED":
      colorClasses = "bg-blue-50 text-blue-800 border-blue-200";
      Icon = CheckCircle;
      label = "Confirmed";
      break;
    case "PACKED":
      colorClasses = "bg-indigo-50 text-indigo-800 border-indigo-200";
      Icon = Package;
      label = "Packed & Ready";
      break;
    case "OUT_FOR_DELIVERY":
      colorClasses = "bg-purple-50 text-purple-800 border-purple-200";
      Icon = Truck;
      label = "Out for Delivery";
      break;
    case "DELIVERED":
      colorClasses = "bg-emerald-50 text-emerald-800 border-emerald-200";
      Icon = CheckCircle2;
      label = "Delivered";
      break;
    case "CANCELLED":
      colorClasses = "bg-red-50 text-red-800 border-red-200";
      Icon = XCircle;
      label = "Cancelled";
      break;
    case "RETURN_REQUESTED":
    case "RETURNED":
      colorClasses = "bg-orange-50 text-orange-800 border-orange-200";
      Icon = RotateCcw;
      label = normalized === "RETURNED" ? "Returned" : "Return Requested";
      break;
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs ${sizeClasses} ${colorClasses}`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span>{label}</span>
    </span>
  );
}
