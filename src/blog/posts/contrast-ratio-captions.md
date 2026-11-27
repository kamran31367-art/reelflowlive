---
title: "Contrast ratios: why captions vanish in daylight"
description: "WCAG asks for 4.5:1 on normal text and 7:1 for AAA. Here is what that means for thumbnails, captions and captions burned into video."
date: 2026-11-27
categories:
  - Accessibility
  - Design
draft: false
---

Text that reads fine on a desktop monitor can disappear on a phone held outdoors. Contrast is the measurable part of that problem, and it has agreed minimums: 4.5:1 for normal text under WCAG AA, 7:1 for AAA, and 3:1 for large text.

## What the ratio means

Contrast ratio compares the luminance of the text colour with its background, from 1:1 (identical) to 21:1 (black on white). It is a simple calculation, but doing it by eye is unreliable - mid-tones fool human perception in both directions.

The practical thresholds:

- **Normal text:** 4.5:1 for AA, 7:1 for AAA.
- **Large text** (about 18.66 px bold or 24 px regular): 3:1 for AA, 4.5:1 for AAA.
- **UI borders and icons** that carry meaning: 3:1.

## Where creators meet contrast

- **Thumbnails and covers** with text over a photo. A white word over a bright sky fails; the same word with a dark plate or a strong outline passes.
- **Captions burned into video.** The subtitle sits on a moving background, so the worst frame decides readability. A solid or semi-solid background bar fixes it.
- **On-screen lower thirds** over busy footage.
- **Link text in descriptions and articles**, where grey-on-grey looks modern and reads badly.

Many viewers watch in daylight, at low brightness, on a screen smaller than yours. A comfortable margin above the minimum is better than a bare pass.

## Checking a pair

The [Color Contrast Checker](/color-contrast-checker/) takes a text colour and a background colour - pickers or hex values - and shows the ratio, the AA and AAA pass or fail for both normal and large text, and a live readable preview. It is the fastest way to settle an argument about a shade of grey.

## Small habits that raise contrast

- Use pure white or near-black instead of two mid-tones.
- Add a plate, a scrim or an outline instead of lightening the text over a photo.
- Test the worst frame of a video, not the calmest one.
- Do not rely on colour alone to carry meaning; pair it with shape or weight.
