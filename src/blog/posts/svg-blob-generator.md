---
title: "Generate Organic SVG Blobs for Backgrounds and Decorative Art"
description: "Create adjustable SVG blob shapes with controlled dimensions, point count, randomness and gradient fill, including a deterministic example and embedding checks."
date: 2026-11-27
categories:
  - Developer
cover: assets/img/blog/svg-blob-generator/hero.svg
coverAlt: "A smooth organic SVG blob with an indigo-to-pink gradient on a transparent background"
coverCaption: "The generator exports a single scalable path with fixed colours and no background, ready for further design work."
takeaways:
  - "Width and height start at 600 pixels, Points starts at 7 and Randomness starts at 24."
  - "Use gradient fill is checked by default, producing a fixed indigo-to-pink gradient; unchecked output uses solid indigo."
  - "Every Generate blob press creates a fresh random radius for each point, so there is no seed or repeat command."
  - "The output includes a live preview and SVG source, with Copy for the source and Download for blob.svg."
  - "The SVG uses viewBox 0 0 100 100 and a fixed gradient id of g, so multiple inline copies may need unique IDs."
faq:
  - q: "Can I reproduce the same blob later?"
    a: "Not from the page. There is no seed field or saved parameter history, and generation uses Math.random. Save the SVG source when you find a shape you want to keep."
  - q: "Can I choose custom colours?"
    a: "No. Gradient mode uses #6366f1 and #ec4899, while solid mode uses #6366f1. You can edit the exported SVG afterwards if custom colours are required."
  - q: "Can I download a PNG?"
    a: "No. This operation exports SVG markup as blob.svg. The preview is rendered from that SVG, but there is no raster-image conversion in the tool."
  - q: "Does changing width stretch the shape?"
    a: "The width and height attributes change the SVG's declared display dimensions, while the viewBox remains 0 0 100 100. Unequal dimensions can therefore stretch the rendered shape unless CSS preserves its aspect ratio."
draft: false
---

An organic shape can soften a hero background, illustrate a concept or add visual rhythm without a stock image. The [SVG Blob Generator](/svg-blob-generator/) creates a smooth closed path you can copy into markup or download as a standalone SVG. It is intentionally small: fixed colours, a transparent canvas and no seed history.

## When a generated blob is useful

Use a blob as a decorative background mask, an accent behind text or a starting point for a more detailed illustration. Because the output is vector geometry, it remains scalable when used as an external image or edited in a vector tool.

It is less suitable when you need precise brand artwork, a reproducible design token or an accessible standalone illustration. The page has no colour controls, layer system or export metadata. Treat the result as raw visual material that still needs design and accessibility review.

## Controls and defaults

The settings are:

- **Width:** 600, range 100–2000, step 1.
- **Height:** 600, range 100–2000, step 1.
- **Points:** 7, range 3–16, step 1.
- **Randomness:** 24, range 0–60, step 1.
- **Use gradient fill:** checked.

Press **Generate blob** after changing a setting. **Reset** restores these defaults but does not restore a previous shape. The two range controls show their current numeric value beside the slider.

## Worked example: a repeatable four-point shape

Randomness normally prevents an exact repeat, but setting it to zero makes every radius identical. Choose Width 600, Height 600, Points 4, Randomness 0 and leave gradient fill checked. The output is:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><path d="M 33 33 Q 50 16 67 33 Q 84 50 67 67 Q 50 84 33 67 Q 16 50 33 33 Z" fill="url(#g)"/></svg>
```

The four equally spaced points are smoothed with quadratic curves, producing a rounded, diamond-like organic shape rather than a hard polygon.

<figure>
  <img src="/assets/img/blog/svg-blob-generator/example.svg" alt="Four equally spaced points becoming a smooth gradient-filled SVG blob at zero randomness" width="1200" height="675" loading="lazy">
  <figcaption>With randomness at zero, four points produce a repeatable rounded shape and make the path geometry easy to inspect.</figcaption>
</figure>

## Output and download formats

The result pane shows the SVG preview above its escaped source. **Copy** copies the actual SVG markup, not the escaped preview text. **Download** saves `blob.svg` with an SVG MIME type.

The preview is constrained to a maximum display width of 360 pixels, but that does not change the downloaded SVG's declared dimensions. There is no background rectangle, so the area outside the path remains transparent.

The generated source starts directly with `<svg>` and has no XML declaration. That is convenient for inline markup and ordinary browser image use. If a standalone asset pipeline requires a declaration, add it during integration rather than assuming the download includes one. Using the SVG through an external `<img>` also avoids the fixed gradient ID colliding with IDs elsewhere in the document; inlining it gives more styling control but requires that ID check.

Three points produce a rounded triangular outline, while 16 points allow a more intricate contour. More points do not automatically look better: the shape still needs to support the nearby text and layout. Randomness changes the radial variation, not the gradient colours, so use the fill checkbox when you need a flatter visual weight.

## What points and randomness change

Points are distributed evenly around a circle, starting at the top. The path builder places the start at the midpoint between the last and first points, then uses quadratic curves through each point to create a smooth closed outline.

Randomness changes each point's radius by adding a random value from zero up to the selected percentage. At 24, radii vary from 0.34 toward an upper bound of 0.58 of the viewBox scale; at 60, they can approach 0.94. Higher values create more irregular silhouettes, but they do not change the colour contrast.

## Limitations and edge cases

There is no seed, undo, shape history or drag-to-edit control. Pressing Generate blob again replaces the current result with a new random shape. If you find one you like, copy or download it before experimenting further.

The number inputs advertise minimum and maximum values, but the operation does not clamp or validate those values in JavaScript. Stay within the displayed ranges. Very wide or tall dimensions can stretch the viewBox content, and very long sequences of points are not applicable because the maximum is 16.

The normalised `viewBox` makes the path geometry independent of the declared pixel size, but the default SVG aspect-ratio behaviour still fits that viewBox inside the width and height box. Unequal dimensions can therefore add empty space or stretch the rendered result depending on the embedding CSS. Test the shape in its real container, especially when a background image uses `cover`, `contain` or a fixed height.

The fixed gradient ID `g` can collide when multiple generated SVGs are inlined in the same HTML document. In that situation, rename the IDs in each SVG or use external image files so each document has its own gradient reference.

## Common mistakes to avoid

Do not expect the Randomness slider to adjust colour contrast; it changes geometry only. Do not assume that changing dimensions preserves the silhouette's proportions when width and height differ. Do not inline several copies without checking their gradient IDs.

Also avoid treating the exported SVG as automatically accessible. It contains no `<title>` or `<desc>`. Add appropriate accessible text for an informative image, or mark a purely decorative image accordingly in the surrounding HTML.

## Browser and privacy behavior

The points, radii and SVG string are generated in the browser with `Math.random`. No image-generation API or upload is involved. The source remains in the current result until you reset, replace or reload the page. Copying or downloading is the only export step.

## A practical design workflow

1. Decide whether the shape is decorative or needs accessible description.
2. Set dimensions that match the intended aspect ratio.
3. Start with a moderate point count and randomness.
4. Generate several candidates and save the source of the strongest one.
5. Check the shape against the background and text that will sit above it.
6. Copy or download, then rename gradient IDs if multiple SVGs will be inlined.

<figure>
  <img src="/assets/img/blog/svg-blob-generator/workflow.svg" alt="Workflow from dimension and shape settings through random path generation to SVG review and export" width="1200" height="675" loading="lazy">
  <figcaption>The generator controls geometry and fixed fill; layout, accessibility and any ID changes remain part of the integration workflow.</figcaption>
</figure>

## Final checklist

Confirm the dimensions, point count, randomness, fill mode and gradient ID strategy. Save the exact SVG source when the shape is approved, because regenerating with the same settings does not recreate the same random outline.
