import { api } from "../api";

export type Product = {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  isHotDeal: boolean;
  isActive: boolean;
  stockQuantity: number;
  categoryId: string;
  categoryName?: string;
  brandId: string;
  brandName?: string;
  price: number;
  discountedPrice: number;
  imageUrl: string;
  productImages?: { id: string; imageUrl: string }[];
  createdAt?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaginatedProducts: builder.query<PaginatedResponse<Product>, ProductQueryParams>({
      query: (params) => ({
        url: "Products/paginated",
        params,
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
      imageFile: File;
      detailImageFiles?: File[];
    }>({
      query: ({ imageFile, detailImageFiles, ...data }) => {
        const formData = new FormData();
        formData.append("productData", JSON.stringify(data));
        formData.append("imageFile", imageFile);
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
      imageFile?: File | null;
      detailImageFiles?: File[];
    }>({
      query: ({ id, imageFile, detailImageFiles, ...data }) => {
        const formData = new FormData();
        formData.append("productData", JSON.stringify(data));
        if (imageFile instanceof File) {
          formData.append("imageFile", imageFile);
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

    deleteProductImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `Products/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetPaginatedProductsQuery,
  useCreateProductWithImageMutation,
  useUpdateProductWithImageMutation,
  useDeleteProductMutation,
  useDeleteProductImageMutation,
} = productApi;
