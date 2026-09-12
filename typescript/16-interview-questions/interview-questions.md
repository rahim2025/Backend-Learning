# TypeScript Interview Questions

## Q: What is the difference between `type` and `interface`?

Both can describe object shapes and are interchangeable in many everyday cases. `interface` supports declaration merging and is extended with `extends`. `type` can alias unions, tuples, primitives, and function types, and is combined with intersections (`&`) rather than merging.

## Q: What is a union type?

A union type (`A | B`) allows a value to be one of several types. Only members shared across all types in the union are accessible without narrowing.

## Q: What is a literal type?

A literal type represents one exact value, such as `"active"` or `200`, instead of the general `string` or `number` type. Literal types are usually combined into unions to model a fixed set of allowed values.

## Q: What does the `?` mean on a property?

It marks the property as optional — it can be omitted from the object entirely. Its type becomes a union with `undefined`.

## Q: What does `readonly` do, and is it enforced at runtime?

`readonly` prevents a property from being reassigned after it is set. It is a compile-time-only check; the compiled JavaScript has no runtime protection unless combined with `Object.freeze()`.

## Q: How do you type a function that takes a callback?

```ts
function onData(callback: (data: string) => void) {}
```

The callback's parameter and return types should be as specific as possible, not `any`.

## Q: What is type narrowing?

Narrowing is how TypeScript infers a more specific type within a code branch, based on checks like `typeof`, `instanceof`, `in`, equality, or truthiness — most useful on union types.

## Q: What is a type guard?

A type guard is a function whose return type is a type predicate (`value is Type`), which TypeScript trusts to narrow a type after the function is called inside a condition. Built-in narrowing (`typeof`, `instanceof`) works inline; a custom type guard makes a check reusable.

## Q: What does `keyof` do?

`keyof` produces a union of a type's property names. It's often combined with generics, e.g. `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`.

## Q: What are generics used for?

Generics let a function, interface, or class work with a type decided at the point of use, keeping the relationship between input and output types, unlike `any` which discards type information.

## Q: What is a generic constraint?

`T extends SomeShape` restricts a type parameter to types satisfying that shape, so the compiler allows safe access to that shape's members inside the generic code.

## Q: Name a few built-in utility types and what they do.

`Partial<T>` (all optional), `Required<T>` (all required), `Readonly<T>` (all read-only), `Pick<T, K>` (select keys), `Omit<T, K>` (exclude keys), `Record<K, T>` (build an object type), `Exclude<T, U>`/`Extract<T, U>` (filter a union), `ReturnType<T>`/`Parameters<T>` (derive from a function).

## Q: What is a discriminated union?

A union of object types sharing one common literal property (the discriminant), which TypeScript uses to narrow to the exact variant after checking that property, commonly with a `switch`.

## Q: What is exhaustiveness checking?

Assigning the value to a variable typed `never` in the final/default branch of a `switch` over a discriminated union. If a new variant is added later without updating the `switch`, TypeScript raises a compile error because the value is no longer `never` in that branch.

## Q: What is the difference between `unknown` and `any`?

`any` disables type checking — you can use it however you want with no compiler errors. `unknown` can also hold any value, but you must narrow it (with `typeof`, `instanceof`, or a type guard) before using it or assigning it to a more specific type. `unknown` is the type-safe choice for values whose shape isn't known yet, like JSON responses or caught errors.

## Q: What is a type assertion, and how is it different from casting?

A type assertion (`value as Type`) tells the compiler to treat a value as a given type without performing any runtime check or conversion — unlike casting in other languages. An incorrect assertion compiles but can cause a runtime error later.

## Q: When would you use a non-null assertion (`!`)?

When you are confident a value is not `null`/`undefined` even though its type says it could be, e.g. `document.getElementById(id)!`. It's risky because a wrong assumption becomes a runtime crash instead of a caught compile error.

## Q: Why prefer `unknown` over `any` in a `catch` block?

Modern TypeScript types caught errors as `unknown` by default, forcing an `instanceof Error` (or similar) check before accessing `.message`, which avoids assuming the thrown value is always an `Error` instance.

## Q: How would you type an Express request that has been augmented by authentication middleware?

Extend the base `Request` type, e.g. `interface AuthenticatedRequest extends Request { user: { id: number } }`, then assert (`req as AuthenticatedRequest`) or use a typed middleware signature, being aware the assertion assumes the middleware already ran.

## Q: Why derive DTOs (like update payloads) from an entity type instead of writing them separately?

Using utility types like `Partial<Pick<User, "name" | "email">>` keeps the DTO in sync automatically when the entity type changes, instead of maintaining two type definitions that can drift apart.
