# Anti-Join Pattern

## The goal
Find rows in table A that have **no** corresponding row in table B — e.g. "users who have never placed an order," "products that have never been tagged," "students enrolled in no courses."

SQL has no `ANTI JOIN` keyword — it's a **pattern** built from `LEFT JOIN` + `IS NULL`, or from `NOT IN`/`NOT EXISTS`.

## Pattern 1: LEFT JOIN + WHERE ... IS NULL (most common)
```sql
SELECT u.id, u.name
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;      -- keep only rows where the LEFT JOIN found no match
```
How it works: `LEFT JOIN` preserves every `users` row (see [[04-left-join]]). For users with no orders, every column from `orders` comes back `NULL`. Filtering `WHERE o.id IS NULL` keeps exactly those unmatched rows.

⚠️ Must check a column that can **never** legitimately be `NULL` on a real match — typically the right table's primary key (`o.id`), not an arbitrary nullable column like `o.notes`.

## Pattern 2: NOT EXISTS (often the most efficient)
```sql
SELECT u.id, u.name
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```
- Reads very close to the English description ("users where no matching order exists").
- Generally performs well since the database can stop as soon as it finds a single match (or confirms there isn't one).

## Pattern 3: NOT IN (works, but has a NULL trap)
```sql
SELECT u.id, u.name
FROM users u
WHERE u.id NOT IN (SELECT user_id FROM orders);
```
⚠️ **Dangerous if the subquery can return `NULL`.** If any row in `orders.user_id` is `NULL`, the entire `NOT IN` comparison becomes `UNKNOWN` for every row, and the query silently returns **zero rows** — see three-valued logic notes from Phase 1. Prefer `NOT EXISTS` or the `LEFT JOIN`/`IS NULL` pattern to avoid this trap entirely.

## Comparing the three patterns

| Pattern | Readability | NULL-safe? | Typical performance |
|---|---|---|---|
| `LEFT JOIN ... WHERE x IS NULL` | Good, very common | ✅ Yes | Good, well-optimized by most engines |
| `NOT EXISTS` | Very clear intent | ✅ Yes | Often best — can short-circuit |
| `NOT IN (subquery)` | Simple to write | ❌ Breaks silently with NULLs | Can be fine, but risky |

## Rule of thumb
> Default to `LEFT JOIN ... WHERE <right_table>.<pk> IS NULL` or `NOT EXISTS` for anti-join logic. Avoid `NOT IN` with a subquery unless you're certain the subquery's column can never contain `NULL`.
