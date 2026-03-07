"use client"

import { useState, useEffect } from "react";
import {
    useGetProductSpecificationsQuery,
    useCreateProductSpecificationsMutation,
    useUpdateProductSpecificationsMutation,
    useDeleteProductSpecificationsMutation,
    SpecificationGroup,
    SpecificationItem
} from "@/lib/store/products/specifications/apislice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Save, X, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ProductSpecificationsProps {
    productId: string;
}

export function ProductSpecifications({ productId }: ProductSpecificationsProps) {
    const { data, isLoading, refetch } = useGetProductSpecificationsQuery(productId);
    const [createSpecs] = useCreateProductSpecificationsMutation();
    const [updateSpecs] = useUpdateProductSpecificationsMutation();
    const [deleteSpecs] = useDeleteProductSpecificationsMutation();

    const [groups, setGroups] = useState<SpecificationGroup[]>([]);

    useEffect(() => {
        if (data?.specificationGroups) {
            setGroups(data.specificationGroups);
        } else {
            setGroups([]);
        }
    }, [data]);

    const addGroup = () => {
        setGroups([...groups, { groupName: "", items: [] }]);
    };

    const removeGroup = (index: number) => {
        setGroups(groups.filter((_, i) => i !== index));
    };

    const updateGroupName = (index: number, name: string) => {
        const newGroups = [...groups];
        newGroups[index] = { ...newGroups[index], groupName: name };
        setGroups(newGroups);
    };

    const addItem = (groupIndex: number) => {
        const newGroups = [...groups];
        const newItems = [...newGroups[groupIndex].items, { name: "", value: "", unit: "", type: 0 }];
        newGroups[groupIndex] = { ...newGroups[groupIndex], items: newItems };
        setGroups(newGroups);
    };

    const removeItem = (groupIndex: number, itemIndex: number) => {
        const newGroups = [...groups];
        const newItems = newGroups[groupIndex].items.filter((_, i) => i !== itemIndex);
        newGroups[groupIndex] = { ...newGroups[groupIndex], items: newItems };
        setGroups(newGroups);
    };

    const updateItem = (groupIndex: number, itemIndex: number, field: keyof SpecificationItem, value: string | number) => {
        const newGroups = [...groups];
        const newItems = [...newGroups[groupIndex].items];
        newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
        newGroups[groupIndex] = { ...newGroups[groupIndex], items: newItems };
        setGroups(newGroups);
    };

    const handleSave = async () => {
        try {
            // Basic validation
            if (groups.some(g => !g.groupName)) {
                toast.error("All groups must have a name");
                return;
            }

            if (data?.specificationGroups && data.specificationGroups.length > 0) {
                await updateSpecs({ productId, specificationGroups: groups }).unwrap();
                toast.success("Specifications updated successfully");
            } else {
                await createSpecs({ productId, specificationGroups: groups }).unwrap();
                toast.success("Specifications created successfully");
            }
            refetch();
        } catch (error) {
            toast.error("Failed to save specifications");
        }
    };

    const handleDeleteAll = async () => {
        if (confirm("Are you sure you want to delete all specifications for this product?")) {
            try {
                await deleteSpecs(productId).unwrap();
                toast.success("Specifications deleted");
                setGroups([]);
                refetch();
            } catch (error) {
                toast.error("Failed to delete specifications");
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center animate-pulse">Loading specifications...</div>;

    return (
        <Card className="border-none shadow-xl bg-card">
            <CardHeader className="flex flex-col lg:flex-row gap-4 items-start  lg:items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-primary" />
                        <CardTitle>Technical Specifications</CardTitle>
                    </div>
                    <CardDescription>Configure detailed attributes and technical data for this product.</CardDescription>
                </div>
                <div className="grid grid-cols-2 lg:flex lg:flex-row gap-5 lg:gap-2">
                    {groups.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleDeleteAll} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Reset All
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={addGroup}>
                        <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Button>
                    <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90 col-span-2">
                        <Save className="mr-2 h-4 w-4" /> Save Configuration
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {groups.map((group, gIndex) => (
                    <div key={gIndex} className="relative group/group p-6 rounded-2xl border border-border bg-accent/5 transition-all hover:bg-accent/10">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover/group:opacity-100 transition-opacity"
                            onClick={() => removeGroup(gIndex)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="mb-6 max-w-md">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1.5 block">Group Specification Name</label>
                            <Input
                                value={group.groupName}
                                onChange={(e) => updateGroupName(gIndex, e.target.value)}
                                placeholder="e.g. Dimensions, Performance, Material"
                                className="bg-background border-none shadow-sm focus-visible:ring-primary/20 font-semibold"
                            />
                        </div>

                        <div className="space-y-4">
                            {/* Desktop Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-3 mb-2">
                                <div className="col-span-4 text-[10px] font-bold uppercase text-muted-foreground/60">Property</div>
                                <div className="col-span-3 text-[10px] font-bold uppercase text-muted-foreground/60">Value</div>
                                <div className="col-span-2 text-[10px] font-bold uppercase text-muted-foreground/60">Unit</div>
                                <div className="col-span-2 text-[10px] font-bold uppercase text-muted-foreground/60">Type</div>
                                <div className="col-span-1"></div>
                            </div>

                            {group.items.map((item, iIndex) => (
                                <div key={iIndex} className="relative p-4 md:p-1 rounded-xl bg-background/50 md:bg-transparent border border-border/50 md:border-none group/item transition-all hover:border-primary/20 md:hover:bg-background/50 md:grid md:grid-cols-12 md:gap-4 md:items-center">
                                    <div className="absolute top-2 right-2 md:static md:col-span-1 md:order-last flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(gIndex, iIndex)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4 md:space-y-0 md:contents">
                                        <div className="space-y-1.5 md:space-y-0 md:col-span-4">
                                            <label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Property Name</label>
                                            <Input
                                                value={item.name}
                                                onChange={(e) => updateItem(gIndex, iIndex, 'name', e.target.value)}
                                                placeholder="e.g. Weight"
                                                className="h-10 md:h-9 bg-background border-none shadow-sm md:shadow-none md:bg-background/50"
                                            />
                                        </div>

                                        <div className="space-y-1.5 md:space-y-0 md:col-span-3">
                                            <label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Value</label>
                                            <Input
                                                value={item.value}
                                                onChange={(e) => updateItem(gIndex, iIndex, 'value', e.target.value)}
                                                placeholder="Value"
                                                className="h-10 md:h-9 bg-background border-none shadow-sm md:shadow-none md:bg-background/50"
                                            />
                                        </div>

                                        <div className="space-y-1.5 md:space-y-0 md:col-span-2">
                                            <label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Unit</label>
                                            <Input
                                                value={item.unit}
                                                onChange={(e) => updateItem(gIndex, iIndex, 'unit', e.target.value)}
                                                placeholder="e.g. kg"
                                                className="h-10 md:h-9 bg-background border-none shadow-sm md:shadow-none md:bg-background/50"
                                            />
                                        </div>

                                        <div className="space-y-1.5 md:space-y-0 md:col-span-2">
                                            <label className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Type (ID)</label>
                                            <Input
                                                type="number"
                                                value={item.type}
                                                onChange={(e) => updateItem(gIndex, iIndex, 'type', parseInt(e.target.value) || 0)}
                                                className="h-10 md:h-9 bg-background border-none shadow-sm md:shadow-none md:bg-background/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addItem(gIndex)}
                                className="w-full mt-4 py-8 border-2 border-dashed border-border/50 rounded-xl text-xs font-bold text-primary/70 hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add New Attribute to {group.groupName || 'this section'}
                            </Button>
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-accent/5 rounded-3xl border-2 border-dashed border-border/50">
                        <div className="h-16 w-16 rounded-3xl bg-background flex items-center justify-center mb-6 shadow-sm">
                            <Plus className="h-8 w-8 text-primary/40" />
                        </div>
                        <p className="text-foreground font-bold text-lg">No specifications configured</p>
                        <p className="text-muted-foreground text-sm max-w-xs text-center mt-2 mb-8">Start by adding a specification group to categorize product attributes.</p>
                        <Button variant="default" onClick={addGroup} className="rounded-full px-6">
                            Create First Group
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
