# Normalization: 3NF

`3NF` means Third Normal Form.

It is a database normalization rule that removes transitive dependencies from a table.

Simple definition:

```txt
3NF = non-key columns should depend only on the key, not on other non-key columns
```

## Why 3NF Matters

`3NF` helps reduce:

- Duplicate data
- Update anomalies
- Insert anomalies
- Delete anomalies
- Confusing table responsibilities

The main idea:

```txt
Each fact should be stored in the table where it truly belongs.
```

## Before Learning 3NF

To understand `3NF`, remember:

| Normal Form | Main rule |
| --- | --- |
| `1NF` | Every column contains atomic values |
| `2NF` | Every non-key column depends on the entire primary key |
| `3NF` | No non-key column depends on another non-key column |

Usually, a table should satisfy `1NF` and `2NF` before checking `3NF`.

## Key Column and Non-Key Column

A key column is part of the primary key.

A non-key column is not part of the primary key.

Example:

| order_id | customer_id | customer_name | customer_city |
| --- | --- | --- | --- |
| 101 | 1 | Rahim | Dhaka |

If `order_id` is the primary key:

```txt
order_id is the key column.
customer_id, customer_name, and customer_city are non-key columns.
```

## Transitive Dependency

A transitive dependency happens when a non-key column depends on another non-key column.

Simple definition:

```txt
Transitive dependency = non-key column depends on another non-key column
```

Pattern:

```txt
Primary Key -> Non-key Column -> Another Non-key Column
```

Example:

```txt
order_id -> customer_id
customer_id -> customer_name
```

So:

```txt
order_id -> customer_id -> customer_name
```

This is a transitive dependency.

## Bad Example: Not in 3NF

Bad `orders` table:

| order_id | customer_id | customer_name | customer_city | order_date |
| --- | --- | --- | --- | --- |
| 101 | 1 | Rahim | Dhaka | 2026-01-10 |
| 102 | 1 | Rahim | Dhaka | 2026-01-12 |
| 103 | 2 | Karim | Chittagong | 2026-01-15 |

Primary key:

```txt
order_id
```

Dependencies:

```txt
order_id -> customer_id
customer_id -> customer_name
customer_id -> customer_city
```

Problem:

```txt
customer_name and customer_city depend on customer_id, not directly on order_id.
```

`customer_id` is a non-key column.

So this table has transitive dependencies:

```txt
order_id -> customer_id -> customer_name
order_id -> customer_id -> customer_city
```

This violates `3NF`.

## Why This Creates Redundancy

The same customer data is repeated in multiple order rows.

Example:

| order_id | customer_id | customer_name | customer_city |
| --- | --- | --- | --- |
| 101 | 1 | Rahim | Dhaka |
| 102 | 1 | Rahim | Dhaka |

The customer name and city are repeated.

If customer `1` places 100 orders, the same customer information may be repeated 100 times.

## Update Anomaly

An update anomaly happens when repeated data must be updated in many rows.

Example:

Rahim moves from Dhaka to Sylhet.

Bad table update:

```txt
Every order row for Rahim must be updated.
```

If one row is missed:

| order_id | customer_id | customer_name | customer_city |
| --- | --- | --- | --- |
| 101 | 1 | Rahim | Sylhet |
| 102 | 1 | Rahim | Dhaka |

Now the database has inconsistent customer data.

## Insert Anomaly

An insert anomaly happens when you cannot insert one type of data without another unrelated type of data.

Example problem:

```txt
You cannot add a new customer unless they already have an order.
```

This happens because customer data is mixed into the `orders` table.

## Delete Anomaly

A delete anomaly happens when deleting one row accidentally removes important data.

Example:

```txt
If the only order for a customer is deleted, the customer's name and city may also disappear.
```

Again, this happens because customer data is stored in the wrong table.

## Fixed Example: In 3NF

We remove transitive dependencies by splitting the data into separate tables.

Better design:

`customers` table:

| id | name | city |
| --- | --- | --- |
| 1 | Rahim | Dhaka |
| 2 | Karim | Chittagong |

`orders` table:

| id | customer_id | order_date |
| --- | --- | --- |
| 101 | 1 | 2026-01-10 |
| 102 | 1 | 2026-01-12 |
| 103 | 2 | 2026-01-15 |

Now:

```txt
Customer data lives in customers.
Order data lives in orders.
orders.customer_id connects orders to customers.
```

## SQL Example

```sql
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date DATE NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

Now customer name and city are stored once.

Orders only reference the customer by `customer_id`.

## 3NF Rule

A table is in `3NF` when:

- It is already in `2NF`
- No non-key column depends on another non-key column
- Non-key columns depend only on the primary key

Short version:

```txt
The key, the whole key, and nothing but the key.
```

Meaning:

```txt
1NF: values are atomic
2NF: non-key columns depend on the whole key
3NF: non-key columns do not depend on other non-key columns
```

## Another Example: Products and Categories

Bad `products` table:

| product_id | product_name | category_id | category_name |
| --- | --- | --- | --- |
| 1 | Keyboard | 10 | Electronics |
| 2 | Mouse | 10 | Electronics |
| 3 | T-shirt | 20 | Clothing |

Primary key:

```txt
product_id
```

Dependency:

```txt
product_id -> category_id
category_id -> category_name
```

So:

```txt
product_id -> category_id -> category_name
```

`category_name` depends on `category_id`, which is a non-key column.

This violates `3NF`.

Better design:

`categories` table:

| id | name |
| --- | --- |
| 10 | Electronics |
| 20 | Clothing |

`products` table:

| id | name | category_id |
| --- | --- | --- |
| 1 | Keyboard | 10 |
| 2 | Mouse | 10 |
| 3 | T-shirt | 20 |

Now category names are stored once.

## When We Intentionally Violate 3NF

Sometimes we intentionally violate `3NF` to meet business requirements.

This is called denormalization.

Simple definition:

```txt
Denormalization = intentionally storing repeated data for a practical reason
```

One common reason is preserving historical data.

## Historical Data Example

Suppose a product price changes over time.

Current `products` table:

| id | name | current_price |
| --- | --- | --- |
| 1 | Keyboard | 2500 |

Order item:

| order_id | product_id | price_at_purchase |
| --- | --- | --- |
| 101 | 1 | 2200 |

Here, `price_at_purchase` may look like repeated product data.

But it is important.

Reason:

```txt
The order must preserve the price from the time of purchase.
```

If the product price later changes from `2200` to `2500`, old orders should not change.

So storing `price_at_purchase` is a correct business decision.

## More Intentional 3NF Violations

Sometimes duplicated values are stored for:

- Faster reads
- Reporting
- Audit history
- Snapshots
- Order invoices
- Payment records
- External system records

Example:

```txt
orders table may store shipping_address_snapshot.
```

Why?

```txt
A user can change their address later, but the old order must remember where it was shipped.
```

This is not careless duplication.

It preserves history.

## Normalization vs Business Reality

Normalization gives a clean design.

Business requirements sometimes need historical snapshots.

Good backend schema design balances both.

Example:

| Data | Should it be normalized? | Why |
| --- | --- | --- |
| Current customer profile | Yes | Store once in `customers` |
| Order shipping address at purchase time | Often denormalized | Preserve history |
| Current product price | Yes | Store once in `products` |
| Product price at purchase time | Denormalized | Preserve invoice correctness |

## Common Mistakes

### Mistake 1: Storing customer details inside every order without reason

Bad:

```txt
orders table stores customer_name and customer_city for normal current customer data.
```

Better:

```txt
customers table stores customer details.
orders table stores customer_id.
```

### Mistake 2: Removing historical data too aggressively

Bad:

```txt
order_items only stores product_id and reads current product price.
```

Problem:

```txt
Old order totals change when product prices change.
```

Better:

```txt
order_items stores price_at_purchase.
```

### Mistake 3: Thinking denormalization means bad design

Denormalization is bad when it happens accidentally.

Denormalization can be good when it is intentional and supports a clear business rule.

### Mistake 4: Confusing 2NF and 3NF

`2NF` removes partial dependencies.

`3NF` removes transitive dependencies.

Quick difference:

```txt
2NF problem: non-key column depends on part of a composite key.
3NF problem: non-key column depends on another non-key column.
```

## Quick Checklist

To check for `3NF`, ask:

```txt
Is the table already in 2NF?
Does every non-key column describe the key directly?
Does any non-key column describe another non-key column?
Is duplicated data needed for history, audit, or performance?
```

If a non-key column depends on another non-key column, split it into a separate table unless there is a clear business reason not to.

## Interview Answer

`3NF` removes transitive dependencies. A transitive dependency happens when a non-key column depends on another non-key column instead of depending directly on the primary key. This creates redundancy and update anomalies because the same data may be repeated in many rows. We usually fix this by splitting data into separate tables. However, sometimes we intentionally violate `3NF`, such as storing `price_at_purchase` or address snapshots, to preserve historical business data.
