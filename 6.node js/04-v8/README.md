# What is V8?

V8 is Google's JavaScript engine.

It parses, compiles, and executes JavaScript code.

```txt
V8 = JavaScript engine that runs JavaScript code
```

V8 is used by:

- Google Chrome
- Node.js

## What V8 Does

V8 handles JavaScript execution:

```js
const total = 10 + 20;
console.log(total);
```

V8 runs this JavaScript code.

## What V8 Does Not Do

V8 does not provide Node.js backend APIs by itself.

For example:

```js
const fs = require("fs");
```

The `fs` module is provided by Node.js, not the JavaScript language and not V8 alone.

## Interview Answer

V8 is the JavaScript engine used by Node.js and Chrome. In Node.js, V8 executes JavaScript code, while Node.js and libuv provide backend APIs and asynchronous I/O support.

