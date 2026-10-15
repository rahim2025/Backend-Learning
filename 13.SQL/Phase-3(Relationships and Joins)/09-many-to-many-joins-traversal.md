# Many-to-Many Joins — Traversing Through a Junction Table

To query a many-to-many relationship (see [[01-relationship-types]], [[02-junction-tables]]), you join **through** the junction table — it sits in the middle of two joins, never joined to directly on its own.

## The pattern

```
A  ⟷  junction  ⟷  B
```

To go from A to B, you need **two joins**: A → junction, then junction → B.

## Example: students ↔ enrollments ↔ courses

```sql
-- all courses a specific student is enrolled in
SELECT c.title
FROM students s
JOIN enrollments e ON e.student_id = s.id
JOIN courses c ON c.id = e.course_id
WHERE s.id = 5;
```

- `students` never joins directly to `courses` — there's no FK between them. The path **must** pass through `enrollments`.

## Example: products ↔ product_tags ↔ tags

```sql
-- all products tagged "sale"
SELECT p.name
FROM products p
JOIN product_tags pt ON pt.product_id = p.id
JOIN tags t ON t.id = pt.tag_id
WHERE t.name = 'sale';
```

```sql
-- all tags for a specific product
SELECT t.name
FROM tags t
JOIN product_tags pt ON pt.tag_id = t.id
WHERE pt.product_id = 5;
```

- Note the query can start from either side (`products` or `tags`) — the junction table is what makes the relationship queryable from both directions.

## Preserving unmatched rows across a junction table

Using `INNER JOIN` throughout drops any `student` with zero enrollments, or any `course` with zero enrolled students. If that's undesirable, switch to `LEFT JOIN` at the appropriate step(s):

```sql
-- every student, including those enrolled in nothing
SELECT s.name, c.title
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
LEFT JOIN courses c ON c.id = e.course_id;
```

- `e` will be `NULL` for students with no enrollments, which then makes `c` also `NULL` — both joins need to be `LEFT` for the chain to stay unbroken (see the note on this in [[06-multi-table-joins]]).

## Pulling in relationship-specific data

Since the junction table can store its own data (`grade`, `status`, `enrolled_at` — see [[02-junction-tables]]), include it directly in the `SELECT`:

```sql
SELECT s.name, c.title, e.grade, e.status, e.enrolled_at
FROM students s
JOIN enrollments e ON e.student_id = s.id
JOIN courses c ON c.id = e.course_id
WHERE e.status = 'active';
```

## Counting related records through a junction table

```sql
-- how many courses is each student enrolled in?
SELECT s.name, COUNT(e.course_id) AS course_count
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
GROUP BY s.id, s.name;
```

- `LEFT JOIN` here ensures students with zero enrollments still show up, with `course_count = 0` (`COUNT` of all-NULL rows is `0`, not `NULL` — see aggregate NULL behavior from Phase 2).

See also: [[14-row-multiplication]], [[15-aggregation-problems-after-joins]]
