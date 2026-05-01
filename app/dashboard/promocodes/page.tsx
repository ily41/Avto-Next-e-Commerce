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
        code: z.string().min(1, "Kod tələb olunur"),
        discountPercentage: z.coerce.number().min(0).max(100),
        expirationDate: z.string().min(1, "Bitmə tarixi tələb olunur"),
        isActive: z.boolean().default(true),
        usageLimit: z.coerce.number().min(0),
    });

    const promoCodeAddFields: FieldConfig[] = [
        { name: "code", label: "Promokod", type: "text", placeholder: "məsələn: SUMMER2026" },
        { name: "discountPercentage", label: "Endirim %", type: "number", placeholder: "0 - 100" },
        { name: "expirationDate", label: "Bitmə Tarixi", type: "date" },
        { name: "usageLimit", label: "İstifadə Limiti", type: "number", placeholder: "0 - limitsiz" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
    ];

    const promoCodeEditFields: FieldConfig[] = [
        { name: "code", label: "Promokod", type: "text", placeholder: "məsələn: SUMMER2026" },
        { name: "discountPercentage", label: "Endirim %", type: "number", placeholder: "0 - 100" },
        { name: "expirationDate", label: "Bitmə Tarixi", type: "date" },
        { name: "usageLimit", label: "İstifadə Limiti", type: "number", placeholder: "0 - limitsiz" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
    ];

    const columns = useMemo<ColumnDef<PromoCode>[]>(() => [
        {
            id: "code",
            accessorKey: "code",
            header: "Promokod",
            cell: ({ row }) => (
                <span className="font-semibold tracking-wide uppercase">{row.original.code}</span>
            ),
        },
        {
            id: "discountPercentage",
            accessorKey: "discountPercentage",
            header: "Endirim %",
            cell: ({ row }) => (
                <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                    {row.original.discountPercentage}%
                </div>
            ),
        },
        {
            id: "expirationDate",
            accessorKey: "expirationDate",
            header: "Bitmə Tarixi",
            cell: ({ row }) => {
                const date = new Date(row.original.expirationDate);
                const isExpired = date < new Date();
                return (
                    <span className={isExpired ? "text-red-500 line-through" : ""}>
                        {date.toLocaleDateString("az-AZ", {
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
            header: "İstifadə Limiti",
            cell: ({ row }) => (
                <span>{row.original.usageLimit === 0 ? "Limitsiz" : row.original.usageLimit}</span>
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
                    {row.original.isActive ? "Aktiv" : "Qeyri-aktiv"}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Fəaliyyətlər",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPromoCode(row.original)}
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzəlt
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            if (confirm("Bu promokodu silmək istədiyinizə əminsiniz?")) {
                                try {
                                    await deletePromoCode(row.original.id).unwrap();
                                    toast.success("Promokod silindi!");
                                } catch {
                                    toast.error("Promokod silinə bilmədi");
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
                <p className="text-red-500 font-bold">Promokodlar yüklənilə bilmədi.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-base md:text-xl lg:text-2xl font-bold">Promokodlar</h1>
                    {promoCodesData?.totalCount !== undefined && (
                        <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/10 px-4 py-1.5 rounded-2xl shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Ümumi:</span>
                            <span className="text-sm font-black text-amber-600">{promoCodesData.totalCount}</span>
                        </div>
                    )}
                </div>
                <DynamicAddPopup
                    title="Promokod Əlavə Et"
                    triggerText="Promokod Əlavə Et"
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
                        toast.success("Promokod yaradıldı!");
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
                    title={`Promokodu Düzəlt: ${editingPromoCode.code}`}
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
                        toast.success("Promokod yenilendi!");
                    }}
                />
            )}
        </div>
    );
}
