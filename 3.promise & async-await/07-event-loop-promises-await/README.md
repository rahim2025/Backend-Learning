# Event Loop with Promises and await

Promise callbacks and `async/await` continuations run as microtasks.

## Promise Microtask

```js
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");
```

Output:

```txt
A
C
B
```

Synchronous code runs first. The Promise callback runs later as a microtask.

## await Continuation

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

Code before `await` runs synchronously. Code after `await` continues as a microtask.

## With Timers

```js
console.log("A");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("B");
```

Output:

```txt
A
B
promise
timeout
```

Promise microtasks run before timer callbacks.

## Node.js Note

In Node.js:

```txt
process.nextTick() runs before Promise microtasks.
Promise microtasks run before timers.
```

```js
process.nextTick(() => {
  console.log("nextTick");
});

Promise.resolve().then(() => {
  console.log("promise");
});

setTimeout(() => {
  console.log("timeout");
}, 0);
```

Common output:

```txt
nextTick
promise
timeout
```

