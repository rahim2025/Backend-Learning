# ACID Properties

`ACID` describes four important properties that make database transactions reliable.

Simple definition:

```txt
ACID = rules that help database transactions stay correct and reliable
```

`ACID` stands for:

| Letter | Meaning |
| --- | --- |
| `A` | Atomicity |
| `C` | Consistency |
| `I` | Isolation |
| `D` | Durability |

## Why ACID Matters

Backend applications often perform multiple database operations together.

Example:

```txt
Transfer money from Account A to Account B.
```

This needs multiple steps:

```txt
1. Subtract money from Account A.
2. Add money to Account B.
3. Save both changes.
```

If step 1 succeeds but step 2 fails, the database becomes wrong.

ACID helps prevent this kind of problem.

## Transaction

A transaction is a group of database operations treated as one unit of work.

Simple definition:

```txt
Transaction = multiple database operations that should succeed or fail together
```

Example:

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 500
WHERE id = 1;

UPDATE accounts
SET balance = balance + 500
WHERE id = 2;

COMMIT;
```

If something fails, the transaction can be rolled back:

```sql
ROLLBACK;
```

## Atomicity

Atomicity means a transaction is all-or-nothing.

Simple definition:

```txt
Atomicity = either all operations happen, or none of them happen
```

Example:

```txt
Money transfer:
- Debit sender account
- Credit receiver account
```

Both operations must succeed.

If one fails, both should be cancelled.

## Atomicity Example

Bad situation without atomicity:

```txt
Sender balance decreased.
Receiver balance did not increase.
```

This is dangerous.

With atomicity:

```txt
If receiver update fails, sender update is rolled back.
```

SQL idea:

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 500
WHERE id = 1;

UPDATE accounts
SET balance = balance + 500
WHERE id = 2;

COMMIT;
```

If an error happens before `COMMIT`, use:

```sql
ROLLBACK;
```

## Consistency

Consistency means a transaction must move the database from one valid state to another valid state.

Simple definition:

```txt
Consistency = database rules must remain valid before and after the transaction
```

Database rules include:

- Primary keys
- Foreign keys
- Unique constraints
- Check constraints
- Not null constraints
- Business rules enforced by the application and database

## Consistency Example

Suppose the database has this rule:

```txt
Account balance cannot be negative.
```

Constraint:

```sql
balance DECIMAL(10, 2) CHECK (balance >= 0)
```

Invalid transaction:

```sql
UPDATE accounts
SET balance = balance - 1000
WHERE id = 1;
```

If the account only has `500`, this would create an invalid state.

Consistency means the database should not allow that invalid state.

## Isolation

Isolation means transactions should not incorrectly interfere with each other.

Simple definition:

```txt
Isolation = concurrent transactions should behave safely
```

Concurrent means happening at the same time.

Example:

```txt
Two users try to buy the last product at the same time.
```

Without isolation, both transactions might read:

```txt
stock = 1
```

Then both might complete the purchase.

That creates overselling.

## Isolation Example

Product stock:

| product_id | stock |
| --- | --- |
| 1 | 1 |

Two checkout requests happen at the same time:

```txt
Request A reads stock = 1
Request B reads stock = 1
Request A reduces stock to 0
Request B also reduces stock to 0
```

Problem:

```txt
Two orders were created, but only one item existed.
```

Isolation helps control how transactions see and modify shared data.

## Durability

Durability means once a transaction is committed, the data should survive system failures.

Simple definition:

```txt
Durability = committed data is permanently saved
```

Example:

```txt
An order is successfully placed.
The database commits the transaction.
The server crashes immediately after.
```

Durability means the order should still exist after the database recovers.

## Durability Example

After this succeeds:

```sql
COMMIT;
```

The database should not forget the change because of:

- Server crash
- Power failure
- Database restart

Databases use storage, logs, and recovery mechanisms to protect committed data.

## ACID in One Example

Example: placing an order.

Steps:

```txt
1. Create order row.
2. Create order item rows.
3. Reduce product stock.
4. Create payment record.
```

ACID meaning:

| Property | Meaning in this order transaction |
| --- | --- |
| Atomicity | Either all order steps succeed or all are rolled back |
| Consistency | Stock, payment, foreign keys, and constraints remain valid |
| Isolation | Two users cannot incorrectly buy the same last item |
| Durability | Once order is committed, it remains saved |

## Backend Example

Pseudo-code:

```js
async function placeOrder(userId, items) {
  await db.transaction(async (trx) => {
    const order = await trx.orders.create({ userId });

    for (const item of items) {
      await trx.orderItems.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      });

      await trx.products.decreaseStock(item.productId, item.quantity);
    }

    await trx.payments.create({
      orderId: order.id,
      status: "pending",
    });
  });
}
```

If any step fails, the transaction should roll back.

That protects the database from half-created orders.

## Commit and Rollback

| Term | Meaning |
| --- | --- |
| `COMMIT` | Save all changes in the transaction |
| `ROLLBACK` | Cancel all changes in the transaction |

Example:

```sql
BEGIN;

INSERT INTO orders (id, user_id)
VALUES (101, 1);

INSERT INTO payments (order_id, amount)
VALUES (101, 500);

COMMIT;
```

If the payment insert fails:

```sql
ROLLBACK;
```

The order insert is cancelled too.

## ACID and Constraints

Constraints help with consistency.

Examples:

| Constraint | Consistency rule |
| --- | --- |
| `PRIMARY KEY` | Every row has a unique identity |
| `FOREIGN KEY` | Relationships point to valid rows |
| `UNIQUE` | Duplicate values are prevented |
| `CHECK` | Values must follow valid conditions |
| `NOT NULL` | Required values cannot be missing |

But constraints alone are not enough for every business rule.

Example:

```txt
If an order is paid, it should have a payment record.
```

This may require transaction logic in the backend.

## ACID vs BASE

Relational databases often focus on strong consistency and ACID transactions.

Some distributed NoSQL systems may use a different approach called `BASE`.

Very simple comparison:

| Topic | ACID | BASE |
| --- | --- | --- |
| Main goal | Strong reliability and consistency | High availability and eventual consistency |
| Common use | Banking, orders, inventory | Large distributed systems, social feeds |
| Data state | Consistent after transaction | May become consistent later |

For backend interviews, ACID is especially important for relational database transactions.

## Common Mistakes

### Mistake 1: Creating related records without a transaction

Bad:

```txt
Create order.
Create payment.
Reduce stock.
```

If stock update fails, the order may still exist incorrectly.

Better:

```txt
Wrap related operations in one transaction.
```

### Mistake 2: Thinking atomicity means one SQL query only

Atomicity can apply to multiple queries inside one transaction.

Example:

```txt
Transfer money = two updates, one transaction.
```

### Mistake 3: Confusing consistency with isolation

Consistency means rules remain valid.

Isolation means concurrent transactions do not interfere incorrectly.

### Mistake 4: Forgetting durability after commit

Once a transaction is committed, the database should preserve it even if a crash happens later.

## Quick Comparison

| ACID Property | Simple meaning | Backend example |
| --- | --- | --- |
| Atomicity | All or nothing | Order and payment both save, or neither saves |
| Consistency | Rules stay valid | No negative balance, valid foreign keys |
| Isolation | Transactions do not interfere incorrectly | Two users cannot both buy the last item |
| Durability | Committed data survives | Confirmed order remains after crash |

## Interview Answer

`ACID` properties make database transactions reliable. Atomicity means all operations in a transaction succeed or all are rolled back. Consistency means the database moves from one valid state to another while respecting rules like constraints and relationships. Isolation means concurrent transactions do not interfere with each other incorrectly. Durability means once a transaction is committed, the data is permanently saved even if the system crashes. ACID is important in backend systems for operations like money transfers, order placement, payments, and inventory updates.
