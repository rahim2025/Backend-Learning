# Aggregates and Grouping (GROUP BY)

## Aggregate functions
Functions that take **many rows** and collapse them into a **single summary value**.

| Function | What it does | NULL behavior |
|---|---|---|
| `COUNT(*)` | Counts rows | Counts all rows, NULLs included |
| `COUNT(column)` | Counts non-NULL values in that column | Ignores NULLs |
| `SUM(column)` | Adds up values | Ignores NULLs |
| `AVG(column)` | Average of values | Ignores NULLs (NULLs excluded from both sum and count) |
| `MIN(column)` / `MAX(column)` | Smallest / largest value | Ignores NULLs |

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(middle_name) FROM users;      -- only rows where middle_name IS NOT NULL
SELECT AVG(price) FROM products;
SELECT MIN(created_at), MAX(created_at) FROM orders;
```

- Without `GROUP BY`, an aggregate collapses the **entire table** into one row of results.

## GROUP BY — aggregating per category
`GROUP BY` splits rows into **groups** sharing the same value(s) in specified column(s), then applies aggregate functions **per group** instead of across the whole table.

```sql
-- total spent, per user
SELECT user_id, SUM(total) AS total_spent
FROM orders
GROUP BY user_id;
```

```sql
-- number of orders and total spent, per user, per status
SELECT user_id, status, COUNT(*) AS order_count, SUM(total) AS total_spent
FROM orders
GROUP BY user_id, status;
```

### The golden rule of GROUP BY
Every column in `SELECT` must be either:
1. Listed in `GROUP BY`, or
2. Wrapped in an aggregate function.

```sql
-- ❌ invalid in strict SQL mode — `name` isn't grouped or aggregated
SELECT user_id, name, SUM(total)
FROM orders
GROUP BY user_id;

-- ✅ fix: either group by name too, or aggregate it (e.g. MAX(name))
SELECT user_id, MAX(name), SUM(total)
FROM orders
GROUP BY user_id;
```
(MySQL in non-strict mode may silently allow this and pick an arbitrary value — don't rely on that behavior.)

## GROUP BY with JOIN
```sql
SELECT u.name, COUNT(o.id) AS order_count, SUM(o.total) AS total_spent
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;
```

## Visualizing GROUP BY
```
orders table:
user_id | total
--------|------
1       | 20
1       | 30
2       | 50

GROUP BY user_id → SUM(total):
user_id | total
--------|------
1       | 50     (20 + 30)
2       | 50
```

See also: [[09-having]], [[10-logical-processing-order]]
