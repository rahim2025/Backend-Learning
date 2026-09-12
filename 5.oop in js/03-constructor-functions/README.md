# Constructor Functions

A constructor function is a function used with the `new` keyword to create objects.

By convention, its name begins with a capital letter.

```js
function User(name, email) {
  this.name = name;
  this.email = email;
}

const user1 = new User("Rahim", "rahim@example.com");
const user2 = new User("Karim", "karim@example.com");

console.log(user1.name); // "Rahim"
console.log(user2.name); // "Karim"
```

## What Does `new` Do?

When JavaScript evaluates this:

```js
const user = new User("Rahim", "rahim@example.com");
```

The `new` keyword performs four important steps:

1. Creates a new empty object.
2. Links that object to `User.prototype`.
3. Calls `User` with `this` referring to the new object.
4. Returns the new object automatically, unless the function explicitly returns another object.

The process is similar to:

```js
const user = Object.create(User.prototype);
User.call(user, "Rahim", "rahim@example.com");
```

## Add Shared Methods to the Prototype

Methods should usually be placed on the constructor's prototype:

```js
function User(name) {
  this.name = name;
}

User.prototype.login = function () {
  console.log(`${this.name} logged in`);
};

const user1 = new User("Rahim");
const user2 = new User("Karim");

console.log(user1.login === user2.login); // true
```

The two users share one `login` function instead of storing separate copies.

## `instanceof`

`instanceof` checks whether a constructor's prototype exists in an object's prototype chain.

```js
const user = new User("Rahim");

console.log(user instanceof User); // true
console.log(user instanceof Object); // true
```

## Common Mistake: Forgetting `new`

```js
function User(name) {
  this.name = name;
}

const user = User("Rahim");
console.log(user); // undefined
```

Without `new`, no new object is created. In strict mode, assigning to `this.name` also throws a `TypeError` because `this` is `undefined`.

## Constructor Return Behavior

Normally, a constructor does not need an explicit `return`:

```js
function User(name) {
  this.name = name;
}
```

Returning a primitive is ignored, but returning another object replaces the automatically created object:

```js
function User() {
  this.name = "Rahim";
  return { name: "Karim" };
}

console.log(new User().name); // "Karim"
```

Avoid explicit returns in normal constructor functions because they make behavior harder to understand.

## Interview Answer

A constructor function is a function called with `new` to create objects. The `new` keyword creates an object, links it to the constructor's prototype, binds `this` to it, and returns it. Instance data is assigned with `this`, while shared methods are usually placed on the constructor's prototype.
