# AUTO_INCREMENT

## What it does
- A column attribute (MySQL syntax) that automatically generates the next sequential integer value whenever a new row is inserted without specifying that column.
- The most common way to implement a [[03-surrogate-and-composite-keys|surrogate primary key]].

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO users (name) VALUES ('Rahim');  -- id automatically becomes 1
INSERT INTO users (name) VALUES ('Akter');  -- id automatically becomes 2
```

- You never need to (and normally shouldn't) specify the `id` manually — the database handles it.
- You *can* override it explicitly if needed:
```sql
INSERT INTO users (id, name) VALUES (100, 'Custom');
-- next auto-generated id will continue from 101 onward
```

## How it behaves
- Only **one** `AUTO_INCREMENT` column is allowed per table, and it must be indexed (it's implicitly indexed since it's usually also the `PRIMARY KEY`).
- The counter increases monotonically — it does **not** reuse ids from deleted rows.
```sql
-- if row id=5 is deleted, the next inserted row still gets id=6 (or higher), never id=5 again
```
- This means ids are **not guaranteed to be perfectly contiguous** (gaps can appear after deletes or rolled-back transactions) — don't rely on auto-increment values for counting rows or displaying "row numbers."
- You can check/reset the next value:
```sql
ALTER TABLE users AUTO_INCREMENT = 1000;  -- next insert will start from 1000
SHOW TABLE STATUS LIKE 'users';           -- shows current AUTO_INCREMENT value
```

## Equivalent syntax in other databases
`AUTO_INCREMENT` is MySQL-specific terminology. Other databases achieve the same thing differently:

| Database | Syntax |
|---|---|
| MySQL | `INT AUTO_INCREMENT` |
| PostgreSQL | `SERIAL` / `BIGSERIAL`, or modern `GENERATED ALWAYS AS IDENTITY` |
| SQL Server | `IDENTITY(1,1)` |
| SQLite | `INTEGER PRIMARY KEY` (auto-increments by default) |
| Oracle | Sequences + triggers, or `GENERATED AS IDENTITY` (12c+) |

## When NOT to rely on it
- **Multi-server / distributed systems**: auto-increment is per-database-instance — two separate database servers inserting independently can generate colliding ids. UUIDs are preferred there.
- **Exposing ids publicly**: sequential ids leak information (e.g. `/orders/42` tells competitors/users roughly how many orders exist, and lets them guess `/orders/43`). Consider a UUID or a separate public-facing slug/token for externally visible identifiers.
- **Merging data from multiple sources**: auto-increment ids generated independently in two systems will clash when combined.

## Rule of thumb
> Use `AUTO_INCREMENT` (or your database's equivalent) as the default surrogate key for single-database applications — it's simple, fast, and index-friendly. Reach for UUIDs only when you have a specific distributed/security reason to need them.
