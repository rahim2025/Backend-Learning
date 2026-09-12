# Function Typing

TypeScript lets you describe the parameter types, return type, and overall shape of a function.

Simple definition:

```txt
Function typing = describing what a function accepts and what it returns
```

## Typing Parameters and Return Value

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

If the return type is omitted, TypeScript infers it from the function body.

## Optional and Default Parameters

```ts
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}

function log(message: string, userId?: number): void {
  console.log(userId ? `[${userId}] ${message}` : message);
}
```

## Rest Parameters

```ts
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3); // 6
```

## Function Type Expressions

A function type describes only the shape (parameters and return type), useful for variables, parameters, and callbacks.

```ts
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (a, b) => a * b;

function calculate(a: number, b: number, operation: MathOperation): number {
  return operation(a, b);
}

calculate(2, 3, multiply); // 6
```

## Typing `void` vs `undefined`

`void` means "the return value should be ignored," while `undefined` means the function must explicitly return `undefined`.

```ts
function logMessage(message: string): void {
  console.log(message);
  // no return statement needed
}
```

## Function Overloads

Overloads let a function accept different parameter combinations with different, precise return types.

```ts
function parseInput(value: string): string[];
function parseInput(value: number): number;
function parseInput(value: string | number): string[] | number {
  if (typeof value === "string") {
    return value.split(",");
  }
  return value;
}

const a = parseInput("1,2,3"); // string[]
const b = parseInput(42);      // number
```

## `this` Parameter Typing

```ts
interface Button {
  label: string;
  onClick(this: Button): void;
}

const button: Button = {
  label: "Submit",
  onClick() {
    console.log(this.label);
  },
};
```

## Backend Example

```ts
type Middleware = (req: Request, res: Response, next: () => void) => void;

const logger: Middleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  return { id, name: "Rahim" };
}
```

## Common Mistakes

### Mistake 1: Typing a callback parameter as `any`

```ts
function onData(callback: (data: any) => void) {} // loses safety
function onData(callback: (data: string) => void) {} // precise
```

### Mistake 2: Confusing `void` return type with actually returning `undefined`

Both are usually fine to interchange for a value that's never used, but for strict return-type checks `undefined` requires an explicit `return undefined` or `return;`.

### Mistake 3: Not typing async function return values

```ts
async function getUser(id: number) {
  return { id, name: "Rahim" };
} // inferred as Promise<{ id: number; name: string }>, but explicit typing documents intent for larger codebases
```

## Exercise

1. Write a function `divide(a: number, b: number): number` that throws an `Error` if `b` is `0`.
2. Define a function type `Predicate<T> = (value: T) => boolean` (a small generic function type) and use it in a `filterArray` function that filters an array with a predicate.
3. Write two overload signatures for a function `wrapValue` so that `wrapValue(5)` returns `number[]` and `wrapValue("a")` returns `string[]`, then implement it.

## Interview Answer

Function typing in TypeScript means declaring the types of a function's parameters and its return type, either directly on a function declaration or as a separate function type used for variables and callback parameters, written as `(param: Type) => ReturnType`. TypeScript supports optional parameters, default parameters, rest parameters, and function overloads for functions that behave differently based on argument types. Typing functions precisely — instead of using `any` for callbacks or arguments — is what lets TypeScript catch incorrect calls and mismatched return values at compile time.
