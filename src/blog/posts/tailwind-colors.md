---
title: "Tailwind colours: generate a usable shade set from one base"
description: "Create numbered colour shades from a HEX base, copy HEX, RGB or HSL values and understand the lightness and saturation rules behind the palette."
date: 2026-11-27
categories:
  - Tailwind
cover: assets/img/blog/tailwind-colors/hero.svg
coverAlt: "A vertical ramp of eleven blue shades with labels from 50 to 950 and format controls"
coverCaption: "A shade ramp is a starting system; contrast and semantic colour roles still need separate decisions."
takeaways:
  - "The default base is blue #2563eb with nine shades and HEX output."
  - "Lightness moves linearly from 95 percent down to 5 percent across the generated set."
  - "Saturation increases by eight points in the first half and decreases by eight points in the second half, within zero to one hundred."
  - "Choosing eleven shades gives the familiar labels 50 through 950; other counts use rounded intermediate labels."
  - "Values can be copied individually or together, but there is no Tailwind config or CSS-variable export."
faq:
  - q: "Are these the official Tailwind colour palettes?"
    a: "No. The tool uses its own HSL-based shade generation from the colour you choose. The 50-to-950 labels resemble Tailwind's naming pattern, but the generated values are not copied from Tailwind's built-in palette."
  - q: "Why does the 500 shade differ from my base colour?"
    a: "The base colour is converted to HSL first. The middle shade is generated at 50 percent lightness with the algorithm's saturation adjustment, so it may not equal the original HEX value even when it looks similar."
  - q: "Can the tool check text contrast?"
    a: "No. It generates and formats shades only. Use a contrast checker for each intended foreground-background pair, especially for small text, links, buttons and focus indicators."
  - q: "What labels appear when I choose nine shades?"
    a: "The default nine labels are 50, 163, 275, 388, 500, 613, 725, 838 and 950. Eleven shades use the standard sequence 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 and 950."
draft: false
---

Choosing one brand colour is easy; deciding which lighter and darker versions belong beside it is where inconsistency starts. The [Tailwind Colors](/tailwind-colors/) tool turns a single HEX base into a numbered shade ramp and formats every value as HEX, RGB or HSL.

Use it to draft backgrounds, borders, hover colours and text tones around a brand starting point. The result is a generated palette, not a complete colour system. It does not assign semantic roles or verify contrast, so a shade that fits the ramp can still be unsuitable for body text or a focus ring.

## How the shade set is generated

The **Base colour** panel contains one colour picker, a shade-count slider and an output-format menu. The **Colour shades** panel lists a chip and formatted value for every generated shade, with a **Copy** button beside each row.

The base HEX value is converted to RGB and then HSL. Hue stays fixed for the set. Lightness runs from 95 percent at the lightest shade to 5 percent at the darkest. Saturation is adjusted by eight percentage points upward for shades in the first half and downward for shades in the second half, clamped between 0 and 100 percent.

Those rules explain why the ramp is systematic rather than a random collection. They also explain why the generated middle shade may differ from the original base colour.

## Exact controls and defaults

The starting configuration is:

- **Base colour:** `#2563eb`.
- **Number of shades:** 9, ranging from 3 to 15 in steps of 1.
- **Output format:** **HEX**, with **RGB** and **HSL** alternatives.

When the count is exactly 11, the labels are `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. For every other count, labels are calculated by spreading 50 to 950 across the available positions and rounding to the nearest integer.

The default nine-shade labels are `50, 163, 275, 388, 500, 613, 725, 838, 950`. Changing the count therefore changes both the number of values and the labels between the fixed endpoints.

HEX output uses lowercase `#rrggbb`. RGB output uses `rgb(r, g, b)`. HSL output uses space-separated `hsl(h s% l%)`, with hue, saturation and lightness rounded to whole numbers after the shade is generated.

## Worked example: a standard eleven-step blue ramp

Keep the default **Base colour** at `#2563eb`, set **Number of shades** to 11 and leave **Output format** on **HEX**. The tool produces eleven rows labelled from 50 to 950. Selected values are:

```text
50: #e7eefe
100: #bbcffc
500: #0b55f4
900: #091a3e
950: #030916
```

The `500` row is `#0b55f4`, not the original `#2563eb`. The base was first converted to approximately `hsl(221 83% 53%)`; the generated middle shade uses 50 percent lightness and the lower saturation of the second half of the algorithm.

Switching **Output format** to RGB changes the `500` row to `rgb(11, 85, 244)`. Switching to HSL gives approximately `hsl(221 91% 50%)`. The swatch remains visually the same; only its text representation changes.

<figure>
  <img src="/assets/img/blog/tailwind-colors/example.svg" alt="An eleven-step blue shade ramp highlighting the generated 50, 500 and 950 values in HEX, RGB and HSL" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: an eleven-shade run from #2563eb produces #e7eefe at 50, #0b55f4 at 500 and #030916 at 950.</figcaption>
</figure>

## Output and supported formats

Each shade has its own **Copy** button for the selected text format. The main **Copy** action copies the entire list as lines such as `500: #0b55f4`. **Download** saves the same labelled list as `tailwind-colors.txt`.

The tool exports one format at a time. It does not include all three representations for each shade in the downloaded list, and it does not generate a CSS stylesheet, JavaScript object, Tailwind theme configuration or design-token JSON.

Keep the numeric labels when documenting roles, but remember that they are shade identifiers rather than automatic usage instructions. A `500` label does not mean the colour is appropriate for every primary action.

## Limits and edge cases

The palette is based on HSL hue, saturation and lightness. It does not use OKLCH, perceptual lightness matching or contrast-aware adjustment. Consequently, two base colours with similar-looking lightness can produce ramps that feel different in actual use.

Grey and near-grey bases deserve special attention. The algorithm still applies the saturation increase and decrease, so an achromatic base can acquire a slight hue tint in parts of the ramp. Check neutral palettes carefully if you expect true greys.

There is no alpha channel, gradient generation, colour-blindness simulation or semantic naming. The colour picker supplies a HEX base, and the count is limited to 3 through 15 shades. Complex brand systems usually need manual refinement after this first pass.

## Common mistakes

Do not assume the `500` shade reproduces the input exactly. Do not call the output an official Tailwind palette. The labels follow a familiar pattern, but the values come from this tool's own formula.

Avoid choosing text and background shades from opposite ends of the ramp without measuring their contrast. Very light shades can work as surfaces while failing as text, and a dark shade that looks strong on white may disappear on a dark background. Also avoid changing format expecting the colour to change; HEX, RGB and HSL are representations of the same generated shade.

## Browser and privacy behaviour

Colour conversion and shade generation happen in the current browser tab. There is no upload or account step, and these modules do not store the base colour, count or format in browser storage. **Reset** returns the workspace to `#2563eb`, nine shades and HEX.

The page assets must load before the controls work. Copying can depend on clipboard permission, and individual shade buttons provide a fallback when you only need one value. The text download is created locally and contains colour values, not image data.

## A practical workflow

1. Start with the brand base and choose 11 shades when you want the standard 50-to-950 labels.
2. Inspect the light, middle and dark shades rather than judging the entire ramp at a glance.
3. Choose the text format your project uses and copy the complete list or individual values.
4. Assign semantic roles such as surface, border, muted text and action in your design system.
5. Measure contrast for the actual pairings, then refine any shade that does not fit.
6. Recreate the approved values in your project's tokens or Tailwind theme; there is no direct config export here.

<figure>
  <img src="/assets/img/blog/tailwind-colors/workflow.svg" alt="A palette workflow from base colour and shade count through format selection, semantic roles and contrast checks" width="1200" height="675" loading="lazy">
  <figcaption>Working order: generate the ramp, assign roles, then test the real colour pairings before turning the values into project tokens.</figcaption>
</figure>

## Pre-export checklist

- Confirm the base colour and whether 11 shades are needed for standard labels.
- Inspect the lightest, middle and darkest values, including neutral-base tint.
- Choose HEX, RGB or HSL deliberately for the destination system.
- Copy individual values or the full labelled list as needed.
- Assign semantic roles and measure contrast on real pairings.
- Add the approved values to project tokens manually; no config file is generated.
