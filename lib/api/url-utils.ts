/**
 * Server-safe URL utilities.
 * Does NOT import from lib/store/api to avoid pulling in js-cookie.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://evto027-001-site1.ktempurl.com";

/**
 * Converts a relative API path to a full absolute URL.
 * Safe to use in Server Components and Client Components alike.
 */
export function fullUrl(path: string | null | undefined): string {
  if (!path) return "/logos/logo3.svg";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}
