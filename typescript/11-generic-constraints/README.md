# Generic Constraints

A generic constraint limits what types can be used for a type parameter, using `extends`.

Simple definition:

```txt
Generic constraint = "T can be any type, as long as it has at least this shape"
```

## The Problem Without a Constraint

```ts
function getLength<T>(value: T): number {
  return value.length; // Error: 'length' does not exist on type 'T'
}
```

TypeScript doesn't know `T` has a `length` property, because `T` could be anything.

## Basic Constraint with `extends`

```ts
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(value: T): number {
  return value.length;
}

getLength("hello");     // OK, strings have length
getLength([1, 2, 3]);   // OK, arrays have length
// getLength(42);       // Error: number does not have 'length'
```

## Constraining with `keyof`

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Rahim" };

getProperty(user, "name"); // OK
// getProperty(user, "age"); // Error: "age" is not a key of user
```

See [keyof](../09-keyof/README.md) for more on this pattern.

## Constraining to an Object Shape

```ts
interface Identifiable {
  id: number;
}

function printId<T extends Identifiable>(item: T): void {
  console.log(`ID: ${item.id}`);
}

printId({ id: 1, name: "Rahim" }); // OK, extra properties are fine
// printId({ name: "Rahim" });     // Error: missing 'id'
```

## Multiple Constraints

```ts
interface Named {
  name: string;
}

interface Aged {
  age: number;
}

function describe<T extends Named & Aged>(entity: T): string {
  return `${entity.name} is ${entity.age} years old`;
}
```

## Default Type with a Constraint

```ts
interface Entity {
  id: number;
}

interface Repository<T extends Entity = Entity> {
  findById(id: number): T | undefined;
}
```

## Backend Example

```ts
interface Timestamped {
  createdAt: Date;
}

function isRecent<T extends Timestamped>(item: T, days: number): boolean {
  const diff = Date.now() - item.createdAt.getTime();
  return diff < days * 24 * 60 * 60 * 1000;
}

isRecent({ createdAt: new Date(), title: "Post" }, 7); // OK
```

## Common Mistakes

### Mistake 1: Forgetting the constraint entirely and reaching for `any`

```ts
function getLength(value: any): number {
  return value.length; // compiles, but unsafe for values without 'length'
}
```

### Mistake 2: Over-constraining a generic to one concrete type

```ts
function getLength<T extends string>(value: T): number {
  return value.length; // now only strings work, defeating the purpose of a generic
}
```

If only one type is ever needed, a generic may not be necessary at all.

### Mistake 3: Confusing `T extends X` (constraint) with `T extends U ? A : B` (conditional type)

The `extends` keyword is reused for two different purposes in TypeScript: constraining a generic parameter, and writing conditional types.

## Exercise

1. Write a generic function `merge<T extends object, U extends object>(a: T, b: U): T & U` that merges two objects.
2. Write a generic function `getLast<T extends { length: number }>(value: T)` that returns the value's last index's meaning is unclear for generic `length`-only types — instead, constrain to arrays: `getLast<T>(items: T[]): T | undefined`, returning the last element.
3. Using `keyof`, write `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>` that returns a new object with only the selected keys.

## Interview Answer

A generic constraint restricts a type parameter to types that satisfy a given shape, written as `T extends SomeShape`. Without a constraint, TypeScript treats `T` as potentially any type and disallows accessing properties or methods it can't guarantee exist. Constraints are commonly combined with `keyof` to write safe, generic property-access functions (`K extends keyof T`), or with an interface to require a minimum shape, such as requiring an `id` field or a `length` property, while still allowing any type that satisfies that shape.
