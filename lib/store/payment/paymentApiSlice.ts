"use client";

import { api } from "../api";

export interface PaymentInitiateRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string;
  deliveryPostCode: string;
  userPassport: string;
  packageWeight?: number;
  fragile?: boolean;
  /** 0 = post_office_lcl, 1 = home_delivery_lcl */
  deliveryType: 0 | 1;
  walletAmountToUse?: number;
  installmentOptionId?: string | null;
}

export interface PaymentInitiateResponse {
  status: string;
  transaction_id: string;
  payment_url: string;
  message?: string;
}

export interface PaymentResultRequest {
  transaction_id: string;
  order_id: string;
  status: string;
  amount: number;
  currency: string;
  signature: string;
  message: string;
}

export const paymentApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation<PaymentInitiateResponse, PaymentInitiateRequest>({
      query: (body) => ({
        url: "/Payment/initiate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    getPaymentSuccess: builder.query<any, { order_id: string; transaction_id: string }>({
      query: ({ order_id, transaction_id }) => ({
        url: "/Payment/success",
        params: { order_id, transaction_id },
      }),
    }),
    getPaymentError: builder.query<any, { order_id: string; transaction_id: string; message: string }>({
      query: ({ order_id, transaction_id, message }) => ({
        url: "/Payment/error",
        params: { order_id, transaction_id, message },
      }),
    }),
    handlePaymentResult: builder.mutation<void, PaymentResultRequest>({
      query: (body) => ({
        url: "/Payment/result",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetPaymentSuccessQuery,
  useGetPaymentErrorQuery,
  useHandlePaymentResultMutation,
} = paymentApiSlice;
