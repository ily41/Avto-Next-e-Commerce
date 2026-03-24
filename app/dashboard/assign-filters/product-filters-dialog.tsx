"use client";

import { useGetProductFiltersQuery, useDeleteProductFilterMutation, type Product, type ProductFilterAssignment } from "@/lib/store/products/apislice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { useMemo } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ProductFiltersDialog({
    product,
    open,
    onOpenChange
}: {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data: filters, isLoading, isFetching } = useGetProductFiltersQuery(product.id, {
        skip: !open,
    });

    const [deleteFilter] = useDeleteProductFilterMutation();

    const columns = useMemo(() => createColumns<ProductFilterAssignment>([
        { key: "filterName", label: "Filter Name", sortable: true },
        { key: "filterOptionDisplayName", label: "Option Name", sortable: true },
        { key: "customValue", label: "Custom Value", sortable: true },
    ], async (item) => {
        try {
            await deleteFilter({
                productId: item.productId,
                filterId: item.filterId,
            }).unwrap();
            toast.success("Filter unassigned successfully");
        } catch (e) {
            toast.error("Failed to unassign filter.");
        }
    }), [deleteFilter]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-none w-[90vw] md:w-[70vw] h-[90vh] flex flex-col overflow-hidden ">
                <DialogHeader>
                    <DialogTitle>Filters for: {product.name}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {isLoading || isFetching ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filters || []}
                            filterColumn="filterName"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
