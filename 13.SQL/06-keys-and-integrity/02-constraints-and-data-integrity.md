# Constraints and Data Integrity

## What is a constraint?
A rule attached to a column (or table) that the database **enforces automatically** — any `INSERT`/`UPDATE` that violates it is rejected. Constraints are the main mechanism by which relational databases guarantee **data integrity** (data stays accurate, consistent, and valid).

## The main constraint types

### 1. `NOT NULL`
- Forces a column to always have a value.
```sql
name VARCHAR(100) NOT NULL
```

### 2. `UNIQUE`
- Ensures no two rows have the same value in that column (NULLs are generally exempt — multiple NULLs are allowed since NULL ≠ NULL, see [[../05-null-and-three-valued-logic]]).
```sql
email VARCHAR(150) UNIQUE
```
- Can also apply to a combination of columns:
```sql
UNIQUE (student_id, course_id)   -- a student can't enroll in the same course twice
```

### 3. `PRIMARY KEY`
- Combines `NOT NULL` + `UNIQUE`, and marks the column(s) as the row's unique identifier (see [[01-primary-and-foreign-keys]]).

### 4. `FOREIGN KEY`
- Ensures a column's value matches an existing value in another table's primary/unique key — enforces **referential integrity** (see [[05-referential-integrity-and-deletion-strategies]]).

### 5. `CHECK`
- A custom boolean condition every row must satisfy.
```sql
CREATE TABLE products (
    price DECIMAL(10,2) CHECK (price >= 0),
    age INT CHECK (age BETWEEN 0 AND 120)
);
```

### 6. `DEFAULT`
- Not strictly a data-integrity constraint, but related: supplies a value automatically when none is given.
```sql
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
status VARCHAR(20) DEFAULT 'pending'
```

## Full example
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Why constraints matter (vs checking only in application code)
- **Single source of truth**: no matter which app, script, or person writes to the database, the rule is enforced — you can't accidentally bypass it from a one-off script or an admin tool.
- **Impossible to introduce bad data by mistake** — even bugs in application code can't violate the schema's guarantees.
- **Self-documenting**: the schema itself tells you the rules of the data, without needing to read application code.

## Types of integrity these enforce

| Integrity type | What it guarantees | Enforced via |
|---|---|---|
| Entity integrity | Every row is uniquely identifiable | `PRIMARY KEY` |
| Domain integrity | Values are valid for their type/range | Data types, `CHECK`, `NOT NULL` |
| Referential integrity | Relationships between tables stay valid | `FOREIGN KEY` |
| User-defined integrity | Business-specific rules | `CHECK`, triggers, application logic |
