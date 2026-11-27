---
title: "Encode and Decode URL Components Correctly"
description: "Use encodeURIComponent-style URL encoding and decoding with exact examples for spaces, reserved characters, Unicode, plus signs and malformed percent escapes."
date: 2026-11-27
categories:
  - Developer
cover: assets/img/blog/url-encoder-decoder/hero.svg
coverAlt: "Plain text with spaces and an ampersand transforming into percent-encoded URL component text"
coverCaption: "URL component encoding protects characters that would otherwise be read as separators or query syntax."
takeaways:
  - "The input starts with ReelFlow free tools & more, and Mode starts at Encode."
  - "Encoding uses encodeURIComponent, so spaces become %20 and an ampersand becomes %26."
  - "Decoding uses decodeURIComponent, which resolves percent escapes but leaves a literal plus sign unchanged."
  - "The field handles one URL component or text value, not a structured form with separate parameter names and values."
  - "Malformed percent escapes produce an error and disable Copy and Download instead of returning partial text."
faq:
  - q: "Should I encode an entire URL or only its values?"
    a: "Usually encode individual component values, such as one query parameter or path segment, then assemble the URL. Encoding a complete URL also escapes its scheme, slashes, question mark and separators."
  - q: "Does decoding turn plus signs into spaces?"
    a: "No. This tool uses decodeURIComponent, not form-query decoding. A + remains a plus sign; use %20 when you need an encoded space."
  - q: "Does it support Unicode?"
    a: "Yes. JavaScript's component functions operate on UTF-8 text, so characters outside ASCII can be encoded into percent-encoded bytes and decoded back."
  - q: "Is URL encoding a security filter?"
    a: "No. It is a transport representation, not sanitisation or validation. An encoded value can still contain malicious content when the receiving application decodes and interprets it."
draft: false
---

A space or ampersand can change the meaning of a URL even when the surrounding text looks harmless. The [URL Encoder and Decoder](/url-encoder-decoder/) converts one text value into a safe component representation and reverses that process. It is a precise syntax tool, not a URL validator or a security filter.

## When component encoding is useful

Use encoding when inserting user text into a query value, a path segment or another place where reserved characters must be treated as data. It is also useful when debugging a link and you need to see what a percent-encoded value actually contains.

Use decoding when a captured URL component arrives as text such as `cats%20%26%20dogs`. Decode only the component you intend to inspect. Decoding a whole URL can make its structure harder to read because separators reappear as ordinary characters.

## Controls and defaults

The **Text or URL component** field is a single-line input containing `ReelFlow free tools & more`. The **Mode** select starts at **Encode** and also offers **Decode**. Press **Convert URL** after editing; **Reset** restores the sample text and Encode mode.

There is no automatic conversion, character-set selector or separate form mode. Changing the mode does not transform the current field until you press the button.

## Worked example: the default text

With the default input and Encode selected, the result is:

```text
ReelFlow%20free%20tools%20%26%20more
```

Each space becomes `%20`, and the ampersand becomes `%26`. Switch to Decode and use that encoded text as the input to recover `ReelFlow free tools & more`.

For a fuller example, encoding `https://example.com/search?q=cats&sort=new` produces:

```text
https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dcats%26sort%3Dnew
```

That output is correct for a single component, but it is not what you normally want when editing the URL itself. The colon, slashes, question mark, equals sign and ampersand were all escaped because they carry URL structure.

<figure>
  <img src="/assets/img/blog/url-encoder-decoder/example.svg" alt="Default text with spaces and an ampersand shown before and after percent encoding" width="1200" height="675" loading="lazy">
  <figcaption>The default example isolates component encoding: spaces and the ampersand become percent escapes without changing the words.</figcaption>
</figure>

## Reserved characters and safe characters

`encodeURIComponent` escapes characters such as `/`, `:`, `?`, `=`, `&`, `#` and `%` when they occur inside the value. Letters, digits, `-`, `_`, `.`, `!`, `~`, `*`, apostrophe and parentheses are left unescaped by the JavaScript function.

That distinction matters when assembling links. Encode the value first, then add the parameter name and separator in your application code. For example, a query value containing `a&b` must not be inserted raw, because the ampersand would start another parameter.

This tool uses `encodeURIComponent`, not the separate `encodeURI` function that preserves URL separators. There is no switch for that behaviour. If you already have an encoded component, remember that Encode mode treats its percent sign as ordinary data: `%20` becomes `%2520`. Start from the raw value, or decode the component once before encoding it again. That simple check prevents the common double-encoding failure where the receiving application displays escape text instead of the intended character.

For a concrete check, raw `cats & dogs` encodes to `cats%20%26%20dogs`. Feeding that encoded result back into Encode produces `cats%2520%2526%2520dogs`. One decode returns the first encoded layer; two decodes return the original words. Browser address bars may display a friendlier decoded form, so judge the stored URL or request value rather than only the visible address-bar text.

## Decoding behavior and errors

`decodeURIComponent` converts valid percent-encoded UTF-8 sequences back into characters. `%E2%9C%93` becomes `✓`, and `%2F` becomes `/`. It does not decode HTML entities such as `&amp;`, and it does not convert `+` to a space.

Malformed input such as `%ZZ` or an incomplete sequence such as `%E2%9C` raises a URI error. The page shows an **Error:** message and disables Copy and Download. Correct the escape rather than trying to use a partially decoded result.

The tool does not separate parameter names from values. If you paste `q=tea%20%26%20biscuits`, Decode returns `q=tea & biscuits`; it does not remove `q=`. Paste only `tea%20%26%20biscuits` when the value itself is what you need. Likewise, `%2B` decodes to a literal plus sign, while a raw `+` stays unchanged. Those two cases are easy to confuse when inspecting links copied from form-oriented systems.

## Limitations and edge cases

This tool has no URL parser, parameter builder or hostname validation. It does not tell you whether a path segment belongs in a query value or whether a generated link resolves. It also does not detect double encoding: `%2520` decodes once to `%20`, not to a space.

The input is one line, so it is not designed for large multi-line payloads or batch processing. Percent encoding can make Unicode text substantially longer. If the result must fit a service limit, check the final assembled URL in the system that will receive it.

The URI functions do not normalise Unicode. Visually similar text can use different code points, and those differences survive encoding and decoding. Preserve the exact source string when a signature, cache key or identifier depends on it. The tool also has no batch queue or delimiter for processing several values at once, so run each component separately and label the results before assembling a larger link.

## Common mistakes to avoid

Do not encode an entire URL when you only need to encode one query value. Do not use `+` as a substitute for `%20` if the destination expects `decodeURIComponent` behavior. Do not repeatedly encode an already encoded value unless the receiving format explicitly requires nested encoding.

Encoding also does not make a value safe to display. Avoid using an encoded string as evidence that input has been validated, and apply context-appropriate output handling in the application that later consumes it.

## Browser and privacy behavior

Encoding and decoding run locally with JavaScript's built-in URI functions. The input is not submitted to a remote conversion endpoint. Copy and Download work after a successful conversion, and **Download** saves `url-encoder-decoder.txt`. Reset or reload clears the current session state.

## A practical URL workflow

1. Identify the single value that needs encoding.
2. Paste that value, not the whole assembled URL.
3. Choose Encode and press **Convert URL**.
4. Insert the encoded result between the correct URL separators.
5. Test the assembled link in the receiving application.
6. Use Decode only when inspecting a captured component.

<figure>
  <img src="/assets/img/blog/url-encoder-decoder/workflow.svg" alt="Workflow from one text component through encoding, URL assembly and a receiving-application check" width="1200" height="675" loading="lazy">
  <figcaption>Component encoding happens before URL assembly; the finished link still needs a separate receiving-application check.</figcaption>
</figure>

## Final checklist

Confirm that you encoded only the value, used `%20` for spaces when required, avoided accidental double encoding and tested the final link. Treat malformed-escape errors as invalid source data, not as a reason to copy partial output.
