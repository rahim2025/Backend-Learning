# Sorting (ORDER BY)

## Basic usage
```sql
SELECT * FROM users ORDER BY name;          -- ascending (default), A→Z
SELECT * FROM users ORDER BY name ASC;      -- explicit ascending
SELECT * FROM users ORDER BY age DESC;      -- descending, highest first
```

## Multiple sort keys
```sql
SELECT * FROM users ORDER BY country ASC, age DESC;
```
- Sorts by `country` first; for rows with the same `country`, breaks ties using `age` descending.
- Each column can have its own direction.

## Sorting by column position
```sql
SELECT name, age FROM users ORDER BY 2 DESC;  -- sorts by the 2nd selected column (age)
```
- Works, but fragile — if column order in `SELECT` changes, the sort silently changes meaning. Prefer naming the column explicitly.

## Sorting by an expression/alias
```sql
SELECT name, price * quantity AS total_cost
FROM order_items
ORDER BY total_cost DESC;
```

## NULLs in sorting
- By default in MySQL, `NULL` is treated as the **smallest** value — it appears first in `ASC` order, last in `DESC` order.
```sql
SELECT * FROM users ORDER BY middle_name ASC;  -- NULLs appear first
```
- To force NULLs to the end regardless of direction:
```sql
SELECT * FROM users ORDER BY middle_name IS NULL, middle_name ASC;
```

## Sorting and pagination together
`ORDER BY` should (almost) always be paired with `LIMIT`/`OFFSET` — without a defined order, which rows come back on "page 2" is not guaranteed to be consistent between queries. See [[04-pagination]].

```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 10 OFFSET 20;
```

## Performance note
- Sorting large result sets is expensive (the database may need to sort in memory or spill to disk).
- An **index** on the `ORDER BY` column(s) can let the database read rows already in sorted order, avoiding a separate sort step entirely — see [[../Phase-1(Relational Database Fundamentals)/07-basic-index-intuition]].

See also: [[02-filtering]], [[04-pagination]]
