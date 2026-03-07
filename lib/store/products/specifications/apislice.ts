import { api } from "../../api";

export type SpecificationItem = {
    name: string;
    value: string;
    unit: string;
    type: number;
};

export type SpecificationGroup = {
    groupName: string;
    items: SpecificationItem[];
};

export type ProductSpecificationsResponse = {
    productId: string;
    productName: string;
    productSku: string;
    specificationGroups: SpecificationGroup[];
};

export type CreateProductSpecificationsRequest = {
    productId: string;
    specificationGroups: SpecificationGroup[];
};

export type UpdateProductSpecificationsRequest = {
    productId: string;
    specificationGroups: SpecificationGroup[];
};

export const specificationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProductSpecifications: builder.query<ProductSpecificationsResponse, string>({
            query: (id) => `Products/${id}/specifications`,
            providesTags: (result, error, id) => [{ type: "ProductSpecification", id }],
        }),

        createProductSpecifications: builder.mutation<void, CreateProductSpecificationsRequest>({
            query: ({ productId, specificationGroups }) => ({
                url: `Products/${productId}/specifications`,
                method: "POST",
                body: { specificationGroups },
            }),
            invalidatesTags: (result, error, { productId }) => [{ type: "ProductSpecification", id: productId }],
        }),

        updateProductSpecifications: builder.mutation<void, UpdateProductSpecificationsRequest>({
            query: ({ productId, specificationGroups }) => ({
                url: `Products/${productId}/specifications`,
                method: "PUT",
                body: { specificationGroups },
            }),
            invalidatesTags: (result, error, { productId }) => [{ type: "ProductSpecification", id: productId }],
        }),

        deleteProductSpecifications: builder.mutation<void, string>({
            query: (id) => ({
                url: `Products/${id}/specifications`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "ProductSpecification", id }],
        }),
    }),
});

export const {
    useGetProductSpecificationsQuery,
    useCreateProductSpecificationsMutation,
    useUpdateProductSpecificationsMutation,
    useDeleteProductSpecificationsMutation,
} = specificationsApi;
