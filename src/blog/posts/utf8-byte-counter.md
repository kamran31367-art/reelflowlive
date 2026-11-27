---
title: "UTF-8 Byte Counter: characters, code points and bytes explained"
description: "Measure exact UTF-8 bytes, Unicode code points, UTF-16 units and words, with a Café and emoji example and a clear explanation of what each count means."
date: 2026-11-27
categories:
  - Text
cover: assets/img/blog/utf8-byte-counter/hero.svg
coverAlt: "Comparison diagram showing one visible text sample measured as bytes, code points, UTF-16 units and words"
coverCaption: "A byte counter answers a storage question, not a visual one: accented letters and emoji can make the numbers diverge."
takeaways:
  - "The default Hello, world! 🌍 sample counts as 18 UTF-8 bytes, 15 Unicode code points, 16 UTF-16 units and two words."
  - "Café 🌍 uses 10 UTF-8 bytes and six code points, while its seven UTF-16 units reveal the emoji's surrogate pair."
  - "Unicode characters means code points here, not grapheme clusters, so a combining accent and a family emoji need careful interpretation."
  - "Spaces and line breaks are included in the character and byte totals; only the word count treats whitespace as a divider."
  - "Statistics update automatically, and Copy or Download saves the count report rather than the original text."
faq:
  - q: "Why is the byte count higher than the Unicode character count?"
    a: "UTF-8 uses one to four bytes for a code point. ASCII letters usually take one byte, many accented letters take two, and the globe emoji takes four. The character metric counts Unicode code points, so a single emoji can add one character but four bytes."
  - q: "Does Unicode characters count what a reader sees?"
    a: "Not always. It counts code points. A letter with a separate combining accent contains two code points but may look like one glyph, and a joined family emoji contains several code points. Use a grapheme-aware counter when the limit is defined in visible characters."
  - q: "Are spaces and line breaks included?"
    a: "Yes. They contribute to UTF-8 bytes, Unicode characters and UTF-16 units. A line feed normally contributes one byte and one code point; a Windows CRLF line ending contributes two of each. The word count splits on whitespace instead."
  - q: "Can I upload a text file to count it?"
    a: "No. This page accepts pasted or typed text only. Open the file in a text editor, copy its contents into the field, and remember that the editor may normalise line endings or omit a byte-order mark."
draft: false
---

A field can reject text even when it looks short. The reason is often a mismatch between units: a platform counts bytes, a developer counts code points, and a reader sees combined symbols. The [UTF-8 Byte Counter](/utf8-byte-counter/) reports four measurements from the same text so you can identify the unit that matters before publishing, testing or storing it.

The page is intentionally small: one text area, live statistics and a copyable report. Its value comes from making those differences visible rather than guessing from the length of a string.

## What the counter measures

The tool uses the browser's UTF-8 encoder to calculate the exact number of bytes it would produce. That is the relevant number for storage, transmission and fields whose specifications are written in bytes.

It also reports **Unicode characters**, implemented as Unicode code points, and **JavaScript UTF-16 units**, the smaller units used internally by JavaScript strings. These are not interchangeable with visible glyphs. A code point outside the Basic Multilingual range normally occupies two UTF-16 units, while combining sequences can contain multiple code points for one visible character.

The fourth metric is a whitespace-based word count. It is useful context, but it is not a language-aware tokeniser: hyphenated terms and punctuation remain attached to words.

## Controls and defaults

The only input is the **Text** textarea, which opens with `Hello, world! 🌍` and six visible rows. Replace the sample with the exact value you plan to use, including spaces, punctuation and line breaks.

Statistics recalculate automatically after a short pause while you type or paste. The **Count bytes** button also runs the calculation, which is useful if you want an explicit refresh. **Reset** restores the sample, while **Copy** and **Download** act on the generated report.

There is no formatting toolbar, file picker, encoding selector or length target. UTF-8 is fixed because it is the measurement this page is designed to provide.

## Worked example: Café and an emoji

Enter `Café 🌍`, using the single precomposed character `é`. The report reads:

- **UTF-8 bytes: 10**
- **Unicode characters: 6**
- **JavaScript UTF-16 units: 7**
- **Words: 2**

`C`, `a` and `f` each use one byte. The space uses one. The accented `é` uses two, and the globe emoji uses four, giving ten bytes altogether. There are six code points because the accented letter and emoji each count once. The UTF-16 total is seven because the emoji is represented by a surrogate pair.

<figure>
  <img src="/assets/img/blog/utf8-byte-counter/example.svg" alt="Worked count for Café with a globe emoji showing ten UTF-8 bytes, six code points, seven UTF-16 units and two words" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: Café 🌍 produces 10 bytes, six code points, seven UTF-16 units and two whitespace-delimited words.</figcaption>
</figure>

## Reading the four values correctly

Start with **UTF-8 bytes** when a database column, API payload or form specifies a byte limit. This is the only metric here that directly answers how many encoded bytes the text occupies.

Use **Unicode characters** for a rough code-point count, not as a promise of visible length. If `e` is followed by a separate combining acute accent, the decomposed form of Café 🌍 contains seven code points and eleven UTF-8 bytes. It can look identical to the precomposed version while producing different counts. Unicode normalisation can reconcile those forms when an application requires it.

**JavaScript UTF-16 units** is mainly a programming diagnostic. It helps explain why `text.length` may disagree with a byte counter or code-point loop. Readers should not normally plan copy around it.

**Words** splits the trimmed text on one or more whitespace characters. Multiple spaces do not create extra words, but punctuation stays attached, so `word,` remains one token.

## Limits and edge cases

There is no configured character maximum, but practical limits depend on the browser and available memory. Very large pastes can make counting and rendering slow. If you need to measure a large export, work with a representative sample first and then count the full text in a suitable development environment.

The counter includes everything in the textarea. A leading byte-order mark, if present, counts as its encoded bytes. Tabs, ordinary spaces and line breaks also count. A trailing newline is easy to miss visually but still changes the totals.

Emoji deserve special care. A skin-tone modifier, variation selector, zero-width joiner or regional indicator may add code points and bytes even when the result appears as one picture. This page does not provide a grapheme-cluster total, so do not use its character number as a substitute for a platform's visible-character rules.

## Output, download and browser privacy

The result is a four-line plain-text report using the labels **UTF-8 bytes**, **Unicode characters**, **JavaScript UTF-16 units** and **Words**. **Copy** copies that report. **Download** saves it as a `.txt` file; it does not export the text you measured.

All counting runs in the page with browser APIs. The tool does not upload the entered text or save it to browser storage. Reloading, resetting or closing the tab clears the working input. A report you copy or download remains your responsibility, although it contains counts rather than the original wording.

## Common mistakes

Do not compare a byte total with a limit stated in characters. Check the specification first. A 280-character allowance and a 280-byte allowance can accept very different amounts of emoji or accented text.

Do not assume the **Unicode characters** figure equals the number of glyphs. Combining marks and joined emoji break that assumption. Likewise, do not use JavaScript string length as a universal character count; that is why the UTF-16 metric is shown separately.

Whitespace is another frequent oversight. A neat-looking list may contain trailing spaces or a final line break, and those bytes count. Finally, remember that Download saves the statistics, not a cleaned or normalised copy of your draft.

## A practical measuring workflow

Measure the final string, not an earlier draft. If a system stores both the original and a normalised version, count the exact representation that will be stored or sent.

<figure>
  <img src="/assets/img/blog/utf8-byte-counter/workflow.svg" alt="Workflow showing final text pasted into the counter, unit selection, live count review and a limit check before export" width="1200" height="675" loading="lazy">
  <figcaption>Workflow: measure the final value, identify the required unit, compare like with like, then copy the report for the handoff.</figcaption>
</figure>

When the byte count is close to a limit, use the [UTF-8 Encoder and Decoder](/utf8-encoder-decoder/) to inspect the actual sequence. For editorial trimming, move the text into the [Simple Online Text Editor](/simple-text-editor/), but return here for the final measurement after every edit.

## Final checklist

- Confirm whether the destination limit uses bytes, code points, UTF-16 units or visible characters.
- Include all spaces, punctuation and line breaks in the measured value.
- Inspect emoji and combining sequences when counts look unexpectedly high.
- Compare the UTF-8 total directly with any byte-based allowance.
- Keep a small margin if later processing may add a prefix, suffix or delimiter.
- Copy or download the report before resetting the page.
- Measure again after normalisation, trimming or any other final transformation.
