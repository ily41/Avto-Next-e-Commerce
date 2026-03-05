import * as z from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    shortDescription: z.string().min(1, "Short description is required"),
    sku: z.string().min(1, "SKU is required"),
    isHotDeal: z.boolean().default(false),
    stockQuantity: z.number().int().min(0),
    categoryId: z.string().min(1, "Category is required"),
    brandId: z.string().min(1, "Brand is required"),
    price: z.number().min(0),
    discountedPrice: z.number().min(0),
    isActive: z.boolean().default(true),
    imageFile: z.any().optional(),
    detailImageFiles: z.array(z.any()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
