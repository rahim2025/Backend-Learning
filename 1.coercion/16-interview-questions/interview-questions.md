# JavaScript Type Coercion Interview Questions

## Q: Why is `[] == false` true?

Because loose equality performs coercion. `false` becomes `0`. The array `[]` is converted to a primitive. Its string form is `""`, and `Number("")` is `0`. So the comparison becomes `0 == 0`, which is true.

## Q: Why is `Boolean([])` true but `[] == false` also true?

Because they use different conversion rules. `Boolean([])` uses boolean context, where all objects are truthy. `[] == false` uses loose equality, where `[]` becomes `""`, then `0`, and `false` also becomes `0`.

## Q: Why is `null == undefined` true but `null == 0` false?

Loose equality has a special rule: `null` is loosely equal only to `undefined`. It is not loosely equal to `0`, `false`, or `""`.

## Q: Why is `null >= 0` true but `null == 0` false?

Relational comparison converts `null` to `0`, so `null >= 0` becomes `0 >= 0`. Loose equality uses a different algorithm, where `null` is only loosely equal to `undefined`.

## Q: Why should we avoid `if (!value)` in backend validation?

Because `!value` rejects all falsy values, including valid values like `0`. Backend validation needs to distinguish missing input, empty input, invalid numeric input, and valid zero.

## Q: What is the difference between `isNaN` and `Number.isNaN`?

`isNaN()` coerces first. `Number.isNaN()` does not coerce. For backend validation, convert explicitly with `Number()` and then check with `Number.isNaN()`.

## Q: What happens when object `valueOf` and `toString` both return objects?

JavaScript cannot convert the object to a primitive, so it throws `TypeError: Cannot convert object to primitive value`.

