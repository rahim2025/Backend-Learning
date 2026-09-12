# `var` Function Expression

With `var`, the variable is hoisted and initialized as `undefined`.

```js
hi(); // TypeError: hi is not a function

var hi = function () {
  console.log("Hi");
};
```

JavaScript treats it roughly like:

```js
var hi;

hi(); // TypeError

hi = function () {
  console.log("Hi");
};
```

The variable exists, but the function value has not been assigned yet.

So early calling is like:

```js
undefined(); // TypeError
```

## Interview Answer

A `var` function expression is not fully hoisted. The variable is hoisted as `undefined`, so calling it before assignment gives a `TypeError` because `undefined` is not a function.

