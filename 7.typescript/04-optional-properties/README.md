# Optional Properties

An optional property may or may not be present on an object.

Simple definition:

```txt
Optional property = a property that can be there or missing (marked with `?`)
```

## Basic Syntax

```ts
interface User {
  id: number;
  name: string;
  nickname?: string;
}

const user1: User = { id: 1, name: "Rahim" };
const user2: User = { id: 2, name: "Karim", nickname: "K" };
```

`nickname` can be omitted entirely without an error.

## Optional Property Type Includes `undefined`

```ts
interface User {
  nickname?: string;
}

function greet(user: User) {
  console.log(user.nickname.toUpperCase()); // Error: nickname may be undefined
}
```

You must check for `undefined` first:

```ts
function greet(user: User) {
  if (user.nickname) {
    console.log(user.nickname.toUpperCase());
  }
}
```

## Optional Parameters in Functions

```ts
function createUser(name: string, age?: number) {
  console.log(name, age ?? "age not provided");
}

createUser("Rahim");
createUser("Karim", 25);
```

Optional parameters must come after required parameters.

```ts
function invalid(age?: number, name: string) {} // Error
```

## Optional Chaining with Optional Properties

```ts
interface Profile {
  address?: {
    city: string;
  };
}

function getCity(profile: Profile) {
  return profile.address?.city ?? "Unknown";
}
```

## Optional vs `| undefined`

```ts
interface A {
  value?: number;        // property can be omitted
}

interface B {
  value: number | undefined; // property must be present, but can be undefined
}

const a: A = {};              // OK, value omitted
const b: B = { value: undefined }; // OK, but must include the key
const b2: B = {};             // Error, 'value' is missing
```

## Backend Example

```ts
interface CreateUserDto {
  email: string;
  password: string;
  referralCode?: string;
}

function createUser(dto: CreateUserDto) {
  const referral = dto.referralCode ?? "none";
  console.log(`Creating user ${dto.email}, referral: ${referral}`);
}

createUser({ email: "a@test.com", password: "secret123" });
```

## Common Mistakes

### Mistake 1: Forgetting the value could be `undefined`

```ts
interface Options {
  timeout?: number;
}

function run(options: Options) {
  setTimeout(() => {}, options.timeout * 2); // Error: possibly undefined
}
```

### Mistake 2: Confusing optional properties with nullable properties

`nickname?: string` allows the key to be missing or `undefined`, but not automatically `null`, unless `null` is included in the type: `nickname?: string | null`.

### Mistake 3: Making everything optional "just in case"

Overusing `?` weakens type safety and pushes `undefined` checks everywhere. Only mark a property optional when it is genuinely allowed to be missing.

## Exercise

1. Define an `interface Product { id: number; name: string; discount?: number }` and write a function `finalPrice(price: number, product: Product): number` that applies the discount only if it exists.
2. Write a function `createSession(userId: number, expiresInMinutes?: number)` that defaults to 60 minutes when `expiresInMinutes` is not provided.
3. Explain, in your own words, the difference between `value?: number` and `value: number | undefined` on an interface, then write one example object for each that would fail to compile for the other.

## Interview Answer

An optional property, marked with `?` after its name, may be omitted from an object entirely. Its type is implicitly a union with `undefined`, so accessing it without a check can produce a compile error if used unsafely, for example calling a string method on it directly. Optional parameters in functions work the same way and must be declared after all required parameters. Optional is different from nullable: `value?: number` allows the key to be missing, while `value: number | undefined` requires the key to be present but allows its value to be `undefined`.
