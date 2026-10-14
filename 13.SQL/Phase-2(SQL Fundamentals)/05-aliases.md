# Aliases (AS)

An alias gives a **temporary name** to a column or table, used only within that query.

## Column aliases
```sql
SELECT name AS full_name, age AS years_old FROM users;

-- AS is optional in most databases
SELECT name full_name FROM users;
```
Useful for:
- Making output more readable (`SUM(total) AS total_spent`).
- Renaming computed/expression columns, which otherwise have ugly auto-generated names:
```sql
SELECT price * quantity AS line_total FROM order_items;
```

## Table aliases
```sql
SELECT u.name, o.total
FROM users AS u
JOIN orders AS o ON o.user_id = u.id;

-- AS is optional here too
SELECT u.name, o.total
FROM users u
JOIN orders o ON o.user_id = u.id;
```
Useful for:
- **Shortening** long table names so the rest of the query is less verbose.
- **Required** when joining a table to itself (self-join) — the two "copies" need different names to be distinguishable.
```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```

## Important gotcha: aliases and WHERE
A **column alias** defined in `SELECT` generally **cannot** be used in the `WHERE` clause of the same query — because of logical processing order, `WHERE` runs *before* `SELECT` assigns the alias (see [[10-logical-processing-order]]).

```sql
-- ❌ this fails in most databases (alias not yet defined when WHERE runs)
SELECT price * quantity AS line_total
FROM order_items
WHERE line_total > 100;

-- ✅ repeat the expression instead
SELECT price * quantity AS line_total
FROM order_items
WHERE price * quantity > 100;
```

- Aliases **can** be used in `ORDER BY` and `GROUP BY` in most databases (MySQL allows both), since those clauses conceptually run after `SELECT`.
```sql
SELECT price * quantity AS line_total
FROM order_items
ORDER BY line_total DESC;   -- ✅ works
```

## Rule of thumb
> Use aliases freely for readability in `SELECT`/`ORDER BY`/`GROUP BY`, but remember `WHERE` (and `HAVING`, in some databases) may need the full expression repeated instead of the alias.

See also: [[10-logical-processing-order]]
