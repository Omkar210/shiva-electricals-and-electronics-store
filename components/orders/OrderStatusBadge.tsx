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

  let colorClasses = "bg-slate-100 text-slate-900 border-slate-300";
  let Icon = Clock;
  let label = status;

  switch (normalized) {
    case "PLACED":
      colorClasses = "bg-amber-50 text-amber-950 border-amber-300";
      Icon = Clock;
      label = "Order Received";
      break;
    case "CONFIRMED":
      colorClasses = "bg-blue-50 text-blue-950 border-blue-300";
      Icon = CheckCircle;
      label = "Confirmed by Store";
      break;
    case "PACKED":
      colorClasses = "bg-indigo-50 text-indigo-950 border-indigo-300";
      Icon = Package;
      label = "Packed & Ready";
      break;
    case "OUT_FOR_DELIVERY":
      colorClasses = "bg-purple-50 text-purple-950 border-purple-300";
      Icon = Truck;
      label = "Out for Delivery";
      break;
    case "DELIVERED":
      colorClasses = "bg-emerald-50 text-emerald-950 border-emerald-300";
      Icon = CheckCircle2;
      label = "Delivered to Doorstep";
      break;
    case "CANCELLED":
      colorClasses = "bg-red-50 text-red-950 border-red-300";
      Icon = XCircle;
      label = "Cancelled";
      break;
    case "RETURN_REQUESTED":
    case "RETURNED":
      colorClasses = "bg-orange-50 text-orange-950 border-orange-300";
      Icon = RotateCcw;
      label = normalized === "RETURNED" ? "Returned" : "Return Requested";
      break;
  }

  const sizeClasses = {
    sm: "px-3 py-1 text-sm gap-1.5",
    md: "px-3.5 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border-2 shadow-2xs ${sizeClasses} ${colorClasses}`}
    >
      <Icon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      <span>{label}</span>
    </span>
  );
}
