# Inheritance, `super`, and Method Overriding

Inheritance allows one class to reuse and extend the properties and methods of another class.

In JavaScript:

- `extends` creates a child class from a parent class.
- `super()` calls the parent constructor.
- Method overriding replaces an inherited method in the child class.
- `super.methodName()` calls a method from the parent class.

## Parent and Child Classes

The class being inherited from is called the **parent class**, **base class**, or **superclass**.

The class that inherits is called the **child class**, **derived class**, or **subclass**.

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
    console.log(`${this.name} deleted user ${userId}`);
  }
}

const admin = new Admin("Ayesha");

admin.login();       // inherited from User
admin.deleteUser(5); // defined in Admin
```

`Admin` inherits the constructor and `login()` method from `User`, while also adding its own `deleteUser()` method.

## What `extends` Does

The `extends` keyword connects the child class to the parent class.

```js
class Admin extends User {}
```

This creates two prototype relationships:

```js
console.log(Object.getPrototypeOf(Admin.prototype) === User.prototype); // true
console.log(Object.getPrototypeOf(Admin) === User); // true
```

The first relationship allows Admin instances to inherit instance methods. The second allows `Admin` to inherit static methods from `User`.

## Inherited Constructor

If a child class does not define a constructor, JavaScript provides one that forwards all arguments to the parent constructor.

```js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class Admin extends User {}

const admin = new Admin("Ayesha", "ayesha@example.com");

console.log(admin.name);  // "Ayesha"
console.log(admin.email); // "ayesha@example.com"
```

The generated constructor behaves approximately like this:

```js
constructor(...args) {
  super(...args);
}
```

## Calling the Parent Constructor with `super()`

When a child class defines its own constructor, it must call `super()` before using `this`.

```js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class Admin extends User {
  constructor(name, email, permissions) {
    super(name, email);
    this.permissions = permissions;
  }
}

const admin = new Admin(
  "Ayesha",
  "ayesha@example.com",
  ["read", "write", "delete"]
);

console.log(admin.name);        // "Ayesha"
console.log(admin.permissions); // ["read", "write", "delete"]
```

Here, `super(name, email)` runs the `User` constructor and initializes the inherited properties. The child constructor then initializes `permissions`.

## Why Must `super()` Run Before `this`?

In a derived constructor, the parent constructor is responsible for creating and initializing `this`.

```js
class Admin extends User {
  constructor(name) {
    this.role = "admin"; // ReferenceError
    super(name);
  }
}
```

Correct order:

```js
class Admin extends User {
  constructor(name) {
    super(name);
    this.role = "admin";
  }
}
```

This rule applies only to a child class constructor. A class that does not extend another class does not call `super()`.

## Method Overriding

Method overriding happens when a child class defines a method with the same name as an inherited parent method.

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

const user = new User();
const admin = new Admin();

console.log(user.getRole());  // "user"
console.log(admin.getRole()); // "admin"
```

When `admin.getRole()` runs, JavaScript finds `getRole()` on `Admin.prototype` first. It does not continue to `User.prototype` because the method has already been found.

The child method therefore shadows or overrides the inherited method.

## Calling the Parent Method with `super.methodName()`

An overridden method can reuse the parent implementation with `super.methodName()`.

```js
class User {
  getProfile() {
    return `Name: ${this.name}`;
  }
}

class Admin extends User {
  getProfile() {
    const basicProfile = super.getProfile();
    return `${basicProfile}, Role: admin`;
  }
}

const admin = new Admin();
admin.name = "Ayesha";

console.log(admin.getProfile());
// "Name: Ayesha, Role: admin"
```

`super.getProfile()` calls the parent version from `User.prototype`. The child then adds its own behavior.

## `super()` vs `super.methodName()`

| Syntax | Where it is used | Purpose |
| --- | --- | --- |
| `super(arguments)` | Child constructor | Calls the parent constructor |
| `super.methodName(arguments)` | Child instance method | Calls a parent instance method |
| `super.staticMethod(arguments)` | Child static method | Calls a parent static method |

```js
class User {
  constructor(name) {
    this.name = name;
  }

  describe() {
    return `User: ${this.name}`;
  }
}

class Admin extends User {
  constructor(name, level) {
    super(name); // parent constructor
    this.level = level;
  }

  describe() {
    return `${super.describe()}, Level: ${this.level}`; // parent method
  }
}
```

## `this` Inside a Parent Method

Even when a method is called through `super`, `this` still refers to the current child instance.

```js
class User {
  introduce() {
    return `My name is ${this.name}`;
  }
}

class Admin extends User {
  introduce() {
    return `${super.introduce()} and I am an admin`;
  }
}

const admin = new Admin();
admin.name = "Ayesha";

console.log(admin.introduce());
// "My name is Ayesha and I am an admin"
```

The parent method is selected through `super`, but it runs with the child object as `this`.

## Overriding While Preserving Parent Behavior

A practical pattern is to perform additional work before or after the parent behavior.

```js
class UserService {
  save(user) {
    console.log(`Saving ${user.name}`);
  }
}

class AuditedUserService extends UserService {
  save(user) {
    console.log(`Audit: save started for ${user.name}`);
    super.save(user);
    console.log(`Audit: save completed for ${user.name}`);
  }
}

const service = new AuditedUserService();
service.save({ name: "Rahim" });
```

Output:

```txt
Audit: save started for Rahim
Saving Rahim
Audit: save completed for Rahim
```

## Inheriting and Overriding Static Methods

Static methods are inherited by the child class itself.

```js
class User {
  static getType() {
    return "user";
  }
}

class Admin extends User {
  static getType() {
    return `${super.getType()}:admin`;
  }
}

console.log(User.getType());  // "user"
console.log(Admin.getType()); // "user:admin"
```

Inside a child static method, `super.getType()` calls the parent's static method.

## `instanceof` with Inheritance

A child instance is also an instance of its parent because the parent prototype exists in its prototype chain.

```js
class User {}
class Admin extends User {}

const admin = new Admin();

console.log(admin instanceof Admin);  // true
console.log(admin instanceof User);   // true
console.log(admin instanceof Object); // true
```

Its simplified prototype chain is:

```txt
admin -> Admin.prototype -> User.prototype -> Object.prototype -> null
```

## Common Mistakes

### Using `this` Before `super()`

```js
class Admin extends User {
  constructor(name) {
    this.name = name; // ReferenceError
    super(name);
  }
}
```

Call `super()` first.

### Forgetting to Pass Required Parent Arguments

```js
class Admin extends User {
  constructor(name, email) {
    super(); // Parent receives undefined values
  }
}
```

Pass the data expected by the parent constructor:

```js
super(name, email);
```

### Replacing Parent Behavior Accidentally

```js
class Admin extends User {
  save() {
    console.log("Writing audit log");
    // Parent save behavior no longer runs
  }
}
```

If both behaviors are required, call the parent method:

```js
save() {
  console.log("Writing audit log");
  super.save();
}
```

### Calling `super()` Outside a Constructor

`super()` is specifically for calling the parent constructor. Use `super.methodName()` to call a parent method.

## When to Use Inheritance

Inheritance is useful when the child class is genuinely a specialized version of the parent:

```txt
Admin is a User
SavingsAccount is a BankAccount
```

Avoid inheritance when classes only need to share a small piece of functionality. Deep inheritance chains can become difficult to understand and modify. Composition is often clearer when the relationship is "has a" rather than "is a."

```txt
Order has a PaymentProcessor
UserService has a Logger
```

## Interview Answer

Inheritance allows a child class to reuse and extend a parent class using `extends`. If the child defines a constructor, it must call `super()` before accessing `this` because `super()` runs the parent constructor and initializes the child instance. Method overriding occurs when the child defines a method with the same name as a parent method. The child can still reuse the parent implementation with `super.methodName()`.
