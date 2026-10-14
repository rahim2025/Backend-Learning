# HAVING

`HAVING` filters **groups** produced by `GROUP BY`, after aggregation has happened — this is the key difference from `WHERE`, which filters **individual rows**, before any grouping.

## Basic usage
```sql
-- only show users who have spent more than 100 in total
SELECT user_id, SUM(total) AS total_spent
FROM orders
GROUP BY user_id
HAVING SUM(total) > 100;
```

- You **can** reference an aggregate function directly in `HAVING` (`SUM(total) > 100`) — this is NOT allowed in `WHERE`, because at the time `WHERE` runs, no aggregation has happened yet.

## WHERE vs HAVING — side by side

```sql
SELECT user_id, SUM(total) AS total_spent
FROM orders
WHERE status = 'completed'       -- 1. filter rows BEFORE grouping (only completed orders count)
GROUP BY user_id
HAVING SUM(total) > 100;         -- 2. filter groups AFTER summing (only users totalling > 100)
```

| | WHERE | HAVING |
|---|---|---|
| Filters | Individual rows | Groups (after aggregation) |
| Runs | Before `GROUP BY` | After `GROUP BY` |
| Can use aggregate functions? | No | Yes |
| Can use column aliases from SELECT? | No (generally) | Sometimes (MySQL allows it; not standard) |

## Combining with aliases
```sql
SELECT user_id, SUM(total) AS total_spent
FROM orders
GROUP BY user_id
HAVING total_spent > 100;   -- MySQL allows the alias here (not all databases do)
```
- Safer/more portable to repeat the aggregate expression: `HAVING SUM(total) > 100`.

## HAVING without GROUP BY
`HAVING` can technically be used without `GROUP BY` (treating the whole table as one group), but this is rare and `WHERE` is almost always what you actually want in that case.

## Common mistake
```sql
-- ❌ wrong — trying to filter an aggregate using WHERE
SELECT user_id, SUM(total) AS total_spent
FROM orders
WHERE SUM(total) > 100   -- ERROR: aggregate functions not allowed in WHERE
GROUP BY user_id;

-- ✅ correct — use HAVING for aggregate conditions
SELECT user_id, SUM(total) AS total_spent
FROM orders
GROUP BY user_id
HAVING SUM(total) > 100;
```

See also: [[08-aggregates-and-grouping]], [[10-logical-processing-order]]
