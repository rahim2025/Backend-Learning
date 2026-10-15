# Relationship Types (1:1, 1:N, M:N)

## One-to-One (1:1)
- One row in table A relates to **exactly one** row in table B, and vice versa.
- Example: a `users` table and a `user_profiles` table — each user has exactly one profile.
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,            -- PK here is ALSO the FK — this is what enforces 1:1
    bio TEXT,
    avatar_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
- The key signal: the FK column is **also** the PK (or has a `UNIQUE` constraint) of the child table — this guarantees no more than one child row per parent.
- Often used to split a table for optional/rarely-used columns, or for security (keep sensitive data in a separate, more restricted table).

## One-to-Many (1:N)
- One row in table A relates to **many** rows in table B, but each row in B relates to only **one** row in A.
- The most common relationship type.
- Example: one `users` row has many `orders` rows.
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,               -- FK, NOT unique — many orders can share the same user_id
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
- The key signal: the FK column has **no** `UNIQUE` constraint — many child rows are allowed to point to the same parent.

## Many-to-Many (M:N)
- Many rows in table A relate to many rows in table B (and vice versa).
- Example: `students` can enroll in many `courses`, and each `course` has many `students`.
- **Cannot** be modeled with a single FK column on either side — requires a third table (a **junction table**) in between. See [[02-junction-tables]].

```
students ←—— enrollments ——→ courses
  (1:N)                        (N:1)
```
- A many-to-many relationship is really just **two** one-to-many relationships, pointing at a middle table.

## How to recognize relationship cardinality
Ask: **"For one row on side A, how many matching rows exist on side B — and vice versa?"**

| Question | 1:1 | 1:N | M:N |
|---|---|---|---|
| Can one A have many B? | No | Yes | Yes |
| Can one B have many A? | No | No | Yes |

Practical way to figure it out from a business description:
- "A user **has one** profile" → 1:1.
- "A user **has many** orders, each order **belongs to one** user" → 1:N.
- "A student can enroll in **many** courses, and a course can **have many** students" → M:N.

A quick trick: if you can imagine listing multiple B's for a single A **and** multiple A's for a single B, it's M:N. If only one direction has "multiple," it's 1:N. If neither direction allows "multiple," it's 1:1.

## Where foreign keys usually live
| Relationship | FK location |
|---|---|
| 1:1 | FK (also PK/UNIQUE) on either table — conventionally on the table that is "optional" or "dependent" (e.g. `user_profiles.user_id`) |
| 1:N | FK always lives on the "many" side (e.g. `orders.user_id`, not `users.order_id`) — the "one" side never knows how many children it has |
| M:N | FK columns live on the **junction table**, pointing to both sides — neither original table holds a FK to the other |

Rule of thumb: **the FK sits on the side that can only point to one thing.** The "many" side always holds the reference, because a single column can't hold multiple values.

## Why many-to-many relationships need a junction table
A single FK column can only store **one** value per row. If `students.course_id` tried to represent "this student is in 3 courses," there's no way to put 3 values in one column without breaking normalization (and losing the ability to query/index/constrain it properly).
The junction table solves this by turning each **relationship instance** into its own row — see [[02-junction-tables]] for the full pattern.
