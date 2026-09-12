# Node.js Interview Questions

## Q: What is Node.js?

Node.js is a JavaScript runtime environment that lets JavaScript run outside the browser. It is commonly used for backend servers, APIs, command-line tools, and real-time applications.

## Q: What is the difference between JavaScript and Node.js?

JavaScript is the programming language. Node.js is a runtime environment that executes JavaScript outside the browser and provides backend APIs like `fs`, `http`, `path`, streams, and networking.

## Q: What is Node.js commonly used for?

Node.js is commonly used for REST APIs, real-time applications, microservices, command-line tools, file processing, streaming, and I/O-heavy backend systems.

## Q: What is V8?

V8 is Google's JavaScript engine. It parses, compiles, and executes JavaScript code. Node.js uses V8 to run JavaScript outside the browser.

## Q: What is libuv?

libuv is a C library used by Node.js to provide the event loop and asynchronous I/O support. It helps with timers, networking, file system operations, and thread-pool work.

## Q: How do V8 and libuv work together in Node.js?

V8 executes JavaScript code. libuv handles the event loop and async I/O. Node.js connects them and provides APIs like `fs`, `http`, and `path`.

## Q: Does V8 handle file system operations?

No. V8 runs JavaScript code. File system APIs are provided by Node.js, and asynchronous file operations are supported by libuv behind the scenes.
