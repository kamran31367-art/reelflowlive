---
title: "PDF pages to PNG: pick the pages, then the sharpness"
description: "A three-page report becomes PNGs at 596, 1192 or 1788 pixels wide; what each scale costs in bytes, how the page range field behaves, and why a scanned page has no text to copy."
date: 2026-11-27
categories:
  - PDF
  - Images
cover: assets/img/blog/pdf-pages-to-png/hero.webp
coverAlt: "Tall stacks of taped paper files and folders piled across an office desk"
coverCaption: "Long documents are the usual reason to need one page as an image instead of the whole file."
takeaways:
  - "A three-page A4 report of 51,478 bytes came back as pages of 596 x 842 px at 1x, 1,192 x 1,684 px at 2x and 1,788 x 2,526 px at 3x."
  - "The first page weighed 46,617 bytes as a 1x PNG, 120,432 at 2x and 261,365 at 3x; the whole three-page set grew from about 113 KB to about 634 KB."
  - "The page field takes ranges such as 1-3,7, accepts a reversed range like 5-2, and names the document's page count when a number is out of range."
  - "Text comes from the PDF's own text layer, so a scanned page renders as a clean PNG while its text card reports that the page has no text."
  - "The export is one PNG per page, named file-page-01.png and onward; Download all PNG fires the saves 180 ms apart and the browser may ask once to allow multiple files."
faq:
  - q: "Is my PDF uploaded anywhere?"
    a: "No. The page runs the pdf.js engine inside the tab, with its worker file served from this site, and each page is drawn onto a canvas in the browser. The PNG is created from that canvas. The document never leaves the device, and closing the tab discards everything, including any page images you did not download."
  - q: "Why is the text tab empty for some pages when the image looks fine?"
    a: "Because that page is a scan, a photo of paper, or an export that flattened text into shapes. Such a page has no text layer, so there is nothing to copy, and the text card says so. Rendering does not invent text. Extracting it needs optical character recognition, which is a different kind of tool; the PNG download still works normally."
  - q: "Which number of pages should I choose?"
    a: "One that matches the destination, not the largest available. On A4, 1x is roughly 72 DPI, which suits thumbnails and chat; 2x is roughly 144 DPI and reads well in slides and documents; 3x is roughly 216 DPI, for print or when someone will zoom into a diagram. Each step doubles width and height, so pixels and memory roughly quadruple, which matters on long documents."
  - q: "Can it merge or split PDFs as well?"
    a: "No. It renders pages and extracts text and nothing else. Merging, splitting, reordering and deleting pages live in the separate PDF Merge & Split tool, so a typical cleanup is merge or split first, then come here to turn the surviving pages into images or text."
  - q: "Why did my browser ask permission after Download all PNG?"
    a: "Because the tool saves each page as its own file, spaced 180 milliseconds apart, and browsers treat a burst of automatic saves as something to confirm. The page warns about this above the download button. Allow the many-file mode once and the rest arrive, or use the small PNG button on each page card and skip the burst entirely."
---

A PDF stores a page as instructions: this text in this font at this position, this line here, that image there. Nothing inside the file is a finished picture, which is why turning page 23 into a PNG means rendering it, and rendering means choosing a size. The [PDF to Images & Text tool](/pdf-to-images/) does that in the browser: one file, a page range, three sharpness levels, and a text tab that reads the document's own text layer rather than guessing at pixels.

## Why a PDF is not already an image

A page description scales without loss because it is drawn fresh at every size. A photo of the same page has one fixed resolution. Rendering sits in between: it follows the instructions once, at the size you pick, and stops. Pick too small and the result is soft when zoomed; pick too large and the file carries pixels nobody will look at.

The tool offers three scales. On A4, which measures 8.27 by 11.69 inches, a page at 1x comes out 596 by 842 pixels, which is 72 DPI. That number is not arbitrary: 842 divided by 11.69 is about 72, the historical print point. The other two scales follow directly: 2x gives 1,192 by 1,684 at about 144 DPI, 3x gives 1,788 by 2,526 at about 216 DPI.

## The three scales, measured

Numbers from our own test: a three-page A4 report of 51,478 bytes, rendered at all three scales.

- **1x:** 596 x 842 px per page. PNGs of 46,617, 37,633 and 31,327 bytes; 115,577 bytes for the set, about 113 KB.
- **2x:** 1,192 x 1,684 px per page. PNGs of 120,432, 100,465 and 85,754 bytes; 306,651 bytes, about 300 KB.
- **3x:** 1,788 x 2,526 px per page. PNGs of 261,365, 211,460 and 176,307 bytes; 649,132 bytes, about 634 KB.

Doubling the linear size quadruples the pixel count, yet the PNG bytes only rose 2.6 times from 1x to 2x and 2.2 times from 2x to 3x, because most of a text page is flat white and PNG compresses flat white cheaply. A photo-heavy page will not behave that generously; expect the file growth to track the pixel growth more closely.

The practical rule is the destination. 1x is for thumbnails, chat previews and anything that will be shown smaller than a page. 2x is the default for a reason: it survives a phone screen, a slide deck and a document viewer without visible stair-stepping. 3x exists for print and for pages with detail someone will zoom into, such as engineering drawings or dense tables, and it is the scale where memory becomes real, because each page is drawn to a full canvas before it becomes a PNG.

<figure>
  <img src="/assets/img/blog/pdf-pages-to-png/scanning.webp" alt="A printed page sliding out of a laser printer next to a sheet that shows the word Modernism" width="1200" height="675" loading="lazy">
  <figcaption>A page printed from software arrives on paper but carries its text; a page scanned back from paper carries only pixels.</figcaption>
</figure>

## Only the pages you need

The page field is the most useful control on the page. Left empty, it renders every page, which is fine for a three-page report and wasteful for a forty-page one. Filled, it takes a list such as `1-3,7` and renders exactly those pages, in the order given.

The validation is specific, which matters when you are typing quickly. A token that is not a number or range is named back to you. A zero is refused with the note that pages start at 1. A number beyond the end carries the document's own count, so a 9 typed into a three-page file is answered with "document has 3 pages" instead of a silent no-op. Reversed ranges such as `5-2` are accepted and walked backwards, which is handy when you want the last pages first.

Opening a file renders the selected range immediately at the current scale. Changing the number of pages afterwards does not re-render by itself; you press Render pages and the grid rebuilds at the new sharpness. That is deliberate, since a stray click on 3x should not cost the time of redrawing a long document.

## The text tab is a bonus, not OCR

Most PDFs made by software contain a real text layer, and the Text tab simply reads it. Each page becomes a card with its text and a Copy page text button, and Download .txt writes all pages into one file with `--- Page N ---` headings between them. In our test the first card began with the report title, the quarter and the first section sentence, exactly as typed in the source document, not as a guess from pixels.

What you get is the text in the order the PDF stores it. For a simple report that matches the visual order. For a two-column page or a table, columns can interleave into runs of words, and a header repeated on every page repeats in the transcript. It is fast for copying a paragraph or feeding a document to a text editor, and it is not a faithful layout reproduction.

## When the text is missing

A scanned page, or an export that flattened everything into images, has no text layer. The PNG renders perfectly because the page really does look like that; the text card says the page has no text and may be a scanned image. That is not a failure of the render, it is a property of the file. Turning a scan into text requires optical character recognition, which this tool does not include, and the text tab should not be expected to fill in. Use the PNG, and send the file to an OCR tool if you need the words.

## Files it will refuse

Three refusals are worth knowing in advance. A password-protected PDF is answered with a message that the file is protected and needs unlocking first. A file that is not a readable PDF, or is truncated, is reported as such after the engine fails to parse it. And a file that never finishes opening is cut off after twenty seconds with a message that it took too long, because some damaged files leave the parser waiting forever.

One quiet detail: pages with no background are drawn onto white rather than left transparent. A PNG export of a cover page with a transparent overlay arrives with a white backing, which is what you want in a document, slide or chat window that assumes a page is white paper.

## What the export is

Each page card carries its own small PNG button, and the file is named after the source: a file called `report.pdf` produces `report-page-01.png`, `report-page-02.png` and so on, zero-padded so the order survives alphabetical sorting. Download all PNG triggers the same saves in one go, spaced 180 milliseconds apart, with a note that the browser may ask once to allow multiple files.

<figure>
  <img src="/assets/img/blog/pdf-pages-to-png/tool.webp" alt="The PDF to Images and Text tool with a three-page report rendered at 2x, showing page cards at 1192 by 1684 pixels and the hint three pages ready" width="1072" height="636" loading="lazy">
  <figcaption>The test session: a 50.3 KB three-page report, empty page field, 2x selected, three cards at 1,192 by 1,684 px. The text tab held the same report sentence for sentence.</figcaption>
</figure>

## What it deliberately does not do

- **No OCR.** It reads a text layer that already exists; it never recognises pixels as characters.
- **No merging, splitting or page editing.** Those live in the separate [PDF Merge & Split](/pdf-tools/) tool. Rotation, cropping and redaction are not offered anywhere in this tool.
- **No JPG output.** Pages leave as PNG only, which is the right default for text but large for photos of pages. The [Image Converter](/image-converter/) turns a PNG into JPG or WebP afterwards, and the [Image Compressor](/image-compressor/) shrinks what is left.
- **No upload, no server.** The engine and its worker ship with the page, so there is nothing to sign in to and no third party receiving confidential documents.

## Where this fits

- **A slide deck or a help page** taking two figures out of a long report: `2x` and a range like `12,14`.
- **A chat thread** that needs the whole handout: `1x` and Download all PNG.
- **A video thumbnail or overlay** built from a document page: `3x` on the single page, then check the crop against the [Thumbnail Safe Zone](/thumbnail-safe-zone/) before exporting.
- **A text editor** that needs the letter's wording: the Text tab and Download .txt, with the PNGs as a visual backup.
- **A form or profile picture** that wants a specific size: render first, then set pixels in the [Image Resizer](/image-resizer/).

## A short working order

1. Drop the PDF in. The page count appears and the current range renders automatically.
2. Fill the page field before touching anything else when the file is long.
3. Choose the scale for the destination: 1x small screens, 2x general use, 3x print or zoom.
4. Eyeball the first card, then save that page with its PNG button or take everything with Download all PNG.
5. Switch to Text only when the source was digital; a scan will leave it empty by design.