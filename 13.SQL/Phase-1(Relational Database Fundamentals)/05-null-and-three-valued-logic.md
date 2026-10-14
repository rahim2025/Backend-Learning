# NULL and Three-Valued Logic

## What is NULL?
- `NULL` represents **the absence of a value** — "unknown" or "not applicable". It is *not* the same as:
  - `0` (a number)
  - `''` (an empty string)
  - `false` (a boolean)
- A column allows `NULL` unless it's declared `NOT NULL`.

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,   -- must always have a value
    middle_name VARCHAR(100)      -- NULL allowed (maybe no middle name)
);
```

## Three-valued logic
Standard boolean logic has two values: `TRUE` / `FALSE`. SQL has **three**: `TRUE`, `FALSE`, and `UNKNOWN` — because any comparison involving `NULL` evaluates to `UNKNOWN`, not `TRUE` or `FALSE`.

```sql
SELECT NULL = NULL;      -- NULL (not TRUE!) — "unknown equals unknown" is still unknown
SELECT NULL = 5;         -- NULL
SELECT NULL <> 5;        -- NULL
SELECT 1 = 1;             -- TRUE (normal comparisons work as expected)
```

### Why `NULL = NULL` isn't TRUE
Conceptually, `NULL` means "I don't know this value." If you don't know value A and don't know value B, you can't claim they're equal — the honest answer is "unknown."

### Truth tables with UNKNOWN
| A | B | A AND B | A OR B |
|---|---|---|---|
| TRUE | UNKNOWN | UNKNOWN | TRUE |
| FALSE | UNKNOWN | FALSE | UNKNOWN |
| UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

- `WHERE` only returns rows where the condition evaluates to `TRUE`. Rows evaluating to `UNKNOWN` (or `FALSE`) are excluded.

## Checking for NULL correctly
```sql
-- ❌ wrong — this NEVER matches, even for NULL rows
SELECT * FROM users WHERE middle_name = NULL;

-- ✅ correct
SELECT * FROM users WHERE middle_name IS NULL;
SELECT * FROM users WHERE middle_name IS NOT NULL;
```

## Common NULL pitfalls

### 1. `NOT IN` with NULLs
```sql
SELECT * FROM products WHERE category_id NOT IN (1, 2, NULL);
-- Returns ZERO rows! Because category_id <> NULL is UNKNOWN for every row,
-- and the whole NOT IN chain becomes UNKNOWN if any value in the list is NULL.
```

### 2. Aggregate functions ignore NULLs
```sql
SELECT AVG(score) FROM exams;
-- NULL scores are excluded from both the sum and the count — not treated as 0.
```

### 3. COUNT behavior differs
```sql
SELECT COUNT(*) FROM users;          -- counts all rows, regardless of NULLs
SELECT COUNT(middle_name) FROM users; -- counts only rows where middle_name IS NOT NULL
```

### 4. Concatenation with NULL
```sql
SELECT CONCAT(first_name, ' ', middle_name, ' ', last_name) FROM users;
-- In many databases, if middle_name is NULL, the WHOLE result becomes NULL.
-- Use COALESCE to guard against this.
```

## COALESCE — providing a fallback for NULL
```sql
SELECT COALESCE(middle_name, '') AS middle_name FROM users;
-- Returns middle_name if it's not NULL, otherwise returns '' (empty string).

SELECT COALESCE(nickname, first_name, 'Unknown') FROM users;
-- Returns the first non-NULL value among the arguments.
```

## Rule of thumb
> Never compare to `NULL` with `=` or `<>`. Always use `IS NULL` / `IS NOT NULL`, and be deliberate about how NULLs interact with `IN`, aggregates, and string operations.
