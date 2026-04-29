"use client";

import { api } from "../api";

export interface ExpargoRule {
  id: string;
  minWeight: number;
  maxWeight: number;
  basePrice: number;
  additionalPricePerKg: number;
  isActive: boolean;
}

export interface ExpargoCalculateResponse {
  totalWeightKg: number;
  deliveryFee: number;
  matchedRule: ExpargoRule;
}

export const expargoApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    calculateExpargoFee: builder.query<ExpargoCalculateResponse, number>({
      query: (weight) => `/Expargo/calculate?weight=${weight}`,
    }),
    getExpargoRules: builder.query<ExpargoRule[], void>({
      query: () => "/Expargo/rules",
      providesTags: ["ExpargoRules"],
    }),
    createExpargoRule: builder.mutation<ExpargoRule, Partial<ExpargoRule>>({
      query: (body) => ({
        url: "/Expargo/rules",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ExpargoRules"],
    }),
    updateExpargoRule: builder.mutation<ExpargoRule, { id: string; rule: Partial<ExpargoRule> }>({
      query: ({ id, rule }) => ({
        url: `/Expargo/rules/${id}`,
        method: "PUT",
        body: rule,
      }),
      invalidatesTags: ["ExpargoRules"],
    }),
    deleteExpargoRule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/Expargo/rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExpargoRules"],
    }),
  }),
});

export const {
  useCalculateExpargoFeeQuery,
  useGetExpargoRulesQuery,
  useCreateExpargoRuleMutation,
  useUpdateExpargoRuleMutation,
  useDeleteExpargoRuleMutation,
} = expargoApiSlice;
