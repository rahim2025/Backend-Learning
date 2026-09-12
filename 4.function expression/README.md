# Function Declaration vs Function Expression

This folder contains backend interview notes about function declarations, function expressions, hoisting, `var`, `let`, `const`, TDZ, `TypeError`, and `ReferenceError`.

This topic is important because JavaScript functions can be created in different ways, and each form behaves differently before the declaration line.

## Topics

1. [Function Declaration](01-function-declaration/README.md)
2. [Function Expression](02-function-expression/README.md)
3. [`var` Function Expression](03-var-function-expression/README.md)
4. [`let`/`const` Function Expression](04-let-const-function-expression/README.md)
5. [Interview Questions](05-interview-questions/interview-questions.md)
6. [Cheat Sheet](06-cheat-sheet/README.md)

## 1. Function Declaration

A function declaration uses the `function` keyword with a function name.

```js
function hello() {}
```

Function declarations are fully hoisted.

That means you can call them before the declaration line.

```js
hello(); // works

function hello() {
  console.log("Hello");
}
```

Why?

During the creation phase, JavaScript stores the whole function in memory.

So when execution starts, the function is already available.

## 2. Function Expression

A function expression creates a function value and assigns it to a variable.

```js
const hello = function () {};
```

Important:

- The function value is created at runtime.
- It is not fully hoisted like a function declaration.
- It is assigned to a variable.

```js
const hello = function () {
  console.log("Hello");
};

hello(); // works after assignment
```

The variable declaration follows `var`, `let`, or `const` rules.

## 3. `var` Function Expression

With `var`, the variable is hoisted and initialized as `undefined`.

```js
hi(); // TypeError: hi is not a function

var hi = function () {
  console.log("Hi");
};
```

Why?

JavaScript treats it roughly like:

```js
var hi;

hi(); // TypeError, because hi is undefined

hi = function () {
  console.log("Hi");
};
```

The variable exists, but the function value has not been assigned yet.

So calling it early is like this:

```js
undefined(); // TypeError
```

## 4. `let`/`const` Function Expression

With `let` and `const`, the variable is hoisted but stays in the Temporal Dead Zone before the declaration line.

```js
hi(); // ReferenceError

const hi = function () {
  console.log("Hi");
};
```

Why?

Before the declaration line, `hi` exists but cannot be accessed.

This is the TDZ.

```js
// TDZ starts

const hi = function () {
  console.log("Hi");
};

// TDZ ends after declaration
```

The same rule applies to `let`:

```js
hi(); // ReferenceError

let hi = function () {
  console.log("Hi");
};
```

## Main Difference

| Form | Early call result | Why |
| --- | --- | --- |
| Function declaration | Works | Fully hoisted |
| `var` function expression | `TypeError` | Variable is `undefined` |
| `let` function expression | `ReferenceError` | TDZ |
| `const` function expression | `ReferenceError` | TDZ |

## Interview Summary

A function declaration is fully hoisted, so it can be called before it appears in the code. A function expression is created at runtime and assigned to a variable. If the variable uses `var`, it is hoisted as `undefined`, so calling it early gives a `TypeError`. If it uses `let` or `const`, it is in the TDZ before the declaration, so calling it early gives a `ReferenceError`.

