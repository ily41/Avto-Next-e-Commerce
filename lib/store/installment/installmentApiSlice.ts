import { api } from "../api";
import { 
  InstallmentOption, 
  InstallmentCalculation, 
  InstallmentConfiguration 
} from "@/lib/api/types";

export const installmentApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Public Endpoints
    getInstallmentOptions: builder.query<InstallmentOption[], { amount: number }>({
      query: (params) => ({
        url: "Installment/options",
        params
      }),
      providesTags: ["InstallmentOptions"],
    }),

    calculateInstallment: builder.query<InstallmentCalculation, { amount: number; optionId: string }>({
      query: (params) => ({
        url: "Installment/calculate",
        params
      }),
    }),

    getInstallmentConfiguration: builder.query<InstallmentConfiguration, void>({
      query: () => "Installment/configuration",
      providesTags: ["Settings"],
    }),

    updateInstallmentConfiguration: builder.mutation<InstallmentConfiguration, { isEnabled: boolean; minimumAmount: number }>({
      query: (body) => ({
        url: "Installment/configuration",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

    // Admin Endpoints
    getAdminInstallmentOptions: builder.query<InstallmentOption[], void>({
      query: () => "Installment/admin/options",
      providesTags: ["InstallmentOptions"],
    }),

    createInstallmentOption: builder.mutation<InstallmentOption, Partial<InstallmentOption>>({
      query: (body) => ({
        url: "Installment/admin/options",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InstallmentOptions"],
    }),

    updateInstallmentOption: builder.mutation<InstallmentOption, { id: string; body: Partial<InstallmentOption> }>({
      query: ({ id, body }) => ({
        url: `Installment/admin/options/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["InstallmentOptions"],
    }),

    deleteInstallmentOption: builder.mutation<void, string>({
      query: (id) => ({
        url: `Installment/admin/options/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InstallmentOptions"],
    }),
  }),
});

export const {
  useGetInstallmentOptionsQuery,
  useCalculateInstallmentQuery,
  useGetInstallmentConfigurationQuery,
  useUpdateInstallmentConfigurationMutation,
  useGetAdminInstallmentOptionsQuery,
  useCreateInstallmentOptionMutation,
  useUpdateInstallmentOptionMutation,
  useDeleteInstallmentOptionMutation,
} = installmentApi;
