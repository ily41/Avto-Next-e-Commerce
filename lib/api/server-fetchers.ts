/**
 * Server-side data fetchers for Next.js App Router Server Components.
 * Uses native `fetch()` with Next.js revalidation so the App Router can cache
 * responses server-side — no RTK Query hooks, no client-side dependencies.
 */

import type { RecommendationResponse, Banner, Category, Brand } from "./types";

// Plain env-var lookup — does NOT import from lib/store/api (which pulls in js-cookie)
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://avtoo027-001-site1.ntempurl.com";

const API = `${BASE_URL}/api/v1`;

// Revalidation interval in seconds. Lowered for better sync between Admin and Site.
const REVALIDATE = 10;

/** Shared fetch helper with ISR caching */
async function apiFetch<T>(path: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}/${path}`, {
      next: { revalidate: REVALIDATE, tags: [tag] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function fetchRecommendations(
  limit = 12
): Promise<RecommendationResponse | null> {
  return apiFetch<RecommendationResponse>(
    `Products/recommendations?limit=${limit}`,
    "products"
  );
}

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------

export async function fetchBanners(type?: number): Promise<Banner[]> {
  const path =
    type !== undefined ? `Admin/banners?type=${type}` : "Admin/banners";
  const data = await apiFetch<Banner[]>(path, "banners");
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function fetchCategories(): Promise<Category[]> {
  const data = await apiFetch<Category[]>("Categories/root", "categories");
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

type BrandsResponse = { items: Brand[]; totalCount: number };

export async function fetchBrands(
  pageIndex = 1,
  pageSize = 10
): Promise<Brand[]> {
  const data = await apiFetch<BrandsResponse>(
    `Brands/paginated?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    "brands"
  );
  return data?.items ?? [];
}
