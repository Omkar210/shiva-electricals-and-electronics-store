import { NextRequest } from "next/server";
import { getGoogleDriveFileStream } from "@/lib/storage/google-drive";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    fileId: string;
  }>;
}

/**
 * Streaming Proxy Route for Google Drive media files.
 * Streams binary image/file content from Google Drive with aggressive public caching,
 * bypassing Google's 2024 direct link deprecation and per-IP client rate limits.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { fileId } = await params;

  if (!fileId || typeof fileId !== "string" || fileId.includes("/") || fileId.includes("..")) {
    return new Response("Invalid file ID", { status: 400 });
  }

  try {
    const { stream, mimeType, sizeBytes } = await getGoogleDriveFileStream(fileId);

    // Convert Node Readable to Web ReadableStream for standard Web Response
    const webStream = Readable.toWeb(stream);

    const headers: Record<string, string> = {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    };

    if (sizeBytes && !isNaN(sizeBytes)) {
      headers["Content-Length"] = String(sizeBytes);
    }

    return new Response(webStream as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load media file";
    console.error(`Google Drive media proxy error for ID ${fileId}:`, message);

    if (message.includes("not found") || message.includes("404")) {
      return new Response("File not found", { status: 404 });
    }

    return new Response(`Failed to retrieve file: ${message}`, { status: 500 });
  }
}
