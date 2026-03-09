"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-tables";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import * as z from "zod";
import { toast } from "sonner";
import { DynamicAddPopup, type FieldConfig } from "@/components/addEditElement/DynamicAddPopup";
import { DynamicEditPopup } from "@/components/addEditElement/DynamicEditPopup";
import {
    useGetPromoCodesQuery,
    useCreatePromoCodeMutation,
    useUpdatePromoCodeMutation,
    useDeletePromoCodeMutation,
    type PromoCode,
} from "@/lib/store/promocodes/apislice";

export default function PromoCodesPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);

    const { data: promoCodesData, isLoading, error } = useGetPromoCodesQuery({
        pageNumber: pageIndex + 1,
        pageSize,
    });

    const [createPromoCode, { isLoading: isCreating }] = useCreatePromoCodeMutation();
    const [updatePromoCode, { isLoading: isUpdating }] = useUpdatePromoCodeMutation();
    const [deletePromoCode] = useDeletePromoCodeMutation();

    const promoCodeSchema = z.object({
        code: z.string().min(1, "Code is required"),
        discountPercentage: z.coerce.number().min(0).max(100),
        expirationDate: z.string().min(1, "Expiration date is required"),
        isActive: z.boolean().default(true),
        usageLimit: z.coerce.number().min(0),
    });

    const promoCodeAddFields: FieldConfig[] = [
        { name: "code", label: "Promo Code", type: "text", placeholder: "e.g. SUMMER2026" },
        { name: "discountPercentage", label: "Discount %", type: "number", placeholder: "0 - 100" },
        { name: "expirationDate", label: "Expiration Date", type: "date" },
        { name: "usageLimit", label: "Usage Limit", type: "number", placeholder: "0 for unlimited" },
        { name: "isActive", label: "Active", type: "switch" },
    ];

    const promoCodeEditFields: FieldConfig[] = [
        { name: "code", label: "Promo Code", type: "text", placeholder: "e.g. SUMMER2026" },
        { name: "discountPercentage", label: "Discount %", type: "number", placeholder: "0 - 100" },
        { name: "expirationDate", label: "Expiration Date", type: "date" },
        { name: "usageLimit", label: "Usage Limit", type: "number", placeholder: "0 for unlimited" },
        { name: "isActive", label: "Active", type: "switch" },
    ];

    const columns = useMemo<ColumnDef<PromoCode>[]>(() => [
        {
            id: "code",
            accessorKey: "code",
            header: "Promo Code",
            cell: ({ row }) => (
                <span className="font-semibold tracking-wide uppercase">{row.original.code}</span>
            ),
        },
        {
            id: "discountPercentage",
            accessorKey: "discountPercentage",
            header: "Discount %",
            cell: ({ row }) => (
                <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                    {row.original.discountPercentage}%
                </div>
            ),
        },
        {
            id: "expirationDate",
            accessorKey: "expirationDate",
            header: "Expiration Date",
            cell: ({ row }) => {
                const date = new Date(row.original.expirationDate);
                const isExpired = date < new Date();
                return (
                    <span className={isExpired ? "text-red-500 line-through" : ""}>
                        {date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                );
            },
        },
        {
            id: "usageLimit",
            accessorKey: "usageLimit",
            header: "Usage Limit",
            cell: ({ row }) => (
                <span>{row.original.usageLimit === 0 ? "Unlimited" : row.original.usageLimit}</span>
            ),
        },
        {
            id: "isActive",
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.original.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {row.original.isActive ? "Active" : "Inactive"}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPromoCode(row.original)}
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            if (confirm("Delete this promo code?")) {
                                try {
                                    await deletePromoCode(row.original.id).unwrap();
                                    toast.success("Promo code deleted!");
                                } catch {
                                    toast.error("Failed to delete promo code");
                                }
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [deletePromoCode]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-500 font-bold">Failed to load promo codes.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Promo Codes</h1>
                <DynamicAddPopup
                    title="Add Promo Code"
                    triggerText="Add Promo Code"
                    schema={promoCodeSchema}
                    defaultValues={{
                        code: "",
                        discountPercentage: 0,
                        expirationDate: "",
                        isActive: true,
                        usageLimit: 0,
                    }}
                    fields={promoCodeAddFields}
                    isLoading={isCreating}
                    onSubmit={async (values) => {
                        const payload = {
                            code: values.code,
                            discountPercentage: Number(values.discountPercentage),
                            expirationDate: new Date(values.expirationDate).toISOString(),
                            isActive: values.isActive,
                            usageLimit: Number(values.usageLimit),
                        };
                        await createPromoCode(payload).unwrap();
                        toast.success("Promo code created!");
                    }}
                />
            </div>

            <DataTable
                columns={columns}
                data={promoCodesData?.items || []}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={setPagination}
                pageCount={promoCodesData?.totalPages ?? -1}
                manualPagination
            />

            {editingPromoCode && (
                <DynamicEditPopup
                    open={!!editingPromoCode}
                    onOpenChange={(open) => !open && setEditingPromoCode(null)}
                    title={`Edit Promo Code: ${editingPromoCode.code}`}
                    schema={promoCodeSchema}
                    defaultValues={{
                        code: editingPromoCode.code,
                        discountPercentage: editingPromoCode.discountPercentage,
                        expirationDate: editingPromoCode.expirationDate
                            ? editingPromoCode.expirationDate.split("T")[0]
                            : "",
                        isActive: editingPromoCode.isActive,
                        usageLimit: editingPromoCode.usageLimit,
                    }}
                    fields={promoCodeEditFields}
                    isLoading={isUpdating}
                    onSubmit={async (values) => {
                        const payload = {
                            code: values.code,
                            discountPercentage: Number(values.discountPercentage),
                            expirationDate: new Date(values.expirationDate).toISOString(),
                            isActive: values.isActive,
                            usageLimit: Number(values.usageLimit),
                        };
                        await updatePromoCode({
                            id: editingPromoCode.id,
                            data: payload,
                        }).unwrap();
                        toast.success("Promo code updated!");
                    }}
                />
            )}
        </div>
    );
}
