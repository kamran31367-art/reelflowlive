---
title: "Morse Code Translator: Encode, Decode and Keep Word Boundaries Clear"
description: "Translate text to Morse code and back with correct letter, word and unsupported-character handling. Includes worked SOS HELP examples and practical decoding checks."
date: 2026-11-27
categories:
  - Text
cover: assets/img/blog/morse-code-translator/hero.svg
coverAlt: "SOS HELP shown beside its Morse dots, dashes and slash word separator"
coverCaption: "The slash marks a word boundary; it is not a Morse letter."
takeaways:
  - "Text to Morse uppercases supported input and represents each literal space with a slash."
  - "The character table covers A-Z and 0-9; unsupported characters are omitted during encoding."
  - "Morse to text accepts slash separators or three or more spaces between words."
  - "Unknown Morse sequences decode as question marks instead of stopping the translation."
  - "The tool returns text only, with no audio, light playback, timing controls or encryption."
faq:
  - q: "Why did punctuation or accented letters disappear?"
    a: "Encoding uses a table for A-Z and 0-9 after uppercasing. Characters with no table entry are silently omitted, so check the encoded result against the source when punctuation or non-standard letters matter."
  - q: "How do I separate words in Morse code?"
    a: "Use a slash with optional spaces around it, or at least three consecutive spaces. A single space separates letters within a word."
  - q: "What does a question mark in decoded text mean?"
    a: "The translator could not match that Morse sequence to its letter or number table. Check the dots, dashes and spacing around the unknown sequence."
  - q: "Can this page play or flash the Morse message?"
    a: "No. This is a text translator. It has no sound, light, speed or timing controls, and Morse code is not a secure encryption method."
draft: false
---

Morse code is compact, recognizable and useful for learning, puzzles and experimental messages. The [Morse Code Translator](/morse-code-translator/) converts supported text in both directions while keeping the result as plain text you can copy or download.

The key to a clean translation is spacing. Dots and dashes form letters, single spaces separate letters, and a slash or a wider gap separates words. Understanding those boundaries prevents a technically valid sequence from decoding into the wrong phrase.

## Encode and decode modes

The Mode menu has two options:

- **Text to Morse** is the default. It converts supported text into dots, dashes and separators.
- **Morse to text** translates a Morse sequence back into uppercase text.

The Input area starts with `SOS HELP`. Press Translate Morse to run the selected mode. Reset restores that example, selects Text to Morse and clears the output.

After a run, Copy places the translation on the clipboard and Download saves it as a `.txt` file named after the tool. The page does not auto-run; changing the input or mode does not translate until you press the button.

## Character support and separators

Encoding first converts the input to uppercase, then looks up each character in a table covering A-Z and 0-9. Any character that does not resolve to a supported letter or number is omitted silently. Unsupported punctuation, accented letters, emoji and other symbols can therefore disappear from the output.

A literal space becomes `/`, the word separator used by this tool. Tabs and line breaks are not treated as spaces, so text pasted with newlines may lose its intended word boundaries. Multiple spaces produce multiple slash separators.

There is no punctuation table in this translator. A comma, apostrophe or full stop has no Morse entry here and is dropped during encoding. If punctuation matters, preserve the original text and add it back after decoding rather than assuming a lossless round trip.

## Worked example: SOS HELP

Select Text to Morse and enter:

```text
SOS HELP
```

Press Translate Morse. The output is:

```text
... --- ... / .... . .-.. .--.
```

The first group is SOS, the slash marks the word boundary, and the remaining groups spell HELP. Letters are separated by single spaces.

Now select Morse to text and use that same output as the input. Press Translate Morse again. The decoded result is:

```text
SOS HELP
```

This round trip works because every character is supported and the word boundary is explicit. Try a phrase containing a comma or accented letter and the omission rule becomes visible.

<figure>
  <img src="/assets/img/blog/morse-code-translator/example.svg" alt="SOS HELP encoded as dots and dashes with a slash between the two words" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: `... --- ... / .... . .-.. .--.` decodes to `SOS HELP` when the slash is preserved.</figcaption>
</figure>

## Decoding spacing and unknown sequences

In Morse to text mode, a slash separates words. Spaces around the slash are optional. The decoder also treats three or more consecutive spaces as a word boundary, which allows a wider-spaced format to be translated.

Within each word, one or more spaces separate letter codes. This means two spaces between codes still separate letters, while three spaces start a new word. If you intended one long word but inserted a wide gap, the decoded text will contain an unexpected space.

A sequence that does not match the letter-or-number table becomes `?`. For example:

```text
... / ......
```

decodes as:

```text
S ?
```

The question mark is a diagnostic placeholder, not a claim that the original character was punctuation. Check the unknown code for extra dots, missing dashes or incorrect grouping.

## Output and practical reuse

Both modes return plain text. Encoding produces uppercase Morse tokens; decoding produces uppercase letters, numbers, spaces and question marks for unmatched sequences. There is no option to preserve original capitalisation or punctuation.

Copy is useful for a worksheet, puzzle or message draft. Download creates a text file for storage. Because the tool has no history, save the exact translation before running another operation.

Morse code is a representation, not encryption. Anyone who knows the code can read the message. Do not use this translator to protect passwords, personal data or confidential instructions.

## Limits and common mistakes

The most common encoding mistake is assuming every character survives. Punctuation and unsupported symbols are omitted without a warning. Compare the encoded result with the source whenever the text contains more than plain A-Z, 0-9 and spaces.

Another is losing word boundaries during copy-and-paste. If the slash is removed, adjacent words can merge during decoding. Keep the separator characters and avoid replacing them with ordinary single spaces.

This page also does not provide sound, flashing light, words-per-minute settings or timed practice. It translates character data only. For learning, separate the writing and decoding exercise from any playback tool you choose to use.

## Browser privacy and session state

Your text or Morse sequence is processed by JavaScript in the open page. The operation does not upload it or save it to browser storage. Clipboard access and file creation happen only when you choose Copy or Download.

The input and result are held in memory. Refreshing or closing the page clears the working session. Keep the original message elsewhere until the translation has been checked, and avoid entering sensitive material even though the operation runs locally.

## Checking a translation by hand

A manual comparison catches mistakes that a successful button press can hide. Keep the source phrase beside the translation and read one word at a time. For encoding, check that every supported letter has a code and that each intended word boundary became a slash. For `SOS HELP`, there should be seven letter codes and one separator.

When decoding, isolate any word that contains a question mark and inspect only that group first. Extra dots, a missing dash or a misplaced space are easier to spot in a short sequence. If two words have merged, look for a missing slash or wide gap. If one word has split unexpectedly, check for three or more spaces inside it.

For learning or worksheet use, write the plain text and Morse on separate lines and mark each word boundary by hand. This slows the process down just enough to expose spacing errors. Keep the original message until the decoded version has been read back and compared.

## Workflow and final checklist

For a reliable translation:

1. Decide whether you are encoding or decoding before entering the text.
2. Remove or account for punctuation and unsupported characters.
3. Use literal spaces for word boundaries when encoding.
4. Keep single spaces between Morse letters and slashes between words.
5. Press Translate Morse and compare the result with the source.
6. When decoding, investigate every question mark.
7. Save the accepted translation before starting another run.

<figure>
  <img src="/assets/img/blog/morse-code-translator/workflow.svg" alt="Workflow showing supported text, explicit word separators, translation, comparison and saved output" width="1200" height="675" loading="lazy">
  <figcaption>A reliable round trip depends on supported characters, consistent spacing and a final comparison with the source.</figcaption>
</figure>

Before using the result, confirm that no word boundaries moved, no unsupported characters were unintentionally lost and every `?` has been investigated. A short verification pass is especially important when the Morse text will be copied into another system.
