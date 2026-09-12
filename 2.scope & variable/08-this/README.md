# JavaScript `this`

`this` is a special keyword whose value depends on how a function is called.

Important idea:

```txt
this is decided by the call site, not where the function is written.
```

This is different from lexical scoping. Normal variables are resolved based on where code is written. `this` is usually resolved based on how a function is called.

## 1. Global `this`

At the top level, `this` depends on the environment.

In a browser script:

```js
console.log(this); // window
```

In Node.js CommonJS files:

```js
console.log(this); // {}
```

In Node.js modules and strict mode, global `this` behaves differently than old browser scripts.

Backend note:

In modern backend JavaScript, avoid depending on global `this`. Use explicit variables, imports, exports, and function parameters instead.

## 2. `this` Inside Object Method

When a function is called as an object method, `this` usually points to the object before the dot.

```js
const user = {
  name: "Rahim",
  greet() {
    return `Hello, ${this.name}`;
  }
};

user.greet(); // "Hello, Rahim"
```

Here:

```txt
user.greet()
```

The object before the dot is `user`, so `this` is `user`.

## 3. Losing `this`

`this` can be lost when a method is stored in a separate variable or passed as a callback.

```js
const user = {
  name: "Rahim",
  greet() {
    return `Hello, ${this.name}`;
  }
};

const greetFn = user.greet;

greetFn(); // TypeError in strict mode, or "Hello, undefined"
```

Why?

The call is now:

```js
greetFn();
```

There is no object before the dot, so `this` is no longer `user`.

### Fix with `bind`

```js
const boundGreet = user.greet.bind(user);

boundGreet(); // "Hello, Rahim"
```

`bind(user)` permanently sets `this` to `user` for that function.

## 4. Arrow Functions and `this`

Arrow functions do not have their own `this`.

They capture `this` from the surrounding scope.

```js
const user = {
  name: "Rahim",
  greet: () => {
    return `Hello, ${this.name}`;
  }
};

user.greet(); // usually "Hello, undefined"
```

Why?

The arrow function does not get `this` from `user.greet()`. It uses `this` from the outer scope where the object was created.

### Do Not Use Arrow Functions as Object Methods

Prefer normal method syntax:

```js
const user = {
  name: "Rahim",
  greet() {
    return `Hello, ${this.name}`;
  }
};

user.greet(); // "Hello, Rahim"
```

### Arrow Functions Are Useful Inside Methods

Arrow functions are useful when you want to keep the outer method's `this`.

```js
const user = {
  name: "Rahim",
  hobbies: ["coding", "reading"],
  printHobbies() {
    this.hobbies.forEach((hobby) => {
      console.log(`${this.name} likes ${hobby}`);
    });
  }
};

user.printHobbies();
```

The arrow callback uses `this` from `printHobbies()`, where `this` is `user`.

## 5. `this` Inside Nested Functions

Regular nested functions have their own `this`.

```js
const user = {
  name: "Rahim",
  outer() {
    function inner() {
      return this.name;
    }

    return inner();
  }
};

user.outer(); // TypeError in strict mode, or undefined
```

Why?

`outer()` is called as a method, so `this` inside `outer` is `user`.

But `inner()` is called as a plain function, so `this` inside `inner` is not `user`.

### Fix with an Arrow Function

```js
const user = {
  name: "Rahim",
  outer() {
    const inner = () => {
      return this.name;
    };

    return inner();
  }
};

user.outer(); // "Rahim"
```

The arrow function captures `this` from `outer()`.

### Fix with `self`

Older JavaScript code often used `self` or `that`.

```js
const user = {
  name: "Rahim",
  outer() {
    const self = this;

    function inner() {
      return self.name;
    }

    return inner();
  }
};

user.outer(); // "Rahim"
```

## Backend Example

`this` bugs often appear when class methods are passed as route handlers.

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

app.get("/users", controller.getUsers); // loses this
```

Fix:

```js
app.get("/users", controller.getUsers.bind(controller));
```

Or use an arrow wrapper:

```js
app.get("/users", (req, res) => controller.getUsers(req, res));
```

## Interview Answer

`this` is usually determined by how a function is called. In `user.greet()`, `this` is `user` because `user` is before the dot. If the method is assigned to another variable, it can lose `this`. Arrow functions do not have their own `this`; they capture it from the surrounding scope. This makes arrows bad as object methods but useful inside methods and callbacks when you want to preserve the outer `this`.

