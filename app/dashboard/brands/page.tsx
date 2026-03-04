"use client"

import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { useDeleteBrandMutation, useGetBrandsQuery } from "@/lib/store/brands/apislice";
import React from "react";
import { PaginationState } from "@tanstack/react-table";
import { AddBrandPopup } from "@/components/addEditElement/brand/addBrand";
import { EditBrandPopup } from "@/components/addEditElement/brand/editBrand";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export type Brand = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    productCount: number;
}



import { toast } from "sonner";

export default function Page() {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null);

    const { data, isLoading, error } = useGetBrandsQuery(pagination);
    const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

    const brandColumns = React.useMemo(() => createColumns<Brand>([
        {
            key: "logoUrl",
            label: "Logo",
            render: (value) => (
                <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded border bg-slate-50">
                    {value ? (
                        <img
                            src={`https://evto027-001-site1.ktempurl.com${value}`}
                            alt="Logo"
                            className="object-contain h-full w-full"
                        />
                    ) : (
                        <span className="text-[10px] text-gray-400">No Img</span>
                    )}
                </div>
            )
        },
        { key: "name", label: "Brand", sortable: true },
        { key: "slug", label: "Slug", sortable: true },
        {
            key: "isActive",
            label: "Status",
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {value ? "Active" : "Inactive"}
                </span>
            )
        },
    ],
        async (item) => {
            try {
                await deleteBrand(item.id).unwrap();
                toast.success(`Brand "${item.name}" deleted successfully.`);
            } catch (err) {
                toast.error("Failed to delete the brand. Please try again.");
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
                <h1 className="text-base md:text-xl lg:text-2xl">Brands</h1>
                <div className="flex flex-1 items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground animate-pulse">Loading brands...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl">Brands</h1>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                    <p className="font-semibold">Error Loading Brands</p>
                    <p className="text-sm opacity-90">Failed to fetch data from the server. Please check your connection or try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between">
                <h1 className="text-base md:text-xl lg:text-2xl">Brands</h1>
                <AddBrandPopup />
            </div>
            <DataTable
                columns={brandColumns}
                data={data?.items || []}
                filterColumn="name"
                pagination={pagination}
                onPaginationChange={setPagination}
                pageCount={data?.totalCount || 0}
                manualPagination
            />
            <EditBrandPopup
                brand={editingBrand}
                onOpenChange={(open) => !open && setEditingBrand(null)}
            />
        </div>
    )
}