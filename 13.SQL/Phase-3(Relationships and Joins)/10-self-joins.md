# Self Joins

A self join joins a table **to itself** — useful whenever rows in a table relate to *other rows in the same table*.

## Why self joins are needed

Some relationships are hierarchical or peer-to-peer **within one table**: an employee's manager is also an employee; a subcategory's parent is also a category. There's no separate "managers" table — it's the same table, just a different row.

## Using aliases to represent different roles of the same table

Since you're referencing the same table twice, you **must** alias it at least once (practically, alias both copies) so the database (and the reader) can tell which "role" each reference means.

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```

- `employees` is read twice — once as `e` (the "employee" role), once as `m` (the "manager" role).
- `e.manager_id` points to `m.id` — i.e. "this employee's manager is that row."

## Example: Employees and managers

```sql
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manager_id INT,                         -- FK pointing back into the SAME table
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);
```

```sql
-- every employee with their manager's name
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
-- LEFT JOIN so top-level employees (e.g. the CEO, with manager_id = NULL) still appear, with manager = NULL
```

## Example: Parent/child categories

```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT,                          -- NULL for top-level categories
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

```sql
-- every category with its parent's name
SELECT child.name AS category, parent.name AS parent_category
FROM categories child
LEFT JOIN categories parent ON child.parent_id = parent.id;
```

```
categories:
id | name          | parent_id
1  | Electronics   | NULL
2  | Laptops       | 1
3  | Gaming Laptops| 2

result:
category         | parent_category
Electronics       | NULL
Laptops           | Electronics
Gaming Laptops    | Laptops
```

## Self joins are just regular joins — same rules apply

- Can be `INNER JOIN` (only pairs where both roles exist) or `LEFT JOIN` (preserve rows with no match, e.g. the top of a hierarchy with no parent) — same decision process as [[03-inner-join]] / [[04-left-join]].
- Can have calculated columns, `WHERE` filters, `GROUP BY`, etc. — it behaves exactly like joining two unrelated tables; the only special part is that both "tables" happen to be the same physical table, which is why the aliases are mandatory (unaliased `employees.name` would be ambiguous — which copy?).

## One level only — self joins don't recurse automatically

A single self join only reaches **one level** up/down the hierarchy (employee → direct manager; category → direct parent). To go multiple levels deep (e.g. "find the whole management chain" or "all descendant categories"), you'd typically need either multiple chained self joins (fixed depth) or a recursive CTE (`WITH RECURSIVE`) — a later/advanced topic beyond this phase.
