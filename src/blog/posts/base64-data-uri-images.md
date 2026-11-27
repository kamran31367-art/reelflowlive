---
title: "Base64 images: when inlining a file beats a URL"
description: "A data URI removes one request and adds about a third more bytes. Here is when that trade makes sense, when it hurts, and how to decode one back into a file."
date: 2026-11-27
categories:
  - Developer
  - Images
draft: false
---

A Base64 data URI turns an image into text. That text can sit directly in HTML, CSS or JSON, and the browser displays it without loading a separate file. It is a real technique with a narrow sweet spot, not a way to save space.

## What the string looks like

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

The part before the comma is the MIME type; after it comes the encoded bytes. Every three bytes of the image become four characters, so the text is about 33 percent larger than the binary file. A 15 KB icon becomes roughly 20 KB of text.

## Where inlining helps

- **Small icons and logos in CSS** that would otherwise cost one extra request per page.
- **Single-file HTML pages** - a report, an email template, a demo - where everything has to travel together.
- **Emails**, where remote images are blocked by default and an inline image still shows.
- **Database or API payloads** that expect a string rather than a file upload.

## Where it hurts

- **Large images.** The encoded string lives inside the HTML or CSS document, so it cannot be cached separately. Every page load pays for it again.
- **Repeated assets.** The same logo on twenty pages as a data URI is downloaded twenty times; as a file, it is fetched once.
- **Compression.** Base64 text compresses poorly compared with binary, so gzip and brotli recover much less than they do on HTML.

A practical ceiling is around 5-10 KB of original image. Above that, a normal file plus cache headers is almost always faster on repeat visits.

## Decoding one back into a file

Copy-pasting a long data URI from a stylesheet to check what it actually is gets old quickly. The [Image to Base64 tool](/image-to-base64/) works both ways: drop an image to get its data URI, or paste a data URI to preview the image and save it as a normal file again. It also shows the original and encoded sizes side by side, which is the fastest way to judge whether inlining is worth it for a particular image.

## A note on security

A data URI is just data, and browsers treat it as an image only. It is not a script and it is not encrypted - anyone who can read the string can decode it. Never use Base64 to hide a key or a password.
