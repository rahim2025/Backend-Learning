# INSERT, UPDATE, DELETE (DML — Data Manipulation Language)

These three statements (plus `SELECT`) make up **DML** — the commands that manipulate the *data* inside tables (as opposed to **DDL**, which defines the *structure* — see [[07-ddl-basics]]).

## INSERT — adding rows
```sql
INSERT INTO users (name, email) VALUES ('Rahim', 'rahim@example.com');

-- multiple rows in one statement (more efficient than separate INSERTs)
INSERT INTO users (name, email) VALUES
    ('A', 'a@example.com'),
    ('B', 'b@example.com');

-- insert from the result of a SELECT (copy/transform data from another table)
INSERT INTO archived_users (name, email)
SELECT name, email FROM users WHERE deleted_at IS NOT NULL;
```
- Columns not listed fall back to their `DEFAULT` value, or `NULL` if nullable, or cause an error if `NOT NULL` with no default.
- `AUTO_INCREMENT` columns should normally be omitted — the database fills them in.

## UPDATE — modifying existing rows
```sql
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- update multiple columns at once
UPDATE users SET email = 'new@example.com', name = 'Rahim K.' WHERE id = 1;

-- update using a computed/existing value
UPDATE products SET price = price * 1.10 WHERE category = 'electronics';
```
⚠️ **Always include a `WHERE` clause** — `UPDATE users SET email = '...'` with no `WHERE` updates **every row** in the table.

## DELETE — removing rows
```sql
DELETE FROM users WHERE id = 1;

-- delete all rows matching a condition
DELETE FROM orders WHERE status = 'cancelled';
```
⚠️ Same warning as `UPDATE` — `DELETE FROM users;` with no `WHERE` wipes the **entire table**.

### DELETE vs TRUNCATE
```sql
DELETE FROM logs;     -- removes all rows, logged row-by-row, can be rolled back, triggers fire, slower on huge tables
TRUNCATE TABLE logs;   -- resets the table instantly, generally cannot be rolled back, resets AUTO_INCREMENT, no row-level triggers
```

## Safety habits
- **Test the `WHERE` clause as a `SELECT` first**, especially for `UPDATE`/`DELETE` on important tables:
```sql
SELECT * FROM users WHERE created_at < '2020-01-01';   -- check what will be affected
-- once confirmed:
DELETE FROM users WHERE created_at < '2020-01-01';
```
- Wrap risky changes in a **transaction** so you can roll back if something looks wrong:
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;   -- or ROLLBACK; if something's wrong
```
- For permanent/important data, consider a **soft delete** instead of `DELETE` — see historical data preservation notes from Phase 1 ([[../Phase-1(Relational Database Fundamentals)/06-keys-and-integrity/06-historical-data-preservation]]).

See also: [[11-common-debugging-categories]]
