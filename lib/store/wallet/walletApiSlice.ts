import { api } from "../api";

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

export interface Transaction {
  id: string;
  typeText: string;
  type: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  orderId: string;
}

export const walletApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query<Wallet, void>({
      query: () => "/Wallet",
      providesTags: ["Wallet"],
    }),
    getWalletTransactions: builder.query<Transaction[], void>({
      query: () => "/Wallet/transactions",
      providesTags: ["Wallet"],
    }),
  }),
});

export const { useGetWalletQuery, useGetWalletTransactionsQuery } = walletApiSlice;
