import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-blue-700 text-white shadow-xs hover:bg-blue-800 active:bg-blue-900",
        secondary:
          "bg-white text-slate-800 border-2 border-slate-300 shadow-xs hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100",
        outline:
          "bg-white text-blue-700 border-2 border-blue-700 hover:bg-blue-50 active:bg-blue-100",
        destructive:
          "bg-red-700 text-white shadow-xs hover:bg-red-800 active:bg-red-900",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        link:
          "text-blue-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 text-base", // 48px height senior-friendly standard
        sm: "h-10 px-4 text-sm",        // 40px height for compact secondary actions
        lg: "h-14 px-8 text-lg font-bold", // 56px height for primary hero/checkout CTAs
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
