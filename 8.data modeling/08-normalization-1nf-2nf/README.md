# Normalization: 1NF and 2NF

Normalization is the process of organizing database tables to reduce duplicate data and avoid update problems.

Simple definition:

```txt
Normalization = designing tables so data is stored in the right place with less repetition
```

In database schema design, normalization helps make data:

- Cleaner
- Less duplicated
- Easier to update
- Easier to maintain
- More consistent

## Why Normalization Matters

Bad database design often creates repeated data.

Repeated data causes problems when the same value must be updated in many places.

Example:

```txt
Student name is repeated in many course enrollment rows.
If the student's name changes, every repeated row must be updated.
If one row is missed, the database becomes inconsistent.
```

Normalization fixes this by splitting data into better tables.

## Normal Forms

Normal forms are levels of database organization.

Common normal forms:

| Normal Form | Main idea |
| --- | --- |
| `1NF` | Every column contains atomic values |
| `2NF` | Every non-key column depends on the entire primary key |
| `3NF` | Non-key columns should not depend on other non-key columns |

This note focuses on `1NF` and `2NF`.

## 1NF: First Normal Form

`1NF` means every column should contain atomic values.

Simple definition:

```txt
1NF = every column contains one value, not a list or repeated group
```

Atomic means the value cannot be usefully divided further for the database's purpose.

## Bad Example: Not in 1NF

Bad table:

| student_id | student_name | courses |
| --- | --- | --- |
| 1 | Rahim | Database, Node.js, React |
| 2 | Karim | Database, Express |

Problem:

```txt
courses contains multiple values in one column.
```

This breaks `1NF`.

## Why This Is a Problem

If values are stored as a list in one column:

- Searching becomes harder
- Filtering becomes harder
- Joining becomes harder
- Foreign keys cannot protect each course value
- Updating one course name becomes risky

Bad query problem:

```sql
SELECT *
FROM students
WHERE courses LIKE '%Node.js%';
```

This is weak design because the database is searching inside a string instead of using proper rows and relationships.

## Fixed Example: In 1NF

Better design:

`students` table:

| id | name |
| --- | --- |
| 1 | Rahim |
| 2 | Karim |

`student_courses` table:

| student_id | course_name |
| --- | --- |
| 1 | Database |
| 1 | Node.js |
| 1 | React |
| 2 | Database |
| 2 | Express |

Now every column contains one value.

This satisfies `1NF`.

## 1NF Rule

To satisfy `1NF`:

- Each column should contain a single value
- Do not store comma-separated lists
- Do not store repeated groups like `course1`, `course2`, `course3`
- Each row should represent one clear record

Bad repeated columns:

| student_id | course1 | course2 | course3 |
| --- | --- | --- | --- |
| 1 | Database | Node.js | React |

Better:

| student_id | course_name |
| --- | --- |
| 1 | Database |
| 1 | Node.js |
| 1 | React |

## 2NF: Second Normal Form

`2NF` means every non-key column must depend on the entire primary key.

Simple definition:

```txt
2NF = no non-key column should depend on only part of a composite primary key
```

Important:

`2NF` mainly matters when a table has a composite primary key.

A composite primary key uses more than one column.

Example:

```txt
PRIMARY KEY (student_id, course_id)
```

## Key Column vs Non-Key Column

| Term | Meaning |
| --- | --- |
| Key column | Column that is part of the primary key |
| Non-key column | Column that is not part of the primary key |

Example:

| student_id | course_id | student_name | course_title |
| --- | --- | --- | --- |
| 1 | 10 | Rahim | Database Design |

If the primary key is:

```txt
student_id + course_id
```

Then:

```txt
student_id and course_id are key columns.
student_name and course_title are non-key columns.
```

## Bad Example: Not in 2NF

Table:

| student_id | course_id | student_name | course_title | enrolled_at |
| --- | --- | --- | --- | --- |
| 1 | 10 | Rahim | Database Design | 2026-01-10 |
| 1 | 20 | Rahim | Node.js | 2026-01-12 |
| 2 | 10 | Karim | Database Design | 2026-01-15 |

Primary key:

```txt
student_id + course_id
```

Problem:

```txt
student_name depends only on student_id.
course_title depends only on course_id.
```

But `2NF` says every non-key column must depend on the entire primary key.

## Partial Dependency

A partial dependency happens when a non-key column depends on only part of a composite primary key.

Simple definition:

```txt
Partial dependency = a non-key column depends on part of the primary key, not the whole key
```

In this table:

```txt
student_name depends only on student_id
course_title depends only on course_id
enrolled_at depends on student_id + course_id
```

So:

| Column | Depends on | Problem? |
| --- | --- | --- |
| `student_name` | `student_id` only | Partial dependency |
| `course_title` | `course_id` only | Partial dependency |
| `enrolled_at` | `student_id + course_id` | Correct |

## Why Partial Dependencies Create Redundancy

Partial dependencies create repeated data.

Example:

```txt
Rahim appears in every row for Rahim's courses.
Database Design appears for every student enrolled in that course.
```

This causes redundancy.

Redundancy means the same data is stored multiple times.

## Problems Caused by Redundancy

### Update Problem

If Rahim changes his name, multiple rows must be updated.

Bad situation:

| student_id | course_id | student_name |
| --- | --- | --- |
| 1 | 10 | Rahim Uddin |
| 1 | 20 | Rahim |

Now the same student has inconsistent names.

### Insert Problem

You cannot add a course unless a student is enrolled.

Problem:

```txt
Course data is mixed with enrollment data.
```

### Delete Problem

If the last student leaves a course, deleting that enrollment may also remove the only copy of the course title.

Problem:

```txt
Course information is lost accidentally.
```

## Fixed Example: In 2NF

We remove partial dependencies by splitting data into separate tables.

Better design:

`students` table:

| id | name |
| --- | --- |
| 1 | Rahim |
| 2 | Karim |

`courses` table:

| id | title |
| --- | --- |
| 10 | Database Design |
| 20 | Node.js |

`enrollments` table:

| student_id | course_id | enrolled_at |
| --- | --- | --- |
| 1 | 10 | 2026-01-10 |
| 1 | 20 | 2026-01-12 |
| 2 | 10 | 2026-01-15 |

Now:

```txt
student name is stored only in students.
course title is stored only in courses.
enrollment data is stored only in enrollments.
```

## Why This Fix Works

The `enrollments` table has this primary key:

```txt
student_id + course_id
```

The non-key column:

```txt
enrolled_at
```

depends on the full key:

```txt
student_id + course_id
```

Because the enrollment date describes the relationship between one student and one course.

So the table satisfies `2NF`.

## 1NF vs 2NF

| Normal Form | Question to ask | Example problem |
| --- | --- | --- |
| `1NF` | Does each column contain one atomic value? | `courses = "DB, Node, React"` |
| `2NF` | Does every non-key column depend on the whole primary key? | `student_name` depends only on `student_id` |

## Backend Example

Suppose an API returns enrollments:

```txt
GET /students/1/courses
```

Good schema:

```sql
SELECT students.name, courses.title, enrollments.enrolled_at
FROM enrollments
JOIN students ON students.id = enrollments.student_id
JOIN courses ON courses.id = enrollments.course_id
WHERE students.id = 1;
```

Each table stores the data it owns:

```txt
students owns student data
courses owns course data
enrollments owns relationship data
```

## Common Mistakes

### Mistake 1: Storing comma-separated values

Bad:

```txt
course_ids = "10,20,30"
```

This breaks `1NF`.

Better:

```txt
Use separate rows in a relationship table.
```

### Mistake 2: Using repeated columns

Bad:

```txt
phone1, phone2, phone3
```

Better:

```txt
Use a separate phone_numbers table.
```

### Mistake 3: Keeping partial dependencies

Bad:

```txt
enrollments table stores student_name and course_title
```

Better:

```txt
students table stores student_name.
courses table stores course_title.
enrollments table stores student_id, course_id, enrolled_at.
```

### Mistake 4: Thinking normalization means too many tables always

Normalization does create separate tables, but the goal is not to create tables blindly.

The goal is to put each fact in the correct place.

## Quick Checklist

For `1NF`, ask:

```txt
Is every value atomic?
Are there any comma-separated lists?
Are there repeated columns like item1, item2, item3?
```

For `2NF`, ask:

```txt
Does the table have a composite primary key?
Does every non-key column depend on the whole key?
Are any columns dependent on only one part of the key?
```

## Interview Answer

`1NF` means every column contains atomic values, so columns should not store lists or repeated groups. `2NF` means every non-key column must depend on the entire primary key, especially when the table has a composite key. If a non-key column depends on only part of the composite key, that is a partial dependency. Partial dependencies create redundant data, so we remove them by splitting the data into separate tables.
