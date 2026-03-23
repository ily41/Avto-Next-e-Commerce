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
        register: builder.mutation<void, any>({
            query: (body) => ({
                url: "Auth/register",
                method: "POST",
                body,
            }),
        }),
        changePassword: builder.mutation<void, any>({
            query: (body) => ({
                url: "Auth/change-password",
                method: "POST",
                body,
            }),
        }),
        forgotPassword: builder.mutation<void, any>({
            query: (body) => ({
                url: "Auth/forgot-password",
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation<void, any>({
            query: (body) => ({
                url: "Auth/reset-password",
                method: "POST",
                body,
            }),
        }),
        getMe: builder.query<User, void>({
            query: () => "Auth/me",
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "Auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGetMeQuery,
    useLogoutMutation
} = authApi;
