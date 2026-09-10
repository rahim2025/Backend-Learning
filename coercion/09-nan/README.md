# `NaN`

## Idea

`NaN` = "Not a Number", produced whenever a numeric operation has **no valid
numeric answer** (`Number("abc")`, `0/0`, `Math.sqrt(-1)`, `undefined + 1`).

Two facts cause every `NaN` bug:

1. Its **type is `number`** (`typeof NaN === "number"`). It is a numeric value
   that means "invalid", not a separate type.
2. It is the only value in JavaScript **not equal to itself**.

## Why equality breaks

```js
NaN == NaN;   // false
NaN === NaN;  // false
NaN !== NaN;  // true   ← the only self-inequality in the language
```

The IEEE-754 floating-point standard defines `NaN` as unordered, so every
comparison involving it (`==`, `<`, `>`, `>=`) returns `false` (and `!=`
returns `true`). This means you **cannot detect `NaN` by comparing it to
anything** — you need a dedicated check.

## `isNaN()` vs `Number.isNaN()`

```js
isNaN("hello");         // true   → coerces "hello" to Number → NaN → true
Number.isNaN("hello");  // false  → not the NaN value (it's a string), no coercion

isNaN(undefined);        // true   → Number(undefined) is NaN
Number.isNaN(undefined); // false  → undefined is not NaN

isNaN(NaN);              // true
Number.isNaN(NaN);       // true   → both agree only when the input really is NaN
```

- `isNaN(x)` means "is `x` **not a number** after coercion" — it lies about
  non-numeric strings.
- `Number.isNaN(x)` means "is `x` **exactly the `NaN` value**" — no coercion,
  no surprises.

Also useful: `Number.isFinite(x)` rejects `NaN`, `Infinity`, and `-Infinity` in
one call.

## Backend takeaway

Standard numeric-input pattern:

```js
const n = Number(raw);
if (Number.isNaN(n)) return res.status(400).json({ error: "not a number" });
```

Never use bare `isNaN()` here — `isNaN("12abc")` is `true` but so is
`isNaN({})`, and you lose the ability to reason about what actually failed.
