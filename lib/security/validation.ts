/**
 * Security validation utilities for input hygiene, SSRF prevention,
 * open redirect mitigation, and file upload integrity.
 */

/**
 * Validates and sanitizes redirect URLs to strictly prevent Open Redirect vulnerabilities.
 * Ensures the target is a relative local path.
 */
export function validateSafeRedirect(
  url: string | null | undefined,
  fallback = "/account",
): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();

  // Must begin with a single slash
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  // Strictly disallow protocol-relative URLs (e.g. //attacker.com)
  if (trimmed.startsWith("//")) {
    return fallback;
  }

  // Strictly disallow backslashes (e.g. /\attacker.com) which some browsers interpret as domain separators
  if (trimmed.includes("\\")) {
    return fallback;
  }

  // Strictly disallow URL schemes or port specifiers inside relative path (e.g. /http: or /javascript:)
  if (trimmed.includes(":") || trimmed.includes("@")) {
    return fallback;
  }

  // Disallow control characters or newlines
  if (/[\r\n\t\0]/.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}

/**
 * Validates external outbound URLs to prevent Server-Side Request Forgery (SSRF).
 * Blocks RFC1918 private networks, link-local addresses, cloud metadata endpoints, and non-HTTPS protocols.
 */
export function validateSafeExternalUrl(
  urlString: string,
  allowedDomains: string[] = ["script.google.com", "google.com", "googleapis.com", "drive.google.com"],
): { valid: boolean; error?: string } {
  if (!urlString || typeof urlString !== "string") {
    return { valid: false, error: "Missing or invalid URL" };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { valid: false, error: "Malformed URL syntax" };
  }

  // Strictly require HTTPS protocol
  if (parsed.protocol !== "https:") {
    return { valid: false, error: "Insecure protocol: only HTTPS is permitted" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost, loopbacks, and local domain suffixes
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan")
  ) {
    return { valid: false, error: "Requests to localhost or local names are forbidden" };
  }

  // Block IPv4 literals and private/link-local/cloud metadata ranges
  const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Pattern);
  if (match) {
    const [, o1, o2] = match.map(Number);
    if (
      o1 === 127 || // 127.0.0.0/8 Loopback
      o1 === 10 || // 10.0.0.0/8 Private
      (o1 === 172 && o2 >= 16 && o2 <= 31) || // 172.16.0.0/12 Private
      (o1 === 192 && o2 === 168) || // 192.168.0.0/16 Private
      (o1 === 169 && o2 === 254) || // 169.254.0.0/16 Link-local / Cloud metadata
      o1 === 0 || // 0.0.0.0/8 Current network
      o1 >= 224 // Multicast / Reserved
    ) {
      return { valid: false, error: "Requests to internal or private IP ranges are strictly prohibited" };
    }
  }

  // Block IPv6 literals (e.g. [::1], [fc00::])
  if (hostname.startsWith("[") || hostname.includes(":")) {
    return { valid: false, error: "Direct IPv6 destination requests are prohibited" };
  }

  // Verify hostname is on domain allowlist or matches subdomains
  const isAllowed = allowedDomains.some((domain) => {
    if (hostname === domain) return true;
    if (hostname.endsWith(`.${domain}`)) return true;
    return false;
  });

  if (!isAllowed) {
    return {
      valid: false,
      error: `Destination host '${hostname}' is not in the approved external domains allowlist`,
    };
  }

  return { valid: true };
}

/**
 * Validates image file magic bytes (file signature) directly from a raw binary Buffer.
 * Defends against MIME-spoofing and arbitrary file upload attacks (OWASP A04).
 */
export function validateImageMagicBytes(buffer: Buffer): {
  valid: boolean;
  detectedMime?: string;
  error?: string;
} {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: "File buffer is too small to be a valid image" };
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedMime: "image/jpeg" };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedMime: "image/png" };
  }

  // 3. WebP: 'RIFF' at 0..3 and 'WEBP' at 8..11
  const riff = buffer.toString("ascii", 0, 4);
  const webp = buffer.toString("ascii", 8, 12);
  if (riff === "RIFF" && webp === "WEBP") {
    return { valid: true, detectedMime: "image/webp" };
  }

  // 4. AVIF: 'ftyp' at 4..8 and 'avif' or 'avis' at 8..12
  const ftyp = buffer.toString("ascii", 4, 8);
  const brand = buffer.toString("ascii", 8, 12);
  if (ftyp === "ftyp" && (brand === "avif" || brand === "avis" || brand === "mif1")) {
    return { valid: true, detectedMime: "image/avif" };
  }

  return {
    valid: false,
    error: "File content does not match authorized image signatures (JPEG, PNG, WebP, AVIF)",
  };
}
