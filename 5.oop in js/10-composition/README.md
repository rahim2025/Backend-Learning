# Composition in JavaScript

Composition means building an object or feature by combining smaller, focused parts.

Instead of inheriting all behavior from a parent class, an object receives or uses the exact capabilities it needs.

```txt
Inheritance: Admin is a User
Composition: UserService has a Repository and a Logger
```

## Simple Example

```js
const canEat = {
  eat() {
    console.log(`${this.name} is eating`);
  },
};

const canWalk = {
  walk() {
    console.log(`${this.name} is walking`);
  },
};

const person = {
  name: "Rahim",
  ...canEat,
  ...canWalk,
};

person.eat();
person.walk();
```

The `person` object is composed from two small behavior objects instead of inheriting from a large parent class.

## Why Use Composition?

Composition can help:

- Reuse small pieces of behavior
- Avoid deep inheritance chains
- Give each object only the capabilities it needs
- Replace dependencies without rewriting the main object
- Make unit testing easier
- Keep responsibilities focused
- Change behavior at runtime when appropriate

## The "Has-A" Relationship

Composition commonly represents a **has-a** relationship.

```js
class Engine {
  start() {
    console.log("Engine started");
  }
}

class Car {
  constructor(engine) {
    this.engine = engine;
  }

  start() {
    this.engine.start();
    console.log("Car is ready");
  }
}

const car = new Car(new Engine());
car.start();
```

A car **has an** engine. A car is not a specialized type of engine, so composition describes this relationship more accurately than inheritance.

## Composition Through Dependency Injection

Dependency injection means giving an object its dependencies from outside rather than constructing them internally.

```js
class UserService {
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async createUser(data) {
    const user = await this.userRepository.create(data);
    this.logger.info(`Created user ${user.id}`);
    return user;
  }
}
```

`UserService` is composed with a repository and a logger.

```js
const userService = new UserService(
  postgresUserRepository,
  applicationLogger
);
```

The service coordinates these objects but does not need to know their internal implementations.

## Tightly Coupled Version

Creating dependencies inside a class tightly connects it to concrete implementations:

```js
class UserService {
  constructor() {
    this.userRepository = new PostgreSQLUserRepository();
    this.logger = new FileLogger();
  }
}
```

This makes it harder to:

- Use another database
- Change the logging system
- Test without real external services
- Reuse the service in another environment

Passing the dependencies into the constructor keeps the parts replaceable.

## Replacing Composed Parts

Different implementations can be supplied without changing `UserService`:

```js
const productionService = new UserService(
  postgresUserRepository,
  productionLogger
);

const testService = new UserService(
  memoryUserRepository,
  silentLogger
);
```

This works well with polymorphism: each repository provides the same expected operations, but implements them differently.

## Testing with Composition

Composition makes dependencies easy to replace with test doubles.

```js
const fakeRepository = {
  async create(data) {
    return { id: 1, ...data };
  },
};

const messages = [];

const fakeLogger = {
  info(message) {
    messages.push(message);
  },
};

const service = new UserService(fakeRepository, fakeLogger);

const user = await service.createUser({ name: "Rahim" });

console.log(user.id);     // 1
console.log(messages[0]); // "Created user 1"
```

The test does not require a real database or logging service.

## Composing Behaviors with Factory Functions

Factory functions can combine small behavior functions.

```js
function canLogin(state) {
  return {
    login() {
      console.log(`${state.name} logged in`);
    },
  };
}

function canManageUsers(state) {
  return {
    deleteUser(userId) {
      console.log(`${state.name} deleted user ${userId}`);
    },
  };
}

function createAdmin(name) {
  const state = { name };

  return {
    ...state,
    ...canLogin(state),
    ...canManageUsers(state),
  };
}

const admin = createAdmin("Ayesha");

admin.login();
admin.deleteUser(5);
```

The admin receives only the behaviors selected by `createAdmin()`.

## Different Objects, Different Capabilities

Composition avoids forcing unrelated objects into one inheritance hierarchy.

```js
function canPublish(state) {
  return {
    publish(content) {
      console.log(`${state.name} published: ${content}`);
    },
  };
}

function canModerate(state) {
  return {
    removePost(postId) {
      console.log(`${state.name} removed post ${postId}`);
    },
  };
}

function createAuthor(name) {
  const state = { name };
  return { ...state, ...canPublish(state) };
}

function createModerator(name) {
  const state = { name };
  return { ...state, ...canModerate(state) };
}

function createAdmin(name) {
  const state = { name };
  return {
    ...state,
    ...canPublish(state),
    ...canModerate(state),
  };
}
```

Each object receives the combination of capabilities it actually needs.

## Composition Through Delegation

An object can expose a high-level operation and delegate parts of the work to its composed dependencies.

```js
class OrderService {
  constructor(paymentService, inventoryService, emailService) {
    this.paymentService = paymentService;
    this.inventoryService = inventoryService;
    this.emailService = emailService;
  }

  async placeOrder(order) {
    await this.inventoryService.reserve(order.items);
    const payment = await this.paymentService.pay(order.total);
    await this.emailService.sendConfirmation(order.customerEmail);

    return {
      orderId: order.id,
      paymentId: payment.id,
      status: "confirmed",
    };
  }
}
```

`OrderService` does not implement inventory, payment, or email behavior itself. It composes those services into one order workflow.

## Function Composition

Composition also applies to functions. The output of one function can become the input of another.

```js
const trim = (value) => value.trim();
const toLowerCase = (value) => value.toLowerCase();
const removeSpaces = (value) => value.replaceAll(" ", "-");

function createSlug(title) {
  return removeSpaces(toLowerCase(trim(title)));
}

console.log(createSlug("  JavaScript Composition  "));
// "javascript-composition"
```

Each function has one small responsibility. `createSlug()` combines them into a larger operation.

## Composition vs Inheritance

| Composition | Inheritance |
| --- | --- |
| Represents a has-a relationship | Represents an is-a relationship |
| Combines separate objects or behaviors | Extends a parent class |
| Dependencies can be replaced easily | Behavior is tied to the class hierarchy |
| Can select specific capabilities | Inherits the parent's available behavior |
| Often easier to test in isolation | May require constructing a hierarchy |
| Avoids deep class trees | Can create deep inheritance chains |

Inheritance example:

```js
class User {}
class Admin extends User {}
```

An admin **is a** user.

Composition example:

```js
class UserService {
  constructor(repository) {
    this.repository = repository;
  }
}
```

A user service **has a** repository.

## Favor Composition over Inheritance

"Favor composition over inheritance" means composition is often the better default for reusing behavior, not that inheritance must never be used.

Use inheritance when:

- The child is genuinely a specialized form of the parent
- The hierarchy is shallow and stable
- Child objects should follow the complete parent contract

Use composition when:

- An object needs help from another object
- Behaviors should be mixed in different combinations
- Dependencies may need to be replaced
- The relationship is has-a rather than is-a
- Inheritance would expose behavior the child does not need

## Problem with Deep Inheritance

```txt
Entity
  -> User
      -> Employee
          -> Manager
              -> RegionalManager
```

Deep hierarchies can make behavior difficult to trace. A change in a base class may affect every descendant, and child classes may inherit methods that do not fit them.

Composition keeps relationships more explicit:

```js
const manager = new Manager(
  employeeRepository,
  reportingService,
  approvalPolicy
);
```

The required capabilities are visible where the object is created.

## Method Name Collisions

Spreading behavior objects can silently overwrite methods with the same name.

```js
const canRead = {
  run() {
    console.log("Reading");
  },
};

const canWrite = {
  run() {
    console.log("Writing");
  },
};

const worker = {
  ...canRead,
  ...canWrite,
};

worker.run(); // "Writing"
```

The later property replaces the earlier one. Prefer specific method names or explicit delegation when collisions are possible.

```js
const worker = {
  read: canRead.run,
  write: canWrite.run,
};
```

## Avoid Shared Mutable State

Be careful when multiple composed objects share a mutable object.

```js
const sharedState = { count: 0 };

const first = { state: sharedState };
const second = { state: sharedState };

first.state.count++;

console.log(second.state.count); // 1
```

Sharing state may be intentional, but accidental sharing can create surprising bugs. Create separate state for each instance unless the data truly belongs to all of them.

## Common Mistakes

### Creating Dependencies Internally

```js
class OrderService {
  constructor() {
    this.paymentService = new StripePaymentService();
  }
}
```

This hides the dependency and makes replacement difficult. Pass it from outside:

```js
class OrderService {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }
}
```

### Building One Large Dependency Object

Composition works best with focused parts. Injecting one object that performs database access, logging, email, validation, and payments simply moves a large responsibility elsewhere.

### Exposing Dependency Details

The composing object should expose meaningful operations instead of forcing callers to coordinate all of its dependencies.

```js
await orderService.placeOrder(order);
```

is usually clearer than making the controller manually call inventory, payment, and email services in the correct order.

### Using Composition Everywhere

Composition has a cost: more objects must be created and connected. A small class with one stable responsibility may not need several injected collaborators.

## How Composition Connects to Other OOP Concepts

| Concept | Connection to composition |
| --- | --- |
| Abstraction | Dependencies expose small interfaces and hide implementation details |
| Encapsulation | Each composed object controls its own internal state |
| Polymorphism | Different dependency implementations can provide the same operation |
| Inheritance | An alternative way to reuse behavior through an is-a relationship |

These concepts often work together. A service can be composed from encapsulated objects that expose abstract interfaces and are replaceable through polymorphism.

## Interview Answer

Composition means building an object or feature by combining smaller objects or behaviors. It usually represents a has-a relationship, such as a service having a repository and a logger. Composition keeps dependencies replaceable, improves testing, and avoids deep inheritance hierarchies. In JavaScript, it can be implemented with dependency injection, object delegation, factory functions, behavior objects, or function composition.
