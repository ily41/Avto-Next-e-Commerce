"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProductWithImageMutation, type Product } from "@/lib/store/products/apislice"
import { useGetProductByIdQuery } from "@/lib/store/productDetails/apislice"
import {
    useDeleteProductImageMutation,
    useUploadPrimaryImageMutation,
    useUploadDetailImagesMutation
} from "@/lib/store/products/editApis/apislice"
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { X, Loader2, UploadCloud, Trash2, Image as ImageIcon, Check, ChevronsUpDown } from "lucide-react"
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice"
import { useGetBrandsQuery } from "@/lib/store/brands/apislice"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { flattenCategories } from "@/lib/utils/category-flattener"

interface EditProductPopupProps {
    productId: string | null
    onOpenChange: (open: boolean) => void
}

export function EditProductPopup({ productId, onOpenChange }: EditProductPopupProps) {
    const { data: product, isLoading: isFetching } = useGetProductByIdQuery(productId!, { skip: !productId })
    const [mainPreview, setMainPreview] = useState<string | null>(null)
    const [newDetailPreviews, setNewDetailPreviews] = useState<string[]>([])

    const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()
    const { data: brandsData, isLoading: isBrandsLoading } = useGetBrandsQuery({ pageIndex: 0, pageSize: 100 })

    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductWithImageMutation()
    const [deleteImage, { isLoading: isDeletingImage }] = useDeleteProductImageMutation()
    const [uploadPrimary] = useUploadPrimaryImageMutation()
    const [uploadDetails] = useUploadDetailImagesMutation()

    const [imageToDelete, setImageToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

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
        if (product && categories && brandsData) {
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
    }, [product, categories, brandsData, form])

    useEffect(() => {
        return () => {
            newDetailPreviews.forEach(URL.revokeObjectURL)
        }
    }, [newDetailPreviews])

    async function onSubmit(values: ProductFormValues) {
        if (!product) return

        setIsDeleting(true) // Reusing as general loading state for multipart uploads
        try {
            // 1. Update text fields and existing logic
            await updateProduct({
                ...values,
                id: product.id,
                primaryImageUrl: null, // Changed from imageFile to primaryImageUrl to match API slice
                detailImageFiles: [],
            }).unwrap()

            // 2. Handle Primary Image Upload if changed
            if (values.imageFile instanceof File) {
                await uploadPrimary({ id: product.id, imageFile: values.imageFile }).unwrap()
            }

            // 3. Handle Detail Images Upload if added
            if (values.detailImageFiles && values.detailImageFiles.length > 0) {
                await uploadDetails({ id: product.id, imageFiles: values.detailImageFiles as File[] }).unwrap()
            }

            toast.success("Product updated successfully!")
            onOpenChange(false)
        } catch (err: any) {
            console.log(err)
            toast.error(err?.data || "Failed to update product")
        } finally {
            setIsDeleting(false)
        }
    }

    async function confirmDeleteImage() {
        if (!imageToDelete) return
        try {
            await deleteImage(imageToDelete).unwrap()
            toast.success("Image deleted")
            setImageToDelete(null)
        } catch (err) {
            toast.error("Failed to delete image")
        }
    }

    return (
        <Dialog open={!!productId} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase">
                        {isFetching ? "Syncing Product Data..." : `Edit Asset: ${product?.name}`}
                    </DialogTitle>
                </DialogHeader>

                {isFetching ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Retrieving Details...</p>
                    </div>
                ) : !product ? (
                    <div className="py-20 text-center text-muted-foreground">Product not found.</div>
                ) : (
                    <Form {...form}>
                        <form key={product?.id || 'new'} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                    render={({ field }) => {
                                        const flattenedCats = categories ? flattenCategories(categories) : [];
                                        const selectedCat = flattenedCats.find(c => c.id === field.value);

                                        return (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Category</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? selectedCat?.displayName
                                                                    : "Select category"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                                        <Command>
                                                            <CommandInput placeholder="Search category..." />
                                                            <CommandList>
                                                                <CommandEmpty>No category found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {flattenedCats.map((cat) => (
                                                                        <CommandItem
                                                                            value={cat.name}
                                                                            key={cat.id}
                                                                            onSelect={() => {
                                                                                form.setValue("categoryId", cat.id)
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    cat.id === field.value ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {cat.displayName}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand</FormLabel>
                                            <Select
                                                key={`brand-${field.value}-${brandsData?.items?.length || 0}`}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
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

                                <div className="space-y-4">
                                    <FormLabel className="text-sm font-bold flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" /> Current Detail Images
                                    </FormLabel>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {product?.images?.filter((img) => img.imageUrl !== product?.imageUrl).map((img) => (
                                            <div key={img.id} className="group relative aspect-square border-2 border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all shadow-sm">
                                                <img src={`https://evto027-001-site1.ktempurl.com${img.imageUrl}`} alt="Detail" className="object-cover w-full h-full" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={() => setImageToDelete(img.id)}
                                                        disabled={isDeletingImage}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {!product?.images?.length && (
                                            <div className="col-span-full py-8 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-accent/5">
                                                <ImageIcon className="h-8 w-8 opacity-20 mb-2" />
                                                <span className="text-xs font-semibold">No detail images uploaded</span>
                                            </div>
                                        )}
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

                            <Button type="submit" className="w-full h-12 text-md font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]" disabled={isUpdating || isDeleting}>
                                {(isUpdating || isDeleting) ? (
                                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing Changes...</span>
                                ) : (
                                    "Update Product & Process Assets"
                                )}
                            </Button>
                        </form>
                    </Form>
                )}

                <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
                    <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black italic tracking-tighter">ELIMINATE ASSET?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground font-medium">
                                This action is permanent. The selected detailed view will be purged from the product gallery immediately.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteImage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full font-bold">
                                {isDeletingImage ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Purge Image
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    )
}
