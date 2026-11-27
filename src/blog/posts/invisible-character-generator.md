---
title: "Invisible Character Generator: five Unicode marks and four positions"
description: "Use ReelFlow's Invisible Character Generator with zero-width spaces, non-joiners, word joiners, hair spaces and thin spaces, with placement examples and safety checks."
date: 2026-11-27
draft: false
categories:
  - Text
cover: assets/img/blog/invisible-character-generator/hero.svg
coverAlt: "Invisible Character Generator guide cover with the tool title on a dark indigo gradient"
coverCaption: "The visible letters can stay the same while the underlying text changes."
takeaways:
  - "The tool inserts one of five Unicode characters: zero-width space, zero-width non-joiner, word joiner, hair space or thin space."
  - "Position controls place one mark at the start, end or both ends, or insert the mark between every Unicode code point."
  - "Zero-width marks may look unchanged, while hair and thin spaces create small visible gaps."
  - "Copy and Download preserve the hidden characters in a UTF-8 text file, but destination apps may strip or reject them."
  - "There is no remove-invisible-characters mode, code-point viewer or guarantee that a username will accept the result."
faq:
  - q: "Are hair spaces and thin spaces truly invisible?"
    a: "No. They are spacing characters with a small visible width. The zero-width space, zero-width non-joiner and word joiner are intended to avoid adding ordinary width, although their effect on text shaping and line breaks can still be noticeable."
  - q: "Can this make a username unique?"
    a: "It can change the underlying string, but it cannot guarantee availability or acceptance. A platform may trim, normalise or reject invisible characters. Check the platform's rules and test the name in its actual signup or profile field."
  - q: "Why did an emoji or accented letter change unexpectedly?"
    a: "Between characters mode splits the input into Unicode code points, not reader-perceived characters. A multi-code-point emoji or a letter followed by a combining accent can therefore have a mark inserted inside its visual sequence."
  - q: "How do I get the original plain text back?"
    a: "This tool has no removal mode. Start again from the original visible text, or use a code-point-aware cleanup process and inspect the result carefully. Simply deleting adjacent spaces will not reliably remove every supported mark."
---
Two strings can look identical and still behave differently when pasted into a form. The [Invisible Character Generator](/invisible-character-generator/) makes that difference explicit by adding a chosen Unicode mark to visible text.

It is useful for testing whitespace behavior and understanding hidden characters. It is not a privacy tool, an impersonation tool or a promise that a platform will preserve what you paste.

## What counts as invisible here

The **Invisible character** menu offers five choices:

- **Zero-width space:** U+200B, a character commonly used to create an invisible break opportunity.
- **Zero-width non-joiner:** U+200C, intended to prevent adjacent characters from joining in scripts that use contextual joining.
- **Word joiner:** U+2060, intended to prevent a line break at its position.
- **Hair space:** U+200A, a very small visible space.
- **Thin space:** U+2009, another small visible space, normally wider than a hair space.

The first three are usually described as zero-width or non-printing marks. The last two are spacing characters and can be visible. Exact rendering depends on the font, browser and destination.

## Controls and automatic updates

Enter the visible wording in the **Visible text** field, choose a character type, then choose a **Position**. The default is `ReelFlow` with a zero-width space between characters.

This tool updates automatically after a short pause of about 180 milliseconds. Changing either menu also refreshes the result. **Generate invisible text** remains available for an immediate run, and **Reset** restores the default text, character and position.

The output pane looks like ordinary text because the added marks may not draw a glyph. That appearance is not proof that nothing was inserted.

Empty visible text is a useful edge case. Between characters returns an empty string, while At start, At end and At both ends still add their marks. Copy is unavailable for the empty result, but Download can save an empty text file. This follows the shared output handling rather than a special invisible-character rule.

<figure>
  <img src="/assets/img/blog/invisible-character-generator/workflow.svg" alt="Invisible Character Generator workflow from visible text and placement settings to locally generated Unicode output" width="1200" height="675" loading="lazy">
  <figcaption>Choose both the Unicode mark and its position; the browser inserts the characters without uploading the visible text.</figcaption>
</figure>

## The four placement options

**Between characters** inserts the selected mark between every item produced by the text's Unicode code-point sequence. For `AB`, the result is A, the mark, then B.

**At start** adds one mark before the whole string. **At end** adds one after it. **At both ends** adds one at each end. These three options do not insert marks between the letters.

The distinction matters when you are testing a specific field. One leading mark and a fully separated string are different inputs, even if both look unchanged at a glance.

## Worked example: ReelFlow

Keep the default `ReelFlow`, choose **Zero-width space**, and leave **Position** on **Between characters**. Eight visible letters receive seven inserted marks. Written as an inspection diagram rather than copyable output, the sequence is:

```text
R [U+200B] e [U+200B] e [U+200B] l [U+200B]
F [U+200B] l [U+200B] o [U+200B] w
```

The bracketed labels are explanations for this guide; the tool outputs the actual characters without labels or brackets. On screen, the result can appear exactly like `ReelFlow`.

Switch **Position** to **At both ends** and only two marks remain: one before R and one after w. Switch the character to **Thin space** with **Between characters**, and small gaps become visible between the letters.

<figure>
  <img src="/assets/img/blog/invisible-character-generator/example.svg" alt="Invisible Character Generator worked example panel with ReelFlow text and zero-width space selected" width="1200" height="675" loading="lazy">
  <figcaption>The default example combines ReelFlow, a zero-width space and Between characters, inserting seven U+200B marks.</figcaption>
</figure>

## Output and formats

**Copy** transfers the generated string, including its invisible or spacing characters. **Download** saves a UTF-8 `.txt` file named `invisible-character-generator.txt`. The file is plain text; it does not highlight where the marks are.

Copy or download while the result is current. Editing the input refreshes the output, and Reset returns the defaults. There is no format choice for HTML, JSON or escaped code points.

If a copied result appears blank, remember that zero-width marks are still characters. A visually empty field can therefore contain data, which is why destination validation matters.

## Limits and character sequences

The tool inserts marks; it does not detect, count, explain or remove marks already in the input. Existing invisible characters can remain alongside the newly added ones.

Between-character placement uses Unicode code points. That is not always the same as a visible character. An emoji assembled from several code points can be split, and a combining accent attached to a letter can be separated from its base. For text where those sequences matter, prefer start, end or both ends and inspect the destination carefully.

There is also no length or platform check. The tool does not know whether a username allows the mark, whether a database trims it, or whether a form counts it toward a limit. A successful copy is not a successful submission.

## Common mistakes

The most common mistake is assuming that a zero-width result is harmless everywhere. Applications can trim it, normalise it, display it inconsistently or reject it during validation. Always test the final field rather than relying on how the text looks in a document.

Another mistake is using hidden characters to imitate another person or evade a platform restriction. That can mislead readers and violate service rules. Use the generator for legitimate formatting tests, and respect the destination's policies.

Do not use hair or thin spaces when you specifically need zero width. They deliberately add spacing. Likewise, do not expect non-joining or line-breaking behavior to transfer unchanged between scripts, browsers and rendering engines.

## Browser and privacy

All insertion happens locally in the browser. The visible text is not uploaded for processing, and the tool does not need an account or file access. Copy and Download are the only actions that move the generated string elsewhere.

The page does not provide a persistent history for this tool. Refreshing or resetting replaces the working text, so retain the ordinary source wording somewhere safe before experimenting.

## A careful testing workflow

1. Start with short, non-sensitive text and keep an unmodified copy.
2. Choose the exact character required by your formatting test.
3. Use Between characters only when splitting the string is intentional.
4. Paste the result into the actual destination field, not just a rich-text editor.
5. Save, submit or reload as appropriate, then check that the text survived.
6. Inspect suspicious results with a code-point-aware tool such as the [UTF-8 Byte Counter](/utf8-byte-counter/), which can reveal added bytes even when no glyph appears.
7. Return to the original text if the platform changes or rejects the value.

Use the smallest intervention that solves the formatting problem. A normal space is clearer whenever a space is all you need.
