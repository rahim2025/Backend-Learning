# Aggregation Problems After Joins

Builds directly on [[14-row-multiplication]]: once a join has multiplied rows, naive aggregation over the joined result can silently produce **wrong numbers** — not an error, just an incorrect value that looks plausible.

## Why COUNT() and SUM() can become incorrect after row multiplication

### Example: counting orders after joining to order_items

```sql
orders:                   order_items:
id | user_id              id | order_id
1  | 1                    1  | 1
2  | 1                    2  | 1
                           3  | 1   -- order 1 has 3 items
                           4  | 2   -- order 2 has 1 item
```

```sql
-- ❌ trying to count distinct orders per user, but counting joined rows instead
SELECT o.user_id, COUNT(o.id) AS order_count
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.user_id;
-- returns order_count = 4 for user 1 (3 + 1 joined rows)
-- but user 1 actually only has 2 ORDERS, not 4
```

`COUNT(o.id)` counts **joined rows**, and because order 1 was duplicated 3 times by the join to `order_items`, it gets counted 3 times instead of once.

### Example: SUM() double-counting a value from the "one" side

```sql
-- ❌ trying to total up order amounts, but the join to order_items multiplies each order's total
SELECT o.user_id, SUM(o.total) AS total_spent
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.user_id;
-- if order 1 (total=50) has 3 items, its `total` of 50 gets summed 3 TIMES = 150 just for that one order
```

This is the same root cause as the `COUNT` problem: `o.total` is a "one-side" value, but by the time `SUM` runs, that row has been duplicated by the join — so the same value gets added in multiple times.

## Why COUNT(DISTINCT o.id) may sometimes be necessary

```sql
-- ✅ count distinct orders, ignoring how many times each got duplicated by the join
SELECT o.user_id, COUNT(DISTINCT o.id) AS order_count
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.user_id;
-- correctly returns 2 for user 1 (orders 1 and 2), regardless of how many items each has
```

`COUNT(DISTINCT o.id)` only counts each unique `order.id` once, no matter how many times the join duplicated that row — this directly cancels out the row-multiplication effect for counting purposes.

⚠️ `SUM(DISTINCT ...)` is **not** a safe equivalent fix for the `SUM` problem above — `DISTINCT` inside `SUM` removes duplicate *values*, not duplicate *rows* (if two different orders happened to both total exactly 50, `SUM(DISTINCT o.total)` would incorrectly collapse them into one). For sums, the real fix is to aggregate at the correct level **before** the multiplying join — see below.

## Understanding the cause before applying DISTINCT

`COUNT(DISTINCT o.id)` is a valid, common fix — but reaching for `DISTINCT` (on the whole `SELECT`, or scattered onto aggregate functions) **without understanding why duplication is happening** is how subtly wrong numbers end up in reports. Always ask first:

1. **Which join is multiplying rows?** (Trace it per [[14-row-multiplication]].)
2. **Is that multiplication legitimate for this question**, or is it a mistaken/incomplete join condition ([[13-join-mistakes-and-debugging]])?
3. **What am I actually trying to count/sum — rows, or distinct entities from the "one" side?**

## The more robust fix: aggregate before joining

Often the cleanest fix is to pre-aggregate the "many" side in a subquery **before** joining it to the "one" side, so the "one" side's rows never get duplicated in the first place:

```sql
-- ✅ sum order_items first, so `orders` rows are never multiplied
SELECT o.user_id, SUM(o.total) AS total_spent, COUNT(o.id) AS order_count
FROM orders o
GROUP BY o.user_id;
-- (if item-level detail isn't needed at all, don't join order_items here)
```

```sql
-- ✅ if item counts per order ARE needed, pre-aggregate them in a subquery first
SELECT o.user_id, SUM(o.total) AS total_spent, COUNT(DISTINCT o.id) AS order_count, SUM(item_counts.item_count) AS total_items
FROM orders o
JOIN (
    SELECT order_id, COUNT(*) AS item_count
    FROM order_items
    GROUP BY order_id
) AS item_counts ON item_counts.order_id = o.id
GROUP BY o.user_id;
-- `item_counts` already collapsed order_items to one row per order BEFORE joining,
-- so orders is never duplicated by this join
```

## Rule of thumb

> Before trusting any `COUNT`/`SUM`/`AVG` computed across a join, ask whether the join could have multiplied the rows being aggregated. If yes: either aggregate the "many" side down to one row per key *before* joining, or use `COUNT(DISTINCT ...)` on the correct identifier — never reach for blanket `DISTINCT` without first identifying exactly which join caused the duplication.
