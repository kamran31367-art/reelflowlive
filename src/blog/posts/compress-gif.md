---
title: "Compress GIF: reduce pixels and frames with realistic expectations"
description: "A code-checked guide to GIF scale, frame sampling and colour controls, with a worked 60-frame example and honest limits on compression and transparency."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/compress-gif/hero.svg
coverAlt: "ReelFlow Toolkit Compress GIF guide cover with an IMAGE label on a purple gradient"
coverCaption: "The reliable size levers are smaller frames and fewer sampled pictures; re-encoding does not guarantee a smaller file."
takeaways:
  - "Scale ranges from 10 to 100 percent and defaults to 70."
  - "Frames per second ranges from 1 to 30 and defaults to 10; the tool samples frames rather than inventing new ones."
  - "Colour count is configured for 2 to 256, but the current bundled encoder does not apply that option."
  - "The output is a re-encoded GIF named compressed.gif, with no guaranteed byte reduction."
  - "Transparency is not reliably preserved by the current encoder, so inspect the result over contrasting backgrounds."
faq:
  - q: "Does Compress GIF always make the file smaller?"
    a: "No. Every frame is decoded and re-encoded, and an already optimised GIF can stay the same size or grow. Compare the output file size with the source before replacing it."
  - q: "How are frames removed for a lower FPS setting?"
    a: "The tool estimates source FPS from the average frame delay, calculates a sampling step and keeps every nth frame starting with the first. It does not interpolate or blend the missing motion."
  - q: "Does Colour count reduce the palette?"
    a: "The field is present, but the current bundled GIF encoder does not pass that value into its frame tasks. Use Scale and FPS as the reliable controls in this implementation."
  - q: "Will transparent areas remain transparent?"
    a: "Not reliably. The current encoder does not set a transparent palette entry, so transparent regions can become opaque, often dark. Test the downloaded GIF over light and dark backgrounds."
draft: false
---

GIF is expensive because animation needs many complete, palette-limited pictures. The [Compress GIF](/compress-gif/) tool scales the canvas, samples frames and exposes a colour-count field. Those controls are not equally effective in the current implementation, so choose settings that genuinely change the output rather than assuming every slider promises a smaller file.

## When compression is appropriate

Use Compress GIF for a short animation that must remain a GIF: a reaction loop, product demonstration or instructional sequence. Smaller dimensions remove pixel data, while a lower target frame rate removes whole pictures. Both changes can help without converting the format.

It is not a universal optimisation button. An already small or flat-coloured source may not shrink, and re-encoding can increase file size. If the destination accepts MP4 or WebM, video is usually better for long or photographic animation.

## Exact controls and defaults

The **GIF image** field accepts one GIF. **Scale** is a range from 10 to 100 percent, step 1, defaulting to 70. It sets both output dimensions proportionally and cannot enlarge beyond the source. **Colour count** is a number field configured from 2 to 256, step 1, with a default of 128.

**Frames per second** is a range from 1 to 30, step 1, defaulting to 10. Press **Compress GIF** to start. **Reset** clears the file and restores all defaults; **Download** saves `compressed.gif`.

The colour field needs a caveat: although the operation passes its value to the encoder wrapper, the bundled GIF encoder does not use it when creating frame tasks. In the current implementation, changing Colour count is not a reliable palette-reduction lever. Scale and FPS are the controls that directly alter the generated frames.

<figure>
  <img src="/assets/img/blog/compress-gif/workflow.svg" alt="Compress GIF workflow card showing GIF and compression input, local processing and compressed GIF output" width="1200" height="675" loading="lazy">
  <figcaption>The workflow card connects GIF compression settings to local frame processing and a compressed GIF output.</figcaption>
</figure>

## Worked example: 60 frames at 20 FPS

Start with an 800 × 450 GIF containing 60 frames at a uniform 20 FPS. Its duration is about three seconds. Set **Scale** to 70. The output canvas becomes 560 × 315 pixels, preserving the 16:9 shape.

Set **Frames per second** to 10. The tool estimates the source rate as 20 FPS, calculates a step of 2 and keeps frames with indexes 0, 2, 4 and so on. That produces 30 output frames. Each receives a 100 ms delay, so the sampled sequence still runs for about three seconds.

Leave **Colour count** at 128 or change it, but do not credit that field for a size difference in this build. Generate the GIF, then compare the actual byte size and watch the entire loop. Fast motion may look less smooth at 10 FPS even though the overall duration remains approximately correct.

## How scaling and frame sampling work

Output width and height are each the source dimension multiplied by the scale percentage, rounded to at least one pixel. Scaling uses browser image smoothing, so downscaled photographs generally look softer than the nearest-neighbour result from Resize GIF. There is no sharpening control to recover the discarded detail.

Frame sampling uses the average source delay to estimate FPS. The step is `round(estimated FPS / target FPS)`, with a minimum of 1. When the target rate is lower, the tool keeps periodic frames; when it is equal to or higher than the estimate, it keeps every frame and shortens the delay. It never creates in-between frames.

Because the estimate is an average, uneven source timing is flattened. A GIF that pauses on one frame and moves quickly on others may lose that rhythm. Rounding can also make the final duration differ slightly from the source, so check the loop rather than relying only on the frame-rate label.

## Output and file format

The result is a GIF named `compressed.gif`. Its dimensions follow the scale setting, and its frames use the sampled sequence with a uniform delay based on the target FPS. GIF remains limited to a 256-colour palette, and the encoder uses its own fixed internal quality setting; the page does not expose a quality slider.

There is no measured before-and-after size panel. Compare file sizes in your operating system or file manager, and keep the original if the output is larger, looks worse or fails a transparency check. The source is not modified.

## Limits and edge cases

Transparency is not reliably preserved. The current encoder is created without a transparent palette entry, so transparent areas can become opaque, often dark. Test the output over both light and dark backgrounds. This is a significant limitation despite GIF's ability to represent transparency in suitable files.

Complex disposal methods can produce compositing artefacts when frames are reconstructed. The encoder also uses its default continuous-loop behaviour rather than retaining a custom source loop count. Large sources require memory for decoded frames, full-size composites and output canvases; long or high-resolution animations can make the tab slow or fail.

The colour-count field does not currently affect the encoder's per-frame palette work. Do not assume that choosing 2 colours produces a two-colour GIF. If palette control is essential, use a workflow that explicitly supports it and verify the resulting file.

## Common mistakes

Do not lower FPS and expect smoother motion. Sampling removes pictures; it can make fast action stepped. Reduce dimensions first, then choose the lowest frame rate that still reads clearly. Avoid extreme downscaling of GIFs containing small text, because no later setting can restore the lost letterforms.

Another mistake is compressing an already tiny GIF repeatedly. Each pass decodes and re-encodes the pixels, so quality can drift while the file fails to shrink. Work from the original, make one considered export and compare. Do not use visual blur or palette loss as a privacy guarantee; redact sensitive content with an opaque cover in a separate workflow.

## Local processing and privacy

The GIF is decoded and composited locally, then encoded by two browser workers using bundled code. No file upload or account is required. Loading the toolkit page still requires the website, but the selected animation does not wait for an upload or a server-side queue.

Worker count does not remove memory limits. If processing becomes unresponsive, close other heavy tabs and try a smaller scale or shorter source. On a shared device, close the page after downloading and avoid leaving private animations open in the result pane.

<figure>
  <img src="/assets/img/blog/compress-gif/example.svg" alt="Compress GIF example card showing Scale 70, Colour count 128, Frames per second 10 and a Compressed GIF result" width="1200" height="675" loading="lazy">
  <figcaption>The example card shows the default compression controls, not measured byte savings. The custom frame calculation above explains the 70 percent scale run.</figcaption>
</figure>

## A practical compression workflow

Keep the source and decide the smallest acceptable display width first. Apply a moderate scale, then lower target FPS only as far as the motion allows. Generate once, compare the real file size and watch the full loop for timing, text and disposal artefacts.

Test transparency over contrasting backgrounds and check that the loop behaviour is acceptable. If the output is not smaller or looks worse, keep the original and try a smaller scale rather than stacking more passes. For recurring work, record the source dimensions and chosen settings so later exports start from a known baseline.

## Final checklist

- Start from the original GIF and set a realistic scale.
- Expect frame sampling, not motion interpolation.
- Check the whole loop and its approximate duration.
- Do not rely on Colour count in the current implementation.
- Compare actual input and output byte sizes.
- Test transparency and keep the source when the result is worse.
