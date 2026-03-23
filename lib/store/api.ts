import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://evto027-001-site1.ktempurl.com';
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


    tagTypes: ["Product", "Brand", "Category", "ProductSpecification", "Banner", "User", "Filter", "PromoCode", "Favorite"],
    // We leave endpoints empty here and inject them from other files
    endpoints: () => ({}),
});