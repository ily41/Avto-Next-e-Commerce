export type Brand = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    productCount: number;
}

import { api } from "../api";

export const brandApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getBrands: builder.query<{ items: Brand[] }, { page?: number; pageSize?: number }>({
      query: (params) => ({
        url: "Brands/paginated",
        params: {
            PageIndex: params.page || 1,
            PageSize: params.pageSize || 20
        }
      }),
      providesTags: ["Brand"],
    }),

    searchBrandsAdmin: builder.query<{ 
        items: Brand[], 
        totalCount: number,
        page: number,
        pageSize: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,
        count: number,
        query: string | null
    }, { 
        q?: string, 
        page?: number, 
        pageSize?: number,
        sortBy?: string,
        sortOrder?: string,
        includeInactive?: boolean,
        hasProducts?: boolean
    }>({
      query: (params) => ({
        url: "Brands/search/admin",
        params: {
            Q: params.q,
            Page: params.page,
            PageSize: params.pageSize,
            SortBy: params.sortBy,
            SortOrder: params.sortOrder,
            IncludeInactive: true,
            HasProducts: params.hasProducts
        }
      }),
      providesTags: ["Brand"],
    }),

   createBrandWithImage: builder.mutation<void, { name: string; sortOrder: number; imageFile: File }>({
  query: ({ name, sortOrder, imageFile }) => {
    const formData = new FormData();
    // The imageFile is the ONLY thing in the multipart body
    formData.append("imageFile", imageFile);

    return {
      url: "Brands/with-image",
      method: "POST",
      // These are sent as ?name=...&sortOrder=...
      params: { 
        name, 
        sortOrder // Ensure this is a raw number
      },
      body: formData,
    };
  },
  invalidatesTags: ["Brand"],
}),
    deleteBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `Brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),

    editBrand: builder.mutation<void, { id: string; name: string; sortOrder: number; isActive: boolean; imageFile?: File | null }>({
      query: ({ id, name, sortOrder, isActive, imageFile }) => {
        const formData = new FormData();

        // 1. Create the brandData object and append it as a string
        const brandData = JSON.stringify({
          name: name,
          sortOrder: sortOrder,
          isActive: isActive // Assuming true or include in your schema if needed
        });

        formData.append("brandData", brandData);

        // 2. Append the image if it exists
        if (imageFile instanceof File) {
          formData.append("imageFile", imageFile);
        }

        return {
          url: `Brands/${id}/with-image`,
          method: "PUT",
          // Remove 'params' entirely as they shouldn't be in the URL
          body: formData,
          // Note: Do NOT set Content-Type header manually; 
          // the browser will set it with the correct boundary.
        };
      },
      invalidatesTags: ["Brand"],
    }),








  }),
});

// Hooks are generated based on the endpoints
export const { useGetBrandsQuery, useSearchBrandsAdminQuery, useCreateBrandWithImageMutation, useDeleteBrandMutation, useEditBrandMutation } = brandApi;