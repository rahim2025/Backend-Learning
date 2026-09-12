# Tables, Rows, Columns

Tables, rows, and columns are the basic building blocks of a relational database.

Simple definition:

```txt
Table = stores one type of entity
Row = one record inside a table
Column = one attribute/field of that record
```

## Table

A table stores data about one entity type.

Example:

```txt
Entity: User
Table: users
```

The `users` table stores user records.

Example table:

| id | name | email |
| --- | --- | --- |
| 1 | Rahim | rahim@example.com |
| 2 | Karim | karim@example.com |

## Row

A row is one record in a table.

In the `users` table:

```txt
1, Rahim, rahim@example.com
```

is one row.

Each row represents one user.

## Column

A column represents one attribute of the entity.

In the `users` table:

```txt
id
name
email
```

are columns.

Each column should store one type of information.

## Entity to Table Mapping

Usually:

```txt
Entity -> Table
Attribute -> Column
Instance -> Row
```

Example:

| Modeling idea | Database structure |
| --- | --- |
| User entity | `users` table |
| User name attribute | `name` column |
| One actual user | One row |

## Example: Products Table

Entity:

```txt
Product
```

Attributes:

```txt
id
name
price
stock_quantity
created_at
```

Table:

| id | name | price | stock_quantity | created_at |
| --- | --- | --- | --- | --- |
| 1 | Keyboard | 2500 | 15 | 2026-01-10 |
| 2 | Mouse | 900 | 40 | 2026-01-11 |

## SQL Example

```sql
CREATE TABLE users (
  id INT,
  name VARCHAR(100),
  email VARCHAR(255),
  created_at TIMESTAMP
);
```

Here:

| Part | Meaning |
| --- | --- |
| `users` | Table name |
| `id` | Column |
| `name` | Column |
| `email` | Column |
| One inserted user | Row |

## Naming Tables and Columns

Common backend convention:

```txt
Table names: plural snake_case
Column names: singular snake_case
```

Examples:

```txt
users
blog_posts
order_items
```

Columns:

```txt
id
user_id
created_at
total_amount
```

## Common Mistakes

### Mistake 1: Putting multiple values in one column

Bad:

| id | phone_numbers |
| --- | --- |
| 1 | 017..., 018..., 019... |

Better:

Create a separate `user_phone_numbers` table if multiple phone numbers must be stored.

### Mistake 2: Mixing different entities in one table

Bad:

```txt
users table also stores order total and payment status
```

Better:

```txt
users table stores users
orders table stores orders
payments table stores payments
```

### Mistake 3: Not choosing clear column names

Bad:

```txt
data
info
value
```

Better:

```txt
email
status
total_amount
```

## Interview Answer

A table stores records for one entity type. A row represents one actual record in that table, and a column represents one attribute of the entity. For example, a `users` table stores user data, each row is one user, and columns like `id`, `name`, and `email` describe each user.
