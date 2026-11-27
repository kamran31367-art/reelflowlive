---
title: "Add Text to Each Line: prefixes, suffixes and numbering"
description: "Add prefixes, suffixes and line numbers to every line, with a worked list, exact ordering rules, blank-line behaviour and a copy-and-download checklist."
date: 2026-11-27
categories:
  - Text
cover: assets/img/blog/add-text-to-lines/hero.svg
coverAlt: "List transformation diagram showing a prefix, line number and suffix added to three plain text lines"
coverCaption: "Line decoration is simple only when the ordering is clear: this tool puts the number first, then the prefix, the original line and the suffix."
takeaways:
  - "Prefix and suffix can be used together, and Add line numbers inserts a number followed by a period and space before the prefix."
  - "The default three-line sample has blank prefix and suffix fields, with line numbering switched off."
  - "Blank lines are processed too; a trailing newline creates a final empty line that can receive decoration."
  - "Carriage returns are removed and output uses line feeds, but leading and trailing spaces within each line are preserved."
  - "The result is plain text in a .txt download, not a generated HTML list, CSV file or escaped code block."
faq:
  - q: "Can I add a prefix and suffix at the same time?"
    a: "Yes. Each line is rebuilt in this order: optional line number, prefix, original line, suffix. Both text fields can contain values, and they are applied to every line, including empty lines."
  - q: "Can I skip blank lines?"
    a: "No. There is no skip-blank-lines option. Remove unwanted blank lines before pasting, or accept that they will receive the same number, prefix and suffix as the other lines."
  - q: "Does the tool trim spaces?"
    a: "No. Leading and trailing spaces inside each line remain. It removes carriage-return characters and joins lines with line feeds, but it does not trim indentation or other whitespace."
  - q: "Can I choose the starting number or add leading zeros?"
    a: "No. Numbering always starts at 1 and uses the plain form 1., 2., 3. and so on. A custom padded number must be included in the prefix or prepared outside this tool."
draft: false
---

A plain list often needs the same small addition on every row: a bullet, a label, a quote marker or a checklist box. Doing it by hand is slow and introduces missed lines. The [Add Text to Each Line](/add-text-to-lines/) tool applies a prefix, a suffix and optional numbering to a whole block while keeping the original line order.

It is a text transformer, not a list parser. That distinction matters when blank lines, indentation or structured formats are involved, so this guide covers the exact construction order and the cases that need a cleaner input first.

## What the tool solves

Use it when every line needs identical decoration. A block of topic ideas can become checklist items with a `- [ ] ` prefix. A set of names can receive a label before each entry. A quotation can gain opening and closing markers without selecting each paragraph separately.

The operation is line-based. It does not inspect the meaning of a row, parse columns or decide which entries deserve formatting. That makes it predictable for plain-text lists and unsuitable for complex documents where only selected lines should change.

There is no find-and-replace mode. If the same text must be added only to lines containing a particular word, filter the list first with the [Filter Lines Online](/filter-lines/) tool, then decorate the result here.

## Controls and defaults

The **Lines** textarea starts with these three rows:

```text
First line
Second line
Third line
```

Replace them with your own block. The **Prefix** field is empty by default, as is **Suffix**. Enter the exact characters that should appear before or after every line, including any space you want after a bullet or before punctuation.

**Add line numbers** is unchecked by default. When enabled, it adds `1. `, `2. `, `3. ` and so on. Numbering always restarts at one and has no padding or custom starting value.

Press **Update lines** to generate the result. Changes do not run automatically. **Reset** restores the three sample lines and clears the decoration settings. **Copy** and **Download** work on the updated text.

## Worked example: a numbered checklist

Keep the default three lines, set **Prefix** to `- [ ] ` and leave **Suffix** empty. Tick **Add line numbers**, then press **Update lines**.

The result is:

```text
1. - [ ] First line
2. - [ ] Second line
3. - [ ] Third line
```

This demonstrates the exact order. The number comes first, then the prefix, then the original line. If you also set the suffix to `;`, each row ends with a semicolon.

For a cleaner Markdown checklist, leave numbering off and use only the `- [ ] ` prefix. The generated lines can then be pasted into a Markdown editor without the extra numeric labels.

<figure>
  <img src="/assets/img/blog/add-text-to-lines/example.svg" alt="Three input lines transformed into numbered checklist lines with a prefix and empty suffix" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: line numbers precede the checklist prefix, producing 1. - [ ] First line and the next two numbered rows.</figcaption>
</figure>

## How line construction works

Every line is assembled independently as **number + prefix + original line + suffix**. The tool then joins those rebuilt lines with line-feed characters. It does not add a final line feed unless the input itself contains a trailing empty line.

Because the original line sits between the two fields, a suffix is attached directly. If you want a space before a comma, semicolon or closing bracket, include that space in the suffix. The same rule applies to the prefix: `- ` and `-` produce different results.

The operation removes carriage-return characters before splitting on line feeds. Normal Windows CRLF text therefore becomes consistent LF output. Old text that uses carriage returns alone will not be split into separate rows, because those returns are removed rather than treated as line boundaries.

## Output and formats

The output is plain text. **Copy** places it on the clipboard, and **Download** saves a `.txt` file based on the tool slug. No Markdown, HTML or CSV structure is created for you.

That means a prefix such as `- ` is only text until you paste it into a system that interprets Markdown. Likewise, adding quotation marks does not escape embedded quotes, and adding commas does not create valid CSV cells. Use the tool for visual or plain-text decoration, then validate the result in the destination format.

The output area shows the complete transformed block. If the input is large, keep the result manageable before copying it into another field with its own length limit.

## Limits and edge cases

Blank lines are real lines here. An empty line receives the number, prefix and suffix just like a filled line. If the input ends with a newline, splitting creates one final empty row, so that row can become a numbered or decorated blank at the end.

Leading indentation and trailing spaces are preserved. This is useful when formatting code-like lists, but it can also carry accidental whitespace into the output. There is no trim option, case conversion, duplicate removal or conditional rule.

There is no configured maximum length. Performance depends on the browser and the amount of text. Very large lists can be slow to render and may exceed the practical limits of the application receiving the result.

## Common mistakes

The most common mistake is expecting blank lines to be ignored. Clean the input first if empty rows should stay empty. Another is forgetting the space in a prefix: `-` alone produces a hyphen, not a Markdown bullet.

Do not assume numbering creates an ordered-list document. It creates characters at the start of each line. If the destination already adds its own numbers, leave **Add line numbers** off to avoid duplicate labels.

Finally, decoration is not escaping. A prefix or suffix can break CSV, JSON, source code or shell text if it introduces an unescaped character. Treat the output as plain text and test it in the real destination before using it at scale.

## Browser and privacy

The transformation runs locally in the page. Your lines are not uploaded by the tool, and there is no account or server-side processing step. The page itself and its assets load normally, but the text operation stays in the browser.

The tool does not save the input to browser storage. Reloading, resetting or closing the tab clears the working block. Copy or download only when you are ready to move the result, especially if the source list contains private names, internal notes or unpublished material.

## A practical list workflow

Clean the structure before decorating it. Remove unwanted blank rows, confirm the line endings and decide whether numbering belongs in the final format.

<figure>
  <img src="/assets/img/blog/add-text-to-lines/workflow.svg" alt="Workflow from cleaning a list through choosing prefix suffix and numbering to copying or downloading decorated lines" width="1200" height="675" loading="lazy">
  <figcaption>Workflow: clean the source list, choose decoration, run one transformation, then validate the plain text in its destination.</figcaption>
</figure>

For conditional work, filter first. For example, keep only pending tasks, add the checklist prefix, and paste the result into the [Markdown Editor](/markdown-editor/) to verify that the preview recognises the list. This separates selection from decoration and makes mistakes easier to trace.

## Final checklist

- Remove blank lines that should not receive a number, prefix or suffix.
- Include deliberate spaces in prefixes and suffixes.
- Decide whether the destination already supplies numbering.
- Check the first and last lines, especially when the input ends with a newline.
- Preserve indentation only when it is intentional.
- Validate structured output in the application that will consume it.
- Copy or download before resetting the page.
- Keep the original list until the transformed version has been checked.
