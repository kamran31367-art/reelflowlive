---
title: "Format SQL Consistently for Reviews and Pull Requests"
description: "Turn compact SQL into readable, consistently indented queries with five dialect choices, a worked example and checks for syntax the formatter cannot validate."
date: 2026-11-27
categories:
  - Developer
cover: assets/img/blog/sql-formatter/hero.svg
coverAlt: "A compact SQL query becoming an indented query with uppercase keywords for code review"
coverCaption: "Formatting makes query structure visible, but it does not execute the statement or prove that the database will accept it."
takeaways:
  - "The SQL query field starts with a sample users query, and the dialect starts at Standard SQL."
  - "Format SQL applies two-space indentation and uppercase keywords through the bundled sql-formatter library."
  - "Dialect choices are Standard SQL, MySQL, PostgreSQL, SQLite and SQL Server."
  - "The formatter changes presentation only; it does not connect to a database, execute SQL or validate table and column names."
  - "Output is copyable plain text and downloads as sql-formatter.sql, with no query history stored by the tool."
faq:
  - q: "Does the tool check whether my query will run?"
    a: "No. It formats SQL text but does not execute it or inspect a database schema. A missing table, an unknown column or a permissions problem will not be detected here."
  - q: "Which dialect should I choose?"
    a: "Choose the database you actually target. The selected language changes how the formatter recognises syntax, so SQL Server, PostgreSQL, MySQL and SQLite can handle their own constructs more appropriately than Standard SQL."
  - q: "Can I change the indentation width or keyword case?"
    a: "No. This page fixes indentation at two spaces and keyword case at uppercase. There are no controls for tabs, line width, keyword case or a personal formatting profile."
  - q: "Are my queries uploaded?"
    a: "No conversion request is made. The SQL is formatted by JavaScript bundled with the page, then held in the current result until you reset, replace or leave the session."
draft: false
---

A query pasted from a log can be correct and still slow to review. The [SQL Online Formatter](/sql-formatter/) gives clauses, expressions and lists a consistent visual structure before a pull request or incident note is shared. Use it for readability and comparison, not as a substitute for running the query against the intended database.

## When formatting earns its place

Formatting is most useful when a query was generated on one line, copied between tickets or assembled by several people. Separate clauses make a risky `WHERE` condition easier to spot, and an indented column list is easier to review than a comma-separated blur.

It also helps when you need to discuss structure rather than data. A teammate can point to the join, filter or ordering clause without first reformatting the snippet. For very short statements the gain may be small; for nested queries, long select lists and multiple joins it becomes substantial.

## Controls and defaults

The **SQL query** textarea has nine rows, spellchecking disabled and this starting value:

```sql
select id,name,email from users where active=1 order by name;
```

The **Dialect** select starts at **Standard SQL**. Its options are Standard SQL (`sql`), MySQL (`mysql`), PostgreSQL (`postgresql`), SQLite (`sqlite`) and SQL Server (`tsql`). The action button says **Format SQL**; **Reset** restores the sample query and Standard SQL.

There is no automatic formatting while you type. Choose the dialect, edit or paste the statement, then press the button. Copy and Download stay disabled until a result is available.

## Worked example: the default query

Running the default query with Standard SQL selected produces this structure:

```sql
SELECT
  id,
  name,
  email
FROM
  users
WHERE
  active = 1
ORDER BY
  name;
```

The formatter uppercases keywords, places the selected columns on separate indented lines and separates the major clauses. The semicolon remains part of the statement. This is a presentation change: the query still addresses the same columns, table and condition.

<figure>
  <img src="/assets/img/blog/sql-formatter/workflow.svg" alt="Workflow from pasted SQL through dialect selection and formatting to a review-ready query" width="1200" height="675" loading="lazy">
  <figcaption>The formatter sits between a pasted statement and code review: dialect selection guides parsing, while the database remains responsible for execution.</figcaption>
</figure>

## Choose the dialect before formatting

Standard SQL is a sensible default for a portable snippet, but real databases extend the language in different directions. Select MySQL for MySQL-specific syntax, PostgreSQL for PostgreSQL features, SQLite for SQLite statements or SQL Server for T-SQL. A mismatch can change how tokens and clauses are recognised.

Changing the dialect alone does not update the output. Press **Format SQL** again after the selection changes. If a statement contains syntax that the selected dialect does not handle as expected, try the matching database language before assuming the SQL itself is malformed.

## Output and handoff formats

The result appears in a read-only text area with a **Formatted** status. **Copy** places the formatted SQL on the clipboard. **Download** saves `sql-formatter.sql`; the shared runner creates a plain-text file with that extension rather than a database-specific project file.

For a pull request, paste the SQL into a fenced code block and keep the dialect label nearby. For a ticket, include only the relevant statement and enough schema context for the reader to understand it. Formatting cannot replace that context.

When the statement contains placeholders, leave them visible and explain which values the reviewer should imagine. The formatter does not bind parameters or hide sensitive literals. Compare quoted string literals and comments before and after formatting, because those are the places where a seemingly cosmetic edit can alter documentation or application behaviour. A careful handoff includes the dialect, the intended environment and whether the statement is safe to run.

## Limitations and edge cases

This is not a SQL linter, optimizer or executor. It does not report unused aliases, missing indexes, ambiguous columns, dangerous updates or performance problems. It also cannot verify that `users` exists or that `active` is a valid column.

The bundled formatter supports many common constructs, but dialect-specific or unusual syntax can still challenge it. Placeholders such as `?` or named parameters are formatted as text; the page does not supply parameter values. If a statement contains credentials or private data, remove them before sharing the formatted result.

A pasted script with several statements is still treated as SQL text. The formatter does not decide where a transaction begins, whether a migration is safe to rerun or which statements should execute together. Keep those decisions in the migration or database workflow. For procedural blocks and vendor-specific commands, select the matching dialect and compare the formatted output with the original before using it.

Formatting comments may also move them relative to surrounding whitespace. When a comment carries operational instructions, review its placement after formatting instead of assuming the visual layout is identical. The page has no line-width control, so a long expression may remain on one line or wrap according to the formatter's own rules rather than your editor's settings.

## Common mistakes to avoid

Do not treat a successful format as a successful syntax check. Run the statement in a safe development environment or use the database's own parser before deployment. Do not paste a production mutation into a review tool and then execute the formatted copy without checking its `WHERE` clause and transaction context.

Avoid reformatting only one side of a comparison. If two versions of a query are under review, format both with the same dialect so whitespace does not create noise. Finally, remember that this page has fixed style settings; it cannot enforce your team's wider lint rules.

## Browser and privacy behavior

The SQL text stays in the browser and is processed by the bundled formatter. There is no database connection, query upload or server-side execution endpoint in this operation. The result is session state rather than a saved history: resetting or reloading clears it. That reduces exposure, but the formatted SQL can still be sensitive if you paste it into another system.

## A review-ready workflow

1. Remove secrets and unrelated rows from the snippet.
2. Select the dialect used by the target database.
3. Paste the query and press **Format SQL**.
4. Read every clause, especially joins, filters and mutations.
5. Validate or execute in the proper database environment.
6. Copy or download the reviewed text with enough context for the next person.

<figure>
  <img src="/assets/img/blog/sql-formatter/example.svg" alt="Before-and-after example of the default one-line users query formatted into uppercase SQL clauses" width="1200" height="675" loading="lazy">
  <figcaption>The default users query demonstrates the fixed two-space indentation and uppercase keyword style used by this formatter.</figcaption>
</figure>

## Final checklist

Check the dialect, the intended table and column names, the filter logic and whether the statement is read-only. Keep the formatted text as documentation, but let the database be the authority on whether it runs.
