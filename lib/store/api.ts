import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://avtoo027-001-site1.ntempurl.com';
export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL + "/api/v1",
    prepareHeaders: (headers) => {
        const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithLoggedOut = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // Clear auth data if unauthorized
        Cookies.remove("token", { path: '/' });
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth-change"));
    }
    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithLoggedOut,


    tagTypes: ["Product", "Brand", "Category", "ProductSpecification", "Banner", "User", "Filter", "PromoCode", "Favorite", "Cart", "Payment", "Wallet", "Order", "Statistics", "Settings", "InstallmentOptions", "CreditRequests", "ExpargoRules"],
    // We leave endpoints empty here and inject them from other files
    endpoints: () => ({}),
})