---
title: "Merge, split and rotate PDFs without an account"
description: "How to combine contracts in the right order, pull single pages out of a report, fix sideways scans and build a PDF from images - all inside the browser, with the real limits named."
date: 2026-11-27
categories:
  - PDF
  - Workflow
cover: assets/img/blog/pdf-tools/hero.webp
coverAlt: "A stack of printed documents in several colours on a desk"
coverCaption: "Most PDF chores are paper chores that never got digitised properly."
takeaways:
  - "Merge order is content: a cover letter before a CV, an appendix last."
  - "Page ranges are counted from 1, the way a reader counts, not from 0."
  - "Rotation applies 90 degrees at a time, to a whole file or a range."
  - "Encrypted PDFs are refused by name instead of failing silently."
  - "Nothing is uploaded; the files are parsed and written on your device."
faq:
  - q: "Does merging two PDFs reduce their quality?"
    a: "No. Pages are copied as objects, not re-rendered as screenshots, so text stays selectable and vectors stay sharp. Pictures keep their original encoding. The merged file size is roughly the sum of the inputs, minus a little shared overhead."
  - q: "Can the tool open a password-protected PDF?"
    a: "No. A locked file cannot be read without its password, so the tool reports that file by name and leaves the rest of the batch untouched. Open it in a reader, save an unlocked copy, then add that copy."
  - q: "Is there a limit on how many pages or files I can merge?"
    a: "The tool sets its own soft limits, but the real ceiling is your browser's memory. A few dozen scanned pages is comfortable; hundreds of photo-heavy pages can run out of room on an older laptop. Split a very large batch into two runs."
  - q: "Can I turn JPG photos into a PDF here?"
    a: "Yes. The fourth mode, Images to PDF, places JPG and PNG files on pages in the order shown. It is the fastest way to send a photo report or a set of screenshots as one attachment."
---

PDF chores are small, frequent and annoying: three signed contracts into one file, page 12 pulled out of a report, a scan that came back sideways. The work itself takes two minutes. What makes it painful is that most online services want the document uploaded first, and private paperwork should not sit on a stranger's server for a two-minute fix.

The [PDF Merge & Split tool](/pdf-tools/) was built for the opposite habit: open the file locally, do the edit, download the result. This guide covers what the tool does, how to use each mode without surprises, and where its honest limits are.

## What a good PDF tool has to do

Before comparing any tool, judge it on six things. Every one of them matters more than a pretty interface.

- **Work without an upload.** The document never leaves the device, so privacy is not a promise, it is a property of how the tool runs.
- **Let you control the order of merged files**, not just stack them in the order you happened to pick them.
- **Accept page ranges** so a 20-page report can become five attachments without a second program.
- **Rotate part of a document**, not just the whole thing.
- **Report problems by file name.** A locked or broken PDF should produce a readable error, not an empty result.
- **Add no watermark and no account wall.** If the fix takes two minutes, the tool should not take twenty.

## Merging in a deliberate order

Merging is not plain concatenation, because the order is the content. A job application is read cover letter, then CV, then references. A report bundle is read summary, then body, then appendix. Get the order wrong and the reader notices immediately.

The tool lists every added file with arrows to move it up or down, and you can drop PDFs straight onto the page or pick them from disk. Files that are not PDFs are skipped with a message instead of disappearing silently, which sounds like a small detail until you have added thirty files and cannot tell which one went missing.

A practical habit: build the list in reading order before merging, check the top and bottom of the list, then merge once. Reordering after the merge means starting over.

## Pulling pages with ranges counted from 1

For extracting pages, the range syntax is numbers and ranges separated by commas: `1-3,5` keeps pages 1, 2, 3 and 5. Pages are counted from 1, the way a reader counts, not from 0 the way an array does. That one decision removes the most common off-by-one mistake in page extraction.

Leave the field empty to keep every page. In split mode each range creates one page in the new file, which is how a 20-page report becomes five separate attachments in one pass. If you need the removed pages as images instead, the [PDF to Images & Text tool](/pdf-to-images/) renders the same range as PNGs.

<figure>
  <img src="/assets/img/blog/pdf-tools/folders.webp" alt="Shelves of labelled ring binders in a filing room" width="1200" height="798" loading="lazy">
  <figcaption>A page range is the digital version of pulling one sheet out of a binder - except you can put the sheet back.</figcaption>
</figure>

## Fixing sideways scans

Scanned pages often arrive sideways or upside down, especially from a phone scanner held the wrong way. Rotation applies 90 degrees at a time, to the whole file or only to the range you set. Fixing the two landscape plates inside an otherwise portrait report is a range edit, not a reason to rebuild the document.

Rotate first, then merge. A sideways page merged into a tidy bundle still has to be found and fixed later, and by then the original file may be harder to identify.

## Mixed page sizes are preserved, not fixed

Real batches are rarely uniform. A contract signed as A4, a scanned receipt on Letter paper, a landscape certificate in a portrait report. The tool keeps each page exactly as it was and does not rescale anything to a common size.

That is the right default, because rescaling a signed page can change how a print looks. It also means the merged file can contain pages of different dimensions, which most readers handle without complaint but a strict print shop may not. If a single size is required, ask which size, then export the odd pages as images and rebuild them at that size with the Images to PDF mode.

Orientation has the same rule: rotating a page changes how it is displayed, not the paper size it claims to be. A landscape scan rotated upright becomes a portrait page with correct content, which is usually exactly what the reader wants.

## Building a PDF from images

The fourth mode turns JPG and PNG files into pages, in the order shown. It is useful for a photo report, a set of receipts, or turning screenshots into one attachment that opens on any device. Keep the images at a sensible size first; a 12-megapixel photo per page makes a file that is slow to send. The [Image Compressor](/image-compressor/) brings each picture under a few hundred kilobytes without a visible change.

## The honest limits

Every tool has edges, and knowing them saves an afternoon.

- **Encrypted PDFs cannot be read** without the password. The tool reports the file by name rather than producing an empty document, so you can act on the error. Unlock the file in a reader first.
- **No OCR.** A scanned page stays an image of text. If you need selectable text from a scan, that is a different job; digital PDFs made by an editor already carry text and can be copied from.
- **No form filling or signing.** Bookmarks and form fields from the originals are not carried over, because the result is rebuilt page by page from the objects you chose.
- **Very large files can exhaust memory.** The work happens in the browser tab, and a tab has less room than a desktop application. Split huge batches.

<figure>
  <img src="/assets/img/blog/pdf-tools/tool.webp" alt="The PDF Merge and Split tool showing the task modes and a drop area for PDFs" width="1200" height="600" loading="lazy">
  <figcaption>Four modes, one job at a time: merge, extract pages, rotate, or build a PDF from images.</figcaption>
</figure>

## A five-minute routine for any paper batch

The same short routine handles most real requests.

1. **Collect** every file into one folder and rename the obvious ones, because file names are what you see in the list.
2. **Unlock** anything password-protected in a reader and save a clean copy.
3. **Merge** in reading order, then check the first and last page of the result.
4. **Extract or rotate** as a second pass if the bundle needs page-level edits.
5. **Open the result once** before sending it. Two clicks now beat a follow-up email later.

The routine exists because the failures are predictable. A missing page at the end comes from a file that was never added. A sideways page comes from a scan that was fixed "later". A locked file comes from a batch that was built without checking. Each of the five steps removes one of those failures, and the whole sequence fits inside the time it used to take to upload a single document to a service.

## Privacy is the point

The files are parsed and written by a PDF library running inside the page, so nothing is uploaded and the result downloads straight from memory. There is no account, no queue and no daily limit tied to a subscription.

That property decides the order of the related tools below: the ReelFlow Live tool does the private work first, and the rest are there for the jobs around it, such as form filling or heavy format conversion, which genuinely need a full service.