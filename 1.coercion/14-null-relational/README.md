# null Relational Comparison Trap

```js
null > 0; // false
null == 0; // false
null >= 0; // true
undefined >= 0; // false
```

Relational comparison converts `null` to `0`.

```js
Number(null); // 0
null >= 0; // true
```

Loose equality does not convert `null` to `0`.

```js
null == 0; // false
```

`undefined >= 0` is false because `Number(undefined)` is `NaN`.

