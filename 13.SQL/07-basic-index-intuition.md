# Basic Index Intuition

## The problem indexes solve
Without an index, to find a row matching a condition, the database must check **every single row** in the table — a "full table scan." On a table with millions of rows, this is slow.

## What is an index?
- A separate data structure (commonly a **B-tree**) that the database maintains alongside a table, which lets it look up rows **without scanning the whole table** — similar to the index at the back of a textbook: instead of reading every page to find "foreign keys," you jump straight to the page number listed in the index.
- Built on one or more columns.

```sql
CREATE INDEX idx_users_email ON users(email);
```

## Intuition: book index analogy
- **No index** = reading a 1000-page book front to back to find every mention of a topic.
- **With index** = flipping to the index page, finding the topic, jumping directly to page 42.
- The tradeoff: maintaining that index page takes extra space, and must be updated whenever the book's content changes (i.e. whenever you `INSERT`/`UPDATE`/`DELETE`).

## What gets indexed automatically
- **Primary keys** are automatically indexed (needed to enforce uniqueness efficiently).
- **Unique constraints** are automatically indexed too.
- Foreign keys are *not* always automatically indexed in every database — worth checking/adding explicitly, since joins on them benefit greatly from an index.

## When an index helps
- Columns frequently used in `WHERE` clauses:
```sql
SELECT * FROM users WHERE email = 'rahim@example.com';  -- fast with an index on email
```
- Columns used in `JOIN` conditions.
- Columns used in `ORDER BY` (an index can let the database read rows already in sorted order, avoiding a separate sort step).

## When an index does NOT help (or even hurts)
- **Small tables**: a full scan of a few hundred rows is already fast — index overhead isn't worth it.
- **Columns rarely filtered/searched on.**
- **Low-cardinality columns** (e.g. a `gender` column with only 2–3 possible values) — the index doesn't narrow things down much since so many rows share the same value.
- **Write-heavy tables**: every `INSERT`/`UPDATE`/`DELETE` has to also update every index on that table — more indexes = slower writes.
- **Leading wildcard searches**: `WHERE name LIKE '%im'` generally can't use a standard index efficiently (the database can't jump to a starting point when the match could be anywhere).

## Composite (multi-column) indexes
```sql
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```
- Helps queries filtering on `user_id` alone, or on `user_id` AND `status` together.
- Does **not** efficiently help a query filtering on `status` alone (column order matters — leftmost-prefix rule).

## The cost side of the tradeoff
| Benefit | Cost |
|---|---|
| Much faster `SELECT`/`WHERE`/`JOIN`/`ORDER BY` on indexed columns | Extra disk space to store the index |
| | Slower `INSERT`/`UPDATE`/`DELETE` (index must be updated too) |
| | More indexes = more maintenance overhead for the database |

## Rule of thumb
> Index columns you frequently search, filter, join, or sort on — especially in large tables. Don't index everything "just in case"; each index has a real cost on every write.

See also: [[08-how-mysql-processes-requests]] (where indexes come into play during query execution).
