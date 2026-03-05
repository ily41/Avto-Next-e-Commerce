"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useEditBrandMutation } from "@/lib/store/brands/apislice"
import { Brand } from "@/app/dashboard/brands/page"
import { Switch } from "@/components/ui/switch"

const editBrandSchema = z.object({
    name: z.string().min(2, "Name is required"),
    sortOrder: z.number().min(1, "Sort order must be at least 1"),
    isActive: z.boolean(),
    imageFile: z.instanceof(File).nullable(),
})

interface EditBrandPopupProps {
    brand: Brand | null
    onOpenChange: (open: boolean) => void
}

export function EditBrandPopup({ brand, onOpenChange }: EditBrandPopupProps) {
    const [editBrand, { isLoading }] = useEditBrandMutation()
    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    const form = useForm<z.infer<typeof editBrandSchema>>({
        resolver: zodResolver(editBrandSchema),
        defaultValues: {
            name: "",
            sortOrder: 1,
            isActive: true,
            imageFile: null,
        },
    })

    useEffect(() => {
        if (brand) {
            form.reset({
                name: brand.name,
                sortOrder: brand.sortOrder,
                isActive: brand.isActive,
                imageFile: null,
            })
            setPreview(brand.logoUrl ? `https://evto027-001-site1.ktempurl.com${brand.logoUrl}` : null)
        } else {
            setPreview(null)
        }
    }, [brand, form])

    async function onSubmit(values: z.infer<typeof editBrandSchema>) {
        if (!brand) return

        try {
            await editBrand({
                id: brand.id,
                name: values.name,
                sortOrder: values.sortOrder,
                isActive: values.isActive,
                imageFile: values.imageFile,
            }).unwrap()

            toast.success("Brand updated successfully!")
            onOpenChange(false)
        } catch (err) {
            toast.error("Failed to update brand. Please try again.")
        }
    }

    return (
        <Dialog open={!!brand} onOpenChange={(open) => {
            onOpenChange(open)
            if (!open) setPreview(null)
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Brand: {brand?.name}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter brand name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5" >
                                        <FormLabel>Status</FormLabel>
                                        <div className="text-[0.8rem] text-muted-foreground">
                                            Make this brand active or inactive
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
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Brand Logo (Keep empty to keep current logo)</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-4">
                                            {preview && (
                                                <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-slate-100 flex items-center justify-center">
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
                                                                setPreview(brand?.logoUrl ? `https://evto027-001-site1.ktempurl.com${brand.logoUrl}` : null);
                                                            }}
                                                            className="absolute right-0 top-0 rounded-bl bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
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
                            {isLoading ? "Saving..." : "Update Brand"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}
