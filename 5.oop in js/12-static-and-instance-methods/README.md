# Static Methods and Instance Methods

JavaScript classes can contain **instance methods** and **static methods**.

- An instance method is called on an object created from the class.
- A static method is called directly on the class itself.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  introduce() {
    return `My name is ${this.name}`;
  }

  static isValidName(name) {
    return typeof name === "string" && name.trim().length > 0;
  }
}

const user = new User("Rahim");

console.log(user.introduce());        // instance method
console.log(User.isValidName("Rahim")); // static method
```

## Main Difference

| Instance method | Static method |
| --- | --- |
| Called on an instance | Called on the class |
| `user.introduce()` | `User.isValidName()` |
| Usually works with instance data | Usually performs class-level operations |
| `this` refers to the calling instance | `this` refers to the calling class |
| Stored on `ClassName.prototype` | Stored on the class constructor |
| Inherited by child instances | Inherited by child classes |

## Instance Methods

An instance method represents behavior performed by an individual object.

```js
class BankAccount {
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Deposit must be greater than zero");
    }

    this.balance += amount;
    return this.balance;
  }
}

const rahimAccount = new BankAccount("Rahim", 1000);
const karimAccount = new BankAccount("Karim", 500);

rahimAccount.deposit(200);
karimAccount.deposit(100);

console.log(rahimAccount.balance); // 1200
console.log(karimAccount.balance); // 600
```

The same `deposit()` method works with different instance data depending on which account calls it.

## Where Instance Methods Are Stored

A normal class method is stored on the class's prototype, not copied directly onto every instance.

```js
class User {
  login() {
    console.log("Logged in");
  }
}

const user1 = new User();
const user2 = new User();

console.log(Object.hasOwn(user1, "login")); // false
console.log(user1.login === User.prototype.login); // true
console.log(user1.login === user2.login); // true
```

Although it is called an instance method, instances find it through their prototype chain.

```txt
user1 -> User.prototype -> Object.prototype -> null
```

This allows every instance to share one function.

## `this` in an Instance Method

Inside an instance method, `this` normally refers to the object before the dot at the call site.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

const firstUser = new User("Rahim");
const secondUser = new User("Karim");

console.log(firstUser.getName());  // "Rahim"
console.log(secondUser.getName()); // "Karim"
```

The method is shared, but `this` changes according to the calling instance.

## Calling an Instance Method

An instance method must normally be called through an instance:

```js
const user = new User("Rahim");
user.getName();
```

Calling it directly on the class does not work:

```js
// User.getName();
// TypeError: User.getName is not a function
```

`getName` exists on `User.prototype`, not on `User` itself.

## Static Methods

A static method belongs to the class constructor rather than to individual instances.

Use the `static` keyword before the method name:

```js
class User {
  static isValidEmail(email) {
    return typeof email === "string" && email.includes("@");
  }
}

console.log(User.isValidEmail("rahim@example.com")); // true
console.log(User.isValidEmail("invalid-email"));     // false
```

No `User` instance is required because the validation does not depend on one particular user's state.

## Where Static Methods Are Stored

A static method is an own property of the class constructor.

```js
class User {
  static createGuest() {
    return new User("Guest");
  }
}

console.log(Object.hasOwn(User, "createGuest")); // true
console.log(Object.hasOwn(User.prototype, "createGuest")); // false
```

An instance cannot call it:

```js
const user = new User();

// user.createGuest();
// TypeError: user.createGuest is not a function
```

## `this` in a Static Method

Inside a static method, `this` refers to the class used to call the method.

```js
class User {
  static describe() {
    return `Class name: ${this.name}`;
  }
}

console.log(User.describe()); // "Class name: User"
```

Static methods do not receive an instance as `this`, so they cannot directly access instance properties.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  static getName() {
    return this.name;
  }
}

const user = new User("Rahim");

console.log(User.getName()); // "User", not "Rahim"
```

Here, `this` is the `User` class, whose function name is `User`.

## When to Use an Instance Method

Use an instance method when the behavior:

- Reads or changes one object's state
- Represents an action performed by an instance
- Uses instance properties or private instance fields
- May behave differently based on the instance's data

```js
class Order {
  constructor(items) {
    this.items = items;
    this.status = "pending";
  }

  calculateTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  markAsPaid() {
    this.status = "paid";
  }
}
```

Both methods operate on one particular order.

## When to Use a Static Method

Use a static method when the operation:

- Does not depend on one instance's state
- Validates data before an instance is created
- Creates instances through a named factory method
- Converts external data into an instance
- Provides a utility closely related to the class

## Static Validation Method

```js
class User {
  constructor(name, email) {
    if (!User.isValidEmail(email)) {
      throw new TypeError("Invalid email address");
    }

    this.name = name;
    this.email = email;
  }

  static isValidEmail(email) {
    return typeof email === "string" && email.includes("@");
  }
}
```

The validation concerns user data in general, not an existing user object.

## Static Factory Method

A static factory method creates and returns an instance.

```js
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  static createGuest(name = "Guest") {
    return new User(name, "guest");
  }

  static fromJSON(json) {
    const data = JSON.parse(json);
    return new User(data.name, data.role);
  }
}

const guest = User.createGuest("Rahim");
const admin = User.fromJSON(
  '{"name":"Ayesha","role":"admin"}'
);
```

Named factory methods can explain how an object is being created more clearly than several optional constructor arguments.

## Static Methods Can Create Subclass Instances

Using `this` in a static factory method allows an inherited method to create an instance of the calling subclass.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  static createGuest() {
    return new this("Guest");
  }
}

class Admin extends User {}

const user = User.createGuest();
const admin = Admin.createGuest();

console.log(user instanceof User);   // true
console.log(admin instanceof Admin); // true
```

When called as `Admin.createGuest()`, `this` inside the static method refers to `Admin`.

## Inheritance of Instance Methods

Child instances inherit parent instance methods through the prototype chain.

```js
class User {
  login() {
    return "User logged in";
  }
}

class Admin extends User {
  deleteUser() {
    return "User deleted";
  }
}

const admin = new Admin();

console.log(admin.login());
console.log(admin.deleteUser());
```

The child can override an instance method and call the parent version with `super.methodName()`.

```js
class Admin extends User {
  login() {
    return `${super.login()} with admin permissions`;
  }
}
```

## Inheritance of Static Methods

Child classes inherit static methods from their parent class.

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

## Static Private Methods

A static method can also be private.

```js
class Token {
  static create(payload) {
    const normalizedPayload = this.#normalize(payload);
    return JSON.stringify(normalizedPayload);
  }

  static #normalize(payload) {
    return {
      ...payload,
      createdAt: Date.now(),
    };
  }
}

const token = Token.create({ userId: 1 });

// Token.#normalize({}); // SyntaxError
```

The public static method exposes the meaningful class-level operation while the private static method hides its helper logic.

## Calling Static and Instance Methods Together

An instance method can call a static method through the class name:

```js
class Product {
  constructor(name, price) {
    if (!Product.isValidPrice(price)) {
      throw new TypeError("Invalid price");
    }

    this.name = name;
    this.price = price;
  }

  applyDiscount(percent) {
    if (!Product.isValidDiscount(percent)) {
      throw new TypeError("Invalid discount");
    }

    this.price -= this.price * (percent / 100);
  }

  static isValidPrice(price) {
    return Number.isFinite(price) && price >= 0;
  }

  static isValidDiscount(percent) {
    return Number.isFinite(percent) && percent >= 0 && percent <= 100;
  }
}
```

A static method can work with an instance only when that instance is passed explicitly or created inside the method.

```js
class Product {
  static isFree(product) {
    return product.price === 0;
  }
}

const product = { name: "Sample", price: 0 };
console.log(Product.isFree(product)); // true
```

## Extracting an Instance Method

Separating an instance method from its object can lose its `this` value.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  introduce() {
    return `I am ${this.name}`;
  }
}

const user = new User("Rahim");
const introduce = user.introduce;

// introduce(); // TypeError because this is undefined
```

Bind the instance when passing the method as a callback:

```js
const boundIntroduce = user.introduce.bind(user);
console.log(boundIntroduce()); // "I am Rahim"
```

## Arrow Function Class Fields

An arrow function class field is stored separately on each instance rather than on the prototype.

```js
class User {
  introduce = () => {
    return `I am ${this.name}`;
  };

  constructor(name) {
    this.name = name;
  }
}

const user1 = new User("Rahim");
const user2 = new User("Karim");

console.log(Object.hasOwn(user1, "introduce")); // true
console.log(user1.introduce === user2.introduce); // false
```

The arrow function preserves the instance's `this`, which can be useful for callbacks, but every instance receives a separate function. Prefer normal prototype methods unless automatic `this` binding is genuinely needed.

## Common Mistakes

### Calling a Static Method on an Instance

```js
const user = new User("Rahim");
// user.isValidName("Karim"); // TypeError
```

Call it on the class:

```js
User.isValidName("Karim");
```

### Calling an Instance Method on the Class

```js
// User.introduce(); // TypeError
```

Create an instance first:

```js
const user = new User("Rahim");
user.introduce();
```

### Accessing Instance Data from a Static Method

```js
class User {
  constructor(name) {
    this.name = name;
  }

  static introduce() {
    return this.name; // Refers to the class name, not an instance name
  }
}
```

If the behavior depends on a particular user's data, it should usually be an instance method.

### Making Every Helper Static

A static method is appropriate when the operation belongs conceptually to the class. A general helper that is unrelated to one class may be clearer as a regular function in a utility module.

```js
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}
```

### Storing Shared State on the Class Accidentally

Static state is shared by all instances:

```js
class User {
  static count = 0;

  constructor() {
    User.count++;
  }
}

new User();
new User();

console.log(User.count); // 2
```

Shared static state can be useful, but it can also make tests and concurrent application behavior harder to reason about. Use it deliberately.

## Quick Decision Guide

Ask these questions:

1. Does the method need data from one specific object?
   Use an instance method.
2. Does the method represent an action performed by one object?
   Use an instance method.
3. Does the method validate or create instances without needing an existing one?
   Consider a static method.
4. Is the function unrelated to the class's responsibility?
   Use a regular standalone function instead.

## Interview Answer

An instance method is called on an object and usually works with that object's state through `this`. Normal instance methods are stored on the class prototype and shared by all instances. A static method belongs to the class constructor and is called with `ClassName.method()`. It is useful for class-level validation, named factory methods, and operations that do not require one particular instance.
