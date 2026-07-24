# Indexes

An index is a database structure that helps the database find rows faster.

Simple definition:

```txt
Index = a lookup structure that helps the database search without scanning every row
```

Indexes are important in backend systems because APIs often search, filter, sort, and join data.

## Why Indexes Matter

Without an index, the database may need to scan the whole table.

This is called a full table scan.

Example:

```sql
SELECT *
FROM users
WHERE email = 'rahim@example.com';
```

If the `users` table has 10 million rows and `email` has no index, the database may check many rows to find the matching email.

With an index on `email`, the database can find the row much faster.

## Full Table Scan

A full table scan means the database checks rows one by one.

Simple definition:

```txt
Full table scan = database searches through the whole table to find matching rows
```

This can be slow for large tables.

Example:

```txt
users table has 5,000,000 rows.
Query searches by email.
No index exists on email.
Database may scan many rows.
```

## How an Index Helps

An index works like a book index.

In a book:

```txt
You do not read every page to find a topic.
You check the index and jump to the right page.
```

In a database:

```txt
The database does not always scan every row.
It can use the index to find matching rows faster.
```

## Normal Index

A normal index improves lookup performance but allows duplicate values.

Simple definition:

```txt
Normal index = speeds up searches but does not enforce uniqueness
```

Example:

```sql
CREATE INDEX idx_orders_user_id
ON orders (user_id);
```

This helps queries like:

```sql
SELECT *
FROM orders
WHERE user_id = 1;
```

Duplicate values are allowed.

Example:

| id | user_id | total_amount |
| --- | --- | --- |
| 101 | 1 | 500 |
| 102 | 1 | 900 |
| 103 | 1 | 1200 |

This is valid because one user can have many orders.

So `orders.user_id` should usually have a normal index, not a unique index.

## Unique Index

A unique index improves lookup performance and enforces uniqueness.

Simple definition:

```txt
Unique index = speeds up searches and prevents duplicate values
```

Example:

```sql
CREATE UNIQUE INDEX idx_users_email
ON users (email);
```

This helps queries like:

```sql
SELECT *
FROM users
WHERE email = 'rahim@example.com';
```

It also prevents duplicate emails:

| id | email |
| --- | --- |
| 1 | rahim@example.com |
| 2 | rahim@example.com |

The second row should fail because `email` must be unique.

## Normal Index vs Unique Index

| Feature | Normal index | Unique index |
| --- | --- | --- |
| Speeds up lookups | Yes | Yes |
| Allows duplicate values | Yes | No |
| Enforces business rule | No | Yes |
| Common example | `orders.user_id` | `users.email` |

## Indexes and Business Rules

Index decisions should consider business rules.

If the business says a value must be unique, use a unique constraint or unique index.

Examples:

| Business rule | Good index choice |
| --- | --- |
| User email must be unique | Unique index on `users.email` |
| Username must be unique | Unique index on `users.username` |
| Product SKU must be unique | Unique index on `products.sku` |
| One user can have many orders | Normal index on `orders.user_id` |

Important:

```txt
Use unique indexes for uniqueness rules.
Use normal indexes for faster searching where duplicates are valid.
```

## Indexes and Query Patterns

Index decisions should also consider query patterns.

Query pattern means how the application commonly searches data.

Examples:

```sql
SELECT *
FROM users
WHERE email = 'rahim@example.com';
```

Good index:

```sql
CREATE UNIQUE INDEX idx_users_email
ON users (email);
```

Another query:

```sql
SELECT *
FROM orders
WHERE user_id = 1;
```

Good index:

```sql
CREATE INDEX idx_orders_user_id
ON orders (user_id);
```

Another query:

```sql
SELECT *
FROM posts
WHERE status = 'published'
ORDER BY created_at DESC;
```

Possible helpful index:

```sql
CREATE INDEX idx_posts_status_created_at
ON posts (status, created_at);
```

## When to Add an Index

Add an index when:

- A column is searched often with `WHERE`
- A column is used often in `JOIN`
- A column is used often in `ORDER BY`
- A column is used often in `GROUP BY`
- A column must be unique

Examples:

| Column | Reason |
| --- | --- |
| `users.email` | Login searches by email and email must be unique |
| `orders.user_id` | Find all orders for a user |
| `comments.post_id` | Find all comments for a post |
| `products.sku` | SKU lookup and uniqueness |

## Foreign Keys and Indexes

Foreign keys are often searched and joined.

Example:

```sql
SELECT *
FROM orders
WHERE user_id = 1;
```

Because `orders.user_id` is a foreign key, indexing it is often useful.

Example:

```sql
CREATE INDEX idx_orders_user_id
ON orders (user_id);
```

This helps when finding child rows for a parent row.

## Indexes Are Not Free

Indexes improve reads, but they have costs.

Costs:

- They use extra storage
- Inserts can become slower
- Updates can become slower
- Deletes can become slower
- Too many indexes can confuse maintenance

Why writes can become slower:

```txt
When a row is inserted or updated, the database may also need to update the index.
```

So do not index every column blindly.

## Bad Index Choices

### Indexing a column that is rarely searched

Bad:

```sql
CREATE INDEX idx_users_middle_name
ON users (middle_name);
```

If the app almost never searches by `middle_name`, this index may not help.

### Using a unique index when duplicates are valid

Bad:

```sql
CREATE UNIQUE INDEX idx_orders_user_id
ON orders (user_id);
```

Problem:

```txt
This allows only one order per user.
```

Better:

```sql
CREATE INDEX idx_orders_user_id
ON orders (user_id);
```

### Forgetting a unique index for login identity

Bad:

```txt
users.email is used for login but has no unique index.
```

Problem:

```txt
Two accounts can have the same email.
Login becomes ambiguous.
```

Better:

```sql
CREATE UNIQUE INDEX idx_users_email
ON users (email);
```

## Index and Constraint Relationship

A unique constraint and a unique index are closely related.

In many databases, creating a `UNIQUE` constraint creates a unique index internally.

Example:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);
```

This enforces uniqueness and usually gives indexed lookup behavior for `email`.

## Composite Index

A composite index uses multiple columns.

Simple definition:

```txt
Composite index = one index built from more than one column
```

Example:

```sql
CREATE INDEX idx_orders_user_status
ON orders (user_id, status);
```

This can help queries like:

```sql
SELECT *
FROM orders
WHERE user_id = 1
  AND status = 'paid';
```

Composite indexes should match real query patterns.

## Leftmost Prefix Rule

The leftmost prefix rule means a composite index is most useful when a query uses the leftmost column or columns of the index.

Simple definition:

```txt
Leftmost Prefix Rule = a composite index works from left to right
```

Example index:

```sql
CREATE INDEX idx_orders_user_status_created
ON orders (user_id, status, created_at);
```

Column order:

```txt
1. user_id
2. status
3. created_at
```

This index can help queries that use:

| Query columns | Can use the index well? | Why |
| --- | --- | --- |
| `user_id` | Yes | Uses the leftmost column |
| `user_id, status` | Yes | Uses the first two columns in order |
| `user_id, status, created_at` | Yes | Uses all indexed columns in order |
| `status` only | Usually no | Skips the leftmost column |
| `created_at` only | Usually no | Skips earlier columns |
| `status, created_at` | Usually no | Starts from the second column |

Good query:

```sql
SELECT *
FROM orders
WHERE user_id = 1
  AND status = 'paid';
```

This can use:

```txt
idx_orders_user_status_created
```

because the query uses `user_id` first, then `status`.

Weak query for this index:

```sql
SELECT *
FROM orders
WHERE status = 'paid';
```

This does not use the leftmost column `user_id`, so the composite index is usually not very helpful.

## Why Column Order Matters

Column order matters because the database reads a composite index from left to right.

Example:

```sql
CREATE INDEX idx_orders_user_status
ON orders (user_id, status);
```

This is different from:

```sql
CREATE INDEX idx_orders_status_user
ON orders (status, user_id);
```

Both indexes contain the same columns, but they are ordered differently.

The best order depends on query patterns.

If the common query is:

```sql
SELECT *
FROM orders
WHERE user_id = 1
  AND status = 'paid';
```

Both indexes may help.

But if another common query is:

```sql
SELECT *
FROM orders
WHERE user_id = 1;
```

Then this index is better:

```sql
CREATE INDEX idx_orders_user_status
ON orders (user_id, status);
```

Because `user_id` is the leftmost column.

If the common query is:

```sql
SELECT *
FROM orders
WHERE status = 'paid';
```

Then this index may be better:

```sql
CREATE INDEX idx_orders_status_user
ON orders (status, user_id);
```

Because `status` is the leftmost column.

## Choosing Composite Index Column Order

When choosing column order, think about:

- Which column is searched most often by itself
- Which columns are commonly searched together
- Which column has higher selectivity
- Which columns are used for sorting
- Which query is more important for the application

Selectivity means how well a column narrows down rows.

Example:

```txt
email is highly selective because one email usually matches one user.
status is less selective because many rows can have status = 'paid'.
```

But do not choose only by selectivity.

Business queries matter more.

## Composite Index vs Multiple Single-Column Indexes

Sometimes one composite index is better than multiple single-column indexes.

Example:

```sql
CREATE INDEX idx_orders_user_id
ON orders (user_id);

CREATE INDEX idx_orders_status
ON orders (status);
```

These are two separate single-column indexes.

For this query:

```sql
SELECT *
FROM orders
WHERE user_id = 1
  AND status = 'paid';
```

The database may use one index and then filter the remaining rows.

Better option:

```sql
CREATE INDEX idx_orders_user_status
ON orders (user_id, status);
```

This composite index is often better because it stores the combined search path:

```txt
Find orders for user_id = 1 and status = 'paid'
```

instead of:

```txt
Find rows by user_id, then separately deal with status
```

## Why Composite Indexes Often Outperform Multiple Single-Column Indexes

A composite index can be faster because:

- It matches the full query condition
- It reduces filtering after the index lookup
- It can support sorting by the indexed column order
- It can avoid extra work combining multiple indexes
- It stores related search columns together

Example query:

```sql
SELECT *
FROM orders
WHERE user_id = 1
  AND status = 'paid'
ORDER BY created_at DESC;
```

Possible composite index:

```sql
CREATE INDEX idx_orders_user_status_created
ON orders (user_id, status, created_at);
```

This index matches the query pattern:

```txt
Filter by user_id
Filter by status
Sort by created_at
```

That is usually stronger than three separate indexes:

```sql
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at);
```

Important:

Composite indexes are not always better.

They are better when the query commonly uses those columns together in a matching order.

## Backend Examples

### Login

Query:

```sql
SELECT *
FROM users
WHERE email = 'rahim@example.com';
```

Index:

```sql
CREATE UNIQUE INDEX idx_users_email
ON users (email);
```

Reason:

```txt
Email is searched often and must be unique.
```

### User Orders

Query:

```sql
SELECT *
FROM orders
WHERE user_id = 1;
```

Index:

```sql
CREATE INDEX idx_orders_user_id
ON orders (user_id);
```

Reason:

```txt
user_id is searched often, but duplicate user_id values are valid.
```

### Product SKU

Query:

```sql
SELECT *
FROM products
WHERE sku = 'KEYBOARD-001';
```

Index:

```sql
CREATE UNIQUE INDEX idx_products_sku
ON products (sku);
```

Reason:

```txt
SKU is searched often and should uniquely identify a product.
```

## Decision Checklist

Before adding an index, ask:

```txt
Is this column searched often?
Is this column used in joins?
Is this column used for sorting?
Is this column required to be unique by business rules?
Will duplicate values be valid?
Would a composite index match the common multi-column query?
Does the column order follow the leftmost prefix rule?
Will the index cost be worth the read performance gain?
```

## Common Mistakes

### Mistake 1: Thinking indexes only improve performance

Normal indexes improve performance.

Unique indexes improve performance and enforce uniqueness.

### Mistake 2: Adding indexes without checking queries

Bad:

```txt
Index every column just in case.
```

Better:

```txt
Index columns based on real query patterns.
```

### Mistake 3: Forgetting business rules

If a column must be unique, a normal index is not enough.

Bad:

```sql
CREATE INDEX idx_users_email
ON users (email);
```

Better:

```sql
CREATE UNIQUE INDEX idx_users_email
ON users (email);
```

### Mistake 4: Making a foreign key unique accidentally

If one user can have many orders, `orders.user_id` should not be unique.

Bad:

```sql
CREATE UNIQUE INDEX idx_orders_user_id
ON orders (user_id);
```

Better:

```sql
CREATE INDEX idx_orders_user_id
ON orders (user_id);
```

### Mistake 5: Ignoring the leftmost prefix rule

Bad assumption:

```txt
An index on (user_id, status) is equally useful for searching by status only.
```

Reality:

```txt
The index starts with user_id, so status-only queries usually need a different index.
```

### Mistake 6: Creating many single-column indexes instead of one useful composite index

Bad:

```sql
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at);
```

If the common query uses all three columns together, a composite index may be better:

```sql
CREATE INDEX idx_orders_user_status_created
ON orders (user_id, status, created_at);
```

## Quick Comparison

| Topic | Key idea |
| --- | --- |
| Index | Helps database find rows faster |
| Full table scan | Database checks many/all rows |
| Normal index | Improves lookup performance, allows duplicates |
| Unique index | Improves lookup performance, prevents duplicates |
| Composite index | One index over multiple columns |
| Leftmost prefix rule | Composite index works from left to right |
| Column order | Determines which queries can use the index well |
| Business rule | Decides whether uniqueness is needed |
| Query pattern | Decides whether search performance is needed |

## Interview Answer

Indexes speed up database searches by helping the database avoid full table scans. A normal index improves lookup performance but still allows duplicate values, while a unique index improves lookup performance and also enforces uniqueness. A composite index uses multiple columns and is most useful when queries match the leftmost prefix of the index. Column order matters because an index like `(user_id, status)` is not the same as `(status, user_id)`. Composite indexes often outperform multiple single-column indexes when the query commonly filters or sorts by those columns together. Index decisions should be based on business rules and real query patterns.
