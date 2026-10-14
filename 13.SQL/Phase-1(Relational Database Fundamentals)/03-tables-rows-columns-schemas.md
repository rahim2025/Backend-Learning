# Tables, Rows, Columns, and Schemas

## Table
- The core structure in a relational database — a grid-like collection of data, conceptually similar to a spreadsheet.
- Has a fixed set of named columns, and holds any number of rows.
- Example: a `users` table stores one row per user.

## Row (a.k.a. "record" or "tuple")
- A single entry in a table — one complete set of values for all the table's columns.
- Example: one row in `users` = one specific user (`id=1, name='Rahim', email='rahim@example.com'`).

## Column (a.k.a. "field" or "attribute")
- A named, typed slot that every row in the table has a value for (or NULL).
- Defines what kind of data can go in it (see [[04-common-data-types]]).
- Example: `users` table might have columns `id`, `name`, `email`, `created_at`.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Visualized:

| id | name  | email              | created_at          |
|----|-------|--------------------|----------------------|
| 1  | Rahim | rahim@example.com  | 2026-01-01 10:00:00  |
| 2  | Akter | akter@example.com  | 2026-01-02 09:30:00  |

- Each **row** = one record (e.g. row `id=1`).
- Each **column** = one attribute shared by all rows (e.g. `email`).

## Schema
"Schema" has two related meanings in SQL, and both matter:

### 1. Schema = the structure/definition of a table (or database)
- The blueprint: which columns exist, their data types, constraints, keys, relationships.
- Defined once via `CREATE TABLE` (and `ALTER TABLE` to change later).
- Relational databases are **schema-enforced**: every row must conform to this structure (contrast with MongoDB — see [[02-relational-vs-mongodb]]).

### 2. Schema = a namespace/container that groups tables
- In MySQL, "schema" is actually used as a synonym for **database** (`CREATE SCHEMA` = `CREATE DATABASE`).
- In PostgreSQL/SQL Server, a schema is a namespace *inside* a database that groups related tables (e.g. `sales.orders`, `hr.employees`), letting you organize and separate access within one database.

## Why this structure matters
- Fixed schema + typed columns is what lets the database **enforce correctness** (can't put text into a numeric column, can't leave a required field empty, etc.) — this is the foundation constraints and data integrity build on (see [[06-keys-and-integrity/02-constraints-and-data-integrity]]).
