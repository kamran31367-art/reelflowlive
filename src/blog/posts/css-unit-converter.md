---
title: "CSS Unit Converter: px, rem, em and physical units explained"
description: "Convert eight CSS length units with a configurable root size, understand fixed CSS ratios and avoid treating em as a root-relative unit."
date: 2026-11-27
draft: false
categories:
  - Developer
cover: assets/img/blog/css-unit-converter/hero.svg
coverAlt: "Illustration of a ruler comparing pixels, rems, points and physical CSS lengths"
coverCaption: "Absolute CSS ratios are fixed; rem and em depend on font context."
takeaways:
  - "The tool converts px, rem, em, pt, pc, cm, mm and in using CSS's 96-pixel-per-inch reference."
  - "The default 16 px to rem conversion returns 1rem with a 16 px root font size."
  - "Root font size accepts 1 to 100 px and is used for both rem and em conversions."
  - "Values accept -10000 to 10000 with a 0.01 step, and results are rounded to six decimal places."
  - "Percentages, viewport units, calc() and true nested em context are outside the converter's scope."
faq:
  - q: "Does em use the root font size in real CSS?"
    a: "Not generally. An em length is relative to the computed font size of the element where it is used, which may be inherited or nested. This tool applies the same Root font size setting to em that it applies to rem, so treat em results as arithmetic that needs context review."
  - q: "Are physical units tied to my monitor's size?"
    a: "CSS defines 1 inch as 96 px, 1 cm as 96/2.54 px and 1 mm as 96/25.4 px. These are reference lengths, not measurements of the physical display. A ruler made with CSS units may not match a real-world ruler exactly."
  - q: "Can I convert percentages or viewport widths?"
    a: "No. The unit menus contain only px, rem, em, pt, pc, cm, mm and in. Percentage, vw, vh, ch and similar units need their containing block, viewport or font context, which this calculator does not collect."
  - q: "Why does the result omit trailing zeroes?"
    a: "The calculation is rounded to six decimal places and then converted back to a number before the unit is appended. That removes unnecessary trailing zeroes, so 16 px at a 16 px root becomes 1rem rather than 1.000000rem."
---

Design handoffs often mix pixels, points and root-relative lengths. The [CSS Unit Converter](/css-unit-converter/) makes those translations explicit, using a root font size you can change instead of assuming every project uses 16 px.

The arithmetic is straightforward, but the unit names hide different kinds of relativity. Knowing which values are fixed CSS ratios and which depend on font context prevents a conversion from changing layout behavior.

## What this tool is for

Use the converter when a design specification provides one unit and your stylesheet uses another. Common examples include translating a point-based print measurement into pixels, converting centimetres for a layout mock-up, or changing a pixel spacing value to rem.

It is also useful for checking the reference ratios. One point is 96/72 px, one pica is 16 px, and one inch is 96 px under CSS's fixed definition. Seeing those values together helps explain why physical-looking units do not measure the device itself.

The tool does not resize a design, calculate responsive breakpoints or choose a unit for you. It converts a number under a declared font-size assumption; layout suitability remains a separate decision.

## Controls and defaults

**Value** starts at `16`. It is a numeric field with a range of `-10000` to `10000` and a step of `0.01`. **From unit** starts at `px`, while **To unit** starts at `rem`.

Both unit menus contain the same eight choices: `px`, `rem`, `em`, `pt`, `pc`, `cm`, `mm` and `in`. Enter the number without a suffix and choose the units separately.

**Root font size (px)** starts at `16` and accepts `1` to `100` in steps of `0.1`. **Convert unit** runs the calculation; automatic running also refreshes the result after input changes. **Reset** restores all four defaults.

There is no separate parent font-size control for em. That simplification is useful for rem work but needs an explicit mental adjustment for nested em values.

## Worked example

Keep the default `16`, `px` and `rem` values with a root size of `16`. The result is:

```text
1rem
```

Change the value to `24` and the result becomes `1.5rem`. Raise **Root font size (px)** to `20` without changing the input, and the same 24 px becomes `1.2rem`. This demonstrates why a rem conversion is only meaningful alongside its root assumption.

Try `12` points to pixels: the result is `16px`. One inch to pixels returns `96px`, while `2.54` centimetres to inches returns exactly `1in` after rounding.

<figure>
  <img src="/assets/img/blog/css-unit-converter/example.svg" alt="Examples converting 24 pixels to rem at 16 and 20 pixel root sizes" width="1200" height="675" loading="lazy">
  <figcaption>The same 24 px spacing becomes 1.5rem with a 16 px root and 1.2rem when the declared root increases to 20 px.</figcaption>
</figure>

## Output and formats

The output pane is titled **Converted value** and contains a single number immediately followed by the target unit. There is no space, comparison table or conversion formula in the result.

Results are rounded to six decimal places, with trailing zeroes removed. **Copy** copies that line, and **Download** saves it as a `.txt` file. The status reads **Converted** after a successful calculation.

If a selected unit is unavailable to the operation, it reports `Choose valid units.` The supplied menus normally prevent that state, but the message is part of the tool's validation boundary.

## Limits and edge cases

Absolute units use fixed CSS reference ratios: 96 px per inch, 96/72 px per point, 16 px per pica, 96/2.54 px per centimetre and 96/25.4 px per millimetre. They are not based on screen DPI or a physical measurement.

Keep those reference ratios in mind when a conversion appears too convenient. For example, 12 points becoming 16 px is exact under the CSS definition, while a 10 px border becoming 0.104167 inches is rounded at the sixth decimal. The output is a CSS length, not a measurement certificate.

Both rem and em use the same root-size multiplier here. Real rem refers to the root element's font size, while em refers to the current element's computed font size. A nested `1.5em` inside an already enlarged parent therefore requires more context than this page can represent.

Percentages, viewport units, font-relative keyword units and expressions such as `calc()` are unsupported. Negative values are allowed because margins and positioning can legitimately use them. Blank or out-of-range numeric entries are not comprehensively checked by the operation itself, so review the displayed result rather than relying only on input-field limits.

## Common mistakes

Do not change every pixel value to rem without considering the design system. Fixed borders, media queries, device-specific dimensions and root-sized typography may have different needs from component spacing.

Do not treat em as another name for rem. Convert nested em values from the actual computed context, not automatically from the root. Do not use physical CSS units as proof of print accuracy; test the target browser and output medium.

Finally, keep the root-size assumption in comments or design documentation when a converted value looks surprising. A bare `1.2rem` tells the next developer nothing about the 20 px root used to derive it.

## Browser and privacy

All arithmetic happens locally in the page. No value, project name or design measurement is uploaded, and there is no account requirement.

The data is low sensitivity in most cases, but internal layout specifications can still reveal product work. Reset a shared browser after use and avoid copying confidential dimensions into documents or clipboard histories that sync outside your device.

## A practical workflow

Decide which units the destination stylesheet uses and record the root-size assumption. Enter a value, choose the source and target units, then compare the result with a nearby design measurement.

For responsive work, test at the actual root sizes and zoom settings your users need. For em, calculate from the element's computed font context. For print, render through the real browser or PDF path before trusting the reference conversion.

<figure>
  <img src="/assets/img/blog/css-unit-converter/workflow.svg" alt="Workflow from design measurement through unit conversion and font context review to responsive testing" width="1200" height="675" loading="lazy">
  <figcaption>A converted length becomes reliable only after its root size, font context and target rendering conditions are checked.</figcaption>
</figure>

## Preflight checklist

- Enter a number only and select both units explicitly.
- Confirm the root font size before converting rem or em.
- Treat nested em values as context-dependent arithmetic.
- Check the six-decimal result for the precision your layout needs.
- Test responsive sizing, zoom and print output where relevant.
- Keep unsupported percentages and viewport units out of this calculator.
