# Surrogate and Composite Keys

Both are approaches to designing a table's **primary key** (see [[01-primary-and-foreign-keys]]).

## Natural key
- A primary key made from data that already has real-world meaning (e.g. using `email`, `ssn`, or `isbn` as the PK).
- Pros: no extra column needed, meaningful on its own.
- Cons: real-world values can change (emails get updated, SSNs can theoretically be reissued), may not be guaranteed unique, and may be long/inefficient to index (e.g. a string vs an integer).

## Surrogate key
- An artificial, system-generated identifier with **no business meaning** — purely exists to uniquely identify a row.
- Typically an auto-incrementing integer (see [[04-auto-increment]]) or a generated UUID.
- This is the most common PK style in practice.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- surrogate key: meaningless, just an identifier
    email VARCHAR(150) UNIQUE NOT NULL  -- the "natural" identifier, kept unique but not the PK
);
```

### Why surrogate keys are preferred
- **Stability**: never needs to change, even if real-world data (email, name) changes.
- **Performance**: small fixed-size integers are faster to index, compare, and join on than long strings.
- **Simplicity for foreign keys**: child tables just store a simple integer/UUID, not a composite or long value.
- **Decoupling**: business rules changing (e.g. "emails must now be re-verifiable and can change") don't break relationships.

### UUID as a surrogate key
```sql
id CHAR(36) PRIMARY KEY DEFAULT (UUID())  -- MySQL
```
- Pros: globally unique without coordination (good for distributed systems, merging data from multiple sources, exposing IDs publicly without revealing row counts).
- Cons: larger storage size than `INT`, worse index locality/performance than sequential integers (random UUIDs cause more index fragmentation).

## Composite key
- A primary key made of **two or more columns combined** — the combination (not any single column alone) must be unique.
- Common in **junction/bridge tables** that represent many-to-many relationships.

```sql
CREATE TABLE enrollments (
    student_id INT,
    course_id INT,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```
- This guarantees a student can't enroll in the same course twice (the pair `(student_id, course_id)` must be unique), while still allowing the same student to enroll in many different courses, and the same course to have many different students.

### Composite key vs surrogate + unique constraint
An alternative to a composite PK is to give the junction table its own surrogate PK, and enforce the uniqueness separately:
```sql
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    UNIQUE (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```
- Useful if other tables need to reference a single enrollment row directly by one simple id, rather than by a pair of columns.

## Summary

| | Natural key | Surrogate key | Composite key |
|---|---|---|---|
| Based on | Real business data | Artificial generated value | Multiple columns combined |
| Changes over time? | Possibly | Never | Depends on underlying columns |
| Typical use | Rare (small lookup tables) | Most tables (default choice) | Many-to-many junction tables |
