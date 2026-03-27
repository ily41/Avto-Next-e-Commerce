import { api } from "../api";
import { 
  CartMinimumAmountSetting, 
  LoyaltySettings, 
  InstallmentConfiguration 
} from "@/lib/api/types";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCartMinimumAmount: builder.query<CartMinimumAmountSetting, void>({
      query: () => "Settings/cart-minimum-amount",
      providesTags: ["Settings"],
    }),
    updateCartMinimumAmount: builder.mutation<CartMinimumAmountSetting, CartMinimumAmountSetting>({
      query: (body) => ({
        url: "Settings/cart-minimum-amount",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getLoyaltySettings: builder.query<LoyaltySettings, void>({
      query: () => "Loyalty/settings",
      providesTags: ["Settings"],
    }),
    updateLoyaltySettings: builder.mutation<LoyaltySettings, LoyaltySettings>({
      query: (body) => ({
        url: "Loyalty/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getInstallmentConfiguration: builder.query<InstallmentConfiguration, void>({
      query: () => "Installment/configuration",
      providesTags: ["Settings"],
    }),
    updateInstallmentConfiguration: builder.mutation<InstallmentConfiguration, InstallmentConfiguration>({
      query: (body) => ({
        url: "Installment/configuration",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetCartMinimumAmountQuery,
  useUpdateCartMinimumAmountMutation,
  useGetLoyaltySettingsQuery,
  useUpdateLoyaltySettingsMutation,
  useGetInstallmentConfigurationQuery,
  useUpdateInstallmentConfigurationMutation,
} = settingsApi;
