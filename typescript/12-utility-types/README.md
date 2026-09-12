# Utility Types

TypeScript ships built-in generic types that transform an existing type into a new one, so you don't have to redeclare shapes manually.

Simple definition:

```txt
Utility type = a built-in generic helper that transforms one type into another
```

## `Partial<T>`

Makes every property optional.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

function updateUser(id: number, changes: Partial<User>) {
  // changes can include any subset of User's properties
}

updateUser(1, { name: "New Name" });
```

## `Required<T>`

Makes every property required, removing `?`.

```ts
interface Options {
  timeout?: number;
  retries?: number;
}

const fullOptions: Required<Options> = { timeout: 3000, retries: 3 };
```

## `Readonly<T>`

Makes every property read-only. See [readonly](../05-readonly/README.md).

```ts
const user: Readonly<User> = { id: 1, name: "Rahim", email: "r@test.com" };
// user.name = "Karim"; // Error
```

## `Pick<T, K>`

Builds a new type using only the selected keys.

```ts
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }
```

## `Omit<T, K>`

Builds a new type excluding the selected keys.

```ts
type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string }
```

## `Record<K, T>`

Builds an object type with keys `K` and values of type `T`.

```ts
type RolePermissions = Record<"admin" | "editor" | "viewer", string[]>;

const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};
```

## `Exclude<T, U>` and `Extract<T, U>`

```ts
type Status = "pending" | "active" | "banned" | "deleted";

type ActiveStatus = Exclude<Status, "banned" | "deleted">; // "pending" | "active"
type InactiveStatus = Extract<Status, "banned" | "deleted">; // "banned" | "deleted"
```

## `NonNullable<T>`

Removes `null` and `undefined` from a type.

```ts
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string
```

## `ReturnType<T>` and `Parameters<T>`

```ts
function createUser(name: string, age: number) {
  return { name, age, id: Date.now() };
}

type NewUser = ReturnType<typeof createUser>;
// { name: string; age: number; id: number }

type CreateUserArgs = Parameters<typeof createUser>;
// [name: string, age: number]
```

## Backend Example

```ts
interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

type PublicUser = Omit<User, "passwordHash">;

function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

type UpdateUserDto = Partial<Pick<User, "name" | "email">>;

function updateUser(id: number, dto: UpdateUserDto) {
  // apply partial changes
}
```

## Quick Reference

| Utility | What it does |
| --- | --- |
| `Partial<T>` | Makes all properties optional |
| `Required<T>` | Makes all properties required |
| `Readonly<T>` | Makes all properties read-only |
| `Pick<T, K>` | Keeps only selected keys |
| `Omit<T, K>` | Removes selected keys |
| `Record<K, T>` | Builds an object type from keys and a value type |
| `Exclude<T, U>` | Removes members of a union that match `U` |
| `Extract<T, U>` | Keeps only members of a union that match `U` |
| `NonNullable<T>` | Removes `null` and `undefined` |
| `ReturnType<T>` | Gets a function's return type |
| `Parameters<T>` | Gets a function's parameter types as a tuple |

## Common Mistakes

### Mistake 1: Manually rewriting a type instead of deriving it

```ts
interface UpdateUserDto {
  name?: string;
  email?: string;
} // duplicated and can drift from User

type UpdateUserDto = Partial<Pick<User, "name" | "email">>; // derived, stays in sync
```

### Mistake 2: Confusing `Omit` and `Exclude`

`Omit<T, K>` works on object types and removes keys. `Exclude<T, U>` works on union types and removes matching members.

### Mistake 3: Forgetting `Partial<T>` doesn't make nested objects partial

```ts
interface User {
  address: { city: string; zip: string };
}

type PartialUser = Partial<User>;
// address is optional, but if present, still requires both city and zip
```

## Exercise

1. Given `interface Post { id: number; title: string; content: string; authorId: number }`, create `type CreatePostDto = Omit<Post, "id">` and `type UpdatePostDto = Partial<CreatePostDto>`.
2. Create `type Weekday = "mon" | "tue" | "wed" | "thu" | "fri"` and use `Record<Weekday, boolean>` to type an object representing which days a store is open.
3. Given a function `function findUser(id: number, includeDeleted: boolean) { return { id }; }`, derive its argument tuple type with `Parameters` and its return type with `ReturnType`, without retyping them manually.

## Interview Answer

Utility types are built-in generic types that transform an existing type instead of requiring a new one to be written from scratch. Common ones include `Partial<T>` and `Required<T>` for toggling optionality, `Readonly<T>` for immutability, `Pick<T, K>` and `Omit<T, K>` for selecting or excluding object keys, `Record<K, T>` for building key-value object types, `Exclude<T, U>`/`Extract<T, U>` for filtering union members, and `ReturnType<T>`/`Parameters<T>` for deriving types from existing functions. They are especially useful in backend code for deriving DTOs (like update or create payloads) directly from an entity type, keeping them in sync automatically instead of duplicating field definitions.
