import {z} from 'zod';

export const productSchema = z.object({
    name : z.string().min(3,"Required minimum 3 character"),
    price: z.number().positive("Price cannot be negative"),
    stock : z.number().int().nonnegative("stock cannot be negative"),
    category:z.enum(["electronics","clocting","food","books","bike"])

    
})

export type createProduct = z.infer<typeof productSchema>