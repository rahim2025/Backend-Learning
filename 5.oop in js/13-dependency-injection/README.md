# Dependency Injection in JavaScript

Dependency injection, commonly called **DI**, means giving an object or function the dependencies it needs from the outside.

A dependency is another object, function, service, or value that code needs to do its work.

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

`UserService` depends on `userRepository`. The repository is injected through the constructor instead of being created inside the service.

## Why Is It Called Injection?

The dependency is supplied, or injected, by code outside the class.

```js
const userRepository = new PostgreSQLUserRepository(database);
const userService = new UserService(userRepository);
```

`UserService` says what it needs, while the application decides which repository implementation to provide.

## Without Dependency Injection

```js
class UserService {
  constructor() {
    this.userRepository = new PostgreSQLUserRepository();
  }

  async findUser(id) {
    return this.userRepository.findById(id);
  }
}
```

This design tightly couples `UserService` to `PostgreSQLUserRepository`.

Problems include:

- The service chooses its own dependency.
- Changing databases requires editing the service.
- Tests may require a real database.
- Configuration is hidden inside business logic.
- The dependency cannot be replaced easily.

## With Dependency Injection

```js
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
}
```

Production can use PostgreSQL:

```js
const userService = new UserService(postgresUserRepository);
```

Tests can use an in-memory repository:

```js
const userService = new UserService(memoryUserRepository);
```

The `UserService` implementation does not change.

## Benefits of Dependency Injection

Dependency injection helps with:

- **Loose coupling:** code depends less on concrete implementations.
- **Testability:** real dependencies can be replaced with fakes or stubs.
- **Flexibility:** implementations can change through application wiring.
- **Clear dependencies:** constructors and function parameters reveal requirements.
- **Separation of concerns:** business logic does not create infrastructure objects.
- **Reusability:** the same service can work in different environments.

## Constructor Injection

Constructor injection provides dependencies when an object is created.

```js
class OrderService {
  constructor(orderRepository, paymentService, logger) {
    this.orderRepository = orderRepository;
    this.paymentService = paymentService;
    this.logger = logger;
  }

  async placeOrder(order) {
    const payment = await this.paymentService.pay(order.total);

    const savedOrder = await this.orderRepository.save({
      ...order,
      paymentId: payment.id,
      status: "paid",
    });

    this.logger.info(`Order ${savedOrder.id} placed`);
    return savedOrder;
  }
}
```

Constructor injection is usually the best default for required dependencies because the object cannot be created without providing them.

```js
const orderService = new OrderService(
  orderRepository,
  paymentService,
  logger
);
```

## Function Injection

JavaScript functions can receive dependencies through parameters.

```js
function createUserService(userRepository, logger) {
  return {
    async createUser(data) {
      const user = await userRepository.create(data);
      logger.info(`Created user ${user.id}`);
      return user;
    },
  };
}
```

The dependencies remain available through a closure.

```js
const userService = createUserService(userRepository, logger);
```

This style works well with factory functions and does not require classes.

## Injecting Functions Directly

A dependency can be a function rather than an object.

```js
function createPasswordResetService(sendEmail, generateToken) {
  return {
    async requestReset(user) {
      const token = generateToken(user.id);

      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        body: `Reset token: ${token}`,
      });
    },
  };
}
```

Injecting small functions can be simpler than creating a class for every dependency.

## Method Injection

Method injection passes a dependency only to the operation that needs it.

```js
class ReportService {
  generate(reportData, formatter) {
    return formatter.format(reportData);
  }
}

const reportService = new ReportService();
const report = reportService.generate(data, pdfFormatter);
```

Use method injection when:

- Only one method needs the dependency.
- The dependency may change for each call.
- The dependency is part of the operation's input.

Do not use it for a required collaborator needed by most methods; constructor injection makes that relationship clearer.

## Property Injection

Property injection assigns a dependency after creating the object.

```js
const userService = new UserService();
userService.userRepository = userRepository;
```

This is flexible, but the object may exist in an invalid state before the dependency is assigned.

```js
const userService = new UserService();
await userService.findUser(1); // Fails because repository is missing
```

Prefer constructor injection for required dependencies. Property injection is more suitable for genuinely optional dependencies.

## Injection Type Comparison

| Type | How dependency is provided | Best use |
| --- | --- | --- |
| Constructor injection | Passed when creating an object | Required, long-lived collaborators |
| Function injection | Passed to a factory or function | Functional modules and closures |
| Method injection | Passed to one method call | Per-operation behavior |
| Property injection | Assigned after creation | Optional dependencies, used carefully |

## Dependency Injection and Composition

Dependency injection is one way to perform composition.

```js
const orderService = new OrderService(
  paymentService,
  orderRepository,
  logger
);
```

- **Composition** means `OrderService` is built from collaborating parts.
- **Dependency injection** describes how those parts are supplied from outside.

Composition is the broader design idea. DI is a technique for connecting the composed objects.

## Dependency Injection and Polymorphism

DI becomes especially useful when different objects can fill the same role.

```js
class StripePayment {
  async pay(amount) {
    return { id: "stripe-1", amount, status: "paid" };
  }
}

class PayPalPayment {
  async pay(amount) {
    return { id: "paypal-1", amount, status: "paid" };
  }
}
```

Either implementation can be injected:

```js
const stripeOrders = new OrderService(
  orderRepository,
  new StripePayment(),
  logger
);

const paypalOrders = new OrderService(
  orderRepository,
  new PayPalPayment(),
  logger
);
```

The service depends on the behavior `pay(amount)`, not one payment class.

## Duck-Typed Dependency Contracts

JavaScript does not require an interface declaration. A dependency works if it provides the expected behavior.

```js
const memoryUserRepository = {
  users: [{ id: 1, name: "Rahim" }],

  async findById(id) {
    return this.users.find((user) => user.id === id) ?? null;
  },
};
```

The contract includes more than the method name. Implementations should agree on:

- Parameters
- Return values
- Asynchronous behavior
- Error behavior
- Meaning of the operation

## Validating Injected Dependencies

JavaScript detects missing methods at runtime. Validate dependencies near object creation when clearer errors are valuable.

```js
class UserService {
  constructor(userRepository) {
    if (
      !userRepository ||
      typeof userRepository.findById !== "function"
    ) {
      throw new TypeError(
        "UserService requires a repository with findById()"
      );
    }

    this.userRepository = userRepository;
  }
}
```

For internal application code, extensive runtime validation may be unnecessary if dependencies are wired in one trusted location. It is more useful at plugin, configuration, or external integration boundaries.

## Backend Example: Controller Injection

An HTTP controller can receive its service through a factory function.

```js
function createUserController(userService) {
  return {
    async getUser(req, res, next) {
      try {
        const user = await userService.findUser(req.params.id);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);
      } catch (error) {
        return next(error);
      }
    },
  };
}
```

Application setup injects the real service:

```js
const userController = createUserController(userService);

router.get("/users/:id", userController.getUser);
```

The controller focuses on HTTP behavior and does not construct repositories or database clients.

## Composition Root

The **composition root** is the application location where concrete dependencies are created and connected.

In a Node.js application, this is commonly an entry file such as `server.js`, `app.js`, or a dedicated container module.

```js
// server.js
const database = createDatabase(process.env.DATABASE_URL);
const logger = createLogger();

const userRepository = new PostgreSQLUserRepository(database);
const userService = new UserService(userRepository, logger);
const userController = createUserController(userService);

const app = createApp({ userController });

app.listen(3000);
```

Keeping construction in one place makes the dependency graph visible:

```txt
database -> userRepository -> userService -> userController -> app
```

Business modules receive ready-to-use dependencies instead of importing and constructing infrastructure globally.

## Manual Dependency Injection

The previous example uses manual DI. Plain JavaScript is enough:

```js
const service = new Service(dependencyA, dependencyB);
```

A DI framework is not required for dependency injection. Containers can help large applications, but manual wiring is often easier to understand and debug in small and medium projects.

## Testing with Dependency Injection

DI allows tests to replace real dependencies with controlled test doubles.

```js
const fakeRepository = {
  async findById(id) {
    return { id, name: "Test User" };
  },
};

const messages = [];

const fakeLogger = {
  info(message) {
    messages.push(message);
  },
};

const userService = new UserService(fakeRepository, fakeLogger);

const user = await userService.findUser(1);

console.log(user.name); // "Test User"
```

The test is fast and deterministic because it does not connect to a real database or logging service.

## Fake, Stub, and Spy Dependencies

| Test double | Purpose |
| --- | --- |
| Fake | Provides a lightweight working implementation, such as an in-memory repository |
| Stub | Returns predefined data for a test |
| Spy | Records calls so the test can verify interactions |

One object can serve more than one role.

```js
const sentEmails = [];

const emailSpy = {
  async send(message) {
    sentEmails.push(message);
  },
};
```

After running the service, a test can verify what was sent.

## Optional Dependencies

Optional dependencies can use a safe default implementation.

```js
const silentLogger = {
  info() {},
  error() {},
};

class UserService {
  constructor(userRepository, logger = silentLogger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }
}
```

Use defaults only when the dependency is truly optional. Silently replacing a missing required dependency can hide configuration errors.

## Dependency Injection vs Dependency Inversion

These terms are related but not identical.

| Dependency injection | Dependency inversion |
| --- | --- |
| A technique for supplying dependencies from outside | A design principle about depending on abstractions rather than concrete details |
| Focuses on object construction and wiring | Focuses on dependency direction |
| Example: pass a repository into a service | Example: service expects repository behavior, not PostgreSQL details |

DI can help implement dependency inversion, but merely passing a concrete object as a parameter does not automatically create a good abstraction.

## Dependency Injection vs Service Locator

A service locator gives code a global registry from which it requests dependencies.

```js
class UserService {
  async findUser(id) {
    const repository = container.get("userRepository");
    return repository.findById(id);
  }
}
```

The dependency is hidden because it does not appear in the constructor or method parameters.

With injection:

```js
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
}
```

The requirement is explicit. Prefer explicit injection for application code because it is easier to understand and test.

## Dependency Lifetimes

When wiring dependencies, consider how long each object should live.

| Lifetime | Meaning | Example |
| --- | --- | --- |
| Singleton | One shared instance for the application | Logger, configuration, database pool |
| Transient | A new instance each time it is needed | Small stateless operation object |
| Request-scoped | One instance for each HTTP request | Request context or transaction |

Manual DI can manage these lifetimes directly:

```js
const logger = createLogger(); // shared
const databasePool = createPool(); // shared

app.use((req, res, next) => {
  req.requestContext = createRequestContext(req); // per request
  next();
});
```

Do not create a new database pool for every request; inject one shared pool into repositories.

## Common Mistakes

### Hiding Dependencies in Imports

```js
import database from "./database.js";

export async function findUser(id) {
  return database.query("SELECT ...", [id]);
}
```

Direct imports are not always wrong, especially for stable utility modules. However, importing stateful infrastructure directly into business logic makes replacement and testing harder.

### Creating Dependencies Inside Business Logic

```js
async function createUser(data) {
  const database = new Database(process.env.DATABASE_URL);
  // ...
}
```

Construction and configuration should usually happen in the composition root.

### Too Many Constructor Dependencies

```js
class OrderService {
  constructor(
    repository,
    payment,
    inventory,
    email,
    logger,
    analytics,
    cache,
    queue
  ) {}
}
```

A long dependency list may indicate that the class has too many responsibilities. Group parameters into an object for readability only when appropriate, but first consider splitting the service.

```js
class OrderService {
  constructor({ repository, payment, inventory, logger }) {
    this.repository = repository;
    this.payment = payment;
    this.inventory = inventory;
    this.logger = logger;
  }
}
```

An options object improves call-site clarity but does not solve excessive responsibility by itself.

### Circular Dependencies

```txt
UserService -> EmailService -> UserService
```

Circular dependencies make construction and behavior difficult to reason about. Extract the shared responsibility or use events to remove the cycle.

### Injecting Data That Is Not a Dependency

Dependencies are collaborating services or configuration used across operations. Request-specific values are usually method arguments.

```js
// Dependency
const service = new UserService(userRepository);

// Operation data
await service.findUser(userId);
```

### Mocking Everything

DI makes mocking possible, but tests do not need to mock every small pure function. Prefer simple real objects and lightweight fakes when they make tests clearer.

### Using a DI Container Too Early

Automatic containers can hide where objects come from and make debugging harder. Start with constructor parameters and factory functions. Introduce a container only when the dependency graph is large enough to justify it.

## When to Use Dependency Injection

DI is especially useful for dependencies that:

- Access a database
- Call an external API
- Send email or notifications
- Process payments
- Read configuration
- Write logs
- Use a clock or random-number generator
- Interact with files, queues, or caches
- Need different implementations in tests

Pure, deterministic helpers often do not need injection unless their behavior genuinely varies.

## Quick Decision Guide

1. Does this class or function need another service to work?
   Pass that dependency from outside.
2. Is the dependency required for the object's entire lifetime?
   Prefer constructor injection.
3. Is it needed for only one call and changes per call?
   Consider method injection.
4. Is it a small operation rather than a stateful service?
   Consider injecting a function.
5. Are many unrelated dependencies required?
   Recheck whether the class has too many responsibilities.

## Interview Answer

Dependency injection means supplying an object's dependencies from the outside instead of creating them inside the object. For example, a `UserService` can receive a repository through its constructor. This reduces coupling, makes dependencies explicit, allows implementations to be replaced, and makes unit testing easier with in-memory repositories or test doubles. In JavaScript, DI can be implemented manually with constructors, factory functions, method parameters, and a composition root; a framework is not required.
