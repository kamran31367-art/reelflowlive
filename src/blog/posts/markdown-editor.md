---
title: "Markdown Editor: live preview, sanitised HTML and export"
description: "Write Markdown with a live preview, inspect sanitised HTML and export HTML or Markdown, with worked output, heading-level rules and security limits."
date: 2026-11-27
categories:
  - Text
cover: assets/img/blog/markdown-editor/hero.svg
coverAlt: "Split-pane Markdown editor showing source text, rendered preview and an HTML export document"
coverCaption: "The preview, HTML source and Markdown source are three views of the same draft, but they do not export with identical heading levels or file types."
takeaways:
  - "The editor opens with a heading, bold text and a list, and Output defaults to HTML preview."
  - "Markdown is parsed with GFM enabled and breaks enabled, so a single newline becomes an HTML line break."
  - "Preview shifts every heading down one level to reserve the H1 for a host page; HTML source and export keep the original levels."
  - "Raw HTML is sanitised, scripts and iframes are forbidden, and remote or relative image sources are removed."
  - "Preview and HTML source download markdown-export.html, while Markdown source downloads markdown-export.md; exported HTML has no site stylesheet."
faq:
  - q: "Why does my H1 appear as H2 in the preview?"
    a: "The preview deliberately lowers heading levels by one so a host page can keep its own H1. HTML source and the downloaded HTML retain the original levels. This shift is preview-only."
  - q: "Does the preview execute scripts or load remote images?"
    a: "Raw HTML is sanitised before rendering. Scripts, iframes, forms and several other active tags are forbidden. The extra source filter removes remote and relative image sources, allowing only data or blob sources, so those images are not fetched by the preview."
  - q: "Can I export a PDF or Word document?"
    a: "No. The available downloads are a minimal HTML document and a Markdown source file. Use another tool for PDF or DOCX conversion, and add your own CSS when the exported HTML is published."
  - q: "Does Copy always copy the Markdown source?"
    a: "No. In HTML preview and HTML source modes, Copy returns sanitised rendered HTML. In Markdown source mode, it returns the original Markdown. Check the Output selector before copying."
draft: false
---

Markdown is easy to write but awkward to proof without rendering. A missing blank line can change a list, and a heading level that looks reasonable in source may be wrong in the final page. The [Markdown Editor](/markdown-editor/) provides source, live preview, HTML source and Markdown source in one browser page.

It also sanitises rendered HTML and exports either HTML or Markdown. Those features make it useful for drafting and checking, but the preview has a deliberate heading shift and the HTML export is intentionally minimal.

## What the editor is for

Use it to draft documentation, release notes, readme content, email-friendly HTML snippets or other Markdown that needs a quick visual check. The live preview helps catch list and emphasis mistakes while the source is still easy to edit.

The page is not a complete CMS. It has no file browser, image uploader, account, version history or collaborative editing. It also does not apply your website's stylesheet to the preview, so the result shows structure and default browser presentation rather than the final branded design.

For plain-text statistics, use the [Simple Online Text Editor](/simple-text-editor/). For a publishing pipeline, keep the Markdown source in version control and treat this page as a drafting and inspection surface.

## Controls and defaults

The **Markdown** textarea starts with a heading, a sentence containing bold text and a three-item list. It has twelve visible rows and spell checking disabled.

**Output** defaults to **HTML preview**. Its other options are **HTML source** and **Markdown source**. Changing the selector changes both the result pane and what Copy and Download produce.

The preview updates automatically after a short pause. **Render Markdown** runs the same operation on demand. **Reset** restores the sample Markdown and preview mode.

There is no separate theme, heading-level or export-style control. The parser uses GFM, treats single line breaks as HTML line breaks and applies the page's fixed sanitisation rules.

## Worked example: source and preview

Enter this Markdown:

```markdown
Release notes
------------

Fast **local** preview.

- Copy
- Download
```

In **HTML preview**, the heading appears one level lower, as an H3. The sentence renders with `local` in bold, and the two items appear as an unordered list. The shift happens because the preview reserves H1 for a host page.

Switch to **HTML source** and the heading remains an H2. The relevant output includes `<h2>Release notes</h2>`, `<p>Fast <strong>local</strong> preview.</p>` and list markup. Switch to **Markdown source** to recover the exact draft text.

<figure>
  <img src="/assets/img/blog/markdown-editor/example.svg" alt="Markdown source with an H2 heading, bold sentence and list beside a preview where the heading is shifted to H3" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: the source H2 remains H2 in HTML source, while the live preview deliberately displays it as H3.</figcaption>
</figure>

## Output modes and heading levels

**HTML preview** renders the sanitised HTML inside the page's preview styling. Every heading from H1 through H6 is lowered by one level, with H6 remaining H6. This avoids placing a document title above a host page's existing title.

**HTML source** shows the sanitised rendered HTML as text. It does not apply the preview heading shift, so it is the better view for copying markup into a template.

**Markdown source** shows the original input unchanged. It is the right mode when you want to preserve the draft rather than the rendered result.

The shift affects preview only. Downloading from HTML preview produces HTML with the original heading levels, not the lowered preview levels. Check both views when a document will be embedded in a page with its own heading hierarchy.

## Markdown parsing behaviour

The parser enables GitHub-flavoured Markdown, commonly called GFM. That covers familiar features such as tables, task lists, fenced code blocks and strikethrough. Fenced code is rendered as code, but this page does not add syntax highlighting.

The `breaks` option is also enabled. A single newline inside a paragraph becomes an HTML line break rather than collapsing to a space. Blank lines still separate paragraphs and many block elements. This is useful for notes and email-style drafts, but it differs from Markdown renderers that require two trailing spaces for a hard break.

Links and emphasis are rendered as HTML. The preview does not generate a table of contents or add heading IDs, so do not rely on automatic anchor links without checking the exported markup.

## Sanitisation and safe HTML

Markdown can contain raw HTML. Before rendering or export, the editor sanitises it rather than trusting it. Active elements including scripts, iframes, forms, objects and embedded content are forbidden, along with tags such as `style`, `link`, `meta` and `base`.

A second filtering pass reviews attributes. Inline styles containing unsafe constructs are reduced or removed. Image and media sources are restricted to `data:` or `blob:` values, so ordinary remote and relative image URLs are removed rather than fetched. External hyperlinks on anchors may remain.

Sanitisation is a safety layer, not a guarantee that arbitrary HTML is suitable for publication. Review the HTML source before embedding it, and treat links from untrusted Markdown as untrusted destinations. Clicking an external link can leave the site and contact that destination.

## Export and copy formats

In **HTML preview**, Copy returns the sanitised HTML, not the visible prose. Download creates `markdown-export.html`, a minimal document containing a doctype, UTF-8 declaration, title and the sanitised HTML body.

In **HTML source**, Copy and Download produce the same HTML content and filename. The exported document has no site CSS, fonts, navigation or scripts, so it opens with browser-default styling. Add your own stylesheet or integrate the fragment into a styled page.

In **Markdown source**, Copy returns the original Markdown and Download creates `markdown-export.md`. This is the mode to use when the source file matters more than the rendered output.

An empty editor shows a prompt instead of a document preview. Enter Markdown before relying on Copy or Download.

## Limits and edge cases

There is no configured source-length limit, but large documents can slow parsing, sanitising and preview rendering. Browser memory and the destination platform still impose practical constraints.

Sanitisation may remove HTML you intended to keep, especially remote images and active embeds. If an image disappears, inspect HTML source and host the image through an allowed workflow instead of assuming the Markdown link is broken.

The preview heading shift can make a draft look structurally different from its exported HTML. GFM support also does not mean every extension from every Markdown platform is available. Test site-specific shortcodes, directives or custom syntax elsewhere; this editor only parses the supported Markdown and raw HTML path.

## Browser and privacy

Parsing, sanitising and exporting happen in the browser. The Markdown you enter is not uploaded by the tool, and there is no account or server-side render step. Normal page assets load, but the document conversion stays on the device.

There is no autosave or browser-storage recovery. Reloading, resetting or closing the tab clears the draft, so download the Markdown source before leaving. A copied HTML fragment or downloaded file contains your document content and should be handled with the same care as the original.

Remote images are stripped rather than loaded by the preview. External links can still lead elsewhere if clicked. Avoid putting confidential text into Markdown that will later be published or pasted into a shared system.

## Workflow and final checklist

Write a small section first. Check the preview, switch to HTML source and inspect the result before expanding the document. This catches structural problems while they are cheap to fix.

<figure>
  <img src="/assets/img/blog/markdown-editor/workflow.svg" alt="Workflow from drafting Markdown through preview checks, HTML sanitisation review and selection of HTML or Markdown export" width="1200" height="675" loading="lazy">
  <figcaption>Workflow: draft, preview, inspect sanitised HTML, choose the correct source view, then export the file type the destination needs.</figcaption>
</figure>

- Keep the Markdown source as the editable master.
- Confirm heading levels in both preview and HTML source.
- Check lists, tables and code fences after the final edit.
- Review raw HTML and remove content the sanitiser rejects.
- Verify that required images use an allowed source.
- Select the correct Output mode before copying.
- Add CSS separately when publishing exported HTML.
- Download the source before resetting or closing the page.
