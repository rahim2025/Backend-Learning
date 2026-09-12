# Promises and async/await Cheat Sheet

## Promise

```txt
Promise = future result of an async operation
```

## States

| State | Meaning |
| --- | --- |
| `pending` | Not finished yet |
| `fulfilled` | Success |
| `rejected` | Failed |

## `resolve()` and `reject()`

```js
const promise = new Promise((resolve, reject) => {
  resolve("success");
  reject(new Error("fail")); // ignored
});
```

A Promise settles only once.

## Consume Promises

```js
getUser(1)
  .then((user) => console.log(user))
  .catch((error) => console.error(error))
  .finally(() => console.log("Done"));
```

## Promise Chaining

```js
getUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getPayment(orders[0].id))
  .then((payment) => console.log(payment))
  .catch((error) => console.error(error));
```

## async Function

An `async` function always returns a Promise.

```js
async function getName() {
  return "Rahim";
}
```

## await

`await` pauses the async function, not the whole program.

```js
async function run() {
  const user = await getUser(1);
  console.log(user);
}
```

## async/await Error Handling

```js
async function run() {
  try {
    const user = await getUser(1);
    console.log(user);
  } catch (error) {
    console.log(error.message);
  }
}
```

## Event Loop

Promise callbacks and code after `await` run as microtasks.

```js
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");

// A
// C
// B
```

With `await`:

```js
async function run() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

run();
console.log("C");

// A
// C
// B
```

