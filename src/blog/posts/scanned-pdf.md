---
title: "Make a PDF look scanned: image pages, not OCR"
description: "Render PDF pages into an image-only scanned-style PDF with page, grayscale, rotation and noise controls, plus honest limits for text and document features."
date: 2026-11-27
draft: false
categories:
  - Converters
cover: assets/img/blog/scanned-pdf/hero.svg
coverAlt: "A digital PDF page transforming into a slightly rotated grayscale scan with paper texture"
coverCaption: "The tool changes how pages are stored and displayed; it does not prove where a document came from."
takeaways:
  - "Despite the slug, this tool does not read a scan or perform OCR; it renders an existing PDF into image-only pages."
  - "Page selection is limited to all pages, the first page or the first five pages."
  - "Grayscale is on by default, rotation ranges from -15 to 15 degrees, and paper noise ranges from 0 to 20."
  - "Pages are rendered at 1.5 times the PDF viewport scale and embedded as PNG images, which can increase file size."
  - "The new PDF has no selectable text layer and does not retain interactive forms, bookmarks or source metadata."
faq:
  - q: "Does this tool turn a scanned PDF into searchable text?"
    a: "No. It does the opposite: it renders each selected PDF page to an image and places that image in a new PDF. The output is image-only and normally has no selectable or searchable text. OCR is a separate process that this tool does not provide."
  - q: "Which pages can I include?"
    a: "Choose All pages, First page or First five pages. There is no custom range and no individual page picker. If the document has fewer than five pages, First five pages includes only the pages that exist."
  - q: "Why did the output PDF get larger?"
    a: "Each selected page is rendered to a canvas and embedded as a PNG image. Image storage can be larger than compact PDF text and vector instructions, especially for detailed pages. The tool has no JPEG-quality or compression-level control."
  - q: "Can I use the result as proof that a document was physically scanned?"
    a: "No. The controls create a scanned-style appearance, but they do not create authentic provenance, signatures or chain-of-custody evidence. The output also removes the source text layer and interactive features. Use it only for legitimate visual workflows where those changes are appropriate."
---

The [Make PDF Look Scanned Online tool](/scanned-pdf/) renders pages from an existing PDF into images and assembles those images into a new PDF. Optional grayscale, rotation and paper noise give the result a scanned-style appearance.

The name can be misleading if you are looking for OCR. This is not a tool that reads scanned words, improves a scan or creates searchable text. It is a visual conversion that turns PDF page content into image-only pages.

## What “scanned-style” means here

A normal digital PDF may store text, fonts, vectors and images as instructions. This tool follows those instructions on a canvas, applies optional visual effects and embeds the resulting PNG into a fresh PDF page.

The output therefore looks like a rasterised document rather than a native text PDF. Text becomes pixels. Links, form controls and other interactive document structures are not carried into the new file.

<figure>
  <img src="/assets/img/blog/scanned-pdf/workflow.svg" alt="A PDF page rendered to canvas, adjusted with grayscale noise and rotation, then embedded into a new image-only PDF" width="1200" height="675" loading="lazy">
  <figcaption>The source page is rasterised before the new PDF is built, so selectable source text does not survive.</figcaption>
</figure>

## Controls and defaults

The **PDF file** dropzone accepts one PDF. Choose a file or drag it onto the dropzone, then configure the output before pressing **Create scanned PDF**.

The **Pages** menu has three choices:

- **All pages** converts every page in the document.
- **First page** converts page one only.
- **First five pages** converts up to the first five pages.

**Grayscale** is checked by default. Clear it to keep the rendered page's colour. The checkbox applies to every selected page.

**Rotation** defaults to `0` and ranges from `-15` to `15` degrees in one-degree steps. Positive and negative values rotate the rendered image in opposite directions.

**Paper noise** defaults to `4` and ranges from `0` to `20` in single-step increments. It adds random variation to pixel colour values. At zero, no noise is added.

## A worked three-page example

Suppose `report.pdf` has three pages and you need a one-page visual proof. Choose **First page**, leave **Grayscale** enabled, set **Rotation** to `2` and leave **Paper noise** at `4`.

Press **Create scanned PDF**. The tool renders page one at a 1.5 scale, fills the canvas white, converts the pixels to grayscale, adds random noise, rotates the image and embeds it as a PNG on a new PDF page.

The status reports **1 page ready**, and **Download** saves `scanned.pdf`. The output contains one image-only page. It does not contain a hidden copy of the original selectable text.

<figure>
  <img src="/assets/img/blog/scanned-pdf/example.svg" alt="A three-page report with first page selected producing a one-page grayscale rotated noisy scanned.pdf" width="1200" height="675" loading="lazy">
  <figcaption>First page selection produces one output page, even when the source document contains more pages.</figcaption>
</figure>

## What grayscale, rotation and noise actually do

Grayscale uses a weighted luminance calculation: red, green and blue contribute different amounts to the resulting grey value. It is a visual conversion, not a contrast-optimisation or thresholding step. Faint pencil marks may remain faint, and paper stains are not removed.

Rotation occurs around the centre of the rendered canvas. The image is also scaled to 94 percent before it is drawn into the same-size canvas. Because the output canvas is not enlarged, larger rotations can crop content near the edges. Check corners, headers and footers after conversion.

These controls create appearance, not authenticity. They do not add a scanner profile, capture date, device serial number, signature or chain-of-custody record.

## Output format and page dimensions

The only output is a PDF, downloaded as `scanned.pdf`. Each page is rendered with a viewport scale of `1.5`. The rendered canvas width and height are then used directly as the new PDF page dimensions. This means the physical page size can differ from the source PDF rather than preserving its original page box exactly.

Pages are embedded as PNG images. That favours clean text and flat graphics, but detailed scans and photographs can produce large PDF files. There is no quality slider, JPEG option or manual resolution setting.

## Text, OCR and accessibility

This tool does not perform OCR in either direction. It cannot recognise a scan, and it does not add recognised text behind the output image. If you need searchable text, use an OCR workflow separately and verify its accuracy.

There is no explicit PDF byte-size or page-count cap in the operation. Practical limits come from browser memory, canvas size and the time required to render every selected page.

Large pages and long documents are the main pressure points. Each page is rendered and processed before being embedded, and image-heavy content can consume substantially more memory than plain text. Use **First page** or **First five pages** when you only need a sample or subset.

Because noise is random, repeated conversions also do repeated pixel processing. If an attempt fails on a long file, reduce the selected page count before increasing the document complexity again.

## Common mistakes to avoid

Do not choose this tool when the goal is OCR. It removes selectable text rather than creating it. A scanned-looking result is not a searchable result.

Do not expect source links, form fields or bookmarks to survive. The new PDF is built from page images, so those features need the original file.

Avoid strong rotation on pages with important edge content. The fixed-size rotated canvas can clip corners. Likewise, high noise can make small text harder to read even though it looks more textured.

Finally, do not overwrite the only source. The download name is fixed, so rename each output and keep `report.pdf` until the new file has been reviewed.

## Local processing and privacy

The PDF is opened in the browser, rendered to canvases and assembled with bundled PDF code. No document upload or account is required, and the page does not send the file to a remote rendering service.

That makes the tool suitable for confidential proofs and internal visual review. The source and generated pages remain in the browser's working memory until the operation finishes and the result is downloaded or reset.

Local processing is not a guarantee of anonymity or provenance. The output can still contain visible personal or confidential information, and the fixed download name makes careful file handling important on shared devices.

## A practical workflow

1. Decide whether an image-only visual copy is genuinely appropriate.
2. Keep the source PDF and note its page count.
3. Choose the smallest page selection that meets the need.
4. Leave grayscale off unless a monochrome proof is wanted.
5. Start with `0` rotation and low noise, then adjust cautiously.
6. Press **Create scanned PDF** and wait for the page-ready status.
7. Download `scanned.pdf`, rename it and open every selected page.
8. Check text legibility, cropped edges, page dimensions and file size.
9. Retain the original PDF for searchable text, accessibility and document features.

## Final checklist

- The task needs a visual, image-only PDF rather than OCR.
- The selected page option matches the required output.
- Grayscale, rotation and noise have been chosen deliberately.
- Important edge content is not clipped.
- Every output page is legible at normal viewing size.
- The new page dimensions are acceptable.
- No selectable text, forms, bookmarks or metadata are expected.
- The original PDF is retained and the output has a meaningful name.

The scanned-PDF tool is best understood as a page renderer with visual controls. It can create a scanned-style proof locally, but it cannot create searchable text or authentic evidence of a physical scan.
