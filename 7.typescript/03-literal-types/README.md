# Literal Types

A literal type is a type made from an exact value instead of a general type like `string` or `number`.

Simple definition:

```txt
Literal type = "this must be exactly this value", not just "any string" or "any number"
```

## Basic Syntax

```ts
let direction: "up" | "down" | "left" | "right";

direction = "up";
// direction = "north"; // Error
```

## String, Number, and Boolean Literals

```ts
type Yes = "yes";
type StatusCode = 200 | 201 | 400 | 404 | 500;
type IsActive = true;
```

## Why Not Just Use `string`?

```ts
function setStatus(status: string) {
  // any string is allowed, including typos
}

setStatus("actvie"); // typo, but TypeScript allows it
```

```ts
type Status = "active" | "inactive" | "banned";

function setStatus(status: Status) {
  // only these three exact strings are allowed
}

setStatus("actvie"); // Error: not assignable to type 'Status'
```

## `const` and Literal Widening

By default, `let` widens literals to their general type, while `const` keeps the literal type.

```ts
let role = "admin";      // type is widened to string
const role2 = "admin";   // type is the literal "admin"
```

Use `as const` to keep an object's values as literal types:

```ts
const config = {
  method: "GET",
} as const;

// config.method has type "GET", not string
```

## Literal Types with Objects

```ts
type Method = "GET" | "POST" | "PUT" | "DELETE";

interface RequestConfig {
  url: string;
  method: Method;
}

const request: RequestConfig = {
  url: "/users",
  method: "GET",
};
```

## Backend Example

```ts
type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: number;
  status: OrderStatus;
}

function canCancel(order: Order): boolean {
  return order.status === "pending" || order.status === "paid";
}
```

## Common Mistakes

### Mistake 1: Using `string` when a fixed set of values is intended

```ts
function setRole(role: string) {} // allows any typo
function setRole(role: "admin" | "editor" | "viewer") {} // safer
```

### Mistake 2: Forgetting that plain object literals widen inferred string properties

```ts
function move(direction: "up" | "down") {}

const options = { direction: "up" };
move(options.direction); // Error: type is widened to string
```

Fix with `as const` or an explicit type annotation.

### Mistake 3: Overusing literal unions for values that truly vary

Literal types work best for a small, fixed, known set of values, not for arbitrary user input like names or emails.

## Exercise

1. Write a type `TrafficLight = "red" | "yellow" | "green"` and a function `next(light: TrafficLight): TrafficLight` that returns the next light in the cycle.
2. Create an object `httpConfig` with a `method` property set to `"GET"`, using `as const` so `method` keeps its literal type instead of widening to `string`.
3. Define `type HttpStatus = 200 | 400 | 401 | 404 | 500` and write a function `isError(code: HttpStatus): boolean` that returns `true` for 400 and above.

## Interview Answer

A literal type narrows a type down to one exact value, such as the string `"active"` or the number `200`, instead of the general `string` or `number` type. Literal types are usually combined into a union, like `"pending" | "paid" | "shipped"`, to represent a fixed, known set of allowed values, which catches typos and invalid values at compile time. `const` declarations keep literal types, while `let` widens them to their general type unless annotated; `as const` can be used to keep object properties as literal types as well.
