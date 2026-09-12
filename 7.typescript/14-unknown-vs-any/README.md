# unknown vs any

Both `any` and `unknown` can hold a value of any type, but they behave very differently once you try to use that value.

Simple definition:

```txt
any     = "turn off type checking for this value"
unknown = "this value could be anything, but you must check its type before using it"
```

## `any` Disables Type Checking

```ts
let value: any = "hello";

value.toUpperCase(); // OK
value();             // OK, no error, but will crash at runtime
value.foo.bar.baz;   // OK, no error, but will crash at runtime
```

`any` is assignable to and from anything, essentially opting out of TypeScript's safety for that value.

## `unknown` Requires a Check First

```ts
let value: unknown = "hello";

value.toUpperCase(); // Error: Object is of type 'unknown'
```

You must narrow it first:

```ts
if (typeof value === "string") {
  value.toUpperCase(); // OK, narrowed to string
}
```

## Both Accept Any Value

```ts
let a: any = 42;
let u: unknown = 42;

a = "string";   // OK
u = "string";   // OK
```

The difference is what happens when you try to *use* the value afterward.

## Assignability Differs

```ts
let a: any = "hello";
let u: unknown = "hello";

let str1: string = a; // OK, 'any' is assignable to anything
let str2: string = u; // Error: 'unknown' is not assignable to 'string'
```

`any` can be assigned to any other type without a check. `unknown` cannot, until narrowed.

## Typical Use Case: External / Untrusted Data

```ts
async function fetchData(): Promise<unknown> {
  const response = await fetch("/api/data");
  return response.json(); // the shape isn't known yet
}

async function run() {
  const data = await fetchData();

  if (typeof data === "object" && data !== null && "id" in data) {
    console.log((data as { id: number }).id);
  }
}
```

## Typical Use Case: `catch` Blocks

In modern TypeScript, caught errors are typed `unknown` by default.

```ts
try {
  riskyOperation();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("Unknown error", error);
  }
}
```

## Backend Example

```ts
function parseJsonSafely(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}

const parsed = parseJsonSafely('{"id":1,"name":"Rahim"}');

if (isUser(parsed)) {
  console.log(parsed.name); // safely typed as User
}
```

## Quick Comparison

| Aspect | `any` | `unknown` |
| --- | --- | --- |
| Can hold any value | Yes | Yes |
| Can be used without checking | Yes (unsafe) | No (must narrow first) |
| Assignable to other types directly | Yes | No |
| Type safety | None | Full, once narrowed |
| Best for | Rare escape hatches, legacy migration | External data, `catch` blocks, generic APIs |

## Common Mistakes

### Mistake 1: Reaching for `any` out of convenience

```ts
function handle(data: any) {} // disables checking entirely
function handle(data: unknown) {} // forces safe handling
```

### Mistake 2: Overusing type assertions to bypass `unknown`

```ts
const data: unknown = fetchSomething();
console.log((data as any).name); // defeats the purpose of unknown
```

Prefer a real type guard (see [type guards](../08-type-guards/README.md)) over casting through `any`.

### Mistake 3: Thinking `unknown` is the same as `object`

`unknown` can hold primitives, `null`, `undefined`, functions, and objects. `object` excludes primitives.

## Exercise

1. Write a function `logValue(value: unknown)` that prints the value's type using `typeof`, then safely calls `.toUpperCase()` only if it's a string.
2. Rewrite a function currently typed as `function process(data: any)` to use `unknown` instead, adding whatever narrowing is needed to keep the function working.
3. Write a `catch` block that treats the caught value as `unknown`, checks `instanceof Error`, and falls back to `String(error)` otherwise.

## Interview Answer

Both `any` and `unknown` can represent a value of any type, but `any` disables type checking entirely — you can call methods, access properties, or reassign it to any other type without TypeScript complaining, which reintroduces the exact kind of runtime errors TypeScript is meant to prevent. `unknown` is the type-safe counterpart: a value typed `unknown` can hold anything, but TypeScript refuses to let you call methods on it, access its properties, or assign it to a more specific type until you narrow it with a `typeof` check, `instanceof`, or a custom type guard. `unknown` is the recommended type for values whose shape isn't known yet, such as data from `JSON.parse`, external APIs, or a `catch` block's caught error.
