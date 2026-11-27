---
title: "Strikethrough Text Generator: single and double Unicode lines"
description: "Create single or double strikethrough with ReelFlow's Unicode combining marks, see exact Old price output and learn the limits for spaces, emoji, accessibility and portability."
date: 2026-11-27
draft: false
categories:
  - Text
cover: assets/img/blog/strikethrough-text/hero.svg
coverAlt: "Strikethrough Text Generator guide cover with the tool title on a dark indigo gradient"
coverCaption: "A line through text changes its appearance, not its underlying wording."
takeaways:
  - "Single line adds U+0336 after every Unicode code point; Double line adds U+0336 and then U+0335."
  - "The tool applies marks to letters, digits, punctuation, spaces and line breaks rather than only to visible words."
  - "The result is plain Unicode text, not Markdown strikethrough, an HTML element or semantic deletion."
  - "Fonts and destination apps control whether one or two lines render clearly, and some systems may strip combining marks."
  - "Screen readers may still read the underlying text, so this effect must not be used to redact sensitive information."
faq:
  - q: "Is this the same as Markdown or HTML strikethrough?"
    a: "No. It appends Unicode combining stroke characters to the text. There are no tildes, tags or semantic styling instructions. The appearance depends on the app and font that render the characters."
  - q: "Why does a space or line break look strange?"
    a: "Every Unicode code point receives a stroke mark, including whitespace. A combining mark after a space or line break can render as a stray line or attach unexpectedly, so short single-line text is usually safer."
  - q: "Can I use it to hide a password or private detail?"
    a: "No. The original characters remain in the copied or downloaded text and may still be read by assistive technology or recovered from the source. Use an actual redaction process for sensitive information."
  - q: "Does Double line always show two clear lines?"
    a: "Not always. It adds two combining marks, but their placement and visibility depend on the font and rendering engine. Preview the result in the destination before publishing."
---
A line through a phrase can signal an old price, a completed idea or a playful correction. The [Strikethrough Text Generator](/strikethrough-text/) creates that effect with Unicode combining marks so the result can be copied as text.

It does not remove or semantically delete anything. The original characters stay underneath the strokes, which is useful for visual styling but important for accessibility and privacy.

## How Unicode strikethrough works

**Single line** appends U+0336, combining long stroke overlay, after each Unicode code point. **Double line** appends U+0336 followed by U+0335, combining short stroke overlay.

The marks combine with the preceding character when the font and rendering engine support them. Because they are characters rather than a font style, the result travels through ordinary copy and paste.

This also means the effect is not guaranteed. A destination can render one clear line, two overlapping lines, fallback strokes or no visible line at all.

## Controls and output

The **Text** area starts with `Old price: $99`. The **Style** menu offers Single line and Double line. The result updates automatically after about 180 milliseconds, and **Generate strikethrough** runs it immediately.

**Reset** restores the default text and Single line style. **Copy** transfers the decorated string, while **Download** saves a UTF-8 `.txt` file named `strikethrough-text.txt`.

There is no colour, thickness, position or selective-range control. The operation treats the entire input uniformly.

<figure>
  <img src="/assets/img/blog/strikethrough-text/workflow.svg" alt="Strikethrough Text Generator workflow showing text and line style leading to combining marks" width="1200" height="675" loading="lazy">
  <figcaption>The browser appends one or two combining stroke characters to each code point, then returns plain Unicode text.</figcaption>
</figure>

## Worked example: Old price

Enter `Old price` and keep **Single line** selected. The visible result is:

```text
O̶l̶d̶ ̶p̶r̶i̶c̶e̶
```

Written as an inspection diagram, each original character is followed by a mark: `O [U+0336] l [U+0336] d [U+0336]` and so on. The bracketed labels are explanatory and are not part of the tool's output.

With **Double line** selected, each character receives U+0336 and then U+0335. The visual result can resemble:

```text
O̶̵l̶̵d̶̵ ̶̵p̶̵r̶̵i̶̵c̶̵e̶̵
```

The two marks may overlap differently across fonts, so compare the actual output in your destination rather than relying on this rendering.

<figure>
  <img src="/assets/img/blog/strikethrough-text/example.svg" alt="Strikethrough Text Generator worked example panel showing the default text and Single line style" width="1200" height="675" loading="lazy">
  <figcaption>The default settings pair Old price: $99 with Single line; the shorter Old price example above makes each added stroke easier to inspect.</figcaption>
</figure>

## What receives a stroke

The converter iterates over Unicode code points and adds a mark after each one. That includes uppercase and lowercase letters, digits, punctuation and spaces. It is not limited to the visible letters inside words.

Tabs and line breaks also receive marks. A combining mark after a newline can appear as a stray stroke at the start of the next line or interfere with layout. For predictable results, use a short single line and avoid unusual whitespace.

Existing accents and combining sequences are not analysed as complete visual characters. If a letter already has a combining accent, the stroke is appended after the individual code points, which can change mark order or attachment.

## Choose Unicode or editor formatting

Use this generator when the destination is a plain-text field and cannot apply its own strikethrough. The Unicode characters travel with the wording, which is useful for a social caption, message or simple bio.

When a rich-text editor offers native strikethrough, prefer that option for text you expect to edit. Native formatting can usually be removed with one command, whereas these combining marks have no removal control here. Native formatting also lets you select a range instead of striking every character and space in the whole input.

## Output formats and portability

Copy and Download preserve both the original characters and the added combining marks. The `.txt` file is UTF-8 plain text; it contains no font, colour or layout instructions.

Rendering happens in the receiving app. A font with good combining-mark support may draw the strokes neatly, while another may place them too high, too low or not at all. Some platforms may normalise or remove the marks during paste or publishing.

There is no reverse mode. Keep the undecorated wording rather than trying to reconstruct it from the output. Pasting the result into a plain-text field should retain the characters, but it cannot guarantee their appearance.

## Limits and edge cases

The tool has no semantic understanding of the text. It will strike through an entire price, sentence or paragraph with the same rule. It does not distinguish old information from information that should remain legible.

Emoji and other multi-code-point symbols can render unpredictably because a stroke is added after each component. Combining marks may also stack in ways that vary between browsers and operating systems.

Long struck-through passages are harder to read, and the extra code points can affect length calculations or storage. The tool does not check platform limits or warn when a result becomes visually dense. A platform may also count the combining marks differently from the visible letters, so a phrase that fits before styling deserves another check after copying.

## Common mistakes

Do not mistake strikethrough for redaction. The letters, numbers and punctuation remain in the clipboard, downloaded file and page source. Anyone receiving the text may be able to read or recover it.

Another mistake is assuming Markdown syntax is involved. This tool does not output `~~text~~` or `<s>text</s>`. If you paste the Unicode result into a Markdown editor, it remains decorated characters rather than formatting instructions.

Avoid using the effect for instructions, warnings or other content that must be read easily. Also check prices and dates carefully: a stroke does not explain whether a value is obsolete, discounted or replaced.

## Browser and privacy

The combining marks are generated locally in the browser. The tool does not upload the input, use an account or read files. Copy and Download act only when you press them.

The current text is not kept as a saved project history. Reset or refresh replaces it, so retain an ordinary copy of any wording you need to edit later.

## A practical publishing workflow

1. Write the message in ordinary text and confirm that every struck-through value is intentionally obsolete.
2. Use Single line first and keep the phrase short.
3. Try Double line only when the first result is not visually clear enough.
4. Inspect spaces, punctuation and any emoji for stray marks.
5. Copy the result into the actual destination app.
6. Preview it on desktop and mobile, checking that the strokes survive.
7. Keep a plain-text version for accessibility and future edits.

Strikethrough is a visual layer, not deletion. Clear wording around the struck value should tell readers what the current information is.
