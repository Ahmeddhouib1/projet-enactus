import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value: string | null | undefined, locale = "en-GB"): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Resolves an image path coming from the API into a browser-loadable URL.
 * - Absolute URLs pass through unchanged.
 * - "/uploads/..." paths are admin-uploaded media served by the backend.
 * - Any other path (e.g. "/images/...") is a static asset bundled with the
 *   frontend itself (demo/placeholder imagery) and is left as-is.
 */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads")) {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    return `${base}${path}`;
  }
  return path;
}

/**
 * Backend-uploaded images must be rendered with next/image's `unoptimized`
 * flag: the optimizer fetches remote images server-side, and in Docker that
 * request runs inside the frontend container where the public backend host
 * (e.g. "localhost") resolves to the container's own loopback address, not
 * the backend - Next.js's SSRF protection correctly rejects that fetch.
 * Local static assets (e.g. "/images/...") are unaffected and still get
 * full optimization since they're never fetched over HTTP.
 */
export function isUploadedMedia(path: string | null | undefined): boolean {
  return !!path && path.startsWith("/uploads");
}
