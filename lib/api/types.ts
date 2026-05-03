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
  weightKg: number;
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

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export type DashboardStatistics = {
  revenue: {
    today: number;
    thisMonth: number;
    total: number;
    averageOrderValue: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    delivered: number;
  };
  customers: {
    total: number;
    active: number;
  };
  products: {
    total: number;
    lowStock: number;
    topSellingProducts: {
      id: string;
      name: string;
      soldCount: number;
    }[];
  };
  growth: {
    revenuePercentage: number;
    ordersPercentage: number;
    customersPercentage: number;
  };
  trends: {
    date: string;
    amount: number;
  }[];
};

// ---------------------------------------------------------------------------
// Settings & Configuration
// ---------------------------------------------------------------------------

export type InstallmentOption = {
  id: string;
  bankName: string;
  installmentPeriod: number;
  interestPercentage: number;
  isActive: boolean;
  minimumAmount: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type InstallmentCalculation = {
  installmentOptionId: string;
  bankName: string;
  installmentPeriod: number;
  interestPercentage: number;
  originalAmount: number;
  interestAmount: number;
  totalAmount: number;
  monthlyPayment: number;
};

export type InstallmentConfiguration = {
  id: string;
  isEnabled: boolean;
  minimumAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type CartMinimumAmountSetting = {
  minimumAmount: number;
};

export type LoyaltySettings = {
  bonusPercentage: number;
};

// ---------------------------------------------------------------------------
// Credit Requests (ID Card Payment)
// ---------------------------------------------------------------------------

export enum CreditRequestStatus {
  Pending = 0,
  Contacted = 1,
  Approved = 2,
  Rejected = 3,
}

export type CreditRequestItem = {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type CreditRequest = {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  cartAmount: number;
  deliveryFee: number;
  totalAmount: number;
  shippingMethod: string;
  shippingAddress: string;
  deliveryPostCode: string;
  userPassport: string;
  packageWeight: number;
  fragile: boolean;
  status: string; // Label from backend
  statusValue?: CreditRequestStatus; // Enum value if needed
  notes: string;
  convertedOrderId: string | null;
  createdAt: string;
  updatedAt: string;
  items: CreditRequestItem[];
};

export type CreditRequestCreateRequest = {
  fullName: string;
  phoneNumber: string;
  shippingMethod: string;
  shippingAddress: string;
  deliveryPostCode: string;
  userPassport: string;
  fragile: boolean;
};

export type CreditRequestStatusUpdateRequest = {
  status: CreditRequestStatus;
  notes: string;
};

export type CreditRequestListResponse = {
  items: CreditRequest[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  count: number;
  startIndex: number;
  endIndex: number;
};

