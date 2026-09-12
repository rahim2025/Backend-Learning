# What Is Object-Oriented Programming?

Object-oriented programming, or OOP, is a programming style that organizes code around **objects**.

An object can group:

- **Data**, stored in properties
- **Behavior**, stored in methods

```js
const user = {
  name: "Rahim",
  email: "rahim@example.com",

  login() {
    console.log(`${this.name} logged in`);
  },
};

user.login();
```

Here, `name` and `email` are data, while `login()` is behavior.

## Why Use OOP?

OOP helps organize related state and behavior in one place. It is useful when an application has many similar entities, such as:

- Users
- Products
- Orders
- Payments
- Bank accounts

It can make code easier to reuse, maintain, and extend.

## Four Common OOP Principles

| Principle | Meaning |
| --- | --- |
| Encapsulation | Keep related data and behavior together and control access to internal details |
| Abstraction | Hide unnecessary implementation details behind a simple interface |
| Inheritance | Allow one object or type to reuse behavior from another |
| Polymorphism | Allow the same operation to behave differently for different objects |

## Encapsulation Example

```js
function createBankAccount(owner, initialBalance) {
  let balance = initialBalance;

  return {
    owner,
    deposit(amount) {
      if (amount > 0) balance += amount;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount("Rahim", 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
```

The `balance` variable is hidden from outside code. It can only be changed through the provided methods.

## OOP in JavaScript

JavaScript is not class-based internally like Java or C#. JavaScript uses **prototypes** for inheritance.

Modern JavaScript has `class` syntax, but classes are built on top of the prototype system.

```js
class User {
  login() {
    console.log("User logged in");
  }
}
```

Understanding prototypes makes constructor functions and classes much easier to understand.

## Interview Answer

Object-oriented programming is a programming style that groups related data and behavior inside objects. Its common principles are encapsulation, abstraction, inheritance, and polymorphism. JavaScript supports OOP through objects and prototype-based inheritance, and its `class` syntax is built on top of prototypes.
