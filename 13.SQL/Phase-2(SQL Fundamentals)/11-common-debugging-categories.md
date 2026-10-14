# Common SQL Debugging Categories

A checklist of the typical ways SQL queries go wrong, grouped by category, with how to recognize and fix each.

## 1. Syntax errors
- **Symptom**: database rejects the query outright, often with a specific error pointing near the problem.
- **Common causes**: missing comma between columns, missing/extra parenthesis, keyword typo, missing semicolon in a multi-statement script, wrong quote type for strings vs identifiers.
- **Fix approach**: read the error message's position carefully — it usually points right at (or just after) the real problem. Check the clause immediately before the reported location.

## 2. Logical order mistakes
- **Symptom**: "unknown column", "aggregate function not allowed here", alias "not found".
- **Common causes**: using a `SELECT` alias in `WHERE`, using an aggregate in `WHERE` instead of `HAVING`, forgetting a non-aggregated column needs to be in `GROUP BY`.
- **Fix approach**: mentally re-run the query in logical order (see [[10-logical-processing-order]]) to see what's actually available at each step.

## 3. NULL-related surprises
- **Symptom**: rows "missing" from results that you expected, `WHERE column = NULL` matching nothing, `NOT IN` returning zero rows unexpectedly, concatenation producing `NULL` for the whole string.
- **Common causes**: using `=`/`<>` instead of `IS NULL`/`IS NOT NULL`; a `NOT IN (...)` list containing a NULL; forgetting `COALESCE` when concatenating nullable columns.
- **Fix approach**: check for NULLs explicitly (`SELECT * FROM t WHERE col IS NULL`) before assuming a bug elsewhere; see [[../Phase-1(Relational Database Fundamentals)/05-null-and-three-valued-logic]].

## 4. JOIN mistakes
- **Symptom**: fewer rows than expected (rows silently disappear), or more rows than expected (duplicated data).
- **Common causes**:
  - Using `INNER JOIN` when some rows legitimately have no match → rows vanish. Fix: use `LEFT JOIN` if the "no match" case should still appear.
  - Joining on the wrong column, or a typo in the join condition → produces a cross-join-like explosion of rows (every row matches every row).
  - Forgetting a join condition entirely (accidental cross join).
- **Fix approach**: check `COUNT(*)` before and after adding each `JOIN` to see exactly which join changed the row count and how.

## 5. Aggregation / GROUP BY mistakes
- **Symptom**: numbers that look "too high" or "too low", unexpected number of result rows.
- **Common causes**: grouping by the wrong (or too many/too few) columns; a `JOIN` before the `GROUP BY` fanning out rows and inflating a `SUM`/`COUNT` (duplicate rows from a one-to-many join counted multiple times).
- **Fix approach**: run the un-grouped `SELECT ... FROM ... JOIN ... WHERE ...` first and manually inspect/count rows per group before trusting the aggregate.

## 6. Filtering mistakes
- **Symptom**: too many or too few rows returned.
- **Common causes**: `AND`/`OR` precedence without parentheses; off-by-one in `BETWEEN`/date ranges; case-sensitivity assumptions that don't match the database's actual collation; using `LIKE` without realizing `%`/`_` need escaping if searching for literal percent signs/underscores.
- **Fix approach**: isolate the `WHERE` clause in a standalone `SELECT *` and check the row count/content before adding other clauses back.

## 7. Data type / implicit conversion issues
- **Symptom**: comparisons that "shouldn't" match do, or valid-looking values don't match.
- **Common causes**: comparing a string column to a number without quotes consistently; comparing dates stored as strings; trailing whitespace in string columns; different `VARCHAR` lengths/collations causing unexpected equality/inequality.
- **Fix approach**: check actual stored values and types with `SELECT col, LENGTH(col) FROM t` or similar; avoid relying on implicit type coercion.

## 8. Pagination / sorting inconsistencies
- **Symptom**: duplicate or missing rows across pages, "random" looking order.
- **Common causes**: `LIMIT`/`OFFSET` without a deterministic `ORDER BY` (especially when there are ties); sorting by a non-unique column so tied rows can shuffle between page loads.
- **Fix approach**: always include a unique tiebreaker column in `ORDER BY` (see [[04-pagination]]).

## 9. Performance issues (query "works" but is slow)
- **Symptom**: correct results, but slow — especially as the table grows.
- **Common causes**: missing index on a column used in `WHERE`/`JOIN`/`ORDER BY`; `LIKE '%term'` (leading wildcard) that can't use an index; large `OFFSET` in pagination.
- **Fix approach**: run `EXPLAIN SELECT ...` to see whether an index is being used or a full table scan is happening — see [[../Phase-1(Relational Database Fundamentals)/07-basic-index-intuition]] and [[../Phase-1(Relational Database Fundamentals)/08-how-mysql-processes-requests]].

## General debugging strategy
1. **Isolate**: strip the query down to just `FROM`/`WHERE` and check the row count makes sense, then add clauses back one at a time (`JOIN` → `GROUP BY` → `HAVING` → `ORDER BY` → `LIMIT`).
2. **Verify assumptions**: actually look at the data (`SELECT DISTINCT col FROM t`) instead of assuming what it contains.
3. **Use `EXPLAIN`** when the issue is about speed, not correctness.
4. **Think in logical order**, not written order, when something "should" work but the database complains it doesn't recognize a column/alias.
