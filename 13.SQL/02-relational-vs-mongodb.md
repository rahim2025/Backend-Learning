# Relational Databases vs MongoDB

## Relational Databases (SQL / RDBMS)
- Data organized into **tables** (rows and columns), each table has a fixed **schema**.
- Relationships between tables are established with **primary keys** and **foreign keys**.
- Strong emphasis on data integrity: constraints, types, relationships are enforced by the database.
- Normalization: data is split across multiple related tables to avoid duplication.
- Examples: MySQL, PostgreSQL, SQL Server, SQLite, Oracle.

```
users                orders
---------            ---------
id (PK)              id (PK)
name                 user_id (FK -> users.id)
email                total
```

## MongoDB (NoSQL / Document Database)
- Data organized into **collections** of **documents** (BSON/JSON-like objects).
- **Schema-less (flexible schema)** — documents in the same collection can have different fields/shapes.
- Relationships are often handled by **embedding** related data directly inside a document, or by manual **referencing** (storing an `_id` and doing a separate lookup — no enforced FK constraint).
- Denormalization is common and often encouraged for read performance.

```json
// users collection
{
  "_id": "u1",
  "name": "Rahim",
  "orders": [
    { "item": "Book", "total": 20 },
    { "item": "Pen", "total": 2 }
  ]
}
```

## Key Differences

| Aspect | Relational (SQL) | MongoDB |
|---|---|---|
| Structure | Tables with rows/columns | Collections of documents |
| Schema | Fixed, enforced | Flexible/dynamic |
| Relationships | Foreign keys, JOINs | Embedding or manual references |
| Integrity | Enforced by DB (constraints, FKs) | Mostly enforced at application level |
| Scaling | Traditionally vertical (though modern RDBMS support horizontal too) | Designed for horizontal scaling (sharding) |
| Transactions | Mature, strong ACID support | ACID support exists (since v4.0) but historically weaker across documents |
| Best for | Structured data with complex relationships, strong consistency needs | Flexible/evolving data shapes, high write throughput, hierarchical/nested data |

## When to choose which
- **Choose relational/SQL** when:
  - Data has clear structure and relationships (e.g. users, orders, payments).
  - You need strong consistency and data integrity guarantees.
  - You'll run complex queries/joins/reporting.
- **Choose MongoDB** when:
  - Data shape varies or evolves quickly (e.g. varying product attributes).
  - You want to store nested/hierarchical data without many joins.
  - High write throughput and horizontal scalability matter more than strict relational integrity.

## Note
This isn't strictly binary — many real systems use both (polyglot persistence): relational DB for core transactional data, MongoDB for logs, catalogs, or flexible content.
