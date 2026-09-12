# Classes in JavaScript

A class is a blueprint for creating objects with similar properties and methods.

JavaScript classes provide cleaner syntax over constructor functions and prototypes. They do not replace prototypes; class methods are still shared through the prototype system.

## Basic Class Syntax

```js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  login() {
    console.log(`${this.name} logged in`);
  }
}

const user1 = new User("Rahim", "rahim@example.com");
const user2 = new User("Karim", "karim@example.com");

user1.login(); // "Rahim logged in"
user2.login(); // "Karim logged in"
```

By convention, class names use PascalCase, and instances are created with `new`.

## The `constructor` Method

The `constructor` method runs automatically when `new` creates an instance.

```js
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

const product = new Product("Keyboard", 2500);

console.log(product.name); // "Keyboard"
console.log(product.price); // 2500
```

A class can have only one `constructor` method. If no constructor is written, JavaScript provides an empty one automatically.

## Class Methods Use the Prototype

Methods written inside a class are placed on the class's prototype and shared by all instances.

```js
class User {
  login() {
    console.log("Logged in");
  }
}

const user1 = new User();
const user2 = new User();

console.log(user1.login === user2.login); // true
console.log(Object.getPrototypeOf(user1) === User.prototype); // true
```

This class behaves similarly to:

```js
function User() {}

User.prototype.login = function () {
  console.log("Logged in");
};
```

## Instance Properties and Methods

Instance properties belong to individual objects:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  introduce() {
    console.log(`I am ${this.name}`);
  }
}
```

Each instance has its own `name`, but all instances share the `introduce` method.

```js
const user1 = new User("Rahim");
const user2 = new User("Karim");

console.log(Object.hasOwn(user1, "name")); // true
console.log(Object.hasOwn(user1, "introduce")); // false
```

## Static Methods

A static method belongs to the class itself, not to its instances.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  static isValidName(name) {
    return typeof name === "string" && name.trim().length > 0;
  }
}

console.log(User.isValidName("Rahim")); // true

const user = new User("Rahim");
// user.isValidName("Karim"); // TypeError
```

Static methods are useful for validation, helper operations, or creating instances in special ways.

## Inheritance with `extends`

One class can inherit from another class using `extends`.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  login() {
    console.log(`${this.name} logged in`);
  }
}

class Admin extends User {
  deleteUser(userId) {
    console.log(`Deleted user ${userId}`);
  }
}

const admin = new Admin("Ayesha");

admin.login();       // inherited from User
admin.deleteUser(5); // defined by Admin
```

## `super()`

In a child class constructor, `super()` calls the parent constructor.

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

class Admin extends User {
  constructor(name, permissions) {
    super(name);
    this.permissions = permissions;
  }
}
```

In a derived class, `super()` must run before accessing `this`.

```js
class Admin extends User {
  constructor(name) {
    // this.role = "admin"; // ReferenceError
    super(name);
    this.role = "admin";
  }
}
```

## Method Overriding

A child class can replace an inherited method with its own implementation.

```js
class User {
  getRole() {
    return "user";
  }
}

class Admin extends User {
  getRole() {
    return "admin";
  }
}

console.log(new User().getRole());  // "user"
console.log(new Admin().getRole()); // "admin"
```

The child method can call the parent version with `super.methodName()`.

## Important Class Rules

- Classes must be called with `new`.
- Class declarations are not usable before their declaration.
- Code inside classes runs in strict mode.
- Class methods are shared through the prototype.
- Methods are not separated with commas.

```js
// const user = new User(); // ReferenceError

class User {}
```

## Interview Answer

A JavaScript class is cleaner syntax for creating objects and sharing methods through prototypes. The `constructor` initializes instance properties, instance methods are stored on the class prototype, and static methods belong to the class itself. Classes support inheritance with `extends` and parent constructor calls with `super()`.
