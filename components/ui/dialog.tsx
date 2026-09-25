"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on ESC key & prevent background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
    >
      <div
        ref={dialogRef}
        className={cn(
          "w-full max-w-lg rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 focus:outline-none",
          className,
        )}
      >
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 id="dialog-title" className="text-xl font-bold text-slate-900">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="mt-1 text-sm text-slate-600">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-700 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
            <span>Close</span>
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
