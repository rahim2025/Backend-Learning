# Node.js Modules

A module is reusable code kept in a separate file or package.

Modules help you split a Node.js application into smaller parts instead of writing everything in one large file.

Simple definition:

```txt
Module = reusable code in a separate file or package
```

## Why Modules Matter

In backend projects, modules are used to organize code by responsibility.

For example:

```txt
app.js
routes/userRoutes.js
controllers/userController.js
services/userService.js
utils/logger.js
```

Each file can focus on one job, then other files can import or require it when needed.

## Types of Modules in Node.js

| Type | Meaning | Examples |
| --- | --- | --- |
| Core module | Built into Node.js | `fs`, `path`, `http` |
| Local module | Your own file | `./userService`, `./utils/logger` |
| Third-party module | Installed from npm | `express`, `mongoose`, `jsonwebtoken` |

## 1. Core Modules

Core modules come with Node.js. You do not need to install them.

Example:

```js
const fs = require("fs");
const path = require("path");

console.log(path.join("uploads", "avatar.png"));
```

Common core modules:

- `fs` for file system work
- `path` for file paths
- `http` for creating HTTP servers
- `crypto` for cryptography features
- `events` for event-based code

## 2. Local Modules

Local modules are files you create yourself.

Example:

```js
// logger.js
function logger(message) {
  console.log(`[LOG]: ${message}`);
}

module.exports = logger;
```

Use it in another file:

```js
// app.js
const logger = require("./logger");

logger("Server started");
```

Important:

Use `./` when importing your own local file.

```js
require("./logger");
```

Without `./`, Node.js will think you are trying to load a core module or npm package.

## 3. Third-Party Modules

Third-party modules are packages installed from npm.

Example:

```bash
npm install express
```

Use it:

```js
const express = require("express");

const app = express();
```

## CommonJS Modules

CommonJS is the traditional Node.js module system.

Import:

```js
const userService = require("./userService");
```

Export one value:

```js
module.exports = userService;
```

Export multiple values:

```js
module.exports = {
  createUser,
  getUser,
};
```

## ES Modules

ES Modules use modern JavaScript `import` and `export` syntax.

Import:

```js
import userService from "./userService.js";
```

Export one default value:

```js
export default userService;
```

Export multiple named values:

```js
export { createUser, getUser };
```

In Node.js, ES Modules usually require one of these:

- Use `"type": "module"` in `package.json`
- Use the `.mjs` file extension

## CommonJS vs ES Modules

| Topic | CommonJS | ES Modules |
| --- | --- | --- |
| Import syntax | `require()` | `import` |
| Export syntax | `module.exports` | `export` |
| File style | Older Node.js style | Modern JavaScript style |
| Common in | Many existing Node.js projects | Modern Node.js and frontend projects |

## Interview Answer

> A module in Node.js is reusable code stored in a separate file or package. Node.js has core modules like `fs`, local modules created by developers, and third-party modules installed from npm. Modules can use CommonJS syntax with `require()` and `module.exports`, or ES Module syntax with `import` and `export`.
