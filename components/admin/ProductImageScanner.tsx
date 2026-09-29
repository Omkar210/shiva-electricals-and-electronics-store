"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import {
  Sparkles,
  Camera,
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
} from "lucide-react";
import type { ExtractedProductData } from "@/lib/ai/product-scanner";

interface ScannedImagePreview {
  file: File;
  previewUrl: string;
  id: string;
}

interface ProductImageScannerProps {
  onScanComplete: (data: ExtractedProductData, files: File[]) => void;
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export default function ProductImageScanner({
  onScanComplete,
  brands: _brands,
  categories: _categories,
}: ProductImageScannerProps) {
  const [images, setImages] = useState<ScannedImagePreview[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [extractedSummary, setExtractedSummary] = useState<ExtractedProductData | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    const validFiles: ScannedImagePreview[] = [];

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files (JPEG, PNG, WebP, AVIF) are supported.");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`Image "${file.name}" exceeds 10MB.`);
        continue;
      }
      validFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
        id: `${file.name}-${Date.now()}-${Math.random()}`,
      });
    }

    setImages((prev) => [...prev, ...validFiles].slice(0, 8)); // Max 8 images
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      return filtered;
    });
    if (images.length <= 1) {
      setExtractedSummary(null);
    }
  };

  const startScan = async () => {
    if (images.length === 0) {
      setError("Please add at least 1 image of the product (front, back, label, or sides).");
      return;
    }

    setIsScanning(true);
    setError(null);
    setScanStep("Preparing multi-angle photos for inspection...");

    try {
      const formData = new FormData();
      images.forEach((img) => {
        formData.append("images", img.file);
      });

      setScanStep(`Reading text & electrical labels across ${images.length} images...`);

      const res = await fetch("/api/admin/products/scan-images", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to scan product images.");
      }

      setScanStep("Parsing specifications and pre-filling product form...");
      const extracted: ExtractedProductData = result.data;
      setExtractedSummary(extracted);

      // Pass extracted data and image files up to ProductForm
      onScanComplete(
        extracted,
        images.map((img) => img.file),
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image analysis failed.";
      setError(msg);
    } finally {
      setIsScanning(false);
      setScanStep("");
    }
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-linear-to-b from-indigo-50/50 via-white to-white p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">
                AI Multi-Angle Product Scanner
              </h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                Admin Feature
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Upload photos of all sides &amp; specification labels. AI reads and auto-fills product details for your review.
            </p>
          </div>
        </div>

        {/* Upload Buttons */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFilesAdded}
            className="hidden"
            id="multi-scanner-input"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning || images.length >= 8}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50"
          >
            <Camera className="h-3.5 w-3.5 text-gray-500" />
            <span>Add Photos</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Gallery / Staging Area */}
      {images.length > 0 ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span>
              {images.length} {images.length === 1 ? "Angle" : "Angles"} Staged (Max 8)
            </span>
            <span className="text-[11px] text-gray-400">
              Click an image to zoom in on labels
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="group relative h-28 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-xs"
              >
                <Image
                  src={img.previewUrl}
                  alt={`Angle ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />

                {/* Badge Angle Label */}
                <div className="absolute top-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  {idx === 0 ? "Front" : idx === 1 ? "Back / Label" : `Angle ${idx + 1}`}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setExpandedImage(img.previewUrl)}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/80"
                    title="Zoom in"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700"
                    title="Remove angle"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Scan Action Bar */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-indigo-100">
            <div className="text-xs text-gray-500">
              {isScanning ? (
                <div className="flex items-center gap-2 text-indigo-700 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <span>{scanStep}</span>
                </div>
              ) : (
                <span className="flex items-center gap-1 text-gray-500">
                  <Info className="h-3.5 w-3.5 text-indigo-500" />
                  Tip: Include a clear photo of the electrical rating plate or barcode sticker.
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={startScan}
              disabled={isScanning || images.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing Images...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Scan &amp; Auto-Fill Form</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/60 p-6 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/20"
        >
          <UploadCloud className="h-8 w-8 text-indigo-500" />
          <p className="mt-2 text-xs font-semibold text-gray-700">
            Click to upload multi-angle product photos
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            Upload Front, Back, Rating Plate, Box Packaging (Up to 8 images, 10MB each)
          </p>
        </div>
      )}

      {/* Detection Success Banner */}
      {extractedSummary && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50/60 p-4">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-green-900">
                AI Detection Complete! Form has been pre-filled below.
              </span>
              <p className="mt-0.5 text-green-800">
                Please review all values. You can correct any mistakes in the form fields before clicking <strong>Create Product</strong>.
              </p>

              {/* Detected Highlights */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {extractedSummary.brand && (
                  <span className="rounded-md bg-white px-2 py-0.5 font-medium text-gray-700 shadow-2xs border border-green-200">
                    Brand: <strong>{extractedSummary.brand}</strong>
                  </span>
                )}
                {extractedSummary.sku && (
                  <span className="rounded-md bg-white px-2 py-0.5 font-mono text-gray-700 shadow-2xs border border-green-200">
                    SKU: <strong>{extractedSummary.sku}</strong>
                  </span>
                )}
                {extractedSummary.mrp && (
                  <span className="rounded-md bg-white px-2 py-0.5 font-medium text-gray-700 shadow-2xs border border-green-200">
                    MRP: <strong>₹{extractedSummary.mrp.toLocaleString("en-IN")}</strong>
                  </span>
                )}
                {extractedSummary.price && (
                  <span className="rounded-md bg-white px-2 py-0.5 font-medium text-green-700 shadow-2xs border border-green-200">
                    Selling Price: <strong>₹{extractedSummary.price.toLocaleString("en-IN")}</strong>
                  </span>
                )}
              </div>

              {/* Detected Label Text Snippets */}
              {extractedSummary.detected_text_snippets && extractedSummary.detected_text_snippets.length > 0 && (
                <div className="mt-2 border-t border-green-200/60 pt-2 text-[11px] text-gray-600">
                  <span className="font-semibold text-gray-700">Text Read from Labels:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {extractedSummary.detected_text_snippets.map((snip, i) => (
                      <span key={i} className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[10px] text-gray-600 border border-green-100">
                        {snip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal for inspecting photos while reviewing form */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white p-2">
            <button
              type="button"
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative h-[80vh] w-[80vw]">
              <Image
                src={expandedImage}
                alt="Product Angle Detail"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
