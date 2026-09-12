# Temporal Dead Zone

TDZ means Temporal Dead Zone.

The variable exists, but you cannot access it before the declaration line.

```js
{
  console.log(age); // ReferenceError
  let age = 20;
}
```

## How TDZ Works

```js
{
  // TDZ starts

  let age = 20; // TDZ ends

  console.log(age); // 20
}
```

`let` and `const` have TDZ.

```js
{
  console.log(name); // ReferenceError
  const name = "Rahim";
}
```

## Why TDZ Exists

TDZ helps catch bugs. It prevents code from accidentally using a variable before it is properly initialized.

## Interview Answer

TDZ is the time between entering a block and reaching a `let` or `const` declaration. During that time, the variable exists but cannot be accessed, so JavaScript throws a `ReferenceError`.

