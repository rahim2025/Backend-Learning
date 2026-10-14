# Primary Key & Foreign Key Concepts

## Primary Key (PK)
- A column (or combination of columns) that **uniquely identifies each row** in a table.
- Rules:
  - Must be **unique** for every row.
  - Cannot be **NULL**.
  - A table can only have **one** primary key (but it can be composite — made of multiple columns).
- Usually auto-incrementing (`AUTO_INCREMENT` in MySQL, `SERIAL`/`IDENTITY` in Postgres/SQL Server) or a UUID.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE
);
```

### Composite primary key
```sql
CREATE TABLE enrollments (
    student_id INT,
    course_id INT,
    PRIMARY KEY (student_id, course_id)
);
```

## Foreign Key (FK)
- A column (or set of columns) in one table that **references the primary key** (or a unique key) of another table.
- Used to establish and enforce a **relationship** between two tables.
- The table containing the FK is the "child"/"referencing" table; the table being pointed to is the "parent"/"referenced" table.

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

- Here, `orders.user_id` must match an existing `users.id`, or be `NULL` (if the column allows nulls).

## Why they matter together
- PK + FK is how relational databases model relationships without duplicating data:
  - **One-to-many**: one `users` row, many `orders` rows referencing it (FK on the "many" side).
  - **Many-to-many**: handled via a **junction/bridge table** with two FKs (e.g. `enrollments` linking `students` and `courses`).
  - **One-to-one**: FK column with a `UNIQUE` constraint.

## Quick contrast

| | Primary Key | Foreign Key |
|---|---|---|
| Purpose | Uniquely identify rows in its own table | Link to a row in another (or the same) table |
| Uniqueness | Must be unique | Can repeat (many rows can point to the same parent) |
| Nullability | Cannot be NULL | Can be NULL (optional relationship) unless constrained |
| Count per table | One PK (possibly composite) | Can have multiple FKs |

See also: [[02-referential-integrity-and-deletion-strategies]]
