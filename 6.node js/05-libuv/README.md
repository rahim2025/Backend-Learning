# What is libuv?

libuv is a C library used by Node.js.

It provides the event loop and asynchronous I/O support.

```txt
libuv = event loop + async I/O support for Node.js
```

## What libuv Helps With

libuv helps Node.js handle:

- Event loop
- File system operations
- Networking
- Timers
- Thread pool
- Cross-platform async behavior

## Example

```js
const fs = require("fs");

fs.readFile("data.txt", "utf8", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
});
```

Behind the scenes:

- V8 runs the JavaScript.
- Node.js exposes the `fs` API.
- libuv helps handle the async file operation.

## Interview Answer

libuv is the library that gives Node.js its event loop and asynchronous I/O support. It helps Node handle timers, networking, file system operations, and some thread-pool work in a cross-platform way.

