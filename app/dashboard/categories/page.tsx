"use client"

import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { useMemo, useState } from "react";
import { useGetCategoriesQuery, useDeleteCategoryMutation, type Category } from "@/lib/store/categories/apislice";
import { toast } from "sonner";
import { AddCategoryPopup } from "@/components/addEditElement/category/addCategory";
import { EditCategoryPopup } from "@/components/addEditElement/category/editCategory";

export default function Page() {
    const { data: categories, isLoading, error } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const categoryColumns = useMemo(() => createColumns<Category>([
        {
            key: "imageUrl",
            label: "Image",
            render: (value) => (
                <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded border bg-slate-50">
                    {value ? (
                        <img
                            src={`https://evto027-001-site1.ktempurl.com${value}`}
                            alt="Category"
                            className="object-contain h-full w-full"
                        />
                    ) : (
                        <span className="text-[10px] text-gray-400">No Img</span>
                    )}
                </div>
            )
        },
        {
            key: "name",
            label: "Category Name",
            sortable: true,
            isExpandable: true
        },
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
        { key: "sortOrder", label: "Sort Order", sortable: true },
    ],
        async (item) => {
            try {
                await deleteCategory(item.id).unwrap();
                toast.success(`Category "${item.name}" deleted successfully.`);
            } catch (err) {
                toast.error("Failed to delete the category. Please try again.");
            }
        },
        (item) => {
            setEditingCategory(item);
        }), [deleteCategory]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl">Categories</h1>
                <div className="flex flex-1 items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground animate-pulse">Loading categories...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl">Categories</h1>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                    <p className="font-semibold">Error Loading Categories</p>
                    <p className="text-sm opacity-90">Failed to fetch data from the server. Please check your connection or try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl">Categories</h1>
                <AddCategoryPopup />
            </div>
            <DataTable
                columns={categoryColumns}
                data={categories || []}
                filterColumn="name"
                getSubRows={(row) => row.subCategories}
            />
            <EditCategoryPopup
                category={editingCategory}
                onOpenChange={(open) => !open && setEditingCategory(null)}
            />
        </div>
    )
}
