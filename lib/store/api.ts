// store/products/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://evto027-001-site1.ktempurl.com/api/v1/",
        // store/products/api.ts
        prepareHeaders: (headers) => {
            // Trim this down to a SINGLE valid JWT
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJkODUzNzY3ZC03OTZkLTRkODQtOGJlZi00NmZlYmE2MmUzMDEiLCJlbWFpbCI6ImFkbWluQGd1bmF5YmVhdXR5LmF6IiwidW5pcXVlX25hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6IkFkbWluIiwiRmlyc3ROYW1lIjoiQWRtaW4iLCJMYXN0TmFtZSI6IlVzZXIiLCJJc0FjdGl2ZSI6IlRydWUiLCJuYmYiOjE3NzI2NjE1OTAsImV4cCI6MTc3MjY2NTE5MCwiaWF0IjoxNzcyNjYxNTkwLCJpc3MiOiJndW5heWJlYXV0eUFQSSIsImF1ZCI6Imd1bmF5YmVhdXR5Q2xpZW50cyJ9.eyrGD2VU1iPxBhbc_TL_o4kIn8eOTnD6cDSbYphxjuY"
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),


    tagTypes: ["Product", "Brand"],
    // We leave endpoints empty here and inject them from other files
    endpoints: () => ({}),
});