"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateProductWithImageMutation } from "@/lib/store/products/apislice"
import { productSchema, ProductFormValues } from "./productschema"
import * as z from "zod"

// UI Components
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Check, ChevronsUpDown, Search } from "lucide-react"
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice"
import { useGetBrandsQuery } from "@/lib/store/brands/apislice"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { flattenCategories } from "@/lib/utils/category-flattener"

export function AddProductPopup() {
    const [open, setOpen] = useState(false)
    const [mainPreview, setMainPreview] = useState<string | null>(null)
    const [detailPreviews, setDetailPreviews] = useState<string[]>([])

    const { data: categories } = useGetCategoriesQuery()
    const { data: brandsData } = useGetBrandsQuery({ pageIndex: 0, pageSize: 100 })

    const [createProduct, { isLoading }] = useCreateProductWithImageMutation()

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
            detailImageFiles: [],
        },
    })

    useEffect(() => {
        return () => {
            if (mainPreview) URL.revokeObjectURL(mainPreview)
            detailPreviews.forEach(URL.revokeObjectURL)
        }
    }, [mainPreview, detailPreviews])

    async function onSubmit(values: ProductFormValues) {
        if (!values.imageFile) {
            toast.error("Main image is required")
            return
        }

        try {
            console.log(values)
            console.log(values.imageFile)
            console.log(values.detailImageFiles)
            await createProduct({
                ...values,
                primaryImageUrl: values.imageFile as File,
                detailImageFiles: values.detailImageFiles as File[],
            }).unwrap()

            toast.success("Product created successfully!")
            form.reset()
            setMainPreview(null)
            setDetailPreviews([])
            setOpen(false)
        } catch (err: any) {
            toast.error(err?.data || "Failed to create product")
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) {
                setMainPreview(null)
                setDetailPreviews([])
                form.reset()
            }
        }}>
            <DialogTrigger asChild>
                <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        <FormLabel>Main Image</FormLabel>
                                        <div className="flex flex-col gap-2">
                                            {mainPreview && (
                                                <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                                                    <img src={mainPreview} alt="Main" className="object-cover w-full h-full" />
                                                    <button type="button" onClick={() => { setMainPreview(null); onChange(null); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
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

                            <FormField
                                control={form.control}
                                name="detailImageFiles"
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel>Detail Images</FormLabel>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {detailPreviews.map((src, i) => (
                                                <div key={i} className="relative w-24 h-24 border rounded-md overflow-hidden">
                                                    <img src={src} alt={`Detail ${i}`} className="object-cover w-full h-full" />
                                                    <button type="button" onClick={() => { setDetailPreviews(prev => prev.filter((_, idx) => idx !== i)); onChange(prev => prev.filter((_, idx) => idx !== i)); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <FormControl>
                                            <Input type="file" accept="image/*" multiple onChange={(e) => {
                                                const files = Array.from(e.target.files || [])
                                                console.log(files)
                                                if (files.length > 0) {
                                                    onChange(files)
                                                    setDetailPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
                                                }
                                            }} {...fieldProps} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Product"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
