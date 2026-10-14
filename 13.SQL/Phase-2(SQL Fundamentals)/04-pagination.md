# Pagination (LIMIT / OFFSET)

## Why paginate
Fetching an entire large table at once wastes bandwidth/memory and is slow. Pagination fetches data in fixed-size "pages" — essential for APIs and UI lists.

## Basic syntax (MySQL / PostgreSQL / SQLite)
```sql
SELECT * FROM users ORDER BY id LIMIT 10;             -- first 10 rows
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;    -- skip 20, take next 10 (rows 21-30)
```

Formula: `OFFSET = (pageNumber - 1) * pageSize`

```sql
-- page 1, 10 per page -> LIMIT 10 OFFSET 0
-- page 2             -> LIMIT 10 OFFSET 10
-- page 3             -> LIMIT 10 OFFSET 20
```

## SQL Server syntax (different dialect)
```sql
SELECT * FROM users
ORDER BY id
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

## Pagination always needs ORDER BY
Without a defined, stable sort order, the database is free to return rows in any order it likes — "page 2" might overlap or skip rows relative to "page 1" on a later run. Always pair `LIMIT`/`OFFSET` with a deterministic `ORDER BY` (ideally on a unique column, or a combination that is unique).

```sql
SELECT * FROM users ORDER BY created_at DESC, id DESC LIMIT 10 OFFSET 20;
-- id as a tiebreaker in case multiple rows share the same created_at
```

## ⚠️ OFFSET pagination performance problem
- The database still has to **scan and discard** all the skipped rows internally — `OFFSET 100000 LIMIT 10` is much slower than `OFFSET 10 LIMIT 10`, even though both return only 10 rows.
- Gets progressively worse as users page deeper into large tables.

## Keyset / cursor pagination (the scalable alternative)
Instead of counting rows to skip, remember the **last seen value** and continue from there using an indexed column:

```sql
-- first page
SELECT * FROM users ORDER BY id LIMIT 10;
-- suppose the last row returned has id = 10

-- next page: jump directly using the index, no scanning/skipping
SELECT * FROM users WHERE id > 10 ORDER BY id LIMIT 10;
```
- Much faster on large tables because the index lets the database seek directly to `id > 10`, rather than counting through everything before it.
- Downside: can't jump arbitrarily to "page 57" — you can only move forward/backward from a known cursor. Fine for infinite-scroll UIs, less fine for numbered page links.

## Quick comparison

| | OFFSET pagination | Keyset (cursor) pagination |
|---|---|---|
| Simplicity | Simple, supports "jump to page N" | Slightly more setup (needs a stable sort key) |
| Performance on large tables/deep pages | Degrades with higher offsets | Stays fast regardless of depth |
| Best for | Small/medium tables, admin panels with page numbers | Large tables, infinite scroll, APIs |

See also: [[03-sorting]], [[../Phase-1(Relational Database Fundamentals)/07-basic-index-intuition]]
