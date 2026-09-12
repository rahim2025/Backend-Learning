# Function Declaration vs Function Expression Cheat Sheet

## Function Declaration

```js
hello(); // works

function hello() {}
```

Fully hoisted.

Can be called before declaration.

## Function Expression

```js
const hello = function () {};
```

Function value is created at runtime.

Assigned to a variable.

Not fully hoisted.

## `var` Function Expression

```js
hi(); // TypeError

var hi = function () {};
```

Reason:

```js
var hi; // undefined
hi(); // TypeError
```

## `let`/`const` Function Expression

```js
hi(); // ReferenceError

const hi = function () {};
```

Reason:

```txt
TDZ before declaration
```

## Main Table

| Form | Early call result | Reason |
| --- | --- | --- |
| `function hello() {}` | Works | Fully hoisted |
| `var hi = function () {}` | `TypeError` | `hi` is `undefined` |
| `let hi = function () {}` | `ReferenceError` | TDZ |
| `const hi = function () {}` | `ReferenceError` | TDZ |

