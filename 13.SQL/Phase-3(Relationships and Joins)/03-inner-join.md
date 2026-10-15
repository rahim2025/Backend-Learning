# INNER JOIN

## What it does
Returns **only** the rows that have a matching row on both sides of the join condition. Any row from either table with no match is excluded entirely.

```sql
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON orders.user_id = users.id;
-- `INNER` is optional — plain `JOIN` means INNER JOIN by default
```

## Returning only matching rows
```
users:                  orders:
id | name               id | user_id | total
1  | Rahim              1  | 1       | 20
2  | Akter              2  | 1       | 30
3  | Nadia              3  | 99      | 15    <- user_id 99 doesn't exist in users

INNER JOIN result:
name  | total
Rahim | 20
Rahim | 30
-- Nadia is missing (no matching order)
-- the order with user_id=99 is missing (no matching user)
```
- Both "orphan" sides disappear — a user with zero orders, and an order with a non-existent user, are both silently dropped.
- This is the #1 cause of "missing rows" bugs — see [[13-join-mistakes-and-debugging]].

## Joining related tables through foreign keys
The join condition should almost always be the actual FK relationship:
```sql
SELECT o.id, o.total, u.name
FROM orders o
INNER JOIN users u ON o.user_id = u.id;    -- matches orders.user_id -> users.id (the real FK link)
```

## Using table aliases correctly
```sql
SELECT o.id, o.total, u.name AS customer_name
FROM orders AS o
INNER JOIN users AS u ON o.user_id = u.id
WHERE u.country = 'BD';
```
- Give each table a short alias (`o`, `u`) once more than one table is in play — this avoids ambiguous column errors (`id` exists in both `orders` and `users`) and keeps the query readable.
- **Use the alias consistently everywhere** — in `SELECT`, `ON`, and `WHERE` — once defined, the original table name can no longer be used in that query.
```sql
-- ❌ inconsistent — mixes alias `o` with full name `orders`
SELECT o.total FROM orders o WHERE orders.status = 'completed';

-- ✅ consistent
SELECT o.total FROM orders o WHERE o.status = 'completed';
```

## Joining more than two tables
```sql
SELECT o.id, u.name, p.name AS product_name
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN order_items oi ON oi.order_id = o.id
INNER JOIN products p ON p.id = oi.product_id;
```
See [[06-multi-table-joins]] for more on chaining joins.

## When INNER JOIN is the right choice
Use `INNER JOIN` when you only care about rows that **definitely have a relationship on both sides** — e.g. "show me orders along with the customer who placed them" (an order with no valid customer isn't meaningful data to show anyway).

Use `LEFT JOIN` instead when the "no match" case is meaningful and should still appear — see [[04-left-join]].
