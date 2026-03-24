import { api } from "../api";

export interface PaymentInitiateRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string;
  installmentOptionId?: string;
  walletAmountToUse?: number;
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
    initiatePayment: builder.mutation<{ redirectUrl?: string }, PaymentInitiateRequest>({
      query: (body) => ({
        url: "/Payment/initiate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"], // Empty the cart on successful payment initiation or depend on webhook
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
