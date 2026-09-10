# JavaScript Type Coercion Notes

These notes explain how JavaScript converts values between types, why the
surprising results happen, and how to avoid the bugs this causes in backend code.

Each topic file follows the same shape so it is fast to revise:

- **Idea** – the concept in one or two sentences
- **How it works** – the rule or algorithm, step by step
- **Examples** – with the reasoning, not just the output
- **Backend takeaway** – what to actually do in request-handling code

## Read in order

1. [`01-type-coercion`](01-type-coercion/README.md) – what coercion is, implicit vs explicit
2. [`02-primitive-types`](02-primitive-types/README.md) – the 7 primitives coercion works on
3. [`03-abstract-operations`](03-abstract-operations/README.md) – `ToNumber`, `ToString`, `ToBoolean`, `ToPrimitive`
4. [`04-equality`](04-equality/README.md) – `==` vs `===`
5. [`05-null-undefined`](05-null-undefined/README.md) – special loose-equality rule
6. [`06-array-object-coercion`](06-array-object-coercion/README.md) – how objects/arrays become primitives
7. [`07-expression-vs-statement`](07-expression-vs-statement/README.md) – the `{}` parsing trap
8. [`08-unary-plus`](08-unary-plus/README.md) – `+value` as a number cast
9. [`09-nan`](09-nan/README.md) – why `NaN` breaks equality
10. [`10-floating-point`](10-floating-point/README.md) – `0.1 + 0.2` (not a coercion bug)
11. [`11-object-to-primitive`](11-object-to-primitive/README.md) – `valueOf` / `toString` fallback order
12. [`12-symbol-to-primitive`](12-symbol-to-primitive/README.md) – overriding conversion with `Symbol.toPrimitive`
13. [`13-relational-comparison`](13-relational-comparison/README.md) – `<`, `>`, `<=`, `>=`
14. [`14-null-relational`](14-null-relational/README.md) – why `null >= 0` is `true` but `null == 0` is `false`
15. [`15-backend-validation-bugs`](15-backend-validation-bugs/README.md) – real bugs and fixes
16. [`16-interview-questions`](16-interview-questions/interview-questions.md) – common questions with worked answers
17. [`17-cheat-sheet`](17-cheat-sheet/README.md) – one-page recap

## The one rule that prevents most bugs

Request input (`req.query`, `req.params`, `req.body`, env vars) is almost always
a **string**. Never let operators convert it for you. Convert it yourself with
`Number()` / `String()` / `Boolean()`, then validate the result. Explicit
conversion turns silent wrong answers into visible checks.
