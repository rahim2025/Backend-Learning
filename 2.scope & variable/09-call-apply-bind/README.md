# `call`, `apply`, and `bind`

`call`, `apply`, and `bind` are function methods used to control the value of `this`.

They answer this problem:

```txt
Run this function as if this belongs to this object.
```

This connects directly to the `this` topic: normal function `this` depends on how the function is called, not where it is written.

## Why Do We Need Them?

Sometimes a function is not inside an object, but we still want to run it with a specific `this`.

```js
function showName() {
  console.log(this.name);
}

const user = {
  name: "Rahim"
};

showName.call(user); // "Rahim"
```

Here:

```js
showName.call(user);
```

means:

```txt
Run showName, and inside it, make this = user.
```

## 1. `call()`

`call()` does two things:

1. Sets `this`.
2. Calls the function immediately.

```js
function introduce(city, country) {
  console.log(`${this.name} lives in ${city}, ${country}`);
}

const user = {
  name: "Rahim"
};

introduce.call(user, "Dhaka", "Bangladesh");
```

Output:

```txt
Rahim lives in Dhaka, Bangladesh
```

Rule:

```js
functionName.call(thisValue, arg1, arg2, arg3);
```

## 2. `apply()`

`apply()` is almost the same as `call()`.

Difference:

| Method | Arguments |
| --- | --- |
| `call()` | One by one |
| `apply()` | As an array |

```js
introduce.apply(user, ["Dhaka", "Bangladesh"]);
```

Output:

```txt
Rahim lives in Dhaka, Bangladesh
```

Rule:

```js
functionName.apply(thisValue, [arg1, arg2, arg3]);
```

## 3. `bind()`

`bind()` is different.

It does not call the function immediately.

It returns a new function with fixed `this`.

```js
const boundIntroduce = introduce.bind(user);

boundIntroduce("Dhaka", "Bangladesh");
```

Output:

```txt
Rahim lives in Dhaka, Bangladesh
```

Rule:

```js
const newFn = functionName.bind(thisValue);
newFn();
```

## Main Difference

| Method | Calls immediately? | Argument style | Return value |
| --- | --- | --- | --- |
| `call()` | Yes | One by one | Function result |
| `apply()` | Yes | Array | Function result |
| `bind()` | No | One by one now or later | New function |

Short version:

```txt
call  -> calls immediately, args one by one
apply -> calls immediately, args as array
bind  -> returns new function, does not call immediately
```

## Interview Example

```js
function greet(message) {
  console.log(`${message}, ${this.name}`);
}

const user = {
  name: "Rahim"
};

greet.call(user, "Hello");
greet.apply(user, ["Hi"]);

const greetRahim = greet.bind(user);
greetRahim("Welcome");
```

Output:

```txt
Hello, Rahim
Hi, Rahim
Welcome, Rahim
```

## `bind(null)`

Sometimes you will see `bind(null)`.

This usually means:

```txt
I do not care about this. I only want to pre-fill some arguments.
```

Example:

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);

double(5); // 10
double(8); // 16
```

Here, `multiply` does not use `this`, so `null` is just a placeholder for the `thisValue`.

`bind()` also supports partial application:

```js
const double = multiply.bind(null, 2);
```

means:

```txt
Create a new function where the first argument is always 2.
```

### If the Function Uses `this`

In strict mode, binding `this` to `null` keeps it as `null`.

```js
"use strict";

function showThis() {
  return this;
}

const bound = showThis.bind(null);

bound(); // null
```

In non-strict mode, JavaScript may replace `null` or `undefined` with the global object. For backend interviews, mention strict mode if you discuss `bind(null)` with `this`.

## Important: Arrow Functions Ignore `call`, `apply`, and `bind` for `this`

Arrow functions do not have their own `this`.

```js
const user = {
  name: "Rahim"
};

const showName = () => {
  console.log(this.name);
};

showName.call(user); // does not make this = user
```

`call`, `apply`, and `bind` can pass arguments to arrow functions, but they cannot change an arrow function's `this`.

## Backend Example

`bind()` is common when passing class methods as callbacks.

```js
class UserController {
  constructor() {
    this.name = "UserController";
  }

  getUsers(req, res) {
    res.send(this.name);
  }
}

const controller = new UserController();

app.get("/users", controller.getUsers.bind(controller));
```

Without `bind(controller)`, the route handler may lose `this`.

## Interview Answer

`call`, `apply`, and `bind` let us control `this` for normal functions. `call` sets `this` and calls the function immediately with arguments one by one. `apply` also calls immediately, but takes arguments as an array. `bind` does not call immediately; it returns a new function with fixed `this`. `bind(null)` is often used when we do not care about `this` and only want to pre-fill arguments.

