"use client";

import { useMemo, useState, useEffect } from "react";
import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import {
    useGetFiltersPaginatedQuery,
    useCreateFilterMutation,
    useUpdateFilterMutation,
    useDeleteFilterMutation,
    type Filter,
} from "@/lib/store/filters/apislice";
import { toast } from "sonner";
import { DynamicAddPopup, type FieldConfig } from "@/components/addEditElement/DynamicAddPopup";
import { DynamicEditPopup } from "@/components/addEditElement/DynamicEditPopup";
import * as z from "zod";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FilterOptionsDialog } from "./filter-options-dialog";

const FILTER_TYPES = [
    { label: "Checkboks", value: "0" },
    { label: "Radio", value: "1" },
    { label: "Rəng", value: "2" },
    { label: "Aralıq", value: "3" },
    { label: "Düymə", value: "4" },
];

export default function FiltersPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const { data, isLoading: isFetching, error } = useGetFiltersPaginatedQuery({
        page: pageIndex + 1,
        pageSize,
        searchTerm: debouncedSearchTerm || undefined,
    });

    const filters = data?.filters;

    const [createFilter, { isLoading: isCreating }] = useCreateFilterMutation();
    const [updateFilter, { isLoading: isUpdating }] = useUpdateFilterMutation();
    const [deleteFilter] = useDeleteFilterMutation();

    const [editingFilter, setEditingFilter] = useState<Filter | null>(null);
    const [managingOptionsFilter, setManagingOptionsFilter] = useState<Filter | null>(null);

    const filterSchema = z.object({
        name: z.string().min(1, "Ad tələb olunur"),
        type: z.string().or(z.number()).transform(v => Number(v)),
        isActive: z.boolean().default(true),
        sortOrder: z.number().default(0),
    });

    const filterFields: FieldConfig[] = [
        { name: "name", label: "Ad", type: "text" },
        { name: "type", label: "Növ", type: "select", options: FILTER_TYPES },
        { name: "sortOrder", label: "Sıralama", type: "number" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
    ];

    const columns = useMemo(() => createColumns<Filter>([
        { key: "name", label: "Ad", sortable: true },
        { key: "typeName", label: "Növ", sortable: true },
        { key: "sortOrder", label: "Sıralama", sortable: true },
        {
            key: "isActive",
            label: "Status",
            render: (value) => (
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {value ? "Aktiv" : "Qeyri-aktiv"}
                </div>
            )
        },
        {
            key: "createdAt",
            label: "Yaradılma Tarixi",
            render: (value) => value ? new Date(value).toLocaleDateString() : "-"
        }
    ],
        async (item) => {
            try {
                await deleteFilter(item.id).unwrap();
                toast.success("Filter uğurla silindi.");
            } catch (err) {
                toast.error("Filter silinə bilmədi.");
            }
        },
        (item) => {
            setEditingFilter(item);
        },
        (item) => (
            <DropdownMenuItem onClick={() => setManagingOptionsFilter(item)}>
                Seçimləri İdarə Et
            </DropdownMenuItem>
        )
    ), [deleteFilter]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-10 h-full">
                <p className="text-red-500 font-bold mb-4">Filterlər yüklənilə bilmədi.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Filterlər</h1>
                <DynamicAddPopup
                    title="Yeni Filter Əlavə Et"
                    triggerText="Filter Əlavə Et"
                    schema={filterSchema}
                    defaultValues={{
                        name: "",
                        type: "0",
                        isActive: true,
                        sortOrder: 0,
                    }}
                    fields={filterFields}
                    isLoading={isCreating}
                    onSubmit={async (values) => {
                        await createFilter({
                            name: values.name,
                            type: values.type,
                            isActive: values.isActive,
                            sortOrder: values.sortOrder,
                            options: [],
                        }).unwrap();
                        toast.success("Filter uğurla yaradıldı!");
                    }}
                />
            </div>

            {isFetching ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground animate-pulse">Filterlər yüklənir...</p>
                    </div>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filters || []}
                    pageCount={data?.totalPages || 0}
                    manualPagination={true}
                    pagination={{ pageIndex, pageSize }}
                    onPaginationChange={setPagination}
                    filterColumn="name"
                    filterMode="server"
                    onFilterChange={(val) => {
                        setSearchTerm(val);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }));
                    }}
                />
            )}

            {editingFilter && (
                <DynamicEditPopup
                    open={!!editingFilter}
                    onOpenChange={(open) => !open && setEditingFilter(null)}
                    title={`Filteri Düzəlt: ${editingFilter.name}`}
                    schema={filterSchema}
                    defaultValues={{
                        name: editingFilter.name,
                        type: editingFilter.type.toString(),
                        isActive: editingFilter.isActive,
                        sortOrder: editingFilter.sortOrder,
                    }}
                    fields={filterFields}
                    isLoading={isUpdating}
                    onSubmit={async (values) => {
                        await updateFilter({
                            id: editingFilter.id,
                            data: {
                                name: values.name,
                                type: values.type,
                                isActive: values.isActive,
                                sortOrder: values.sortOrder,
                            }
                        }).unwrap();
                        toast.success("Filter uğurla yenilendi!");
                    }}
                />
            )}

            {/* Find the current filter in the live data array so it updates when the query refetches */}
            {managingOptionsFilter && (
                <FilterOptionsDialog
                    filter={filters?.find(f => f.id === managingOptionsFilter.id) || managingOptionsFilter}
                    open={!!managingOptionsFilter}
                    onOpenChange={(open) => !open && setManagingOptionsFilter(null)}
                />
            )}
        </div>
    );
}
