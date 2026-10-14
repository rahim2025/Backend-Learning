# DDL Basics (Data Definition Language)

**DDL** = the commands that define/change the *structure* of the database (tables, columns, constraints) — as opposed to **DML**, which manipulates the *data* inside them (see [[06-inserts-updates-deletes]]).

Main DDL commands: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`.

## CREATE — defining new structures
```sql
CREATE DATABASE shop;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## ALTER — modifying an existing table
```sql
-- add a column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- drop a column
ALTER TABLE users DROP COLUMN phone;

-- change a column's type/definition
ALTER TABLE users MODIFY COLUMN name VARCHAR(150) NOT NULL;   -- MySQL
-- ALTER TABLE users ALTER COLUMN name TYPE VARCHAR(150);      -- PostgreSQL

-- rename a column
ALTER TABLE users RENAME COLUMN name TO full_name;

-- rename a table
ALTER TABLE users RENAME TO customers;

-- add/drop a constraint
ALTER TABLE orders ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE orders DROP FOREIGN KEY fk_user;    -- MySQL syntax
```

## DROP — permanently removing structures
```sql
DROP TABLE users;        -- deletes the table AND all its data, irreversible
DROP DATABASE shop;      -- deletes the entire database
```
⚠️ `DROP` removes the structure itself (and all data in it) — far more destructive than `DELETE`, which only removes rows but keeps the table.

## TRUNCATE — wiping all rows, keeping structure
```sql
TRUNCATE TABLE logs;
```
- Sits between DML and DDL conceptually: it empties a table (like a full `DELETE`) but behaves more like DDL (resets `AUTO_INCREMENT`, can't be filtered with `WHERE`, often can't be rolled back, skips row-level triggers).

## DDL vs DML — quick comparison

| | DDL | DML |
|---|---|---|
| Affects | Structure (tables, columns, constraints) | Data (rows) |
| Commands | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| Typical frequency | Rare (schema design/migrations) | Constant (everyday app usage) |
| Auto-commits? | Often implicitly commits in MySQL (can't be rolled back in a transaction) | Can usually be rolled back within a transaction |

## Practical notes
- DDL changes on large production tables (e.g. adding a column) can lock the table and be slow — plan schema migrations carefully, often with dedicated migration tools (e.g. Sequelize migrations, Prisma migrate, Flyway).
- Always back up / double-check before running `DROP` — there's no `WHERE` clause to limit the damage.

See also: [[../Phase-1(Relational Database Fundamentals)/03-tables-rows-columns-schemas]], [[../Phase-1(Relational Database Fundamentals)/06-keys-and-integrity/02-constraints-and-data-integrity]]
