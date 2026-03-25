/**
 * Shared domain types that are safe to import in both Server and Client Components.
 * These mirror the types in the RTK Query slice files but have no client-side dependencies.
 */

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export type ProductImage = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  mediumUrl: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription: string;
  sku: string;
  isHotDeal: boolean;
  isActive: boolean;
  stockQuantity: number;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  parentCategoryName?: string;
  parentCategorySlug?: string;
  subCategoryName?: string;
  subCategorySlug?: string;
  brandId: string;
  brandName?: string;
  imageUrl?: string;
  detailImageUrl?: string;
  price: number;
  discountedPrice: number;
  primaryImageUrl: string;
  productImages?: { id: string; primaryImageUrl: string }[];
  images?: ProductImage[];
  isFavorite?: boolean;
  createdAt?: string;
};

export type RecommendationResponse = {
  basedOnFavorites: Product[];
  basedOnCategory: Product[];
  hotDeals: Product[];
  recentlyAdded: Product[];
  similarProducts: Product[];
};

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------

export type Banner = {
  id: string;
  title: string | null;
  titleVisible: boolean;
  description: string | null;
  descriptionVisible: boolean;
  imageUrl: string | null;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  buttonText: string | null;
  buttonVisible: boolean;
  type: number;
  typeName: string;
  isActive: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  isCurrentlyActive: boolean;
  titlePositionX?: number;
  titlePositionY?: number;
  titleFontSize?: number;
  titleColor?: string | null;
  titleAlign?: string | null;
  descriptionPositionX?: number;
  descriptionPositionY?: number;
  descriptionFontSize?: number;
  descriptionColor?: string | null;
  buttonPositionX?: number;
  buttonPositionY?: number;
  buttonColor?: string | null;
  buttonTextColor?: string | null;
  buttonBorderRadius?: number;
  buttonPaddingX?: number;
  buttonPaddingY?: number;
  buttonFontSize?: number;
};

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  parentCategoryId: string | null;
  parentCategoryName?: string | null;
  subCategories?: Category[];
  productCount?: number;
  createdAt?: string;
};

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  productCount: number;
};
