# Node.js Event Loop Order

This topic explains the common execution order for synchronous code, microtasks, timers, I/O callbacks, and `setImmediate()` in Node.js.

Backend developers need this because Node.js handles many operations asynchronously: API requests, database calls, file system reads, timers, streams, and network I/O.

## Big Picture Order

A useful mental model:

```txt
1. Synchronous code
2. process.nextTick()
3. Promise microtasks / async-await continuation
4. Timers: setTimeout, setInterval
5. I/O callbacks
6. Check phase: setImmediate()
```

This order is a simplified interview model. The real Node.js event loop has more details, but this is enough for most backend interview questions.

## 1. Synchronous Code

Synchronous code runs first.

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

Output:

```txt
A
C
B
```

Why?

`console.log("A")` and `console.log("C")` are synchronous. The timer callback waits until the current call stack is empty.

## 2. `process.nextTick()`

`process.nextTick()` is Node.js-specific.

It runs after the current synchronous code finishes, before Promise microtasks.

```js
console.log("start");

process.nextTick(() => {
  console.log("nextTick");
});

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");
```

Output:

```txt
start
end
nextTick
promise
```

Important:

`process.nextTick()` is not a normal event loop phase. It has its own priority queue in Node.js.

Backend warning:

Too many recursive `process.nextTick()` calls can starve the event loop and delay timers, I/O, and Promise callbacks.

## 3. Promise Microtasks / async-await Continuation

Promise `.then()`, `.catch()`, `.finally()`, and `async/await` continuations run as microtasks.

```js
console.log("start");

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");
```

Output:

```txt
start
end
promise
```

### `async/await` Continuation

Code after `await` continues in a microtask.

```js
async function run() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

run();
console.log("C");
```

Output:

```txt
A
C
B
```

Why?

The function starts synchronously until `await`. After the awaited Promise resolves, the rest of the function continues as a microtask.

## 4. Timers: `setTimeout` and `setInterval`

Timer callbacks run in the timers phase.

```js
setTimeout(() => {
  console.log("timeout");
}, 0);

console.log("sync");
```

Output:

```txt
sync
timeout
```

`setTimeout(fn, 0)` does not mean "run immediately." It means "run after the current synchronous work and higher-priority queues are done, when the timers phase is reached."

`setInterval()` also runs in the timers phase, but repeats after the interval.

```js
const id = setInterval(() => {
  console.log("tick");
  clearInterval(id);
}, 1000);
```

## 5. I/O Callbacks

I/O callbacks are callbacks from operations such as file system reads, network events, database drivers, and streams.

Example:

```js
const fs = require("fs");

fs.readFile("file.txt", () => {
  console.log("I/O callback");
});

console.log("sync");
```

Output shape:

```txt
sync
I/O callback
```

The exact timing depends on when the I/O operation finishes.

Important backend idea:

I/O is one reason Node.js can handle many requests efficiently. While Node waits for I/O, it can continue running other callbacks.

## 6. Check Phase: `setImmediate()`

`setImmediate()` runs in the check phase.

```js
setImmediate(() => {
  console.log("immediate");
});

console.log("sync");
```

Output:

```txt
sync
immediate
```

`setImmediate()` is often used when you want a callback to run after the current poll phase.

## `setTimeout(0)` vs `setImmediate()`

At the top level, the order between `setTimeout(fn, 0)` and `setImmediate(fn)` can vary.

```js
setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});
```

Possible output:

```txt
timeout
immediate
```

or:

```txt
immediate
timeout
```

Inside an I/O callback, `setImmediate()` usually runs before `setTimeout(0)`.

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log("timeout");
  }, 0);

  setImmediate(() => {
    console.log("immediate");
  });
});
```

Typical output:

```txt
immediate
timeout
```

## Combined Example

```js
console.log("sync 1");

setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});

Promise.resolve().then(() => {
  console.log("promise");
});

process.nextTick(() => {
  console.log("nextTick");
});

console.log("sync 2");
```

Common output:

```txt
sync 1
sync 2
nextTick
promise
timeout
immediate
```

At top level, `timeout` and `immediate` order can vary. The stable interview point is:

- Synchronous code runs first.
- `process.nextTick()` runs before Promise microtasks in Node.js.
- Promise and `async/await` continuations run before timers.
- Timers and `setImmediate()` run in later event loop phases.

## Interview Answer

In Node.js, synchronous code runs first. After the call stack is empty, Node processes `process.nextTick()` callbacks, then Promise microtasks and `async/await` continuations. After that, event loop phases handle timers like `setTimeout` and `setInterval`, I/O callbacks, and the check phase where `setImmediate()` runs. At the top level, `setTimeout(0)` vs `setImmediate()` order can vary, but inside an I/O callback `setImmediate()` usually runs first.

