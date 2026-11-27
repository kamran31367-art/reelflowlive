---
title: "AVIF to PNG: convert one image without uploading it"
description: "Decode an AVIF image to a lossless PNG in your browser, with controls, dimensions, transparency, metadata and compatibility limits explained."
date: 2026-11-27
draft: false
categories:
  - Converters
cover: assets/img/blog/avif-to-png/hero.svg
coverAlt: "An AVIF image file icon flowing into a PNG canvas with transparent and opaque colour samples"
coverCaption: "PNG preserves the decoded pixels losslessly; it cannot restore detail that AVIF compression already removed."
takeaways:
  - "The converter accepts one AVIF file and relies on the browser's own AVIF decoder."
  - "Output is a PNG at the decoded image's original pixel dimensions, with no resize or quality control."
  - "PNG encoding is lossless for the pixels drawn to the canvas, but conversion does not reverse earlier AVIF compression losses."
  - "Canvas export drops source metadata and does not preserve animation; the result is one still image."
  - "The download is always named converted.png and the file is processed locally in the browser tab."
faq:
  - q: "Does converting AVIF to PNG improve image quality?"
    a: "No. PNG stores the pixels produced by the browser's AVIF decoder without further lossy compression, but it cannot recover detail discarded when the AVIF was created. It is useful for compatibility, editing or transparency, not for repairing a compressed source."
  - q: "Will the PNG keep the same dimensions and transparency?"
    a: "The canvas is created at the decoded image's natural width and height, so the pixel dimensions stay the same. Transparency is retained when the browser decodes it into the canvas and PNG supports an alpha channel. There is no background-colour control in this tool."
  - q: "Why does the browser say it cannot decode my AVIF file?"
    a: "AVIF support depends on the browser and operating environment. The tool uses the browser's image decoder rather than a dedicated AVIF library, so an unsupported or malformed file fails at the decode step. Try a current browser with AVIF support and verify that the source is a valid AVIF image."
  - q: "Can I convert an animated AVIF or a batch of files?"
    a: "No. The file field accepts one image, and the output is a single canvas-based PNG. Animation is not retained, and there are no batch, frame-selection or resize controls. For a multi-frame source, the result is only one still image."
---

The [AVIF to PNG Converter](/avif-to-png/) turns one AVIF image into a PNG using the browser's image decoder and canvas encoder. It is a compatibility tool: useful when an application accepts PNG but not AVIF, or when an editing workflow needs a lossless copy of the decoded pixels.

There is no upload and no settings panel. Choose a file, run the conversion and download the result. The important limits are just as simple: one still image, original dimensions and no quality recovery.

## When PNG is the right target

AVIF is efficient for web delivery, especially for photographs, but some content systems, older desktop applications and client workflows still expect PNG. Converting gives those destinations a widely supported file without asking you to re-export from the original design.

PNG is also a practical intermediate when you need lossless pixel storage for further editing. The PNG contains the image as the browser decoded it, so subsequent edits do not begin with another lossy save.

<figure>
  <img src="/assets/img/blog/avif-to-png/workflow.svg" alt="A single AVIF file passing through browser decoding and a canvas before PNG download" width="1200" height="675" loading="lazy">
  <figcaption>The conversion has three local stages: decode the AVIF, draw its pixels and encode a PNG.</figcaption>
</figure>

## The file control and conversion action

The **AVIF image** field is a single-file dropzone. Click it to choose a file or drag one AVIF onto it. The accepted types are `image/avif` and the `.avif` extension. Multiple selection is not enabled.

After choosing a file, press **Convert to PNG**. The operation reads the file, creates a temporary browser URL for decoding and draws the decoded image onto a canvas. When encoding finishes, the status reads **PNG ready** and **Download** becomes available.

**Reset** clears the selected file and the result. It does not convert a folder, preserve a queue or remember the last image. Choose the next file and run the action again for a separate conversion.

## A worked example

Suppose you have a 1600 by 900 pixel product illustration saved as `product.avif`. Choose the file and press **Convert to PNG**. The canvas is created at 1600 by 900 pixels, the illustration is drawn at its natural size and the browser encodes that canvas as PNG.

The downloaded file is named `converted.png`. Its pixel dimensions remain 1600 by 900, even if the source file used metadata or display hints that made it appear at another size in a particular application.

If the illustration contains a transparent background, the decoded transparent pixels are drawn into the canvas and can be retained in the PNG's alpha channel. The tool does not add a matte colour. If the AVIF has no transparency, the PNG is opaque.

This example describes the conversion path rather than a guaranteed byte size. PNG output can be substantially larger than AVIF, particularly for photographs, because it does not use the same lossy compression strategy.

<figure>
  <img src="/assets/img/blog/avif-to-png/example.svg" alt="A 1600 by 900 AVIF product illustration converted to a same-size PNG with its alpha channel retained" width="1200" height="675" loading="lazy">
  <figcaption>The dimensions and decoded transparency carry into the PNG; the source filename does not.</figcaption>
</figure>

## Output format and naming

The only output format is PNG. The browser encodes the canvas with the `image/png` MIME type, and the result downloads as **converted.png**. The source filename is not reused, so rename the download if you are handling several images or need to keep the AVIF's base name.

There is no compression-level, colour-depth or interlacing setting. PNG is a lossless format, so a quality slider would not make the same trade-off it would for JPEG or WebP. File size is determined by the decoded pixels and the browser's PNG encoder.

The result pane reports readiness rather than offering a full editing preview. Open the downloaded PNG in your destination application to verify appearance, dimensions and transparency before replacing the source file.

## Dimensions, colour and metadata

The converter keeps the decoded natural width and height. It does not crop, resize, rotate or add padding. Any orientation handling comes from the browser's image decoding behaviour rather than an explicit control in this tool.

Canvas-based export does not carry the source file's metadata block into the PNG. Camera details, AVIF-specific metadata and other embedded information should not be expected to survive. For client media this can reduce unintended disclosure, but it also means the PNG is not an archival copy of the original file.

## Limits and edge cases

Browser AVIF support is required. If the browser cannot decode the file, the operation reports that the image format could not be decoded. A current browser with AVIF support is the first thing to check; a damaged or mislabeled source is another.

There is no explicit file-size or pixel-dimension cap in the code. Practical limits come from available browser memory and canvas capabilities. Very large images can fail to decode, draw or encode, so reduce the source dimensions in an image editor before conversion when necessary.

Animated AVIF is not exported as an animation. The browser decodes an image into one canvas, and PNG receives one still frame. The tool does not expose frame selection or timing controls.

The converter also accepts only AVIF. A PNG, JPEG, WebP or incorrectly named file does not become a valid input just because its extension was changed to `.avif`. Use the [Image Format Converter](/image-converter/) for its supported JPG, PNG and WebP workflows.

## Common mistakes to avoid

Do not expect a PNG to be smaller. For many photographs, the lossless output will be much larger than AVIF. If delivery size is the main requirement and the destination accepts AVIF, keeping the source is usually better.

Do not assume conversion restores sharpness. Enlarging the PNG later cannot recreate discarded detail, and saving it again as AVIF can introduce another round of loss.

Avoid overwriting the only source. The fixed output name `converted.png` makes it easy to lose track of which image produced which file. Rename outputs as you go and retain the AVIF until the PNG has been checked.

Finally, do not rely on the PNG to preserve metadata, animation or exact source colour management. Those are separate requirements that this canvas conversion does not address.

## Local processing and privacy

The file is read in the browser, decoded from a temporary object URL and drawn to a canvas. The PNG is created in the same tab. No image upload, account or server-side conversion queue is involved.

This matters for unreleased product shots, client artwork and personal photos. It also means the page does not keep a remote copy of your work. The temporary URL is released after decoding, and the result remains only in the browser until you download or reset it.

## A practical workflow

1. Confirm that the destination needs PNG rather than AVIF.
2. Keep the original AVIF and note its dimensions.
3. Choose one `.avif` file in the dropzone.
4. Press **Convert to PNG** and wait for **PNG ready**.
5. Download `converted.png` and rename it for the project.
6. Check dimensions, transparency and colour in the destination application.
7. Keep both files until the PNG has passed review.

## Final checklist

- The browser supports AVIF decoding.
- The source is a valid AVIF, not a renamed file of another type.
- PNG is required by the destination.
- Original dimensions are acceptable.
- Any transparency has been checked after download.
- The output has been renamed and the source retained.
- Metadata or animation is not expected to survive.

AVIF-to-PNG conversion is a format bridge, not an enhancement. Used with those expectations, it gives you a portable still image while keeping the source file entirely on your device.
