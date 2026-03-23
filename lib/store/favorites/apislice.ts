import { api } from "../api";
import { Product } from "@/lib/api/types";

export interface FavoriteItem {
    id: string;
    userId: string;
    productId: string;
    product: Product;
    createdAt: string;
}

export interface FavoritesResponse {
    favorites: FavoriteItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export const favoritesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFavorites: builder.query<FavoritesResponse, { page?: number; pageSize?: number }>({
            query: ({ page = 1, pageSize = 20 }) => ({
                url: "/Favorites",
                params: { page, pageSize },
            }),
            providesTags: ["Favorite"],
        }),
        getFavoritesCount: builder.query<{ count: number }, void>({
            query: () => "/Favorites/count",
            providesTags: ["Favorite"],
        }),
        toggleFavorite: builder.mutation<void, string>({
            query: (productId) => ({
                url: `/Favorites/toggle/${productId}`,
                method: "POST",
            }),
            invalidatesTags: ["Favorite"],
        }),
        clearFavorites: builder.mutation<void, void>({
            query: () => ({
                url: "/Favorites/clear",
                method: "DELETE",
            }),
            invalidatesTags: ["Favorite"],
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useGetFavoritesCountQuery,
    useToggleFavoriteMutation,
    useClearFavoritesMutation,
} = favoritesApi;
