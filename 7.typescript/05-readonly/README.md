# readonly

`readonly` marks a property so it can be set once (usually at creation) and never reassigned afterward.

Simple definition:

```txt
readonly = "this property can be read anytime, but not written to after it is set"
```

## Basic Syntax

```ts
interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: "Rahim" };

user.name = "Karim"; // OK
user.id = 2;         // Error: Cannot assign to 'id' because it is a read-only property
```

## `readonly` Is Compile-Time Only

`readonly` is enforced by the TypeScript compiler, not at runtime. Compiled JavaScript has no protection.

```ts
// After compiling to JS, nothing stops `user.id = 2` at runtime.
```

For real runtime immutability, use `Object.freeze()` alongside `readonly`.

## `readonly` Arrays and Tuples

```ts
const numbers: readonly number[] = [1, 2, 3];

numbers.push(4);     // Error: push does not exist on readonly array
numbers[0] = 10;     // Error: Index signature is readonly

const point: readonly [number, number] = [10, 20];
point[0] = 5; // Error
```

`ReadonlyArray<T>` is equivalent to `readonly T[]`.

## `Readonly<T>` Utility Type

```ts
interface User {
  id: number;
  name: string;
}

type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = { id: 1, name: "Rahim" };
user.name = "Karim"; // Error
```

See [utility types](../12-utility-types/README.md) for more on `Readonly<T>`.

## `readonly` Only Protects the Immediate Property

```ts
interface Order {
  readonly items: string[];
}

const order: Order = { items: ["book"] };

order.items = ["pen"];   // Error: cannot reassign items
order.items.push("pen"); // OK: array contents can still change
```

Use `readonly string[]` to also block mutation of the array contents:

```ts
interface Order {
  readonly items: readonly string[];
}
```

## Backend Example

```ts
interface Config {
  readonly apiKey: string;
  readonly maxRetries: number;
}

function loadConfig(): Config {
  return { apiKey: process.env.API_KEY ?? "", maxRetries: 3 };
}

const config = loadConfig();
config.maxRetries = 5; // Error: protects config from accidental mutation
```

## Common Mistakes

### Mistake 1: Believing `readonly` gives runtime protection

`readonly` disappears when TypeScript compiles to JavaScript. Compiled code can still mutate the property unless you also use `Object.freeze()`.

### Mistake 2: Assuming `readonly` deeply freezes nested objects

```ts
interface Wrapper {
  readonly data: { count: number };
}

const wrapper: Wrapper = { data: { count: 0 } };
wrapper.data.count = 5; // OK, nested property is not readonly
```

### Mistake 3: Confusing `readonly` properties with `const` variables

`const` prevents reassigning a variable binding; `readonly` prevents reassigning a property on an object. Neither one deeply freezes nested data by itself.

## Exercise

1. Define an `interface Point { readonly x: number; readonly y: number }`, create a point, and show the line that fails to compile when you try to change `x`.
2. Create a `readonly string[]` list of allowed roles and try (in comments) both a reassignment and a `.push()` call, noting which lines fail.
3. Use the `Readonly<T>` utility type to make an existing `interface Settings { theme: string; language: string }` fully read-only without rewriting each field manually.

## Interview Answer

`readonly` marks a property, array, or tuple element so it can be assigned only once, typically during object creation, and cannot be reassigned afterward; TypeScript reports a compile error on later assignments. It is a compile-time-only guarantee — the generated JavaScript has no protection, so true runtime immutability needs `Object.freeze()` as well. `readonly` also only protects the property itself, not nested objects, unless those are also marked `readonly`. The `Readonly<T>` utility type applies `readonly` to every property of an existing type without redeclaring it manually.
