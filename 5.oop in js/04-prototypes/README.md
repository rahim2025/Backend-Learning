# Prototypes

A prototype is an object from which another JavaScript object can inherit properties and methods.

Every ordinary object has an internal `[[Prototype]]` link. When JavaScript cannot find a property directly on an object, it follows this link and searches the prototype.

## Prototype Lookup

```js
const userMethods = {
  login() {
    console.log(`${this.name} logged in`);
  },
};

const user = Object.create(userMethods);
user.name = "Rahim";

user.login(); // Found on userMethods
```

JavaScript looks for `login` in this order:

1. Check `user`.
2. Check `userMethods`, which is `user`'s prototype.
3. Continue up the prototype chain if necessary.
4. Return `undefined` if the property is never found.

## The Prototype Chain

```txt
user -> userMethods -> Object.prototype -> null
```

This sequence of linked objects is called the **prototype chain**.

```js
console.log(user.toString); // inherited from Object.prototype
```

## `prototype` vs `[[Prototype]]`

These two ideas are related but different:

| Term | Meaning |
| --- | --- |
| `Constructor.prototype` | An object used as the prototype of instances created with that constructor |
| Object's `[[Prototype]]` | The internal link from an object to its prototype |
| `Object.getPrototypeOf(obj)` | Recommended way to read an object's prototype |
| `__proto__` | Legacy accessor for `[[Prototype]]`; avoid it in new code |

```js
function User(name) {
  this.name = name;
}

const user = new User("Rahim");

console.log(Object.getPrototypeOf(user) === User.prototype); // true
```

The `prototype` property belongs to the constructor function. The created object's internal prototype points to that object.

## Shared Prototype Methods

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

`login` is not an own property of either user:

```js
console.log(Object.hasOwn(user1, "name")); // true
console.log(Object.hasOwn(user1, "login")); // false
```

It is found through `User.prototype`.

## Property Shadowing

An object's own property takes priority over a property with the same name on its prototype.

```js
const defaults = { role: "user" };
const account = Object.create(defaults);

console.log(account.role); // "user"

account.role = "admin";
console.log(account.role); // "admin"
console.log(defaults.role); // "user"
```

The new own property `account.role` shadows `defaults.role`; it does not modify the prototype.

## Changing a Prototype Method

Because instances use the shared prototype, changing a prototype method affects existing instances:

```js
function User(name) {
  this.name = name;
}

const user = new User("Rahim");

User.prototype.login = function () {
  console.log(`Welcome, ${this.name}`);
};

user.login(); // "Welcome, Rahim"
```

## Common Mistake: Arrow Functions and `this`

Do not use an arrow function for a prototype method when the method needs dynamic `this`:

```js
User.prototype.login = () => {
  console.log(this.name); // Does not use the calling user as this
};
```

Use a regular function:

```js
User.prototype.login = function () {
  console.log(this.name);
};
```

Arrow functions capture `this` from their surrounding scope; regular methods receive `this` from how they are called.

## Interview Answer

A prototype is an object that other objects can inherit properties and methods from. If a property is not found directly on an object, JavaScript searches its prototype chain. Objects created with `new Constructor()` have their internal prototype linked to `Constructor.prototype`, which allows all instances to share methods efficiently.
