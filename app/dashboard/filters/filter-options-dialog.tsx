"use client";

import { useMemo, useState } from "react";
import { Filter, FilterOption, useCreateFilterOptionMutation, useUpdateFilterOptionMutation, useDeleteFilterOptionMutation } from "@/lib/store/filters/apislice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { DynamicAddPopup, type FieldConfig } from "@/components/addEditElement/DynamicAddPopup";
import { DynamicEditPopup } from "@/components/addEditElement/DynamicEditPopup";
import * as z from "zod";
import { toast } from "sonner";

interface FilterOptionsDialogProps {
    filter: Filter;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}



export function FilterOptionsDialog({ filter, open, onOpenChange }: FilterOptionsDialogProps) {
    const [createOption, { isLoading: isCreating }] = useCreateFilterOptionMutation();
    const [updateOption, { isLoading: isUpdating }] = useUpdateFilterOptionMutation();
    const [deleteOption] = useDeleteFilterOptionMutation();



    const [editingOption, setEditingOption] = useState<FilterOption | null>(null);

    const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const optionSchema = z.object({
        value: z.string().min(1, "Dəyər tələb olunur"),
        displayName: z.string().min(1, "Görünən ad tələb olunur"),
        color: z.string().optional().nullable(),
        iconUrl: z.string().optional().nullable(),
        isActive: z.boolean().default(true),
        sortOrder: z.number().default(0),
    });

    const optionFields: FieldConfig[] = [
        { name: "displayName", label: "Görünən Ad", type: "text" },
        { name: "value", label: "Dəyər", type: "text" },
        { name: "color", label: "Rəng (Hex)", type: "color", placeholder: "#000000" },
        { name: "iconUrl", label: "İkona URL", type: "text" },
        { name: "sortOrder", label: "Sıralama", type: "number" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
    ];

    const columns = useMemo(() => createColumns<FilterOption>([
        { key: "displayName", label: "Ad", sortable: true },
        { key: "value", label: "Dəyər", sortable: true },
        { key: "sortOrder", label: "Sıralama", sortable: true },
        {
            key: "color", label: "Rəng",
            render: (val) => val ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: val }} />
                    <span className="text-xs">{val}</span>
                </div>
            ) : "-"
        },
        {
            key: "isActive",
            label: "Status",
            render: (val) => (
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${val ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {val ? "Aktiv" : "Qeyri-aktiv"}
                </div>
            )
        }
    ],
        async (item) => {
            try {
                await deleteOption({ filterId: filter.id, optionId: item.id }).unwrap();
                toast.success("Seçim uğurla silindi.");
            } catch (err) {
                toast.error("Seçim silinə bilmədi.");
            }
        },
        (item) => setEditingOption(item)
    ), [deleteOption, filter.id]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-none w-[90vw] md:w-[70vw] h-[90vh] flex flex-col overflow-hidden ">
                <DialogHeader className="flex flex-col gap-4" >
                    <div className="flex items-center justify-between mt-4 px-4">
                        <DialogTitle className="text-xl">Seçimlər: <span className="text-primary italic">"{filter.name}"</span></DialogTitle>
                        <DynamicAddPopup
                            title="Filter Seçimi Əlavə Et"
                            triggerText="Seçim Əlavə Et"
                            schema={optionSchema}
                            defaultValues={{
                                value: "",
                                displayName: "",
                                color: "",
                                iconUrl: "",
                                isActive: true,
                                sortOrder: 0,
                            }}
                            fields={optionFields}
                            isLoading={isCreating}
                            onSubmit={async (values) => {
                                try {
                                    await createOption({
                                        filterId: filter.id,
                                        data: {
                                            value: values.value,
                                            displayName: values.displayName,
                                            color: values.color || null,
                                            iconUrl: values.iconUrl || null,
                                            isActive: values.isActive,
                                            sortOrder: values.sortOrder,
                                        }
                                    }).unwrap();

                                    toast.success("Seçim uğurla yaradıldı!");
                                } catch (err) {
                                    toast.error("Seçim yaradıla bilmədi.");
                                }
                            }}
                        />
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-background/50 rounded-md border py-2 px-4   ">
                    <DataTable
                        columns={columns}
                        data={filter.options || []}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        filterColumn="displayName"
                    />
                </div>

                {editingOption && (
                    <DynamicEditPopup
                        open={!!editingOption}
                        onOpenChange={(op) => !op && setEditingOption(null)}
                        title={`Seçimi Düzəlt: ${editingOption.displayName}`}
                        schema={optionSchema}
                        defaultValues={{
                            value: editingOption.value,
                            displayName: editingOption.displayName,
                            color: editingOption.color || "",
                            iconUrl: editingOption.iconUrl || "",
                            isActive: editingOption.isActive,
                            sortOrder: editingOption.sortOrder,
                        }}
                        fields={optionFields}
                        isLoading={isUpdating}
                        onSubmit={async (values) => {
                            try {
                                await updateOption({
                                    filterId: filter.id,
                                    optionId: editingOption.id,
                                    data: {
                                        value: values.value,
                                        displayName: values.displayName,
                                        color: values.color || null,
                                        iconUrl: values.iconUrl || null,
                                        isActive: values.isActive,
                                        sortOrder: values.sortOrder,
                                    }
                                }).unwrap();

                                toast.success("Seçim uğurla yenilendi!");
                                setEditingOption(null);
                            } catch (err) {
                                toast.error("Seçim yenilənə bilmədi.");
                            }
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
