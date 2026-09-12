# Lexical Scoping

Lexical scoping means a function uses the scope where it was written, not where it was called.

```js
let value = "global";

function getValue() {
  return value;
}

function run() {
  let value = "local";
  return getValue();
}

run(); // "global"
```

## Why the Result is `"global"`

`getValue()` was written in the global scope.

So it uses the global `value`.

It does not use the local `value` inside `run()` just because `run()` called it.

## Backend Example

```js
const role = "admin";

function canAccessDashboard() {
  return role === "admin";
}

function handleRequest() {
  const role = "guest";
  return canAccessDashboard();
}

handleRequest(); // true
```

`canAccessDashboard()` reads the `role` from where it was written.

## Interview Answer

Lexical scoping means JavaScript determines variable access based on where functions are written in the source code, not where they are called at runtime.

