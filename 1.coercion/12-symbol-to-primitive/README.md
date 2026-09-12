# Symbol.toPrimitive

`Symbol.toPrimitive` lets an object control primitive conversion and has higher priority than `valueOf()` and `toString()`.

```js
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return 100;
    if (hint === "string") return "hello";
    return 50;
  },
  valueOf() {
    return 1;
  },
  toString() {
    return "2";
  }
};

+obj; // 100
String(obj); // "hello"
obj + 10; // 60
`${obj}`; // "hello"
obj * 2; // 200
```

| Expression | Hint | Result |
| --- | --- | --- |
| `+obj` | `"number"` | `100` |
| `String(obj)` | `"string"` | `"hello"` |
| `obj + 10` | `"default"` | `60` |
| `` `${obj}` `` | `"string"` | `"hello"` |
| `obj * 2` | `"number"` | `200` |

