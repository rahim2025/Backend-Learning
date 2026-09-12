# Promise Chaining

Promise chaining means returning values or Promises from `.then()` so the next `.then()` can use the result.

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

## Returning a Normal Value

```js
Promise.resolve(5)
  .then((value) => value * 2)
  .then((value) => {
    console.log(value); // 10
  });
```

## Returning Another Promise

```js
getUser(1)
  .then((user) => {
    return getOrders(user.id);
  })
  .then((orders) => {
    console.log(orders);
  });
```

The chain waits for the returned Promise to settle.

## Common Mistake

Forgetting to return a Promise:

```js
getUser(1)
  .then((user) => {
    getOrders(user.id); // missing return
  })
  .then((orders) => {
    console.log(orders); // undefined
  });
```

Fix:

```js
getUser(1)
  .then((user) => {
    return getOrders(user.id);
  })
  .then((orders) => {
    console.log(orders);
  });
```

