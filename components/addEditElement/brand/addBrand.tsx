"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddProductMutation } from "@/lib/store/products/apislice"
import { productSchema } from "../addProductSchema" // Import from above
import * as z from "zod"

// UI Components (Shadcn)
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner" // Better than alert()
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "../../ui/switch"
import { useCreateBrandWithImageMutation } from "@/lib/store/brands/apislice"
import { brandSchema } from "./addBrandSchema"

export function AddBrandPopup() {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // 1. Hook into the RTK Mutation
  const [addBrand, { isLoading }] = useCreateBrandWithImageMutation()

  // 2. Initialize Form
  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      sortOrder: 1,
      imageFile: undefined,
    },
  })

  // 3. Handle Submit
  async function onSubmit(values: z.infer<typeof brandSchema>) {
    try {
      // .unwrap() allows us to use the catch block for API errors
      await addBrand(values).unwrap()

      toast.success("Brand added!")
      form.reset()
      setPreview(null)
      setOpen(false) // Close the popup only on success
    } catch (err) {
      toast.error("Something went wrong. Please check your inputs.")
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
        <Button>Add Brand</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add New Brand</DialogTitle></DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">



            {/* Field Example: Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl><Input placeholder="iPhone 15" {...field} /></FormControl>
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
                  <FormControl><Input type="number" placeholder="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Brand Logo</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      {preview && (
                        <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-slate-100 flex items-center justify-center">
                          <img
                            src={preview}
                            alt="Preview"
                            className="h-full w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              onChange(null);
                            }}
                            className="absolute right-0 top-0 rounded-bl bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                          </button>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            setPreview(URL.createObjectURL(file));
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
              {isLoading ? "Saving..." : "Create Brand"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
}