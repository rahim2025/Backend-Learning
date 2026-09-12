# Node.js

This folder contains backend interview notes about Node.js: what it is, how it differs from JavaScript, what it is commonly used for, the roles of V8 and libuv, and how modules organize Node.js code.

Node.js is important for backend development because it lets developers run JavaScript outside the browser and build servers, APIs, tools, and real-time applications.

## Topics

1. [What is Node.js?](01-what-is-node/README.md)
2. [JavaScript vs Node.js](02-js-vs-nodejs/README.md)
3. [Common Uses of Node.js](03-common-uses/README.md)
4. [What is V8?](04-v8/README.md)
5. [What is libuv?](05-libuv/README.md)
6. [Node.js Modules](06-modules/README.md)
7. [Interview Questions](07-interview-questions/interview-questions.md)
8. [Cheat Sheet](08-cheat-sheet/README.md)

## 1. What is Node.js?

Node.js is a JavaScript runtime environment.

That means Node.js lets JavaScript run outside the browser.

Simple definition:

```txt
Node.js = JavaScript runtime for running JavaScript outside the browser
```

With Node.js, JavaScript can do backend tasks such as:

- Creating web servers
- Building REST APIs
- Reading and writing files
- Connecting to databases
- Handling network requests
- Building command-line tools

Example:

```js
console.log("Hello from Node.js");
```

Run it with:

```bash
node app.js
```

## 2. Difference Between JavaScript and Node.js

JavaScript is the programming language.

Node.js is a runtime environment that executes JavaScript outside the browser.

| Topic | JavaScript | Node.js |
| --- | --- | --- |
| What it is | Programming language | Runtime environment |
| Runs in | Browser, Node.js, other runtimes | Outside the browser |
| Main purpose | Language syntax and behavior | Backend/server-side execution |
| Browser APIs | Can use DOM APIs in browser | No DOM by default |
| Node APIs | Not part of the language itself | Provides APIs like `fs`, `http`, `path` |

Example:

```js
// JavaScript language feature
const name = "Rahim";
console.log(name);
```

Node.js-specific example:

```js
const fs = require("fs");

fs.writeFileSync("note.txt", "Hello from Node.js");
```

`fs` is not JavaScript itself. It is a Node.js module.

## 3. What Node.js Is Commonly Used For

Node.js is commonly used for backend and server-side development.

Common use cases:

| Use case | Example |
| --- | --- |
| REST APIs | Express.js API for users, products, auth |
| Real-time apps | Chat apps, live notifications, multiplayer features |
| Microservices | Small independent backend services |
| Command-line tools | Developer tools and scripts |
| File processing | Reading, writing, uploading files |
| Streaming apps | Video/audio/data streams |
| Backend for SPAs | API server for React, Vue, Angular apps |

Node.js is especially useful for I/O-heavy applications because it can handle many asynchronous operations efficiently.

## 4. What is V8?

V8 is Google's JavaScript engine.

It parses, compiles, and executes JavaScript code.

Simple definition:

```txt
V8 = JavaScript engine that runs JavaScript code
```

V8 is used by:

- Google Chrome
- Node.js

In Node.js, V8 is responsible for running JavaScript code.

Example:

```js
const total = 10 + 20;
console.log(total);
```

V8 handles the JavaScript execution.

Important:

V8 does not provide backend APIs like file system or networking by itself. Those are provided by Node.js and lower-level libraries.

## 5. What is libuv?

libuv is a C library used by Node.js to handle asynchronous I/O and the event loop.

Simple definition:

```txt
libuv = library that gives Node.js the event loop and async I/O support
```

libuv helps Node.js with:

- Event loop
- File system operations
- Networking
- Timers
- Thread pool for some expensive operations
- Cross-platform async behavior

Example:

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

V8 runs the JavaScript.

Node.js exposes the `fs` API.

libuv helps handle the async file operation behind the scenes.

## 6. Node.js Modules

A module is reusable code kept in a separate file or package.

Modules help organize backend code into smaller files with clear responsibilities.

Simple definition:

```txt
Module = reusable code in a separate file or package
```

Types of modules:

| Type | Meaning | Examples |
| --- | --- | --- |
| Core module | Built into Node.js | `fs`, `path`, `http` |
| Local module | Your own file | `./userService`, `./utils/logger` |
| Third-party module | Installed from npm | `express`, `mongoose`, `jsonwebtoken` |

CommonJS:

```js
const logger = require("./logger");

module.exports = logger;
```

ES Modules:

```js
import logger from "./logger.js";

export default logger;
export { logger };
```

## How Node.js Fits Together

```txt
Your JavaScript code
        |
        v
Node.js runtime
        |
        +--> V8 runs JavaScript
        |
        +--> libuv handles event loop and async I/O
        |
        +--> Node APIs provide modules like fs, http, path
```

## Interview Summary

A strong interview answer:

> Node.js is a JavaScript runtime that allows JavaScript to run outside the browser, mainly for backend development. JavaScript is the language, while Node.js is the environment that runs it and provides server-side APIs like `fs`, `http`, and `path`. Node.js is commonly used for APIs, real-time apps, microservices, command-line tools, and I/O-heavy backend systems. V8 executes JavaScript code, while libuv provides the event loop and asynchronous I/O support.
