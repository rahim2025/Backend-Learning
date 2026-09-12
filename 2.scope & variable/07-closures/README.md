# Closures

A closure is a function together with the outer variables it remembers.

Short definition:

```txt
Closure = function + remembered outer variables
```

Closures come from lexical scoping. Because JavaScript functions use the scope where they were written, a function can keep access to outer variables even after the outer function has finished running.

## Basic Closure Example

```js
function outer() {
  const message = "Hello from outer";

  function inner() {
    return message;
  }

  return inner;
}

const fn = outer();

fn(); // "Hello from outer"
```

Why does this work?

`outer()` has already finished, but `inner()` still remembers `message`.

That remembered scope is the closure.

## Closures Preserve State

Closures can keep data alive between function calls.

```js
function createCounter() {
  let count = 0;

  return function increment() {
    count++;
    return count;
  };
}

const counter = createCounter();

counter(); // 1
counter(); // 2
counter(); // 3
```

`count` is not recreated every time `counter()` runs. It is preserved inside the closure.

## Closures Create Private Variables

Closures can hide variables from the outside world.

```js
function createUserSession() {
  let token = "abc123";

  return {
    getToken() {
      return token;
    },
    updateToken(newToken) {
      token = newToken;
    }
  };
}

const session = createUserSession();

session.getToken(); // "abc123"
session.updateToken("xyz789");
session.getToken(); // "xyz789"

console.log(session.token); // undefined
```

`token` is private because it is not directly accessible outside `createUserSession()`.

Backend use cases:

- Keeping configuration private
- Creating middleware with saved options
- Creating reusable validators
- Preserving state inside factories

## Each Function Call Can Create a New Closure

Every call to a function can create a new independent closure.

```js
function createCounter() {
  let count = 0;

  return function increment() {
    count++;
    return count;
  };
}

const counterA = createCounter();
const counterB = createCounter();

counterA(); // 1
counterA(); // 2

counterB(); // 1
counterB(); // 2
```

`counterA` and `counterB` each remember their own separate `count`.

## Closures Come From Lexical Scoping

```js
function createGreeter(name) {
  return function greet() {
    return `Hello, ${name}`;
  };
}

const greetRahim = createGreeter("Rahim");

greetRahim(); // "Hello, Rahim"
```

`greet()` uses `name` from the scope where `greet()` was created.

That is lexical scoping creating a closure.

## `var` in Async Loops Shares One Variable

This is a classic closure interview question.

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

Output:

```txt
4
4
4
```

Why?

`var` is function scoped, so all callbacks close over the same `i`.

By the time the callbacks run, the loop has finished and `i` is `4`.

## `let` Creates a New Variable Per Iteration

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

Output:

```txt
1
2
3
```

Why?

`let` is block scoped. In a `for` loop, JavaScript creates a new `i` for each iteration, so each callback remembers a different variable.

## Fixing the `var` Loop with a Closure

Before `let`, developers often used an extra function to create a new closure per iteration.

```js
for (var i = 1; i <= 3; i++) {
  (function (currentI) {
    setTimeout(function () {
      console.log(currentI);
    }, 1000);
  })(i);
}
```

Output:

```txt
1
2
3
```

`currentI` is a new parameter for each function call, so each timeout callback remembers a separate value.

## Interview Answer

A closure is a function that remembers variables from its outer lexical scope even after the outer function has finished executing. Closures preserve state, can create private variables, and are the reason callbacks can access variables from surrounding functions. In loops, `var` can cause all async callbacks to share one variable, while `let` creates a new binding for each iteration.

