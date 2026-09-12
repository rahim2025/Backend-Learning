# Consuming Promises

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

## `.then()`

`.then()` receives the fulfilled value.

```js
Promise.resolve("Rahim").then((name) => {
  console.log(name); // "Rahim"
});
```

## `.catch()`

`.catch()` receives the rejection reason.

```js
Promise.reject(new Error("Failed")).catch((error) => {
  console.log(error.message); // "Failed"
});
```

## `.finally()`

`.finally()` runs whether the Promise succeeds or fails.

```js
connectDatabase()
  .then(() => {
    console.log("Connected");
  })
  .catch(() => {
    console.log("Connection failed");
  })
  .finally(() => {
    console.log("Connection attempt finished");
  });
```

