# Query Construction

## The anatomy of a SELECT query
```sql
SELECT   column1, column2        -- what to return
FROM     table_name               -- where the data lives
JOIN     other_table ON ...       -- optional: combine with related tables
WHERE    condition                -- which rows to include
GROUP BY column                   -- optional: collapse rows into groups
HAVING   condition                -- optional: filter groups
ORDER BY column                   -- optional: sort the result
LIMIT    n OFFSET m;               -- optional: page the result
```
- Not every clause is required — the minimum valid query is `SELECT ... FROM ...;`.
- Clauses must appear in this fixed order in the *written* query, even though the database doesn't *execute* them in this order (see [[10-logical-processing-order]]).

## Building a query step by step
Start from the question you're answering, then build outward:

> "Which users from Bangladesh placed an order over $50, most recent first, show top 10?"

1. **Start table**: `FROM users`
2. **Need related data?** → `JOIN orders ON orders.user_id = users.id`
3. **Filter rows**: `WHERE users.country = 'BD' AND orders.total > 50`
4. **Pick columns**: `SELECT users.name, orders.total, orders.created_at`
5. **Sort**: `ORDER BY orders.created_at DESC`
6. **Limit**: `LIMIT 10`

```sql
SELECT users.name, orders.total, orders.created_at
FROM users
JOIN orders ON orders.user_id = users.id
WHERE users.country = 'BD' AND orders.total > 50
ORDER BY orders.created_at DESC
LIMIT 10;
```

## Good habits when constructing queries
- **Qualify column names** with the table (or alias) once more than one table is involved (`users.name` not just `name`) — avoids ambiguity errors.
- **Select only the columns you need** — avoid `SELECT *` in application code (wastes bandwidth, breaks if columns are added/reordered, unclear intent).
- **Build incrementally**: run the `FROM`/`JOIN`/`WHERE` part first without aggregation to sanity-check the row set, then add `GROUP BY`/aggregates on top.
- **Format for readability**: one clause per line, consistent indentation for joined conditions — makes debugging and revisiting much easier.

See also: [[02-filtering]], [[05-aliases]], [[10-logical-processing-order]]
