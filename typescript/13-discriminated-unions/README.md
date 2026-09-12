# Discriminated Unions

A discriminated union is a union of object types that share a common literal property (the "discriminant"), which TypeScript uses to narrow the type precisely.

Simple definition:

```txt
Discriminated union = a union of object shapes, each tagged with a shared literal property that identifies which shape it is
```

## Building One

```ts
interface SuccessResponse {
  status: "success";
  data: string[];
}

interface ErrorResponse {
  status: "error";
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;
```

`status` is the discriminant: it's a literal type (`"success"` or `"error"`) present on every member of the union.

## Narrowing with the Discriminant

```ts
function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    console.log(response.data);   // narrowed to SuccessResponse
  } else {
    console.log(response.message); // narrowed to ErrorResponse
  }
}
```

A `switch` works too, and is common with more than two variants:

```ts
function describe(response: ApiResponse): string {
  switch (response.status) {
    case "success":
      return `Got ${response.data.length} items`;
    case "error":
      return `Failed: ${response.message}`;
  }
}
```

## More Than Two Variants

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  side: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

## Exhaustiveness Checking

Adding a `default` branch that assigns to a `never`-typed variable makes TypeScript flag any unhandled variant at compile time — very useful when a new variant is added later.

```ts
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

If a new shape (say `Triangle`) is added to `Shape` and this `switch` isn't updated, TypeScript errors on `_exhaustiveCheck` because `shape` is no longer `never` in the `default` branch.

## Backend Example

```ts
type PaymentEvent =
  | { type: "payment_succeeded"; orderId: number; amount: number }
  | { type: "payment_failed"; orderId: number; reason: string }
  | { type: "payment_refunded"; orderId: number; amount: number };

function handlePaymentEvent(event: PaymentEvent) {
  switch (event.type) {
    case "payment_succeeded":
      console.log(`Order ${event.orderId} paid ${event.amount}`);
      break;
    case "payment_failed":
      console.log(`Order ${event.orderId} failed: ${event.reason}`);
      break;
    case "payment_refunded":
      console.log(`Order ${event.orderId} refunded ${event.amount}`);
      break;
  }
}
```

## Common Mistakes

### Mistake 1: Using a non-literal, non-unique discriminant

```ts
interface A { kind: string; a: number }
interface B { kind: string; b: number }
// kind: string is too broad to narrow between A and B
```

The discriminant must be a literal type (like `"circle"`), not the general `string`.

### Mistake 2: Skipping exhaustiveness checks

Without a `never`-typed `default` branch, adding a new variant to the union silently compiles even if no code path handles it, which can cause a runtime bug (like a payment event being ignored).

### Mistake 3: Mixing optional properties instead of a discriminated union

```ts
interface Response {
  status: "success" | "error";
  data?: string[];
  message?: string;
} // both data and message are optional everywhere, so nothing enforces
  // that 'success' responses actually have 'data'
```

A proper discriminated union (separate `SuccessResponse`/`ErrorResponse` interfaces joined with `|`) enforces the correct fields per variant.

## Exercise

1. Model `type LoadingState<T> = { status: "loading" } | { status: "success"; data: T } | { status: "error"; error: string }` and write a function `render(state: LoadingState<string>)` that returns an appropriate message for each state.
2. Add exhaustiveness checking (a `never`-typed variable in the `default`/last branch) to the `render` function from exercise 1.
3. Model three event types for a chat app — `MessageSent`, `UserJoined`, `UserLeft` — as a discriminated union on a `type` field, and write a function that logs a different message for each.

## Interview Answer

A discriminated union is a union of object types that all share one common property with a distinct literal value, called the discriminant (often named `type`, `kind`, or `status`). Because the discriminant is a literal type rather than a general `string`, TypeScript can narrow the union to the exact matching variant after checking that property with an `if` or `switch`, giving safe access to properties unique to that variant. Discriminated unions are widely used to model API responses (success vs. error), UI state (loading, success, error), and domain events, and pairing them with an exhaustiveness check (assigning the remaining value to a `never`-typed variable in a default case) catches unhandled variants at compile time when new ones are added.
