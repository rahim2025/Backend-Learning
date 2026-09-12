# Expression Context vs Statement Context

## Idea

This trap is **not really about coercion** — it is about **parsing**. The same
characters `{}` mean different things depending on where they appear:

- At the **start of a statement**, `{` begins a **block** (a group of
  statements), like the body of an `if`.
- **Anywhere an expression is expected** (after `=`, inside `( )`, after
  `return`), `{` begins an **object literal**.

So `{}` at the start of a line is an empty block that does nothing, not an
empty object.

## Walk through the classic example

```js
[] + {};   // "[object Object]"
{} + [];   // 0    ← only at the start of a statement
({} + []); // "[object Object]"
```

**`[] + {}`** starts with `[`, which is always an expression, so the whole line
is `array + object` → `"" + "[object Object]"` → `"[object Object]"`.

**`{} + []`** at the start of a line is parsed as:

```js
{}       // an empty block — ignored
+[]      // a separate expression statement: unary plus on []
```

`+[]` is `ToNumber([])` → `ToNumber("")` → `0`. The console prints `0` because
that is the value of the last expression. The `{}` never participated.

**`({} + [])`** — the parentheses force expression context, so `{}` is now an
object literal. Back to `object + array` → `"[object Object]" + ""` →
`"[object Object]"`.

## How to not get bitten

- In real code you never write a bare `{}` at the start of a line, so this only
  shows up in console experiments and quiz questions.
- If you must start a statement with an object literal (rare), wrap it in
  parentheses: `({ ...})`.
- Arrow functions returning an object need the same wrap:
  `() => ({ ok: true })`, otherwise `{ ok: true }` is read as a function body
  with a label.

## Backend takeaway

Almost none — just recognize that a "coercion quiz" answer of `0` for
`{} + []` is a parsing artifact, and know the arrow-function
`() => ({ ... })` rule, which you *will* hit when returning object literals from
`.map()` in route handlers.
