import { api } from "../api";
import { Product } from "../products/apislice";

export const productDetailsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProductById: builder.query<Product, string>({
            query: (id) => `Products/${id}`,
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),
        getProductBySlug: builder.query<Product, string>({
            query: (slug) => `Products/slug/${slug}`,
            providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
        }),
    }),
});

export const { useGetProductByIdQuery, useGetProductBySlugQuery } = productDetailsApi;
