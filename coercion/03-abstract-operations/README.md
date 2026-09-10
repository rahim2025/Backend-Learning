# Abstract Operations

## Idea

The ECMAScript spec describes coercion using internal functions called
**abstract operations**. You cannot call them directly, but every implicit
conversion you see is one of them running. Knowing their names and rules lets
you predict any coercion result instead of memorizing outcomes one by one.

| Operation | Converts to | Triggered by |
| --- | --- | --- |
| `ToPrimitive` | a primitive | any time an object is used where a primitive is needed |
| `ToNumber` | number | `-`, `*`, `/`, `%`, unary `+`, `<`, `>`, `Number()` |
| `ToString` | string | `+` with a string, template literals, `String()`, object keys |
| `ToBoolean` | boolean | `if`, `while`, `!`, logical `&&` / `\|\|`, `? :`, `Boolean()` |

## ToNumber

Rules for the common cases:

| Input | Result | Why |
| --- | --- | --- |
| `""` or `"   "` | `0` | empty / whitespace-only string trims to nothing, and "nothing" is `0` |
| `"42"` | `42` | a valid numeric string parses |
| `"42abc"` | `NaN` | any leftover non-numeric character fails the whole parse |
| `"abc"` | `NaN` | not numeric |
| `null` | `0` | defined by spec |
| `undefined` | `NaN` | defined by spec |
| `true` / `false` | `1` / `0` | |
| `[]` | `0` | `ToPrimitive([])` → `""` → `ToNumber("")` → `0` |
| `[5]` | `5` | `ToPrimitive([5])` → `"5"` → `5` |
| `[1,2]` | `NaN` | `ToPrimitive` → `"1,2"` → not numeric |
| `{}` | `NaN` | `ToPrimitive({})` → `"[object Object]"` → not numeric |

The `null` → `0` but `undefined` → `NaN` split is the source of many
comparison surprises (see [`14-null-relational`](../14-null-relational/README.md)).

## ToBoolean

This one has no parsing. There is a fixed list of **falsy** values, and
**everything else is truthy**:

```js
false        // the boolean itself
0, -0        // and 0n for bigint
""           // empty string ONLY
null
undefined
NaN
```

Common values that are **truthy** (a frequent source of bugs):

```js
"0"       // non-empty string
"false"   // non-empty string
" "       // non-empty string (a space)
[]        // every object is truthy
{}        // every object is truthy
```

`ToBoolean` never looks *inside* an object. `[]` and `{}` are truthy purely
because they are objects.

## Backend takeaway

- `ToNumber` explains why `Number(req.query.x)` gives `0` for both `""` and
  `"0"` — you cannot tell "missing" from "zero" after conversion. Check the raw
  string first.
- `ToBoolean` explains why `if (!req.query.flag)` is unreliable: `"0"` and
  `"false"` are both truthy, so the guard does the opposite of what it reads
  like.
