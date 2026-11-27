---
title: "Compress images before upload: smaller files, same look"
description: "Why a thumbnail fails the 2 MB limit, which quality setting keeps a photo clean, when WebP beats JPG, and how to compress a whole batch without uploading a single file."
date: 2026-11-27
categories:
  - Images
cover: assets/img/blog/image-compressor/hero.webp
coverAlt: "A laptop on a cafe table showing a grid of photos, with a cup of coffee beside it"
coverCaption: "A photo library looks fine on screen at any size - until a platform checks the file size."
takeaways:
  - "Quality 0.8 is the safe floor for photos; below 0.6 gradients band and text edges blur."
  - "WebP is usually 25-35% smaller than JPG at the same visual quality."
  - "PNG suits flat screenshots, not photographs, because it is lossless."
  - "A file that is already small can grow when re-encoded; keep the original in that case."
  - "Resize first, compress second - two encodes lose more detail than one."
faq:
  - q: "What quality setting should I use for a YouTube thumbnail?"
    a: "Start at 0.85 to 0.9 for text-heavy thumbnails and 0.8 for photographic ones. YouTube's limit is 2 MB, and a 1280x720 thumbnail at 0.85 usually lands around 150-250 KB, so there is plenty of room to keep it sharp."
  - q: "Why did my compressed file get bigger?"
    a: "The source was already compressed, often by the platform that delivered it. Re-encoding discards a little more data but adds a new header and encoder overhead, so the output can grow slightly. The tool shows the real before and after size; when the output is larger, keep the original."
  - q: "Does converting to WebP break old phones or email programs?"
    a: "Every current browser on Windows, macOS, Android and iOS displays WebP. The exceptions are a few older desktop apps and some print shops that accept only JPG. When a destination asks for JPG, use the JPG option; otherwise WebP is the smaller choice."
  - q: "Is there an upload limit, since the tool is online?"
    a: "No upload happens. The images are decoded and re-encoded by your browser on your own device, so the only limit is the batch size the interface allows (30 files) and the memory of the machine. A weak connection does not slow the work down."
---

An image that looks fine on a laptop can still be 8 MB, and a few platforms simply refuse it. YouTube caps thumbnails at 2 MB. Website builders slow down when every card loads a full-resolution photo. Email attachments bounce. Compression solves the size problem, and the right settings barely change how the picture looks.

The [Image Compressor](/image-compressor/) does the job in the browser: add the files, pick a format and quality, watch the real before and after size, then download. This guide explains what each setting actually does, so the next batch takes one pass instead of five.

## What a compressor must show you

Most tools advertise a percentage. A good one shows evidence. Judge any compressor on five points.

- **Real before and after sizes per file**, not a promise for the batch.
- **A format choice** between keeping the input format, WebP and JPG.
- **A quality control** that does not pretend one value suits every image.
- **Batch handling**, because thumbnails are updated in dozens, not one at a time.
- **No upload**, so the images never leave the device and the task does not depend on connection speed.

## What compression actually does

JPG and WebP encoders throw away information the eye is unlikely to notice: subtle colour variations, fine grain in flat areas, tiny details inside busy regions. The quality slider controls how much they are allowed to discard. It is not a measure of goodness; it is a trade between size and detail. Two images at the same quality can land far apart in size, because a portrait with a smooth background compresses easily while a crowd scene full of texture does not.

At **0.8 to 0.9** the difference from the original is hard to find, even zoomed in. Below 0.6, gradients begin to show bands and text edges pick up fuzzy halos, which is exactly what makes a thumbnail look cheap at small sizes. For covers and thumbnails, stay at 0.8 or above.

PNG behaves differently. It is lossless, so compression mostly removes redundant data rather than detail. Screenshots with flat interface colours shrink well; photographs saved as PNG barely move and should be converted instead.

## Pick WebP when you can

At the same visual quality, WebP is usually 25 to 35 percent smaller than JPG, and it keeps transparency. Every current browser supports it, and platforms re-encode uploads anyway. The exceptions are real: a handful of older apps and some print services accept only JPG. When a destination says JPG, choose JPG; otherwise WebP is the smaller file for the same look.

<figure>
  <img src="/assets/img/blog/image-compressor/results.webp" alt="The image compressor showing three sample files with before and after sizes and saved percentages" width="1088" height="444" loading="lazy">
  <figcaption>The useful number is the per-file result. Each row shows the input size, the output size, and how much was saved.</figcaption>
</figure>

## Honest numbers

How much you save depends entirely on the source image:

- **Photos already compressed once** often land 40 to 70 percent smaller as WebP at 0.8.
- **Fresh exports from an editor** can drop by more than half, because editors save at near-maximum quality by default.
- **PNG screenshots** usually shrink 20 to 50 percent, sometimes more with flat interface colours.
- **Already tiny files** can grow slightly. Re-encoding always costs something, and the tool says so instead of hiding it.

That last case is why a live before and after comparison beats a promised percentage. If the output is larger, keep the original and move on.

## Pick the size the platform expects

Compression is only half the job. A file that is small but the wrong dimensions gets rejected or blurred, so decide the target before touching the quality slider.

- **YouTube thumbnail**: 1280 by 720 pixels, under 2 MB. Aim for 150 to 300 KB at quality 0.85 so text stays crisp.
- **Instagram feed**: 1080 pixels wide is enough; the platform crops the preview to a square, so keep the subject centred.
- **Website hero**: 1600 to 2000 pixels wide is plenty for a full-width image, and 200 to 350 KB keeps the page fast on a phone.
- **Blog inline image**: 1200 pixels wide covers the full column on most layouts at 100 percent zoom.
- **Favicon or icon**: save as PNG at the exact pixel sizes the browser asks for; the [Favicon Generator](/favicon-generator/) builds the set from one source.

Uploading a 4000-pixel photo for a 1080-pixel slot wastes three quarters of the file for detail nobody can see. Resize to the target width first, then compress the smaller file. The number to check is not only the megabyte count but the pixel size, because a platform that accepts a heavy file will often re-crop it anyway.

## PNG, transparency and the limits

Transparency is the one thing that decides a format for you. If a logo or a cut-out needs a transparent background, stay in PNG or use WebP, which supports transparency and is usually much smaller. Saving a transparent image as JPG fills the empty area with white, and there is no setting that brings it back.

The quality slider has no effect on PNG output, because the format is lossless. When the same PNG is exported as WebP, the slider works normally.

## What compression cannot fix

It is worth being clear about the boundary. Compression reduces file size; it does not restore detail that was already lost, fix an image captured at the wrong dimensions, or remove a distracting background. A blurry screenshot compressed well is still a blurry screenshot.

Each of those is a different job. Crop or resize first, use the [Background Remover](/background-remover/) when the subject needs to sit on a new surface, and only then compress the finished image. Doing it in the other order means working twice on the same pixels.

## Batch without uploading

Up to 30 images go in one batch. Each one is decoded and re-encoded by the browser on your own device, so there is no upload wait and no server queue. Results can be saved one by one or all at once.

This changes the realistic workflow. A channel refresh is not ten visits to a website; it is drop 30 thumbnails, switch to WebP, check the sizes, download all. If one file grows, it stays visible in the list while the other 29 shrink. The same batch habit helps when an entire product gallery is too heavy: compress once, then compare the thumbnails side by side before replacing the originals. Keep the originals in a folder until the upload is confirmed, because a compressed file is harder to recover from than a saved one.

<figure>
  <img src="/assets/img/blog/image-compressor/tool.webp" alt="The image compressor with the empty drop area, format buttons and quality slider" width="1200" height="525" loading="lazy">
  <figcaption>Add files, choose an output format, adjust quality once - the list updates for every image.</figcaption>
</figure>

## Order of operations

For the best quality, do the steps in this order:

1. **Resize** to the final dimensions with the [Image Resizer](/image-resizer/).
2. **Compress** the resized file.
3. **Check** the size and upload.

Resizing after compressing means the image is encoded twice, which loses more detail than a single pass. Resizing first also discards pixels you were about to throw away anyway, so the compressor has less work to do and the result is cleaner.

## Checklist

- Keep quality at 0.8 or higher for photos and thumbnails.
- Prefer WebP unless a platform requires JPG.
- Keep transparency in PNG or WebP, never JPG.
- Keep the original if the compressed file is larger.
- Resize first, compress second.
- Check the real output size before uploading, not after the platform rejects it.

The related tools below cover the rest of the chain: changing format, hitting an exact pixel size, building favicons, and testing whether a compressed thumbnail still reads in every crop.