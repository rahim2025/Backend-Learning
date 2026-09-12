# `let` and `const` Function Expressions

With `let` and `const`, the variable is hoisted but cannot be accessed before the declaration line because of the Temporal Dead Zone.

```js
hi(); // ReferenceError

const hi = function () {
  console.log("Hi");
};
```

The same happens with `let`:

```js
hi(); // ReferenceError

let hi = function () {
  console.log("Hi");
};
```

## Why It Happens

Before the declaration line:

- The variable exists.
- The variable is in the TDZ.
- Accessing it throws `ReferenceError`.

## Interview Answer

`let` and `const` function expressions are hoisted but stay in the TDZ before declaration. Calling them early gives a `ReferenceError`.

