---
title: "How to merge images without stretching or cropping"
description: "Combine photos horizontally, vertically or in a grid with exact native-size placement, configurable gaps and a locally exported PNG."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/merge-images/hero.svg
coverAlt: "Three different landscape photographs joined into one wide panoramic image"
coverCaption: "Merging places whole images side by side; it does not quietly resize them to fill matching boxes."
takeaways:
  - "Horizontal layout joins images left to right, vertical layout stacks them top to bottom, and grid layout fills rows using the chosen column count."
  - "Images keep their native dimensions; mixed sizes are centred within the space created by the largest image."
  - "Gap runs from 0 to 100 pixels and applies only between images, not around the outside of the canvas."
  - "Grid cells use the maximum width and height across the set, so an incomplete final row still reserves empty cells."
  - "The merged result downloads as a PNG, and every input is processed locally in the browser."
faq:
  - q: "Does merging resize or crop my images?"
    a: "No. Each image is drawn at its native width and height. Horizontal and vertical layouts centre mixed sizes against the largest dimension; grid layouts centre each image inside a uniform cell."
  - q: "Can I reorder the images after selecting them?"
    a: "No drag-and-drop reorder control is provided. The selected file order determines placement, so rename or select the files in the sequence you want before running the merge."
  - q: "Why is there blank space in my grid?"
    a: "Grid cells are based on the largest width and height in the whole set. Smaller images leave space inside their cells, and an incomplete final row keeps the unused cell area filled with the background colour."
  - q: "Which files can I merge?"
    a: "Any still image format your browser can decode is accepted. JPG, PNG and WebP are reliable choices; HEIC and TIFF support varies. Animated inputs are rendered as still frames in the PNG output."
draft: false
---

Combining two screenshots, placing product angles side by side or building a quick comparison strip should not require a full design application. The result also needs to be predictable: nobody wants a merge tool that silently stretches faces or crops the edge of a chart.

The [Merge Images Online](/merge-images/) tool places complete images on a new canvas. It offers three layouts, a gap and a background colour, then exports one PNG. There is no upload, and the original files are never modified.

## What merging is for

Use this tool when the source images should remain separate visual units. Typical jobs include joining numbered steps, placing before-and-after frames together, assembling a wide banner from panels, or making a simple contact sheet.

It differs from the Collage Maker. Merging preserves each image's dimensions and centres it in the available space; the collage maker scales photos to cover uniform tiles and crops the overflow. Choose merge when the whole image matters. Choose a collage when a tightly filled grid matters more.

There is no text, watermark, rounded corner or filter. The tool is limited to placement, spacing and background.

## Controls and what they change

Select multiple images with the chooser or drop them onto the input area. Their selected order is the placement order; there is no reorder handle after loading.

**Layout** has three options:

- **Horizontal:** images run left to right. Output height is the tallest input, and shorter images are vertically centred.
- **Vertical:** images stack top to bottom. Output width is the widest input, and narrower images are horizontally centred.
- **Grid:** images fill rows from left to right using the specified column count.

**Grid columns** ranges from 1 to 6 and defaults to 2. It affects grid layout only. **Gap** ranges from 0 to 100 pixels and defaults to 0. **Background** is white by default and fills any exposed canvas area, including space around transparent inputs.

<figure>
  <img src="/assets/img/blog/merge-images/workflow.svg" alt="Diagram comparing horizontal, vertical and grid placement of three source images with gap and background controls" width="1200" height="675" loading="lazy">
  <figcaption>All three layouts preserve native image dimensions; the background colour shows wherever no image covers the canvas.</figcaption>
</figure>

Press **Merge images** after choosing the files and settings. The preview shows the assembled canvas, and changing a control does not automatically create a new export.

## Worked example: two differently shaped photos

Start with a 1200 by 800 landscape photo and an 800 by 1200 portrait photo. Choose horizontal layout, a 20 pixel gap and a light grey background.

The output dimensions are calculated from the native inputs:

- Width: 1200 + 20 + 800 = 2020 pixels.
- Height: the taller input, 1200 pixels.
- Landscape position: left edge at 0, top edge at 200.
- Portrait position: left edge at 1220, top edge at 0.

The landscape is centred vertically in the 400 pixel difference between its height and the canvas height. The portrait already matches the canvas height. Neither image is stretched to 1200 by 1200, and neither loses an edge.

Switching to vertical layout with the same gap produces a 1200 by 2020 canvas. The landscape sits at the top; the portrait begins at y=820 and is centred horizontally in the 400 pixel width difference.

<figure>
  <img src="/assets/img/blog/merge-images/example.svg" alt="A 1200 by 800 landscape and an 800 by 1200 portrait merged horizontally with a 20 pixel gap" width="1200" height="675" loading="lazy">
  <figcaption>Horizontal merge of mixed dimensions: a 2020 by 1200 PNG with the shorter landscape centred vertically.</figcaption>
</figure>

Grid layout behaves differently. With two columns, the cell width is 1200 pixels and the cell height is 1200 pixels for this pair. Each image is centred inside its cell. Because every cell uses the maximum dimensions across the entire set, adding one unusually large photo can increase the space around all the others.

## Output and formats

The download is `merge-images.png`. It contains the new canvas, with no JPEG or WebP option. PNG preserves sharp edges and supports transparency from decoded inputs, although the chosen background is painted first and therefore appears behind transparent areas.

The source files remain unchanged. As with other canvas exports, source EXIF metadata is not copied into the merged PNG. Animated images are decoded as still frames, so merging GIFs does not create an animation.

PNG can be large when several detailed photographs are combined. The output pixel area matters more than the number of files: a wide strip of four high-resolution images can be enormous. Check the destination's dimensions and weight limits before investing in a large merge.

## Limits and edge cases

There is no configured maximum file count, but decoding time, canvas area and device memory set practical limits. Every source is loaded before drawing. A browser may struggle with many high-resolution images in one tab.

The tool cannot crop, scale or align individual images by hand. If one photo is much larger than the others, it determines the canvas dimensions or grid cell size. Prepare more consistent working copies first when the final design needs uniform visual weight.

Grid layout reserves a complete rectangular matrix. Three images with two columns create two rows, leaving the fourth cell as background. One image with three columns still contributes two empty columns. The grid does not shrink around the last item.

## Common mistakes to avoid

Do not assume grid layout is a collage. Images are not enlarged to fill their cells, so mixed dimensions produce visible background space. If you need cover-style cropping, use the Collage Maker instead.

Check file order before running the merge. Operating systems may sort differently from the order you remember, and the tool has no post-selection reorder control. A before-and-after pair is especially easy to reverse.

A zero gap joins transparent or light-edged images directly, which can make separate panels look accidental. Use a small gap or contrasting background when boundaries matter. Avoid merging large images for a thumbnail; the output is still built at full native size.

## Local privacy and file handling

All selected files are decoded and composited in the browser. There is no server upload, account or shared processing queue, so client work and unreleased product images can stay on the device.

The tool creates a new PNG and does not overwrite any source. That makes it safe to experiment with layout and background repeatedly. On shared hardware, remember that the output still lands in the download folder, so move sensitive results to the intended project directory.

## A practical workflow

1. Arrange the source files in the intended order before selecting them.
2. Decide whether whole images or filled crop tiles are required.
3. Choose horizontal, vertical or grid layout.
4. Set a gap that makes panel boundaries clear without wasting space.
5. Pick a background and inspect how transparent inputs sit on it.
6. Merge, check the preview and download the PNG.
7. Verify output dimensions before sending or uploading it.

For comparison strips, consistent source dimensions make the result much easier to read. For mixed sizes, use the background deliberately: it turns uneven spacing into a visible design choice rather than an apparent mistake.

## Final checklist

- Confirm the selected file order.
- Use horizontal for sequences and vertical for stacks.
- Remember that grid columns apply only to grid layout.
- Check whether an incomplete row leaves unwanted empty cells.
- Choose a gap that preserves important edges.
- Review the background behind transparent images.
- Download and verify the PNG at its full dimensions.

Merging works best as a precise placement task. Keep the sources whole, decide the geometry first, and the resulting composite will be easy to reuse.
