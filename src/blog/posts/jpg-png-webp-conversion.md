---
title: "JPG, PNG or WebP: choosing a format per image"
description: "When a photo belongs in JPG, when a screenshot needs PNG, and when WebP saves the most bytes - plus what converting cannot fix and how transparency behaves."
date: 2026-11-27
categories:
  - Images
draft: false
---

Most image problems are format problems in disguise. The same picture can take 300 KB as WebP, 800 KB as JPG and 2 MB as PNG, and a format swap is often the whole fix for a slow page or a rejected upload.

## The one-line rule

- **JPG** for photographs and anything with smooth colour.
- **PNG** for flat graphics, screenshots, icons and images that need transparency.
- **WebP** when you want the smallest file with broad support, photos included.

That rule covers the large majority of files. The rest of this guide is the reasoning behind it.

## What each format is good at

JPG is tuned for photographs. It throws away subtle colour detail that the eye is unlikely to notice, which is why a portrait at 70 percent quality looks untouched at a fraction of the size. It has no transparency: transparent areas become a background colour, white by default.

PNG is lossless. Every pixel is kept exactly, which makes it ideal for text, charts, UI screenshots and logos with a transparent background. The price is size - a photo saved as PNG can be several times bigger than the same photo as JPG.

WebP does both jobs with newer compression. It supports transparency like PNG and beats JPG on photos at similar quality. Every current browser reads it, so the main reason to avoid it is an older tool that refuses the file.

## Converting does not recover quality

Converting a heavily compressed JPG to PNG makes a bigger file with the same lost detail. The compressed version is the ceiling. Convert to PNG only when you need lossless editing or transparency; convert to JPG or WebP when you want the file smaller. When the tool asks for quality, start at 0.8 for photos - below 0.6 the artefacts become visible on faces and gradients.

## Practical checks before converting

- Does the destination strip transparency? If the image has a transparent background, do not send JPG unless you picked a background colour on purpose.
- Is the image already small? Re-encoding a 40 KB file rarely helps and can add new artefacts.
- Are you converting many files at once? The [Image Format Converter](/image-converter/) accepts a batch of up to 30 files, converts them one by one in the browser, and keeps the output names recognisable.

## Why convert in the browser

Image batches often contain client work under embargo or private screenshots. A local converter reads and encodes each file on your device with no upload and no queue, so the files never leave the machine.
