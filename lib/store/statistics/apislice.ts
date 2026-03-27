import { api } from "../api";
import { DashboardStatistics } from "@/lib/api/types";

export const statisticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatistics: builder.query<DashboardStatistics, void>({
      query: () => "Statistics/dashboard",
      providesTags: ["Statistics"],
    }),
  }),
});

export const {
  useGetDashboardStatisticsQuery,
} = statisticsApi;
