# FULL OUTER JOIN

## What it conceptually does

Returns **all** rows from **both** tables — matching rows combined where possible, plus unmatched rows from the left (with right columns `NULL`), plus unmatched rows from the right (with left columns `NULL`).

Conceptually: `FULL OUTER JOIN` = `LEFT JOIN` rows + `RIGHT JOIN` rows, combined, with duplicates (the actually-matched rows) counted once.

```
users:                  orders:
id | name               id | user_id | total
1  | Rahim              1  | 1       | 20
2  | Akter              2  | 99      | 15   <- no matching user

FULL OUTER JOIN result (conceptually):
name  | total
Rahim | 20        <- matched
Akter | NULL      <- unmatched left (user with no order)
NULL  | 15        <- unmatched right (order with no valid user)
```

## MySQL does not support FULL OUTER JOIN directly

Standard SQL defines `FULL OUTER JOIN`, and databases like PostgreSQL and SQL Server support it natively — but **MySQL has no `FULL OUTER JOIN` keyword**. Running one in MySQL is a syntax error.

## Workaround: LEFT JOIN + RIGHT JOIN + UNION

Simulate it by combining a `LEFT JOIN` (catches matched rows + unmatched left rows) with a `RIGHT JOIN` (catches unmatched right rows), and `UNION` them together:

```sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id

UNION

SELECT u.name, o.total
FROM users u
RIGHT JOIN orders o ON o.user_id = u.id;
```

- `UNION` (not `UNION ALL`) automatically removes duplicate rows — since the matched rows appear in **both** the `LEFT JOIN` and `RIGHT JOIN` results, `UNION`'s deduplication is exactly what collapses them back down to one copy each.
- If you used `UNION ALL` instead, matched rows would appear twice — not what you want for a true full-outer-join simulation.

### Equivalent, sometimes clearer version using LEFT JOIN twice

```sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id

UNION

SELECT u.name, o.total
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;
```

- Both halves use `LEFT JOIN`, just starting from different tables — this works because `A RIGHT JOIN B` ≡ `B LEFT JOIN A` (see [[11-right-join]]).

## When you'd actually want this

- Reconciliation-style queries: "show me every user and every order, matched where possible, and flag anything on either side with no counterpart" — e.g. finding users with no orders **and** orders with a broken/missing user reference, in a single result set.

See also: [[04-left-join]], [[11-right-join]], [[05-anti-join-pattern]]
