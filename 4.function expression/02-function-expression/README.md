# Function Expression

A function expression creates a function value and assigns it to a variable.

```js
const hello = function () {};
```

Important:

- The function value is created at runtime.
- It is assigned to a variable.
- It is not fully hoisted like a function declaration.

```js
const hello = function () {
  console.log("Hello");
};

hello(); // works after assignment
```

## Variable Rules Matter

The function expression follows the rules of the variable keyword:

- `var` is hoisted as `undefined`.
- `let` and `const` are hoisted but stay in the TDZ.

## Interview Answer

A function expression is a function value assigned to a variable. The function value is created during execution, so it is not fully hoisted like a function declaration.

