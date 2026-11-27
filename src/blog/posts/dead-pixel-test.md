---
title: "Dead Pixel Test: inspect solid colours without uploading a thing"
description: "Cycle red, green, blue, white and black with ReelFlow's Dead Pixel Test, learn its manual and automatic controls, and interpret suspicious pixels without false guarantees."
date: 2026-11-27
categories:
  - Misc
cover: assets/img/blog/dead-pixel-test/hero.svg
coverAlt: "A monitor showing five solid test colours beside a close button and a magnified pixel detail"
coverCaption: "Solid colours make unusual pixels easier to notice, but they do not certify a display."
takeaways:
  - "The test fills the browser viewport with red, green, blue, white and black in sequence."
  - "Colours change automatically every 1.4 seconds, and the visible button can advance them manually."
  - "The automatic timer keeps running after a manual advance, so the tool is not a pause-and-inspect controller."
  - "Escape closes the test; after black, the button closes it, while clicking empty screen space does nothing."
  - "It can reveal suspicious spots but cannot distinguish every dead pixel, stuck pixel, reflection, dust mark or panel fault."
faq:
  - q: "Can this test prove that a pixel is dead?"
    a: "No. It can make a suspicious spot easier to see across several solid fields. Dust, reflections, scaling, graphics settings and other factors can produce similar appearances. Record the location and conditions, repeat the check and follow the display manufacturer's support guidance."
  - q: "Can I pause on a colour to inspect it?"
    a: "There is no pause control. The automatic cycle continues every 1.4 seconds even after you press the next-colour button. Pressing Escape is the reliable way to end the test, and the single-colour White Screen or Black Screen can provide a static field instead."
  - q: "Does the test enter true full-screen mode?"
    a: "No. It creates a fixed overlay over the browser viewport. Browser toolbars and operating-system interface elements may remain visible. Use your browser's own full-screen command separately if you need more screen area."
  - q: "Does clicking anywhere advance the test?"
    a: "No. Despite the result message mentioning a click, the implementation attaches advancing and closing to the lower-right button only. Escape also closes the test. Clicking the empty coloured field has no effect."
draft: false
---

A small unusual dot is hard to judge on a photograph or a busy desktop. Solid fields remove the clutter, making it easier to notice a point that stays bright, dark or tinted when the surrounding area changes. The [Dead Pixel Test](/dead-pixel-test/) cycles five colours for exactly that kind of visual inspection.

It is a screening aid, not a diagnosis or repair tool. It cannot measure individual subpixels, produce a warranty report or prove what caused a mark. Used carefully, it gives you better evidence for the next step.

## What the colour cycle does

Press **Start pixel test** to open a fixed overlay across the browser viewport. The first field is red, followed by green, blue, white and black. After black, the automatic cycle returns to red.

Each field fills the available browser content area with one solid CSS colour. There are no gradients, grid lines, test images or moving patterns. A button remains at the lower right so you can advance or close the test.

The page does not access the camera, upload a screenshot or inspect hardware directly. It displays colours for you to examine visually.

<figure>
  <img src="/assets/img/blog/dead-pixel-test/workflow.svg" alt="Five-colour test workflow showing red, green, blue, white and black, automatic timing, manual advance and Escape close" width="1200" height="675" loading="lazy">
  <figcaption>The sequence repeats automatically; the button advances or closes, while Escape ends the test at any point.</figcaption>
</figure>

## Automatic and manual controls

The colour changes every 1.4 seconds without any further input. That gives each field a short viewing window and keeps the cycle moving through all five colours.

The lower-right button is labelled **Next colour / close**. Activating it advances the sequence manually. After black, another activation closes the overlay. **Escape** closes it from any colour.

There is an important timing limitation: manual advancement does not stop the automatic timer. The next scheduled change can follow soon afterwards, and a close click can race with a timer update. Do not expect a manually selected colour to remain still.

The result message says the colours change automatically and suggests clicking to advance or close. In the actual implementation, only the button responds to clicks. Empty coloured space is not an advance control.

## Worked example: inspect a laptop panel

Suppose you notice a small green dot near the centre of a laptop display. Set the display at the resolution and scaling you normally use, close unrelated windows and note any night-light or accessibility colour filter that could affect the image.

Start the pixel test. Watch the same screen location as red, green, blue, white and black pass. A dot that remains unusually bright on black, stays dark on a bright field or keeps a fixed colour across several fields is worth recording.

Note the approximate row, column and colour conditions, then repeat the check from a straight-on viewing position. If the spot moves when you change angle or wipe the glass, consider dust or reflection before treating it as a pixel fault.

<figure>
  <img src="/assets/img/blog/dead-pixel-test/example.svg" alt="Worked inspection example tracking one suspicious green dot across red, green, blue, white and black fields" width="1200" height="675" loading="lazy">
  <figcaption>The example tracks a fixed screen location across all five colours and records conditions before drawing a conclusion.</figcaption>
</figure>

## What different appearances may mean

A point that stays bright on a black field may be a stuck subpixel or another light-producing defect. A point that stays dark on several bright fields may be unresponsive. A coloured dot against an otherwise uniform field can also come from the panel or graphics path.

Those descriptions are observations, not verdicts. The page shows whole colours; it does not isolate red, green and blue subpixels individually or provide luminance measurements. One dot can have more than one possible cause.

Dust and fingerprints are common false positives. Reflections can appear or disappear with viewing angle. Browser or operating-system scaling can make a small area look different from its neighbours. Repeat under clean, consistent conditions before escalating.

## Static alternatives and photosensitivity

The five-colour cycle is useful for comparison, but it is poor for a long inspection of one field. Because there is no pause, the colour may change while you are still looking.

For a static view, close the test with Escape and open the [White Screen](/white-screen/) or [Black Screen](/black-screen/). Those tools provide one viewport-filling colour without the 1.4-second cycle. They still include a close button and do not enter native full-screen mode.

Rapid colour changes may be uncomfortable for people with photosensitivity or migraine. Do not run the cycle repeatedly just to create faster flashes. If the changing fields cause discomfort, stop and use a static single-colour page only if it is comfortable for you.

## Limits and edge cases

The overlay covers the browser viewport, not necessarily the physical display. Tabs, toolbars, scrollbars and system elements can remain outside it. The close button also occupies part of the coloured field, so not every visible area is uniform.

The tool has no grid, zoom, pixel coordinates, pause, speed setting, colour picker or results export. It cannot repair a pixel or run a manufacturer's diagnostic routine. It also cannot tell which monitor is active beyond where the browser viewport appears.

Night modes, colour filters, graphics settings and ambient light can alter what you see. Animated transitions are not used; the fields switch directly, and the automatic timer continues even after manual input.

## Common mistakes

Looking only at one colour is the first mistake. A suspicious mark may be obvious on black but nearly invisible on red. Run the full sequence before deciding what you saw.

Expecting a manual click to hold a colour is another. The timer is still active, so the field can change underneath your inspection. Use a static screen tool when you need time.

Do not turn a visual observation into a guaranteed hardware diagnosis. Record the conditions and repeat the check. If you need a warranty decision, use the manufacturer's procedure rather than treating this page as certification.

## Browser privacy and inspection checklist

1. Note the display, resolution, scaling and room lighting you are using.
2. Check the glass for dust and close the test if cleaning is needed.
3. Run the full red, green, blue, white and black sequence.
4. Track suspicious spots at fixed screen locations and repeat from a straight-on view.
5. Close with Escape when finished, and use a static screen for longer inspection.

The test generates colours locally. It does not upload screenshots, read files or request screen-capture permission. Loading the website still involves ordinary web requests, but the colour-cycle operation itself sends no display image or test result to a server.
