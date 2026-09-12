# Generics

Generics let you write reusable functions, interfaces, and classes that work with a type decided at the point of use, instead of a fixed, specific type.

Simple definition:

```txt
Generic = a type placeholder that gets filled in later, based on how the code is used
```

## Basic Generic Function

```ts
function identity<T>(value: T): T {
  return value;
}

const a = identity<string>("hello"); // T is string
const b = identity(42);              // T is inferred as number
```

`T` is a type parameter — a placeholder name (any name works, `T` is just a convention).

## Without Generics (the Problem)

```ts
function identity(value: any): any {
  return value; // loses the specific type; caller gets 'any' back
}

const result = identity("hello"); // result: any, no autocomplete, no safety
```

## Generic Arrays

```ts
function firstElement<T>(items: T[]): T | undefined {
  return items[0];
}

const first = firstElement([1, 2, 3]);     // number | undefined
const firstName = firstElement(["a", "b"]); // string | undefined
```

## Multiple Type Parameters

```ts
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const result = pair("id", 1); // [string, number]
```

## Generic Interfaces

```ts
interface ApiResponse<T> {
  status: number;
  data: T;
}

const userResponse: ApiResponse<{ id: number; name: string }> = {
  status: 200,
  data: { id: 1, name: "Rahim" },
};

const listResponse: ApiResponse<string[]> = {
  status: 200,
  data: ["a", "b"],
};
```

## Generic Classes

```ts
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const numberBox = new Box<number>(10);
const stringBox = new Box("hello"); // T inferred as string
```

## Default Generic Type

```ts
interface Pagination<T = unknown> {
  page: number;
  items: T[];
}

const page: Pagination<string> = { page: 1, items: ["a"] };
const genericPage: Pagination = { page: 1, items: [] }; // T defaults to unknown
```

## Backend Example

```ts
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}

interface User {
  id: number;
  name: string;
}

class UserRepository implements Repository<User> {
  async findById(id: number): Promise<User | null> {
    return { id, name: "Rahim" };
  }

  async save(entity: User): Promise<User> {
    return entity;
  }
}
```

## Common Mistakes

### Mistake 1: Using `any` instead of a generic

`any` throws away type information entirely. A generic keeps the relationship between input and output types.

### Mistake 2: Adding generics where they aren't needed

```ts
function double<T>(value: T): T {
  return value; // T is unused meaningfully; this should just be number
}

function double(value: number): number {
  return value * 2;
}
```

Only use a generic when the type actually varies and needs to be tracked.

### Mistake 3: Forgetting type inference often makes explicit `<T>` unnecessary

```ts
identity<string>("hello"); // explicit, usually unnecessary
identity("hello");         // inferred automatically
```

## Exercise

1. Write a generic function `wrapInArray<T>(value: T): T[]` that returns a one-element array.
2. Write a generic interface `Result<T>` with `success: boolean` and `data: T`, then create two example objects with different `T` values.
3. Write a generic class `Stack<T>` with `push(item: T): void`, `pop(): T | undefined`, and `peek(): T | undefined`.

## Interview Answer

Generics let a function, interface, or class be written once and reused with different types, using a type parameter (commonly named `T`) that gets filled in either explicitly or through inference at the call site. Unlike `any`, which discards type information, a generic preserves the relationship between input and output types — a generic `identity<T>(value: T): T` returns exactly the type it was given. Generics are widely used for reusable containers (arrays, `Promise<T>`, custom `Box<T>` classes), API response wrappers like `ApiResponse<T>`, and repository or service patterns where the same logic applies to different entity types.
