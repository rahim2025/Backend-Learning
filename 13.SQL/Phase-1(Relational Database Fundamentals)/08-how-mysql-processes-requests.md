# How MySQL Processes Requests (High-Level)

A simplified walkthrough of what happens between your application sending a SQL query and MySQL returning a result.

## 1. Client connects
- Your application (or CLI client) opens a **connection** to the MySQL server (TCP, typically port 3306), authenticating with credentials.
- MySQL maintains a **connection pool/thread** for each active client connection.

## 2. Query arrives → Parser
- The raw SQL text you sent is checked for valid **syntax** (parsing).
- If the SQL is malformed (e.g. typo in a keyword), it's rejected here with a syntax error, before touching any data.
- The parser converts the query into an internal representation (a parse tree).

## 3. Preprocessor / Semantic checks
- Checks that referenced tables and columns actually **exist**.
- Checks **permissions** — does this user have rights to run this query on this table?

## 4. Query Optimizer
- This is the "brain" of query execution. MySQL decides the **most efficient way** to actually fetch the data, since the same logical query can often be executed in multiple physical ways.
- Decisions it makes:
  - Which **index** (if any) to use for filtering ([[07-basic-index-intuition]]).
  - What **order** to join multiple tables in.
  - Whether to do a full table scan vs an index lookup.
- Produces an **execution plan** — you can view this yourself with:
```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 5;
```

## 5. Execution Engine
- Carries out the plan chosen by the optimizer: reads the needed rows, applies filters/joins/aggregations/sorting, and assembles the result set.
- Talks to the **storage engine** underneath (commonly **InnoDB** in modern MySQL) to actually read/write data on disk.

## 6. Storage Engine (e.g. InnoDB)
- Manages how data is actually stored on disk, caching (buffer pool — keeps frequently used data in memory to avoid disk I/O), locking, and **transactions** (commit/rollback, ACID guarantees).
- This is also where constraints like foreign keys are physically enforced.

## 7. Result returned to client
- The final result set is sent back over the connection to your application.

## Simplified flow diagram
```
Client (app)
   │  SQL query over TCP connection
   ▼
Connection handling (auth, thread assignment)
   ▼
Parser (syntax check) 
   ▼
Preprocessor (table/column existence, permissions)
   ▼
Optimizer (choose best execution plan — indexes, join order)
   ▼
Execution Engine (run the plan)
   ▼
Storage Engine / InnoDB (read/write actual data, buffer pool, transactions, locks)
   ▼
Result set
   ▼
Client (app) receives rows
```

## Why this matters practically
- **Why `EXPLAIN` is useful**: it shows you exactly which step 4 (the optimizer) decided to do — whether it used an index or did a full scan, which is usually *the* biggest factor in query speed.
- **Why the first run of a query can be slower than later runs**: the buffer pool (memory cache) may not yet contain the relevant data on a "cold" query — subsequent identical queries can be served largely from memory.
- **Why adding an index can instantly speed up a slow query**: it changes what options are available to the optimizer in step 4, without you changing the SQL at all.
- **Why permissions errors happen before any data is touched**: they're checked early (step 3), so you get a fast, cheap rejection rather than a wasted full execution.
