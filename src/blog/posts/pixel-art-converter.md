---
title: "How to turn a photo into pixel art with honest controls"
description: "Reduce a photo to a compact palette, add blocky pixels and optional dithering, then export a full-size PNG entirely in the browser."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/pixel-art-converter/hero.svg
coverAlt: "A colourful landscape photo transformed into a grid of crisp square pixels"
coverCaption: "Pixel art comes from reducing detail first, then scaling the reduced grid back up without smoothing."
takeaways:
  - "Pixel size runs from 2 to 50 and controls how much the photo is reduced before it is enlarged again."
  - "Palette colours runs from 2 to 64 and selects the most common colour groups from the reduced image."
  - "Dithering is on by default and spreads colour error into neighbouring pixels for a more textured retro look."
  - "The PNG keeps the source dimensions; only the working grid is reduced, not the downloaded canvas."
  - "Palette selection, dithering and nearest-neighbour enlargement all happen locally in the browser."
faq:
  - q: "Does a larger pixel size reduce the downloaded image dimensions?"
    a: "No. The converter works on a smaller internal grid, then enlarges it back to the source width and height. A larger pixel size makes each visible block bigger, not the final PNG smaller."
  - q: "Can I choose a custom palette?"
    a: "No. The palette is derived automatically from the photo. You choose how many colours to keep, and the tool groups similar colours before selecting the most common groups."
  - q: "What does dithering do?"
    a: "It distributes the difference between an original colour and its palette replacement into nearby pixels. This can suggest extra shades and texture, but it also adds a patterned, noisy appearance."
  - q: "Will transparency survive?"
    a: "Transparent source pixels can retain their alpha values through the canvas process. RGB palette reduction does not create new opaque detail, but the final file is still a PNG and may be larger than the original."
draft: false
---

Pixel art is not simply a blurry photo. The useful version has visible square blocks, a limited palette and enough contrast to read at a glance. Getting there starts with reducing the image to a much smaller grid before enlarging it again.

The [Pixel Art Converter](/pixel-art-converter/) follows that process in the browser. It reduces the working resolution, builds an automatic palette, optionally dithers the colours and scales the result back to the original dimensions. No photo is uploaded, and no drawing skill is required.

## What the converter is for

Use it for retro game assets, poster graphics, profile icons or a stylised version of a landscape. Strong silhouettes and a few clear colours usually convert better than scenes full of fine texture.

It is a stylisation tool, not an AI redraw. Faces become blocky, small text disappears and subtle gradations collapse into palette colours. Start with a photo whose subject remains recognisable as a small thumbnail. The converter does not add outlines, animation, a fixed game palette or hand-edited pixels; refine it in a pixel editor if needed.

## Controls and what they change

**Pixel size** runs from 2 to 50 and defaults to 10. The tool divides the source width and height by this value, rounds the working dimensions to whole pixels and draws the photo into that smaller grid. A larger value means fewer working pixels and bigger visible blocks.

**Palette colours** runs from 2 to 64 and defaults to 16. The converter groups colours into coarse bins, counts how often each group appears, keeps the requested number of most common groups and averages the colours inside them. Each working pixel is then mapped to its nearest palette colour.

**Use dithering** is checked by default. When enabled, the converter spreads the difference between the original and chosen colour into neighbouring working pixels. This can make a small palette feel richer, especially in skies and shadows, but it also produces a retro dot pattern.

<figure>
  <img src="/assets/img/blog/pixel-art-converter/workflow.svg" alt="Diagram showing a photo reduced to a small grid, limited to a palette, and enlarged into square pixels" width="1200" height="675" loading="lazy">
  <figcaption>The working grid carries the palette and dithering; nearest-neighbour scaling turns each working pixel into a crisp block.</figcaption>
</figure>

After a photo is selected, the preview updates automatically when a control changes. Large sources and high palette counts can take longer, so allow the status line to finish before judging the result.

## Worked example: an 800 by 600 landscape

Choose an 800 by 600 photo with a clear horizon. Set pixel size to 10, palette colours to 16 and leave dithering enabled.

The internal grid is exactly 80 by 60 because both source dimensions divide cleanly by 10. The converter reduces the photo to those 4800 working pixels, builds a 16-colour palette and maps each pixel to the nearest colour. Error diffusion adjusts nearby colours as it works.

The result is then enlarged to 800 by 600 with smoothing disabled. In this example, every working pixel becomes a 10 by 10 block. The horizon and large shapes remain readable, while fine branches, window frames and facial details simplify into colour patches.

Try the same photo at pixel size 20. The working grid becomes 40 by 30 and the blocks are about twice as wide and tall. Reduce the palette to eight colours for a harsher, more limited look. Change one control at a time so you can see whether block size or palette count caused the improvement.

<figure>
  <img src="/assets/img/blog/pixel-art-converter/example.svg" alt="An 800 by 600 landscape beside its 80 by 60 working grid and blocky 16-colour PNG result" width="1200" height="675" loading="lazy">
  <figcaption>With a divisible 800 by 600 source and pixel size 10, the 80 by 60 working grid expands into even 10 pixel blocks.</figcaption>
</figure>

## Output and formats

The download is `pixel-art-converter.png` at the source image's native width and height. The visible pixel blocks are part of those dimensions; the tool does not output the small working grid as a separate file.

PNG keeps the hard block edges clean and can preserve source transparency. It is also lossless, so a detailed photographic source can produce a relatively large file even after palette reduction. The pixel-art look does not automatically mean a tiny download.

Animated inputs become a still frame. Source metadata is not copied into the canvas export. If you need the original photograph for archiving, keep it beside the stylised PNG rather than replacing it.

## Limits and edge cases

There is one input, no batch mode and no custom palette upload. The colour count is capped at 64. Photos with many small subjects may turn into mud because the palette is chosen by frequency across the whole image.

Dimensions that do not divide evenly by pixel size are rounded, then the reduced grid is stretched to the exact source size. Blocks can therefore vary slightly in displayed width or height. This is normal nearest-neighbour scaling.

Large photos require memory for the decoded canvas, reduced image, palette work and final output. There is no configured file-size cap, but an older phone may struggle with a high-resolution source. Use a smaller working copy when full resolution is unnecessary.

## Common mistakes to avoid

Do not judge the result only at full size. Pixel art is meant to read at its displayed scale, often as an icon or thumbnail. Zoom out and check whether the silhouette still works before adding more colours.

Too many colours can make the image look like a low-resolution photo rather than intentional pixel art. Start with 8 to 16 colours, then increase only if important shades disappear. Dithering can also create noise that distracts from the subject; turn it off for clean logos and simple shapes.

Avoid tiny, heavily compressed sources; enlarging them cannot recover detail. Text rarely survives a large pixel size, so add wording after conversion instead of expecting palette reduction to preserve it.

## Local privacy and file handling

The photo is read from disk, decoded in the page and processed on local canvases. Palette counting, colour matching and dithering all run inside the browser tab. There is no remote rendering service or account.

That makes the converter suitable for private portraits, client artwork and unreleased game assets. The original file is not overwritten, and the output is a separate PNG. As with any browser tool, use an appropriate download folder and close the tab when handling sensitive material on a shared device.

## A practical workflow

1. Choose a photo with a strong subject and clear large shapes.
2. Start at pixel size 10 with 16 colours and dithering enabled.
3. Inspect the preview at the size where the result will actually appear.
4. Adjust pixel size first, then palette count.
5. Toggle dithering and compare texture against clean flat colour.
6. Download the PNG and keep the original photo for future variants.
7. Resize the finished asset for its destination if a smaller file is needed.

For a sprite-like portrait, a simple background and limited clothing colours usually produce a cleaner result than a busy scene. For landscapes, preserve a clear horizon and let the palette handle the fine texture.

## Final checklist

- Confirm the subject reads as a small thumbnail.
- Choose pixel size before fine-tuning the palette.
- Use fewer colours when the result looks like a blurry photo.
- Disable dithering when its pattern distracts from the shape.
- Expect the PNG to keep the full source dimensions.
- Keep transparency only where the destination supports it.
- Save the source and output as separate files.

Good pixel art is a controlled reduction, not a filter strength contest. Decide what details can disappear, then let the block grid and limited palette do the work.
