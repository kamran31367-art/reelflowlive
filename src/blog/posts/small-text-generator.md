---
title: "Small Text Generator: superscript, subscript and full-width Unicode"
description: "Compare ReelFlow's three small-text styles, see exact Ab12 outputs, and learn which letters, digits and punctuation change or remain unchanged in each Unicode mode."
date: 2026-11-27
draft: false
categories:
  - Text
cover: assets/img/blog/small-text-generator/hero.svg
coverAlt: "Small Text Generator guide cover with the tool title on a dark mint gradient"
coverCaption: "Small-looking text is still text, with all the usual copying and compatibility questions."
takeaways:
  - "Superscript small and Subscript small lowercase the input before mapping supported Latin letters."
  - "Full-width small preserves case and converts printable ASCII from exclamation mark through tilde into wide Unicode forms."
  - "Digits and punctuation remain unchanged in superscript and subscript modes, while full-width mode converts many of them."
  - "Subscript mode has no true subscript glyph for b, c, d, f, g, q, w, y or z, so those letters stay ordinary lowercase."
  - "The output is Unicode plain text, not a smaller font, HTML tag or guarantee that every app will render it accessibly."
faq:
  - q: "Does this reduce the font size in my document?"
    a: "No. It substitutes Unicode characters that look small or wide. The receiving app controls the actual font size. To change text size in a document, use that app's formatting controls instead."
  - q: "Why are uppercase letters lowercase in superscript and subscript output?"
    a: "Those two modes deliberately lowercase the entire input before mapping letters. Full-width mode does not lowercase text. Keep the original wording if letter case carries meaning."
  - q: "Why do some subscript letters look normal?"
    a: "The built-in map has no dedicated subscript form for b, c, d, f, g, q, w, y or z. Those characters pass through as ordinary lowercase letters, producing a mixed-style result rather than a complete subscript alphabet."
  - q: "Can I paste the result into any username or social bio?"
    a: "You can try, but acceptance is not guaranteed. Platforms may reject Unicode lookalikes, count them differently or display them inconsistently. Check the destination's rules and preview the final text there."
---
A short label sometimes needs a compact visual treatment without opening a design app. The [Small Text Generator](/small-text-generator/) offers three Unicode styles that can make text look superscript, subscript or unusually wide.

The result is not a font setting. It is a sequence of substituted characters, which means copying is easy but rendering, search and accessibility still need a quick check.

## The three styles

**Superscript small** maps supported lowercase Latin letters to small raised characters. **Subscript small** maps a smaller set to low characters. **Full-width small** converts many printable ASCII characters into full-width Unicode forms that occupy a wider visual space.

Despite the shared label, full-width text is not simply reduced-size text. It is a different character set with wider glyphs. Choose it for a visual effect, not because it saves space.

The tool starts with `Small but powerful` and Superscript small. It updates automatically after about 180 milliseconds, so editing the text or changing the style refreshes the output.

## Controls and output

The **Text** area accepts the wording, and the **Style** menu selects Superscript small, Subscript small or Full-width small. **Generate small text** runs the conversion immediately; **Reset** restores the default wording and superscript mode.

The result appears as plain Unicode text. **Copy** places it on the clipboard, and **Download** saves a UTF-8 `.txt` file named `small-text-generator.txt`.

There is no font selector, size slider, colour option or HTML export. Any visual size beyond the Unicode glyphs themselves must be applied in the destination editor.

<figure>
  <img src="/assets/img/blog/small-text-generator/workflow.svg" alt="Small Text Generator workflow showing text and style settings leading to local Unicode conversion" width="1200" height="675" loading="lazy">
  <figcaption>The browser substitutes characters according to the selected style, then returns plain text for copying or download.</figcaption>
</figure>

## Worked example: Ab12

The short input `Ab12` makes the differences easy to compare.

With **Superscript small**, the text is lowercased and the letters are substituted, while the digits remain ordinary:

```text
ᵃᵇ12
```

With **Subscript small**, A maps to a subscript a, but b has no dedicated subscript mapping in this tool and stays lowercase:

```text
ₐb12
```

With **Full-width small**, case is preserved and the letters and digits become full-width forms:

```text
Ａｂ１２
```

This example shows why the styles are not interchangeable. Superscript and subscript change case and leave digits alone; full-width preserves case but changes digits.

<figure>
  <img src="/assets/img/blog/small-text-generator/example.svg" alt="Small Text Generator worked example panel showing the default text and superscript style" width="1200" height="675" loading="lazy">
  <figcaption>The default example uses Superscript small; the Ab12 comparison above demonstrates all three style rules side by side.</figcaption>
</figure>

## What changes in each mode

Superscript mode maps all 26 lowercase Latin letters. One entry deserves a note: q maps to `ᑫ`, a Canadian Aboriginal syllabics character used as a visual q-like form rather than a conventional superscript q. Its appearance and pronunciation support can vary.

Subscript mode maps only part of the alphabet. The letters b, c, d, f, g, q, w, y and z remain ordinary lowercase. A word containing several of them will look only partly subscript.

Both superscript and subscript modes lowercase every character before mapping. Uppercase acronyms and product names therefore lose their capitalisation. Digits, spaces and punctuation pass through unchanged. Characters without a letter mapping are not substituted, but they still pass through the lowercasing step, so an unsupported uppercase letter can change case.

Line breaks and tabs remain in place in all three styles. That makes a short multi-line label possible, but it does not turn the output into structured formatting. The converter has no paragraph, heading or list awareness; it processes the characters exactly as pasted.

## Full-width rules and limits

Full-width conversion applies to printable ASCII characters from `!` through `~`. That includes uppercase and lowercase letters, digits and punctuation. For example, `Ab12!` becomes `Ａｂ１２！`.

A normal space is not converted, because it sits below that printable range. Tabs, line breaks, emoji, accented letters and characters from other scripts remain unchanged. The result can therefore mix full-width ASCII with ordinary-width text.

The converter does not measure whether the output still fits a field. Wide glyphs may take more visual room even when a platform counts each Unicode character as one. Test the actual destination when space is tight.

## Output and compatibility

Copy and Download preserve the Unicode characters, not the appearance of this page. A font with complete mathematical and full-width support will usually render the forms clearly; a limited font may show fallback glyphs or missing-character boxes.

Screen readers and search tools may treat substituted letters differently from ordinary text. A stylized heading can be harder to search, index or read aloud. Keep essential information in standard wording, and use decorative text as a secondary treatment.

The `.txt` download is useful for moving a result between devices, but it cannot supply fonts or override an app's normalization rules. There is no reverse mode that reliably restores the original casing and characters.

## Common mistakes

Do not expect Subscript small to produce a complete mathematical alphabet. If a label contains b, d or z, inspect the mixed output before publishing. For formulas, use a notation system or equation editor that supports real semantic structure instead.

Do not treat Full-width small as a space-saving style. Its purpose is a wide visual effect. Also avoid relying on the converted text for usernames, passwords or exact identifiers unless the destination explicitly accepts it.

A final mistake is assuming that a copied preview proves portability. Paste the result into the final app and check it on the device your audience uses, especially for bios, captions and overlays.

## Browser and privacy

Conversion runs locally in the browser. The tool does not upload the input text or require an account, and it has no file-import step. Clipboard and file creation happen only when you press Copy or Download.

The current text is held in the open page rather than saved as a style history. Refresh or Reset replaces it, so keep the standard version of important wording elsewhere.

## A practical styling workflow

1. Decide whether you need raised, lowered or wide characters before choosing a style.
2. Enter a short sample and compare all three modes.
3. Check capitals, digits and punctuation against the original.
4. Look specifically for ordinary letters left in a subscript result.
5. Copy the chosen output into the destination editor.
6. Preview it on desktop and mobile, then read it without visual styling.
7. Keep an unstyled version for accessibility, search and later edits.

Use the generator for presentation, not for changing the meaning of the words. The best result still reads correctly when the font falls back.
