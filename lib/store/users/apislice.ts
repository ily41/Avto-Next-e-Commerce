import { api } from "../api";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: number;
    roleName: string;
    isActive: boolean;
    createdAt: string;
};

export type PaginatedResponse<T> = {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export type UserSearchParams = {
    searchTerm?: string;
    role?: number;
    isActive?: boolean;
    createdFrom?: string;
    createdTo?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
};

export type UserRole = {
    value: number;
    name: string;
};

export type UpdateUserRequest = {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: number;
    isActive: boolean;
};

export const usersApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        searchUsers: builder.query<PaginatedResponse<User>, UserSearchParams>({
            query: (params) => ({
                url: "/Admin/users/search",
                params,
            }),
            providesTags: ["User"],
        }),
        getUserRoles: builder.query<UserRole[], void>({
            query: () => "/Admin/users/roles",
            providesTags: ["User"],
        }),
        updateUser: builder.mutation<void, UpdateUserRequest>({
            query: ({ id, ...data }) => ({
                url: `/Admin/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        changeUserRole: builder.mutation<void, { id: string; role: number }>({
            query: ({ id, role }) => ({
                url: `/Admin/users/${id}/role`,
                method: "PUT",
                body: { role },
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/Admin/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useSearchUsersQuery,
    useGetUserRolesQuery,
    useUpdateUserMutation,
    useChangeUserRoleMutation,
    useDeleteUserMutation,
} = usersApiSlice;
