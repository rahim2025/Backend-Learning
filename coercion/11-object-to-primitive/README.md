# Object → Primitive Conversion

## Idea

When an object must become a primitive, JavaScript calls `ToPrimitive` with a
**hint** describing what kind of primitive is wanted. The hint decides whether
`valueOf()` or `toString()` is tried first. Whichever is tried, the **first
method that returns an actual primitive wins**; if neither does, it throws.

## The hint decides the order

| Hint | Set by | Tries in order |
| --- | --- | --- |
| `"number"` | `-`, `*`, `/`, `%`, unary `+`, `<`, `>`, `Number(obj)`, `Math.*` | `valueOf()` → `toString()` |
| `"string"` | template literals, `String(obj)`, `${obj}`, object used as a key | `toString()` → `valueOf()` |
| `"default"` | binary `+`, `==` | behaves like `"number"` for normal objects |

Default objects have a `valueOf()` that returns the object itself (not a
primitive), so it gets skipped and `toString()` ends up doing the work.

## Example: hint changes which method runs

```js
const obj = {
  valueOf() { return 10; },
  toString() { return "20"; },
};

+obj;         // 10   → hint "number": valueOf() first, returns primitive 10, done
String(obj);  // "20" -> hint "string": toString() first, returns "20", done
String(obj);  // "20" → hint "string": toString() first, returns "20" �→ done
obj + 1;      // 11   → hint "default" ≈ number: valueOf() → 10, then 10 + 1
`${obj}`;     // "20" → hint "string": toString()
```

## Example: fallback to the second method

```js
const obj = {
  valueOf() { return {}; },   // returns an object, NOT a primitive → rejected
  toString() { return "7"; }, // returns a primitive → used
};

+obj; // 7  → hint "number" tries valueOf() (fails), falls back to toString()
```

## Example: both fail → TypeError

```js
const obj = {
  valueOf() { return {}; },
  toString() { return {}; },
};

+obj; // TypeError: Cannot convert object to primitive value
`${obj}`; // same error
```

Neither method produced a primitive, so there is nothing to convert to.

## Backend takeaway

If you add `toJSON()` / `valueOf()` / `toString()` to a model class, know that
logging (`` `${user}` ``), `JSON.stringify`, and arithmetic will each pick a
different one. Keep them consistent, or you get `"[object Object]"` in logs and
`NaN` in calculations from the same object.
