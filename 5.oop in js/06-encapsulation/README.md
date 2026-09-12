# Encapsulation in JavaScript

Encapsulation means keeping an object's data and the methods that work with that data together while controlling direct access to its internal state.

Instead of allowing outside code to change everything freely, an object exposes a safe public interface.

## Why Encapsulation Matters

Consider a bank account whose balance is public:

```js
class BankAccount {
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance;
  }
}

const account = new BankAccount("Rahim", 1000);
account.balance = -50000;
```

Outside code can put the object into an invalid state. Encapsulation prevents uncontrolled changes and keeps validation rules in one place.

## Private Fields with `#`

A field beginning with `#` is private to the class that declares it.

```js
class BankAccount {
  #balance;

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Deposit must be greater than zero");
    }

    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount("Rahim", 1000);
account.deposit(500);

console.log(account.getBalance()); // 1500
// console.log(account.#balance);  // SyntaxError
```

The balance can only be changed through methods that enforce the account rules.

## Private Methods

Methods can also be private:

```js
class User {
  #password;

  constructor(name, password) {
    this.name = name;
    this.#password = password;
  }

  #matchesPassword(password) {
    return this.#password === password;
  }

  login(password) {
    return this.#matchesPassword(password);
  }
}

const user = new User("Rahim", "secret123");

console.log(user.login("secret123")); // true
// user.#matchesPassword("secret123"); // SyntaxError
```

In a real backend, passwords must be hashed rather than stored as plain text. This example only demonstrates private fields and methods.

## Getters

A getter provides property-like read access while keeping the underlying field private.

```js
class BankAccount {
  #balance = 0;

  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount();
console.log(account.balance); // 0
```

A getter is accessed like a property, without parentheses.

## Setters

A setter controls how a value is assigned.

```js
class User {
  #email;

  get email() {
    return this.#email;
  }

  set email(value) {
    if (typeof value !== "string" || !value.includes("@")) {
      throw new Error("Invalid email address");
    }

    this.#email = value;
  }
}

const user = new User();
user.email = "rahim@example.com";

console.log(user.email); // "rahim@example.com"
```

The setter looks like normal assignment, but validation runs before the value is stored.

## Avoid Recursive Getters and Setters

Using the same public property inside its getter or setter causes infinite recursion:

```js
class User {
  set email(value) {
    this.email = value; // Calls the same setter again
  }
}
```

Store the value in a different field, commonly a private field:

```js
class User {
  #email;

  set email(value) {
    this.#email = value;
  }
}
```

## Encapsulation with Closures

Encapsulation is not limited to classes. Factory functions can hide data with closures.

```js
function createBankAccount(owner, initialBalance) {
  let balance = initialBalance;

  return {
    owner,
    deposit(amount) {
      if (amount <= 0) {
        throw new Error("Deposit must be greater than zero");
      }

      balance += amount;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount("Rahim", 1000);
account.deposit(500);

console.log(account.getBalance()); // 1500
console.log(account.balance);      // undefined
```

The methods retain access to `balance` through a closure, while outside code cannot access it directly.

## Public and Private Members

| Member | Accessible outside the class? | Example |
| --- | --- | --- |
| Public field | Yes | `this.name` |
| Public method | Yes | `account.deposit()` |
| Private field | No | `this.#balance` |
| Private method | No | `this.#validate()` |
| Getter | Yes, as a property | `account.balance` |
| Setter | Yes, through assignment | `user.email = value` |

## Encapsulation Is Not Just Privacy

Encapsulation has two connected goals:

1. Keep related state and behavior together.
2. Protect internal rules by controlling how state is read or changed.

Making every property private is not automatically good design. Hide details that callers should not depend on, and expose a small interface that clearly represents valid operations.

## Interview Answer

Encapsulation means grouping data with the methods that operate on it and controlling access to internal state. In JavaScript, it can be implemented with private `#` fields and methods, getters and setters, or closures in factory functions. Encapsulation protects object invariants by requiring outside code to use validated public operations instead of modifying sensitive state directly.
