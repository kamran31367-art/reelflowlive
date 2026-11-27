---
title: "Filter Lines Online: keep, remove and deduplicate text"
description: "Keep or remove lines with case-insensitive text, starts-with, ends-with, regex and unique modes. See worked filters, inversion rules and edge cases."
date: 2026-11-27
categories:
  - Text
cover: assets/img/blog/filter-lines/hero.svg
coverAlt: "Diagram of a mixed line list being filtered into matching and rejected rows with an inversion switch"
coverCaption: "Filtering is a selection rule, not a rewrite: matching lines keep their original text and order unless you explicitly invert the result."
takeaways:
  - "Match modes are Contains, Starts with, Ends with, Regular expression and Unique lines only."
  - "Text matching and regular expressions are case-insensitive; there is no case-sensitive checkbox."
  - "Invert match reverses the selection, turning a keep filter into a remove filter for the same rule."
  - "Unique lines only keeps the first version of each line after lowercasing, so Apple and apple count as duplicates."
  - "Blank lines and surrounding spaces are significant, and Copy or Download saves plain text rather than a spreadsheet."
faq:
  - q: "Is the filter case-sensitive?"
    a: "No. Contains, starts-with, ends-with and regular-expression matching all ignore case. Unique mode also lowercases lines before comparison, so entries that differ only by capitalisation are treated as duplicates."
  - q: "What does Invert match do?"
    a: "It keeps the lines that would otherwise be rejected. For example, Contains ap normally keeps apple, apricot and pineapple; with inversion, those lines are removed and the non-matching rows remain."
  - q: "Can I use several filters at once?"
    a: "No. Each run applies one mode and one query. For a multi-step cleanup, run the tool repeatedly or prepare a combined JavaScript regular expression. Keep a copy of the original list between steps."
  - q: "Why did Unique lines only remove two different-looking entries?"
    a: "Unique comparison lowercases each complete line. Apple and apple therefore collapse to the first spelling. Leading or trailing spaces are not removed, so Apple and Apple with a trailing space remain different lines."
draft: false
---

Exports, logs and pasted lists rarely arrive in the shape you need. Sometimes you want every row containing a term; sometimes you want everything except those rows. The [Filter Lines Online](/filter-lines/) tool makes that selection without changing the wording or order of the lines it keeps.

Its five match modes cover ordinary text rules, regular expressions and simple de-duplication. The important details are case handling, whitespace and inversion, because those determine whether a filter is a useful selection or an accidental data-loss step.

## What line filtering is for

Use a filter to narrow a list before another task. You might keep only pending orders, remove comment lines from a configuration, isolate email addresses ending in a domain, or collapse repeated entries from merged exports.

The operation is line-based and non-destructive to the source text outside the page. Each selected line is returned intact. It does not extract the matching substring, sort the list, number the rows or combine matches into a report.

This makes it a good companion to the [Add Text to Each Line](/add-text-to-lines/) tool: select the relevant rows first, then decorate only that subset. It is not a full spreadsheet query engine and has no column selection or multi-condition builder.

## Controls and defaults

The **Lines** field opens with `apple`, `banana`, `apricot` and `cherry`, each on its own row. **Match** defaults to **Contains**, and **Match text or regex** contains `ap`. **Invert match** is off.

The Match selector offers five choices:

- **Contains** looks for the query anywhere in a line.
- **Starts with** checks the beginning of the line.
- **Ends with** checks the end of the line.
- **Regular expression** applies a JavaScript regular expression.
- **Unique lines only** keeps the first case-insensitive occurrence of each complete line and ignores the query.

Press **Filter lines** to run the operation. It does not update automatically after each edit. **Reset** restores the sample list, `ap`, Contains mode and an unchecked inversion box.

## Worked example: contains and invert

Replace the sample with:

```text
apple
banana
apricot
cherry
pineapple
APPLE
```

Keep Mode on **Contains** and the query at `ap`. Matching ignores case, so the result is:

```text
apple
apricot
pineapple
APPLE
```

`pineapple` qualifies because `ap` appears inside it, while `APPLE` qualifies after case folding. Tick **Invert match** and run again. The result becomes:

```text
banana
cherry
```

Switch to **Starts with** and turn inversion off to see a narrower rule: `apple`, `apricot` and `APPLE` remain, but `pineapple` drops out because the match is not at the beginning.

<figure>
  <img src="/assets/img/blog/filter-lines/example.svg" alt="Six fruit lines filtered by case-insensitive Contains ap into four matches and then inverted into banana and cherry" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: Contains ap keeps apple, apricot, pineapple and APPLE; inversion keeps only banana and cherry.</figcaption>
</figure>

## Regular expressions and unique lines

Regular-expression mode creates a JavaScript `RegExp` with the case-insensitive `i` behaviour. You cannot add your own flags through a separate control. A pattern such as `^a|rry$` matches lines beginning with `a` or ending with `rry`, so it selects `apple`, `apricot` and `cherry` from the example.

An invalid pattern produces **The regular expression is not valid.** Correct the expression before using the result. Keep patterns simple on large lists: a pathological expression can make the browser work for a long time.

**Unique lines only** compares lowercased complete lines and preserves the first occurrence. Given `Apple`, `banana`, `apple` and `APPLE`, it returns `Apple` and `banana`. The query field has no effect in this mode. Inverting Unique mode does not simply return unique lines; it removes each first occurrence and keeps later case-insensitive duplicates.

## Output and formats

The result is plain text with line feeds between retained rows. **Copy** places the filtered block on the clipboard. **Download** saves a `.txt` file named after the tool. Neither option creates a CSV, database table or automatically numbered list.

The page shows errors in the output area when a regular expression is invalid. A successful filter with no retained rows can look like an empty result, so check the mode, query and inversion state before assuming the source was empty.

If no lines match, there is no summary count or rejected-lines view. Compare the result with the original block manually, or run the inverse filter when you need to inspect what was excluded.

## Limits and edge cases

Text modes do not trim lines. ` apple` does not start with `apple`, and `apple ` does not end with `apple` if the query is exactly `apple`. Clean accidental whitespace before filtering when exact boundaries matter.

An empty query matches every line in Contains, Starts with and Ends with mode. An empty regular expression also matches every line. That can be useful, but it is easy to trigger by clearing the field unintentionally.

Blank lines count as lines. Unique mode can remove repeated blank lines, while ordinary filters keep or reject them according to the same rule as any other row. There is no configured maximum length, although very large lists and complex regular expressions are limited by browser performance and memory.

## Common mistakes

Assuming case sensitivity is the biggest trap. Search terms, regular expressions and duplicate comparison all fold case. If two capitalisations are genuinely different records, this page cannot preserve that distinction on its own.

Do not confuse Contains with a whole-line match. A short query can select many unexpected rows, especially inside longer words. Use Starts with, Ends with or a carefully anchored expression when boundaries matter.

Be careful with inversion: it reverses the final decision for every line. Also remember that Unique mode ignores the query. Finally, never use a destructive filter as your only copy; keep the original export until the selected list has been checked.

## Browser and privacy

Filtering runs locally with JavaScript in the page. The entered lines are not uploaded by the tool, and there is no signup or server-side filtering service. Normal page assets still load, but the list processing stays on the device.

There is no browser-storage save. Reloading, resetting or closing the tab clears the working list. Copy or download only the result you intend to keep, particularly when the source contains customer records, credentials, internal paths or unpublished work.

## A safe filtering workflow

Decide whether you are selecting matches or removing them before touching Invert. Then test the rule on a short sample that includes upper case, whitespace and near-matches.

<figure>
  <img src="/assets/img/blog/filter-lines/workflow.svg" alt="Workflow showing source list cleanup, match mode selection, query testing, optional inversion and result verification" width="1200" height="675" loading="lazy">
  <figcaption>Workflow: clean the input, test a representative query, choose keep or remove behaviour, then verify the retained order.</figcaption>
</figure>

For a multi-stage list, filter first and format second. For example, keep only lines beginning with `TODO`, remove blanks in a separate cleanup, then use [Add Text to Each Line](/add-text-to-lines/) to create checklist rows. Each stage has one clear purpose and can be checked independently.

## Final checklist

- Confirm whether the rule should keep matches or remove them.
- Test upper case, near-matches and leading or trailing spaces.
- Use anchors when a match must occur at a line boundary.
- Treat Unique mode as case-insensitive and verify which spelling appears first.
- Check the first and last retained lines against the source.
- Keep the original list until the result is accepted.
- Avoid expensive regular expressions on very large inputs.
- Copy or download the result before leaving the page.
