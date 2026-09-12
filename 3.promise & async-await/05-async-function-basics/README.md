# async Function Basics

An `async` function always returns a Promise.

```js
async function getName() {
  return "Rahim";
}

getName().then((name) => {
  console.log(name); // "Rahim"
});
```

Returning a value from an `async` function resolves the returned Promise.

```js
async function getNumber() {
  return 10;
}

// Similar to:
Promise.resolve(10);
```

## `await`

`await` waits for a Promise to settle inside an async function.

```js
async function run() {
  const user = await getUser(1);
  console.log(user);
}
```

Important:

`await` pauses the async function, not the entire program.

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

