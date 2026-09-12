# Polymorphism in JavaScript

Polymorphism means **one interface, many forms**.

It allows different objects to respond to the same method call in their own way. The calling code uses one common operation without needing to know every object's exact type.

```js
class EmailNotification {
  send(message) {
    console.log(`Sending email: ${message}`);
  }
}

class SmsNotification {
  send(message) {
    console.log(`Sending SMS: ${message}`);
  }
}

const notifications = [
  new EmailNotification(),
  new SmsNotification(),
];

for (const notification of notifications) {
  notification.send("Your order has shipped");
}
```

The same `send()` call produces different behavior depending on the object that receives it.

## Why Polymorphism Is Useful

Without polymorphism, code often checks every possible type:

```js
function sendNotification(type, message) {
  if (type === "email") {
    console.log(`Sending email: ${message}`);
  } else if (type === "sms") {
    console.log(`Sending SMS: ${message}`);
  } else if (type === "push") {
    console.log(`Sending push notification: ${message}`);
  }
}
```

This function must change whenever a new notification type is added.

With polymorphism, each object owns its behavior:

```js
function notify(notification, message) {
  notification.send(message);
}
```

The `notify` function works with any object that provides a compatible `send()` method.

## Polymorphism Through Method Overriding

Inheritance and method overriding are one way to implement polymorphism.

```js
class Notification {
  send(message) {
    throw new Error("send() must be implemented");
  }
}

class EmailNotification extends Notification {
  send(message) {
    console.log(`Email: ${message}`);
  }
}

class SmsNotification extends Notification {
  send(message) {
    console.log(`SMS: ${message}`);
  }
}

class PushNotification extends Notification {
  send(message) {
    console.log(`Push: ${message}`);
  }
}
```

Each child class overrides `send()` with its own implementation.

```js
const channels = [
  new EmailNotification(),
  new SmsNotification(),
  new PushNotification(),
];

channels.forEach((channel) => {
  channel.send("Payment received");
});
```

The loop does not need `if`, `else`, or `switch` statements to determine which implementation to run.

## Overriding vs Polymorphism

Method overriding and polymorphism are related, but they are not identical.

| Concept | Meaning |
| --- | --- |
| Method overriding | A child class replaces an inherited method with its own implementation |
| Polymorphism | Different objects can be used through the same interface and respond differently |

Overriding is a mechanism that can create polymorphic behavior.

```js
class Animal {
  speak() {
    console.log("Animal makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks");
  }
}

class Cat extends Animal {
  speak() {
    console.log("Cat meows");
  }
}

function makeItSpeak(animal) {
  animal.speak();
}

makeItSpeak(new Dog()); // "Dog barks"
makeItSpeak(new Cat()); // "Cat meows"
```

`Dog` and `Cat` override `speak()`. The `makeItSpeak()` function demonstrates polymorphism because it works with either object through the same method.

## Duck Typing in JavaScript

JavaScript is dynamically typed, so objects do not need to inherit from the same parent class to be used polymorphically.

If different objects provide the required method, calling code can use them through the same interface. This is commonly called **duck typing**.

```txt
If it has the required behavior, it can be used.
```

```js
const emailChannel = {
  send(message) {
    console.log(`Email: ${message}`);
  },
};

const logChannel = {
  send(message) {
    console.log(`Log: ${message}`);
  },
};

function deliver(channel, message) {
  channel.send(message);
}

deliver(emailChannel, "Server started");
deliver(logChannel, "Server started");
```

These objects share no parent class. They work with `deliver()` because both provide a `send()` method.

## Inheritance-Based vs Duck-Typed Polymorphism

| Approach | Requirement | Example |
| --- | --- | --- |
| Inheritance-based | Objects inherit from a common parent class | `EmailNotification extends Notification` |
| Duck-typed | Objects only provide compatible behavior | Any object with `send()` |

Inheritance can communicate a clear relationship between types. Duck typing is more flexible and is common in JavaScript.

## Backend Example: Payment Processing

Different payment providers can expose the same `pay()` operation.

```js
class StripePayment {
  pay(amount) {
    console.log(`Charging $${amount} with Stripe`);
    return { provider: "stripe", status: "paid" };
  }
}

class PayPalPayment {
  pay(amount) {
    console.log(`Charging $${amount} with PayPal`);
    return { provider: "paypal", status: "paid" };
  }
}

class CashPayment {
  pay(amount) {
    console.log(`Recording $${amount} cash payment`);
    return { provider: "cash", status: "pending" };
  }
}

function checkout(paymentMethod, amount) {
  if (!paymentMethod || typeof paymentMethod.pay !== "function") {
    throw new TypeError("A valid payment method is required");
  }

  return paymentMethod.pay(amount);
}

checkout(new StripePayment(), 100);
checkout(new PayPalPayment(), 100);
checkout(new CashPayment(), 100);
```

`checkout()` depends on the `pay()` behavior rather than a particular payment provider.

This makes it easier to:

- Add another payment provider
- Test checkout with a fake payment object
- Keep provider-specific logic outside the checkout flow

## Testing with Polymorphism

Duck typing makes it easy to replace a real dependency with a test double.

```js
const fakePayment = {
  pay(amount) {
    return {
      provider: "fake",
      amount,
      status: "paid",
    };
  },
};

const result = checkout(fakePayment, 250);

console.log(result.status); // "paid"
```

The checkout code does not care whether the payment object communicates with a real external service. It only requires a compatible `pay()` method.

## Polymorphism with Built-In Methods

JavaScript itself uses polymorphic method names.

```js
console.log([1, 2, 3].toString());
console.log(new Date().toString());
console.log({ name: "Rahim" }.toString());
```

All three values respond to `toString()`, but each type provides different behavior.

Custom classes can override inherited methods too:

```js
class User {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return `User: ${this.name}`;
  }
}

console.log(String(new User("Rahim"))); // "User: Rahim"
```

## Keeping a Consistent Interface

Polymorphic objects should follow the same expected contract.

If every payment object's `pay()` method receives an amount and returns a result, one implementation should not behave completely differently.

```js
class BrokenPayment {
  pay() {
    return undefined;
  }
}
```

Although `BrokenPayment` has a `pay()` method, it may still violate the behavior expected by `checkout()`.

A compatible interface includes more than the method name. It should also preserve:

- Expected parameters
- Return-value structure
- Error behavior
- Meaning of the operation

## Polymorphism Is Not Method Overloading

Polymorphism is sometimes confused with method overloading.

Traditional method overloading defines multiple methods with the same name but different parameter lists. JavaScript classes do not support that form of overloading.

```js
class Calculator {
  add(a, b) {
    return a + b;
  }

  add(a, b, c) {
    return a + b + c;
  }
}
```

The second `add()` replaces the first one; both versions do not coexist.

JavaScript commonly handles different arguments inside one function:

```js
class Calculator {
  add(...numbers) {
    return numbers.reduce((total, number) => total + number, 0);
  }
}

const calculator = new Calculator();

console.log(calculator.add(2, 3));    // 5
console.log(calculator.add(2, 3, 4)); // 9
```

## Common Mistakes

### Checking Types Instead of Using the Shared Behavior

```js
function notify(channel, message) {
  if (channel instanceof EmailNotification) {
    channel.send(message);
  } else if (channel instanceof SmsNotification) {
    channel.send(message);
  }
}
```

Both branches perform the same operation. Call the shared method directly:

```js
function notify(channel, message) {
  channel.send(message);
}
```

### Inconsistent Method Names

```js
class EmailNotification {
  sendEmail(message) {}
}

class SmsNotification {
  sendSms(message) {}
}
```

Calling code cannot treat these implementations uniformly. A shared method name makes polymorphism possible:

```js
class EmailNotification {
  send(message) {}
}

class SmsNotification {
  send(message) {}
}
```

### Assuming a Method Exists

Duck typing is flexible, but invalid input can fail at runtime.

```js
function notify(channel, message) {
  if (!channel || typeof channel.send !== "function") {
    throw new TypeError("Notification channel must provide send()");
  }

  channel.send(message);
}
```

Validate objects at system boundaries when they may come from configuration, plugins, or other untrusted sources.

## When to Use Polymorphism

Polymorphism is useful when:

- Several objects perform the same kind of operation differently.
- Calling code should not depend on concrete implementations.
- New implementations may be added later.
- Dependencies need to be replaced during testing.
- Large type-based conditional statements are growing repeatedly.

Do not create many classes only to make a tiny condition look object-oriented. For simple, fixed behavior, a function or small lookup object may be clearer.

## Interview Answer

Polymorphism means that different objects can respond to the same method call with different behavior. In JavaScript, it can be implemented through inheritance and method overriding, or through duck typing where unrelated objects provide the same compatible method. For example, different payment objects can all implement `pay()`, allowing checkout code to use any of them without knowing the specific payment provider.
