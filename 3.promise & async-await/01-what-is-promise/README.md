# What is a Promise?

A Promise is an object that represents a future result of an asynchronous operation.

```txt
A Promise is a placeholder for a value that may be available later.
```

## Why Promises Are Used

Promises are used to handle asynchronous work in a cleaner way than nested callbacks.

Backend examples:

- Database query
- API request
- File read
- Authentication check
- Payment request

## Promise States

| State | Meaning |
| --- | --- |
| `pending` | Initial state; not completed yet |
| `fulfilled` | Completed successfully |
| `rejected` | Failed |

## `resolve()`

`resolve()` fulfills a Promise.

```js
const promise = new Promise((resolve) => {
  resolve("User found");
});

promise.then((value) => {
  console.log(value); // "User found"
});
```

## `reject()`

`reject()` rejects a Promise.

```js
const promise = new Promise((resolve, reject) => {
  reject(new Error("User not found"));
});

promise.catch((error) => {
  console.log(error.message); // "User not found"
});
```

## Promise Settles Only Once

```js
const promise = new Promise((resolve, reject) => {
  resolve("first");
  reject(new Error("second"));
  resolve("third");
});

promise.then((value) => {
  console.log(value); // "first"
});
```

Only the first `resolve()` or `reject()` matters.

