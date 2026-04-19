"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-tables";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2, Image as ImageIcon, Settings2 } from "lucide-react";
import Link from "next/link";
import * as z from "zod";
import { toast } from "sonner";
import { DynamicAddPopup, type FieldConfig } from "@/components/addEditElement/DynamicAddPopup";
import { DynamicEditPopup } from "@/components/addEditElement/DynamicEditPopup";
import { FormLabel } from "@/components/ui/form";
import {
    useGetBannersQuery,
    useCreateBannerWithImagesMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
    useDeleteBannerImageMutation,
    useUploadBannerImagesMutation,
    type Banner,
} from "@/lib/store/banners/apislice";

export default function BannersPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const { data: banners, isLoading: isFetchingBanners, error } = useGetBannersQuery();
    const [createBanner, { isLoading: isCreating }] = useCreateBannerWithImagesMutation();
    const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
    const [uploadBannerImages, { isLoading: isUploadingImages }] = useUploadBannerImagesMutation();
    const [deleteBanner] = useDeleteBannerMutation();
    const [deleteBannerImage, { isLoading: isDeletingImage }] = useDeleteBannerImageMutation();

    const bannerSchema = z.object({
        title: z.string().optional().nullable(),
        titleVisible: z.boolean().default(true),
        description: z.string().optional().nullable(),
        descriptionVisible: z.boolean().default(true),
        linkUrl: z.string().optional().nullable(),
        buttonText: z.string().optional().nullable(),
        buttonVisible: z.boolean().default(true),
        type: z.coerce.number().min(0).max(5),
        isActive: z.boolean().default(true),
        sortOrder: z.coerce.number().default(0),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
        imageFile: z.any().optional(),
        mobileImageFile: z.any().optional(),
    });

    const bannerAddFields: FieldConfig[] = [
        { name: "title", label: "Başlıq", type: "text", placeholder: "Banner Başlığı" },
        { name: "titleVisible", label: "Başlıq Görünsün", type: "switch" },
        { name: "description", label: "Təsvir", type: "textarea", placeholder: "Təsvir" },
        { name: "descriptionVisible", label: "Təsvir Görünsün", type: "switch" },
        { name: "linkUrl", label: "Link URL", type: "text" },
        { name: "buttonText", label: "Düymə Mətni", type: "text" },
        { name: "buttonVisible", label: "Düymə Görünsün", type: "switch" },
        {
            name: "type",
            label: "Bannerin Yerləşməsi",
            type: "select",
            placeholder: "Yer Seçin",
            options: [
                { label: "Ana Səhifə - Böyük Hero Banner (Tip 0)", value: "0" },
                { label: "Yeni Təqdim Olunmuşlar - Yan Banner (Tip 1)", value: "1" },
                { label: "Hero Altındakı Üçlü Bannerlər (Tip 2)", value: "2" },
                { label: "Orta İkili Bannerlər (Tip 3)", value: "3" },
                { label: "Tövsiyyə Olunanlar - Yan Banner (Tip 4)", value: "4" },
                { label: "Aşağı Kampaniya / Geniş Banner (Tip 5)", value: "5" },
            ],
        },
        { name: "sortOrder", label: "Sıralama", type: "number" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
        { name: "startDate", label: "Başlama Tarixi", type: "date" },
        { name: "endDate", label: "Bitmə Tarixi", type: "date" },
        { name: "imageFile", label: "Əsas Şəkil", type: "file" },
        { name: "mobileImageFile", label: "Mobil Şəkil", type: "file" },
    ];

    const bannerEditFields: FieldConfig[] = [
        { name: "title", label: "Başlıq", type: "text" },
        { name: "titleVisible", label: "Başlıq Görünsün", type: "switch" },
        { name: "description", label: "Təsvir", type: "textarea" },
        { name: "descriptionVisible", label: "Təsvir Görünsün", type: "switch" },
        { name: "linkUrl", label: "Link URL", type: "text" },
        { name: "buttonText", label: "Düymə Mətni", type: "text" },
        { name: "buttonVisible", label: "Düymə Görünsün", type: "switch" },
        {
            name: "type",
            label: "Bannerin Yerləşməsi",
            type: "select",
            options: [
                { label: "Ana Səhifə - Böyük Hero Banner (Tip 0)", value: "0" },
                { label: "Yeni Təqdim Olunmuşlar - Yan Banner (Tip 1)", value: "1" },
                { label: "Hero Altındakı Üçlü Bannerlər (Tip 2)", value: "2" },
                { label: "Orta İkili Bannerlər (Tip 3)", value: "3" },
                { label: "Tövsiyyə Olunanlar - Yan Banner (Tip 4)", value: "4" },
                { label: "Aşağı Kampaniya / Geniş Banner (Tip 5)", value: "5" },
            ],
        },
        { name: "sortOrder", label: "Sıralama", type: "number" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
        { name: "startDate", label: "Başlama Tarixi", type: "date" },
        { name: "endDate", label: "Bitmə Tarixi", type: "date" },
        {
            name: "existingMainImage",
            label: "Main Image",
            type: "custom",
            renderCustom: () => {
                if (!editingBanner?.imageUrl) return null;
                return (
                    <div className="space-y-4">
                        <FormLabel className="text-sm font-bold flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Mövcud Əsas Şəkil
                        </FormLabel>
                        <div className="relative aspect-video w-full max-w-xs border-2 border-border/50 rounded-2xl overflow-hidden shadow-sm group">
                            <img
                                src={`https://avtoo027-001-site1.ntempurl.com${editingBanner.imageUrl}`}
                                alt="Main"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={async () => {
                                        if (confirm("Əsas şəkli silmək istədiyinizə əminsiniz?")) {
                                            try {
                                                await deleteBannerImage({ id: editingBanner.id, imageType: "main" }).unwrap();
                                                toast.success("Əsas şəkil silindi!");
                                                setEditingBanner((prev) => prev ? { ...prev, imageUrl: null } : null);
                                            } catch {
                                                toast.error("Silinmə alınmadı");
                                            }
                                        }
                                    }}
                                    disabled={isDeletingImage}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            name: "existingMobileImage",
            label: "Mobile Image",
            type: "custom",
            renderCustom: () => {
                if (!editingBanner?.mobileImageUrl) return null;
                return (
                    <div className="space-y-4">
                        <FormLabel className="text-sm font-bold flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Mövcud Mobil Şəkil
                        </FormLabel>
                        <div className="relative aspect-square w-full max-w-[150px] border-2 border-border/50 rounded-2xl overflow-hidden shadow-sm group">
                            <img
                                src={`https://avtoo027-001-site1.ntempurl.com${editingBanner.mobileImageUrl}`}
                                alt="Mobile"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={async () => {
                                        if (confirm("Mobil şəkli silmək istədiyinizə əminsiniz?")) {
                                            try {
                                                await deleteBannerImage({ id: editingBanner.id, imageType: "mobile" }).unwrap();
                                                toast.success("Mobil şəkil silindi!");
                                                setEditingBanner((prev) => prev ? { ...prev, mobileImageUrl: null } : null);
                                            } catch {
                                                toast.error("Silinmə alınmadı");
                                            }
                                        }
                                    }}
                                    disabled={isDeletingImage}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        { name: "imageFile", label: "Yeni Əsas Şəkil Əlavə Et", type: "file" },
        { name: "mobileImageFile", label: "Yeni Mobil Şəkil Əlavə Et", type: "file" },
    ];

    const columns = useMemo<ColumnDef<Banner>[]>(() => [
        {
            id: "media",
            header: "Media",
            accessorFn: (row) => row.imageUrl,
            cell: ({ row }) => {
                const url = row.original.imageUrl;
                return url ? (
                    <div className="h-10 w-20 overflow-hidden rounded-md border">
                        <img src={`https://avtoo027-001-site1.ntempurl.com${url}`} alt="Banner" className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <div className="flex h-10 w-20 items-center justify-center rounded-md border bg-muted">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            id: "title",
            accessorKey: "title",
            header: "Başlıq",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.title || "Başlıqsız"}</span>
            ),
        },
        {
            id: "type",
            accessorKey: "type",
            header: "Növ",
            cell: ({ row }) => row.original.type,
        },
        {
            id: "sortOrder",
            accessorKey: "sortOrder",
            header: "Sıralama",
        },
        {
            id: "isActive",
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.original.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {row.original.isActive ? "Aktiv" : "Qeyri-aktiv"}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Fəaliyyətlər",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/banners/${row.original.id}`}>
                            <Settings2 className="h-4 w-4 mr-2" />
                            Dizayni İdarə Et
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingBanner(row.original)}
                    >
                        Düzəlt
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            if (confirm("Bu banneri silmək istədiyinizə əminsiniz?")) {
                                try {
                                    await deleteBanner(row.original.id).unwrap();
                                    toast.success("Banner silindi!");
                                } catch (err) {
                                    toast.error("Banner silinə bilmədi");
                                }
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [deleteBanner]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-500 font-bold">Bannerlər yüklənilə bilmədi.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Bannerlər</h1>
                <DynamicAddPopup
                    title="Banner Əlavə Et"
                    triggerText="Banner Əlavə Et"
                    schema={bannerSchema}
                    defaultValues={{
                        title: "", type: 0, sortOrder: 0, isActive: true, titleVisible: true, descriptionVisible: true, buttonVisible: true
                    }}
                    fields={bannerAddFields}
                    isLoading={isCreating}
                    onSubmit={async (values) => {
                        const formData = new FormData();
                        const dto = { ...values };
                        // Need to remove explicit files to serialize cleanly
                        delete dto.imageFile;
                        delete dto.mobileImageFile;

                        // Make sure string conversions are solid
                        dto.type = parseInt(dto.type?.toString() || "0", 10);
                        dto.sortOrder = parseInt(dto.sortOrder?.toString() || "0", 10);

                        formData.append("bannerData", JSON.stringify(dto));
                        if (values.imageFile instanceof File) formData.append("imageFile", values.imageFile);
                        if (values.mobileImageFile instanceof File) formData.append("mobileImageFile", values.mobileImageFile);

                        await createBanner(formData).unwrap();
                        toast.success("Banner yaradıldı!");
                    }}
                />
            </div>

            <DataTable
                columns={columns}
                data={banners || []}
                // Admin table w/o filters specified
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={setPagination}
            />

            {editingBanner && (
                <DynamicEditPopup
                    open={!!editingBanner}
                    onOpenChange={(open) => !open && setEditingBanner(null)}
                    title={`Banneri Düzəlt: ${editingBanner.title || "Başlıqsız"}`}
                    schema={bannerSchema}
                    defaultValues={{
                        ...editingBanner,
                        type: editingBanner.type?.toString(), // Handle select parsing
                        imageFile: undefined,
                        mobileImageFile: undefined,
                    }}
                    fields={bannerEditFields}
                    isLoading={isUpdating || isUploadingImages}
                    onSubmit={async (values) => {
                        const dataToUpdate = { ...editingBanner, ...values };
                        delete (dataToUpdate as any).imageFile;
                        delete (dataToUpdate as any).mobileImageFile;

                        dataToUpdate.type = parseInt(dataToUpdate.type?.toString() || "0", 10);
                        dataToUpdate.sortOrder = parseInt(dataToUpdate.sortOrder?.toString() || "0", 10);

                        const updatePromise = updateBanner({ id: editingBanner.id, data: dataToUpdate as any }).unwrap();

                        const uploads = [];
                        if (values.imageFile instanceof File || values.mobileImageFile instanceof File) {
                            uploads.push(uploadBannerImages({
                                id: editingBanner.id,
                                imageFile: values.imageFile instanceof File ? values.imageFile : undefined,
                                mobileImageFile: values.mobileImageFile instanceof File ? values.mobileImageFile : undefined
                            }).unwrap());
                        }

                        await Promise.all([updatePromise, ...uploads]);
                        toast.success("Banner yenilendi!");
                    }}
                />
            )}
        </div>
    );
}