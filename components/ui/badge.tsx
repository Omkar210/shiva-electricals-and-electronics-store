import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold border transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-blue-200 bg-blue-50 text-blue-800",
        success:
          "border-emerald-300 bg-emerald-50 text-emerald-800",
        warning:
          "border-amber-300 bg-amber-50 text-amber-900",
        destructive:
          "border-red-300 bg-red-50 text-red-800",
        outline:
          "border-slate-300 bg-white text-slate-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
