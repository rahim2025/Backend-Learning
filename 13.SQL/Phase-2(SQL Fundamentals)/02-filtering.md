# Filtering (WHERE)

## Basic comparisons
```sql
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE age >= 18;
SELECT * FROM users WHERE age < 18;
SELECT * FROM users WHERE age <= 18;
SELECT * FROM users WHERE age = 18;
SELECT * FROM users WHERE age <> 18;   -- or != (not equal)
```

## Combining conditions
```sql
SELECT * FROM users WHERE age > 18 AND country = 'BD';
SELECT * FROM users WHERE country = 'BD' OR country = 'US';
SELECT * FROM users WHERE NOT (country = 'BD');
```
- `AND` binds tighter than `OR` — use parentheses to be explicit about intent:
```sql
-- age > 18 AND (country = 'BD' OR country = 'US')
SELECT * FROM users WHERE age > 18 AND (country = 'BD' OR country = 'US');
```

## Range and set checks
```sql
SELECT * FROM products WHERE price BETWEEN 10 AND 50;   -- inclusive both ends
SELECT * FROM users WHERE country IN ('BD', 'US', 'UK');
SELECT * FROM users WHERE country NOT IN ('BD', 'US');
```
⚠️ `NOT IN` with a list containing `NULL` returns zero rows — see [[../Phase-1(Relational Database Fundamentals)/05-null-and-three-valued-logic]].

## Pattern matching
```sql
SELECT * FROM users WHERE name LIKE 'R%';    -- starts with R
SELECT * FROM users WHERE name LIKE '%im';   -- ends with im
SELECT * FROM users WHERE name LIKE '%ah%';  -- contains "ah"
SELECT * FROM users WHERE name LIKE 'R_him'; -- _ matches exactly one character
```
- `%` = any number of characters (including zero), `_` = exactly one character.
- Case sensitivity of `LIKE` depends on the database/collation (MySQL is case-insensitive by default with common collations).

## NULL checks
```sql
SELECT * FROM users WHERE middle_name IS NULL;
SELECT * FROM users WHERE middle_name IS NOT NULL;
```
- Never use `= NULL` or `<> NULL` — always evaluates to UNKNOWN, never matches.

## Filtering on subqueries
```sql
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE total > 100);
```

## WHERE vs HAVING (preview)
- `WHERE` filters **individual rows**, before any grouping happens.
- `HAVING` filters **groups**, after aggregation. See [[09-having]].

## Common mistakes
- Forgetting `WHERE` on `UPDATE`/`DELETE` → affects every row in the table.
- Using `=` instead of `IN` when checking multiple possible values.
- Mixing up `AND`/`OR` precedence without parentheses.

See also: [[03-sorting]], [[04-pagination]]
