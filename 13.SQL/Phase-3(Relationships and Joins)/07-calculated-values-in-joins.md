# Calculated Values in Joined Queries

Once multiple tables are joined, you can compute values **across** them in `SELECT` — not just pull raw columns.

## Basic calculated columns across joined tables

```sql
SELECT
    o.id AS order_id,
    oi.quantity,
    p.price,
    oi.quantity * p.price AS line_total      -- calculated from two different tables
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id;
```

- `line_total` doesn't exist as a stored column anywhere — it's derived at query time from `order_items.quantity` and `products.price`.

## Calculated values combined with aggregates

```sql
SELECT
    o.id AS order_id,
    SUM(oi.quantity * p.price) AS order_total
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
GROUP BY o.id;
```

- Each `order_items` row's line total is computed first, then summed per order — this is the standard way to compute an order's total from its line items rather than trusting a possibly stale stored `total` column.

## Using CASE for conditional calculated columns

```sql
SELECT
    u.name,
    o.total,
    CASE
        WHEN o.total > 100 THEN 'large'
        WHEN o.total > 20  THEN 'medium'
        ELSE 'small'
    END AS order_size
FROM users u
JOIN orders o ON o.user_id = u.id;
```

## Calculated columns and aliases — reminder

As with any `SELECT`-level alias, a calculated column's alias (`line_total`, `order_total`) **cannot** be reused in `WHERE` on the same query level — see [[05-aliases]] and [[10-logical-processing-order]] from Phase 2. It *can* be used in `ORDER BY`/`HAVING` (in MySQL) since those run later.

```sql
SELECT o.id, SUM(oi.quantity * p.price) AS order_total
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
GROUP BY o.id
HAVING order_total > 100       -- ✅ works, HAVING runs after the alias is computed
ORDER BY order_total DESC;     -- ✅ works
```

## Watch out: calculated values after row multiplication

If a join fans out rows (e.g. one order joined to multiple order_items), make sure the calculation is happening **per the correct row level** before any aggregation — otherwise sums/counts can be wrong. See [[14-row-multiplication]] and [[15-aggregation-problems-after-joins]].
