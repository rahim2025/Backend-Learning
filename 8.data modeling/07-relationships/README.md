# Relationships

Relationships describe how tables are connected to each other.

Simple definition:

```txt
Relationship = connection between two or more tables
```

In backend development, relationships are important because real data is rarely isolated.

Example:

```txt
A user has orders.
An order has order items.
A student enrolls in courses.
A user has one profile.
```

## Why Relationships Matter

Relationships help the database answer questions like:

- Which orders belong to this user?
- Which comments belong to this post?
- Which courses is this student enrolled in?
- Which profile belongs to this user?
- Which products are inside this order?

Without clear relationships, backend queries become confusing and data can become duplicated or inconsistent.

## Main Relationship Types

| Relationship | Meaning | Example |
| --- | --- | --- |
| One-to-One | One row connects to one row | One user has one profile |
| One-to-Many | One row connects to many rows | One user has many orders |
| Many-to-Many | Many rows connect to many rows | Students enroll in many courses |
| Junction Table | Middle table for many-to-many | `enrollments` connects students and courses |

## One-to-One

A one-to-one relationship means one row in table A is connected to one row in table B.

Simple definition:

```txt
One-to-One = one record belongs to exactly one related record
```

Example:

```txt
One user has one profile.
One profile belongs to one user.
```

Tables:

```txt
users
user_profiles
```

SQL example:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE user_profiles (
  id INT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  full_name VARCHAR(100),
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Important part:

```sql
user_id INT UNIQUE NOT NULL
```

The `UNIQUE` constraint makes sure one user cannot have multiple profiles.

## One-to-One Table Example

`users` table:

| id | email |
| --- | --- |
| 1 | rahim@example.com |
| 2 | karim@example.com |

`user_profiles` table:

| id | user_id | full_name |
| --- | --- | --- |
| 10 | 1 | Rahim Uddin |
| 11 | 2 | Karim Ahmed |

Here:

```txt
user_profiles.user_id references users.id
```

Each profile belongs to one user.

## When to Use One-to-One

Use one-to-one when:

- Some data is optional
- Some data is large and should be separated
- Some data has different security rules
- You want to separate authentication data from profile data

Example:

```txt
users -> login/account data
user_profiles -> profile/display data
```

## One-to-Many

A one-to-many relationship means one row in table A can connect to many rows in table B.

Simple definition:

```txt
One-to-Many = one parent record can have many child records
```

Example:

```txt
One user can place many orders.
One order belongs to one user.
```

Tables:

```txt
users
orders
```

SQL example:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Important part:

```sql
orders.user_id references users.id
```

The foreign key is stored on the "many" side.

## One-to-Many Table Example

`users` table:

| id | email |
| --- | --- |
| 1 | rahim@example.com |
| 2 | karim@example.com |

`orders` table:

| id | user_id | total_amount |
| --- | --- | --- |
| 101 | 1 | 500 |
| 102 | 1 | 900 |
| 103 | 2 | 300 |

Here:

```txt
User 1 has two orders.
User 2 has one order.
Each order belongs to one user.
```

## Querying One-to-Many

Find all orders for one user:

```sql
SELECT *
FROM orders
WHERE user_id = 1;
```

Join users with orders:

```sql
SELECT users.email, orders.id, orders.total_amount
FROM users
JOIN orders ON orders.user_id = users.id;
```

## Many-to-Many

A many-to-many relationship means many rows in table A can connect to many rows in table B.

Simple definition:

```txt
Many-to-Many = many records on both sides can be related to each other
```

Example:

```txt
A student can enroll in many courses.
A course can have many students.
```

This cannot be modeled correctly by putting one foreign key directly in only one of the main tables.

Bad design:

```txt
students table has course_id
```

Problem:

```txt
One student can have only one course_id.
```

Another bad design:

```txt
courses table has student_id
```

Problem:

```txt
One course can have only one student_id.
```

The correct design uses a junction table.

## Junction Tables

A junction table is a middle table that connects two tables in a many-to-many relationship.

Simple definition:

```txt
Junction Table = table that stores relationships between two tables
```

Other names:

```txt
Join table
Bridge table
Associative table
Link table
```

Example:

```txt
students
courses
enrollments
```

The `enrollments` table connects students and courses.

## Many-to-Many SQL Example

```sql
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE courses (
  id INT PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);

CREATE TABLE enrollments (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

Important parts:

```sql
student_id
course_id
PRIMARY KEY (student_id, course_id)
```

The composite primary key prevents duplicate enrollments.

## Junction Table Example

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

| student_id | course_id |
| --- | --- |
| 1 | 10 |
| 1 | 20 |
| 2 | 10 |

Meaning:

```txt
Rahim is enrolled in Database Design and Node.js.
Karim is enrolled in Database Design.
Database Design has Rahim and Karim.
Node.js has Rahim.
```

## Junction Table with Extra Data

A junction table can store information about the relationship itself.

Example:

```sql
CREATE TABLE enrollments (
  id INT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grade VARCHAR(2),
  UNIQUE (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

Here, `grade` belongs to the enrollment relationship, not only to the student or only to the course.

This is why a junction table can become an important entity.

## E-Commerce Example

An order can contain many products.

A product can appear in many orders.

This is many-to-many:

```txt
orders
products
order_items
```

SQL example:

```sql
CREATE TABLE order_items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

Why `price_at_purchase` is stored:

```txt
Product price can change later.
Order history must remember the price when the order was placed.
```

## Where to Put the Foreign Key

| Relationship | Where the foreign key usually goes |
| --- | --- |
| One-to-One | In one table, usually the dependent/optional table, with `UNIQUE` |
| One-to-Many | In the many-side table |
| Many-to-Many | In the junction table |

Examples:

```txt
One-to-One:
user_profiles.user_id -> users.id

One-to-Many:
orders.user_id -> users.id

Many-to-Many:
enrollments.student_id -> students.id
enrollments.course_id -> courses.id
```

## Relationship Cardinality

Cardinality means how many records can be related.

| Cardinality | Meaning |
| --- | --- |
| `1:1` | One-to-one |
| `1:N` | One-to-many |
| `M:N` | Many-to-many |

Example:

```txt
User to Profile = 1:1
User to Orders = 1:N
Students to Courses = M:N
```

## Common Mistakes

### Mistake 1: Putting an array inside a SQL column

Bad:

```txt
students.courses = "10,20,30"
```

Problem:

```txt
Hard to query, hard to validate, hard to enforce foreign keys.
```

Better:

```txt
Use an enrollments junction table.
```

### Mistake 2: Modeling many-to-many as one-to-many

Bad:

```txt
students table has course_id
```

Problem:

```txt
A student can belong to only one course.
```

Better:

```txt
students
courses
enrollments
```

### Mistake 3: Forgetting UNIQUE in one-to-one

Bad:

```sql
user_id INT NOT NULL
```

Problem:

```txt
One user can accidentally have many profiles.
```

Better:

```sql
user_id INT UNIQUE NOT NULL
```

### Mistake 4: Not preventing duplicate junction rows

Bad:

| student_id | course_id |
| --- | --- |
| 1 | 10 |
| 1 | 10 |

Better:

```sql
PRIMARY KEY (student_id, course_id)
```

or:

```sql
UNIQUE (student_id, course_id)
```

## Quick Comparison

| Type | Example | Main idea |
| --- | --- | --- |
| One-to-One | User and profile | One record connects to one record |
| One-to-Many | User and orders | Foreign key goes on the many side |
| Many-to-Many | Students and courses | Needs a junction table |
| Junction Table | Enrollments | Stores pairs of related IDs |

## Interview Answer

Database relationships describe how tables connect. In a one-to-one relationship, one row is connected to one row, often using a foreign key with a `UNIQUE` constraint. In a one-to-many relationship, one parent row can have many child rows, and the foreign key is stored on the many side. In a many-to-many relationship, many rows on both sides can be connected, so we use a junction table containing foreign keys to both tables. Junction tables can also store extra data about the relationship, such as enrollment date, quantity, or price at purchase.
