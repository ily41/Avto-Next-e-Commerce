import { api } from "../api";

export type Banner = {
    id: string;
    title: string | null;
    titleVisible: boolean;
    description: string | null;
    descriptionVisible: boolean;
    imageUrl: string | null;
    mobileImageUrl: string | null;
    linkUrl: string | null;
    buttonText: string | null;
    buttonVisible: boolean;
    type: number;
    typeName: string;
    isActive: boolean;
    sortOrder: number;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
    isCurrentlyActive: boolean;
    titlePositionX?: number;
    titlePositionY?: number;
    titleFontSize?: number;
    titleColor?: string | null;
    titleAlign?: string | null;
    descriptionPositionX?: number;
    descriptionPositionY?: number;
    descriptionFontSize?: number;
    descriptionColor?: string | null;
    buttonPositionX?: number;
    buttonPositionY?: number;
    buttonColor?: string | null;
    buttonTextColor?: string | null;
    buttonBorderRadius?: number;
    buttonPaddingX?: number;
    buttonPaddingY?: number;
    buttonFontSize?: number;
};

export const bannersApiSlice = api.enhanceEndpoints({ addTagTypes: ['Banner'] }).injectEndpoints({
    endpoints: (builder) => ({
        getBanners: builder.query<Banner[], { type?: number } | void>({
            query: (params) => {
                let url = '/Admin/banners';
                if (params && params.type !== undefined) {
                    url += `?type=${params.type}`;
                }
                return url;
            },
            providesTags: ['Banner'],
        }),
        getBannerById: builder.query<Banner, string>({
            query: (id) => `/Admin/banners/${id}`,
            providesTags: (result, error, id) => [{ type: 'Banner', id }],
        }),
        createBannerWithImages: builder.mutation<Banner, FormData>({
            query: (formData) => ({
                url: '/Admin/banners/with-images',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Banner'],
        }),
        updateBanner: builder.mutation<Banner, { id: string; data: Partial<Banner> }>({
            query: ({ id, data }) => ({
                url: `/Admin/banners/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Banner'],
        }),
        deleteBanner: builder.mutation<void, string>({
            query: (id) => ({
                url: `/Admin/banners/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Banner'],
        }),
        deleteBannerImage: builder.mutation<void, { id: string; imageType: string }>({
            query: ({ id, imageType }) => ({
                url: `/Admin/banners/${id}/delete-image?imageType=${imageType}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Banner'],
        }),
        uploadBannerImages: builder.mutation<void, { id: string; imageFile?: File; mobileImageFile?: File }>({
            query: ({ id, imageFile, mobileImageFile }) => {
                const formData = new FormData();
                if (imageFile) formData.append("imageFile", imageFile);
                if (mobileImageFile) formData.append("mobileImageFile", mobileImageFile);
                return {
                    url: `/Admin/banners/${id}/upload-image`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { id }) => ['Banner', { type: 'Banner' as const, id }],
        }),
    }),
});

export const {
    useGetBannersQuery,
    useGetBannerByIdQuery,
    useCreateBannerWithImagesMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
    useDeleteBannerImageMutation,
    useUploadBannerImagesMutation,
} = bannersApiSlice;
