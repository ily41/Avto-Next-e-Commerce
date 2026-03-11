import { api } from "../api";

export type User = {
    id: string;
    email: string;
    role: number;
    firstName: string;
    lastName: string;
    roleName: string;
};

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string }, any>({
            query: (credentials) => ({
                url: "Auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        getMe: builder.query<User, void>({
            query: () => "Auth/me", // Assuming this exists based on your provided guard code
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "Auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi;
