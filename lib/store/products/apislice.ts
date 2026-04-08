import { api } from "../api";

export type ProductImage = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  mediumUrl: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

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

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type FilterResponse<T> = {
  products: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  appliedFilters: any[];
};

export type RecommendationResponse = {
  basedOnFavorites: Product[];
  basedOnCategory: Product[];
  hotDeals: Product[];
  recentlyAdded: Product[];
  similarProducts: Product[];
};

export type ProductQueryParams = {
  CategoryId?: string;
  BrandSlug?: string;
  IsHotDeal?: boolean;
  IsActive?: boolean;
  SearchTerm?: string;
  MinPrice?: number;
  MaxPrice?: number;
  ProductSortBy?: number;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  SortOrder?: string;
};

export type ProductFilterCriteria = {
  filterId?: string;
  filterOptionIds?: string[];
  customValue?: string;
  minValue?: number;
  maxValue?: number;
};

export type ProductFilterRequest = {
  categoryIds?: string[];
  brandSlug?: string;
  isHotDeal?: boolean;
  isRecommended?: boolean;
  searchTerm?: string;
  filterCriteria?: ProductFilterCriteria[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
};

export type ProductFilterAssignment = {
  id: string;
  productId: string;
  productName: string;
  filterId: string;
  filterName: string;
  filterOptionId?: string;
  filterOptionDisplayName?: string;
  customValue?: string;
  createdAt?: string;
};

export type BulkAssignFilterRequest = {
  productIds: string[];
  filterId: string;
  filterOptionId?: string;
  customValue?: string;
};

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaginatedProducts: builder.query<PaginatedResponse<Product>, ProductQueryParams>({
      query: (params) => ({
        url: "Products/paginated",
        params,
      }),
      providesTags: ["Product"],
    }),

    filterProducts: builder.query<FilterResponse<Product>, ProductFilterRequest>({
      query: (body) => ({
        url: "Products/filter",
        method: "POST",
        body,
      }),
      providesTags: ["Product"],
    }),

    createProductWithImage: builder.mutation<Product, {
      name: string;
      description: string;
      shortDescription: string;
      sku: string;
      isHotDeal: boolean;
      stockQuantity: number;
      categoryId: string;
      brandId: string;
      price: number;
      discountedPrice: number;
      primaryImageUrl: File;
      detailImageFiles?: File[];
    }>({
      query: ({ primaryImageUrl, detailImageFiles, ...data }) => {
        const formData = new FormData();
        formData.append("productData", JSON.stringify(data));
        formData.append("imageFile", primaryImageUrl);
        if (detailImageFiles) {
          detailImageFiles.forEach((file) => {
            formData.append("detailImageFiles", file);
          });
        }
        return {
          url: "Products/with-image",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),

    updateProductWithImage: builder.mutation<Product, {
      id: string;
      name: string;
      description: string;
      shortDescription: string;
      sku: string;
      isHotDeal: boolean;
      stockQuantity: number;
      categoryId: string;
      brandId: string;
      price: number;
      discountedPrice: number;
      isActive: boolean;
      primaryImageUrl?: File | null;
      detailImageFiles?: File[];
    }>({
      query: ({ id, primaryImageUrl, detailImageFiles, ...data }) => {
        const formData = new FormData();
        formData.append("productData", JSON.stringify(data));
        if (primaryImageUrl instanceof File) {
          formData.append("imageFile", primaryImageUrl);
        }
        if (detailImageFiles) {
          detailImageFiles.forEach((file) => {
            formData.append("detailImageFiles", file);
          });
        }
        return {
          url: `Products/${id}/with-image`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `Products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    bulkAssignProductFilters: builder.mutation<void, BulkAssignFilterRequest>({
      query: (body) => ({
        url: `Admin/Products/filters/bulk-assign`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    getProductFilters: builder.query<ProductFilterAssignment[], string>({
      query: (productId) => `Admin/Products/${productId}/filters`,
      providesTags: ["Product"],
    }),

    deleteProductFilters: builder.mutation<void, string>({
      query: (productId) => ({
        url: `Admin/Products/${productId}/filters`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProductFilter: builder.mutation<void, { productId: string; filterId: string }>({
      query: ({ productId, filterId }) => ({
        url: `Admin/Products/${productId}/filters/${filterId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getHotDeals: builder.query<Product[], void>({
      query: () => "Products/hot-deals",
      providesTags: ["Product"],
    }),
    getRecommendations: builder.query<RecommendationResponse, { productId?: string; categoryId?: string; limit?: number } | void>({
      query: (params) => ({
        url: "Products/recommendations",
        params: params ? params : undefined,
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetPaginatedProductsQuery,
  useCreateProductWithImageMutation,
  useUpdateProductWithImageMutation,
  useDeleteProductMutation,
  useFilterProductsQuery,
  useBulkAssignProductFiltersMutation,
  useGetProductFiltersQuery,
  useDeleteProductFiltersMutation,
  useDeleteProductFilterMutation,
  useGetHotDealsQuery,
  useGetRecommendationsQuery,
} = productApi;
