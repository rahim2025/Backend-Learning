# Function Declaration

A function declaration defines a named function.

```js
function hello() {}
```

Function declarations are fully hoisted.

You can call them before the declaration line.

```js
hello(); // works

function hello() {
  console.log("Hello");
}
```

## Why It Works

During JavaScript's creation phase, the whole function declaration is stored in memory.

So when execution starts, `hello` already points to the function.

## Interview Answer

A function declaration is fully hoisted, meaning the function itself is available before the line where it is written.

