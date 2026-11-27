---
title: "OKLCH colour conversion: from HEX to perceptually spaced CSS"
description: "Convert HEX, RGB, HSL and OKLCH locally, understand the copy and preview behavior, and account for alpha, gamut and rounding limits."
date: 2026-11-27
draft: false
categories:
  - Developer
cover: assets/img/blog/oklch-color-converter/hero.svg
coverAlt: "Illustration of one colour swatch with HEX, RGB, HSL and OKLCH labels"
coverCaption: "Each notation describes a colour differently; conversion also exposes rounding and gamut boundaries."
takeaways:
  - "The default #2563eb input produces HEX, RGB, HSL and OKLCH values with a local swatch."
  - "Preferred output changes the visible text and downloaded value, but Copy still copies all four formats."
  - "The converter passes colours through 8-bit sRGB, so alpha and wide-gamut detail are not preserved."
  - "Out-of-gamut OKLCH channels are clamped when converted to RGB, which can change the colour you intended."
  - "Malformed text can fall back to black, so confirm the swatch and input instead of trusting every result."
faq:
  - q: "Why does an OKLCH colour change after conversion?"
    a: "The tool converts OKLCH to rounded 8-bit sRGB, then derives all four output lines from that RGB value. Gamut clipping and integer channel rounding mean an OKLCH round trip is not lossless, especially near the edge of the sRGB gamut."
  - q: "Does Preferred output control the Copy button?"
    a: "No. Selecting OKLCH, HEX, RGB or HSL changes the visible text result and the value saved by Download. The preview still shows the swatch and all four lines, and Copy uses the complete four-format text."
  - q: "Can I convert a colour with transparency?"
    a: "Alpha is not represented in the output. An rgba() or hsla() input can be reduced to its RGB channels, and an OKLCH value with a slash alpha component does not match the supported parser pattern. Treat the result as an opaque colour."
  - q: "Is conversion performed online?"
    a: "No. Parsing, matrix conversion, rounding and the swatch run in the browser. The colour text is not uploaded, although the copied value remains available to your clipboard and any applications that can read it."
---

Colour tokens often arrive in the notation used by a design file, a legacy stylesheet or a CSS framework. The [OKLCH Color Picker and Converter](/oklch-color-converter/) puts HEX, RGB, HSL and OKLCH side by side so you can move a value between those formats without leaving the tab.

It is most useful for ordinary opaque sRGB colours. The conversion path also explains why a mathematically valid OKLCH value may not survive a trip through older colour formats unchanged.

## What this tool is for

Use the converter when a brand colour needs a CSS value, a HEX token must be compared with an OKLCH palette, or a component needs the same colour expressed in several notations. The live swatch gives a quick visual check beside the text.

OKLCH is helpful for building palettes because its lightness and hue coordinates support more perceptually even changes than many HSL ramps. This page converts a single colour; it does not generate a palette, calculate contrast or prove that two colours are distinguishable.

The tool works well as a translation aid for existing sRGB assets. It is not a wide-gamut colour manager, nor does it preserve the full precision of an OKLCH design token through a HEX intermediate.

## Controls and defaults

**Colour (HEX, RGB, HSL or OKLCH)** starts with `#2563eb`. The placeholder offers both `#2563eb` and `oklch(62.8% 0.2 264)`. Accepted input includes three- and six-digit HEX, numeric `rgb()` or `rgba()` forms, and `hsl()` or `hsla()` forms, subject to the parser's limited patterns.

**Preferred output** starts at **All formats**. Its other choices are **OKLCH**, **HEX**, **RGB** and **HSL**. The **Convert colour** button runs the operation, and automatic running updates the result after a short pause when the input or selection changes.

**Reset** returns to the default blue and All formats. There is no colour picker, alpha slider, gamut selector or precision setting; the colour itself is entered as text.

## Worked example

Replace the default with pure red and choose **All formats**:

```text
Colour: #ff0000
```

The result shows:

```text
HEX: #ff0000
RGB: rgb(255, 0, 0)
HSL: hsl(0 100% 50%)
OKLCH: oklch(62.80% 0.2577 29.23)
```

Red is a useful check because the RGB channels are unambiguous. The OKLCH line is calculated from those rounded channels, with lightness and hue shown to two decimal places and chroma to four.

<figure>
  <img src="/assets/img/blog/oklch-color-converter/example.svg" alt="Pure red converted into HEX, RGB, HSL and OKLCH values beside a red swatch" width="1200" height="675" loading="lazy">
  <figcaption>The #ff0000 example resolves to full red channels, HSL 0 degrees at full saturation and lightness, and OKLCH 62.80% lightness.</figcaption>
</figure>

Switch Preferred output to **HEX** and the text pane narrows to the HEX line. The preview continues to list every format, and **Copy** still takes the full set. That difference is easy to miss if you expect every output control to follow the selector.

## Output and formats

The output heading is **Colour conversions**. The preview combines a swatch with four labelled lines. RGB uses comma-separated integer channels, HSL uses space-separated values, and OKLCH uses percentage lightness followed by chroma and hue.

**Copy** always copies all four lines. **Download** saves a `.txt` file containing the selected text: all formats by default, or the single chosen format. There is no CSS-file download, variable declaration or JSON token output.

After a successful conversion the status reads **Complete**. The operation has no dedicated invalid-colour message, which makes the edge cases below especially important.

When documenting a converted token, retain the source notation and the destination notation together. A note such as `source #ff0000; target oklch(...)` is more useful during a later audit than an unexplained OKLCH string, particularly when rounding or gamut clipping affected the result.

## Limits and edge cases

Every supported input is converted to rounded 8-bit RGB before the output formats are calculated. This discards alpha, reduces continuous OKLCH values to integer channels and restricts the result to sRGB. Very saturated OKLCH colours can fall outside that gamut and be clamped channel by channel.

The OKLCH parser accepts a narrow numeric form with optional percentage lightness or chroma and an optional `deg` suffix. It does not support slash alpha, negative components, `turn`, `rad` or other CSS colour syntax. HEX with four or eight digits is also unsupported.

RGB and HSL parsing is permissive rather than validating. Values outside normal channel ranges may be printed, while HEX conversion clamps them. A malformed string can reach the HEX fallback and become black. Always compare the swatch with the source colour before using a result in a token file.

## Common mistakes

Do not use a HEX round trip as a precision-preserving OKLCH workflow. If the design system needs the original OKLCH coordinates, retain them as the source of truth and use converted values only for legacy contexts.

Do not assume `rgba()` transparency survives; the alpha channel is ignored. Do not assume the preferred-format selector limits Copy to that line. And do not treat a plausible-looking result as validation, because invalid text may fall back to black rather than fail loudly.

For accessibility work, conversion is not a contrast check. Evaluate the actual foreground and background colours with a contrast tool and test the rendered interface, including focus and disabled states.

## Browser and privacy

Colour parsing and conversion run locally in the page. No account or upload is involved, so internal brand tokens can be inspected without sending them to a remote converter.

The output is still ordinary text. Copying it can expose it through clipboard history or synchronization, and a downloaded file can be read by anyone with access to the device. Colour values are usually low sensitivity, but unreleased campaign or product details deserve the same care as other project material.

## A practical workflow

Start with the source notation and confirm its swatch before converting. Choose the format required by the destination, then copy or download while remembering that Copy includes every format.

For a design-token pipeline, preserve the original value, record any gamut clipping and test the colour in the target browser. Use the converted HEX or RGB value as an interoperability fallback, not as evidence that the original OKLCH colour was reproduced exactly.

<figure>
  <img src="/assets/img/blog/oklch-color-converter/workflow.svg" alt="Workflow from source colour through swatch verification and format conversion to tested CSS tokens" width="1200" height="675" loading="lazy">
  <figcaption>A reliable conversion keeps the source value, checks the swatch and verifies gamut and rendering in the destination browser.</figcaption>
</figure>

## Preflight checklist

- Confirm the input notation matches one of the supported patterns.
- Check the swatch before copying any value.
- Preserve alpha and original OKLCH precision outside this tool.
- Select the required format for Download, knowing Copy returns all four.
- Test wide-gamut colours for clipping in the target browser.
- Run a separate contrast check for accessible text and controls.
