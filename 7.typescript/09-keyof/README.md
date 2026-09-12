# keyof

The `keyof` operator produces a union of the property names (keys) of a type.

Simple definition:

```txt
keyof SomeType = a union of all the property name strings of SomeType
```

## Basic Syntax

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKey = keyof User; // "id" | "name" | "email"

const key: UserKey = "name"; // OK
// const invalid: UserKey = "age"; // Error
```

## `keyof` for Safe Property Access

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Rahim", email: "rahim@test.com" };

const name = getProperty(user, "name"); // string
const id = getProperty(user, "id");     // number
// getProperty(user, "age");            // Error: "age" is not a key of user
```

This pairs `keyof` with [generics](../10-generics/README.md) and [generic constraints](../11-generic-constraints/README.md).

## `keyof` with `typeof`

`keyof typeof` gets the keys of an existing object's inferred type, without writing a separate interface.

```ts
const roles = {
  admin: "ADMIN",
  editor: "EDITOR",
  viewer: "VIEWER",
} as const;

type RoleKey = keyof typeof roles; // "admin" | "editor" | "viewer"
type RoleValue = (typeof roles)[RoleKey]; // "ADMIN" | "EDITOR" | "VIEWER"
```

## `keyof` with Index Signatures

```ts
interface StringMap {
  [key: string]: string;
}

type StringMapKey = keyof StringMap; // string | number
```

For an index signature, `keyof` includes `number` as well, because in JavaScript numeric object keys are coerced to strings.

## Backend Example

```ts
interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
}

function updateField<K extends keyof UpdateUserDto>(
  dto: UpdateUserDto,
  field: K,
  value: UpdateUserDto[K]
) {
  dto[field] = value;
}

const dto: UpdateUserDto = {};
updateField(dto, "name", "Rahim");
updateField(dto, "age", 25);
// updateField(dto, "age", "25"); // Error: string not assignable to number
```

## Common Mistakes

### Mistake 1: Hardcoding key names as plain `string`

```ts
function getProperty(obj: any, key: string) {
  return obj[key]; // no safety, and return type is 'any'
}
```

Using `keyof` instead gives both key validation and a correctly typed return value.

### Mistake 2: Forgetting `keyof typeof` for plain objects

```ts
const colors = { red: "#f00", green: "#0f0" };
type ColorKey = keyof colors; // Error: 'colors' refers to a value, not a type
type ColorKey = keyof typeof colors; // Correct
```

### Mistake 3: Assuming `keyof` always returns only `string`

An index signature (`[key: string]: T`) makes `keyof` include `number` too, since JS allows numeric-looking string keys.

## Exercise

1. Given `interface Product { id: number; name: string; price: number }`, write `type ProductKey = keyof Product` and list the resulting union.
2. Write a generic function `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` that extracts one property from an array of objects.
3. Create a plain object `httpStatusMessages` mapping numeric-looking keys to messages, derive its key type with `keyof typeof`, and write a function that only accepts those keys.

## Interview Answer

`keyof` is a TypeScript operator that takes an object type and produces a union type of its property names as string (and sometimes number) literals. It is commonly combined with generics to write functions that access object properties safely, such as `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`, which only accepts a key that actually exists on the object and returns the correctly typed value. For plain JavaScript objects rather than declared types, `keyof typeof someObject` is used to derive the key union from the object's inferred shape.
