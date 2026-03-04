import * as z from "zod"

export const brandSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sortOrder: z.number().min(1, "Sort order must be at least 1"),
  imageFile: z.instanceof(File, { message: "Image is required" }).nullable(),

})