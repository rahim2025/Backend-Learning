# Referential Integrity & Foreign Key Deletion Strategies

## What is Referential Integrity?
- A guarantee that relationships between tables remain **consistent**: a foreign key value must always correspond to an existing primary key value in the referenced table (or be NULL).
- Prevents "orphan rows" — e.g. an `orders` row pointing to a `user_id` that no longer exists.
- Enforced automatically by the database once a `FOREIGN KEY` constraint is defined — you don't need to manually check in application code (though you still can).

## The problem it solves
Without referential integrity, this could happen:
1. `users` table has a row with `id = 5`.
2. `orders` table has a row with `user_id = 5`.
3. Someone deletes `users.id = 5`.
4. Now `orders.user_id = 5` points to nothing — a dangling/orphan reference → broken data, bugs in reports, crashes when joining.

The database prevents this by requiring you to specify **what should happen** to child rows when the parent row is deleted or updated.

## Foreign Key Deletion (and Update) Strategies — `ON DELETE` / `ON UPDATE`

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

### 1. `RESTRICT` (often the default)
- Prevents deleting (or updating) the parent row if any child rows still reference it.
- The DELETE statement fails with an error.
- Use when: you want to force explicit handling before removal (e.g. don't allow deleting a user who still has orders).

### 2. `CASCADE`
- Automatically deletes (or updates) all child rows when the parent row is deleted/updated.
- Use when: child data has no meaning without the parent (e.g. deleting a `blog_post` should delete its `comments`).
- ⚠️ Dangerous for important historical data — can wipe out records you may need later (see [[03-historical-data-preservation]]).

### 3. `SET NULL`
- Sets the FK column to `NULL` in child rows when the parent is deleted.
- Requires the FK column to be nullable.
- Use when: the relationship is optional and the child record should still exist without a parent (e.g. `orders.assigned_employee_id` set to NULL if the employee is removed, but the order itself stays).

### 4. `SET DEFAULT`
- Sets the FK column to a predefined default value when the parent is deleted.
- Less commonly used/supported (not supported in MySQL's InnoDB in practice, though part of the SQL standard).

### 5. `NO ACTION`
- Similar to `RESTRICT` in most databases — prevents the delete if references exist. (Difference is subtle: `NO ACTION` can allow deferred constraint checking in some DBs like Postgres, `RESTRICT` cannot.)

## Choosing a strategy

| Scenario | Good strategy |
|---|---|
| Deleting a parent should wipe dependent child data | `CASCADE` |
| Parent shouldn't be deletable while children exist | `RESTRICT` / `NO ACTION` |
| Child record is still meaningful without the parent | `SET NULL` |
| You need to preserve history/audit trail | Avoid hard delete entirely — use **soft deletes** instead (see [[03-historical-data-preservation]]) |

## Practical tip
In real-world systems (especially e-commerce, finance, auditing), hard `CASCADE` deletes are often avoided in favor of **soft deletes** to preserve historical/financial records — see the next note.
