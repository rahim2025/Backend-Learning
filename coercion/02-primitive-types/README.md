# JavaScript Primitive Types

## Idea

Coercion is the conversion between types, so you first need to know the types.
JavaScript values are either **primitives** (immutable, compared by value) or
**objects** (mutable, compared by reference). There are 7 primitive types.
Coercion rules are defined in terms of these.

## The 7 primitives

| Primitive | Example | What it represents |
| --- | --- | --- |
| `string` | `"hello"` | text |
| `number` | `42`, `3.14`, `NaN`, `Infinity` | 64-bit float; there is no separate int type |
| `bigint` | `123n` | integers too large for `number` to hold exactly |
| `boolean` | `true`, `false` | logical values |
| `undefined` | `undefined` | a variable declared but not assigned, or a missing property/arg |
| `null` | `null` | intentional "no value", set by a developer |
| `symbol` | `Symbol("id")` | a guaranteed-unique value, used as object keys |

Everything else (`{}`, `[]`, functions, `Date`, `Map`, ...) is an object.

## Two quirks to memorize

```js
typeof NaN;   // "number"  → NaN is a numeric value meaning "invalid number result"
typeof null;  // "object"  → a historical bug in JS that can never be fixed
```

`typeof null === "object"` is why you cannot use `typeof` to check for `null`.
Use `value === null` or `value == null` (which also catches `undefined`).

## null vs undefined

- `undefined` = the value was **never set**. JS produces it for you.
- `null` = the value was **deliberately set to nothing**. A human produces it.

They are separate types but loosely equal to each other (`null == undefined` is
`true`) and to nothing else — see [`05-null-undefined`](../05-null-undefined/README.md).

## Backend takeaway

`typeof req.body.x === "object"` is `true` for `null`, arrays, and plain
objects alike. To require a real object, check
`x !== null && typeof x === "object" && !Array.isArray(x)`.
