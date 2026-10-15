# LEFT JOIN (LEFT OUTER JOIN)

## What it does
Returns **all** rows from the **left** table, plus matching rows from the right table. If a left row has no match on the right, it's still included — with `NULL` filled in for every right-side column.

```sql
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON orders.user_id = users.id;
-- `OUTER` is optional — `LEFT JOIN` already means LEFT OUTER JOIN
```

## Preserving all rows from the left table
```
users:                  orders:
id | name               id | user_id | total
1  | Rahim              1  | 1       | 20
2  | Akter              2  | 1       | 30
3  | Nadia              (no orders for Nadia)

LEFT JOIN result (users LEFT JOIN orders):
name  | total
Rahim | 20
Rahim | 30
Nadia | NULL      <- Nadia is preserved even with no matching order
```
- Compare to `INNER JOIN`, which would have dropped Nadia entirely — see [[03-inner-join]].

## Understanding NULL for unmatched right-side rows
Every column selected from the **right** table becomes `NULL` on rows where there was no match — not just one column, all of them.
```sql
SELECT u.name, o.id AS order_id, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
-- for Nadia: order_id = NULL, total = NULL
```
This is the basis of the **anti-join pattern** (finding rows with *no* match) — see [[05-anti-join-pattern]]:
```sql
SELECT u.name
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;   -- only users with ZERO orders
```
⚠️ Must check `IS NULL` on a column from the **right** table (like `o.id`) — checking a left-table column would never be NULL from the join itself.

## Choosing the correct table as the left table
The left/right choice is a direct translation of the business question — ask: **"which side's rows must I never lose, even without a match?"**

| Business question | Left table | Why |
|---|---|---|
| "List every user, with their orders if they have any" | `users` | Users without orders must still appear |
| "List every order, with user info if available" | `orders` | Orders are the thing we don't want to lose, even if the user was deleted (see FK deletion strategies) |
| "List every product, with its tags if tagged" | `products` | Untagged products should still show up |

```sql
-- "every user, even those with no orders"
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;

-- "every order, even if the user record is gone" (e.g. SET NULL on delete)
SELECT o.id, o.total, u.name
FROM orders o
LEFT JOIN users u ON u.id = o.user_id;
```
- Swapping which table is "left" **changes the meaning of the query**, not just the column order — always match it to the actual requirement, not habit.

See also: [[08-left-join-on-vs-where]], [[11-right-join]]
