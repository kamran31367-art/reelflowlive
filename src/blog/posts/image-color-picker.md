---
title: "Image Color Picker: sample a pixel and record HEX, RGB and HSL"
description: "Learn how percentage-based X and Y sliders map to image pixels, what the colour result includes, and how to copy or download accurate sampled values."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/image-color-picker/hero.svg
coverAlt: "ReelFlow Toolkit Image Color Picker guide cover with an IMAGE label on a purple gradient"
coverCaption: "The picker reads one decoded pixel at a mapped canvas position and reports its colour and alpha."
takeaways:
  - "Pick X and Pick Y range from 0 to 100 percent and both default to 50."
  - "The sliders map to rounded, clamped pixel coordinates; they are not a click-to-sample eyedropper."
  - "The result reports six-digit HEX, rgb(), hsl(), pixel position and alpha percentage."
  - "Copy includes HEX, RGB and HSL only; the text download also includes Position and Alpha."
  - "Sampling and conversion run locally, and the output is text rather than an edited image."
faq:
  - q: "Can I click directly on the uploaded image to pick a colour?"
    a: "No. The interface provides Pick X and Pick Y sliders. Move them to the desired percentages, then read the sampled pixel values in the result pane."
  - q: "Why does a fully transparent pixel still show HEX and RGB values?"
    a: "Transparent pixels can contain invisible RGB data. The tool reports those channels and also shows Alpha, so check the alpha percentage before using the colour as an opaque swatch."
  - q: "Does the picker sample colours outside images, such as on another website?"
    a: "No. It samples an image you load into this tool. It does not read the screen, clipboard colours or pixels from other pages."
  - q: "Can I download the sampled colour as a PNG?"
    a: "No. The result is text. Download creates a .txt file containing HEX, RGB, HSL, Position and Alpha, while Copy places the three colour formats on the clipboard."
draft: false
---

Brand colours often arrive inside a photograph, screenshot or logo rather than as a neat hex code. The [Image Color Picker](/image-color-picker/) reads a single decoded pixel and reports its colour in three common formats. It also records the pixel coordinates and alpha. The key to using it accurately is understanding that its two position sliders work in percentages, not direct screen clicks.

## When pixel sampling helps

Use the picker to document a colour from a reference image, match a chart to a supplied brand asset, or investigate why a screenshot differs from the colour you expected. It is particularly useful when you need the actual stored pixel values rather than a rough visual match from a generic colour wheel.

The tool does not average an area, extract a palette, identify a dominant colour or correct white balance. It samples exactly one mapped pixel. Texture, anti-aliasing, compression and gradients can therefore produce many different values across what looks like one uniform area. For a flat brand colour, choose a pixel well inside the region rather than on its edge.

## Exact controls and defaults

The **Image** field accepts one browser-decodable image. **Pick X** and **Pick Y** are ranges from 0 to 100 with a step of 1, and both default to 50. X measures from the left edge; Y measures from the top edge. The tool updates automatically after loading an image or moving either slider.

**Pick colour** is available for an explicit run, **Reset** clears the image and restores both values to 50, and **Download** saves the text result. There is no magnifier, click target, area-size setting or manual pixel-coordinate field.

<figure>
  <img src="/assets/img/blog/image-color-picker/workflow.svg" alt="Image Color Picker workflow card showing image and position input, local processing and picked colour output" width="1200" height="675" loading="lazy">
  <figcaption>The workflow card links image and pick-position input to local pixel sampling and a picked colour result.</figcaption>
</figure>

## Worked example: an 800 by 600 image

Load an 800 × 600 PNG. Set **Pick X** to 25 and **Pick Y** to 50. The renderer calculates X as `round(25 / 100 × 799)`, which gives pixel 200. It calculates Y as `round(50 / 100 × 599)`, which gives pixel 300.

Suppose the pixel at 200, 300 contains `rgb(18, 52, 86)` with alpha 192. The result reports:

- HEX: `#123456`
- RGB: `rgb(18, 52, 86)`
- HSL: `hsl(210 65% 20%)`
- Position: `200, 300`
- Alpha: `75.3%`

The HSL percentages and hue are rounded for display, while HEX and RGB represent the decoded 8-bit channels. Alpha is calculated from 192 divided by 255 and shown to one decimal place.

## What Copy and Download include

The main **Copy** button copies three lines: HEX, RGB and HSL. It deliberately leaves out Position and Alpha. This is convenient when pasting a colour into design code, but check alpha separately before using the value in an asset that must be opaque.

**Download** creates `image-color-picker.txt`. That text file includes all five reported lines, including the actual pixel coordinates and alpha percentage. It is a record of the sample, not an image file or a reusable colour-palette format. Save it with a descriptive name if you are collecting several reference colours.

## Limits and edge cases

A one-percent slider step does not address every pixel in a large image. On a 4000-pixel-wide source, one step spans roughly 40 pixels. The picker can still report an exact colour for the pixel it maps to, but you cannot target every individual pixel with the slider alone. Choose a larger flat region or prepare a crop when precision matters.

X and Y are clamped to valid canvas coordinates. A value of 0 maps to the first row or column, while 100 maps to the last pixel rather than one pixel beyond the edge. The displayed Position is the final clamped coordinate, which is useful when checking the mapping.

Transparent pixels are a special case. The swatch uses the RGB hex value, but the text also reports alpha; a pixel with alpha 0 percent may display a colour that is invisible in the original. For semi-transparent edges, remember that the same RGB values can look different when composited over white, black or another colour.

## Common mistakes

Do not sample the boundary between two colours unless that mixed pixel is what you want. Anti-aliasing creates intermediate values along text and shape edges. Likewise, a JPEG artefact or gradient can make nearby samples disagree. Move the sliders by one step and compare before deciding which value represents the colour.

Another mistake is assuming rounded HSL will convert back to the exact original RGB. Use HEX or RGB when exact channel matching matters. Browser decoding and colour-profile handling can also affect the canvas values, so treat the result as the decoded pixel colour rather than an archival measurement of the source file's original encoding.

## Local processing and privacy

The selected image is decoded into a canvas in your browser. The tool reads one pixel with `getImageData`, converts the channels to text and offers local copy and download actions. No image upload or account is required, and the sampled colour does not need to leave the device unless you choose to share it.

Large images still require memory to decode even though only one pixel is read. If loading fails, try a smaller copy or a browser-supported format. On a shared device, avoid opening confidential reference images and close the page after recording the values you need.

<figure>
  <img src="/assets/img/blog/image-color-picker/example.svg" alt="Image Color Picker example card showing Pick X 50, Pick Y 50 and a Picked colour result" width="1200" height="675" loading="lazy">
  <figcaption>The example card shows both position sliders at 50. The custom calculation above maps X 25 and Y 50 to pixel 200, 300.</figcaption>
</figure>

## A practical colour-documentation workflow

Choose the reference image and identify a flat area away from edges. Set X and Y, confirm the reported Position, then record both colour and alpha. If you are building a palette from several images, download each text result or copy the three colour lines into a clearly labelled working document.

Do not expect the tool to curate or harmonise the samples. Contrast, accessibility and suitable combinations are separate checks. Test the chosen colours in the real layout, over the actual background and with the intended text before treating the sampled value as a finished design decision.

## Final checklist

- Use X and Y as percentages from the left and top edges.
- Sample inside a flat region, not an anti-aliased boundary.
- Check the reported pixel Position after mapping.
- Record Alpha when transparency matters.
- Prefer HEX or RGB for exact channel matching.
- Download the text record and test the colour in context.
