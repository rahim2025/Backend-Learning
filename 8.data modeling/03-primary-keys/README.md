# Primary Keys

A primary key is a column, or a group of columns, that uniquely identifies each row in a table.

Simple definition:

```txt
Primary Key = unique identity of each row
```

## Why Primary Keys Are Needed

Without a primary key, it can be difficult to identify one exact row.

Example `users` table without an `id`:

| name | email |
| --- | --- |
| Rahim | rahim@example.com |
| Rahim | rahim2@example.com |

If two users have the same name, `name` cannot safely identify one user.

With a primary key:

| id | name | email |
| --- | --- | --- |
| 1 | Rahim | rahim@example.com |
| 2 | Rahim | rahim2@example.com |

Now each row has a unique identity.

## Rules of Primary Keys

A primary key should be:

| Rule | Meaning |
| --- | --- |
| Unique | No two rows can have the same primary key value |
| Not null | Every row must have a primary key value |
| Stable | The value should not change often |
| Minimal | Use only the column or columns needed for identity |

## SQL Example

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255)
);
```

Here, `id` uniquely identifies each user.

## Auto-Increment Primary Key

Many SQL databases support auto-generated numeric IDs.

Example:

```sql
CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255)
);
```

Then the database creates `id` values automatically.

## UUID Primary Key

A UUID is a long unique value.

Example:

```txt
550e8400-e29b-41d4-a716-446655440000
```

UUIDs are often useful when:

- IDs are generated across multiple systems
- Public URLs should not reveal sequential numbers
- Distributed systems need unique identifiers

Example:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255)
);
```

## Natural Key vs Surrogate Key

| Type | Meaning | Example |
| --- | --- | --- |
| Natural key | Real-world meaningful value | `email`, national ID |
| Surrogate key | Artificial database-generated value | `id`, UUID |

Example:

```txt
email can identify a user, but email can change.
id is artificial, but stable.
```

For most backend apps, a surrogate key like `id` is commonly used as the primary key.

## Composite Primary Key

A composite primary key uses multiple columns together.

Example:

```sql
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  enrolled_at TIMESTAMP,
  PRIMARY KEY (student_id, course_id)
);
```

Here, one student can enroll in many courses, and one course can have many students.

But the same student should not enroll in the same course twice.

So this pair is unique:

```txt
student_id + course_id
```

## Backend Example

API route:

```txt
GET /users/5
```

The backend uses the primary key:

```sql
SELECT * FROM users WHERE id = 5;
```

The primary key allows the backend to find exactly one user.

## Common Mistakes

### Mistake 1: Using a value that can change

Bad primary key:

```txt
email
```

Problem:

```txt
Users can change email addresses.
```

Better:

```txt
id
```

### Mistake 2: Allowing duplicate identity

Bad:

```txt
No primary key on orders
```

Problem:

```txt
Cannot reliably identify one order.
```

### Mistake 3: Confusing primary key with display value

The primary key is for identity, not for showing pretty data to users.

## Interview Answer

A primary key uniquely identifies each row in a table. It must be unique and not null. In most backend applications, tables use a stable surrogate key like `id` as the primary key, so the application can safely find, update, or delete one exact record.
