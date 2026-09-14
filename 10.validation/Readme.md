# What is validation?

- Checking whether incoming data satisfies the rules your application requires

## Why TypeScript alone isn't enough?

- Because TypeScript works primarily at compile time
- The request arrives at runtime

- JavaScript runtime doesn't care my typescript interface.
- my interface disappears after TypeScript compilation

- That's why we need runtime validation

## ZOD

- Zod is a TypeScript-first schema validation library
- describe the shape of valid data using a schema, then Zod checks actual runtime data against that schema
- Suppose the object is
```ts
 {
    "name": "iPhone",
    "price": 1000,
    "stock": 10
}
```

- we define {
    "name": "iPhone",
    "price": 1000,
    "stock": 10
}

## Parsing data

- const result = productSchema.safeParse(req.body)
- Zod checks the actual runtime data

```ts
if valid then {
    success: true,
    data: ...
}

 if invalid then {
    success: false,
    error: ...
}
```

## parse() vs safeParse()

- zod provides schema.parse(req.body) and schema.safeparse(req.body)
- parse return parsed data if valid or throw an error
- safeparse result result  

- parse 

```ts
try {
    const data = schema.parse(req.body);
} catch (error) {
    // validation failed
}

`safeparse` 
const result = schema.safeParse(req.body);

if (!result.success) {
    // validation failed
}

const data = result.data;
```

## Create a validation middleware

```ts 
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodType) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.issues
            });
        }

        req.body = result.data;

        next();
    };
};

//schema
const createProductSchema = z.object({
    name: z.string().min(3),
    price: z.number().positive(),
    stock: z.number().int().nonnegative()
});

//use it in route
router.post(
    "/",
    validate(createProductSchema),
    addProduct
);

```

## Infer TypeScript types from Zod

```ts

interface CreateProduct {
    name: string;
    price: number;
    stock: number;
}

//instead of writting this, we can write

const createProductSchema = z.object({
    name: z.string().min(3),
    price: z.number().positive(),
    stock: z.number().int().nonnegative()
});

type CreateProduct = z.infer<typeof createProductSchema>;

```

## z.coerce — very important for query parameters

- Convert the input to a number, then validate it as a number cause by default all query became string 
