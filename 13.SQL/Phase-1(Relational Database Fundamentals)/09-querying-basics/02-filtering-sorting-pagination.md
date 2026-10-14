# Filtering, Sorting, and Pagination

## Filtering — WHERE
```sql
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE name = 'Rahim';
SELECT * FROM users WHERE age BETWEEN 18 AND 30;
SELECT * FROM users WHERE name IN ('A', 'B', 'C');
SELECT * FROM users WHERE email LIKE '%@gmail.com'; -- pattern match
SELECT * FROM users WHERE deleted_at IS NULL;        -- NULL check
```

### Combining conditions
```sql
SELECT * FROM users WHERE age > 18 AND country = 'BD';
SELECT * FROM users WHERE country = 'BD' OR country = 'US';
SELECT * FROM users WHERE NOT (country = 'BD');
```

### LIKE wildcards
- `%` matches any number of characters.
- `_` matches exactly one character.
```sql
SELECT * FROM users WHERE name LIKE 'R%';   -- starts with R
SELECT * FROM users WHERE name LIKE '%im';  -- ends with im
```

## Sorting — ORDER BY
```sql
SELECT * FROM users ORDER BY name ASC;      -- A to Z (default)
SELECT * FROM users ORDER BY age DESC;      -- highest first

-- multiple columns: sorts by first, then breaks ties with second
SELECT * FROM users ORDER BY country ASC, age DESC;
```

## Pagination — LIMIT / OFFSET
Used to fetch data in "pages" instead of all at once (critical for performance with large tables and for UI pagination).

```sql
-- MySQL / PostgreSQL / SQLite
SELECT * FROM users ORDER BY id LIMIT 10;            -- first 10 rows
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;   -- rows 21–30 (page 3, page size 10)
```

Formula: `OFFSET = (pageNumber - 1) * pageSize`

```sql
-- page 1, 10 per page
LIMIT 10 OFFSET 0;
-- page 2
LIMIT 10 OFFSET 10;
-- page 3
LIMIT 10 OFFSET 20;
```

### SQL Server syntax (different dialect)
```sql
SELECT * FROM users
ORDER BY id
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

### ⚠️ OFFSET pagination performance note
- `OFFSET` on very large tables gets slower as the offset grows (the DB still scans/skips all prior rows).
- For large datasets, **cursor/keyset pagination** is preferred:
```sql
-- instead of OFFSET, remember the last seen id and continue from there
SELECT * FROM users WHERE id > 20 ORDER BY id LIMIT 10;
```
This is faster because the database can jump directly using an index on `id`, instead of counting through skipped rows.

## Putting it all together
```sql
SELECT name, email
FROM users
WHERE country = 'BD' AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```
→ "Give me the 10 most recently created, non-deleted users from Bangladesh."
