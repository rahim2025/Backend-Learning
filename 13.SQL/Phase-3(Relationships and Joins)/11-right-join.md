# RIGHT JOIN (RIGHT OUTER JOIN)

## What it does

The mirror image of `LEFT JOIN`: returns **all** rows from the **right** table, plus matching rows from the left table. Left-side columns become `NULL` for right rows with no match.

```sql
SELECT u.name, o.total
FROM orders o
RIGHT JOIN users u ON o.user_id = u.id;
-- preserves every row in `users` (the right table here), even with no matching order
```

## Preserving all rows from the right table

```
orders (left):           users (right):
id | user_id | total     id | name
1  | 1       | 20        1  | Rahim
2  | 1       | 30        2  | Akter
                          3  | Nadia   <- no orders

RIGHT JOIN result (orders RIGHT JOIN users):
name  | total
Rahim | 20
Rahim | 30
Akter | NULL
Nadia | NULL
```

## It can almost always be rewritten as a LEFT JOIN by swapping table order

```sql
-- RIGHT JOIN version
SELECT u.name, o.total
FROM orders o
RIGHT JOIN users u ON o.user_id = u.id;

-- equivalent LEFT JOIN version — just swap FROM and JOIN table order
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
```

- Both produce **identical results** — `A RIGHT JOIN B` ≡ `B LEFT JOIN A` (with the same `ON` condition).

## Why LEFT JOIN is generally preferred in practice

- **Readability**: most people scan a query top-to-bottom, left-to-right — `FROM users LEFT JOIN orders` reads naturally as "start with users, optionally bring in orders." A `RIGHT JOIN` forces the reader to mentally flip the relationship.
- **Consistency**: if a codebase standardizes on always using `LEFT JOIN` (rewriting any `RIGHT JOIN` need by swapping table order), every join in the query behaves predictably in the same "direction," making multi-join queries easier to reason about.
- `RIGHT JOIN` isn't wrong or deprecated — it's just rarely the clearest choice when a `LEFT JOIN` rewrite is just as easy.

## When RIGHT JOIN might still show up

- Porting/mirroring a query written by someone else without wanting to restructure it.
- A multi-join chain where, order-wise, flipping to `LEFT JOIN` would require reordering several other joins too (in that specific spot, `RIGHT JOIN` can be the smaller, more local change).

See also: [[04-left-join]], [[12-full-outer-join]]
