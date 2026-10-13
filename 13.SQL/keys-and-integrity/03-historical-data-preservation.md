# Historical Data Preservation

## The problem
Hard-deleting rows (actual `DELETE FROM ...`) loses data forever. In many real systems this is undesirable or even illegal/non-compliant:
- Financial records (orders, invoices, payments) often must be retained for audits/tax purposes.
- Deleting a `product` that was part of a past `order` would corrupt the order's historical record (price paid, product name at the time, etc.) if the order just references the product by FK.
- Analytics/reporting needs historical trends, including entities that no longer "actively" exist.

## Strategy 1: Soft Deletes
Instead of removing the row, mark it as deleted with a flag/timestamp column.

```sql
ALTER TABLE users ADD COLUMN deleted_at DATETIME NULL;
```

```sql
-- "delete" a user
UPDATE users SET deleted_at = NOW() WHERE id = 5;

-- queries must filter out soft-deleted rows
SELECT * FROM users WHERE deleted_at IS NULL;
```

Pros:
- Data (and its relationships) is preserved — no orphaned FKs, no lost history.
- Easy to "undelete"/restore.

Cons:
- Every query must remember to filter `WHERE deleted_at IS NULL` (easy to forget → bugs).
- Unique constraints get tricky (e.g. can't re-register the same email unless you account for soft-deleted rows).
- Table grows indefinitely unless old soft-deleted rows are periodically archived.

## Strategy 2: Denormalize / Snapshot critical data at time of transaction
Instead of relying solely on a live FK reference, copy the important values into the child table at the time the record is created, so it stays correct even if the parent later changes or is removed.

```sql
CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT,
    product_id INT,          -- reference, may become stale/removed
    product_name VARCHAR(100), -- snapshot: name *at time of purchase*
    unit_price DECIMAL(10,2)   -- snapshot: price *at time of purchase*
);
```
- This is why e-commerce order line items usually store the product name/price directly rather than only a `product_id` — if the product is deleted or its price changes later, old orders still show accurate historical data.

## Strategy 3: Archive tables
- Move old/deleted rows into a separate `*_archive` table (via a trigger or scheduled job) instead of deleting outright.
- Keeps the main table lean/fast while still preserving history elsewhere.

## Strategy 4: Audit/history tables
- Maintain a separate table (e.g. `users_history`) that logs every INSERT/UPDATE/DELETE with a timestamp and the old values (often via triggers or application-level logging).
- Useful for full audit trails ("who changed what and when").

## Combining with FK deletion strategies
- Prefer `ON DELETE RESTRICT` (or no hard deletes at all) for tables holding financially/legally important history.
- Use soft deletes + `deleted_at IS NULL` filters instead of relying on `CASCADE`.
- Reserve `ON DELETE CASCADE` for genuinely dependent, disposable data (e.g. deleting a `cart` also deletes its `cart_items`).

## Rule of thumb
> If losing the row would lose information you might need later (legally, financially, or for debugging/analytics) — don't hard delete it. Soft-delete, snapshot, or archive instead.
