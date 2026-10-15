# Row Multiplication

## The core idea

When you join a table to another table through a **one-to-many** relationship, each row on the "one" side gets **repeated once per matching row** on the "many" side. This is completely correct, expected join behavior — but it's easy to forget it happened, especially right before aggregating.

## A single one-to-many join

```
orders:                   order_items:
id | user_id | total      id | order_id | quantity
1  | 1       | 50         1  | 1        | 2
                           2  | 1        | 3
                           3  | 1        | 1

JOIN result (orders JOIN order_items):
order_id | total | quantity
1        | 50    | 2
1        | 50    | 3
1        | 50    | 1
-- the single `orders` row (total=50) now appears THREE times —
-- once for each matching order_items row
```

- This isn't a bug — it's exactly what a join does: it produces one output row per **matching pair**. One order with 3 items produces 3 joined rows.

## Multiple one-to-many joins multiply further

If you then join `order_items` to `products`, and a product join also fans out (e.g. multiple price-history rows), the multiplication **compounds**:

```
1 order × 3 order_items × (further fan-out per product join, if any) = even more rows
```

Each additional one-to-many join in the chain can multiply the row count again — not add to it.

## Why this matters

- If you only look at individual rows (e.g. listing order items with their product names), row multiplication is exactly what you want — each row legitimately represents one order-item.
- If you then try to read a value that "belongs" to the one side (like `orders.total`) directly off these multiplied rows without aggregating first, you'll see it **repeated** — and if you then sum or count across these rows naively, you'll overcount it. See [[15-aggregation-problems-after-joins]] for exactly how this breaks aggregates.

## Recognizing row multiplication while debugging

- Compare row counts at each step of a multi-join query (see [[06-multi-table-joins]], [[13-join-mistakes-and-debugging]]):

```sql
SELECT COUNT(*) FROM orders;                               -- e.g. 100
SELECT COUNT(*) FROM orders o JOIN order_items oi ON oi.order_id = o.id;
-- e.g. 340 — more than 100, because most orders have multiple items
```

- If the joined count is **larger** than the base table's count, a one-to-many (or many-to-many) fan-out is happening — expected if that's the relationship, worth double-checking if it isn't.

## Multiplication through a many-to-many junction table

The same thing happens traversing a junction table (see [[09-many-to-many-joins-traversal]]) — a student enrolled in 4 courses produces 4 rows when joined through `enrollments`, even before joining to `courses` itself.

## The fix isn't to hide it — it's to aggregate at the right level

Row multiplication itself is not the problem; **treating multiplied rows as if they weren't multiplied** (e.g. summing `orders.total` directly across joined rows) is. The fix is almost always to aggregate (`GROUP BY`) at the correct level, or to pre-aggregate in a subquery before joining — not to slap `DISTINCT` on the output (see [[13-join-mistakes-and-debugging]]).
