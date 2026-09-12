# `var`, `let`, and `const`

JavaScript has three common ways to declare variables.

| Keyword | Scope | Reassign? | Modern use |
| --- | --- | --- | --- |
| `var` | Function/global scoped | Yes | Avoid in modern code |
| `let` | Block scoped | Yes | Use when reassignment is needed |
| `const` | Block scoped | No | Use by default |

## `var` Ignores Blocks

```js
if (true) {
  var x = 1;
}

console.log(x); // 1
```

`var` is not limited to the `if` block. It belongs to the nearest function or global scope.

## `let` and `const` Stay Inside Blocks

```js
if (true) {
  let y = 2;
}

console.log(y); // ReferenceError
```

```js
if (true) {
  const z = 3;
}

console.log(z); // ReferenceError
```

## Backend Recommendation

Prefer:

```js
const userId = req.params.id;
let retryCount = 0;
```

Avoid:

```js
var userId = req.params.id;
```

`const` makes it clear the binding should not be reassigned. `let` communicates that reassignment is expected.

## Interview Answer

`var` is function or global scoped, while `let` and `const` are block scoped. `var` ignores blocks like `if` and `for`, but `let` and `const` only exist inside the block where they are declared.

