---
title: "Resize images for Shorts, Reels and thumbnails without blur"
description: "The exact pixel sizes creators need, when to crop instead of fit, why upscaling always looks soft, and how to export a sharp file in the browser."
date: 2026-11-27
categories:
  - Images
  - Social
draft: false
---

Almost every platform asks for a specific image size, and almost every phone camera produces something else. Resizing is the small step between a good photo and a cover that fills the frame without black bars or a cropped head.

## The sizes that actually matter

- **YouTube thumbnail:** 1280 x 720 (16:9)
- **Shorts, Reels, TikTok:** 1080 x 1920 (9:16)
- **Instagram square:** 1080 x 1080
- **Instagram portrait:** 1080 x 1350 (4:5)
- **X post image:** 1200 x 675 (16:9)

Everything is measured in pixels, width first. If a tool asks for inches or DPI, it is talking about print - ignore it for social platforms.

## Crop to fill vs fit inside

Two different images can come out of the same source:

**Crop to fill** scales the photo until it covers the whole frame, then trims the overflow. The result fills edge to edge with no borders, but the edges are cut off. This is what you want for covers and thumbnails, where a letterbox bar looks unfinished.

**Fit inside** keeps the entire image and adds empty space where the shape does not match. Nothing is lost, but a horizontal photo in a vertical frame ends up small with wide bars above and below.

A practical rule: use crop for covers and cards, use fit for diagrams and screenshots where the whole image must stay visible.

## Never scale up

Enlarging an image does not add detail. A 640-pixel-wide picture stretched to 1280 pixels becomes soft and slightly blurry, and no resizer fixes that because the missing information never existed. If the source is too small, find a larger original or pick a layout that uses the small image at its native size.

Reducing size is the safe direction. Downscaling averages pixels together, and the result stays sharp.

## Export format and quality

The [Image Resizer](/image-resizer/) exports JPG, WebP and PNG:

- **JPG** is the default for photos and thumbnails. Quality around 0.85-0.9 is visually identical to the source and much smaller.
- **WebP** is even smaller at the same quality and is supported everywhere a creator publishes today.
- **PNG** ignores the quality slider and produces a large file. Use it only for graphics with flat colors or transparency, like logos and text cards.

For a YouTube thumbnail specifically, stay under 2 MB. A 1280 x 720 JPG at high quality lands around 150-300 KB, so this is rarely a problem unless the design is very detailed.

## Everything happens on your device

The tool resizes with the browser's own canvas, so the photo is never uploaded anywhere. That matters for private client images and for speed: there is no queue and no file size limit beyond what your browser can hold in memory. You can even do it on a phone while away from a desktop.

If the export is still too large for a platform, pass it through the [Image Compressor](/image-compressor/) after resizing. Compressing after resizing is better than the other way around - you only re-encode the final pixels once.

## Checklist

- Pick the preset for the platform, or type exact pixels.
- Crop for covers, fit for screenshots and diagrams.
- Start from an image at least as large as the target size.
- Export JPG or WebP for photos, PNG only for flat graphics.
- Compress afterwards only if a platform enforces a file size limit.
