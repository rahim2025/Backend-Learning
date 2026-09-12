# Factory Functions

A factory function is a regular function that creates and returns an object.

```js
function createUser(name, email) {
  return {
    name,
    email,
    login() {
      console.log(`${this.name} logged in`);
    },
  };
}

const user1 = createUser("Rahim", "rahim@example.com");
const user2 = createUser("Karim", "karim@example.com");

user1.login();
user2.login();
```

## Why Is It Called a Factory?

Like a factory produces similar products, a factory function produces similar objects.

```js
const user1 = createUser("Rahim", "rahim@example.com");
const user2 = createUser("Karim", "karim@example.com");
```

Each call creates a new object with its own property values.

```js
console.log(user1 === user2); // false
```

## Factory Function Characteristics

- It is called like a normal function.
- It does not require `new`.
- It usually returns an object explicitly.
- Its name commonly starts with `create`, such as `createUser`.
- It can use closures to create private data.

## Private Data with a Closure

```js
function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
counter.increment();

console.log(counter.getCount()); // 1
console.log(counter.count); // undefined
```

`count` remains available to the methods through a closure, but outside code cannot access it directly.

## Method Duplication

When a method is written inside the returned object, every call creates a new function:

```js
function createUser(name) {
  return {
    name,
    login() {
      console.log(`${this.name} logged in`);
    },
  };
}

const user1 = createUser("Rahim");
const user2 = createUser("Karim");

console.log(user1.login === user2.login); // false
```

For a small number of objects, this is often acceptable. For many objects, methods can be shared through a separate object or a prototype.

## Sharing Methods

```js
const userMethods = {
  login() {
    console.log(`${this.name} logged in`);
  },
};

function createUser(name) {
  const user = Object.create(userMethods);
  user.name = name;
  return user;
}

const user1 = createUser("Rahim");
const user2 = createUser("Karim");

console.log(user1.login === user2.login); // true
```

Both objects now find `login()` through the same prototype object.

## Common Mistake

A factory function must return the created object:

```js
function createUser(name) {
  const user = { name };
  // Missing: return user;
}

const user = createUser("Rahim");
console.log(user); // undefined
```

## Interview Answer

A factory function is a regular function that creates and returns an object. It does not require the `new` keyword and can use closures for private data. One disadvantage is that methods defined inside the returned object are recreated for every new object unless they are deliberately shared.
