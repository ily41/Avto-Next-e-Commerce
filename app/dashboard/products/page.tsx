"use client"

import Link from "next/link";
import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { useMemo, useState } from "react";
import { useGetPaginatedProductsQuery, useDeleteProductMutation, type Product } from "@/lib/store/products/apislice";
import { toast } from "sonner";
import { AddProductPopup } from "@/components/addEditElement/products/addProduct";
import { EditProductPopup } from "@/components/addEditElement/products/editProduct";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data: productsData, isLoading, error } = useGetPaginatedProductsQuery({
        Page: pageIndex + 1,
        PageSize: pageSize
    });

    const [deleteProduct] = useDeleteProductMutation();
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    const productColumns = useMemo(() => createColumns<Product>([

        {
            key: "primaryImageUrl",
            label: "Image",
            render: (value) => {
                return (
                    <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded border bg-slate-50">
                        {value ? (
                            <img
                                src={`https://evto027-001-site1.ktempurl.com${value}`}
                                alt="Product"
                                className="object-contain h-full w-full"
                            />
                        ) : (
                            <span className="text-[10px] text-gray-400">No Img</span>
                        )}
                    </div>
                )
            }
        },
        { key: "name", label: "Name", sortable: true },
        { key: "sku", label: "SKU", sortable: true },
        { key: "categoryName", label: "Category" },
        { key: "brandName", label: "Brand" },
        {
            key: "price",
            label: "Price",
            sortable: true,
            render: (value) => `${value} AZN`
        },
        {
            key: "stockQuantity",
            label: "Stock",
            sortable: true
        },
        {
            key: "isActive",
            label: "Status",
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {value ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            key: "id",
            label: "details",
            render: (value) => {
                return (
                    <Link href={`/dashboard/products/${value}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-3/5 h-6 !mx-auto"
                        >
                            <Plus size={14} />
                        </Button>
                    </Link>
                )
            }
        }
    ],
        async (item) => {
            try {
                await deleteProduct(item.id).unwrap();
                toast.success(`Product "${item.name}" deleted successfully.`);
            } catch (err) {
                toast.error("Failed to delete the product. Please try again.");
            }
        },
        (item) => {
            setEditingProductId(item.id);
        }), [deleteProduct]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Products</h1>
                <div className="flex flex-1 items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground animate-pulse">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Products</h1>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                    <p className="font-semibold">Error Loading Products</p>
                    <p className="text-sm opacity-90">Failed to fetch data from the server. Please check your connection or try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Products</h1>
                <AddProductPopup />
            </div>
            <DataTable
                columns={productColumns}
                data={productsData?.items || []}
                pageCount={productsData?.totalPages || 0}
                manualPagination={true}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={setPagination}
                filterColumn="name"
            />
            <EditProductPopup
                productId={editingProductId}
                onOpenChange={(open) => !open && setEditingProductId(null)}
            />
        </div>
    );
}
