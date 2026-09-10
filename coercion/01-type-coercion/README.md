# What is Type Coercion?

## Idea

Every operator and language context in JavaScript expects operands of a certain
type. When you give it a different type, JavaScript does **not** throw an error.
It silently converts the value to the type it needs first. That automatic
conversion is called **type coercion**.

`"5" - 2` does not fail. The `-` operator only works on numbers, so JavaScript
converts `"5"` to `5`, then computes `5 - 2`.

## How it works

There are two ways a conversion can happen:

| Kind | Who triggers it | Example | What happens |
| --- | --- | --- | --- |
| **Implicit** | An operator or context does it for you | `"5" - 2` → `3` | `-` needs numbers, so `"5"` becomes `5` |
| **Explicit** | You call a conversion function on purpose | `Number("5")` → `5` | you asked for a number |

Same conversion, different trigger. The danger is only with **implicit**
coercion, because the conversion is invisible in the code.

## Examples

```js
"5" - 2;      // 3    → "-" needs numbers: "5" → 5, then 5 - 2
"5" + 2;      // "52" → "+" prefers strings when one side is a string: 2 → "2", then concat
"5" * "2";    // 10   → "*" needs numbers: both strings → 5 and 2
Number("5");  // 5    → explicit, you controlled it
```

`+` is the odd one out: if **either** operand is a string, `+` does string
concatenation instead of addition. Every other arithmetic operator always goes
to numbers.

## Backend takeaway

Prefer explicit coercion in request-handling code. Query params, route params,
headers, and env vars arrive as strings, and implicit coercion will happily
accept or reject the wrong values without any visible sign in the code.

```js
// implicit: fragile, intent unclear
if (req.query.limit - 0 > 100) { ... }

// explicit: intent obvious, easy to add validation
const limit = Number(req.query.limit);
if (Number.isNaN(limit) || limit > 100) { ... }
```

**Interview answer:** Type coercion is JavaScript converting a value from one
type to another so an operator or context can use it. Implicit coercion is done
automatically by operators (`==`, `+`, `-`, `if`, template literals). Explicit
coercion is done deliberately with `Number()`, `String()`, `Boolean()`. Explicit
is preferred in validation because it makes edge cases like `"0"`, `""`, and
`"abc"` visible instead of silently converted.
