# TypeScript Cheat Sheet

## Type vs Interface

```ts
type User = { id: number; name: string };
interface Product { id: number; name: string }

interface Dog extends Animal { breed: string }      // interface: extends
type DogType = AnimalType & { breed: string };       // type: intersection
```

`interface` merges on redeclaration; `type` can alias unions, tuples, primitives.

## Union Types

```ts
let id: string | number;

function printId(id: string | number) {
  if (typeof id === "number") id.toFixed(2);
  else id.toUpperCase();
}
```

## Literal Types

```ts
type Status = "active" | "inactive" | "banned";
const config = { method: "GET" } as const; // keeps literal type
```

## Optional Properties

```ts
interface User {
  id: number;
  nickname?: string; // may be omitted, type includes undefined
}
```

## readonly

```ts
interface Point { readonly x: number }
const numbers: readonly number[] = [1, 2, 3];
type ReadonlyUser = Readonly<User>;
```

Compile-time only — pair with `Object.freeze()` for runtime immutability.

## Function Typing

```ts
function add(a: number, b: number): number { return a + b; }
type MathOperation = (a: number, b: number) => number;

function parseInput(value: string): string[];
function parseInput(value: number): number;
function parseInput(value: string | number): string[] | number { /* ... */ }
```

## Type Narrowing

```ts
if (typeof value === "string") { /* value: string */ }
if (value instanceof Error) { /* value: Error */ }
if ("meow" in animal) { /* animal: Cat */ }
if (Array.isArray(value)) { /* value: T[] */ }
```

## Type Guards

```ts
function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}
```

Return type `x is Type` is what makes TypeScript narrow after the call.

## keyof

```ts
interface User { id: number; name: string }
type UserKey = keyof User; // "id" | "name"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

`keyof typeof someObject` for plain object values.

## Generics

```ts
function identity<T>(value: T): T { return value; }
interface ApiResponse<T> { status: number; data: T }
class Box<T> { constructor(private value: T) {} }
```

## Generic Constraints

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}
```

`T extends Shape` restricts what `T` can be.

## Utility Types

| Utility | Effect |
| --- | --- |
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties read-only |
| `Pick<T, K>` | Keep only keys `K` |
| `Omit<T, K>` | Remove keys `K` |
| `Record<K, T>` | Object type from keys + value type |
| `Exclude<T, U>` | Remove union members matching `U` |
| `Extract<T, U>` | Keep union members matching `U` |
| `NonNullable<T>` | Remove `null`/`undefined` |
| `ReturnType<T>` | Function's return type |
| `Parameters<T>` | Function's parameter tuple |

## Discriminated Unions

```ts
type ApiResponse =
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function handle(r: ApiResponse) {
  if (r.status === "success") r.data;
  else r.message;
}
```

Exhaustiveness check:

```ts
default:
  const _check: never = value;
  return _check;
```

## unknown vs any

```ts
let a: any;     // no checks at all, assignable anywhere
let u: unknown; // must narrow before use or assignment

if (typeof u === "string") u.toUpperCase(); // OK after narrowing
```

Use `unknown` for external data and `catch` blocks; avoid `any`.

## Type Assertions

```ts
const value = data as string;
const el = document.getElementById("x") as HTMLInputElement;
const el2 = document.getElementById("x")!; // non-null assertion
const value2 = data as unknown as number;  // double assertion (rare, risky)
```

Compile-time only — no runtime conversion or check.
