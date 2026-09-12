# Type Assertions

A type assertion tells the TypeScript compiler "trust me, I know this value's type," without changing the value at runtime.

Simple definition:

```txt
Type assertion = overriding TypeScript's inferred type with the type you (the developer) claim it is
```

## Basic Syntax

```ts
const value: unknown = "hello";

const strLength: number = (value as string).length;
```

Alternative angle-bracket syntax (not usable in `.tsx` files):

```ts
const strLength2: number = (<string>value).length;
```

## Type Assertions Are Compile-Time Only

Assertions do not convert or validate the value at runtime — they only change what the compiler believes.

```ts
const value = "hello" as unknown as number;

console.log(value.toFixed(2)); // compiles, but crashes at runtime:
// TypeError: value.toFixed is not a function
```

## Common Case: DOM Elements

```ts
const input = document.getElementById("username") as HTMLInputElement;
console.log(input.value);
```

Without the assertion, `getElementById` returns `HTMLElement | null`, which doesn't have `.value`.

## Common Case: Narrowing `unknown` from JSON

```ts
interface User {
  id: number;
  name: string;
}

const data: unknown = JSON.parse('{"id":1,"name":"Rahim"}');
const user = data as User;

console.log(user.name);
```

This is unsafe if the JSON doesn't actually match `User` — prefer a [type guard](../08-type-guards/README.md) when correctness matters.

## `as const`

`as const` asserts that a value's properties should be treated as literal, read-only types, rather than being widened.

```ts
const config = {
  method: "GET",
  timeout: 3000,
} as const;

// config.method: "GET" (literal), not string
// config is fully readonly
```

See [literal types](../03-literal-types/README.md) for more on this.

## Non-null Assertion (`!`)

The `!` operator asserts that a value is not `null` or `undefined`.

```ts
function getElement(id: string): HTMLElement {
  return document.getElementById(id)!; // asserting it will exist
}
```

This is risky — if the assertion is wrong, the error surfaces later as a runtime crash instead of a compile-time warning.

## Double Assertion (`as unknown as X`)

Used when TypeScript considers two types too unrelated for a direct assertion.

```ts
interface Cat { meow(): void }
interface Dog { bark(): void }

const cat = {} as Cat;
const dog = cat as unknown as Dog; // forces past TypeScript's overlap check
```

Double assertions should be rare — they usually indicate a design or typing problem worth revisiting.

## Type Assertion vs Type Casting (Important Distinction)

TypeScript's `as` does **not** convert values like some languages' "casting" does.

```ts
const value = "123" as number; // Error: string and number don't overlap enough

const value2 = Number("123");  // actual runtime conversion — use this instead
```

## Backend Example

```ts
interface AuthenticatedRequest extends Request {
  user: { id: number; email: string };
}

function handler(req: Request) {
  const authReq = req as AuthenticatedRequest; // asserting middleware already attached `user`
  console.log(authReq.user.id);
}
```

This pattern is common with Express middleware, but it's only as safe as the assumption that the middleware actually ran first.

## Common Mistakes

### Mistake 1: Using assertions to silence real type errors

```ts
const total = (order.total as number) + 10; // hides a real bug if total might be undefined
```

Fix the underlying type or add a proper check instead of asserting past it.

### Mistake 2: Overusing non-null assertions (`!`)

Each `!` is an unchecked promise to the compiler. If wrong, it becomes a runtime `TypeError` instead of a caught compile error.

### Mistake 3: Confusing assertions with validation

```ts
const user = JSON.parse(json) as User; // no guarantee this is actually a User
```

For data from outside the program (APIs, files, user input), prefer a type guard or a validation library over a bare assertion.

## Exercise

1. Given `const value: unknown = 42`, write an assertion to treat it as `number` and call `.toFixed(2)` on it.
2. Explain, with an example, why `const n = "42" as number` fails to compile while `const n = "42" as unknown as number` compiles — and why the second one is dangerous.
3. Write a small Express-style example where `req` is asserted to a custom `AuthenticatedRequest` type, then note in a comment what could go wrong if the assumption is false.

## Interview Answer

A type assertion, written as `value as Type` (or `<Type>value` outside `.tsx` files), tells the compiler to treat a value as a specific type without performing any runtime conversion or check — it only affects what TypeScript believes at compile time. This differs from casting in other languages, which actually converts the value; an incorrect TypeScript assertion compiles fine but can crash at runtime. Assertions are useful in specific situations like typing DOM elements, narrowing `unknown` values from JSON, or `as const` for literal, read-only values, but they should be used sparingly and never as a substitute for real validation or type guards when the value's shape truly isn't guaranteed.
