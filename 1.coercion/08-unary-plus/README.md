# Unary Plus (`+value`)

## Idea

A `+` with **one operand** (`+x`, not `a + b`) does exactly one thing: it runs
`ToNumber` on the operand. It is the shortest possible "convert to number".
It is the same conversion `Number(x)` performs — same rules, same results.

## Results (these are just the `ToNumber` rules)

| Expression | Result | Reason |
| --- | --- | --- |
| `+"5"` | `5` | numeric string parses |
| `+""` | `0` | empty string → `0` |
| `+"  "` | `0` | whitespace-only string trims to empty |
| `+"5px"` | `NaN` | trailing non-numeric text fails the parse |
| `+true` | `1` | `true` → `1` |
| `+null` | `0` | spec rule |
| `+undefined` | `NaN` | spec rule |
| `+[]` | `0` | `ToPrimitive` → `""` → `0` |
| `+[5]` | `5` | `ToPrimitive` → `"5"` → `5` |
| `+{}` | `NaN` | `ToPrimitive` → `"[object Object]"` → `NaN` |

`-x` also coerces to number (then negates), and `x * 1` / `x - 0` are older
tricks for the same thing.

## Backend takeaway

`+x` works but reads like an accident — a reviewer cannot tell if you meant
number conversion or a typo. Use `Number(x)` in backend code: it states intent
and is easy to pair with a `Number.isNaN` check.

```js
const age = Number(req.query.age);      // clear
const age = +req.query.age;             // works, but "why the plus?"
```
