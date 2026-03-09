import { api } from "../api";

export type PromoCode = {
    id: string;
    code: string;
    discountPercentage: number;
    expirationDate: string;
    isActive: boolean;
    usageLimit: number;
};

export type PaginatedPromoCodeResponse = {
    items: PromoCode[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export type PromoCodeQueryParams = {
    pageNumber?: number;
    pageSize?: number;
};

export type CreatePromoCodeRequest = {
    code: string;
    discountPercentage: number;
    expirationDate: string;
    isActive: boolean;
    usageLimit: number;
};

export type UpdatePromoCodeRequest = {
    id: string;
    data: {
        code: string;
        discountPercentage: number;
        expirationDate: string;
        isActive: boolean;
        usageLimit: number;
    };
};

export const promoCodesApiSlice = api
    .enhanceEndpoints({ addTagTypes: ["PromoCode"] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getPromoCodes: builder.query<PaginatedPromoCodeResponse, PromoCodeQueryParams>({
                query: (params) => ({
                    url: "/PromoCodes",
                    params: {
                        pageNumber: params.pageNumber ?? 1,
                        pageSize: params.pageSize ?? 10,
                    },
                }),
                providesTags: ["PromoCode"],
            }),

            createPromoCode: builder.mutation<PromoCode, CreatePromoCodeRequest>({
                query: (body) => ({
                    url: "/PromoCodes",
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["PromoCode"],
            }),

            updatePromoCode: builder.mutation<PromoCode, UpdatePromoCodeRequest>({
                query: ({ id, data }) => ({
                    url: `/PromoCodes/${id}`,
                    method: "PUT",
                    body: data,
                }),
                invalidatesTags: ["PromoCode"],
            }),

            deletePromoCode: builder.mutation<void, string>({
                query: (id) => ({
                    url: `/PromoCodes/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["PromoCode"],
            }),
        }),
    });

export const {
    useGetPromoCodesQuery,
    useCreatePromoCodeMutation,
    useUpdatePromoCodeMutation,
    useDeletePromoCodeMutation,
} = promoCodesApiSlice;
