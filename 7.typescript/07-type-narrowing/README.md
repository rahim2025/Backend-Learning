# Type Narrowing

Type narrowing is how TypeScript reduces a broader type (usually a union) down to a more specific type based on runtime checks in your code.

Simple definition:

```txt
Narrowing = TypeScript figuring out the more specific type after a check like `typeof`, `instanceof`, or `in`
```

## `typeof` Narrowing

```ts
function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // value is string here
  } else {
    console.log(value.toFixed(2)); // value is number here
  }
}
```

## Truthiness Narrowing

```ts
function printName(name?: string) {
  if (name) {
    console.log(name.toUpperCase()); // name is string, not undefined
  } else {
    console.log("No name provided");
  }
}
```

## Equality Narrowing

```ts
function compare(a: string | number, b: string | boolean) {
  if (a === b) {
    // a and b are both narrowed to string here,
    // the only type they could share
    console.log(a.toUpperCase());
  }
}
```

## `in` Operator Narrowing

```ts
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function makeSound(animal: Cat | Dog) {
  if ("meow" in animal) {
    animal.meow();
  } else {
    animal.bark();
  }
}
```

## `instanceof` Narrowing

```ts
function handleError(error: Error | string) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log(error);
  }
}
```

## Narrowing with Discriminant Properties

```ts
type SuccessResponse = { status: "success"; data: string[] };
type ErrorResponse = { status: "error"; message: string };
type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    console.log(response.data);
  } else {
    console.log(response.message);
  }
}
```

This is the basis of [discriminated unions](../13-discriminated-unions/README.md).

## Narrowing with `Array.isArray`

```ts
function printAll(value: string | string[]) {
  if (Array.isArray(value)) {
    value.forEach((v) => console.log(v));
  } else {
    console.log(value);
  }
}
```

## Backend Example

```ts
function getUserId(id: string | number): number {
  if (typeof id === "string") {
    return parseInt(id, 10);
  }
  return id;
}
```

## Common Mistakes

### Mistake 1: Narrowing inside a callback that TypeScript cannot track

```ts
function process(value: string | undefined) {
  if (value) {
    setTimeout(() => {
      console.log(value.toUpperCase()); // may still error depending on TS version/config
    }, 1000);
  }
}
```

Assign to a local `const` first to keep the narrowed type stable across closures.

### Mistake 2: Using `typeof` on non-primitive types

`typeof` only reliably narrows primitives (`string`, `number`, `boolean`, `symbol`, `bigint`, `undefined`, `function`, `object`). For classes and custom objects, use `instanceof` or an `in` check.

### Mistake 3: Forgetting the `else` branch is also narrowed

```ts
function handle(value: string | number) {
  if (typeof value === "string") {
    // string
  }
  // value is still string | number here without an else
}
```

## Exercise

1. Write a function `describeValue(value: string | number | boolean)` that returns a different message for each type using `typeof` narrowing.
2. Write a function `getLength(value: string | string[])` that returns the length, narrowing with `Array.isArray`.
3. Define `interface Admin { role: "admin"; permissions: string[] }` and `interface Guest { role: "guest" }`, then write `describeUser(user: Admin | Guest)` that narrows on the `role` property.

## Interview Answer

Type narrowing is the process by which TypeScript infers a more specific type for a variable within a certain code path, based on runtime checks such as `typeof`, `instanceof`, the `in` operator, equality comparisons, truthiness checks, or `Array.isArray`. It is most useful with union types: outside the check, TypeScript only allows access to members shared by all union members, but inside a narrowed branch it allows access to members specific to the detected type. Narrowing is what makes it safe to write code that behaves differently depending on which type a value actually is at runtime, without losing type safety.
