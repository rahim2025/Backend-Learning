# JavaScript vs Node.js

JavaScript is the programming language.

Node.js is a runtime environment that runs JavaScript outside the browser.

| Topic | JavaScript | Node.js |
| --- | --- | --- |
| Type | Language | Runtime environment |
| Purpose | Defines syntax and behavior | Runs JavaScript outside browser |
| Browser DOM | Available in browser | Not available by default |
| Server APIs | Not part of JS itself | Provides APIs like `fs`, `http`, `path` |
| Use case | Browser logic, backend logic, general programming | Backend servers, APIs, tools |

## JavaScript Example

```js
const user = "Rahim";
console.log(user);
```

## Node.js Example

```js
const fs = require("fs");

fs.writeFileSync("hello.txt", "Hello from Node.js");
```

`fs` is not the JavaScript language. It is a Node.js module.

## Interview Answer

JavaScript is the language. Node.js is a runtime that executes JavaScript outside the browser and provides backend APIs such as file system, HTTP, streams, and networking.

