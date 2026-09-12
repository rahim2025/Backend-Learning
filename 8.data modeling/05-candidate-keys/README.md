# Candidate Keys

A candidate key is any column, or group of columns, that can uniquely identify a row in a table.

Simple definition:

```txt
Candidate Key = a possible choice for primary key
```

## Why Candidate Keys Matter

Before choosing a primary key, a database designer may find multiple possible unique identifiers.

Example `users` table:

| id | email | phone |
| --- | --- | --- |
| 1 | rahim@example.com | 01700000000 |
| 2 | karim@example.com | 01800000000 |

Possible candidate keys:

```txt
id
email
phone
```

Each one could uniquely identify a user if the business rules guarantee uniqueness.

## Candidate Key vs Primary Key

| Concept | Meaning |
| --- | --- |
| Candidate key | Any possible unique identifier |
| Primary key | The candidate key chosen as the main identifier |

Example:

```txt
Candidate keys: id, email, phone
Primary key: id
```

The primary key is selected from candidate keys.

## Candidate Key Rules

A candidate key should be:

| Rule | Meaning |
| --- | --- |
| Unique | No two rows have the same value |
| Not null | Every row must have a value |
| Minimal | No unnecessary columns included |

## Minimality

Minimality means the key should not include extra columns that are not needed for uniqueness.

Example:

```txt
email is unique
```

Then this is not minimal:

```txt
email + name
```

Because `email` alone is enough.

## Example: Students

`students` table:

| student_id | email | national_id | name |
| --- | --- | --- | --- |
| 101 | a@example.com | NID1001 | Asha |
| 102 | b@example.com | NID1002 | Bappy |

Candidate keys:

```txt
student_id
email
national_id
```

Chosen primary key:

```txt
student_id
```

Other candidate keys can still be protected with unique constraints.

## SQL Example

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  name VARCHAR(100)
);
```

Here:

| Column | Role |
| --- | --- |
| `id` | Primary key |
| `email` | Candidate key protected by unique constraint |
| `phone` | Candidate key if phone is required and unique |

Important:

If `phone` can be null, it may not be a strong candidate key for every row.

## Super Key vs Candidate Key

| Concept | Meaning |
| --- | --- |
| Super key | Any set of columns that uniquely identifies a row |
| Candidate key | Minimal super key |

Example:

If `email` is unique:

```txt
email
```

is a candidate key.

But:

```txt
email + name
```

is a super key, not a candidate key, because `name` is unnecessary.

## Alternate Key

An alternate key is a candidate key that was not chosen as the primary key.

Example:

```txt
Candidate keys: id, email
Primary key: id
Alternate key: email
```

In practice, alternate keys are often enforced with `UNIQUE` constraints.

## Backend Example

Login often uses email:

```sql
SELECT *
FROM users
WHERE email = 'rahim@example.com';
```

Even if `email` is not the primary key, it must be unique for login to work correctly.

So `email` can be a candidate key or alternate key.

## Common Mistakes

### Mistake 1: Thinking there can be only one candidate key

A table can have multiple candidate keys.

Example:

```txt
id
email
passport_number
```

### Mistake 2: Choosing unstable data as primary key

Email may be unique, but users may change email addresses.

That is why many backend systems use `id` as the primary key and keep `email` as a unique alternate key.

### Mistake 3: Ignoring business rules

A column is a candidate key only if the business rule guarantees uniqueness.

Example:

```txt
name is not a candidate key because many users can have the same name.
```

## Interview Answer

A candidate key is any minimal column or group of columns that can uniquely identify a row. A table can have multiple candidate keys, but only one is chosen as the primary key. The other candidate keys can become alternate keys and are often enforced using unique constraints.
