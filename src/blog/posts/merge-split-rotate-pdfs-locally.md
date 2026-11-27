---
title: "Merge, split and rotate PDFs without an account"
description: "Combine files in the right order, keep or reorder only the pages you need, and fix sideways scans - all in the browser, with encrypted files named honestly."
date: 2026-11-27
categories:
  - PDF
  - Workflow
draft: false
---

PDF chores are small, frequent and annoying: three contracts into one file, page 12 pulled from a report, a scan saved sideways. Online services do the job but ask you to upload the document, and private paperwork should not go on a stranger's server for a two-minute fix.

## Merge in a deliberate order

Merging is not just concatenation - the order is the content. The [PDF Merge & Split tool](/pdf-tools/) lists every added file with arrows to move it up or down, so a cover letter goes before the CV and an appendix stays last. Drop PDFs straight onto the page or pick them from disk; non-PDF files are skipped with a message instead of silently disappearing.

## Page ranges, counted from 1

For extracting pages, the range syntax is numbers and ranges separated by commas: `1-3,5` keeps pages 1, 2, 3 and 5. Pages are counted from 1, as a reader counts them, not from 0 like an array. Leave the field empty to keep every page. In split mode each range creates one page in the new file, which is how a 20-page report becomes five attachments.

## Rotating a whole document or a range

Scanned pages often come in sideways or upside down. Rotation applies 90 degrees at a time, to the whole file or to the range you set - fixing the two landscape plates inside an otherwise portrait report is a range, not a new document.

## Building a PDF from images

The fourth mode turns JPG and PNG files into pages, in the order shown. Useful for a photo report or for turning screenshots into a single attachment.

## The honest limit: passwords

Encrypted PDFs cannot be read without the password. The tool reports the file by name rather than producing an empty document - an error you can act on instead of a silent failure. Unlock the file in a reader first, then merge.

Everything runs on your device: the files are parsed and written by a local JavaScript library, nothing is uploaded, and the result downloads straight from memory.
