---
title: "Contrast ratios: why captions vanish in daylight"
description: "WCAG asks 4.5:1 for normal text and 7:1 for AAA. Here is what the four grades on the checker mean, why mid-greys fool the eye, and how to fix a caption that passes on a monitor but disappears outdoors."
date: 2026-11-27
categories:
  - Accessibility
  - Design
cover: assets/img/blog/contrast-ratio-captions/hero.webp
coverAlt: "A hand holding a phone against a bright sunset, the screen washed out by the sun"
coverCaption: "On a screen held against the sun there is no margin left for a weak pair of colours."
takeaways:
  - "WCAG asks 4.5:1 for normal text and 7:1 for AAA; large text gets 3:1 and 4.5:1."
  - "The checker grades normal and large text separately, so a caption can fail while a headline passes."
  - "Mid-greys are the usual trap: #9ca3af on white measures 2.54:1 and still looks fine on a desktop monitor."
  - "White on a saturated brand blue often lands near 5:1 - an AA pass and an AAA fail side by side."
  - "A plate, scrim or outline fixes a failing pair faster than lightening the text."
  - "Sample the worst frame of a video, not the calmest one."
faq:
  - q: "Does a 4.5:1 pass mean the text will be readable?"
    a: "It means the pair clears the WCAG AA floor for normal text. Readability also depends on font size, weight, rendering and the ambient light of the viewer. A thin 14 px font at exactly 4.5:1 is harder to read than a bold 16 px font at 6:1. Treat 4.5:1 as the minimum and aim higher for anything small, thin or watched outdoors."
  - q: "Why does my caption pass the checker but still look lost on the video?"
    a: "The checker compares one text colour with one background colour. Burnt-in captions sit on a moving background, so the frame behind the words changes every second, and the worst frame decides readability. Sample the brightest or busiest frame, not the calmest one, and add a solid or semi-solid background bar when the background cannot be controlled."
  - q: "What about APCA, the newer contrast method?"
    a: "APCA is the draft algorithm for WCAG 3 and it weighs text size and weight more heavily than the 2.x ratio. Most platform rules, accessibility audits and design checklists today still quote the WCAG 2.x numbers, and this checker implements exactly those: relative luminance, 4.5:1, 7:1, 3:1. If a client or a platform asks for WCAG AA, use the 2.x figures shown here."
  - q: "Can I check the colours of my own thumbnail or video frame?"
    a: "The checker takes two colours, not an image. Download the thumbnail with the thumbnail downloader, or grab a frame with the video frame grabber, then read the hex values of the text and the background from any colour picker, including the two pickers built into the checker. Paste those two values and the ratio follows. For a video, repeat the reading on the frame where the background is at its brightest."
---

Text that reads fine on a desktop monitor can disappear on a phone held outdoors. Contrast is the measurable part of that problem, and it has agreed minimums: 4.5:1 for normal text under WCAG AA, 7:1 for AAA, and 3:1 for large text. The [Color Contrast Checker](/color-contrast-checker/) takes two colours and returns the ratio plus all four grades at once, which is usually enough to settle a shade-of-grey argument in ten seconds.

This guide explains what the number is actually measuring, where video creators meet it, and what to do when a caption fails.

<figure>
  <img src="/assets/img/blog/contrast-ratio-captions/swatches.webp" alt="A fan of printed colour swatches spreading across a desk" width="1200" height="802" loading="lazy">
  <figcaption>Two colours can look clearly different and still measure 2:1. The eye is a poor judge of luminance.</figcaption>
</figure>

## What the ratio measures

Contrast ratio compares the luminance of the text colour with the luminance of its background, on a scale from 1:1 (identical) to 21:1 (black on white). Luminance is not brightness as perceived; it is calculated from the red, green and blue channels with the WCAG relative luminance formula, weighting green most heavily because the eye is most sensitive to it.

That calculation is why colour judgement by eye is unreliable. A warm grey and a cool grey with the same lightness measure the same ratio even though they feel different, and two mid-tones that look clearly distinct can sit at 1.5:1. The practical thresholds:

- **Normal text:** 4.5:1 for AA, 7:1 for AAA.
- **Large text** (about 18.66 px bold or 24 px regular): 3:1 for AA, 4.5:1 for AAA.
- **UI borders and icons** that carry meaning: 3:1.

## Reading the four badges

The checker grades normal and large text separately, because they have different minimums. A pair can pass one and fail another, and both facts matter.

<figure>
  <img src="/assets/img/blog/contrast-ratio-captions/tool.webp" alt="The Color Contrast Checker showing white text on blue at 5.17 to 1, passing AA for normal and large text but failing AAA for normal text" width="1120" height="432" loading="lazy">
  <figcaption>A real run: white on #2563eb measures 5.17:1. AA passes for both sizes, AAA normal fails at the 7:1 line, and the 24 px preview shows why large text gets an easier target.</figcaption>
</figure>

White on that blue is the common case of a brand colour that almost works. It is comfortable at headline size, acceptable for captions under AA, and short of AAA for body text. Seeing the four grades side by side stops the usual shortcut of checking only the one grade that happens to pass.

The preview box under the badges shows the same pair at 16 px normal and 24 px bold, so you can read the sample rather than trusting the arithmetic. Change either colour and everything updates live, with no button to press.

## Where creators meet contrast

- **Thumbnails and covers** with text over a photo. A white word over a bright sky fails; the same word with a dark plate or a strong outline passes.
- **Captions burned into video.** The subtitle sits on a moving background, so the worst frame decides readability. A solid or semi-solid background bar fixes it, and the [Thumbnail Safe Zone](/thumbnail-safe-zone/) guide covers where the burn-in should sit so the platform UI does not cover it.
- **On-screen lower thirds** over busy footage.
- **Link text in descriptions and articles**, where grey-on-grey looks modern and reads badly.

Many viewers watch in daylight, at low brightness, on a screen smaller than yours. A comfortable margin above the minimum is better than a bare pass, and it costs nothing to get one: darker text on lighter plates almost always buys a full ratio point.

## The mid-grey trap, measured

The single most common failure on this site's own posts is a grey that looks like a design choice and not a bug. Two readings from the checker:

- `#9ca3af` on white: **2.54:1**. Fails AA for normal text, fails even the 3:1 large-text floor. This is a typical "muted caption" grey.
- `#767676` on white: **4.54:1**. Passes AA normal text, and it is about the lightest grey that does.

The distance between those two swatches looks small. The distance between their ratios is the difference between unreadable in daylight and compliant. If a grey was picked by eye, measure it before it ships.

## Large text is an allowance, not a licence

The 3:1 large-text rule exists because bigger strokes cover more pixels. It does not mean a large caption on a busy frame is safe at 3:1, because the background is doing half the work and it moves. Two habits help:

1. Give burnt-in captions a plate or a scrim rather than relying on the footage behind them. A dark semi-transparent bar under white text is boring and it works.
2. Test the worst frame, not the calmest one. Scrub to the brightest shot in the video and read the caption there.

White text over a bright amber background, for example, measures 2.15:1 - a pair that fails every one of the four grades. It is exactly the combination that looks punchy in the editor and vanishes on a phone in the park.

## Fixing a failing pair without changing the colour

Usually the brand colour is fine and the background is wrong. In order of least visual damage:

- **A plate behind the text.** A solid bar at 80 to 100 percent opacity removes the background from the calculation entirely.
- **A scrim or gradient.** Partially darkening the footage under the caption keeps the image visible and lifts the ratio.
- **An outline or shadow.** Cheap on thumbnails, weaker on moving video because the contrast flickers frame to frame.
- **More weight, slightly larger type.** Helps a little; it does not replace a ratio fix.

Changing the text colour is the last lever, because a brand colour that fails is still the brand colour. The checker has a swap button for testing whether the pair works the other way round, and a reset button that returns both inputs to their defaults.

## Where the checker stops

It compares two flat colours. It does not sample an image, simulate colour blindness, or know about APCA, the draft WCAG 3 algorithm. It also cannot see what compression does: a subtle pair that measures 4.6:1 can be softened across a block boundary by a heavy video compressor until the edge of the letters smears. If a pair is a marginal pass, treat it as a fail and buy margin.

For checking an existing thumbnail or frame, pull the image first - the [thumbnail downloader](/youtube-thumbnail-downloader/) saves cover images and the [video frame grabber](/video-frame-grabber/) exports a still - then read the two hex values with any colour picker and paste them in.

## One thumbnail, two readings

A typical cover has white text over a sunset. The sky is not one colour, so the pair is not one pair. Sample the calm part of the sky and the white might measure 3.8:1; sample the bright band next to the sun and it drops under 2:1. The thumbnail is not "mostly fine" - it is as weak as its weakest patch, because that is the patch where a viewer gives up.

The fix is the same each time. Either move the text off the bright band, or put a plate behind it, and then re-measure both samples. Two readings take under a minute and they describe the actual image rather than its average.

## A short working order

1. Pick the text colour and the background colour you intend to ship.
2. Enter both and read all four badges, not just AA normal.
3. If normal text fails, add a plate before you lighten the text.
4. If it passes at 4.5 to 5.0, take one more step darker or lighter and check again.
5. For video, repeat on the worst frame.

The four numbers are not a design philosophy. They are a floor, and the checker is the ten-second way to know which side of it you are on. Everything above the floor is judgement: [title preview](/title-preview/) for how a headline wraps, the [character counter](/character-counter/) for how long it can be, and a final look at the result on a phone at half brightness, which is still the most honest test there is.