---
title: "Compress images before upload: smaller files, same look"
description: "Why thumbnails fail the 2 MB limit, what quality to pick for JPG and WebP, and how batch compression works without uploading anything."
date: 2026-11-27
categories:
  - Images
draft: false
---

An image that looks fine on a laptop can still be 8 MB, and a few platforms refuse it. YouTube caps thumbnails at 2 MB. Website builders slow down. Email attachments bounce. Compression solves the size problem, and the right settings barely change how the image looks.

## What compression actually does

JPG and WebP encoders throw away information the eye is unlikely to notice: subtle color variations, fine noise in flat areas, tiny details inside busy regions. The slider controls how much they are allowed to discard.

At **quality 0.8-0.9** the difference from the original is hard to find even when zoomed. Below 0.6, gradients start to show bands and text edges get fuzzy halos. For thumbnails and covers, stay at 0.8 or above.

PNG is different: it is lossless, so compression mostly removes redundant data. Screenshots with flat interfaces shrink well. Photographs saved as PNG barely move and should be converted instead.

## Pick WebP when you can

At the same visual quality, WebP is usually 25-35% smaller than JPG, and it keeps transparency. Every current browser supports it, and platforms re-encode uploads anyway. The exception is a tool or printer that only accepts JPG - those still exist.

The [Image Compressor](/image-compressor/) does both jobs: compress JPG and PNG in place, or convert to WebP. It shows the real before and after size for each file, so you are never guessing.

## Honest numbers

How much you save depends entirely on the source:

- **Photos already compressed once** - often 40-70% smaller as WebP at 0.8.
- **Fresh exports from an editor** - can drop by more than half, because editors often save at near-maximum quality.
- **PNG screenshots** - usually 20-50% smaller, sometimes more with flat UI colors.
- **Already tiny files** - can grow slightly. Re-encoding always costs something, and the tool will tell you instead of hiding it.

That last case is why a live before/after comparison is more useful than a promised percentage. If the output is larger, keep the original.

## Batch without uploading

Up to 30 images can go in one batch. Each one is decoded and re-encoded by your browser on your own device - nothing is sent to a server, and there is no upload wait. Save files one by one or all at once.

This matters for a channel refresh: 30 old thumbnails can be brought under the limit in a single pass, with each result checked before download.

## Order of operations

For best quality, do the steps in this order:

1. **Resize** to the final dimensions with the [Image Resizer](/image-resizer/).
2. **Compress** the resized file.
3. **Check** the size and upload.

Resizing after compressing means the image is re-encoded twice, which loses more detail than one pass. Resizing first also throws away pixels you were about to discard anyway, so the compressor has less work to do.

## Checklist

- Keep quality at 0.8 or higher for photos and thumbnails.
- Prefer WebP unless a platform requires JPG.
- Keep the original if the compressed file is larger.
- Resize first, compress second.
- Check the real output size before uploading.
