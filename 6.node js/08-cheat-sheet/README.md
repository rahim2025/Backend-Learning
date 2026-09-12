# Node.js Cheat Sheet

## Node.js

```txt
Node.js = JavaScript runtime outside the browser
```

Used for:

- Backend servers
- REST APIs
- Real-time apps
- Microservices
- Command-line tools
- File processing
- Streams

## JavaScript vs Node.js

| JavaScript | Node.js |
| --- | --- |
| Programming language | Runtime environment |
| Defines syntax and behavior | Runs JS outside browser |
| Browser can provide DOM APIs | Provides backend APIs |
| Not tied to Node only | Uses V8 to execute JS |

## V8

```txt
V8 = JavaScript engine
```

V8:

- Parses JavaScript
- Compiles JavaScript
- Executes JavaScript
- Is used by Chrome and Node.js

## libuv

```txt
libuv = event loop + async I/O support
```

libuv helps with:

- Event loop
- Timers
- Networking
- File system operations
- Thread pool
- Cross-platform async behavior

## Modules

```txt
Module = reusable code in a separate file or package
```

Types:

| Type | Examples |
| --- | --- |
| Core module | `fs`, `path`, `http` |
| Local module | `./logger`, `./userService` |
| Third-party module | `express`, `mongoose` |

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

## Mental Model

```txt
JavaScript code
    |
    v
Node.js runtime
    |
    +--> V8 executes JavaScript
    |
    +--> libuv handles event loop and async I/O
    |
    +--> Node APIs expose fs, http, path, streams
```
