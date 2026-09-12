# Foreign Keys

A foreign key is a column that refers to the primary key of another table.

Simple definition:

```txt
Foreign Key = a column that creates a relationship between tables
```

## Why Foreign Keys Are Needed

Backend systems usually have related data.

Example:

```txt
A user can place many orders.
```

This means:

```txt
users table
orders table
```

The `orders` table needs a way to know which user placed each order.

That is done with a foreign key.

## Example

`users` table:

| id | name |
| --- | --- |
| 1 | Rahim |
| 2 | Karim |

`orders` table:

| id | user_id | total_amount |
| --- | --- | --- |
| 101 | 1 | 500 |
| 102 | 1 | 900 |
| 103 | 2 | 300 |

Here:

```txt
orders.user_id references users.id
```

So:

- Order `101` belongs to user `1`
- Order `102` belongs to user `1`
- Order `103` belongs to user `2`

## SQL Example

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Parent and Child Table

In a foreign key relationship:

| Role | Meaning | Example |
| --- | --- | --- |
| Parent table | Table being referenced | `users` |
| Child table | Table containing the foreign key | `orders` |

Example:

```txt
users.id       -> parent key
orders.user_id -> foreign key
```

## Referential Integrity

Referential integrity means relationships must stay valid.

Example:

```txt
orders.user_id should not point to a user that does not exist.
```

Bad data:

| id | user_id | total_amount |
| --- | --- | --- |
| 104 | 999 | 1000 |

If there is no user with `id = 999`, this order has an invalid relationship.

A foreign key constraint prevents this mistake.

## Common Relationship Types

### One-to-Many

One user can have many orders.

```txt
users.id -> orders.user_id
```

### One-to-One

One user has one profile.

```txt
users.id -> user_profiles.user_id
```

### Many-to-Many

Many students can take many courses.

This usually needs a join table:

```txt
students
courses
enrollments
```

`enrollments` contains foreign keys:

```txt
student_id
course_id
```

## ON DELETE Behavior

Foreign keys can define what happens when a parent row is deleted.

| Behavior | Meaning |
| --- | --- |
| `RESTRICT` / `NO ACTION` | Prevent deleting parent if child rows exist |
| `CASCADE` | Delete related child rows automatically |
| `SET NULL` | Set foreign key column to null |

Example:

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Be careful with `CASCADE`. It can delete many related records automatically.

## Backend Example

API route:

```txt
GET /users/1/orders
```

SQL:

```sql
SELECT *
FROM orders
WHERE user_id = 1;
```

The foreign key makes it possible to find orders that belong to a specific user.

## Common Mistakes

### Mistake 1: Storing repeated parent data instead of a foreign key

Bad:

| order_id | user_name | user_email | total_amount |
| --- | --- | --- | --- |
| 101 | Rahim | rahim@example.com | 500 |

Better:

| order_id | user_id | total_amount |
| --- | --- | --- |
| 101 | 1 | 500 |

Store user details in `users`, then reference the user by `user_id`.

### Mistake 2: Not enforcing relationships

If the database does not enforce foreign keys, invalid child records can appear.

Example:

```txt
Order exists for a deleted user.
```

### Mistake 3: Using unclear foreign key names

Bad:

```txt
owner
ref
parent
```

Better:

```txt
user_id
post_id
course_id
```

## Interview Answer

A foreign key is a column that references the primary key of another table. It is used to create relationships between tables and maintain referential integrity. For example, `orders.user_id` can reference `users.id`, meaning each order belongs to a valid user.
