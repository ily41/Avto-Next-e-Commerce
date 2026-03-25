import { api } from "../api";

export type FilterOption = {
    id: string;
    filterId: string;
    value: string;
    displayName: string;
    color: string | null;
    iconUrl: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt?: string;
};

export type Filter = {
    id: string;
    name: string;
    slug: string;
    type: number;
    typeName: string;
    isActive: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
    options: FilterOption[];
};

export type CreateFilterRequest = {
    name: string;
    type: number;
    isActive: boolean;
    sortOrder: number;
    options: Omit<FilterOption, 'id' | 'filterId' | 'createdAt'>[];
};

export type UpdateFilterRequest = {
    name: string;
    type: number;
    isActive: boolean;
    sortOrder: number;
};

export type FilterOptionRequest = {
    value: string;
    displayName: string;
    color?: string | null;
    iconUrl?: string | null;
    isActive: boolean;
    sortOrder: number;
};

export type FilterSearchParams = {
    searchTerm?: string;
    type?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
};

export type PaginatedFilters = {
    filters: Filter[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export const filtersApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getFilters: builder.query<Filter[], void>({
            query: () => "Products/filters",
            providesTags: ["Filter"],
        }),
        getFiltersPaginated: builder.query<PaginatedFilters, FilterSearchParams>({
            query: (params) => ({
                url: "/Admin/filters/search",
                params,
            }),
            providesTags: ["Filter"],
        }),
        getFilterById: builder.query<Filter, string>({
            query: (id) => `/Admin/filters/${id}`,
            providesTags: (result, error, id) => [{ type: "Filter", id }],
        }),
        createFilter: builder.mutation<Filter, CreateFilterRequest>({
            query: (body) => ({
                url: "/Admin/filters",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Filter"],
        }),
        updateFilter: builder.mutation<void, { id: string; data: UpdateFilterRequest }>({
            query: ({ id, data }) => ({
                url: `/Admin/filters/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Filter"],
        }),
        deleteFilter: builder.mutation<void, string>({
            query: (id) => ({
                url: `/Admin/filters/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Filter"],
        }),
        createFilterOption: builder.mutation<FilterOption, { filterId: string; data: FilterOptionRequest }>({
            query: ({ filterId, data }) => ({
                url: `/Admin/filters/${filterId}/options`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Filter"],
        }),
        updateFilterOption: builder.mutation<void, { filterId: string; optionId: string; data: FilterOptionRequest }>({
            query: ({ filterId, optionId, data }) => ({
                url: `/Admin/filters/${filterId}/options/${optionId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Filter"],
        }),
        deleteFilterOption: builder.mutation<void, { filterId: string; optionId: string }>({
            query: ({ filterId, optionId }) => ({
                url: `/Admin/filters/${filterId}/options/${optionId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Filter"],
        }),
    }),
});

export const {
    useGetFiltersQuery,
    useGetFiltersPaginatedQuery,
    useGetFilterByIdQuery,
    useCreateFilterMutation,
    useUpdateFilterMutation,
    useDeleteFilterMutation,
    useCreateFilterOptionMutation,
    useUpdateFilterOptionMutation,
    useDeleteFilterOptionMutation,
} = filtersApiSlice;
