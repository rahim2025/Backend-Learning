# TypeScript

TypeScript adds a static type system on top of JavaScript, catching many mistakes at compile time instead of at runtime.

Simple definition:

```txt
TypeScript = JavaScript + a type system that checks your code before it runs
```

## Topics

1. [Type vs Interface](01-type-vs-interface/README.md)
2. [Union Types](02-union-types/README.md)
3. [Literal Types](03-literal-types/README.md)
4. [Optional Properties](04-optional-properties/README.md)
5. [readonly](05-readonly/README.md)
6. [Function Typing](06-function-typing/README.md)
7. [Type Narrowing](07-type-narrowing/README.md)
8. [Type Guards](08-type-guards/README.md)
9. [keyof](09-keyof/README.md)
10. [Generics](10-generics/README.md)
11. [Generic Constraints](11-generic-constraints/README.md)
12. [Utility Types](12-utility-types/README.md)
13. [Discriminated Unions](13-discriminated-unions/README.md)
14. [unknown vs any](14-unknown-vs-any/README.md)
15. [Type Assertions](15-type-assertions/README.md)
16. [Interview Questions](16-interview-questions/interview-questions.md)
17. [Cheat Sheet](17-cheat-sheet/README.md)

## Why TypeScript Matters for Backend Development

Backend code deals constantly with data shapes: request bodies, database rows, API responses, and DTOs. TypeScript helps by:

- Catching typos and shape mismatches before the code runs
- Documenting exactly what a function expects and returns
- Making refactors safer (the compiler flags every broken usage)
- Narrowing down `unknown` data (JSON, user input) safely before use

## Mental Model

```txt
type / interface       -> describe the shape of data
union / literal types   -> describe a limited, precise set of allowed values
optional / readonly     -> describe how a property may or may not be present or changed
function typing         -> describe what a function accepts and returns
narrowing / type guards -> prove to the compiler which specific type a value is, at runtime
keyof / generics        -> write reusable, type-safe code across many shapes
generic constraints     -> limit generics to shapes with the members you need
utility types           -> derive new types from existing ones instead of duplicating them
discriminated unions    -> safely model "one of several distinct variants" (responses, events, states)
unknown vs any          -> handle untrusted data safely vs. turning off type checking
type assertions         -> override the compiler's inferred type when you know better (used carefully)
```

## Example Model

A small backend-flavored example touching several topics at once:

```ts
interface User {
  id: number;
  name: string;
  email: string;
  readonly createdAt: Date;
}

type CreateUserDto = Omit<User, "id" | "createdAt">;
type UpdateUserDto = Partial<CreateUserDto>;

type ApiResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value
  );
}

function createUser(dto: CreateUserDto): ApiResult<User> {
  const user: User = { id: Date.now(), createdAt: new Date(), ...dto };
  return { status: "success", data: user };
}
```

## Interview Summary

TypeScript is a typed superset of JavaScript that catches shape and usage errors at compile time. Its core tools are `type`/`interface` for describing data shapes, unions and literal types for constraining allowed values, optional and `readonly` modifiers for controlling presence and mutability, precise function typing, narrowing and type guards for safely working with union and `unknown` values at runtime, `keyof` and generics (with constraints) for reusable type-safe code, utility types for deriving new types instead of duplicating them, and discriminated unions for modeling distinct variants like API responses or domain events. Together these features make backend code more self-documenting and catch entire categories of bugs before the code ever runs.
