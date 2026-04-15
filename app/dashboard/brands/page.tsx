"use client"

import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { useDeleteBrandMutation, useSearchBrandsAdminQuery, useCreateBrandWithImageMutation, useEditBrandMutation, type Brand } from "@/lib/store/brands/apislice";
import React from "react";
import { PaginationState } from "@tanstack/react-table";
import { DynamicAddPopup, type FieldConfig } from "@/components/addEditElement/DynamicAddPopup";
import { DynamicEditPopup } from "@/components/addEditElement/DynamicEditPopup";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import * as z from "zod";



import { toast } from "sonner";

export default function Page() {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");

    const brandSchema = z.object({
        name: z.string().min(2, "Name is required"),
        sortOrder: z.number().min(1, "Sort order must be at least 1"),
        imageFile: z.instanceof(File, { message: "Image is required" }).nullable().optional(),
        isActive: z.boolean().default(true),
    });

    const brandFields: FieldConfig[] = [
        { name: "name", label: "Brendin Adı", type: "text", placeholder: "məsələn: Nike" },
        { name: "sortOrder", label: "Sıralama", type: "number" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
        { name: "imageFile", label: "Brend Loqosu (İxtiyari)", type: "file" }
    ];

    const { data, isLoading, error } = useSearchBrandsAdminQuery({
        q: searchQuery,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize
    });
    const [createBrand, { isLoading: isCreating }] = useCreateBrandWithImageMutation();
    const [updateBrand, { isLoading: isUpdating }] = useEditBrandMutation();
    const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

    const brandColumns = React.useMemo(() => createColumns<Brand>([
        {
            key: "logoUrl",
            label: "Logo",
            render: (value) => (
                <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded border bg-slate-50">
                    {value ? (
                        <img
                            src={`https://avtoo027-001-site1.ntempurl.com${value}`}
                            alt="Logo"
                            className="object-contain h-full w-full"
                        />
                    ) : (
                        <span className="text-[10px] text-gray-400">No Img</span>
                    )}
                </div>
            )
        },
        { key: "name", label: "Brend", sortable: true },
        { key: "slug", label: "Slug", sortable: true },
        {
            key: "isActive",
            label: "Status",
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {value ? "Aktiv" : "Qeyri-aktiv"}
                </span>
            )
        },
    ],
        async (item) => {
            try {
                await deleteBrand(item.id).unwrap();
                toast.success(`"${item.name}" brendi uğurla silindi.`);
            } catch (err) {
                toast.error("Brend silinə bilmədi. Yenidən cəhd edin.");
            }
        },
        (item) => {
            setEditingBrand(item);
        }), [deleteBrand]);

    const handleDelete = (id: string) => {
        deleteBrand(id);
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl">Brendlər</h1>
                <div className="flex flex-1 items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground animate-pulse">Brendlər yüklənir...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl">Brendlər</h1>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                    <p className="font-semibold">Brendlər Yüklənilə Bilmədi</p>
                    <p className="text-sm opacity-90">Serverdən məlumat alınması mümkün olmadı. Birlaşmanızı yoxlayın və ya bir az sonra yenidən cəhd edin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between">
                <h1 className="text-base md:text-xl lg:text-2xl">Brendlər</h1>
                <DynamicAddPopup
                    title="Brend Əlavə Et"
                    triggerText="Brend Əlavə Et"
                    schema={brandSchema}
                    defaultValues={{ name: "", sortOrder: 1, imageFile: null, isActive: true }}
                    fields={brandFields}
                    isLoading={isCreating}
                    onSubmit={async (values) => {
                        await createBrand(values).unwrap();
                        toast.success("Brend əlavə edildi!");
                    }}
                />
            </div>
            <DataTable
                columns={brandColumns}
                data={data?.items || []}
                filterColumn="name"
                filterMode="server"
                onFilterChange={(val) => {
                    setSearchQuery(val);
                    setPagination(prev => ({ ...prev, pageIndex: 0 }));
                }}
                pagination={pagination}
                onPaginationChange={setPagination}
                pageCount={data?.totalPages || 0}
                manualPagination
            />
            <DynamicEditPopup
                open={!!editingBrand}
                onOpenChange={(open) => !open && setEditingBrand(null)}
                title={`Brendi Düzəlt: ${editingBrand?.name}`}
                schema={brandSchema}
                defaultValues={{
                    ...editingBrand,
                    imageFile: undefined
                }}
                initialPreviews={{
                    imageFile: editingBrand?.logoUrl ? `https://avtoo027-001-site1.ntempurl.com${editingBrand.logoUrl}` : ""
                }}
                fields={brandFields}
                isLoading={isUpdating}
                onSubmit={async (values) => {
                    if (!editingBrand) return;
                    await updateBrand({ ...values, id: editingBrand.id }).unwrap();
                    toast.success("Brend yenilendi!");
                }}
            />
        </div>
    )
}