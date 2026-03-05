import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://evto027-001-site1.ktempurl.com/api/v1/",
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),


    tagTypes: ["Product", "Brand", "Category"],
    // We leave endpoints empty here and inject them from other files
    endpoints: () => ({}),
});