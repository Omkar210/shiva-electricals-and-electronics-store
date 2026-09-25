import { google } from "googleapis";
import { Readable } from "stream";

// Scope required for managing files in Google Drive
const SCOPES = ["https://www.googleapis.com/auth/drive"];

/**
 * Checks whether Google Drive credentials are fully configured in the environment.
 */
export function isGoogleDriveConfigured(): boolean {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  return Boolean(email && privateKey && folderId);
}

/**
 * Sanitizes and formats the private key from environment variables.
 * Handles both literal newlines and escaped '\n' sequences.
 */
function getFormattedPrivateKey(): string {
  const key = process.env.GOOGLE_PRIVATE_KEY || "";
  return key.replace(/\\n/g, "\n");
}

/**
 * Creates an authenticated Google Drive API v3 client using Service Account credentials.
 */
export function getGoogleDriveClient() {
  if (!isGoogleDriveConfigured()) {
    throw new Error(
      "Google Drive is not configured. Missing GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_DRIVE_FOLDER_ID.",
    );
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getFormattedPrivateKey(),
    scopes: SCOPES,
  });

  return google.drive({ version: "v3", auth });
}

export interface DriveUploadResult {
  fileId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  webViewLink?: string;
  proxyUrl: string;
}

/**
 * Converts a Buffer or Uint8Array into a readable stream for Google APIs.
 */
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

/**
 * Uploads a file directly to the configured Google Drive folder.
 * Grants read permission so the file can be viewed publicly through the proxy.
 */
export async function uploadToGoogleDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folderId?: string,
): Promise<DriveUploadResult> {
  const drive = getGoogleDriveClient();
  const targetFolderId = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  const fileMetadata: { name: string; parents?: string[] } = {
    name: filename,
  };

  if (targetFolderId) {
    fileMetadata.parents = [targetFolderId];
  }

  const media = {
    mimeType,
    body: bufferToStream(buffer),
  };

  // 1. Create file in Google Drive
  const createResponse = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, name, mimeType, size, webViewLink, webContentLink",
  });

  const file = createResponse.data;
  if (!file.id) {
    throw new Error("Google Drive upload succeeded but no file ID was returned.");
  }

  // 2. Set file permissions to 'anyone with link can view'
  try {
    await drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (permError) {
    // Non-fatal if organization policy prevents public link sharing; service account can still read it
    console.warn(`Warning: Could not set public permission on Drive file ${file.id}:`, permError);
  }

  return {
    fileId: file.id,
    name: file.name || filename,
    mimeType: file.mimeType || mimeType,
    sizeBytes: file.size ? parseInt(file.size, 10) : buffer.length,
    webViewLink: file.webViewLink || undefined,
    proxyUrl: `/api/media/drive/${file.id}`,
  };
}

export interface DriveFileStreamResult {
  stream: Readable;
  mimeType: string;
  sizeBytes?: number;
  name: string;
}

/**
 * Retrieves the binary stream and metadata for a specific Google Drive file.
 * Used by the Next.js streaming proxy route (/api/media/drive/[fileId]).
 */
export async function getGoogleDriveFileStream(
  fileId: string,
): Promise<DriveFileStreamResult> {
  const drive = getGoogleDriveClient();

  // 1. Fetch file metadata
  const metaResponse = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, size, trashed",
  });

  const meta = metaResponse.data;
  if (!meta || meta.trashed) {
    throw new Error(`File not found or has been trashed in Google Drive (ID: ${fileId})`);
  }

  // 2. Fetch binary stream
  const mediaResponse = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" },
  );

  return {
    stream: mediaResponse.data as Readable,
    mimeType: meta.mimeType || "application/octet-stream",
    sizeBytes: meta.size ? parseInt(meta.size, 10) : undefined,
    name: meta.name || fileId,
  };
}

/**
 * Deletes a file from Google Drive permanently.
 */
export async function deleteFromGoogleDrive(fileId: string): Promise<void> {
  const drive = getGoogleDriveClient();

  try {
    await drive.files.delete({ fileId });
  } catch (err: unknown) {
    // If already deleted/404, don't crash
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("File not found") && !message.includes("404")) {
      throw err;
    }
  }
}
