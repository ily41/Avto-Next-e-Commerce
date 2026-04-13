import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://avtoo027-001-site1.ntempurl.com';
export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL + "/api/v1",
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),


    tagTypes: ["Product", "Brand", "Category", "ProductSpecification", "Banner", "User", "Filter", "PromoCode", "Favorite", "Cart", "Payment", "Wallet", "Order", "Statistics", "Settings"],
    // We leave endpoints empty here and inject them from other files
    endpoints: () => ({}),
})