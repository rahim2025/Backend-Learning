# Object-Oriented Programming in JavaScript

This chapter contains notes about object-oriented programming (OOP), factory functions, constructor functions, prototypes, classes, and encapsulation in JavaScript.

JavaScript is a prototype-based language. It can still use familiar OOP ideas such as objects, encapsulation, inheritance, and polymorphism, but it implements inheritance through prototypes.

## Topics

1. [What Is OOP?](01-what-is-oop/README.md)
2. [Factory Functions](02-factory-functions/README.md)
3. [Constructor Functions](03-constructor-functions/README.md)
4. [Prototypes](04-prototypes/README.md)
5. [Classes](05-classes/README.md)
6. [Encapsulation](06-encapsulation/README.md)
7. [Inheritance, `super`, and Method Overriding](07-inheritance-super-method-overriding/README.md)
8. [Polymorphism](08-polymorphism/README.md)
9. [Abstraction](09-abstraction/README.md)
10. [Composition](10-composition/README.md)
11. [Polymorphism with Composition](11-polymorphism-with-composition/README.md)
12. [Static Methods and Instance Methods](12-static-and-instance-methods/README.md)
13. [Dependency Injection](13-dependency-injection/README.md)

## The Main Idea

Suppose an application needs many user objects. Creating each object manually repeats code:

```js
const user1 = {
  name: "Rahim",
  login() {
    console.log(`${this.name} logged in`);
  },
};

const user2 = {
  name: "Karim",
  login() {
    console.log(`${this.name} logged in`);
  },
};
```

Object-creation patterns solve this repetition:

- A **factory function** creates and returns an object.
- A **constructor function** works with `new` to create an object.
- A **prototype** lets objects share properties and methods.
- A **class** provides cleaner syntax for creating objects and sharing methods.
- **Encapsulation** protects internal data and exposes controlled operations.

## Quick Comparison

| Feature | Factory function | Constructor function |
| --- | --- | --- |
| Called with `new` | No | Yes |
| Returns object explicitly | Usually yes | Usually no |
| Naming convention | camelCase | PascalCase |
| Uses `this` | Optional | Usually yes |
| Shared methods | Can use a shared object | Usually placed on `.prototype` |

## Interview Summary

OOP organizes programs around objects that contain data and behavior. In JavaScript, factory functions, constructor functions, and classes can create multiple similar objects. Classes provide cleaner syntax over JavaScript's prototype system. Encapsulation keeps internal state protected and allows it to be accessed or changed through a controlled public interface.
