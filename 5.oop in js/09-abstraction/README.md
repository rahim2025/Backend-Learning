# Abstraction in JavaScript

Abstraction means hiding unnecessary implementation details and exposing only the operations that other code needs.

It answers this question:

```txt
What can this object do?
```

without requiring the caller to understand:

```txt
How does the object do it?
```

## Simple Example

When using a coffee machine, a person presses a button to make coffee. They do not need to manually control the heater, water pressure, or internal pump.

Code can provide the same kind of simple interface:

```js
class CoffeeMachine {
  makeCoffee() {
    this.#heatWater();
    this.#grindBeans();
    this.#brew();

    return "Coffee is ready";
  }

  #heatWater() {
    console.log("Heating water");
  }

  #grindBeans() {
    console.log("Grinding beans");
  }

  #brew() {
    console.log("Brewing coffee");
  }
}

const machine = new CoffeeMachine();
console.log(machine.makeCoffee());
```

The caller uses one meaningful operation, `makeCoffee()`. The internal steps remain hidden.

## Why Abstraction Is Useful

Abstraction helps code by:

- Reducing the number of details a caller must understand
- Providing a small and clear public interface
- Keeping complex logic in one place
- Allowing internal implementation to change safely
- Reducing coupling between different parts of an application
- Making code easier to test and maintain

## Abstraction Without It

Without abstraction, calling code may need to know every implementation step:

```js
validatePaymentAmount(100);
const token = createProviderToken(cardDetails);
const response = sendProviderRequest(token, 100);
savePaymentRecord(response);
writeAuditLog(response);
```

This code is coupled to the entire payment process.

With abstraction, the caller uses one operation:

```js
const result = paymentService.pay(100, cardDetails);
```

The service hides the workflow behind `pay()`.

## Backend Example: Payment Service

```js
class PaymentService {
  constructor(paymentProvider, paymentRepository, logger) {
    this.paymentProvider = paymentProvider;
    this.paymentRepository = paymentRepository;
    this.logger = logger;
  }

  async pay(amount, paymentDetails) {
    this.#validateAmount(amount);

    try {
      const payment = await this.paymentProvider.charge(
        amount,
        paymentDetails
      );

      await this.paymentRepository.save(payment);
      this.logger.info(`Payment ${payment.id} completed`);

      return payment;
    } catch (error) {
      this.logger.error("Payment failed", error);
      throw new Error("Unable to complete payment");
    }
  }

  #validateAmount(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new TypeError("Payment amount must be a positive number");
    }
  }
}
```

The controller only needs to know the public operation:

```js
const payment = await paymentService.pay(
  req.body.amount,
  req.body.paymentDetails
);
```

It does not need to know how the service validates the amount, contacts the provider, saves the payment, or writes logs.

## Public Interface and Implementation Details

An abstraction usually has two parts:

| Part | Meaning | Payment example |
| --- | --- | --- |
| Public interface | Operations available to callers | `pay(amount, details)` |
| Implementation details | Internal steps hidden from callers | Validation, API calls, storage, and logging |

A good public method describes a meaningful business operation rather than exposing every low-level step.

```js
paymentService.pay(amount, details);
```

is usually a better abstraction than requiring callers to use:

```js
paymentService.validateAmount(amount);
paymentService.createToken(details);
paymentService.callProvider(amount);
paymentService.persistResult();
```

## Abstraction with Functions

Abstraction does not require classes. A function can hide a complex operation behind a simple name.

```js
function calculateOrderTotal(items, taxRate) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = subtotal * taxRate;
  return subtotal + tax;
}

const total = calculateOrderTotal(cartItems, 0.05);
```

The caller does not need to repeat or understand every calculation step.

## Abstraction with Classes

A class can expose a few public methods while hiding helper methods and internal data.

```js
class Order {
  #items = [];

  addItem(product, quantity) {
    this.#validateQuantity(quantity);
    this.#items.push({ product, quantity });
  }

  getTotal() {
    return this.#items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  #validateQuantity(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new TypeError("Quantity must be a positive integer");
    }
  }
}
```

Callers work with `addItem()` and `getTotal()`. They do not manage the internal item array or its validation rules directly.

## Abstract-Style Base Classes

Languages such as Java and TypeScript support explicit abstract classes. JavaScript does not have a native `abstract` keyword.

JavaScript can simulate an abstract-style base class by throwing errors from methods that child classes must override.

```js
class Notification {
  send(message) {
    throw new Error("send() must be implemented");
  }
}

class EmailNotification extends Notification {
  send(message) {
    console.log(`Sending email: ${message}`);
  }
}

class SmsNotification extends Notification {
  send(message) {
    console.log(`Sending SMS: ${message}`);
  }
}
```

The base class describes the expected operation, while child classes provide the implementation.

```js
function notify(channel, message) {
  channel.send(message);
}

notify(new EmailNotification(), "Order shipped");
notify(new SmsNotification(), "Order shipped");
```

This example combines abstraction and polymorphism:

- The abstraction is the common `send(message)` operation.
- Polymorphism allows each notification object to implement `send()` differently.

## Preventing Direct Base-Class Creation

An abstract-style base class can prevent itself from being instantiated directly:

```js
class Notification {
  constructor() {
    if (new.target === Notification) {
      throw new TypeError("Notification cannot be instantiated directly");
    }
  }

  send(message) {
    throw new Error("send() must be implemented");
  }
}

// new Notification(); // TypeError
```

`new.target` refers to the constructor that was called with `new`. This pattern is optional and depends on whether a base instance would be meaningful.

## Abstraction with Composition

Abstraction can also be created by depending on a small behavior instead of a parent class.

```js
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async findUser(id) {
    return this.userRepository.findById(id);
  }
}
```

`UserService` only depends on a repository that provides `findById()`. It does not need to know whether the repository uses PostgreSQL, MongoDB, or in-memory data.

```js
class MemoryUserRepository {
  constructor(users) {
    this.users = users;
  }

  async findById(id) {
    return this.users.find((user) => user.id === id) ?? null;
  }
}
```

The repository interface abstracts away the storage technology.

## Abstraction vs Encapsulation

Abstraction and encapsulation are related, but they focus on different concerns.

| Concept | Main focus | Question |
| --- | --- | --- |
| Abstraction | Hiding unnecessary complexity | What operations should callers use? |
| Encapsulation | Protecting internal state and rules | How should access to data be controlled? |

Example:

```js
class BankAccount {
  #balance = 0;

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    this.#balance += amount;
  }
}
```

- `deposit()` is an abstraction because it provides a meaningful operation without exposing every internal step.
- `#balance` is encapsulation because it prevents uncontrolled access to the internal balance.

## Abstraction vs Polymorphism

| Concept | Purpose |
| --- | --- |
| Abstraction | Defines a simple operation while hiding implementation details |
| Polymorphism | Allows different implementations to respond to that operation |

For example, `payment.pay(amount)` is an abstraction. Stripe, PayPal, and cash payment objects implementing `pay()` differently demonstrate polymorphism.

## Leaky Abstraction

An abstraction is **leaky** when callers must understand hidden implementation details to use it correctly.

```js
await userRepository.findById(id, {
  sqlJoin: "profiles",
  postgresLockMode: "FOR UPDATE",
});
```

This repository interface exposes database-specific details to business code.

A more meaningful interface could be:

```js
await userRepository.findProfileForUpdate(id);
```

Not every implementation detail can or should be hidden, but a good abstraction exposes concepts relevant to its caller.

## Common Mistakes

### Exposing Too Many Internal Methods

If callers must coordinate every internal step, the object is not providing a useful abstraction.

```js
payment.validate();
payment.openConnection();
payment.sendRequest();
payment.saveResponse();
payment.closeConnection();
```

Prefer one meaningful operation when those steps always belong together:

```js
await payment.pay(amount, details);
```

### Creating an Abstraction Too Early

Do not introduce base classes or generic interfaces when there is only one simple implementation and no clear variation. An abstraction should hide real complexity or define a genuinely useful boundary.

### Hiding Important Behavior

Abstraction should reduce irrelevant detail, not make important effects surprising. A method named `getUser()` should not silently delete records or send emails.

### Depending on Concrete Details

```js
class UserService {
  constructor() {
    this.database = new PostgreSQLDatabase();
  }
}
```

This service is tightly coupled to one database implementation. Accepting a repository or database dependency creates a clearer abstraction boundary:

```js
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
}
```

## When to Use Abstraction

Abstraction is useful when:

- A workflow contains several implementation steps.
- External services or databases should be hidden behind a stable interface.
- Callers should depend on behavior rather than technology details.
- Several implementations provide the same operation.
- Internal code may change without requiring callers to change.
- Business code needs meaningful domain operations.

The goal is not to hide everything. The goal is to expose the right amount of information for callers to use the code correctly.

## Interview Answer

Abstraction means hiding unnecessary implementation details behind a simple public interface. It lets callers focus on what an object does instead of how it performs the work. In JavaScript, abstraction can be implemented with functions, classes, private helper methods, abstract-style base classes, or composition. For example, a payment service can expose `pay()` while hiding validation, provider communication, persistence, and logging.
