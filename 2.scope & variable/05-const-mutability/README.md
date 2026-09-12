# `const` Does Not Mean Immutable

`const` prevents reassignment of the binding.

It does not make objects immutable.

```js
const user = { name: "Rahim" };

user.name = "Karim"; // allowed

user = {}; // TypeError
```

## Binding vs Value

The variable `user` is a binding.

The object `{ name: "Rahim" }` is the value.

`const` means the binding cannot point to a different value.

It does not prevent changes inside the object.

## Interview Sentence

> `const` prevents reassignment of the binding, not mutation of the object.

## Backend Example

```js
const config = {
  port: 3000,
  env: "development"
};

config.port = 5000; // allowed
config = {}; // TypeError
```

If you need to prevent object mutation, consider `Object.freeze()`.

```js
const config = Object.freeze({
  port: 3000
});
```

