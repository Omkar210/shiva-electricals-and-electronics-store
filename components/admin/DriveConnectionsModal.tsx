"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  getDriveProductConnectionsAction,
  syncAllDriveImagesByProductIdAction,
  uploadProductImageToDriveAction,
  unlinkProductDriveImageAction,
  type DriveProductConnection,
} from "@/app/admin/products/media-actions";
import DriveMediaPickerModal from "./DriveMediaPickerModal";
import {
  HardDrive,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  X,
  Upload,
  Search,
  AlertCircle,
  FileCheck,
  Unlink,
} from "lucide-react";

interface DriveConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DriveConnectionsModal({
  isOpen,
  onClose,
}: DriveConnectionsModalProps) {
  const [connections, setConnections] = useState<DriveProductConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeProductForPicker, setActiveProductForPicker] = useState<DriveProductConnection | null>(null);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const driveFolderUrl = "https://drive.google.com/drive/folders/1NkrEkQd81MVx3XMy_8U0uCgRIgryJKgJ";

  const fetchConnections = () => {
    setLoading(true);
    setStatusMessage(null);
    getDriveProductConnectionsAction()
      .then((res) => {
        if (res.success) {
          setConnections(res.connections);
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to load connections." });
        }
      })
      .catch((err: unknown) => {
        setStatusMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Error loading connections",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    if (isOpen) {
      getDriveProductConnectionsAction()
        .then((res) => {
          if (!ignore) {
            if (res.success) {
              setConnections(res.connections);
            } else {
              setStatusMessage({ type: "error", text: res.error || "Failed to load connections." });
            }
          }
        })
        .catch((err: unknown) => {
          if (!ignore) {
            setStatusMessage({
              type: "error",
              text: err instanceof Error ? err.message : "Error loading connections",
            });
          }
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  const handleCopy = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSyncAll = () => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const res = await syncAllDriveImagesByProductIdAction();
        if (res.success) {
          setStatusMessage({
            type: "success",
            text:
              res.matchedCount > 0
                ? `Successfully synced ${res.matchedCount} product image(s) from Google Drive!`
                : "Scanned Google Drive folder. All matching images are currently up-to-date.",
          });
          fetchConnections();
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to sync with Google Drive." });
        }
      } catch (err: unknown) {
        setStatusMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Sync error occurred.",
        });
      }
    });
  };

  const handleDirectUpload = (productId: string, file: File) => {
    setUploadingProductId(productId);
    setStatusMessage(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("file", file);
        formData.append("altText", file.name);

        const res = await uploadProductImageToDriveAction(formData);
        if (res.success) {
          setStatusMessage({
            type: "success",
            text: `Successfully uploaded and connected image for product!`,
          });
          fetchConnections();
        } else {
          setStatusMessage({
            type: "error",
            text: res.error || "Failed to upload image to Google Drive.",
          });
        }
      } catch (err: unknown) {
        setStatusMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Upload error",
        });
      } finally {
        setUploadingProductId(null);
      }
    });
  };

  const handleUnlink = (productId: string) => {
    if (!confirm("Are you sure you want to unlink the Google Drive image for this product?")) return;
    startTransition(async () => {
      try {
        const res = await unlinkProductDriveImageAction(productId);
        if (res.success) {
          setStatusMessage({ type: "success", text: "Unlinked Google Drive image." });
          fetchConnections();
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to unlink image." });
        }
      } catch (err: unknown) {
        setStatusMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Unlink error",
        });
      }
    });
  };

  const filtered = connections.filter(
    (c) =>
      c.productName.toLowerCase().includes(search.toLowerCase()) ||
      c.sku.toLowerCase().includes(search.toLowerCase()) ||
      c.productId.toLowerCase().includes(search.toLowerCase())
  );

  const connectedCount = connections.filter((c) => c.hasDriveImage).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Google Drive &amp; Supabase Image Connections
              </h3>
              <p className="text-xs text-gray-500">
                Primary storage: <span className="font-semibold text-blue-600">Google Drive</span> • Metadata &amp; Product IDs in <span className="font-semibold text-emerald-600">Supabase</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action & Stats Bar */}
        <div className="border-b border-gray-100 bg-slate-50 px-6 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Status:</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-800">
                <Check className="h-3 w-3 stroke-[3]" />
                {connectedCount} of {connections.length} Products Connected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={driveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
              >
                <span>Open Google Drive Folder</span>
                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              </a>

              <button
                type="button"
                onClick={handleSyncAll}
                disabled={isPending || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 font-semibold text-blue-700 shadow-xs hover:bg-blue-100 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
                <span>Sync All Drive Images</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 flex items-center gap-2 rounded-xl p-3 text-xs ${
              statusMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <Check className="h-4 w-4 shrink-0 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU, or Product ID..."
              className="w-full rounded-xl border border-gray-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>

        {/* Connections Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-3 text-sm font-medium text-gray-600">Loading Drive connections from Supabase...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-500">
              No products found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                <thead className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Drive Image</th>
                    <th className="px-4 py-3">Product Name &amp; SKU</th>
                    <th className="px-4 py-3">Product ID (Supabase)</th>
                    <th className="px-4 py-3">Google Drive File</th>
                    <th className="px-4 py-3">Connection Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filtered.map((conn) => {
                    const isCopied = copiedId === conn.productId;
                    const driveUrl = conn.storagePath;

                    return (
                      <tr key={conn.productId} className="hover:bg-gray-50/60">
                        {/* Live Image Preview from Google Drive */}
                        <td className="px-4 py-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            <Image
                              src={driveUrl}
                              alt={conn.productName}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        </td>

                        {/* Product Identification */}
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900 line-clamp-1">{conn.productName}</p>
                          <p className="font-mono text-[11px] text-gray-500">SKU: {conn.sku}</p>
                        </td>

                        {/* Product ID with copy button */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-700 border border-slate-200">
                              {conn.productId.slice(0, 13)}...
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopy(conn.productId, `${conn.productId}.jpg`)}
                              className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-600 border border-slate-200 hover:bg-slate-100"
                              title="Copy target Drive filename: [id].jpg"
                            >
                              {isCopied ? <Check className="h-2.5 w-2.5 text-green-600" /> : <Copy className="h-2.5 w-2.5" />}
                              <span>{isCopied ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                        </td>

                        {/* Connected Drive File */}
                        <td className="px-4 py-3">
                          {conn.driveFileId ? (
                            <div>
                              <div className="flex items-center gap-1">
                                <FileCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                <span className="font-mono text-[11px] font-semibold text-gray-800 truncate max-w-[160px]" title={conn.driveFileName || ""}>
                                  {conn.driveFileName || `${conn.productId}.jpg`}
                                </span>
                              </div>
                              <a
                                href={`https://drive.google.com/file/d/${conn.driveFileId}/view`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-0.5"
                              >
                                <span>Drive ID: {conn.driveFileId.slice(0, 8)}...</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">Not connected yet</span>
                          )}
                        </td>

                        {/* Connection Badge */}
                        <td className="px-4 py-3">
                          {conn.hasDriveImage ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">
                              <Check className="h-3 w-3 stroke-[3]" />
                              Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                              Pending Drive File
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Pick from Drive */}
                            <button
                              type="button"
                              onClick={() => setActiveProductForPicker(conn)}
                              className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 border border-blue-200"
                              title="Browse and select an existing file from Google Drive"
                            >
                              <HardDrive className="h-3 w-3" />
                              <span>Select Drive File</span>
                            </button>

                            {/* Direct Upload button */}
                            <label
                              className="inline-flex cursor-pointer items-center gap-1 rounded bg-white px-2 py-1 text-[11px] font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50"
                              title="Upload photo from computer to Drive"
                            >
                              <Upload className="h-3 w-3 text-gray-500" />
                              <span>{uploadingProductId === conn.productId ? "Uploading..." : "Upload"}</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                className="hidden"
                                disabled={uploadingProductId === conn.productId}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleDirectUpload(conn.productId, file);
                                }}
                              />
                            </label>

                            {/* Unlink button */}
                            {conn.hasDriveImage && (
                              <button
                                type="button"
                                onClick={() => handleUnlink(conn.productId)}
                                className="rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                title="Unlink Drive image"
                              >
                                <Unlink className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs text-gray-500">
          <span>All product images stream exclusively from Google Drive via <code>/api/media/drive/product/[productId]</code></span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>

      {/* Embedded Drive Picker Modal for individual product */}
      {activeProductForPicker && (
        <DriveMediaPickerModal
          isOpen={true}
          productId={activeProductForPicker.productId}
          productName={activeProductForPicker.productName}
          onClose={() => {
            setActiveProductForPicker(null);
            fetchConnections();
          }}
        />
      )}
    </div>
  );
}
