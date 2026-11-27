---
title: "How to make a grid collage without awkward crops"
description: "Arrange photos in a uniform grid with centre-cropped tiles, adjustable spacing and background colour, then export a local PNG."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/collage-maker/hero.svg
coverAlt: "Four travel photographs arranged in a two-column collage with rounded corners and grey spacing"
coverCaption: "Every collage tile uses the largest photo dimensions, then cover-crops each image around its centre."
takeaways:
  - "Columns runs from 1 to 6, gap runs from 0 to 100 pixels, and rounded photo corners use a fixed 18 pixel radius."
  - "Tile width and height come from the largest selected image, so one oversized photo affects every cell."
  - "Photos are scaled to cover their tile and cropped around the centre; there is no contain mode or crop-position control."
  - "An incomplete final row still reserves empty cells filled with the chosen background colour."
  - "The collage is assembled locally and downloads as collage-maker.png at the calculated full canvas size."
faq:
  - q: "How is this different from Merge Images?"
    a: "The Collage Maker scales each photo to cover a uniform tile and crops the overflow. Merge Images preserves native dimensions and centres whole images, leaving more variable empty space."
  - q: "Can I drag photos into a different order?"
    a: "No. Placement follows the selected file order, filling each row from left to right. Arrange or select the files in the intended sequence before creating the collage."
  - q: "Why is there blank space in the last row?"
    a: "The canvas always reserves a complete grid. If the photo count does not fill the final row, or if you choose more columns than photos, the unused cells remain filled with the background colour."
  - q: "Does the rounded option make the canvas transparent?"
    a: "No. It clips each photo inside its tile with an 18 pixel corner radius. The background is painted across the rectangular canvas first, so the outer canvas corners stay filled."
draft: false
---

A grid collage gives separate photos a shared structure. It is useful for travel sets, product galleries, event recaps and step-by-step visuals, but uniform tiles introduce one important trade: every image must survive the same crop.

The [Online Collage Maker](/collage-maker/) builds that grid in the browser. Choose the photos, columns, spacing and background, then export a PNG. The tool uses centre-cropped cover tiles, so preparation matters more than dragging individual images around.

## What the collage maker is for

Use it when the final composition should feel filled and regular. Each photo occupies the same tile dimensions, with optional rounded corners and consistent gaps. The result works as a single image for a post, handout or gallery card.

It is not a free-form layout editor. There are no text boxes, filters, borders, shadows, stickers or draggable cells. The selected file order controls placement, and every tile uses the same crop strategy.

Choose Merge Images instead when the whole image must remain visible at its native size. Choose a collage when a clean, filled grid matters more than preserving every edge.

## Controls and what they change

Select multiple browser-decodable photos. Their order determines placement from left to right, then top to bottom. There is no reorder control after selection.

**Columns** runs from 1 to 6 and defaults to 2. The number of rows is calculated by dividing the photo count by the column count and rounding up.

**Gap** runs from 0 to 100 pixels and defaults to 12. It applies between tiles only. There is no separate outer padding control, so the first and last tiles touch the canvas edge unless a background area is created by the grid itself.

**Background** is white by default and fills gaps and unused cells. **Rounded photo corners** is enabled by default and clips each photo to a fixed 18 pixel radius. It does not change the rectangular canvas shape.

<figure>
  <img src="/assets/img/blog/collage-maker/workflow.svg" alt="Diagram showing ordered photos, cover-crop tiles, column and gap controls, and a rounded grid collage" width="1200" height="675" loading="lazy">
  <figcaption>Photos fill equal tiles row by row; the crop is centred and the background shows only in gaps or unused cells.</figcaption>
</figure>

Press **Create collage** after setting the controls. The preview displays the finished canvas. Changing a setting does not automatically regenerate the collage, so run it again when you want to inspect an adjustment.

## Worked example: four matching landscape photos

Choose four photos that are each 1200 by 800 pixels. Set two columns, a 12 pixel gap and a white background. Leave rounded corners enabled.

The largest image sets every tile to 1200 by 800. Four photos create two rows, so the output dimensions are:

- Width: 1200 * 2 + 12 = 2412 pixels.
- Height: 800 * 2 + 12 = 1612 pixels.

Each photo already matches its tile aspect ratio, so no visible crop is needed. The 12 pixel background strip separates the columns and rows, while the outer edges remain flush with the canvas.

With three photos and the same two-column setting, the canvas still has two rows. The first row contains two tiles; the second contains one tile on the left and one empty background cell on the right. That is expected grid behavior, not a missing photo.

<figure>
  <img src="/assets/img/blog/collage-maker/example.svg" alt="Four 1200 by 800 photos arranged into a 2412 by 1612 two-column collage with 12 pixel gaps" width="1200" height="675" loading="lazy">
  <figcaption>Four matching landscape photos produce a 2412 by 1612 canvas: two 1200 by 800 rows separated by one 12 pixel gap.</figcaption>
</figure>

Mixed aspect ratios need more attention. A portrait placed in the same 1200 by 800 tile is enlarged until it covers the tile, then its top and bottom are cropped around the centre. A face positioned near the top of the source can therefore disappear even though the photo loaded correctly.

## Output and formats

The download is `collage-maker.png`. It contains the complete calculated grid at full size. There is no JPG, WebP, quality or resolution control.

PNG preserves sharp tile edges, rounded clipping and background colour. It can be large when several high-resolution photographs are combined. The largest source determines the tile size, so a single oversized image can make the entire canvas much bigger than expected.

Source EXIF metadata is not copied into the canvas export. Animated images become still frames. Transparency from inputs is covered by the chosen background because the canvas is filled before the photos are drawn.

## Limits and edge cases

The tool has no maximum photo count in its configuration, but every image is decoded before drawing. Large sets, high-resolution sources and limited device memory can make creation slow or unsuccessful.

Crop position is fixed at the centre. There is no way to move a face, product or heading within its tile. Prepare centre-weighted crops before selecting photos when the subject sits near an edge.

Columns can exceed the photo count, which creates empty cells and a wider canvas. Gap adds space only between tiles, not around the outside. If the design needs a true outer margin, prepare a larger background composition separately rather than assuming the gap control will provide one.

## Common mistakes to avoid

Do not mix one enormous photo with several small ones without checking the output size. The largest dimensions set every tile, and the smaller photos are enlarged to cover them. This can soften them and increase cropping.

Avoid placing critical faces near the top or bottom of portrait sources. Centre cropping may remove them. The same applies to text, logos and products positioned near an edge.

Check file order before running the collage. A sequence can look plausible while being reversed. Also remember that rounded corners affect the photos only; the outer canvas remains rectangular with the selected background colour.

## Local privacy and file handling

All selected photos are decoded, scaled, clipped and composited inside the browser. There is no upload service, account or shared queue, so private event photos and unreleased product images can stay on the device.

The original files are not modified. The collage is a separate PNG download, which should be renamed and moved into the intended folder. On shared hardware, treat the output as sensitive whenever any source photo is sensitive.

## A practical workflow

1. Put the photos in the intended sequence before selecting them.
2. Decide whether every subject can tolerate a centred cover crop.
3. Choose a column count that suits the destination's shape.
4. Set a gap that keeps boundaries visible without wasting space.
5. Pick a background and choose rounded or square photo corners.
6. Create the collage and inspect faces, text and edges in the preview.
7. Download the PNG, verify dimensions and rename it for the project.

For a balanced set, use similarly sized and similarly framed photos. When the sources vary widely, prepare working crops first so the collage tool only has to arrange them.

## Final checklist

- Confirm the selected photo order.
- Check the centre crop on every face and product.
- Remember that the largest image sets all tile dimensions.
- Account for empty cells in an incomplete final row.
- Use gap only between tiles, not as outer padding.
- Expect a full-size PNG with a rectangular background canvas.
- Keep the source photos unchanged.

A strong collage is planned before export. Give every tile a centred subject, choose a sensible grid and let the consistent spacing make the set feel finished.
