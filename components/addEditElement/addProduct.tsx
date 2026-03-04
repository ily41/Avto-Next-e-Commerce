"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddProductMutation } from "@/lib/store/products/apislice" 
import { productSchema } from "./addProductSchema" // Import from above
import * as z from "zod"

// UI Components (Shadcn)
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner" // Better than alert()
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "../ui/switch"

export function AddProductPopup() {
  const [open, setOpen] = useState(false)
  
  // 1. Hook into the RTK Mutation
  const [addProduct, { isLoading }] = useAddProductMutation()

  // 2. Initialize Form
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0.01,
      stockQuantity: 0,
      isHotDeal: false,
    },
  })

  // 3. Handle Submit
  async function onSubmit(values: z.infer<typeof productSchema>) {
    try {
      // .unwrap() allows us to use the catch block for API errors
      await addProduct(values).unwrap()
      
      toast.success("Product added!")
      form.reset() 
      setOpen(false) // Close the popup only on success
    } catch (err) {
      toast.error("Something went wrong. Please check your inputs.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Field Example: Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input placeholder="iPhone 15" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field Example: Price (Numeric) */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
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
                    <Input placeholder="Describe your product..." {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder="e.g. LAPTOP-123" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* You would usually map your categories from the API here */}
                      <SelectItem value="some-uuid-here">Electronics</SelectItem>
                      <SelectItem value="another-uuid-here">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isHotDeal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hot Deal</FormLabel>
                    <div className="text-sm text-muted-foreground text-opacity-70">
                      Mark this product as a featured promotion.
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



            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}