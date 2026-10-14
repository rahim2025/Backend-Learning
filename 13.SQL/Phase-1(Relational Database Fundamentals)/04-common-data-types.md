# Common SQL Data Types

Every column must have a declared data type. Types vary slightly by vendor (MySQL vs PostgreSQL vs SQL Server), but the categories below are universal.

## Numeric types
| Type | Use for | Notes |
|---|---|---|
| `INT` / `INTEGER` | Whole numbers (ids, counts, ages) | Typical range ~ -2.1B to 2.1B |
| `BIGINT` | Very large whole numbers | Use for ids expected to exceed INT range |
| `SMALLINT` / `TINYINT` | Small whole numbers | Saves storage when range is known to be small |
| `DECIMAL(p, s)` / `NUMERIC(p, s)` | Exact money/precise values | `p` = total digits, `s` = digits after decimal. e.g. `DECIMAL(10,2)` for prices |
| `FLOAT` / `DOUBLE` | Approximate decimal values (scientific data) | ⚠️ Never use for money — rounding errors |

## String / text types
| Type | Use for | Notes |
|---|---|---|
| `CHAR(n)` | Fixed-length strings | Always pads to `n` characters |
| `VARCHAR(n)` | Variable-length strings (names, emails) | Max length `n`, only uses space actually needed |
| `TEXT` | Long free-form text (articles, descriptions) | No practical length limit (vendor-dependent) |
| `ENUM('a','b','c')` | A fixed set of allowed string values | MySQL-specific; Postgres uses custom `ENUM` types |

## Date & time types
| Type | Use for |
|---|---|
| `DATE` | Just a calendar date (`2026-01-01`) |
| `TIME` | Just a time of day (`14:30:00`) |
| `DATETIME` | Date + time, no timezone awareness (MySQL) |
| `TIMESTAMP` | Date + time, often auto-updates / timezone-aware depending on vendor |

## Boolean
- `BOOLEAN` / `BOOL` — true/false.
- MySQL internally stores this as `TINYINT(1)` (0 = false, 1 = true) — there's no true dedicated boolean storage type.

## Binary / other
| Type | Use for |
|---|---|
| `BLOB` | Raw binary data (files, images) — generally better to store files externally and keep just a URL/path |
| `JSON` | Structured semi-flexible data inside a relational column (supported in MySQL 5.7+, Postgres `JSON`/`JSONB`) |
| `UUID` | Universally unique identifier, often used as a surrogate key (see [[06-keys-and-integrity/03-surrogate-and-composite-keys]]) |

## Choosing the right type — why it matters
- **Storage efficiency**: `TINYINT` vs `INT` vs `BIGINT` for the same conceptual "number" wastes space if over-sized.
- **Correctness**: using `FLOAT` for currency introduces rounding errors; `DECIMAL` is exact.
- **Validation for free**: a `DATE` column will reject `"not-a-date"` automatically — the database does input validation your application doesn't have to.
- **Indexing performance**: smaller, fixed-size types (like `INT`) index and compare faster than large variable-length types (like `TEXT`).

## Quick example
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    category ENUM('electronics', 'clothing', 'food') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
