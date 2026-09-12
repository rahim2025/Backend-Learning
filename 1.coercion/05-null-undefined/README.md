# `null` and `undefined` in Coercion

## Idea

`null` and `undefined` behave **differently depending on the context**:

- In **loose equality (`==`)** they form their own little island: equal to each
  other, unequal to everything else. They are *not* converted to numbers here.
- In **arithmetic and relational comparison** they *are* converted to numbers,
  and the two convert to **different** numbers: `null` → `0`, `undefined` →
  `NaN`.

Mixing up these two contexts is the root of most `null`/`undefined` confusion.

## Loose equality context

```js
null == undefined;  // true  → special rule: they equal each other
null === undefined;  // false → different types, strict never coerces
null == 0;           // false → null is NOT converted to a number here
null == false;       // false → null is not equal to false
null == "";          // false
undefined == 0;      // false
undefined == false;  // false
```

Rule to remember: **in `==`, `null` is only ever equal to `undefined`
(and itself).** Do not describe `==` as "always converts to numbers" — this
case is the exception.

## Arithmetic / comparison context

Here `ToNumber` runs, and now the difference appears:

```js
Number(null);       // 0
Number(undefined);  // NaN

null + 1;       // 1    → 0 + 1
undefined + 1;  // NaN  → NaN + 1

null >= 0;       // true  → 0 >= 0
undefined >= 0;  // false → NaN >= 0 is false
```

So `null >= 0` is `true` but `null == 0` is `false` — same-looking code, two
different algorithms. Covered in detail in
[`14-null-relational`](../14-null-relational/README.md).

## Backend takeaway

`value == null` is the idiomatic "missing?" check because it catches **both**
`null` (client sent JSON `null`) and `undefined` (key absent entirely) in one
expression, and nothing else. Use it before touching the value:

```js
if (req.body.email == null) return res.status(400).json({ error: "email required" });
```
