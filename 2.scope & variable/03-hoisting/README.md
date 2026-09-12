# Hoisting

Hoisting means JavaScript processes declarations before executing code.

| Declaration | Hoisted? | Behavior before declaration line |
| --- | --- | --- |
| `var` | Yes | `undefined` |
| `let` | Yes | ReferenceError because of TDZ |
| `const` | Yes | ReferenceError because of TDZ |
| Function declaration | Yes | Fully available |
| Function expression | Variable hoisted only | Function value not available yet |

## `var` Hoisting

```js
console.log(a); // undefined
var a = 10;
```

JavaScript treats it roughly like:

```js
var a;
console.log(a); // undefined
a = 10;
```

## `let` and `const` Hoisting

```js
console.log(b); // ReferenceError
let b = 10;
```

`let` and `const` are hoisted, but they are not initialized before the declaration line.

## Function Declaration

```js
getStatus(); // "ok"

function getStatus() {
  return "ok";
}
```

Function declarations are fully hoisted.

## Function Expression

```js
getStatus(); // TypeError

var getStatus = function () {
  return "ok";
};
```

The variable is hoisted as `undefined`, but the function is assigned later.

## Interview Answer

Hoisting means declarations are processed before execution. `var` is hoisted and initialized as `undefined`, `let` and `const` are hoisted but stay in the TDZ, function declarations are fully hoisted, and function expressions are only available after assignment.

