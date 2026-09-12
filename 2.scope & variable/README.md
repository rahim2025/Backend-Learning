# JavaScript Scope and Variables

This folder contains backend interview notes about JavaScript scope, variable declarations, hoisting, TDZ, `const`, lexical scoping, closures, `this`, `call`/`apply`/`bind`, and Node.js event loop ordering.

Scope and variables are important for backend development because they affect how data is shared, hidden, updated, and captured inside functions, route handlers, callbacks, and modules.

## Topics

1. [Scope](01-scope/README.md)
2. [`var`, `let`, and `const`](02-var-let-const/README.md)
3. [Hoisting](03-hoisting/README.md)
4. [Temporal Dead Zone](04-tdz/README.md)
5. [`const` Does Not Mean Immutable](05-const-mutability/README.md)
6. [Lexical Scoping](06-lexical-scoping/README.md)
7. [Closures](07-closures/README.md)
8. [`this`](08-this/README.md)
9. [`call`, `apply`, and `bind`](09-call-apply-bind/README.md)
10. [Node.js Event Loop Order](10-event-loop-order/README.md)
11. [Interview Questions](11-interview-questions/interview-questions.md)
12. [Cheat Sheet](12-cheat-sheet/README.md)

## 1. Scope

Scope means where a variable is accessible.

```js
const globalName = "Rahim";

function greet() {
  const message = "Hello";
  console.log(globalName); // allowed
  console.log(message); // allowed
}

greet();
console.log(message); // ReferenceError
```

Inner scope can access outer scope.

Outer scope cannot access inner scope.

| Rule | Example |
| --- | --- |
| Inner can access outer | A function can read a global variable |
| Outer cannot access inner | Global code cannot read a variable declared inside a function |

## 2. `var`, `let`, and `const`

| Keyword | Scope | Reassign? | Redeclare in same scope? |
| --- | --- | --- | --- |
| `var` | Function/global scoped | Yes | Yes |
| `let` | Block scoped | Yes | No |
| `const` | Block scoped | No | No |

`var` ignores block scope:

```js
if (true) {
  var x = 1;
}

console.log(x); // 1
```

`let` and `const` stay inside blocks:

```js
if (true) {
  let y = 2;
}

console.log(y); // ReferenceError
```

This is the key distinction:

- `var` is function/global scoped.
- `let` and `const` are block scoped.

Backend preference:

- Use `const` by default.
- Use `let` when reassignment is needed.
- Avoid `var` in modern backend JavaScript.

## 3. Hoisting

Hoisting means JavaScript processes declarations before code execution.

| Declaration | Hoisted? | Initialized before declaration line? |
| --- | --- | --- |
| `var` | Yes | Yes, as `undefined` |
| `let` | Yes | No, TDZ |
| `const` | Yes | No, TDZ |
| Function declaration | Yes | Yes, full function is available |
| Function expression | Variable is hoisted | Function value is not hoisted |

`var` example:

```js
console.log(a); // undefined
var a = 10;
```

This behaves like:

```js
var a;
console.log(a); // undefined
a = 10;
```

`let` example:

```js
console.log(b); // ReferenceError
let b = 10;
```

Function declaration:

```js
sayHello(); // "Hello"

function sayHello() {
  return "Hello";
}
```

Function expression:

```js
sayHi(); // TypeError or ReferenceError depending on declaration style

var sayHi = function () {
  return "Hi";
};
```

With `var`, the variable exists as `undefined`, but the function value is assigned later.

## 4. TDZ

TDZ means Temporal Dead Zone.

The variable exists, but you cannot access it before the declaration line.

```js
{
  console.log(age); // ReferenceError
  let age = 20;
}
```

The TDZ starts at the beginning of the block and ends at the declaration line.

```js
{
  // TDZ starts here
  // age exists, but cannot be used

  let age = 20; // TDZ ends here
  console.log(age); // 20
}
```

`let` and `const` have TDZ. `var` does not behave the same way because it is initialized as `undefined`.

## 5. `const` Does Not Mean Immutable

`const` prevents reassignment of the variable binding.

It does not freeze the value.

```js
const user = { name: "Rahim" };

user.name = "Karim"; // allowed

user = {}; // TypeError
```

Why?

- `user` still points to the same object.
- Mutating `user.name` changes the object.
- Assigning `user = {}` tries to point the binding to a new object, which is not allowed.

**Interview sentence:**

> `const` prevents reassignment of the binding, not mutation of the object.

To make an object harder to mutate, use tools like `Object.freeze()`:

```js
const user = Object.freeze({ name: "Rahim" });

user.name = "Karim"; // ignored in non-strict mode, TypeError in strict mode
```

## 6. Lexical Scoping

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

Why?

`getValue()` was written in the global scope, so it remembers the global `value`.

It does not use the `value` inside `run()` just because `run()` called it.

This matters in backend JavaScript when callbacks and helper functions read variables from outer scopes.

## 7. Closures

A closure is a function together with the outer variables it remembers.

```txt
Closure = function + remembered outer variables
```

Closures come from lexical scoping.

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

`increment()` remembers `count` even after `createCounter()` has finished running.

Closures are useful because they:

- Preserve state.
- Create private variables.
- Allow callbacks to remember outer variables.
- Let each function call create a new remembered environment.

Each function call can create a new closure:

```js
const counterA = createCounter();
const counterB = createCounter();

counterA(); // 1
counterA(); // 2
counterB(); // 1
```

`counterA` and `counterB` have separate `count` variables.

Classic async loop trap:

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

`var` shares one function-scoped variable.

With `let`:

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

`let` creates a new variable for each loop iteration.

## 8. `this`

`this` is a special keyword whose value depends on how a function is called.

```txt
this is decided by the call site, not where the function is written.
```

Global `this` depends on the environment:

```js
console.log(this); // browser script: window
console.log(this); // Node CommonJS file: {}
```

Inside an object method, `this` points to the object before the dot:

```js
const user = {
  name: "Rahim",
  greet() {
    return `Hello, ${this.name}`;
  }
};

user.greet(); // "Hello, Rahim"
```

`this` can be lost when a method is separated from its object:

```js
const greetFn = user.greet;

greetFn(); // loses this
```

Arrow functions do not have their own `this`. They capture `this` from the surrounding scope.

```js
const user = {
  name: "Rahim",
  greet: () => this.name
};

user.greet(); // usually undefined
```

For object methods, prefer normal method syntax. For nested callbacks inside methods, arrow functions are often useful because they preserve the outer `this`.

## 9. `call`, `apply`, and `bind`

`call`, `apply`, and `bind` let us control `this` for normal functions.

```js
function showName() {
  console.log(this.name);
}

const user = {
  name: "Rahim"
};

showName.call(user); // "Rahim"
```

`call()` sets `this` and calls the function immediately:

```js
function introduce(city, country) {
  console.log(`${this.name} lives in ${city}, ${country}`);
}

introduce.call(user, "Dhaka", "Bangladesh");
```

`apply()` is like `call()`, but arguments are passed as an array:

```js
introduce.apply(user, ["Dhaka", "Bangladesh"]);
```

`bind()` returns a new function with fixed `this`:

```js
const boundIntroduce = introduce.bind(user);

boundIntroduce("Dhaka", "Bangladesh");
```

Main difference:

| Method | Behavior |
| --- | --- |
| `call()` | Calls immediately, args one by one |
| `apply()` | Calls immediately, args as array |
| `bind()` | Returns a new function, does not call immediately |

`bind(null)` is often used when the function does not need `this`, but we want to pre-fill arguments:

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);

double(5); // 10
```

## 10. Node.js Event Loop Order

Node.js uses the event loop to schedule asynchronous callbacks.

A useful backend interview order:

```txt
1. Synchronous code
2. process.nextTick()
3. Promise microtasks / async-await continuation
4. Timers: setTimeout, setInterval
5. I/O callbacks
6. Check phase: setImmediate()
```

Example:

```js
console.log("sync 1");

setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});

Promise.resolve().then(() => {
  console.log("promise");
});

process.nextTick(() => {
  console.log("nextTick");
});

console.log("sync 2");
```

Common output:

```txt
sync 1
sync 2
nextTick
promise
timeout
immediate
```

At top level, `setTimeout(0)` and `setImmediate()` order can vary. Inside I/O callbacks, `setImmediate()` usually runs before `setTimeout(0)`.

## Interview Summary

If an interviewer asks about scope and variables, a strong answer should mention:

- Scope controls where variables can be accessed.
- Inner scopes can access outer scopes, but outer scopes cannot access inner scopes.
- `var` is function/global scoped.
- `let` and `const` are block scoped.
- `var` is hoisted and initialized as `undefined`.
- `let` and `const` are hoisted but inaccessible during the TDZ.
- Function declarations are fully hoisted.
- Function expressions are not fully available until assignment.
- `const` prevents reassignment, not object mutation.
- Lexical scoping is based on where a function is written.
- Closures are functions that remember outer variables.
- Closures preserve state and can create private variables.
- `var` in async loops shares one variable, while `let` creates a new binding per iteration.
- `this` usually depends on how a function is called.
- Arrow functions do not have their own `this`.
- Object methods can lose `this` when passed as callbacks.
- `call` and `apply` call immediately with a chosen `this`.
- `bind` returns a new function with fixed `this`.
- `bind(null)` is commonly used for partial application when `this` is not needed.
- Synchronous code runs before asynchronous callbacks.
- In Node.js, `process.nextTick()` runs before Promise microtasks.
- Promise microtasks and `async/await` continuations run before timers.
- `setImmediate()` runs in the check phase.
