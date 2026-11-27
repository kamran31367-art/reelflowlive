---
title: "Image Watermark: place readable text without uploading the photo"
description: "Learn how to add a text watermark with exact position, size, opacity and colour controls, plus a worked example and a practical export checklist."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/image-watermark/hero.svg
coverAlt: "ReelFlow Toolkit Image Watermark guide cover with an IMAGE label on a purple gradient"
coverCaption: "A useful watermark identifies the work without hiding the subject or overwhelming the image."
takeaways:
  - "The tool places one line of text at a corner or the centre; it does not offer dragging, rotation, tiling or batch processing."
  - "Text size ranges from 8 to 160, but images wider than 1000 pixels scale the rendered text and padding automatically."
  - "Opacity ranges from 5 to 100 percent, with white as the default text colour."
  - "Every canvas-based result downloads as a PNG at the source image's pixel dimensions."
  - "The image and watermark text are processed locally in the browser, not uploaded to a server."
faq:
  - q: "Can I move the watermark by dragging it on the image?"
    a: "No. Choose Bottom right, Bottom left, Top right, Top left or Center from the Position menu. The tool calculates the text position from that selection and the measured text width."
  - q: "Why does a text size of 40 look larger on a wide photo?"
    a: "The renderer multiplies the size by the image width divided by 1000, with a minimum multiplier of 1. A 1600-pixel-wide image therefore renders size 40 at 64 pixels."
  - q: "Does the watermark survive resizing or cropping?"
    a: "The watermark becomes part of the exported pixels. Later cropping can cut it off, and resizing changes its apparent size. Keep the editable original and watermark the final-sized copy."
  - q: "Which image formats can I use?"
    a: "The chooser accepts image files that the browser can decode, including common JPG, PNG and WebP photos. The downloaded result is PNG; animated inputs are not exported as animations."
draft: false
---

A portfolio image can travel without its filename, caption or creator credit. A text watermark keeps ownership information attached to the picture, but placement matters as much as the words. The [Image Watermark](/image-watermark/) tool adds one line of text to a browser-loaded image, then exports a new PNG. It is suited to quick credit marks on photos, mockups and finished graphics rather than complex repeated patterns.

## When to use a text watermark

Use a watermark when the image needs a visible but secondary identifier: a studio name on a client preview, a copyright line on a portfolio export, or a small brand mark on a downloadable graphic. It is also useful before sending a proof outside your usual file-sharing workflow. The mark should support the image, not replace a filename, contract or metadata record.

This tool is intentionally narrow. It handles one image and one text string, with five fixed positions. Choose it when that simple placement is enough. A diagonal repeating pattern, an image logo, separate text styles or a draggable bounding box would require a fuller editor; none of those controls exists here.

## Exact controls and defaults

The **Image** field accepts one browser-decodable image through the file chooser or dropzone. **Watermark text** starts as `© ReelFlow` and has no visible character limit. Replace it with the credit you actually want to publish; an empty field produces no visible text.

**Position** offers Bottom right, Bottom left, Top right, Top left and Center. Bottom right is the default. **Text size** is a range from 8 to 160, defaulting to 36. The renderer uses a bold `system-ui, sans-serif` font, so the final letterforms depend on the fonts available in your browser.

**Opacity** runs from 5 to 100 percent and defaults to 75. **Text colour** defaults to `#ffffff`. A dark shadow is drawn behind the letters to help them separate from the photograph. After choosing the file and settings, press **Add watermark**. **Reset** clears the image and restores the control defaults; **Download** saves the result.

<figure>
  <img src="/assets/img/blog/image-watermark/workflow.svg" alt="Image Watermark workflow card showing image and watermark input, local browser processing and watermarked image output" width="1200" height="675" loading="lazy">
  <figcaption>The workflow card moves from image and watermark input through local browser processing to a watermarked image output.</figcaption>
</figure>

## Worked example: a portfolio photograph

Start with a 1600 × 900 JPEG that will be published at that full size. Enter `© North Studio`, keep **Bottom right**, set **Text size** to 40, **Opacity** to 80 and **Text colour** to white.

Because the image is wider than 1000 pixels, the scale multiplier is 1.6. The requested size therefore renders at 64 pixels, and the horizontal padding becomes 32 pixels. The renderer measures the text, places its right edge 32 pixels from the image's right edge, and sets the vertical baseline near the bottom using the scaled text size. You do not need to calculate those values yourself, but they explain why the mark stays proportionate on larger files.

Press **Add watermark**, inspect the preview and download it. Check both the full-resolution view and a thumbnail-sized view. If the credit disappears at the smaller size, raise the size or opacity rather than adding a heavier shadow that the tool does not expose.

## Output and file format

The result keeps the source width and height. A 1600 × 900 input produces a 1600 × 900 PNG, not a resized image. PNG is lossless and retains alpha when the source has transparency, but it is not necessarily smaller than the original JPEG. There is no JPG or WebP output option, quality slider or target file-size field.

The downloaded filename is `image-watermark.png`. The original file is untouched. Keep it as the editable master, because the watermark has been drawn into the exported pixels and cannot be switched off later.

## Limits and edge cases

Long text is not wrapped, shrunk to fit or clipped deliberately. If the measured line is wider than the available space, it can extend beyond the chosen side of the image. Shorten the wording or reduce the size until the whole line is visible. The Center position also centres the measured text rather than guaranteeing a safe margin.

Size is not a fixed pixel value on large images. Above 1000 pixels wide, both text and padding scale with width. A setting that looks right on a 1200-pixel graphic may look proportionally similar, but not identical in rendered pixels, on a 2400-pixel graphic. Very small images leave little room for shadows and padding, while very large images require more browser memory.

## Common mistakes

The most common mistake is watermarking before the final crop. A bottom-right mark is especially easy to lose when a platform crops an edge. Export at the intended dimensions first, then add the mark. Another mistake is using maximum size and opacity for every image; this can obscure the work the watermark is meant to protect.

Avoid relying on a translucent mark as the only proof of ownership. It can be removed, cropped or covered. Keep the original file, use a clear credit and follow the licensing or contract terms that apply to the image. Also test the mark against the actual destination: a preview that reads well on white may become faint over a pale sky.

## Local processing and privacy

The selected file is decoded into a browser canvas on your device. The watermark text, colour and placement are applied there, and the PNG is created locally. No image upload or account is required, so a slow connection does not delay the processing itself; loading the toolkit page still requires access to the site.

Large photographs can consume substantial memory. If the preview fails or the tab becomes unresponsive, close other heavy pages and try a smaller final-size export. Do not assume that local processing makes a shared computer private: close the page when finished and avoid watermarking confidential client material on a public device.

<figure>
  <img src="/assets/img/blog/image-watermark/example.svg" alt="Image Watermark example card showing the default ReelFlow text, Bottom right position and Text size 36" width="1200" height="675" loading="lazy">
  <figcaption>The example card shows the starting controls. The custom 1600 × 900 calculation above uses different text, size and opacity.</figcaption>
</figure>

## A practical watermark workflow

Crop and resize the master before opening the tool. Use a concise credit, choose the least distracting position and start with moderate opacity. Generate the PNG, then review it at the size and on the background where it will be seen. If the destination will crop the image, verify that the mark remains inside the visible area.

For repeatable client proofs, keep a short naming convention and a record of the original dimensions. The tool does not store presets or remember the last run after a reset, so write down a setting that works instead of assuming it will persist.

## Final checklist

- Replace the default watermark text with the correct credit.
- Use a final-sized, final-cropped source image.
- Check the whole line, especially with long names.
- Review the mark at thumbnail size as well as full size.
- Remember that text size scales above a 1000-pixel image width.
- Download the PNG and retain the unwatermarked original.
