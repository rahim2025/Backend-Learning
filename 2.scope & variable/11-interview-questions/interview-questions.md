# JavaScript Scope and Variables Interview Questions

## Q: What is scope in JavaScript?

Scope means where a variable is accessible. Inner scopes can access variables from outer scopes, but outer scopes cannot access variables declared inside inner scopes.

## Q: What is the difference between `var`, `let`, and `const`?

`var` is function or global scoped. `let` and `const` are block scoped. `let` allows reassignment, while `const` does not allow reassignment of the binding.

## Q: Why does `var` work outside an `if` block?

Because `var` is not block scoped. It belongs to the nearest function scope or global scope.

```js
if (true) {
  var x = 1;
}

console.log(x); // 1
```

## Q: Why does `let` throw a `ReferenceError` outside an `if` block?

Because `let` is block scoped. It only exists inside the block where it is declared.

```js
if (true) {
  let y = 2;
}

console.log(y); // ReferenceError
```

## Q: What is hoisting?

Hoisting means JavaScript processes declarations before code execution. `var` is hoisted and initialized as `undefined`; `let` and `const` are hoisted but unavailable during the TDZ; function declarations are fully hoisted.

## Q: Why does `console.log(a)` print `undefined` before `var a = 10`?

Because `var a` is hoisted and initialized as `undefined`. The assignment `a = 10` happens later during execution.

```js
console.log(a); // undefined
var a = 10;
```

## Q: Why does `console.log(b)` throw before `let b = 10`?

Because `let` is hoisted but stays in the Temporal Dead Zone until the declaration line is executed.

```js
console.log(b); // ReferenceError
let b = 10;
```

## Q: What is TDZ?

TDZ means Temporal Dead Zone. It is the period from the start of a block until a `let` or `const` declaration is reached. During TDZ, the variable exists but cannot be accessed.

## Q: Does `const` make an object immutable?

No. `const` prevents reassignment of the binding, not mutation of the object.

```js
const user = { name: "Rahim" };
user.name = "Karim"; // allowed
user = {}; // TypeError
```

## Q: What is lexical scoping?

Lexical scoping means a function uses the scope where it was written, not where it was called.

```js
let value = "global";

function getValue() {
  return value;
}

function run() {
  let value = "local";
  return getValue();
}

run(); // "global"
```

## Q: What is a closure?

A closure is a function that remembers variables from its outer lexical scope even after the outer function has finished executing.

```js
function outer() {
  const message = "Hello";

  return function inner() {
    return message;
  };
}

const fn = outer();

fn(); // "Hello"
```

`inner()` still remembers `message`, so `inner()` has a closure.

## Q: How do closures preserve state?

Closures preserve state because the inner function keeps access to variables from the outer function.

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
```

`count` stays alive between calls.

## Q: How can closures create private variables?

Closures can keep variables inside a function and expose only selected methods.

```js
function createSession() {
  let token = "abc123";

  return {
    getToken() {
      return token;
    }
  };
}

const session = createSession();

session.getToken(); // "abc123"
session.token; // undefined
```

`token` is private because outside code cannot access it directly.

## Q: Why do closures come from lexical scoping?

Because JavaScript functions use the scope where they are written. If an inner function is written inside an outer function, it can remember that outer function's variables.

## Q: Does each function call create a new closure?

Each function call can create a new closure if it returns or passes a function that remembers local variables from that call.

```js
const counterA = createCounter();
const counterB = createCounter();

counterA(); // 1
counterB(); // 1
```

`counterA` and `counterB` have separate remembered `count` variables.

## Q: Why does `var` in async loops often print the same value?

Because `var` is function scoped, all callbacks close over the same loop variable.

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}

// 4
// 4
// 4
```

By the time the callbacks run, the loop has finished and `i` is `4`.

## Q: Why does `let` fix async loop closures?

Because `let` creates a new binding for each loop iteration.

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}

// 1
// 2
// 3
```

Each callback remembers a different `i`.

## Q: What is `this` in JavaScript?

`this` is a special keyword whose value usually depends on how a function is called. It is decided by the call site.

## Q: What is global `this`?

Global `this` depends on the JavaScript environment. In a browser script, global `this` is usually `window`. In Node.js CommonJS files, top-level `this` is usually `{}`. In backend code, it is better to avoid depending on global `this`.

## Q: What is `this` inside an object method?

When a function is called as an object method, `this` points to the object before the dot.

```js
const user = {
  name: "Rahim",
  greet() {
    return this.name;
  }
};

user.greet(); // "Rahim"
```

Here, `this` is `user`.

## Q: How do we lose `this`?

We lose `this` when a method is separated from its object or passed as a callback.

```js
const greet = user.greet;

greet(); // loses this
```

The call no longer has `user` before the dot, so `this` is not `user`.

## Q: How can we fix lost `this`?

Use `bind`, an arrow wrapper, or call the method directly from the object.

```js
const boundGreet = user.greet.bind(user);

boundGreet(); // "Rahim"
```

```js
app.get("/users", (req, res) => controller.getUsers(req, res));
```

## Q: How do arrow functions handle `this`?

Arrow functions do not have their own `this`. They capture `this` from the surrounding scope.

This means arrow functions are usually not good object methods:

```js
const user = {
  name: "Rahim",
  greet: () => this.name
};

user.greet(); // usually undefined
```

But arrows are useful inside methods:

```js
const user = {
  name: "Rahim",
  hobbies: ["coding"],
  printHobbies() {
    this.hobbies.forEach((hobby) => {
      console.log(`${this.name} likes ${hobby}`);
    });
  }
};
```

The arrow callback keeps the method's `this`.

## Q: What happens to `this` inside nested regular functions?

Regular nested functions have their own `this`. They do not automatically inherit `this` from the outer method.

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

Use an arrow function when the nested function should keep the outer method's `this`.

## Q: Why do we need `call`, `apply`, and `bind`?

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

`call(user)` means run the function and make `this` equal to `user`.

## Q: What does `call()` do?

`call()` sets `this` and calls the function immediately. Arguments are passed one by one.

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

## Q: What does `apply()` do?

`apply()` sets `this` and calls the function immediately. Arguments are passed as an array.

```js
introduce.apply(user, ["Dhaka", "Bangladesh"]);
```

Output:

```txt
Rahim lives in Dhaka, Bangladesh
```

## Q: What does `bind()` do?

`bind()` does not call the function immediately. It returns a new function with fixed `this`.

```js
const boundIntroduce = introduce.bind(user);

boundIntroduce("Dhaka", "Bangladesh");
```

Output:

```txt
Rahim lives in Dhaka, Bangladesh
```

## Q: What is the difference between `call`, `apply`, and `bind`?

`call` calls immediately and takes arguments one by one. `apply` calls immediately and takes arguments as an array. `bind` returns a new function and does not call immediately.

## Q: What does `bind(null)` mean?

`bind(null)` usually means the function does not need `this`, and we only want to pre-fill arguments.

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);

double(5); // 10
```

Here, `null` is a placeholder for `this`, and `2` is fixed as the first argument.

If the function uses `this`, then in strict mode `this` will be `null`.

```js
"use strict";

function showThis() {
  return this;
}

const bound = showThis.bind(null);

bound(); // null
```

## Q: Do `call`, `apply`, and `bind` change `this` for arrow functions?

No. Arrow functions do not have their own `this`, so `call`, `apply`, and `bind` cannot change their `this`.

## Q: What is the basic execution order in Node.js?

A useful interview order is:

```txt
1. Synchronous code
2. process.nextTick()
3. Promise microtasks / async-await continuation
4. Timers: setTimeout, setInterval
5. I/O callbacks
6. Check phase: setImmediate()
```

## Q: Does synchronous code run before async callbacks?

Yes. Synchronous code runs first because it is on the call stack.

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

Output:

```txt
A
C
B
```

## Q: What is `process.nextTick()`?

`process.nextTick()` is Node.js-specific. It runs after the current synchronous code finishes, before Promise microtasks.

```js
console.log("start");

process.nextTick(() => {
  console.log("nextTick");
});

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");
```

Output:

```txt
start
end
nextTick
promise
```

## Q: Where do Promise callbacks and `async/await` continuations run?

Promise callbacks and code after `await` run as microtasks.

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

## Q: Are `setTimeout` and `setInterval` microtasks?

No. They are timer callbacks. They run in the timers phase after synchronous code and microtasks finish.

## Q: What are I/O callbacks?

I/O callbacks come from operations like file reads, network events, streams, database calls, and other async system operations.

```js
const fs = require("fs");

fs.readFile("file.txt", () => {
  console.log("I/O callback");
});

console.log("sync");
```

The synchronous log runs first. The I/O callback runs later when the operation finishes.

## Q: What is `setImmediate()`?

`setImmediate()` schedules a callback for the check phase of the Node.js event loop.

```js
setImmediate(() => {
  console.log("immediate");
});

console.log("sync");
```

Output:

```txt
sync
immediate
```

## Q: Which runs first: `setTimeout(0)` or `setImmediate()`?

At the top level, the order can vary. Inside an I/O callback, `setImmediate()` usually runs before `setTimeout(0)`.

## Q: Give an interview answer for Node.js event loop order.

In Node.js, synchronous code runs first. Then Node processes `process.nextTick()` callbacks, then Promise microtasks and `async/await` continuations. After that, event loop phases handle timers, I/O callbacks, and the check phase where `setImmediate()` runs.
