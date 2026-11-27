---
title: "Word to Markdown: convert a DOCX and check the structure"
description: "Turn a Word DOCX into Markdown with headings, lists, links and tables, plus a worked example and the document features that do not carry over."
date: 2026-11-27
draft: false
categories:
  - Converters
cover: assets/img/blog/word-to-markdown/hero.svg
coverAlt: "A Word document with styled headings and a table beside its plain Markdown source"
coverCaption: "Word stores a page; Markdown stores a structure. Conversion keeps the useful structure and leaves the page design behind."
takeaways:
  - "The converter accepts one DOCX file and runs Mammoth locally before mapping the resulting HTML to Markdown."
  - "Headings, paragraphs, bold, italics, links, lists, images and basic tables are the main supported structures."
  - "Ordered lists become hyphen bullets, and tables use their first row as the Markdown header."
  - "Legacy DOC and PDF are not accepted, and page layout, fonts and comments are not preserved."
  - "The result downloads as word-to-markdown.md and should be reviewed before publishing."
faq:
  - q: "Can I convert a DOC file instead of DOCX?"
    a: "No. The file field accepts .docx only. Open the legacy document in Word or another compatible editor and save it as DOCX first. Renaming the extension without resaving does not convert the underlying file format."
  - q: "Will Word formatting look the same in Markdown?"
    a: "No. Semantic structures such as headings, emphasis, links, lists and tables can be represented, but fonts, colours, page margins, columns and exact spacing cannot. Markdown renders according to the destination site's styles."
  - q: "Does it perform OCR on scanned pages in a Word document?"
    a: "No. The converter reads the DOCX structure and maps text and supported elements. It does not recognise characters inside scanned images. A scanned page needs OCR before its words can become Markdown text."
  - q: "What happens to images and complex tables?"
    a: "Images become Markdown image references, so their availability depends on the source reference after conversion. Basic tables become pipe tables with the first row as a header. Merged cells, nested tables and complicated spanning layouts are not reconstructed and need manual review."
---

The [Word to Markdown Converter](/word-to-markdown/) turns one modern Word `.docx` file into editable Markdown in the browser. It is built for content handoff: moving an article, policy, help page or set of notes out of a word processor and into a text-based publishing workflow.

The conversion is structural, not visual. A Word heading can become a Markdown heading, but its font, colour and exact position on the page cannot. The best results come from documents that already use clear styles rather than manual formatting.

## What DOCX conversion is good for

Use this tool when the source is a genuine DOCX file and the destination accepts Markdown. Common cases include help articles, documentation, meeting notes, reports and web copy that began life in Word.

It is not the right path for a scanned document, a PDF or a legacy `.doc` file. There is no OCR, and the file picker accepts only DOCX. For mixed document types, the [Document to Markdown Converter](/document-to-markdown/) also accepts HTML and plain text.

<figure>
  <img src="/assets/img/blog/word-to-markdown/workflow.svg" alt="A DOCX file unpacked locally into HTML structure and then mapped to downloadable Markdown" width="1200" height="675" loading="lazy">
  <figcaption>Mammoth reads the DOCX structure; the second step turns supported HTML elements into Markdown.</figcaption>
</figure>

## The file control and action button

The **Word document** dropzone accepts one `.docx` file. Click it to choose a document or drag a DOCX onto it. Multiple files are not supported, and the conversion does not start merely because a file was selected.

Press **Convert Word file** to begin. The page reads the document, converts it to HTML and maps that HTML into Markdown. During processing the action button shows a working state. When the operation finishes, the **Markdown** pane contains the result and the status reports completion.

**Reset** clears the selected document and the result. There is no style selector, heading-level override or table option. If the output needs changes, edit the Markdown after downloading or copying it.

## A worked DOCX example

Imagine a one-page DOCX with these elements:

- A Heading 1 called **Contributor guide**.
- A normal paragraph containing the bold phrase **save your draft**.
- A hyperlink to `/style-guide/`.
- A bulleted list with **Check links** and **Check images**.
- A two-column table with headers **Task** and **Owner**, followed by one data row.

Choose the file and press **Convert Word file**. A representative result is:

```markdown
# Contributor guide

Remember to **save your draft** before you leave.

Read the [style guide](/style-guide/).

- Check links
- Check images

| Task | Owner |
| --- | --- |
| Review copy | Editorial |
```

The Word style is what gives the converter a heading level to work with. Text made large with manual font sizing is less reliable than a proper Heading style because it may remain a paragraph in the document structure.

<figure>
  <img src="/assets/img/blog/word-to-markdown/example.svg" alt="A styled Word contributor guide mapped to Markdown headings, bold text, a link, bullets and a table" width="1200" height="675" loading="lazy">
  <figcaption>Proper Word styles carry useful meaning; manual visual styling alone may not become a heading.</figcaption>
</figure>

## Structures that map well

Heading styles become Markdown headings at the corresponding level. Normal paragraphs become text blocks, while bold and italic runs become emphasis markup. Hyperlinks become Markdown links using their target addresses.

List items become hyphen bullets. The conversion does not retain the visual bullet glyph from Word, because Markdown renderers supply their own list styling. Inline code and code blocks are supported through the HTML mapping when the DOCX conversion produces those structures.

Basic tables become Markdown pipe tables. The first row is used as the header, and pipe characters inside cell text are escaped. This works well for simple grids such as schedules, specifications and comparison tables.

## What does not carry over

Markdown has no direct equivalent for Word's page canvas. Page size, orientation, margins, headers, footers, columns, watermarks and exact line spacing are not reproduced. Font family, font colour and character spacing also give way to the destination's Markdown styles.

Tables are flattened into rows and cells. Merged cells, nested tables, vertical headers and complex spanning are not reconstructed as rich table structures. If the original depends on those features, simplify it in Word or rebuild that section in the destination editor.

Only DOCX is accepted. Legacy DOC, RTF, ODT, PDF and scanned image files are outside this tool's input list. If a document is still in an older format, open it in a compatible editor and save a copy as DOCX first.

There is also no OCR. Text that exists only as a picture inside the DOCX remains a picture. Optical character recognition is a separate process, and no part of this conversion recognises characters from pixels.

## Output, naming and size limits

The result appears as plain Markdown in the output pane. **Copy** places it on the clipboard, while **Download** saves `word-to-markdown.md` as UTF-8 text. The source filename is not used, so rename the download to match the document or article slug.

The implementation does not declare a fixed DOCX file-size cap. Practical limits depend on browser memory and the bundled conversion library. Very large documents, oversized images or unusually complex XML may fail or take longer, so test a representative file before converting a large collection.

## Common mistakes to avoid

Do not format headings by size alone. Use Word's Heading styles when possible, because they communicate structure to the converter. The same applies to real lists and tables rather than manually typed bullets, spaces and tabs.

Do not assume a successful run means the Markdown is publication-ready. Check heading hierarchy, list nesting, table shape, image references and link targets in the actual destination renderer.

Finally, keep the DOCX. Markdown intentionally loses visual layout and some document-specific features, so the Word file remains the reference for design, approvals and archival needs.

## Local processing and privacy

The DOCX is read in the browser and processed by bundled code. The file is not uploaded to a conversion server, and no account is required. The resulting HTML and Markdown stay in the open tab until you copy, download or reset them.

Images and hyperlinks may point to external locations. Conversion does not make those resources private or guarantee that they remain available. Review the Markdown for unintended links, and keep sensitive source documents out of broadly shared folders.

## A practical workflow

1. Save a DOCX copy and resolve any tracked changes you do not want in the output.
2. Use real Heading, list and table structures in the source where possible.
3. Choose the DOCX in the file field and press **Convert Word file**.
4. Read the output before downloading, focusing on headings, lists and tables.
5. Copy or download the Markdown and rename it for the destination.
6. Open it in the target renderer and compare it with the Word original.
7. Repair list numbering, complex tables and image references manually.
8. Retain the DOCX until the Markdown version has passed review.

## Final checklist

- The source is a valid DOCX, not a renamed legacy file.
- Headings use Word styles rather than size-only formatting.
- Ordered and nested lists have been reviewed.
- Tables are simple enough for a pipe-table representation.
- Images and links will resolve after publishing.
- Comments and revisions have been handled in Word.
- The Markdown is saved under a meaningful name and the DOCX is retained.

Word-to-Markdown conversion works best as the first step in a reviewable publishing workflow. Preserve the source, inspect the structures and let the destination's Markdown renderer handle the visual design.
