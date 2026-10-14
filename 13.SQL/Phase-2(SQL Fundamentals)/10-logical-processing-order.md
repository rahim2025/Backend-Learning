# Logical Processing Order of a SQL Query

This is one of the most important mental models in SQL: **the order you *write* a query is not the order the database actually *executes* it.**

## Written order (how you type it)
```sql
SELECT ...
FROM ...
JOIN ...
WHERE ...
GROUP BY ...
HAVING ...
ORDER BY ...
LIMIT ...
```

## Logical execution order (how the database evaluates it)
```
1. FROM        — identify the source table(s)
2. JOIN        — combine with other tables
3. WHERE       — filter individual rows
4. GROUP BY    — collapse rows into groups
5. HAVING      — filter groups (after aggregation)
6. SELECT      — compute/pick the final columns (incl. aggregates, aliases)
7. ORDER BY    — sort the result set
8. LIMIT/OFFSET — trim to the requested page
```

## Why this order matters — it explains the "weird" rules

| Rule you've probably hit | Why it's true, given the order above |
|---|---|
| Can't use an aggregate in `WHERE` | `WHERE` (step 3) runs before `GROUP BY`/aggregation (step 4) — the aggregate doesn't exist yet |
| Must use `HAVING` for aggregate conditions | `HAVING` (step 5) runs after aggregation, so `SUM()`, `COUNT()`, etc. are available |
| Can't use a `SELECT` column alias in `WHERE` | `SELECT` (step 6) runs *after* `WHERE` (step 3) — the alias doesn't exist yet when `WHERE` is evaluated |
| *Can* use a `SELECT` alias in `ORDER BY` | `ORDER BY` (step 7) runs after `SELECT` (step 6), so the alias already exists |
| Every non-aggregated `SELECT` column must appear in `GROUP BY` | Grouping (step 4) happens before column selection (step 6) — by the time `SELECT` runs, individual row values are already gone, only group-level data remains |
| `LIMIT` is applied last | It trims the already-sorted, already-filtered, already-aggregated final result — it doesn't affect how much work earlier steps do internally (though the optimizer may still short-circuit for efficiency) |

## Walkthrough example
```sql
SELECT user_id, SUM(total) AS total_spent
FROM orders
WHERE status = 'completed'
GROUP BY user_id
HAVING SUM(total) > 100
ORDER BY total_spent DESC
LIMIT 5;
```

Execution, step by step:
1. **FROM** `orders` — start with the full orders table.
2. **WHERE** `status = 'completed'` — throw away rows that aren't completed.
3. **GROUP BY** `user_id` — bundle remaining rows by user.
4. **HAVING** `SUM(total) > 100` — keep only groups whose total exceeds 100.
5. **SELECT** `user_id, SUM(total) AS total_spent` — compute the final output columns, assign the alias.
6. **ORDER BY** `total_spent DESC` — now the alias exists, sort by it.
7. **LIMIT 5** — return only the top 5 rows after sorting.

## Rule of thumb
> When a query doesn't behave the way you expect (an alias "not found", an aggregate "not allowed" somewhere), mentally re-run it in **logical order** (`FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`), not written order — the answer is almost always there.

See also: [[05-aliases]], [[09-having]], [[11-common-debugging-categories]]
