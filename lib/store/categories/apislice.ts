import { api } from "../api";

export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    sortOrder: number;
    parentCategoryId: string | null;
    parentCategoryName?: string | null;
    subCategories?: Category[];
    createdAt?: string;
}

export const categoryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => "Categories/root",
            providesTags: ["Category"],
        }),

        createCategory: builder.mutation<Category, {
            name: string;
            description: string;
            imageUrl?: string;
            sortOrder: number;
            parentCategoryId?: string | null;
        }>({
            query: (category) => ({
                url: "Categories",
                method: "POST",
                body: category,
            }),
            invalidatesTags: ["Category"],
        }),

        createCategoryWithImage: builder.mutation<Category, {
            name: string;
            description: string;
            sortOrder: number;
            parentCategoryId?: string | null;
            imageFile: File;
        }>({
            query: ({ name, description, sortOrder, parentCategoryId, imageFile }) => {
                const formData = new FormData();
                const categoryData = JSON.stringify({
                    name,
                    description,
                    sortOrder,
                    parentCategoryId: parentCategoryId || null
                });
                formData.append("categoryData", categoryData);
                formData.append("imageFile", imageFile);

                return {
                    url: "Categories/with-image",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Category"],
        }),

        updateCategory: builder.mutation<Category, {
            id: string;
            name: string;
            slug: string;
            description: string;
            imageUrl?: string;
            isActive: boolean;
            sortOrder: number;
            parentCategoryId?: string | null;
        }>({
            query: ({ id, ...body }) => ({
                url: `Categories/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Category"],
        }),

        updateCategoryWithImage: builder.mutation<Category, {
            id: string;
            name: string;
            description: string;
            sortOrder: number;
            isActive: boolean;
            parentCategoryId?: string | null;
            imageFile?: File | null;
        }>({
            query: ({ id, name, description, sortOrder, isActive, parentCategoryId, imageFile }) => {
                const formData = new FormData();
                const categoryData = JSON.stringify({
                    name,
                    description,
                    sortOrder,
                    isActive,
                    parentCategoryId: parentCategoryId || null
                });
                formData.append("categoryData", categoryData);
                if (imageFile instanceof File) {
                    formData.append("imageFile", imageFile);
                }

                return {
                    url: `Categories/${id}/with-image`,
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: ["Category"],
        }),

        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `Categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

// Hooks are generated based on the endpoints
export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useCreateCategoryWithImageMutation,
    useUpdateCategoryMutation,
    useUpdateCategoryWithImageMutation,
    useDeleteCategoryMutation
} = categoryApi;