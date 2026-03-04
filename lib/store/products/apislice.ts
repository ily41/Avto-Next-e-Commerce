// store/products/apiSlice.ts
import { api } from "../api";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({


    
    getProducts: builder.query<any[], void>({
      query: () => "Products/paginated",
      providesTags: ["Product"],
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "Products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),




  }),
});

// Hooks are generated based on the endpoints
export const { useGetProductsQuery, useAddProductMutation } = productApi;