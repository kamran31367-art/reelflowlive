---
title: "PDF pages to PNG: sharp images and copyable text"
description: "Render only the pages you need as high-resolution PNGs, copy their text, and understand why a scanned PDF has no text to copy at all."
date: 2026-11-27
categories:
  - PDF
  - Images
draft: false
---

A PDF page is a page description, not a picture - until you render it. Rendering turns it into pixels at whatever sharpness you ask for, and the same document also contains its text, which can be copied if it was ever digital to begin with.

## Rendering sharpness

The [PDF to Images & Text tool](/pdf-to-images/) renders each page at a chosen scale. At 2x a page comes out roughly twice its normal size - about 150 DPI - which is sharp on screen and good for slides. 1x gives smaller files; 3x is for print or zooming into detail, at the cost of memory and time.

Choose the scale for the destination, not "the highest". A 3x render of a 40-page document creates a lot of pixels for no benefit if the images end up in a chat.

## Only the pages you need

The page field takes a range like `1-3,7`. Only those pages are rendered. That matters for long reports: pulling one chart out of page 23 should not cost the time and memory of rendering the whole file.

## Copying the text

The Text view shows the text of each page, with a copy button per page and a full `.txt` download. The output marks page boundaries with `--- Page N ---` headers, so the transcript stays navigable. Text comes from the PDF's own text layer - it is not OCR.

## The scanned-PDF problem

A scan is a picture of a page. It renders perfectly as an image, and its text layer is empty. That is not a bug; there is no text to extract. Getting text out of a scan needs OCR, which this tool does not do. If the text tab is empty but the image looks fine, the source is a scan.

## Why local rendering

Contracts, invoices, medical letters and internal reports are the usual PDFs. The file is opened and rendered by a JavaScript PDF engine inside the page; nothing is uploaded, and the PNGs are saved from the rendered canvas. You can check the first page before rendering the rest, and close the tab to discard everything.
