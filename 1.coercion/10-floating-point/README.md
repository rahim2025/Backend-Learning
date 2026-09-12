# Floating-Point Precision

## Idea

```js
0.1 + 0.2 === 0.3; // false  → actually 0.30000000000000004
```

This is **not coercion**. Both sides are already numbers; nothing is converted.
It is how the hardware stores decimals.

## Why it happens

JavaScript `number` is a 64-bit IEEE-754 binary float. Numbers are stored in
**base 2**. Just as `1/3` cannot be written exactly in base 10 (`0.3333...`),
`0.1` and `0.2` cannot be written exactly in base 2 — they become the nearest
representable binary fraction. Add two rounded values and the tiny errors add
up, landing just past `0.3`.

Integers are safe up to `Number.MAX_SAFE_INTEGER` (`2 ** 53 - 1`). The problem
is fractions.

## Comparing safely

Compare within a tiny tolerance instead of exact equality:

```js
Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON; // true
```

`Number.EPSILON` is the smallest gap between representable numbers near `1`.
For values much larger than `1` you need a scaled tolerance, not raw `EPSILON`.

## Backend takeaway

Never store or compute money as a float.

- **Integer minor units:** store cents/paisa as integers, format for display
  only.
- **Decimal library:** `decimal.js`, `big.js` for arbitrary-precision math.
- **Database decimal types:** `NUMERIC` / `DECIMAL` in Postgres/MySQL, and read
  them out as strings, not JS numbers.

`19.99 + 19.99` giving `39.980000000000004` on an invoice is a real bug this
prevents.
