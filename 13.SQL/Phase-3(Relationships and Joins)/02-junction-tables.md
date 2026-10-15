# Junction Tables

A junction table (a.k.a. "bridge table", "associative table", "join table") sits between two tables to implement a **many-to-many** relationship — see [[01-relationship-types]].

## Shape of a junction table
- Contains (at minimum) **two foreign keys**, one pointing to each side of the relationship.
- Each row = one specific "pairing" / relationship instance between one row of A and one row of B.

## Example: products ↔ product_tags ↔ tags
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE product_tags (                 -- junction table
    product_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (product_id, tag_id),        -- composite PK, see below
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```
- A product can have many tags; a tag can apply to many products.
- Querying "all tags for product #5":
```sql
SELECT tags.name
FROM tags
JOIN product_tags ON product_tags.tag_id = tags.id
WHERE product_tags.product_id = 5;
```

## Example: students ↔ enrollments ↔ courses
```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL
);

CREATE TABLE enrollments (                  -- junction table
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## Storing relationship-specific data on the junction table
Unlike `product_tags` (a pure "is tagged with" link with no extra info), `enrollments` is a great place to store data that describes **the relationship itself** — not the student, not the course, but facts about *that specific enrollment*:

```sql
CREATE TABLE enrollments (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade CHAR(2),                            -- e.g. 'A+', 'B', NULL if not yet graded
    status VARCHAR(20) DEFAULT 'active',      -- e.g. 'active', 'completed', 'dropped'
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```
- `grade` doesn't belong to `students` (a student has a different grade per course) or `courses` (a course has a different grade per student) — it only makes sense **per pairing**, so the junction table is exactly where it belongs.
- Same logic applies to `status` (enrollment status) and `enrolled_at` (when *this* enrollment happened).
- This is the real reason junction tables often get their own meaningful name (`enrollments` rather than just `student_courses`) — once they carry their own data, they stop feeling like "just a link" and start feeling like a real entity in their own right.

## Preventing duplicate relationships
Without a constraint, nothing stops the same pairing being inserted twice (e.g. the same student enrolled in the same course twice by mistake).

### Option 1: composite PRIMARY KEY
```sql
PRIMARY KEY (student_id, course_id)
```
- The combination of both columns must be unique — a second `INSERT` with the same pair fails.
- Also doubles as the main lookup index for the table.

### Option 2: surrogate PK + UNIQUE constraint
```sql
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade CHAR(2),
    UNIQUE (student_id, course_id),           -- enforces no duplicate pairing
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```
- Useful when other tables need to reference **one specific enrollment row** by a single simple id (e.g. a `grade_history` table referencing `enrollments.id`), rather than by the `(student_id, course_id)` pair.

### Which to choose
| | Composite PK | Surrogate PK + UNIQUE |
|---|---|---|
| Simpler when nothing else needs to reference a row directly | ✅ | |
| Other tables need a single FK to reference one relationship row | | ✅ |
| Slightly smaller/faster joins (no extra `id` column) | ✅ | |

See also: [[09-many-to-many-joins-traversal]] for querying through a junction table.
