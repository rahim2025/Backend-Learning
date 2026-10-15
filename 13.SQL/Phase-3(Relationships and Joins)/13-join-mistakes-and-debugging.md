# Join Mistakes and Debugging

## Joining on the wrong columns

Using a column that looks right but isn't the actual relationship — e.g. joining on a `name` instead of an `id`, or matching the wrong pair of FK/PK columns.

```sql
-- ❌ joining on a non-unique, loosely-related column
SELECT * FROM orders o JOIN users u ON o.user_name = u.name;
-- fragile: breaks on duplicate names, typos, case differences

-- ✅ join on the actual FK -> PK relationship
SELECT * FROM orders o JOIN users u ON o.user_id = u.id;
```

**Symptom**: results look almost right, but rows are missing, duplicated, or mismatched in ways that don't make sense until you check *which* columns are actually being compared.

## Incomplete join conditions

Forgetting part of a multi-column join key, or forgetting the join condition for one of several joined tables.

```sql
-- enrollments has a composite relationship (student_id, course_id) to a grading period table
-- ❌ only matching on one of the two columns needed
JOIN grading_periods gp ON gp.course_id = e.course_id
-- missing: AND gp.term = e.term  -- if grading periods repeat per term
```

**Symptom**: more rows come back than expected, because an incomplete condition matches multiple rows on the other side that a complete condition would have narrowed down to one.

## Cartesian products

Happens when a `JOIN` has **no** condition relating the tables (or an always-true condition) — every row on one side pairs with every row on the other side.

```sql
-- ❌ accidental cross join (missing ON / comma-join with no WHERE link)
SELECT * FROM users, orders;
-- or equivalently
SELECT * FROM users JOIN orders;   -- MySQL requires ON for JOIN, but a comma-join has no such requirement

-- rows returned = (number of users) × (number of orders) — almost never what you want
```

**Symptom**: row count explodes dramatically (e.g. 100 users × 500 orders = 50,000 rows), often alongside nonsensical combinations in the data (every user paired with every order, not just their own).

**How to catch it**: if a query's row count is suspiciously close to `(rows in A) × (rows in B)`, suspect a missing or broken join condition.

## Why DISTINCT should not be used blindly to hide bad joins

A common (bad) instinct when a query returns duplicate-looking rows is to slap `DISTINCT` on the `SELECT` and move on:

```sql
-- "fixing" duplicates by hiding them, without understanding why they exist
SELECT DISTINCT u.name, u.email
FROM users u
JOIN orders o ON o.user_id = u.id;
```

Why this is risky:

- `DISTINCT` **masks the symptom** (duplicate rows in the output) without addressing the **cause** (a one-to-many or many-to-many join multiplying rows — see [[14-row-multiplication]]).
- It can silently produce **wrong aggregates** elsewhere in the same query — `COUNT`, `SUM`, `AVG` computed *before* `DISTINCT` collapses rows are still calculated on the multiplied row set (see [[15-aggregation-problems-after-joins]]).
- It hides genuine bugs: if the duplication is actually caused by a broken join condition (not a legitimate one-to-many relationship), `DISTINCT` will make the query "look" correct while the underlying join is still wrong — the next person to modify the query inherits a disguised problem.
- It can be slow on large result sets (deduplication requires sorting/hashing the full output).

The correct approach: **understand why duplicates appear** (which join is fanning out rows, and is that fan-out actually legitimate for this question?) before deciding whether `DISTINCT`, restructuring the query (e.g. aggregating in a subquery first), or fixing a genuinely broken join condition is the right fix.

## General debugging checklist for a misbehaving join

1. Run each table alone first (`SELECT COUNT(*) FROM users`, `SELECT COUNT(*) FROM orders`) to know the baseline.
2. Add one join at a time, checking the row count after each addition (see [[06-multi-table-joins]]).
3. When the count jumps unexpectedly, inspect the actual `ON` condition for that join — is it the real FK relationship? Is it complete (all necessary columns)?
4. If rows are missing instead of multiplying, check whether an `INNER JOIN` is dropping legitimate unmatched rows that a `LEFT JOIN` should have preserved (see [[03-inner-join]], [[04-left-join]]).
5. If a `LEFT JOIN` still seems to be dropping rows, check for a `WHERE` condition on the right table that's silently undoing it (see [[08-left-join-on-vs-where]]), or a later `INNER JOIN` in the chain re-filtering preserved `NULL` rows out (see [[06-multi-table-joins]]).

See also: [[14-row-multiplication]], [[15-aggregation-problems-after-joins]]
