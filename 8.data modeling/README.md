# Data Modeling and Database Schema Design

Data modeling is the process of deciding how application data should be organized in a database.

In backend development, good schema design helps keep data:

- Clear
- Consistent
- Easy to query
- Hard to duplicate incorrectly
- Safe from relationship mistakes

Simple definition:

```txt
Data modeling = planning entities, tables, columns, keys, and relationships before building the database
```

## Phase 1 Topics

1. [Entities](01-entities/README.md)
2. [Tables, Rows, Columns](02-tables-rows-columns/README.md)
3. [Primary Keys](03-primary-keys/README.md)
4. [Foreign Keys](04-foreign-keys/README.md)
5. [Candidate Keys](05-candidate-keys/README.md)
6. [Constraints](06-constraints/README.md)
7. [Relationships](07-relationships/README.md)
8. [Normalization: 1NF and 2NF](08-normalization-1nf-2nf/README.md)
9. [Normalization: 3NF](09-normalization-3nf/README.md)
10. [Indexes](10-indexes/README.md)
11. [ACID Properties](11-acid-properties/README.md)

## Why Data Modeling Matters

Backend applications usually work with real-world things:

- Users
- Products
- Orders
- Payments
- Courses
- Posts
- Comments

Data modeling helps convert those real-world things into database structures.

Example:

```txt
Real world: A user can place many orders.

Database model:
users table
orders table
orders.user_id connects each order to one user
```

Without proper modeling, a backend can suffer from:

- Duplicate data
- Invalid relationships
- Difficult queries
- Slow feature development
- Data inconsistency
- Confusing API logic

## Mental Model

```txt
Entity      -> real-world object or concept
Table       -> database structure that stores one type of entity
Row         -> one record in a table
Column      -> one attribute of the entity
Primary Key -> unique identity of each row
Foreign Key -> connection between two tables
Candidate Key -> possible unique identifier for a row
Constraint  -> rule that protects data integrity
Relationship -> connection pattern between tables
Normalization -> organizing tables to reduce redundancy
Index       -> lookup structure that improves search performance
ACID        -> transaction rules for reliable database changes
```

## Example Model

For a simple e-commerce backend:

```txt
Entity: User
Table: users
Columns: id, name, email, password_hash, created_at
Primary Key: id
Candidate Key: email

Entity: Order
Table: orders
Columns: id, user_id, total_amount, status, created_at
Primary Key: id
Foreign Key: user_id references users.id
```

## Interview Summary

Data modeling is the process of designing how data will be represented in a database. It starts by identifying entities, converting them into tables, defining rows and columns, and then using keys to uniquely identify records and connect related tables. Good data modeling makes backend systems easier to query, maintain, and protect from inconsistent data.
