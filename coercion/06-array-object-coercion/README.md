# Array and Object Coercion

## Idea

When an object (including an array) is used where a **primitive** is required —
`+`, `==`, template literals, `<`, being used as an object key — JavaScript
runs `ToPrimitive` on it. For plain objects and arrays that almost always ends
up calling `toString()`, which produces some surprising strings.

## The strings objects turn into

```js
[].toString();        // ""              → empty array joins to nothing
[1, 2].toString();    // "1,2"           → Array.prototype.join(",")
[1, [2, 3]].toString();// "1,2,3"        → join is recursive
({}).toString();      // "[object Object]" → the default, unhelpful string
```

Arrays stringify by joining elements with commas. Plain objects stringify to the
literal text `"[object Object]"` because they do not define a useful
`toString()`.

## Why the `+` examples look strange

`+` between two objects: both are converted to primitives (strings here), then
concatenated as strings.

```js
[] + [];        // ""              → "" + ""
[] + {};        // "[object Object]" → "" + "[object Object]"
[1] + [2];      // "12"            → "1" + "2"
[1, 2] + [3, 4]; // "1,23,4"       → "1,2" + "3,4"
```

And in comparisons the same stringification happens first:

```js
[1, 2] == "1,2"; // true → [1,2] → "1,2", then "1,2" == "1,2"
[0] == false;    // true → false→0, [0]→"0"→0, then 0 == 0
```

## The `ToPrimitive` algorithm (for objects)

`ToPrimitive(obj, hint)` tries, in order:

1. `obj[Symbol.toPrimitive](hint)` if that method exists
   (see [`12-symbol-to-primitive`](../12-symbol-to-primitive/README.md))
2. then two of these, ordered by the **hint**:
   - hint `"string"` (template literals, `String()`): `toString()`, then `valueOf()`
   - hint `"number"` (`-`, `*`, unary `+`, `<`): `valueOf()`, then `toString()`
   - hint `"default"` (binary `+`, `==`): treated like `"number"` for normal objects
3. the first call that returns a **primitive** wins; if none do, `TypeError`.

Plain objects and arrays inherit a `valueOf()` that just returns the object
itself (not a primitive), so it is skipped and `toString()` is what actually
runs — which is why you keep seeing `""` and `"[object Object]"`.

## Backend takeaway

Never interpolate or concatenate a raw object/array from a request:
`` `id=${req.query.id}` `` becomes `"id=1,2,3"` if the client sent `id[]=1&id[]=2&id[]=3`.
Validate the shape (`Array.isArray`, `typeof`) before turning anything into a
string.
