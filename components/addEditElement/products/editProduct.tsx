"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProductWithImageMutation, useDeleteProductImageMutation, type Product } from "@/lib/store/products/apislice"
import { productSchema, ProductFormValues } from "./productschema"
import * as z from "zod"

// UI Components
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice"
import { useGetBrandsQuery } from "@/lib/store/brands/apislice"
import { X, Loader2 } from "lucide-react"

interface EditProductPopupProps {
    product: Product | null
    onOpenChange: (open: boolean) => void
}

export function EditProductPopup({ product, onOpenChange }: EditProductPopupProps) {
    const [mainPreview, setMainPreview] = useState<string | null>(null)
    const [newDetailPreviews, setNewDetailPreviews] = useState<string[]>([])

    const { data: categories } = useGetCategoriesQuery()
    const { data: brandsData } = useGetBrandsQuery({ pageIndex: 0, pageSize: 100 })

    const [updateProduct, { isLoading }] = useUpdateProductWithImageMutation()
    const [deleteImage, { isLoading: isDeletingImage }] = useDeleteProductImageMutation()

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            shortDescription: "",
            sku: "",
            isHotDeal: false,
            stockQuantity: 0,
            categoryId: "",
            brandId: "",
            price: 0,
            discountedPrice: 0,
            isActive: true,
            imageFile: undefined,
            detailImageFiles: [],
        },
    })

    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                description: product.description,
                shortDescription: product.shortDescription,
                sku: product.sku,
                isHotDeal: product.isHotDeal,
                stockQuantity: product.stockQuantity,
                categoryId: product.categoryId,
                brandId: product.brandId,
                price: product.price,
                discountedPrice: product.discountedPrice,
                isActive: product.isActive,
            })
            setMainPreview(product.imageUrl ? `https://evto027-001-site1.ktempurl.com${product.imageUrl}` : null)
            setNewDetailPreviews([])
        }
    }, [product, form])

    useEffect(() => {
        return () => {
            newDetailPreviews.forEach(URL.revokeObjectURL)
        }
    }, [newDetailPreviews])

    async function onSubmit(values: ProductFormValues) {
        if (!product) return

        try {
            await updateProduct({
                ...values,
                id: product.id,
                imageFile: values.imageFile as File || null,
                detailImageFiles: values.detailImageFiles as File[],
            }).unwrap()

            toast.success("Product updated successfully!")
            onOpenChange(false)
        } catch (err: any) {
            toast.error(err?.data?.Message || "Failed to update product")
        }
    }

    async function handleDeleteImage(imageId: string) {
        try {
            await deleteImage(imageId).unwrap()
            toast.success("Image deleted")
        } catch (err) {
            toast.error("Failed to delete image")
        }
    }

    return (
        <Dialog open={!!product} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product: {product?.name}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl><Input placeholder="T-Shirt" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU</FormLabel>
                                        <FormControl><Input placeholder="TSH-001" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl><Input placeholder="Brief overview..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Description</FormLabel>
                                    <FormControl><Textarea placeholder="Detailed description..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brandId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select brand" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {brandsData?.items?.map((brand: any) => (
                                                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discountedPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discounted Price</FormLabel>
                                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stockQuantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-8">
                            <FormField
                                control={form.control}
                                name="isHotDeal"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel>Hot Deal</FormLabel>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel>Active</FormLabel>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="imageFile"
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel>Main Image (Optional)</FormLabel>
                                        <div className="flex flex-col gap-2">
                                            {mainPreview && (
                                                <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                                                    <img src={mainPreview} alt="Main" className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                            <FormControl>
                                                <Input type="file" accept="image/*" onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        onChange(file)
                                                        setMainPreview(URL.createObjectURL(file))
                                                    }
                                                }} {...fieldProps} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>Current Detail Images</FormLabel>
                                <div className="flex flex-wrap gap-2">
                                    {product?.productImages?.map((img) => (
                                        <div key={img.id} className="relative w-24 h-24 border rounded-md overflow-hidden">
                                            <img src={`https://evto027-001-site1.ktempurl.com${img.imageUrl}`} alt="Detail" className="object-cover w-full h-full" />
                                            <button type="button" onClick={() => handleDeleteImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1" disabled={isDeletingImage}>
                                                {isDeletingImage ? <Loader2 className="animate-spin" size={12} /> : <X size={12} />}
                                            </button>
                                        </div>
                                    ))}
                                    {!product?.productImages?.length && <p className="text-sm text-gray-500">No images</p>}
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="detailImageFiles"
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel>Add New Detail Images</FormLabel>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {newDetailPreviews.map((src, i) => (
                                                <div key={i} className="relative w-24 h-24 border rounded-md overflow-hidden">
                                                    <img src={src} alt={`New Detail ${i}`} className="object-cover w-full h-full" />
                                                </div>
                                            ))}
                                        </div>
                                        <FormControl>
                                            <Input type="file" accept="image/*" multiple onChange={(e) => {
                                                const files = Array.from(e.target.files || [])
                                                if (files.length > 0) {
                                                    onChange(files)
                                                    setNewDetailPreviews(files.map(f => URL.createObjectURL(f)))
                                                }
                                            }} {...fieldProps} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Update Product"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
