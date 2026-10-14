# SQL vs MySQL

## SQL (Structured Query Language)
- A **language** (a standard, ANSI/ISO defined) used to communicate with relational databases.
- Used to define schemas, insert/update/delete data, query data, manage permissions, etc.
- Not a product — it's a specification that many database systems implement.
- Core clauses (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, `WHERE`, `GROUP BY`...) are shared across implementations, though each vendor adds its own extensions.

## MySQL
- A **relational database management system (RDBMS)** — actual software that stores data and implements SQL (plus its own extensions) to let you interact with that data.
- Open-source, owned by Oracle.
- Other RDBMS that also "speak" SQL: PostgreSQL, SQL Server, SQLite, Oracle DB, MariaDB.

## Analogy
- SQL is like "English" — a language.
- MySQL is like "a person who speaks English" — software that understands and executes that language, with its own accent/dialect (vendor-specific syntax).

## Key differences

| | SQL | MySQL |
|---|---|---|
| What it is | Language/standard | Database software (RDBMS) |
| Can you "install" it? | No | Yes |
| Examples of siblings | — | PostgreSQL, SQL Server, SQLite |
| Syntax differences | Standard syntax | Adds things like `LIMIT`, `AUTO_INCREMENT`, backtick identifiers |

## Why this distinction matters
- Moving from MySQL to PostgreSQL won't require relearning SQL itself, but you will need to adjust for:
  - Pagination syntax (`LIMIT/OFFSET` vs others)
  - Auto-increment syntax (`AUTO_INCREMENT` vs `SERIAL`/`IDENTITY`)
  - String/identifier quoting (backticks vs double quotes)
  - Data types (e.g. `JSON`, `ENUM`, date/time handling differ slightly)
