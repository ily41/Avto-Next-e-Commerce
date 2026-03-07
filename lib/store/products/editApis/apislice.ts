import { api } from "../../api";

export const editProductApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteProductImage: builder.mutation<void, string>({
            query: (id) => ({
                url: `Products/images/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),

        uploadPrimaryImage: builder.mutation<void, { id: string; imageFile: File }>({
            query: ({ id, imageFile }) => {
                const formData = new FormData();
                formData.append("imageFile", imageFile);
                return {
                    url: `Products/${id}/upload-image`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
        }),

        uploadDetailImages: builder.mutation<void, { id: string; imageFiles: File[] }>({
            query: ({ id, imageFiles }) => {
                const formData = new FormData();
                imageFiles.forEach((file) => {
                    formData.append("imageFiles", file);
                });
                return {
                    url: `Products/${id}/upload-images`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
        }),
    }),
});

export const {
    useDeleteProductImageMutation,
    useUploadPrimaryImageMutation,
    useUploadDetailImagesMutation,
} = editProductApi;
