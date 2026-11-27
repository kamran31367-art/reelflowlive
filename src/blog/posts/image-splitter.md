---
title: "How to split an image into tiles without gaps"
description: "Split one image into a rows-and-columns grid, understand uneven tile sizes, and download every PNG tile together in a local ZIP."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/image-splitter/hero.svg
coverAlt: "A landscape image divided into a neat grid of numbered square tiles"
coverCaption: "The grid follows pixel boundaries, so divisible dimensions make equal tiles and other sizes create small differences."
takeaways:
  - "Rows and columns each run from 1 to 10, giving a maximum grid of 100 tiles from one image."
  - "Tiles are cut edge to edge with no overlap, gap or border, and the source image is never resized."
  - "Dimensions that do not divide evenly can produce tile widths or heights that differ by one pixel."
  - "The download is image-tiles.zip, containing PNG files named by row and column."
  - "All cutting and ZIP creation happens in the browser, so the image is not uploaded."
faq:
  - q: "Why are some tiles one pixel wider or taller?"
    a: "Each boundary is rounded down to a whole source pixel. When the image width or height is not divisible by the number of columns or rows, the remainder has to go somewhere, so neighbouring tiles can differ slightly."
  - q: "Can I choose JPG tiles or download them one by one?"
    a: "No. The tool creates PNG tiles and packages them in one ZIP. The preview shows every tile, but the download action saves the complete archive rather than separate files."
  - q: "Why does the tool reject my grid?"
    a: "The grid cannot contain more columns than the image has width in pixels, or more rows than its height in pixels. Reduce the row or column count, or start with a larger source."
  - q: "Does splitting upload my image?"
    a: "No. The image is decoded locally, each tile is drawn on a canvas, and the ZIP is assembled in the current browser tab. Your original file remains untouched on disk."
draft: false
---

Some images are already one composition but need to arrive as several files: a printable grid, a set of social tiles, a tiled background, or individual panels for a game or slide. Splitting by eye in an editor is slow and easy to get wrong.

The [Image Splitter](/image-splitter/) turns one image into a precise grid and packages the pieces in a ZIP. There is no upload and no manual dragging. The important part is choosing a grid that matches both the source dimensions and the way the tiles will be used.

## What the splitter is for

Use it when the final pieces should reconstruct the original exactly. Place the tiles back in row order with no spacing and the image joins together again, apart from any differences introduced by viewing or export software.

This is different from making a collage. A collage arranges separate photos into a new composition; the splitter removes pieces from one existing composition. It is useful for maps, sprite sheets, contact-sheet layouts and images that a platform or application expects as a regular matrix.

The tool does not add gutters, labels or overlap. If panels need a gap between them, create that spacing in the source before splitting.

## Controls and what they change

The image control accepts one browser-decodable image. PNG is a good source when exact pixels matter, although JPG and WebP also work. Animated images are treated as still frames.

**Columns** and **Rows** are whole numbers from 1 to 10, both defaulting to 2. Their product is the number of tiles. A 3 by 4 grid creates 12 files, arranged across three columns and down four rows.

The tool waits for you to press **Split image**. Changing a number does not automatically rebuild the archive, which is useful when you are still deciding on the grid. After a successful run, the preview displays the tiles in row order.

<figure>
  <img src="/assets/img/blog/image-splitter/workflow.svg" alt="Workflow diagram of one source image divided by three column lines and two row lines into six numbered tiles" width="1200" height="675" loading="lazy">
  <figcaption>Columns are counted left to right and rows top to bottom; the resulting filenames preserve that reading order.</figcaption>
</figure>

The only grid restriction is geometric: columns cannot exceed the source width in pixels, and rows cannot exceed its height. In normal use, the 1 to 10 control range is the tighter limit.

## Worked example: a 1600 by 900 photo

Choose a 1600 by 900 image, set three columns and two rows, then press **Split image**. The tool produces six PNG tiles.

Vertical boundaries are calculated at 0, 533, 1066 and 1600 pixels. That gives tile widths of 533, 533 and 534 pixels. The horizontal boundaries are 0, 450 and 900, so every tile is 450 pixels high.

The archive contains:

- `tile-1-1.png`, `tile-1-2.png` and `tile-1-3.png` for the top row.
- `tile-2-1.png`, `tile-2-2.png` and `tile-2-3.png` for the bottom row.

That one-pixel difference is not a crop error. It is the result of dividing 1600 whole pixels into three positions without inventing fractional pixels. If exact equal tile sizes are essential, choose dimensions that divide cleanly. A 1599 by 900 source would divide into three 533 pixel columns.

<figure>
  <img src="/assets/img/blog/image-splitter/example.svg" alt="Six exported PNG tiles from a 1600 by 900 source, labelled tile-1-1 through tile-2-3" width="1200" height="675" loading="lazy">
  <figcaption>The sample 3 by 2 split yields three columns of 533, 533 and 534 pixels, with every tile 450 pixels high.</figcaption>
</figure>

## Output and formats

The result is `image-tiles.zip`. Inside it, every tile is a PNG named `tile-row-column.png`. PNG keeps the decoded pixels without introducing another round of lossy compression, which is helpful when the tiles need to line up precisely.

The source dimensions are preserved across the grid. The tool does not scale the image first, add padding or export an HTML contact sheet. The thumbnails in the preview are for inspection; the ZIP is the actual deliverable.

Canvas exports do not carry the source camera metadata into each tile. Orientation is handled as the browser decodes the image, so a phone photo may appear upright even though the original stored orientation in metadata. Keep the original if you need its full metadata for archival purposes.

## Limits and edge cases

A 10 by 10 grid means 100 canvases and 100 PNG encodings held together before the ZIP is generated. That can use significant memory on a phone or in a tab with other large images open. Smaller grids are faster and easier to verify.

There is no stated file-size or pixel cap in the configuration, but device memory is a real ceiling. A very large source may decode slowly or fail before any tiles are produced. Downscale a working copy first if the final tiles do not need the full source resolution.

Input support follows the browser rather than a fixed format list. Common JPG, PNG and WebP files are the safest choices. HEIC and TIFF support varies, and an unsupported image will produce a decoding error instead of a partial archive.

## Common mistakes to avoid

Do not count rows and columns backwards. Three columns and two rows creates a wide six-tile set, not two columns and three rows. Check the preview before downloading, especially when the source contains text or directional content.

Avoid splitting through important details unless that is intentional. A face, heading or product edge centred on a grid line will be cut between files. Move the composition or change the grid when the subject matters more than perfectly even spacing.

A one-pixel remainder is usually harmless, but it can matter in software that demands identical dimensions. Use divisible source sizes for strict systems. Also remember that JPG source artefacts remain in the tiles; splitting a compressed photograph does not recover detail or undo earlier compression.

## Local privacy and file handling

The entire operation runs on the device. The browser reads the image, draws each tile, encodes PNGs and builds the ZIP with bundled code. No image is sent to a processing service, and no account is needed.

That is valuable for maps with private locations, unreleased artwork or internal screenshots. The downloaded ZIP is a separate file, so the source is not overwritten. On a shared machine, store both files deliberately and remember that browser downloads may remain in the default download folder.

## A practical workflow

1. Decide whether the tiles must reconstruct the source exactly or need spacing added first.
2. Choose a source large enough for the final tile detail, but not unnecessarily huge.
3. Set columns and rows, then inspect the preview count and arrangement.
4. Check grid lines against faces, text and other important edges.
5. Press **Split image** and wait for the status to report the number of ready tiles.
6. Download the ZIP, extract it and verify a corner tile before distributing the set.

For repeatable systems, record the grid beside the asset name. A folder labelled `map-3x2` is much easier to rebuild correctly than one labelled `map-tiles`.

## Final checklist

- Confirm the row and column values match the intended arrangement.
- Check whether the dimensions divide evenly enough for the destination.
- Inspect every grid line for important content.
- Keep the original image alongside the ZIP.
- Extract the archive and reopen representative tiles.
- Remember that each tile is PNG and the archive is the only download.

A clean split is mostly a planning decision. Once the grid is right, the tool makes every cut locally, consistently and in the correct filename order.
