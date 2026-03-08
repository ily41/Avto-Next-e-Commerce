"use client"

import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { useMemo, useState } from "react";
import { useGetCategoriesQuery, useDeleteCategoryMutation, useCreateCategoryWithImageMutation, useUpdateCategoryWithImageMutation, type Category } from "@/lib/store/categories/apislice";
import { toast } from "sonner";
import { DynamicAddPopup, type FieldConfig } from "@/components/addEditElement/DynamicAddPopup";
import { DynamicEditPopup } from "@/components/addEditElement/DynamicEditPopup";
import * as z from "zod";
import { flattenCategories } from "@/lib/utils/category-flattener";

export default function Page() {
    const { data: categories, isLoading, error } = useGetCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryWithImageMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryWithImageMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const flatCategories = useMemo(() => {
        return categories ? flattenCategories(categories) : [];
    }, [categories]);

    const categorySchema = z.object({
        name: z.string().min(2, "Name is required"),
        description: z.string().min(5, "Description must be at least 5 characters"),
        sortOrder: z.number().min(1, "Sort order must be at least 1"),
        parentCategoryId: z.string().nullable().optional(),
        imageFile: z.instanceof(File, { message: "Image is required" }).nullable().optional(),
        isActive: z.boolean().default(true)
    });

    const categoryFields: FieldConfig[] = [
        { name: "name", label: "Category Name", type: "text", placeholder: "e.g. Shirts" },
        { name: "description", label: "Description", type: "textarea", placeholder: "Category description..." },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        {
            name: "parentCategoryId",
            label: "Parent Category",
            type: "combobox",
            placeholder: "Select Parent Category",
            options: flatCategories.map(cat => ({
                label: cat.displayName,
                value: cat.id
            }))
        },
        { name: "isActive", label: "Is Active", type: "switch" },
        { name: "imageFile", label: "Category Image (Optional)", type: "file" }
    ];

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
                <DynamicAddPopup
                    title="Add Category"
                    triggerText="Add Category"
                    schema={categorySchema}
                    defaultValues={{ name: "", description: "", sortOrder: 1, parentCategoryId: null, imageFile: null, isActive: true }}
                    fields={categoryFields}
                    isLoading={isCreating}
                    onSubmit={async (values) => {
                        await createCategory(values).unwrap();
                        toast.success("Category added!");
                    }}
                />
            </div>
            <DataTable
                columns={categoryColumns}
                data={categories || []}
                filterColumn="name"
                getSubRows={(row) => row.subCategories}
            />
            <DynamicEditPopup
                open={!!editingCategory}
                onOpenChange={(open) => !open && setEditingCategory(null)}
                title={`Edit Category: ${editingCategory?.name}`}
                schema={categorySchema}
                defaultValues={{
                    ...editingCategory,
                    parentCategoryId: editingCategory?.parentCategoryId || null,
                    imageFile: undefined
                }}
                initialPreviews={{
                    imageFile: editingCategory?.imageUrl ? `https://evto027-001-site1.ktempurl.com${editingCategory.imageUrl}` : ""
                }}
                fields={categoryFields}
                isLoading={isUpdating}
                onSubmit={async (values) => {
                    if (!editingCategory) return;
                    await updateCategory({ ...values, id: editingCategory.id }).unwrap();
                    toast.success("Category updated!");
                }}
            />
        </div>
    )
}
