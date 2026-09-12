# Type vs Interface

TypeScript gives two ways to describe the shape of an object: `type` aliases and `interface` declarations.

Simple definition:

```txt
type = a name for any kind of type (object, union, primitive, tuple, function, etc.)
interface = a name for the shape of an object or class, and it can be extended
```

## Basic Syntax

```ts
type User = {
  id: number;
  name: string;
};

interface Product {
  id: number;
  name: string;
}
```

Both usages above look almost identical, and for simple object shapes they behave the same way.

## Extending

`interface` uses `extends`. `type` uses intersection (`&`).

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

type AnimalType = {
  name: string;
};

type DogType = AnimalType & {
  breed: string;
};
```

## Declaration Merging

Interfaces with the same name automatically merge. Type aliases cannot be redeclared.

```ts
interface Config {
  timeout: number;
}

interface Config {
  retries: number;
}

// Config is now { timeout: number; retries: number }
const settings: Config = { timeout: 3000, retries: 3 };
```

```ts
type Config = { timeout: number };
type Config = { retries: number }; // Error: Duplicate identifier 'Config'
```

## Only `type` Can Describe Non-Object Shapes

```ts
type ID = string | number;          // union
type Status = "active" | "inactive"; // literal union
type Point = [number, number];       // tuple
type Callback = (value: string) => void; // function type
```

`interface` cannot represent a union, a primitive alias, or a tuple directly.

## Backend Example

```ts
interface UserEntity {
  id: number;
  email: string;
  createdAt: Date;
}

type UserRole = "admin" | "customer" | "guest";

interface AuthenticatedUser extends UserEntity {
  role: UserRole;
}

function greet(user: AuthenticatedUser): string {
  return `Hello ${user.email}, role: ${user.role}`;
}
```

## When to Use Which

| Situation | Prefer |
| --- | --- |
| Public API shape of an object or class | `interface` |
| Library authors who expect consumers to extend/merge | `interface` |
| Union, tuple, primitive alias, mapped/conditional type | `type` |
| Function type alias | `type` |
| No strong reason either way | Team convention (often `type` for consistency) |

## Common Mistakes

### Mistake 1: Thinking `type` and `interface` are always interchangeable

They overlap for plain object shapes, but unions, tuples, and primitive aliases only work with `type`.

### Mistake 2: Expecting `type` to merge like `interface`

```ts
type A = { x: number };
type A = { y: number }; // Error
```

### Mistake 3: Forgetting interfaces can only describe object-like shapes

```ts
interface ID = string | number; // Invalid syntax
```

## Exercise

1. Create an `interface Book` with `title: string` and `author: string`.
2. Create an `interface PaperBook extends Book` that adds `pages: number`.
3. Rewrite both using `type` and `&` intersection instead of `interface`/`extends`.
4. Create a `type BookFormat = "hardcover" | "paperback" | "ebook";` and add a `format: BookFormat` field to your type version. Explain why this line could not be written using only `interface`.

## Interview Answer

`type` and `interface` can both describe object shapes and are interchangeable in many everyday cases, but they have different capabilities. `interface` supports declaration merging (multiple declarations with the same name combine) and is extended with `extends`, which makes it a common choice for public object and class shapes, especially in libraries. `type` can alias any type, including unions, tuples, primitives, and function types, and is combined using intersections (`&`) instead of merging. In practice, teams often default to `interface` for object shapes that may be extended, and `type` for unions, tuples, or more complex type expressions.

## exercise solution
 
```ts
interface Book {
  title : string;
  author : string;
}

interface PaperBook extends Book {
  pages : number
}

const book1:PaperBook = {
  title : "Machine Learning",
  author : "Andrew Ng",
  pages: 1000,
};
type Bookformat =  "hardcover" | "paperback" | "ebook"
type Book = {
  title : string;
  author : string;
  format : Bookformat;
}

type PaperBook = Book & {
  pages : number;
}

const book1:PaperBook = {
  title : "Machine learning",
  author : "Andrew Ng",
  format : "ebook",
  pages: 1200,
  
}
 console.log(book1)
```