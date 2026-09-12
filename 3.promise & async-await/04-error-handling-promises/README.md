# Error Handling in Promises

Errors in Promise chains are handled with `.catch()`.

```js
getUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getPayment(orders[0].id))
  .catch((error) => {
    console.error("Request failed:", error.message);
  });
```

## `.catch()` Handles Rejections

```js
Promise.reject(new Error("Database failed"))
  .catch((error) => {
    console.log(error.message); // "Database failed"
  });
```

## `.catch()` Handles Thrown Errors

```js
Promise.resolve("user")
  .then(() => {
    throw new Error("Something broke");
  })
  .catch((error) => {
    console.log(error.message); // "Something broke"
  });
```

## Backend Pattern

```js
getUser(req.params.id)
  .then((user) => {
    res.json(user);
  })
  .catch((error) => {
    res.status(500).json({
      message: "Failed to load user"
    });
  });
```

Always handle Promise errors in backend request handlers, otherwise rejected Promises can become unhandled errors.

