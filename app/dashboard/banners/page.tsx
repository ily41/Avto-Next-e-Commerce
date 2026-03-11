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
        type: z.coerce.number().min(0).max(3),
        isActive: z.boolean().default(true),
        sortOrder: z.coerce.number().default(0),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
        imageFile: z.any().optional(),
        mobileImageFile: z.any().optional(),
    });

    const bannerAddFields: FieldConfig[] = [
        { name: "title", label: "Title", type: "text", placeholder: "Banner Title" },
        { name: "titleVisible", label: "Title Visible", type: "switch" },
        { name: "description", label: "Description", type: "textarea", placeholder: "Description" },
        { name: "descriptionVisible", label: "Description Visible", type: "switch" },
        { name: "linkUrl", label: "Link URL", type: "text" },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonVisible", label: "Button Visible", type: "switch" },
        {
            name: "type",
            label: "Type",
            type: "select",
            placeholder: "Select Type",
            options: [
                { label: "Type 0", value: "0" },
                { label: "Type 1", value: "1" },
                { label: "Type 2", value: "2" },
                { label: "Type 3", value: "3" },
            ],
        },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "isActive", label: "Is Active", type: "switch" },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
        { name: "imageFile", label: "Main Image", type: "file" },
        { name: "mobileImageFile", label: "Mobile Image", type: "file" },
    ];

    const bannerEditFields: FieldConfig[] = [
        { name: "title", label: "Title", type: "text" },
        { name: "titleVisible", label: "Title Visible", type: "switch" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "descriptionVisible", label: "Description Visible", type: "switch" },
        { name: "linkUrl", label: "Link URL", type: "text" },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonVisible", label: "Button Visible", type: "switch" },
        {
            name: "type",
            label: "Type",
            type: "select",
            options: [
                { label: "Type 0", value: "0" },
                { label: "Type 1", value: "1" },
                { label: "Type 2", value: "2" },
                { label: "Type 3", value: "3" },
            ],
        },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "isActive", label: "Is Active", type: "switch" },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
        {
            name: "existingMainImage",
            label: "Main Image",
            type: "custom",
            renderCustom: () => {
                if (!editingBanner?.imageUrl) return null;
                return (
                    <div className="space-y-4">
                        <FormLabel className="text-sm font-bold flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Current Main Image
                        </FormLabel>
                        <div className="relative aspect-video w-full max-w-xs border-2 border-border/50 rounded-2xl overflow-hidden shadow-sm group">
                            <img
                                src={`https://evto027-001-site1.ktempurl.com${editingBanner.imageUrl}`}
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
                                        if (confirm("Delete main image?")) {
                                            try {
                                                await deleteBannerImage({ id: editingBanner.id, imageType: "main" }).unwrap();
                                                toast.success("Main image deleted!");
                                                setEditingBanner((prev) => prev ? { ...prev, imageUrl: null } : null);
                                            } catch {
                                                toast.error("Failed to delete");
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
                            <ImageIcon className="h-4 w-4" /> Current Mobile Image
                        </FormLabel>
                        <div className="relative aspect-square w-full max-w-[150px] border-2 border-border/50 rounded-2xl overflow-hidden shadow-sm group">
                            <img
                                src={`https://evto027-001-site1.ktempurl.com${editingBanner.mobileImageUrl}`}
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
                                        if (confirm("Delete mobile image?")) {
                                            try {
                                                await deleteBannerImage({ id: editingBanner.id, imageType: "mobile" }).unwrap();
                                                toast.success("Mobile image deleted!");
                                                setEditingBanner((prev) => prev ? { ...prev, mobileImageUrl: null } : null);
                                            } catch {
                                                toast.error("Failed to delete");
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
                        <img src={`https://evto027-001-site1.ktempurl.com${url}`} alt="Banner" className="h-full w-full object-cover" />
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
            header: "Title",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.title || "Untitled"}</span>
            ),
        },
        {
            id: "type",
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => row.original.type,
        },
        {
            id: "sortOrder",
            accessorKey: "sortOrder",
            header: "Sort Order",
        },
        {
            id: "isActive",
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.original.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/banners/${row.original.id}`}>
                            <Settings2 className="h-4 w-4 mr-2" />
                            Manage Design
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingBanner(row.original)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            if (confirm("Delete this banner?")) {
                                try {
                                    await deleteBanner(row.original.id).unwrap();
                                    toast.success("Banner deleted!");
                                } catch (err) {
                                    toast.error("Failed to delete banner");
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
                <p className="text-red-500 font-bold">Failed to load banners.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Banners</h1>
                <DynamicAddPopup
                    title="Add Banner"
                    triggerText="Add Banner"
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
                        toast.success("Banner created!");
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
                    title={`Edit Banner: ${editingBanner.title || "Untitled"}`}
                    schema={bannerSchema}
                    defaultValues={{
                        ...editingBanner,
                        type: editingBanner.type?.toString(), // Handle select parsing
                        imageFile: undefined,
                        mobileImageFile: undefined,
                    }}
                    fields={bannerEditFields}
                    isLoading={isUpdating}
                    onSubmit={async (values) => {
                        const dataToUpdate = { ...editingBanner, ...values };
                        delete (dataToUpdate as any).imageFile;
                        delete (dataToUpdate as any).mobileImageFile;

                        dataToUpdate.type = parseInt(dataToUpdate.type?.toString() || "0", 10);
                        dataToUpdate.sortOrder = parseInt(dataToUpdate.sortOrder?.toString() || "0", 10);

                        await updateBanner({ id: editingBanner.id, data: dataToUpdate as any }).unwrap();
                        toast.success("Banner updated!");
                    }}
                />
            )}
        </div>
    );
}