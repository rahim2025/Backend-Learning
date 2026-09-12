# Polymorphism with Composition

Polymorphism and composition are separate ideas that become especially useful when used together.

- **Composition** builds an object by combining smaller objects or behaviors.
- **Polymorphism** allows those smaller objects to be replaced by other objects that provide the same interface.

```txt
Composition decides which parts work together.
Polymorphism makes compatible parts interchangeable.
```

## Basic Idea

Suppose an order service needs to send a notification after creating an order.

```js
class OrderService {
  constructor(notificationChannel) {
    this.notificationChannel = notificationChannel;
  }

  createOrder(order) {
    console.log(`Created order ${order.id}`);
    this.notificationChannel.send("Your order was created");
  }
}
```

The service is **composed** with a notification channel because it has a channel as one of its parts.

Different channel objects can provide the same `send()` method:

```js
class EmailChannel {
  send(message) {
    console.log(`Email: ${message}`);
  }
}

class SmsChannel {
  send(message) {
    console.log(`SMS: ${message}`);
  }
}

class PushChannel {
  send(message) {
    console.log(`Push: ${message}`);
  }
}
```

Any of them can be supplied to `OrderService`:

```js
const emailOrderService = new OrderService(new EmailChannel());
const smsOrderService = new OrderService(new SmsChannel());

emailOrderService.createOrder({ id: 101 });
smsOrderService.createOrder({ id: 102 });
```

The channel objects are **polymorphic** because they respond to the same `send()` operation with different behavior.

## How the Concepts Work Together

| Concept | Role in the example |
| --- | --- |
| Composition | `OrderService` receives and uses a notification channel |
| Polymorphism | Email, SMS, and push channels all provide `send()` |
| Abstraction | `OrderService` depends only on the simple `send(message)` interface |
| Encapsulation | Each channel hides how it delivers its message |

These OOP ideas support one another without requiring a deep inheritance hierarchy.

## Depend on Behavior, Not a Concrete Class

A tightly coupled service creates one specific implementation itself:

```js
class OrderService {
  constructor() {
    this.notificationChannel = new EmailChannel();
  }
}
```

Now the service always uses email. Changing to SMS requires editing `OrderService`.

A composed design accepts any compatible channel:

```js
class OrderService {
  constructor(notificationChannel) {
    if (
      !notificationChannel ||
      typeof notificationChannel.send !== "function"
    ) {
      throw new TypeError("Notification channel must provide send()");
    }

    this.notificationChannel = notificationChannel;
  }
}
```

The service depends on the `send()` behavior rather than checking for a specific class.

## Avoid Type-Based Conditionals

Without polymorphism, a composed object may still contain provider-specific conditions:

```js
class OrderService {
  constructor(channel) {
    this.channel = channel;
  }

  notify(message) {
    if (this.channel.type === "email") {
      sendEmail(message);
    } else if (this.channel.type === "sms") {
      sendSms(message);
    } else if (this.channel.type === "push") {
      sendPush(message);
    }
  }
}
```

Every new channel requires another condition.

With a shared interface, the service delegates the behavior:

```js
notify(message) {
  this.channel.send(message);
}
```

New implementations can be introduced without changing this method.

## Backend Example: Payment Checkout

The checkout service can be composed with a payment method, repository, and logger.

```js
class CheckoutService {
  constructor(paymentMethod, orderRepository, logger) {
    this.paymentMethod = paymentMethod;
    this.orderRepository = orderRepository;
    this.logger = logger;
  }

  async checkout(order) {
    const payment = await this.paymentMethod.pay(order.total);

    const completedOrder = {
      ...order,
      paymentId: payment.id,
      status: "paid",
    };

    await this.orderRepository.save(completedOrder);
    this.logger.info(`Order ${order.id} completed`);

    return completedOrder;
  }
}
```

The service is composed from three collaborators. The payment collaborator can have multiple implementations.

```js
class StripePayment {
  async pay(amount) {
    console.log(`Charging ${amount} with Stripe`);
    return { id: "stripe-101", status: "paid" };
  }
}

class PayPalPayment {
  async pay(amount) {
    console.log(`Charging ${amount} with PayPal`);
    return { id: "paypal-101", status: "paid" };
  }
}

class CashPayment {
  async pay(amount) {
    console.log(`Recording cash payment of ${amount}`);
    return { id: "cash-101", status: "paid" };
  }
}
```

Each object provides the same expected operation:

```js
paymentMethod.pay(amount);
```

The checkout workflow remains unchanged when the payment method changes.

```js
const stripeCheckout = new CheckoutService(
  new StripePayment(),
  orderRepository,
  logger
);

const paypalCheckout = new CheckoutService(
  new PayPalPayment(),
  orderRepository,
  logger
);
```

## No Shared Parent Class Is Required

JavaScript supports duck typing. Compatible objects do not have to extend a common parent class.

```js
const bankTransferPayment = {
  async pay(amount) {
    return {
      id: `bank-${Date.now()}`,
      amount,
      status: "paid",
    };
  },
};
```

This object can be supplied to `CheckoutService` because it provides a compatible `pay()` method.

```js
const checkout = new CheckoutService(
  bankTransferPayment,
  orderRepository,
  logger
);
```

The shared behavior matters more than the object's inheritance tree.

## Using a Common Base Class

A base class can document the expected operation when a real parent-child relationship is useful.

```js
class PaymentMethod {
  async pay(amount) {
    throw new Error("pay() must be implemented");
  }
}

class StripePayment extends PaymentMethod {
  async pay(amount) {
    return { id: "stripe-101", amount, status: "paid" };
  }
}

class PayPalPayment extends PaymentMethod {
  async pay(amount) {
    return { id: "paypal-101", amount, status: "paid" };
  }
}
```

However, the base class is optional in JavaScript. Use it only when it makes the relationship and shared behavior clearer.

## Runtime Behavior Switching

Composition can also allow behavior to change at runtime.

```js
class ShippingService {
  constructor(pricingStrategy) {
    this.pricingStrategy = pricingStrategy;
  }

  setPricingStrategy(pricingStrategy) {
    this.pricingStrategy = pricingStrategy;
  }

  calculatePrice(order) {
    return this.pricingStrategy.calculate(order);
  }
}

const standardPricing = {
  calculate(order) {
    return order.weight * 5;
  },
};

const expressPricing = {
  calculate(order) {
    return order.weight * 12;
  },
};

const shipping = new ShippingService(standardPricing);

console.log(shipping.calculatePrice({ weight: 2 })); // 10

shipping.setPricingStrategy(expressPricing);

console.log(shipping.calculatePrice({ weight: 2 })); // 24
```

`ShippingService` is composed with a pricing strategy. The pricing objects are polymorphic because both provide `calculate()`.

This design is commonly known as the **Strategy pattern**.

## Testing the Composed Object

Polymorphic dependencies make testing easier because a fake object can replace a real external service.

```js
const fakePayment = {
  async pay(amount) {
    return {
      id: "test-payment",
      amount,
      status: "paid",
    };
  },
};

const savedOrders = [];

const fakeRepository = {
  async save(order) {
    savedOrders.push(order);
  },
};

const fakeLogger = {
  info() {},
};

const checkout = new CheckoutService(
  fakePayment,
  fakeRepository,
  fakeLogger
);

const result = await checkout.checkout({
  id: 1,
  total: 500,
});

console.log(result.paymentId);     // "test-payment"
console.log(savedOrders.length);   // 1
```

The test verifies the checkout workflow without calling Stripe, PayPal, a database, or a real logger.

## The Shared Contract Must Be Consistent

Method names alone are not enough. Every interchangeable implementation should follow the same behavioral contract.

For the payment example, each `pay()` implementation should agree on:

- The expected parameters
- Whether the method is asynchronous
- The result shape
- How failures are reported
- What a successful status means

Problematic implementation:

```js
class BrokenPayment {
  pay() {
    return "done";
  }
}
```

`CheckoutService` expects an object with an `id` and status, so returning an unrelated string breaks the contract even though the method is named `pay`.

## Composition vs Polymorphism

| Composition | Polymorphism |
| --- | --- |
| Combines objects into a larger feature | Makes compatible objects interchangeable |
| Describes a has-a relationship | Describes one interface with many behaviors |
| Answers which dependency is used | Answers how different dependencies can fit the same role |
| Implemented through injection, delegation, or behavior objects | Implemented through overriding or duck typing |

They solve different problems, but they work naturally together.

## Composition with Polymorphism vs Inheritance

Inheritance places reusable behavior in a parent class:

```js
class EmailOrderService extends OrderService {}
class SmsOrderService extends OrderService {}
```

This can create a new subclass for every combination of behavior.

Composition injects the changing behavior:

```js
new OrderService(new EmailChannel());
new OrderService(new SmsChannel());
new OrderService(new PushChannel());
```

If payment, logging, storage, and notifications can all vary, inheritance may require many combinations of subclasses. Composition allows each part to vary independently.

## Common Mistakes

### Checking Concrete Classes

```js
if (paymentMethod instanceof StripePayment) {
  // Stripe logic
} else if (paymentMethod instanceof PayPalPayment) {
  // PayPal logic
}
```

This removes the main benefit of polymorphism. Let each payment object implement `pay()` and call that shared method.

### Using Inconsistent Interfaces

```js
stripe.charge(amount);
paypal.makePayment(amount);
cash.record(amount);
```

A shared role should expose a shared operation:

```js
paymentMethod.pay(amount);
```

### Injecting Too Many Dependencies

Composition can reveal that one class has too many responsibilities. If a constructor needs a very large number of unrelated dependencies, consider splitting the class into smaller services.

### Allowing Invalid Dependencies

If dependencies come from configuration or plugins, validate the required behavior at the application boundary.

```js
function assertPaymentMethod(paymentMethod) {
  if (!paymentMethod || typeof paymentMethod.pay !== "function") {
    throw new TypeError("Payment method must provide pay()");
  }
}
```

### Creating Unnecessary Interfaces

Do not introduce several implementations only to demonstrate polymorphism. Use this design when behavior genuinely varies or must be replaceable.

## When to Combine Them

Polymorphism with composition is useful when:

- External providers may change
- Different environments use different implementations
- Dependencies must be replaced in tests
- A feature supports multiple strategies or channels
- Large `if` or `switch` statements select behavior by type
- Parts of a workflow should vary independently

Typical backend examples include:

- Payment providers
- Notification channels
- Database repositories
- File-storage providers
- Authentication strategies
- Logging implementations
- Shipping-price strategies

## Interview Answer

Composition builds a class or service from smaller collaborating objects, while polymorphism allows different objects to fill the same role through a shared interface. For example, a checkout service can be composed with a payment object and simply call `pay()`. Stripe, PayPal, and a fake test payment can each implement `pay()` differently. The checkout workflow remains unchanged because it depends on behavior rather than a concrete class.
