import * as z from "zod"

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is too short"),
  sku: z.string().min(3, "SKU is required"),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  stockQuantity: z.coerce.number().int().min(0),
  categoryId: z.string().uuid("Please select a category"),
  brandId: z.string().uuid("Please select a brand"),
  isHotDeal: z.boolean().default(false),
})