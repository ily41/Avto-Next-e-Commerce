"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// UI Components (Shadcn)
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { X } from "lucide-react"

import { useUpdateCategoryWithImageMutation, useGetCategoriesQuery, type Category } from "@/lib/store/categories/apislice"
import { categorySchema } from "./categorySchema"

// Extend schema for edit (isActive is usually included in edit)
const editCategorySchema = categorySchema.extend({
    isActive: z.boolean(),
})

interface EditCategoryPopupProps {
    category: Category | null
    onOpenChange: (open: boolean) => void
}

const BASE_URL = "https://evto027-001-site1.ktempurl.com"

export function EditCategoryPopup({ category, onOpenChange }: EditCategoryPopupProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const { data: catData } = useGetCategoriesQuery()
    const [updateCategory, { isLoading }] = useUpdateCategoryWithImageMutation()

    const form = useForm<z.infer<typeof editCategorySchema>>({
        resolver: zodResolver(editCategorySchema),
        defaultValues: {
            name: "",
            description: "",
            sortOrder: 1,
            isActive: true,
            parentCategoryId: null,
            imageFile: null,
        },
    })

    // Flatten categories for parent selection (exclude current category and its children to prevent circular refs)
    const flattenCategories = (cats: any[] = [], depth = 0): any[] => {
        return cats.reduce((acc, cat) => {
            // Basic circular reference prevention: don't show current category
            if (cat.id !== category?.id) {
                acc.push({ id: cat.id, name: cat.name, depth });
                if (cat.subCategories && cat.subCategories.length > 0) {
                    acc.push(...flattenCategories(cat.subCategories, depth + 1));
                }
            }
            return acc;
        }, []);
    };

    const categories = flattenCategories(catData || []);

    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                description: category.description,
                sortOrder: category.sortOrder,
                isActive: category.isActive,
                parentCategoryId: category.parentCategoryId || "none",
                imageFile: null,
            })
            setPreview(category.imageUrl ? `${BASE_URL}${category.imageUrl}` : null)
        } else {
            setPreview(null)
        }
    }, [category, form])

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    async function onSubmit(values: z.infer<typeof editCategorySchema>) {
        if (!category) return

        try {
            await updateCategory({
                id: category.id,
                name: values.name,
                description: values.description,
                sortOrder: values.sortOrder,
                isActive: values.isActive,
                parentCategoryId: values.parentCategoryId === "none" ? null : values.parentCategoryId,
                imageFile: values.imageFile
            }).unwrap()

            toast.success("Category updated successfully!")
            onOpenChange(false)
        } catch (err) {
            toast.error("An error occurred while updating the category.")
        }
    }

    return (
        <Dialog open={!!category} onOpenChange={(open) => {
            onOpenChange(open)
            if (!open) setPreview(null)
        }}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Category: {category?.name}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Electronics, Men's Wear, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe this category..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sortOrder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sort Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="1"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="parentCategoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Root (No Parent)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">Root (No Parent)</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {"-".repeat(cat.depth)} {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Status</FormLabel>
                                        <div className="text-[0.8rem] text-muted-foreground">
                                            Enable or disable this category
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageFile"
                            render={({ field: { onChange, value, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Category Image (Keep empty to keep current image)</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-4">
                                            {preview && (
                                                <div className="relative h-32 w-full max-w-[200px] overflow-hidden rounded-md border bg-slate-100 flex items-center justify-center">
                                                    <img
                                                        src={preview}
                                                        alt="Logo Preview"
                                                        className="h-full w-full object-contain"
                                                    />
                                                    {form.getValues("imageFile") && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                onChange(null);
                                                                setPreview(category?.imageUrl ? `${BASE_URL}${category.imageUrl}` : null);
                                                            }}
                                                            className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        onChange(file)
                                                        setPreview(URL.createObjectURL(file))
                                                    }
                                                }}
                                                {...fieldProps}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Update Category"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
