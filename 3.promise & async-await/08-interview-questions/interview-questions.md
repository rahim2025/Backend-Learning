# Promises and async/await Interview Questions

## Q: What is a Promise?

A Promise is an object that represents a future result of an asynchronous operation. It can be pending, fulfilled, or rejected.

## Q: Why are Promises used?

Promises are used to handle asynchronous operations in a cleaner way than nested callbacks. They allow chaining, centralized error handling, and better readability.

## Q: What are the Promise states?

The three Promise states are `pending`, `fulfilled`, and `rejected`.

## Q: What does `resolve()` do?

`resolve()` fulfills a Promise with a successful value.

## Q: What does `reject()` do?

`reject()` rejects a Promise with an error or failure reason.

## Q: Can a Promise settle more than once?

No. A Promise settles only once. After it is fulfilled or rejected, later `resolve()` or `reject()` calls are ignored.

## Q: How do you consume a Promise?

Use `.then()` for success, `.catch()` for errors, and `.finally()` for cleanup.

```js
getUser(1)
  .then((user) => console.log(user))
  .catch((error) => console.error(error))
  .finally(() => console.log("Done"));
```

## Q: What is Promise chaining?

Promise chaining means returning values or Promises from `.then()` so each next `.then()` receives the previous result.

## Q: How does Promise error handling work?

`.catch()` handles rejected Promises and errors thrown inside `.then()`.

```js
Promise.resolve()
  .then(() => {
    throw new Error("Failed");
  })
  .catch((error) => {
    console.log(error.message);
  });
```

## Q: What does an async function return?

An `async` function always returns a Promise. If it returns a normal value, that value becomes the fulfilled value of the Promise.

## Q: What does `await` do?

`await` pauses the async function until the Promise settles. It does not pause the whole program.

## Q: How do you handle errors with async/await?

Use `try/catch`.

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

## Q: How do Promises and await work with the event loop?

Promise callbacks and code after `await` run as microtasks. Synchronous code runs first, then microtasks run before timers.

