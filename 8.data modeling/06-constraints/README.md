# Constraints

Constraints are rules added to database columns or tables to protect data quality.

Simple definition:

```txt
Constraint = a database rule that prevents invalid data from being stored
```

Constraints are important because backend validation alone is not enough. Even if the API has validation, data can still enter the database from scripts, admin tools, migrations, imports, or another service.

## Why Constraints Matter

Good constraints help prevent:

- Missing required values
- Duplicate values
- Invalid numbers
- Invalid statuses
- Wrong default behavior
- Data that breaks backend logic

Example:

```txt
User email should not be missing.
Two users should not have the same email.
Product price should not be negative.
Order status should have a default value.
```

These rules should be protected at the database level.

## Common Constraints

| Constraint | Purpose |
| --- | --- |
| `NOT NULL` | Prevents empty/missing values |
| `UNIQUE` | Prevents duplicate values |
| `CHECK` | Ensures values follow a condition |
| `DEFAULT` | Provides a value automatically when none is given |

## NOT NULL

`NOT NULL` means a column must always have a value.

Simple definition:

```txt
NOT NULL = this column cannot be empty
```

Example:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL
);
```

Here:

```txt
name must have a value
email must have a value
```

Invalid insert:

```sql
INSERT INTO users (id, name, email)
VALUES (1, NULL, 'rahim@example.com');
```

This should fail because `name` is `NOT NULL`.

## When to Use NOT NULL

Use `NOT NULL` when a value is required for the row to make sense.

Examples:

| Table | Column | Why |
| --- | --- | --- |
| `users` | `email` | User login may require email |
| `products` | `name` | Product must have a name |
| `orders` | `user_id` | Order must belong to a user |
| `payments` | `amount` | Payment needs an amount |

## UNIQUE

`UNIQUE` means no two rows can have the same value in that column or group of columns.

Simple definition:

```txt
UNIQUE = duplicate values are not allowed
```

Example:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);
```

This means:

```txt
Every user must have a different email.
```

Invalid data:

| id | email |
| --- | --- |
| 1 | rahim@example.com |
| 2 | rahim@example.com |

The second row should fail because the email already exists.

## UNIQUE on Multiple Columns

Sometimes one column alone is not unique, but a combination is unique.

Example:

```sql
CREATE TABLE enrollments (
  id INT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  UNIQUE (student_id, course_id)
);
```

This means:

```txt
The same student cannot enroll in the same course twice.
```

But:

- One student can enroll in many courses
- One course can have many students

## CHECK

`CHECK` ensures that a value follows a condition.

Simple definition:

```txt
CHECK = value must satisfy a rule
```

Example:

```sql
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) CHECK (price >= 0)
);
```

This prevents negative prices.

Invalid insert:

```sql
INSERT INTO products (id, name, price)
VALUES (1, 'Keyboard', -500);
```

This should fail because `price >= 0` is false.

## More CHECK Examples

### Order Status

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'cancelled'))
);
```

This allows only:

```txt
pending
paid
cancelled
```

### User Age

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  age INT CHECK (age >= 18)
);
```

This prevents users under 18 if the business rule requires adult users.

### Quantity

```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY,
  quantity INT CHECK (quantity > 0)
);
```

This prevents zero or negative order quantities.

## DEFAULT

`DEFAULT` gives a column an automatic value when no value is provided.

Simple definition:

```txt
DEFAULT = use this value if no value is given
```

Example:

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'pending'
);
```

Insert:

```sql
INSERT INTO orders (id)
VALUES (1);
```

Result:

| id | status |
| --- | --- |
| 1 | pending |

The database automatically uses `pending`.

## Common DEFAULT Examples

### Created Time

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

If no `created_at` is provided, the database uses the current timestamp.

### Boolean Flag

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

New users are active by default.

### Order Status

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
);
```

New orders start as `pending`.

## Combining Constraints

A column can have multiple constraints.

Example:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  age INT CHECK (age >= 18)
);
```

Meaning:

| Column | Rule |
| --- | --- |
| `email` | Required and unique |
| `name` | Required |
| `role` | Required, defaults to `user` |
| `age` | Must be at least 18 |

## Constraints vs Backend Validation

Backend validation and database constraints work together.

| Layer | Responsibility |
| --- | --- |
| Backend validation | Gives friendly error messages before database write |
| Database constraints | Guarantees invalid data cannot be stored |

Example:

```txt
Backend checks if email is missing.
Database NOT NULL still protects the email column.
Backend checks if email already exists.
Database UNIQUE still prevents race-condition duplicates.
```

Important:

Do not rely only on backend validation for important data rules.

## Backend Race Condition Example

Imagine two signup requests arrive at almost the same time:

```txt
Request A checks email: available
Request B checks email: available
Request A inserts email
Request B inserts same email
```

If there is no `UNIQUE` constraint, duplicate users can be created.

With `UNIQUE`, the database rejects the second insert.

## Common Mistakes

### Mistake 1: Using only application validation

Bad:

```txt
Only Express.js validates email uniqueness.
Database has no UNIQUE constraint.
```

Problem:

```txt
Race conditions or manual imports can still create duplicate emails.
```

Better:

```sql
email VARCHAR(255) UNIQUE NOT NULL
```

### Mistake 2: Forgetting NOT NULL on required fields

Bad:

```sql
email VARCHAR(255)
```

Better:

```sql
email VARCHAR(255) NOT NULL
```

### Mistake 3: Using DEFAULT for values that should be explicit

Do not use defaults when the user or business process must intentionally choose the value.

Example:

```txt
payment_status should not silently default to paid.
```

That could create dangerous data.

### Mistake 4: Writing weak CHECK rules

Bad:

```sql
CHECK (price != 0)
```

This still allows negative prices.

Better:

```sql
CHECK (price > 0)
```

## Quick Comparison

| Constraint | Example | Protects against |
| --- | --- | --- |
| `NOT NULL` | `email NOT NULL` | Missing required data |
| `UNIQUE` | `email UNIQUE` | Duplicate values |
| `CHECK` | `price CHECK (price > 0)` | Invalid values |
| `DEFAULT` | `status DEFAULT 'pending'` | Missing common starting values |

## Interview Answer

Constraints are database rules that protect data integrity. `NOT NULL` ensures a column always has a value, `UNIQUE` prevents duplicate values, `CHECK` enforces a condition, and `DEFAULT` automatically supplies a value when none is provided. Backend validation is useful for user-friendly errors, but database constraints are necessary because they guarantee data correctness at the storage level.
