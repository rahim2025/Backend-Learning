# LEFT JOIN: Conditions in ON vs WHERE

Where you put a filter condition — inside the `ON` clause or the `WHERE` clause — changes the **meaning** of a `LEFT JOIN` query. This is one of the most common sources of subtle bugs.

## The core rule

- A condition in `ON` is applied **while matching rows** — it decides what counts as a "match," but unmatched left rows are still kept (with NULLs).
- A condition in `WHERE` is applied **after** the join is complete — it can filter out left rows entirely, including ones that only survived because of the `LEFT JOIN`.

## Example setup

```sql
users:                  orders:
id | name               id | user_id | total | status
1  | Rahim              1  | 1       | 20    | completed
2  | Akter              2  | 1       | 30    | cancelled
3  | Nadia              (no orders for Nadia)
```

## Condition in ON — preserves all users

```sql
SELECT u.name, o.total, o.status
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed';
```

Result:

```
name  | total | status
Rahim | 20    | completed
Akter | NULL  | NULL      <- Akter kept, but her only order (cancelled) didn't match the ON condition
Nadia | NULL  | NULL      <- Nadia kept, she has no orders at all
```

- The `status = 'completed'` condition only affects **which orders count as a match** — it does not remove any user. Every user still appears, exactly as a `LEFT JOIN` promises.

## Condition in WHERE — can silently undo the LEFT JOIN

```sql
SELECT u.name, o.total, o.status
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.status = 'completed';
```

Result:

```
name  | total | status
Rahim | 20    | completed
-- Akter and Nadia are GONE — their rows had o.status = NULL,
-- and `NULL = 'completed'` evaluates to UNKNOWN, so WHERE filters them out.
```

- This query **behaves exactly like an INNER JOIN** — the whole point of using `LEFT JOIN` (keeping unmatched rows) is lost, because `WHERE` runs after the join and throws away any row where the condition isn't true — including the `NULL` rows the `LEFT JOIN` worked to preserve.

## How to decide where a condition belongs

| Question | Put the condition in... |
|---|---|
| "Does this filter decide what counts as a related row, while still wanting every left row represented?" | `ON` |
| "Do I only want left rows that end up with *some* matching right row satisfying this?" | `WHERE` |

Rule of thumb:

> If a condition is about the **right-hand table** and you still want unmatched left rows to appear, put it in `ON`. If you put a right-table condition in `WHERE`, you've likely turned your `LEFT JOIN` back into an `INNER JOIN` by accident.

## Conditions on the LEFT table are safe in WHERE

```sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.country = 'BD';     -- ✅ fine — filtering the left table doesn't create this trap
```

- This trap specifically concerns filtering on **right-table** columns after the join — filtering on left-table columns in `WHERE` behaves as expected.

See also: [[04-left-join]], [[13-join-mistakes-and-debugging]]
