---
title: "JSON, Base64 and SHA-256 fixes in one offline page"
description: "Format messy JSON, encode or decode Base64, take a SHA-256 checksum and generate a strong password in a single page that runs entirely in the tab."
date: 2026-11-27
categories:
  - Developer
cover: assets/img/blog/json-base64-sha256-quick-fixes/hero.webp
coverAlt: "Close-up of PHP source code on a dark screen, with syntax colours on a blurred background"
coverCaption: "The four chores are small. The risk is where the text goes while you do them."
takeaways:
  - "One page covers four chores: JSON format, minify and validate, Base64 encode and decode, SHA-256 and SHA-1 hashes, and a password generator."
  - "A trailing comma fails with the position and the surrounding text quoted, not a silent no-op: position 41, near \"...tags\":[\"shorts\",\"tips\"],}\"."
  - "Formatting then minifying the same object produced a 41-byte line, and the five characters of \"héllo\" encoded to aMOpbGxv."
  - "SHA-256 of the three bytes abc is ba7816bf...f20015ad and SHA-1 is a9993e36...9cd0d89d, each labelled with its input size."
  - "The password generator starts at 20 characters from an 85-character pool, about 128 bits of entropy, with one character guaranteed from every ticked group."
faq:
  - q: "Is Base64 a form of encryption?"
    a: "No. Base64 is a reversible encoding that turns arbitrary bytes into plain text using 64 safe characters. Anyone with the string and any decoder gets the original back, which is why tokens should be treated as readable by whoever holds them. Use it to move bytes through text-only channels, such as headers, data URIs or JSON fields, and use real encryption when secrecy matters."
  - q: "Why does decoding sometimes fail with a UTF-8 error?"
    a: "The decoder strips whitespace, converts the Base64 back into bytes, then reads those bytes as UTF-8 text and refuses if they are not valid UTF-8. That is useful for tokens, keys and JSON, since it stops binary noise being shown as mojibake. A Base64 string that really is an image or a compressed file should go through a decoder that writes a file instead, such as the image tools or a desktop converter."
  - q: "Can I take a SHA-256 hash of a file here?"
    a: "Not on this page. The hash panel reads the text in the box, so a copied checksum line or a signing string works, but a 900 MB installer does not. For files, use the checksum command that ships with the operating system: sha256sum on Linux, shasum -a 256 on macOS, or Get-FileHash on Windows. The output is the same 64-hex-character value this page shows for the same bytes."
  - q: "Where does the password randomness come from?"
    a: "From crypto.getRandomValues, the browser's cryptographic random source, not Math.random, which is predictable and unsuitable for secrets. The generator also avoids modulo bias with rejection sampling and guarantees at least one character from every group you tick, so a short password still contains the mix you asked for. The page shows an entropy estimate beside the length field: 20 characters across all four groups is about 128 bits."
  - q: "Does the page work without a connection?"
    a: "Yes, once it has loaded. Nothing is sent anywhere: the JSON parser, Base64 coder, hash and password generator all run in the tab, and the page makes no request of its own while you work. The one dependency is that hashing uses the browser crypto API, which some browsers only expose on https or localhost pages. Every other panel keeps working regardless."
---

Four small chores keep repeating: a minified JSON blob needs to be read, a Base64 value needs decoding, a checksum needs verifying, and a throwaway password needs generating for a service that will not get two-factor authentication. Each chore has a dozen ad-supported sites, and every one of them asks you to paste the data into a server you do not control. The [Developer Tools page](/developer-tools/) does all four in one tab, with a URL encoder included as the fifth panel.

This guide walks through what each panel actually does, the numbers a real session produced, and the honest edges of a tool this small.

## One page, five panels

The layout is the same in every mode: input on the left, output on the right, one Copy output button. Switching panels does not clear what you typed, and every panel writes into the same output box, so a decode can follow an encode without leaving the page.

The five modes are JSON, Base64, Hash, Password and URL. Each one reports what it did in the output header: "Formatted with 2-space indent", "41 bytes minified", "SHA-1 of 3 bytes". Those short hints are the difference between trusting a result and guessing at it.

## The JSON panel

A formatter does two jobs. It fails loudly on invalid JSON, and it lays valid JSON out with two-space indentation. Failing loudly is the half that matters most: a trailing comma is invisible in a wall of text and obvious once the parser points at it.

A real failure looks like this. Feeding `{"title":"Reel","tags":["shorts","tips"],}` to Format turned the badge red and printed "Expected double-quoted property name in JSON at position 41" followed by the text around that spot: `...tags":["shorts","tips"],}`. The offending character is inside the snippet, so the fix takes a second rather than a scroll.

Minify goes the other way. The same object, once the comma was removed, came out as one 41-byte line, and the output header said exactly that. Validate answers a third question without producing JSON at all: it prints the top-level shape, such as "Object with 2 top-level keys" or "Array with 3 items", which is often all you need after a paste.

Two limits are worth knowing. The formatter reserialises the value through the browser's JSON parser, so comments are impossible to begin with (JSON has none) and the output is normalised, with two-space indentation and no trailing spaces. It also cannot repair invalid JSON; it reports where the parser gave up, and the repair stays in your hands.

## Base64, with the traps named

Base64 turns arbitrary bytes into text for channels that only accept text: HTTP headers, data URIs, tokens, nested JSON fields. Encoding is not encryption, and the panel's copy is plain about that: anyone can decode what you encoded.

The decode direction is the useful one when debugging. A token that looks like noise becomes readable JSON in one step. The panel strips whitespace before decoding, which matters because pasted Base64 often arrives broken across lines. It then decodes as UTF-8 in strict mode, so if the bytes are not valid text, it says so plainly instead of showing garbage.

A measured example: `héllo` is five characters, two of them non-ASCII, and it encoded to `aMOpbGxv` with the header "5 characters encoded". Decode it back and the accent survives, because the encoder works on UTF-8 bytes rather than on code units.

The standard alphabet uses `+` and `/`. The URL-safe variant swaps those for `-` and `_`, and this decoder accepts only the standard form; a value copied out of a URL may need those two characters swapped back first. The Swap button is there for the other direction: run Decode, then push the result into the input to continue working with it.

## Hashes, SHA-256 first

A SHA-256 hash is a fingerprint of the input. Change one character and the hash changes completely, and no practical amount of computing turns the hash back into the input. That makes it the standard way to show two copies of a value are identical: a published checksum, a signature comparison, a cache key.

The page hashes the text box. For the three bytes of `abc`, SHA-256 returned 64 hex characters starting `ba7816bf8f01cfea...` and ending `...f20015ad`, and the output header read "SHA-1 of 3 bytes" after the second click, because SHA-1 had just run. The table keeps both results, and the long value wraps inside its cell rather than sliding out of view.

SHA-1 sits beside it for one reason: comparing against a legacy value that already exists. Its 40-character output for `abc` is `a9993e364706816aba3e25717850c26c9cd0d89d`, and that is a famous test vector precisely because the algorithm is old. Nothing new should be signed or checked with it.

The hash runs through the browser's crypto API, which some browsers expose only on a secure connection. On such a page the panel shows a clear message instead of failing quietly; the other four panels keep working either way.

## The password generator

The generator draws from `crypto.getRandomValues`, the browser's cryptographically secure random source. Two details make it better than it looks. It rejects values above a limit so the modulo step introduces no bias, and it fills one character from each ticked group before drawing the rest, then shuffles the result. A 20-character password with only letters ticked still contains a letter, and a mixed one contains each kind you asked for.

Length runs from 8 to 64 and defaults to 20. With all four groups ticked the pool is 85 characters, and the page prints "About 128 bits of entropy from a pool of 85 characters" beside the slider. Moving the slider or a checkbox re-generates immediately, so the number next to the password is the password you are about to copy.

The one guard rail is that at least one group must stay checked. Unticking the last box re-enables Lowercase and says so, rather than producing an empty string.

## What it deliberately does not do

- **No file hashing.** The hash panel reads the text box; a multi-gigabyte installer needs the operating system's own checksum command.
- **No HMAC, no JWT parsing, no signing.** Those are separate jobs with their own footguns.
- **No JSON schema validation, no JSON repair.** The parser reports the failure position; deciding what the author meant stays with you.
- **No Base64 for binary.** Images and archives belong in the image tools or a desktop converter, which write files rather than text.

## Why local matters

The strings people paste into these tools are often tokens, API keys, customer records or unreleased config. Processing them in the page means no upload, no account and no server-side log, and closing the tab ends the exposure. That is also why the URL panel is here: `encodeURIComponent` and its decode are one keystroke away, and a query string with spaces is the most common source of a 404.

<figure>
  <img src="/assets/img/blog/json-base64-sha256-quick-fixes/local-machine.webp" alt="A padlock resting on a backlit mechanical keyboard with red and green light across the keys" width="1200" height="675" loading="lazy">
  <figcaption>The data stays on the machine that already holds it. No queue, no upload, no second copy on someone else's disk.</figcaption>
</figure>

## A short working order

1. Pick the panel: JSON for structure, Base64 for tokens, Hash for fingerprints, Password for new credentials, URL for query strings.
2. Paste, run the action, and read the output header before the result itself; it names what happened and how much was processed.
3. Copy from the output box, not from the input.
4. For a password, set the length and groups first, then copy the generated value and store it in a manager.
5. Clear the output if the page will stay open in a shared browser.

<figure>
  <img src="/assets/img/blog/json-base64-sha256-quick-fixes/tool.webp" alt="The Developer Tools hash panel showing abc hashed to a 64-character SHA-256 value and a 40-character SHA-1 value, with the output box reading SHA-1 of 3 bytes" width="1072" height="522" loading="lazy">
  <figcaption>A real session: both digests for the three bytes of abc, the SHA-256 value wrapping inside its table cell, and the byte count in the header.</figcaption>
</figure>

None of this is exotic work. It is the kind of thing that happens ten times a week and should take seconds, in a place where the pasted value does not outlive the task.