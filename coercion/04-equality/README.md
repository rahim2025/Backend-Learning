# `==` vs `===`

## Idea

- `===` (strict equality): if the two operands have **different types**, the
  result is `false` immediately. No conversion.
- `==` (loose equality): if the types differ, JavaScript **coerces** one or both
  operands and then compares. The conversion rules are what make `==` confusing.

Because `===` never coerces, its results are always obvious. Almost every
"weird equality" example is really about `==`.

## How `==` decides (simplified)

When `x == y` and the types differ, JavaScript applies the first rule that fits:

1. `null` and `undefined` are equal to each other and **nothing else**.
2. number vs string → convert the **string to a number**.
3. boolean vs anything → convert the **boolean to a number** (`true`→`1`,
   `false`→`0`), then start over.
4. object vs primitive → convert the **object to a primitive** (`ToPrimitive`),
   then start over.
5. `NaN` is equal to nothing, including itself.

Notice booleans and objects get reduced to numbers/primitives, then the
comparison runs again from the top.

## Worked examples

```js
0 == false;   // true  → rule 3: false → 0, then 0 == 0
0 === false;  // false → different types, no coercion

"0" == false; // true  → rule 3: false → 0 → "0" == 0
              //          rule 2: "0" → 0 → 0 == 0
Boolean("0"); // true  → different question! ToBoolean, "0" is a non-empty string

[] == false;  // true  → rule 3: false → 0 → [] == 0
              //          rule 4: [] → "" (ToPrimitive) → rule 2: "" → 0 → 0 == 0
Boolean([]);  // true  → ToBoolean: every object is truthy

{} == false;  // false → {} → "[object Object]" → NaN, and NaN == 0 is false
Boolean({});  // true  → ToBoolean: every object is truthy
```

## The trap: two different questions

`Boolean(x)` and `x == false` feel like they should agree. They do not, because
they run **different algorithms**:

| Question | Algorithm | `[]` result |
| --- | --- | --- |
| Is `x` truthy? | `ToBoolean` — objects are always truthy | `Boolean([])` → `true` |
| Does `x == false`? | loose equality — reduce both sides to numbers | `[] == false` → `true` (both become `0`) |

They happen to both be `true` for `[]`, but for different reasons, and for `{}`
they disagree.

## Backend takeaway

Use `===` everywhere. The only common, deliberate use of `==` is
`value == null` to mean "is this `null` or `undefined`" — that one is a useful
shorthand (rule 1). Everything else should be strict.
