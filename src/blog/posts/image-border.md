---
title: "How to add a clean border to an image"
description: "Add a solid, double or dashed frame locally, understand the rounded option, and export a PNG that is wider and taller than the source."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/image-border/hero.svg
coverAlt: "A framed landscape photograph with a wide white border on a neutral grey surface"
coverCaption: "A border changes the canvas dimensions as well as the look, so choose its width before export."
takeaways:
  - "Border size runs from 1 to 200 pixels and adds that amount to every edge, so a 24 pixel frame adds 48 pixels to both width and height."
  - "Solid, double and dashed styles use one chosen border colour; the tool does not add a shadow or gradient."
  - "The rounded option applies a rounded clipping path, but the background is filled first, so the exported corners are not transparent."
  - "Every canvas export is a PNG, with the source image kept at its native pixel dimensions inside the frame."
  - "The photo is decoded and processed in the browser, with no image upload or account required."
faq:
  - q: "Does adding a border resize the photo?"
    a: "No. The source is drawn at its native width and height. The output canvas grows by twice the border size in each dimension, so the photo itself is not stretched or reduced."
  - q: "Can I download the framed image as JPG?"
    a: "No. This tool exports PNG only. It keeps border edges crisp and avoids another lossy encoding, but a photographic PNG may be larger than a JPG."
  - q: "Does the rounded style create transparent corners?"
    a: "No. The background is filled across the rectangular canvas before the rounded clipping path is applied to the photo. Use an image editor if you need a genuinely transparent rounded silhouette."
  - q: "Which image files can I use?"
    a: "The chooser accepts image files, but decoding depends on the browser. Common JPG, PNG and WebP files work; HEIC, TIFF and other formats may need conversion first. Animated images become a still frame."
draft: false
---

A border can make a product photo feel deliberate, separate a screenshot from the page around it, or give a social graphic a consistent frame. It is also a subtle geometry change: the finished file becomes larger, even though the picture inside stays the same size.

The [Add Borders to Image](/image-border/) tool handles that geometry locally. Choose one photo, set the frame and download a PNG without an upload. This guide covers the controls, a measured example and the limits to plan around.

## What the border tool is for

Use it when the frame is part of the finished image: a white mat around a listing photo, a dashed edge around an announcement or a double line around a graphic. The source stays intact while the tool creates a new canvas.

It is not a layout editor: there are no text boxes, shadows, texture fills, independent edge widths or layers. One colour and one size apply around the whole image, so complex frames need a fuller editor.

## Controls and what they change

**Border size** is a number from 1 to 200 pixels, defaulting to 24. The value is rounded to a whole pixel. A size of 24 places the source 24 pixels from every output edge, so both output dimensions increase by 48 pixels.

**Border colour** sets the frame fill. White is the default and works well against coloured interfaces; a dark colour can make a bright image feel contained. Double and dashed details use this same colour rather than a separate accent.

**Border style** offers four choices:

- **Solid:** an even coloured surround with no extra line.
- **Rounded:** a rounded clipping path is used while placing the photo.
- **Double:** an inner stroke follows the photo edge, with another stroke inside the surround.
- **Dashed:** a dashed rectangular stroke sits within the frame.

The rounded choice needs care. The background is filled before the rounded path is applied, so outside corners remain filled. The padded photo stays inside that rectangular canvas; do not rely on this option for rounded photo corners or a transparent silhouette.

<figure>
  <img src="/assets/img/blog/image-border/workflow.svg" alt="Diagram showing a source photo, border size and colour controls, and a larger framed PNG output" width="1200" height="675" loading="lazy">
  <figcaption>The frame adds equal padding on all four sides; the photo keeps its original pixel dimensions inside the new canvas.</figcaption>
</figure>

After a file is selected, the preview updates automatically when a control changes. If nothing appears, confirm that the browser decoded the image, then press **Add border** to run it again.

## Worked example: a 24 pixel white frame

Take a 1600 by 900 landscape photo. Set border size to 24, colour to white and style to solid. The source is placed at coordinate 24,24 on an output canvas measuring 1648 by 948 pixels.

The arithmetic is simple:

- Output width: 1600 + 24 + 24 = 1648 pixels.
- Output height: 900 + 24 + 24 = 948 pixels.
- Photo area: still 1600 by 900 pixels.

Choosing double or dashed keeps those same dimensions. Only the line treatment changes. Choosing a size of 40 would instead produce a 1680 by 980 canvas, which is why the frame width should be decided before preparing an exact-size export.

If a destination requires exactly 1600 by 900 pixels, resize the source first. With a 24 pixel border, a 1552 by 852 source produces a 1600 by 900 finished image. Adding the border and resizing afterwards would shrink the frame and the photo together, defeating the point of choosing a precise frame width.

<figure>
  <img src="/assets/img/blog/image-border/example.svg" alt="Before and after view of a 1600 by 900 photo becoming a 1648 by 948 PNG with a 24 pixel white border" width="1200" height="675" loading="lazy">
  <figcaption>A 24 pixel frame adds 48 pixels to each dimension: 1600 by 900 becomes 1648 by 948 without resizing the photo.</figcaption>
</figure>

## Output and formats

The download is a PNG named `image-border.png`. It contains the rendered canvas, not the original file. Animation, colour profiles and camera metadata therefore do not carry through as they would in an archival copy.

A still JPG, PNG or WebP that the browser can decode is suitable. An animated GIF becomes one frame. Source EXIF is not copied into the canvas export, which helps before publishing but means the download is not the untouched original.

PNG is lossless and keeps border lines crisp, but detailed photographs can produce large files. If weight matters more than preserving every pixel, convert or compress the finished image later; this tool has no quality control.

## Limits and edge cases

There is one input and no batch mode. The visible size control runs from 1 to 200, but the practical limit is the device: the browser must decode the source and allocate a canvas large enough for the expanded dimensions.

Very large photos can take longer or fail on a phone with limited memory. A 200 pixel border adds substantial new canvas area while retaining the full source. Work from the smallest original that still has enough destination detail.

The tool accepts `image/*`, not a guaranteed list of codecs. Browser support for HEIC and TIFF varies. If the preview reports that the format cannot be decoded, convert the source to a browser-friendly still image first. No setting inside the border tool will repair an unsupported file.

## Common mistakes to avoid

A platform with exact dimension limits may reject the larger PNG. Plan the final width and height before adding the frame.

Another mistake is expecting rounded corners to remove the background. They do not. The result keeps a rectangular coloured canvas, so placing it on a dark page can reveal bright corners. For a transparent cut-out, use a dedicated masking or editor workflow.

Do not use a heavy border to rescue a poorly cropped photo. It adds emphasis around the frame, not missing subject detail. And avoid framing small text with a dark colour that reduces contrast; the border should support the content rather than compete with it.

## Local privacy and file handling

The page reads the selected file into the browser, draws it on a canvas and creates the PNG locally. There is no upload step, processing queue or account. The original file on disk is not overwritten.

That suits client images, unpublished products and private screenshots. It does not make a shared device private: downloads, history and temporary files can remain. Save deliberately and close the tab after handling sensitive material.

## A practical workflow

1. Decide the final canvas size required by the destination.
2. Choose a clean, high-quality source and account for the border on both sides of each dimension.
3. Set size, colour and style, then inspect the live preview.
4. Check that any text or important detail remains clear of the photo edge.
5. Download the PNG and verify its dimensions before uploading.
6. Keep the untouched source alongside the framed version for future crops or exports.

For a simple listing image, a solid 16 to 32 pixel frame is usually enough. Double and dashed styles work best when the line is visible at the final display size; very thin details can disappear when a large image is scaled down.

## Final checklist

- Confirm the destination accepts the larger framed dimensions.
- Choose one border colour that has enough contrast with the photo edge.
- Use a border size that remains visible at normal viewing scale.
- Do not expect the rounded style to produce transparent corners.
- Review the preview after changing style, not just after choosing the file.
- Download, reopen and check the PNG before replacing a working asset.

A good border is quiet and intentional. Once dimensions are planned, the tool finishes locally without changing the original.
