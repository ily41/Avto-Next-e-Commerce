"use client";

import { useState, useMemo, useEffect } from "react";
import { useGetPaginatedProductsQuery, useBulkAssignProductFiltersMutation, type Product } from "@/lib/store/products/apislice";
import { useGetFiltersQuery } from "@/lib/store/filters/apislice";
import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ProductFiltersDialog } from "./product-filters-dialog";

export default function AssignFiltersPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: productsData, isLoading: isLoadingProducts } = useGetPaginatedProductsQuery({
        Page: pageIndex + 1,
        PageSize: pageSize,
        SearchTerm: debouncedSearch || undefined,
    });

    const { data: filters, isLoading: isLoadingFilters } = useGetFiltersQuery();

    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const [selectedFilterId, setSelectedFilterId] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState("");
    const [customValue, setCustomValue] = useState("");

    const [bulkAssign, { isLoading: isAssigning }] = useBulkAssignProductFiltersMutation();

    const [managingFiltersProduct, setManagingFiltersProduct] = useState<Product | null>(null);

    const columns = useMemo(() => createColumns<Product>([
        { key: "name", label: "Məhsulun Adı", sortable: true },
        { key: "sku", label: "SKU" },
        { key: "categoryName", label: "Kateqoriya" },
        { key: "brandName", label: "Brend" },
        { key: "price", label: "Qiymət", render: (val) => `${val} AZN` },
    ], undefined, undefined, (item) => (
        <DropdownMenuItem onClick={() => setManagingFiltersProduct(item)}>
            Filterləri İdarə Et
        </DropdownMenuItem>
    )), []);

    const selectedProductIds = useMemo(() => {
        if (!productsData?.items) return [];
        return Object.keys(rowSelection)
            .filter(key => rowSelection[key])
            .map(index => productsData.items[parseInt(index)]?.id)
            .filter(id => id !== undefined);
    }, [rowSelection, productsData]);

    const activeFilter = useMemo(() => {
        return filters?.find(f => f.id === selectedFilterId);
    }, [filters, selectedFilterId]);

    const handleAssign = async () => {
        if (!selectedFilterId) {
            toast.error("Zəhmət olmasa filter seçin.");
            return;
        }

        try {
            await bulkAssign({
                productIds: selectedProductIds,
                filterId: selectedFilterId,
                filterOptionId: selectedOptionId && selectedOptionId !== "none" ? selectedOptionId : undefined,
                customValue: customValue || undefined,
            }).unwrap();

            toast.success(`${selectedProductIds.length} məhsula filter uğurla təyin edildi!`);
            setIsAssignModalOpen(false);
            setRowSelection({});
            setSelectedFilterId("");
            setSelectedOptionId("");
            setCustomValue("");
        } catch (error) {
            toast.error("Filterlər təyin edilmədi.");
        }
    };

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Məhsullara Filter Təyin Et</h1>
                <Button
                    onClick={() => setIsAssignModalOpen(true)}
                    disabled={selectedProductIds.length === 0}
                    className="shadow-md"
                >
                    Filter Təyin Et ({selectedProductIds.length})
                </Button>
            </div>

            {isLoadingProducts ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={productsData?.items || []}
                    pageCount={productsData?.totalPages || 0}
                    manualPagination={true}
                    pagination={{ pageIndex, pageSize }}
                    onPaginationChange={setPagination}
                    filterColumn="name"
                    filterMode="server"
                    onFilterChange={(val) => {
                        setSearchTerm(val);
                        setPagination(p => ({ ...p, pageIndex: 0 }));
                    }}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />
            )}

            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedProductIds.length} Məhsula Filter Təyin Et</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Filter</Label>
                            <Select value={selectedFilterId} onValueChange={(val) => {
                                setSelectedFilterId(val);
                                setSelectedOptionId("");
                                setCustomValue("");
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filters?.map(f => (
                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {activeFilter && activeFilter.options && activeFilter.options.length > 0 && (
                            <div className="space-y-2">
                                <Label>Filter Seçimi (İxtiyari)</Label>
                                <Select value={selectedOptionId} onValueChange={setSelectedOptionId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçim seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Heçbiri</SelectItem>
                                        {activeFilter.options.map(opt => (
                                            <SelectItem key={opt.id} value={opt.id}>{opt.displayName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {activeFilter && (
                            <div className="space-y-2">
                                <Label>Fərdi Dəyər (İxtiyari)</Label>
                                <Input
                                    placeholder="Fərdi dəyər daxil edin..."
                                    value={customValue}
                                    onChange={(e) => setCustomValue(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Ləğv Et</Button>
                        <Button onClick={handleAssign} disabled={isAssigning || !selectedFilterId}>
                            {isAssigning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Təyinatı Tətbiq Et
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {managingFiltersProduct && (
                <ProductFiltersDialog
                    product={managingFiltersProduct}
                    open={!!managingFiltersProduct}
                    onOpenChange={(open) => !open && setManagingFiltersProduct(null)}
                />
            )}
        </div>
    );
}
