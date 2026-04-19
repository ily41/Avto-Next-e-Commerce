"use client";

import { api } from "../api";
export { 
  type CreditRequest, 
  type CreditRequestCreateRequest, 
  type CreditRequestListResponse, 
  type CreditRequestStatusUpdateRequest,
  CreditRequestStatus
} from "../../api/types";

export const creditRequestApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createCreditRequest: builder.mutation<CreditRequest, CreditRequestCreateRequest>({
      query: (body) => ({
        url: "/CreditRequests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    getAllCreditRequests: builder.query<CreditRequestListResponse, { status?: string; page?: number; pageSize?: number }>({
      query: ({ status, page = 1, pageSize = 10 }) => ({
        url: "/CreditRequests/admin/all",
        params: { status, page, pageSize },
      }),
      providesTags: ["CreditRequests"],
    }),
    getCreditRequestById: builder.query<CreditRequest, string>({
      query: (id) => `/CreditRequests/admin/${id}`,
      providesTags: (result, error, id) => [{ type: "CreditRequests", id }],
    }),
    updateCreditRequestStatus: builder.mutation<CreditRequest, { id: string; body: CreditRequestStatusUpdateRequest }>({
      query: ({ id, body }) => ({
        url: `/CreditRequests/admin/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["CreditRequests", { type: "CreditRequests", id }],
    }),
  }),
});

export const {
  useCreateCreditRequestMutation,
  useGetAllCreditRequestsQuery,
  useGetCreditRequestByIdQuery,
  useUpdateCreditRequestStatusMutation,
} = creditRequestApiSlice;
