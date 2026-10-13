# Basic SQL Querying

## SELECT — reading data
```sql
SELECT * FROM users;                 -- all columns, all rows
SELECT name, email FROM users;       -- specific columns
SELECT name AS full_name FROM users; -- alias a column
```

## INSERT — adding data
```sql
INSERT INTO users (name, email) VALUES ('Rahim', 'rahim@example.com');

-- multiple rows at once
INSERT INTO users (name, email) VALUES
    ('A', 'a@example.com'),
    ('B', 'b@example.com');
```

## UPDATE — modifying data
```sql
UPDATE users SET email = 'new@example.com' WHERE id = 1;
```
⚠️ Always use `WHERE` with `UPDATE`/`DELETE` — forgetting it updates/deletes **every row**.

## DELETE — removing data
```sql
DELETE FROM users WHERE id = 1;
```

## JOIN — combining related tables
```sql
-- inner join: only rows with a match on both sides
SELECT orders.id, users.name, orders.total
FROM orders
JOIN users ON orders.user_id = users.id;

-- left join: all rows from the left table, matched rows from right (NULL if no match)
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON orders.user_id = users.id;
```

## Aggregate functions
```sql
SELECT COUNT(*) FROM users;
SELECT AVG(total) FROM orders;
SELECT SUM(total), user_id FROM orders GROUP BY user_id;
```

## GROUP BY / HAVING
```sql
-- total spent per user, only show users who spent more than 100
SELECT user_id, SUM(total) AS total_spent
FROM orders
GROUP BY user_id
HAVING SUM(total) > 100;
```
- `WHERE` filters rows **before** grouping; `HAVING` filters groups **after** aggregation.

See also: [[02-filtering-sorting-pagination]]
