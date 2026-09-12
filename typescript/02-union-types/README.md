# Union Types

A union type allows a value to be one of several types.

Simple definition:

```txt
Union type = "this value can be type A OR type B OR type C"
```

## Basic Syntax

```ts
let id: string | number;

id = 101;
id = "ABC101";
// id = true; // Error
```

## Union in Function Parameters

```ts
function printId(id: string | number) {
  console.log(`ID: ${id}`);
}

printId(101);
printId("A101");
```

## Only Shared Members Are Accessible

Without narrowing, you can only use members that exist on every type in the union.

```ts
function formatValue(value: string | number) {
  console.log(value.toFixed(2)); // Error: toFixed does not exist on string
}
```

You must narrow the type first (see [type narrowing](../07-type-narrowing/README.md)):

```ts
function formatValue(value: string | number) {
  if (typeof value === "number") {
    console.log(value.toFixed(2));
  } else {
    console.log(value.toUpperCase());
  }
}
```

## Union of Object Types

```ts
type SuccessResponse = {
  status: "success";
  data: string[];
};

type ErrorResponse = {
  status: "error";
  message: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;
```

This pattern is the foundation of [discriminated unions](../13-discriminated-unions/README.md).

## Union of Arrays

```ts
type StringOrNumberArray = string[] | number[];

const values: StringOrNumberArray = [1, 2, 3];
```

## Backend Example

```ts
type UserId = string | number;

function findUser(id: UserId) {
  if (typeof id === "number") {
    return db.users.findByNumericId(id);
  }
  return db.users.findByUuid(id);
}
```

## Common Mistakes

### Mistake 1: Assuming a union has every property of every member

```ts
type A = { a: string };
type B = { b: number };

function useAB(value: A | B) {
  console.log(value.a); // Error: 'a' does not exist on type 'B'
}
```

Only properties common to all members are safe without narrowing.

### Mistake 2: Confusing union with intersection

```ts
type Combined = A & B; // must satisfy BOTH shapes
type Either = A | B;   // must satisfy AT LEAST ONE shape
```

### Mistake 3: Widening a union too much

```ts
function process(value: any) {} // loses all type safety

function process(value: string | number) {} // precise and safe
```

## Exercise

1. Write a type `Id = string | number` and a function `logId(id: Id)` that prints the id.
2. Write a union type `Theme = "light" | "dark" | "system"` and a function `applyTheme(theme: Theme)` that only accepts those three values.
3. Create two object types, `Circle { kind: "circle"; radius: number }` and `Square { kind: "square"; side: number }`, then a union type `Shape = Circle | Square`. Write a function `describe(shape: Shape)` that returns a string describing the shape (you will need narrowing — try it even before reading that topic).

## Interview Answer

A union type describes a value that can be one of several specified types, written with the `|` operator, for example `string | number`. When working with a union, TypeScript only allows access to members shared by every type in the union until the code narrows the type down (with `typeof`, `in`, equality checks, or a type guard). Unions are commonly used for function parameters that accept multiple types, for modeling a fixed set of string values, and as the basis for discriminated unions that model different variants of a response or event.

## exercise answer 

```ts 

type ID = string | number ;

function checkID(id:ID):void {
  console.log(id)
}

checkID(20)

type Circle = {
  kind:"circle";
  radius: number
}
type Squre = {
  kind:"squre",
  side : number
}

type Shape = Circle | Squre ;

function describe(shape:Shape):void {
  if(shape.kind === "circle"){
    console.log("This is A circle");
  }
  else if (shape.kind === "squre" ){
    console.log("This is a squre");
  }
} 

const squre1:Squre = {
  kind:"squre",
  side : 20
}
describe(squre1)

```