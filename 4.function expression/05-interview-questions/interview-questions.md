# Function Declaration vs Function Expression Interview Questions

## Q: What is a function declaration?

A function declaration defines a named function using the `function` keyword.

```js
function hello() {}
```

It is fully hoisted, so it can be called before the declaration line.

## Q: Can a function declaration be called before it is written?

Yes.

```js
hello(); // works

function hello() {
  console.log("Hello");
}
```

Function declarations are fully hoisted.

## Q: What is a function expression?

A function expression creates a function value and assigns it to a variable.

```js
const hello = function () {};
```

The function value is created at runtime, so it is not fully hoisted.

## Q: What happens if you call a `var` function expression early?

You get a `TypeError`.

```js
hi(); // TypeError: hi is not a function

var hi = function () {
  console.log("Hi");
};
```

`var hi` is hoisted as `undefined`, but the function value is assigned later.

## Q: Why is the error a `TypeError` for `var`?

Because the variable exists and its value is `undefined`. Calling it is like calling `undefined()` as a function.

## Q: What happens if you call a `let` or `const` function expression early?

You get a `ReferenceError`.

```js
hi(); // ReferenceError

const hi = function () {
  console.log("Hi");
};
```

`let` and `const` are in the TDZ before the declaration line.

## Q: What is the main difference between function declarations and function expressions?

Function declarations are fully hoisted. Function expressions are created at runtime and assigned to variables, so their early-call behavior depends on whether the variable is declared with `var`, `let`, or `const`.

