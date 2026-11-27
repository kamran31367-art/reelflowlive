---
title: "Resize GIF: change dimensions and timing without losing frames"
description: "A code-checked guide to GIF width, derived height and frame retiming, with a 640 to 320 pixel example and important transparency and playback limits."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/resize-gif/hero.svg
coverAlt: "ReelFlow Toolkit Resize GIF guide cover with an IMAGE label on a purple gradient"
coverCaption: "Resizing changes the canvas dimensions; the frame-rate control rewrites delay rather than removing frames."
takeaways:
  - "New width is configured for 16 to 2000 pixels and defaults to 480; height is calculated automatically."
  - "Frames per second ranges from 1 to 30 and defaults to 12."
  - "Resize GIF keeps every decoded frame and gives each one a new delay; it does not drop frames to reach the requested FPS."
  - "The resized canvas uses nearest-neighbour scaling, which preserves hard edges but can look jagged."
  - "The current encoder does not preserve source transparency reliably, so check the downloaded GIF over contrasting backgrounds."
faq:
  - q: "Does lowering FPS make the resized GIF smaller by removing frames?"
    a: "No. This tool keeps all decoded frames and changes their delay. Lower FPS can speed playback up without reducing the frame count; use Compress GIF when you need frame sampling as well as scaling."
  - q: "Can I set a custom height?"
    a: "No. Enter a new width and the tool derives height from the source aspect ratio, rounding to at least one pixel."
  - q: "Will a transparent GIF stay transparent?"
    a: "Do not rely on it with the current encoder. The re-encoding path does not set a transparent palette entry, so transparent regions can become opaque, often dark. Test the downloaded file over light and dark backgrounds."
  - q: "Why does 12 FPS play slightly faster than expected?"
    a: "GIF delays are stored in hundredths of a second. The tool's rounded millisecond delay is rounded again by the encoder, so 12 FPS becomes an 80 ms delay per frame, effectively 12.5 FPS."
draft: false
---

A GIF that looks crisp on your desk can be unnecessarily large in a message, document or blog. The [Resize GIF](/resize-gif/) tool changes the canvas width, derives the matching height and rewrites frame timing. It is a focused way to make an existing animation smaller without converting it to another format. One detail matters more than the rest: this resize operation retimes frames rather than dropping them.

## When to resize a GIF

Use Resize GIF when the animation itself is right but its pixel dimensions or playback speed need to change. A 640-pixel-wide reaction loop may suit a 320-pixel chat window; a slow sequence may need a faster delay. Because the tool decodes and re-encodes the GIF locally, you can make that derivative without handing the file to an upload service.

Choose **Compress GIF** instead when file size is the main problem and you are willing to reduce dimensions, frame rate and detail together. Choose a video format when the destination accepts one; GIF remains a poor choice for long, photographic animation. Resizing cannot fix a source that was already too compressed, nor can it restore missing colours.

## Exact controls and defaults

The **GIF image** field accepts one file through the chooser or dropzone. **New width** is a number field configured from 16 to 2000 pixels, step 1, with a default of 480. There is no height field: output height is the source height multiplied by the new-to-old width ratio, then rounded to at least one pixel.

**Frames per second** is a range from 1 to 30, step 1, defaulting to 12. Press **Resize GIF** to process the file. **Reset** clears the selection and restores the defaults; **Download** saves `resized.gif`.

Stay inside the advertised width range. The processing code rounds the width and enforces a minimum of one pixel, but it does not independently enforce the field's 16-pixel minimum or 2000-pixel maximum. Treat those interface values as the supported working range, not optional suggestions.

<figure>
  <img src="/assets/img/blog/resize-gif/workflow.svg" alt="Resize GIF workflow card showing GIF and size input, local browser processing and resized GIF output" width="1200" height="675" loading="lazy">
  <figcaption>The workflow card moves from GIF and size settings through local resizing and retiming to a resized GIF output.</figcaption>
</figure>

## Worked example: 640 by 360 at 12 FPS

Start with a 640 × 360 GIF containing 24 frames, each originally delayed by 100 ms. Its nominal source speed is 10 FPS and its duration is about 2.4 seconds. Enter **New width 320**. The scale is 0.5, so the derived height is 180 pixels.

Set **Frames per second** to 12. The tool still exports all 24 frames. It calculates a delay of `round(1000 / 12)`, or 83 ms, for each frame. The GIF encoder stores delays in hundredths, rounding that to 8 hundredths: 80 ms. The 24-frame result therefore lasts about 1.92 seconds and plays at an effective 12.5 FPS.

This example changes two things at once: dimensions and speed. If you only need a smaller canvas, compare a run with the source timing in mind. There is no original-timing lock, so record the source frame count and delays before experimenting.

## Output and file format

The download is a GIF named `resized.gif`. Multi-frame sources remain animated, while a one-frame source stays static. The canvas uses the requested width and derived height, and every decoded frame is re-encoded. GIF supports at most 256 colours per palette; the tool has no palette-size or quality control. The result pane reports readiness, so inspect the downloaded file rather than assuming the dimensions alone prove success.

Nearest-neighbour scaling is used. It does not blend neighbouring pixels, which can protect crisp pixel art but make photographs look stepped. The tool cannot switch to smooth scaling. Re-encoding also means the output is a new file, not a lossless edit of the original bytes, and it may be larger than an already well-optimised source.

## Frame timing: what FPS really changes

Every decoded frame receives the same new delay. The tool does not calculate a sampling step, remove duplicate frames or interpolate motion. A lower FPS value therefore makes the existing sequence play faster; it does not make the animation choppier by showing fewer pictures, although the shortened pauses can make motion feel more abrupt.

GIF timing has limited precision. Values such as 12 FPS cannot be represented exactly in centiseconds, and the two rounding stages can move playback away from the label. Variable source delays are also flattened because all output frames receive one uniform delay. Check the full loop, not just the first frame, before publishing.

## Limits and edge cases

Transparency is a known compatibility risk. The current GIF encoder is created without a transparent palette entry, so transparent source regions can become opaque, often dark. Check the output over both white and black backgrounds. The source listing describes transparency preservation, but the implementation does not currently guarantee it.

Complex GIFs can expose disposal-method artefacts because frames are reconstructed before scaling. The encoder also uses its default continuous-loop setting rather than preserving a custom source loop count. Very large dimensions, long animations and many frames require significant memory and worker time; the interface exposes no frame-count or file-size ceiling.

## Common mistakes

Do not lower FPS expecting a smaller file. Since frame count is unchanged, timing alone is not a frame-reduction strategy. Use Compress GIF for sampling. Also avoid enlarging a small GIF to the maximum width and expecting new detail; nearest-neighbour scaling simply makes existing pixels larger.

Do not assume a successful encode means every visual property survived. Test transparency, loop behaviour, disposal-heavy scenes and the loop seam. Keep the original GIF, especially when the source contains fine gradients or a carefully timed sequence that the uniform delay may flatten.

## Local processing and privacy

The GIF is read into memory, decoded by bundled browser code, composited on canvases and encoded by local workers. No file upload or account is required. Loading the toolkit page still requires the site, but processing does not depend on a server queue or upload connection speed.

Two encoder workers can use substantial CPU and memory. If the tab stalls, close other heavy pages and try a smaller target width or a shorter source. On a shared computer, close the page after downloading and avoid leaving private animations in the result state.

<figure>
  <img src="/assets/img/blog/resize-gif/example.svg" alt="Resize GIF example card showing a GIF input, New width 480, Frames per second 12 and a Resized GIF result" width="1200" height="675" loading="lazy">
  <figcaption>The example card shows the default width and frame rate. The custom calculation above explains derived height, retained frames and delay rounding.</figcaption>
</figure>

## A practical resize workflow

Record the source dimensions, frame count and approximate duration. Decide whether the goal is display size, playback speed or both. Enter a sensible width, generate the GIF, then inspect the complete loop at its intended display size and over the intended background.

If the file is still too heavy, move to Compress GIF rather than repeatedly resizing the same derivative. Keep the original and give each output a distinct name. For pixel art, nearest-neighbour scaling is often desirable; for photographs, expect a softer source or a different format to look better.

## Final checklist

- Enter a width within 16 to 2000 pixels.
- Check the automatically derived height and aspect ratio.
- Remember that FPS retimes all frames instead of dropping them.
- Inspect timing across the entire loop.
- Test transparency and loop behaviour in the downloaded file.
- Keep the original GIF and use Compress GIF for actual frame reduction.
