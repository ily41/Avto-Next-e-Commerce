"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// UI Components (Shadcn)
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { X } from "lucide-react"

import { useCreateCategoryWithImageMutation, useGetCategoriesQuery } from "@/lib/store/categories/apislice"
import { categorySchema } from "./categorySchema"

export function AddCategoryPopup() {
    const [open, setOpen] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const { data: catData } = useGetCategoriesQuery()
    const [createCategory, { isLoading }] = useCreateCategoryWithImageMutation()

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            sortOrder: 1,
            parentCategoryId: null,
            imageFile: null,
        },
    })

    // Helper function to flatten the category tree for selection
    const flattenCategories = (cats: any[] = [], depth = 0): any[] => {
        return cats.reduce((acc, cat) => {
            acc.push({ id: cat.id, name: cat.name, depth });
            if (cat.subCategories && cat.subCategories.length > 0) {
                acc.push(...flattenCategories(cat.subCategories, depth + 1));
            }
            return acc;
        }, []);
    };

    const categories = flattenCategories(catData || []);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    async function onSubmit(values: z.infer<typeof categorySchema>) {
        if (!values.imageFile) {
            toast.error("Image is required")
            return
        }

        try {
            await createCategory({
                name: values.name,
                description: values.description,
                sortOrder: values.sortOrder,
                parentCategoryId: values.parentCategoryId,
                imageFile: values.imageFile
            }).unwrap()

            toast.success("Category created successfully!")
            form.reset()
            setPreview(null)
            setOpen(false)
        } catch (err) {
            toast.error("An error occurred while creating the category.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) {
                setPreview(null)
                form.reset()
            }
        }}>
            <DialogTrigger asChild>
                <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
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
                                            defaultValue={field.value || undefined}
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
                            name="imageFile"
                            render={({ field: { onChange, value, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Category Image</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-4">
                                            {preview && (
                                                <div className="relative h-32 w-full max-w-[200px] overflow-hidden rounded-md border bg-slate-100 flex items-center justify-center">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="h-full w-full object-contain"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPreview(null)
                                                            onChange(null)
                                                        }}
                                                        className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
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
                                    <FormDescription>Choose an image for the category icon/banner.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Create Category"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
