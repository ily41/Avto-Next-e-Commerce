import { api } from "../api";
import { Product } from "../products/apislice";

export const productDetailsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProductById: builder.query<Product, string>({
            query: (id) => `Products/${id}`,
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),
    }),
});

export const { useGetProductByIdQuery } = productDetailsApi;
