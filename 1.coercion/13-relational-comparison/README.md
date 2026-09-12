# Relational Comparison

If both operands are strings, comparison is lexicographic. If one operand is not a string, JavaScript usually converts values to numbers.

| Expression | Result |
| --- | --- |
| `"10" > 2` | `true` |
| `"2" > "10"` | `true` |
| `"20" > "100"` | `true` |
| `"20" > 100` | `false` |
| `"abc" > 2` | `false` |
| `"abc" < 2` | `false` |

`"abc"` becomes `NaN`, and comparisons with `NaN` return `false`.

