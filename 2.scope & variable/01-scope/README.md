# Scope

Scope means where a variable is accessible.

```js
const appName = "Backend App";

function startServer() {
  const port = 3000;

  console.log(appName); // allowed
  console.log(port); // allowed
}

startServer();
console.log(port); // ReferenceError
```

## Main Rule

Inner scope can access outer scope.

Outer scope cannot access inner scope.

| Scope Direction | Allowed? | Example |
| --- | --- | --- |
| Inner to outer | Yes | Function reads global variable |
| Outer to inner | No | Global code reads function variable |

## Backend Example

```js
const dbName = "learning_db";

function connectDatabase() {
  const connectionId = "abc123";

  console.log(dbName); // allowed
}

console.log(connectionId); // ReferenceError
```

`connectionId` is local to `connectDatabase()`, so outside code cannot access it.

## Interview Answer

Scope defines where a variable can be accessed. JavaScript supports nested scopes, so inner scopes can access variables from outer scopes, but outer scopes cannot access variables declared inside inner scopes.

