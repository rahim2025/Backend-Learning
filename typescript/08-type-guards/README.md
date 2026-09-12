# Type Guards

A type guard is a function (or expression) whose return value tells TypeScript how to narrow a type, even across function boundaries.

Simple definition:

```txt
Type guard = a reusable check that TypeScript trusts to narrow a type
```

Built-in narrowing (`typeof`, `instanceof`, `in`) works inline, but a **custom type guard** lets you extract that check into a named, reusable function.

## Custom Type Guard with `is`

```ts
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

function makeSound(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow(); // narrowed to Cat
  } else {
    animal.bark(); // narrowed to Dog
  }
}
```

The `animal is Cat` return type is a **type predicate**. Without it, the function would just return `boolean`, and TypeScript would not narrow the type after calling it.

## Type Guard for Primitives

```ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  }
}
```

## Type Guard Using `in`

```ts
interface Admin {
  role: "admin";
  permissions: string[];
}

interface Guest {
  role: "guest";
}

function isAdmin(user: Admin | Guest): user is Admin {
  return "permissions" in user;
}
```

## Type Guard for Class Instances

```ts
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function handle(error: unknown) {
  if (isApiError(error)) {
    console.log(error.statusCode, error.message);
  }
}
```

## `Array.filter` with a Type Guard

Type guards help TypeScript narrow the element type when filtering.

```ts
const values: (string | null)[] = ["a", null, "b", null];

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

const strings: string[] = values.filter(isNotNull); // string[], not (string | null)[]
```

## Backend Example

```ts
interface ValidationError {
  field: string;
  message: string;
}

function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "field" in error &&
    "message" in error
  );
}

function handleRequestError(error: unknown) {
  if (isValidationError(error)) {
    console.log(`${error.field}: ${error.message}`);
  } else {
    console.log("Unknown error");
  }
}
```

## Common Mistakes

### Mistake 1: Forgetting the `is` predicate return type

```ts
function isCat(animal: Cat | Dog): boolean {
  return (animal as Cat).meow !== undefined;
}
// Calling isCat(animal) does NOT narrow the type, because it just returns boolean
```

### Mistake 2: Writing a type guard that lies

```ts
function isString(value: unknown): value is string {
  return true; // always true, breaks type safety even though it compiles
}
```

TypeScript trusts the predicate — it does not verify your check is actually correct.

### Mistake 3: Using type guards where simple `typeof`/`instanceof` narrowing is enough

Custom type guards are most valuable when the check is reused in multiple places or too complex for a single inline expression.

## Exercise

1. Write a type guard `isNumber(value: unknown): value is number`.
2. Given `interface Book { type: "book"; pages: number }` and `interface Movie { type: "movie"; duration: number }`, write a type guard `isBook(item: Book | Movie): item is Book`.
3. Write a type guard `hasMessage(error: unknown): error is { message: string }` that checks for an object with a `message` string property, then use it inside a `catch` block typed as `unknown`.

## Interview Answer

A type guard is a check that TypeScript can use to narrow a type, either built in (`typeof`, `instanceof`, `in`) or custom. A custom type guard is a function whose return type is a type predicate, written as `parameterName is SomeType`, instead of plain `boolean`. When such a function is called inside an `if` statement, TypeScript trusts the predicate and narrows the checked value to that type in the corresponding branch. Type guards are especially useful for validating `unknown` values (for example, values from `JSON.parse` or a `catch` block) and for filtering arrays while preserving a narrower element type.
