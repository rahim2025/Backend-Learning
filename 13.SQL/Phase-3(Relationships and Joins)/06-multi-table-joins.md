# Multi-Table Joins

Real queries often need data spread across three, four, or more tables. Joins chain together — each new `JOIN` connects to any table already brought into the query, not just the original `FROM` table.

## Chaining joins
```sql
SELECT
    o.id AS order_id,
    u.name AS customer,
    p.name AS product_name,
    oi.quantity
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id;
```
- `o` connects to `u` (orders belong to a user).
- `oi` connects to `o` (order items belong to an order).
- `p` connects to `oi` (order items reference a product).
- Each `JOIN`'s `ON` clause can reference **any** alias already introduced earlier in the query, not just the immediately preceding table.

## Building multi-table joins incrementally (recommended approach)
Don't write the whole thing at once — build and verify one join at a time:
```sql
-- step 1: confirm the base table
SELECT * FROM orders o;

-- step 2: add the first join, check row count/content makes sense
SELECT * FROM orders o JOIN users u ON u.id = o.user_id;

-- step 3: add the next join
SELECT * FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id;

-- ...continue until all tables are joined, then trim SELECT down to needed columns
```
This habit catches [[13-join-mistakes-and-debugging|join mistakes]] early, before they're buried under several joins.

## Mixing JOIN types in one query
```sql
SELECT u.name, o.id AS order_id, pr.bio
FROM users u
LEFT JOIN orders o ON o.user_id = u.id        -- keep users even with no orders
LEFT JOIN user_profiles pr ON pr.user_id = u.id -- keep users even with no profile
WHERE u.country = 'BD';
```
- Each join's type (`INNER`/`LEFT`/etc.) is decided independently, based on whether losing unmatched rows at *that* step is acceptable.
- Order of joins in the SQL text doesn't have to reflect a "path" — but it usually reads more clearly when it does.

## A subtlety: LEFT JOIN followed by INNER JOIN
```sql
SELECT u.name, o.id, oi.quantity
FROM users u
LEFT JOIN orders o ON o.user_id = u.id          -- preserve users with no orders...
JOIN order_items oi ON oi.order_id = o.id;        -- ...but this INNER JOIN drops them again!
```
- If `o.id` is `NULL` (user had no orders), the second `JOIN`'s condition `oi.order_id = o.id` can never match anything (`oi.order_id = NULL` is never true) — so that user silently disappears anyway, undoing the point of the earlier `LEFT JOIN`.
- Fix: make the second join a `LEFT JOIN` too, if you genuinely want to preserve those rows:
```sql
SELECT u.name, o.id, oi.quantity
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
LEFT JOIN order_items oi ON oi.order_id = o.id;
```

See also: [[09-many-to-many-joins-traversal]], [[14-row-multiplication]]
