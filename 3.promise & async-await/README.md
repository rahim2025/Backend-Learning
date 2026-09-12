# Promises and async/await

This folder contains backend interview notes about JavaScript Promises, Promise chaining, error handling, `async` functions, `await`, and how Promises interact with the event loop.

Promises and `async/await` are essential for backend development because server-side JavaScript often deals with asynchronous work:

- Database queries
- API calls
- File system operations
- Authentication checks
- Network requests
- Queue and background jobs

## Topics

1. [What is a Promise?](01-what-is-promise/README.md)
2. [Consuming Promises](02-consuming-promises/README.md)
3. [Promise Chaining](03-promise-chaining/README.md)
4. [Error Handling in Promises](04-error-handling-promises/README.md)
5. [async Function Basics](05-async-function-basics/README.md)
6. [async/await Error Handling](06-async-await-error-handling/README.md)
7. [Event Loop with Promises and await](07-event-loop-promises-await/README.md)
8. [Interview Questions](08-interview-questions/interview-questions.md)
9. [Cheat Sheet](09-cheat-sheet/README.md)

## 1. What is a Promise?

A Promise is an object that represents a future result of an asynchronous operation.

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Data loaded");
  } else {
    reject("Something went wrong");
  }
});
```

In simple words:

```txt
A Promise is a placeholder for a value that may be available later.
```

## 2. Why Promises Are Used

Promises are used to handle asynchronous operations without deeply nested callbacks.

Without Promises:

```js
getUser(id, function (user) {
  getOrders(user.id, function (orders) {
    getPayment(orders[0].id, function (payment) {
      console.log(payment);
    });
  });
});
```

This becomes hard to read and maintain.

With Promises:

```js
getUser(id)
  .then((user) => getOrders(user.id))
  .then((orders) => getPayment(orders[0].id))
  .then((payment) => {
    console.log(payment);
  })
  .catch((error) => {
    console.error(error);
  });
```

Promises help with:

- Avoiding callback nesting
- Chaining async steps
- Centralized error handling
- Cleaner backend request flow

## 3. Promise States

A Promise has three states:

| State | Meaning |
| --- | --- |
| `pending` | Initial state; operation is not finished yet |
| `fulfilled` | Operation completed successfully |
| `rejected` | Operation failed |

```js
const promise = fetchUser();
```

At first, the Promise is usually `pending`.

If the operation succeeds, it becomes `fulfilled`.

If the operation fails, it becomes `rejected`.

## 4. `resolve()`

`resolve()` fulfills a Promise with a successful value.

```js
const promise = new Promise((resolve) => {
  resolve("User found");
});

promise.then((value) => {
  console.log(value); // "User found"
});
```

## 5. `reject()`

`reject()` rejects a Promise with an error or failure reason.

```js
const promise = new Promise((resolve, reject) => {
  reject(new Error("User not found"));
});

promise.catch((error) => {
  console.log(error.message); // "User not found"
});
```

## 6. Promise Settles Only Once

A Promise can settle only once.

Once it is fulfilled or rejected, later `resolve()` or `reject()` calls are ignored.

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

Only the first settlement matters.

## 7. Consuming Promises

Promises are consumed with:

- `.then()` for success
- `.catch()` for errors
- `.finally()` for cleanup

```js
getUser(1)
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
```

## 8. Promise Chaining

Promise chaining means returning values or Promises from `.then()` to pass data to the next step.

```js
getUser(1)
  .then((user) => {
    return getOrders(user.id);
  })
  .then((orders) => {
    return getPayment(orders[0].id);
  })
  .then((payment) => {
    console.log(payment);
  });
```

Each `.then()` receives the result from the previous step.

## 9. Error Handling in Promises

Errors in a Promise chain can be handled with `.catch()`.

```js
getUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getPayment(orders[0].id))
  .catch((error) => {
    console.error("Request failed:", error.message);
  });
```

`.catch()` handles:

- Promise rejections
- Errors thrown inside `.then()`

```js
Promise.resolve("user")
  .then(() => {
    throw new Error("Something broke");
  })
  .catch((error) => {
    console.log(error.message); // "Something broke"
  });
```

## 10. async Function Basics

An `async` function always returns a Promise.

```js
async function getName() {
  return "Rahim";
}

getName().then((name) => {
  console.log(name); // "Rahim"
});
```

Returning a value from an `async` function is like resolving a Promise with that value.

```js
async function getNumber() {
  return 10;
}

// Same idea as:
Promise.resolve(10);
```

`await` pauses the async function until the Promise settles.

```js
async function run() {
  const user = await getUser(1);
  console.log(user);
}
```

## 11. async/await Error Handling

Use `try/catch` with `async/await`.

```js
async function getUserHandler(req, res) {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).send("Failed to load user");
  }
}
```

If an awaited Promise rejects, JavaScript jumps to the nearest `catch`.

## 12. Event Loop with Promises and await

Promise callbacks and `async/await` continuations run as microtasks.

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

With `await`:

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

Code before `await` runs synchronously. Code after `await` continues later as a microtask.

## Interview Summary

A strong interview answer should mention:

- A Promise represents a future async result.
- Promise states are `pending`, `fulfilled`, and `rejected`.
- `resolve()` fulfills a Promise.
- `reject()` rejects a Promise.
- A Promise settles only once.
- `.then()` handles success.
- `.catch()` handles errors.
- `.finally()` runs cleanup.
- Promise chaining passes results through multiple async steps.
- `async` functions always return Promises.
- `await` pauses only the async function, not the whole program.
- `try/catch` handles rejected Promises with `async/await`.
- Promise callbacks and code after `await` run as microtasks.

