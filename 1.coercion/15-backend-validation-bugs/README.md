# Real Backend Bugs Caused by Coercion

## Bug 1: Rejecting valid `"0"`

```js
const count = Number(req.query.count);

if (!count) {
  return res.status(400).send("Invalid count");
}
```

`Number("0")` is `0`, and `!0` is `true`, so valid input is rejected.

Safer:

```js
const rawCount = req.query.count;

if (rawCount == null || rawCount.trim() === "") {
  return res.status(400).send("Count is required");
}

const count = Number(rawCount);

if (Number.isNaN(count)) {
  return res.status(400).send("Invalid count");
}
```

## Bug 2: `||` hides invalid input

```js
const page = Number(req.query.page) || 1;
```

`"abc"` becomes `NaN`, then defaults to `1`. `"0"` becomes `0`, then defaults to `1`.

Use explicit checks for missing, empty, invalid, and out-of-range values.

## Bug 3: Calling `.trim()` on `undefined`

```js
const raw = req.query.count;
raw.trim();
```

If `raw` is `undefined`, this throws.

```js
if (raw == null || raw.trim() === "") {
  return res.status(400).send("Count is required");
}
```

`raw == null` intentionally checks both `null` and `undefined`.

