"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  getDriveFilesAction,
  importDriveFileAction,
} from "@/app/admin/products/media-actions";
import type { DriveFolderFile } from "@/lib/storage/google-drive";
import {
  HardDrive,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  X,
  AlertCircle,
  FileImage,
} from "lucide-react";

interface DriveMediaPickerModalProps {
  productId?: string;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (file: DriveFolderFile) => void;
}

export default function DriveMediaPickerModal({
  productId,
  productName,
  isOpen,
  onClose,
  onSelectImage,
}: DriveMediaPickerModalProps) {
  const [files, setFiles] = useState<DriveFolderFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const driveFolderUrl = "https://drive.google.com/drive/folders/1NkrEkQd81MVx3XMy_8U0uCgRIgryJKgJ";

  const fetchFiles = () => {
    setLoading(true);
    setError(null);
    getDriveFilesAction()
      .then((res) => {
        if (res.success) {
          setFiles(res.files);
        } else {
          setError(res.error || "Failed to load files from Google Drive.");
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error connecting to Google Drive");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    if (isOpen) {
      getDriveFilesAction()
        .then((res) => {
          if (!ignore) {
            if (res.success) {
              setFiles(res.files);
            } else {
              setError(res.error || "Failed to load files from Google Drive.");
            }
          }
        })
        .catch((err: unknown) => {
          if (!ignore) {
            setError(err instanceof Error ? err.message : "Error connecting to Google Drive");
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

  const handleCopyId = () => {
    if (productId) {
      navigator.clipboard.writeText(`${productId}.jpg`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAssign = (file: DriveFolderFile) => {
    if (onSelectImage) {
      onSelectImage(file);
      onClose();
      return;
    }

    if (!productId) return;

    setAssigningId(file.id);
    setError(null);
    startTransition(async () => {
      try {
        const res = await importDriveFileAction({
          productId,
          fileId: file.id,
          fileName: file.name,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          isPrimary: true,
        });

        if (res.success) {
          setSuccessMessage(`Successfully linked "${file.name}" to product!`);
          setTimeout(() => {
            onClose();
          }, 1200);
        } else {
          setError(res.error || "Failed to link file to product.");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to link Drive file");
      } finally {
        setAssigningId(null);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Google Drive Media Manager
              </h3>
              <p className="text-xs text-gray-500">
                {productName ? `Managing: ${productName}` : "Primary Image Storage (Google Drive)"}
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

        {/* Product ID & Drive Info Banner */}
        <div className="border-b border-gray-100 bg-slate-50 px-6 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
            {productId && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">Target File Name:</span>
                <code className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700 border border-slate-200">
                  {productId}.jpg
                </code>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[11px] font-medium text-gray-700 border border-slate-200 hover:bg-slate-100"
                >
                  {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <a
                href={driveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
              >
                <span>Open Google Drive Folder</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={fetchFiles}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs font-medium text-gray-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700">
            <Check className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-3 text-sm font-medium text-gray-600">Loading files from Google Drive...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <FileImage className="mx-auto h-12 w-12 text-gray-300" />
              <h4 className="mt-2 text-sm font-bold text-gray-800">No images found in Google Drive yet</h4>
              <p className="mt-1 text-xs text-gray-500 max-w-md mx-auto">
                Upload your product photos to the shared Google Drive folder. You can name them with the Product ID (e.g. <code>{productId ? `${productId}.jpg` : "[product-id].jpg"}</code>) for automated detection.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <a
                  href={driveFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Upload Photos in Google Drive</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {files.map((file) => {
                const isMatchingProduct =
                  productId && (file.name.includes(productId) || file.name.startsWith(productId));

                return (
                  <div
                    key={file.id}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white p-2.5 transition-all ${
                      isMatchingProduct
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={file.proxyUrl}
                        alt={file.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      {isMatchingProduct && (
                        <span className="absolute left-1.5 top-1.5 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          Matching ID
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-800" title={file.name}>
                        {file.name}
                      </p>
                      {file.sizeBytes && (
                        <p className="text-[10px] text-gray-400">
                          {(file.sizeBytes / 1024).toFixed(0)} KB
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-1 border-t border-gray-100 pt-2">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded p-1 text-gray-400 hover:text-gray-700"
                          title="Open in Drive"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAssign(file)}
                        disabled={assigningId === file.id || isPending}
                        className="flex-1 rounded-md bg-blue-50 px-2 py-1 text-center text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                      >
                        {assigningId === file.id ? "Linking..." : "Select Image"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs text-gray-500">
          <span>Google Drive Folder: Product_Images</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
