import * as z from "zod"

export const categorySchema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    sortOrder: z.number().min(1, "Sort order must be at least 1"),
    parentCategoryId: z.string().nullable().optional(),
    imageFile: z.instanceof(File, { message: "Image is required" }).nullable().optional(),
})
