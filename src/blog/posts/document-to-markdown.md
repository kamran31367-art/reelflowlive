---
title: "Document to Markdown: convert DOCX, HTML or text locally"
description: "Convert DOCX, HTML, HTM, TXT or MD into Markdown in your browser, with a worked HTML example and clear limits for layout, images and unsupported files."
date: 2026-11-27
draft: false
categories:
  - Converters
cover: assets/img/blog/document-to-markdown/hero.svg
coverAlt: "A document, HTML source and plain text flowing into a clean Markdown file on a desk"
coverCaption: "The converter carries structure into Markdown; it does not reproduce the original page as a picture."
takeaways:
  - "Accepted inputs are DOCX, HTML, HTM, TXT and MD, with one file handled per conversion."
  - "DOCX is converted to HTML first and then mapped to Markdown; HTML and HTM use the same HTML-to-Markdown mapping."
  - "TXT and MD files are read as text and returned unchanged rather than being reformatted."
  - "Supported markup includes headings, paragraphs, emphasis, links, code, lists, images and basic tables."
  - "The result is plain Markdown, downloadable as document-to-markdown.md, with no upload or OCR."
faq:
  - q: "Which document formats can I convert?"
    a: "The file field accepts DOCX, HTML, HTM, TXT and MD. It does not accept legacy DOC, PDF, RTF or ODT. For a Word file, save it as DOCX first. For a PDF, use the PDF to Markdown tool, which extracts an existing text layer but does not perform OCR."
  - q: "Does a TXT or MD file get reformatted?"
    a: "No. Those extensions take the plain-text path: the file is read as text and returned unchanged. The structural HTML-to-Markdown conversion applies to DOCX, HTML and HTM. If a Markdown file needs formatting or previewing, use a Markdown editor instead."
  - q: "Will tables and images survive?"
    a: "Basic HTML tables become Markdown tables, with the first row treated as the header and pipe characters escaped. Images become Markdown image syntax using the available src and alt attributes. Complex table structures are flattened, and image portability depends on whether the resulting reference points to an accessible source."
  - q: "Is my document uploaded or read with OCR?"
    a: "Neither. Conversion runs in the browser, and DOCX, HTML and text are processed locally. There is no optical character recognition. Scanned images inside a document do not become searchable text, and the converter does not send the file to a server."
---

The [Document to Markdown Converter](/document-to-markdown/) converts one DOCX, HTML or plain-text file into Markdown in the browser. It is designed for moving readable document content into a text-based publishing format without uploading the source.

The result is not a visual replica. Fonts, page geometry and decorative styling give way to headings, paragraphs, links, lists and tables. Knowing which structures map cleanly, and which need review, makes the output much more useful.

## Choose the right input for the job

Use DOCX when the source is a modern Word document and you want its semantic content in Markdown. Use HTML or HTM when you have an exported page, email fragment or markup file. TXT and MD are accepted for a simple text handoff, but they are not transformed.

<figure>
  <img src="/assets/img/blog/document-to-markdown/workflow.svg" alt="A single document branching into DOCX HTML conversion or unchanged text before Markdown download" width="1200" height="675" loading="lazy">
  <figcaption>DOCX and HTML share a structural mapping; TXT and MD pass through as plain text.</figcaption>
</figure>

## Controls and accepted files

The **Document** dropzone accepts one file with one of these extensions:

```text
.docx  .html  .htm  .txt  .md
```

Click the dropzone or drag a file onto it, then press **Convert document**. **Reset** clears the selected file and the output. Changing the selection does not run automatically; the action button starts the conversion.

The output pane is labelled **Markdown**. After a successful run it shows the generated text, with **Copy** and **Download** available. Download creates `document-to-markdown.md` as UTF-8 text.

There are no options for heading offsets, table formatting, image embedding or link rewriting. If the source needs those transformations, make them in the Markdown file after conversion.

## A worked HTML example

Start with a small HTML fragment containing a heading, emphasis, a link, a list and a two-column table:

```html
<h2>Launch notes</h2>
<p>Review the <strong>release checklist</strong> before publishing.</p>
<p>Read the <a href="/publishing-guide/">publishing guide</a>.</p>
<ul>
  <li>Check links</li>
  <li>Check images</li>
</ul>
<table>
  <tr><th>Task</th><th>Status</th></tr>
  <tr><td>Copy</td><td>Ready</td></tr>
</table>
```

The converter produces Markdown like this:

```markdown
## Launch notes

Review the **release checklist** before publishing.

Read the [publishing guide](/publishing-guide/).

- Check links
- Check images

| Task | Status |
| --- | --- |
| Copy | Ready |
```

<figure>
  <img src="/assets/img/blog/document-to-markdown/example.svg" alt="An HTML launch note with a heading, link, list and table mapped to equivalent Markdown syntax" width="1200" height="675" loading="lazy">
  <figcaption>Semantic structure maps to Markdown; page styling and visual placement do not.</figcaption>
</figure>

## What the Markdown mapping supports

Headings from `h1` through `h6` become the matching number of `#` characters. Paragraphs become blank-line-separated blocks. Bold and italic markup becomes `**strong**` and `*emphasis*`.

Links become `[text](href)`. Inline code becomes backtick code, while `pre` blocks become fenced code blocks. A line break becomes a Markdown line break. List items become hyphen bullets, whether the source list was ordered or unordered.

Images become `![alt](src)` using the available attributes. Tables use the first row as a header and escape pipe characters inside cells. This is a basic structural mapping, not a full HTML renderer or a general-purpose conversion framework.

## DOCX-specific considerations

DOCX conversion uses Mammoth to produce HTML, followed by the same Markdown mapping. Standard headings, paragraphs, emphasis, hyperlinks, lists and tables are the intended path.

Word features that have no direct Markdown equivalent should not be expected to survive as visual formatting. Page size, margins, fonts, colours, columns, headers and footers are outside the output model. Complex layouts may also change reading order when flattened into paragraphs.

Images and hyperlinks deserve a separate check. An image reference needs an accessible source at the destination, and a link needs the correct target. The converter does not provide a package of linked assets or rewrite relative URLs for a new site structure.

## Tables, lists and other edge cases

The table mapper takes the first `tr` as the header row, even if the source did not mark header cells. It does not reconstruct merged cells, nested tables or spanning headers. Review the result when the original table uses anything more complex than a simple grid.

Ordered lists become hyphen bullets. Numbering style and start values are not retained, and nested list indentation may need manual repair. This is usually acceptable for editorial Markdown, but it matters for procedures where step numbers carry meaning.

Pipes inside table cells are escaped, which helps preserve the table syntax. Very large tables can still produce unwieldy Markdown, and there is no explicit file-size limit in the code. Browser memory and the conversion libraries set the practical boundary.

Plain-text input follows a simpler route. A `.txt` or `.md` file is returned unchanged, so headings and lists are only present if they were already in the file. The converter does not infer structure from spacing or typography in a text file.

## Common mistakes to avoid

Do not choose this tool for a scan and expect OCR. Text embedded in an image remains an image reference or is omitted according to the document structure; no characters are recognised from pixels.

Do not assume a downloaded `.md` file is ready to publish. Check heading levels, list indentation, table headers, image sources and link targets in the destination renderer. Markdown support varies between content management systems.

Avoid using the result as an archival replacement for the source. Layout and document-specific features are intentionally lost. Keep the DOCX or HTML original until the Markdown has passed review.

Finally, do not rename a PDF or DOC file to an accepted extension and expect it to work. Extension checks choose a conversion path, but the file still has to parse correctly.

## Local processing and privacy

The file is read with browser APIs. DOCX is opened by the bundled Mammoth library, HTML is parsed with the browser's DOM parser and plain text is read locally. No document upload or account is required.

That makes the tool suitable for confidential drafts, internal knowledge bases and unpublished client material. The file is not sent to a conversion service, and the result exists in the open tab until you copy, download or reset it.

Local processing does not make linked resources private. If HTML references remote images or scripts, the converter maps markup without fetching those assets into a portable package. The resulting Markdown should still be checked for unintended links or embedded source text.

## A practical workflow

1. Keep the source file and save a working copy if it is still being edited.
2. Confirm that the extension is DOCX, HTML, HTM, TXT or MD.
3. Choose the file and press **Convert document**.
4. Read the Markdown output before downloading it.
5. Fix heading levels, list nesting and table headers in a text editor.
6. Check image paths and links in the destination system.
7. Download `document-to-markdown.md`, rename it for the project and retain the source.

For Word documents, a quick comparison of the first page, one list and one table catches most conversion surprises before the file enters a publishing pipeline.

## Final checklist

- The source uses an accepted extension and opens as a valid file.
- TXT or MD input is expected to pass through unchanged.
- Heading levels match the destination hierarchy.
- Lists, tables and links have been reviewed.
- Image references point to assets that will exist after publishing.
- No OCR or visual-layout preservation is expected.
- The Markdown has been saved under a meaningful name.

Document-to-Markdown conversion is most reliable when the source is structurally simple. Treat the output as editable source text, check the structures that matter and keep the original until the new version is verified.
