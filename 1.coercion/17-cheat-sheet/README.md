# Type Coercion Cheat Sheet

## Falsy Values

```js
false
0
""
null
undefined
NaN
```

## Number Conversion Traps

| Expression | Result |
| --- | --- |
| `Number("")` | `0` |
| `Number(" ")` | `0` |
| `Number(null)` | `0` |
| `Number(undefined)` | `NaN` |
| `Number([])` | `0` |
| `Number({})` | `NaN` |

## Equality Traps

| Expression | Result |
| --- | --- |
| `0 == false` | `true` |
| `"0" == false` | `true` |
| `[] == false` | `true` |
| `Boolean([])` | `true` |
| `null == undefined` | `true` |
| `null == 0` | `false` |
| `NaN === NaN` | `false` |

## Backend Validation Rules

1. Check missing raw input with `value == null`.
2. Check empty strings with `value.trim() === ""`.
3. Convert explicitly with `Number(value)`.
4. Check `Number.isNaN(convertedValue)`.
5. Validate business rules such as min, max, integer-only, and allowed range.

