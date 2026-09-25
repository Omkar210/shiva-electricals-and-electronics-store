"use client";

import { useState, useTransition } from "react";
import { syncAllDriveImagesByProductIdAction } from "@/app/admin/products/media-actions";
import { RefreshCw, ExternalLink, HardDrive, Check, AlertCircle } from "lucide-react";

export default function DriveSyncButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const driveFolderUrl =
    "https://drive.google.com/drive/folders/1NkrEkQd81MVx3XMy_8U0uCgRIgryJKgJ";

  const handleSync = () => {
    setResult(null);
    startTransition(async () => {
      try {
        const res = await syncAllDriveImagesByProductIdAction();
        if (res.success) {
          setResult({
            success: true,
            message:
              res.matchedCount > 0
                ? `Successfully synced ${res.matchedCount} product image(s) from Google Drive!`
                : "Checked Google Drive folder. No new files matching product IDs were found.",
          });
        } else {
          setResult({
            success: false,
            message: res.error || "Failed to sync images from Google Drive.",
          });
        }
      } catch (err: unknown) {
        setResult({
          success: false,
          message: err instanceof Error ? err.message : "Sync error occurred.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={driveFolderUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
          title="Open shared Google Drive folder in a new tab"
        >
          <HardDrive className="h-4 w-4 text-blue-600" />
          <span>Google Drive Folder</span>
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </a>

        <button
          type="button"
          onClick={handleSync}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-xs hover:bg-blue-100 disabled:opacity-50"
          title="Scans Google Drive for files named with Product IDs and links them"
        >
          <RefreshCw className={`h-4 w-4 text-blue-600 ${isPending ? "animate-spin" : ""}`} />
          <span>{isPending ? "Syncing Drive..." : "Sync Drive by Product ID"}</span>
        </button>
      </div>

      {result && (
        <div
          className={`flex items-center gap-2 rounded-lg p-2.5 text-xs ${
            result.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {result.success ? (
            <Check className="h-4 w-4 shrink-0 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
