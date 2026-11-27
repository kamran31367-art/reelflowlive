---
title: "UTM links that stay readable: what the builder does to your URL"
description: "A link with an old utm_source, another parameter and a hash came out with the tag replaced in place, the extra parameter kept and the hash intact. A measured walk through the UTM Link Builder, including what it accepts as a URL and what it only warns about."
date: 2026-11-27
categories:
  - Marketing
  - Links
cover: assets/img/blog/utm-links-that-stay-readable/hero.webp
coverAlt: "Colourful 3D dashboard charts and graphs floating on a dark navy background"
coverCaption: "A campaign link is a small contract: the destination stays the same, and the query string carries the story of who sent the visit. The builder's job is to write that story without breaking the address."
takeaways:
  - "A destination typed as example.com/landing?utm_source=old-newsletter&id=7#pricing came out as https://example.com/landing?utm_source=youtube&id=7&utm_medium=email#pricing - https added, old tag replaced in place, id=7 kept, hash intact."
  - "New tags are appended before the hash, so the fragment survives any edit to the query string."
  - "The badge judges spelling, not validity: YouTube and email news produced Uppercase or spaces in source, medium while the link was still built and copyable."
  - "A space inside a tag value is encoded as a plus sign (utm_medium=email+news), and a non-ASCII path is percent-encoded (café became caf%C3%A9)."
  - "Only URLs the browser's parser refuses count as invalid: https:// and http://[bad showed That does not look like a valid URL, but ht!tp://nope silently became https://ht!tp//nope."
faq:
  - q: "Does the UTM Link Builder send my URLs anywhere?"
    a: "No. The link is assembled in the tab with the browser's own URL object, and the copy button writes to the clipboard. There is no request, no account and no history. A link you paste is not stored between visits either, so a refresh starts the form empty."
  - q: "Why does the tool replace a utm_source I already had in the link?"
    a: "Because a link with two utm_source parameters gives analytics tools an ambiguous answer, and many read only the first or the last one. The builder uses the same key for the new value, which overwrites the old one in its original position in the query string rather than adding a duplicate at the end."
  - q: "The tool page says spaces become %20, but my link shows a plus sign. Which is right?"
    a: "Both spellings decode to a space. In the measured session a medium of email news appeared as email+news, which is the form-encoding convention for spaces in a query string; %20 is the percent-encoded form of the same character. Servers treat them the same, so do not copy-edit one into the other."
  - q: "Can I build a link without a source or medium?"
    a: "Yes. The panel header says URL, source and medium are required, but the only enforcement is a badge: Add a source or medium. The URL itself still appears and the copy button stays enabled, which is deliberate - a plain link is sometimes exactly what you want to hand out."
  - q: "Is the tagged link checked against real analytics?"
    a: "No. The tool cannot know whether a campaign name will read well in your dashboard, whether a source spelling will split a report or whether the destination allows the parameters. Its check is local: it validates the URL and flags capitals and spaces in tag values. Naming discipline is still your job."
---

A campaign link fails in quiet ways. The destination works, the page loads, and the report shows a new line that should have joined an old one because someone typed YouTube instead of youtube. The [UTM Link Builder](/utm-link-builder/) exists to make that kind of mistake visible before the link is published, and to keep the address readable while doing it. This post walks through a real session with concrete before-and-after links, so the rules the tool follows are on the record.

## What the panel asks for, and what it enforces

The form has five fields: Destination URL, Source, Medium, Campaign, Term and Content, with the last two marked optional in their placeholders. The pane header says "required: URL, source, medium", but that line is advice, not a gate. In the measured session, a URL with no tags at all produced the badge "Add a source or medium", a perfectly valid tagged URL field containing just the destination, and an enabled copy button.

The tool refuses only what it cannot build: a destination the browser cannot parse. Everything else — missing tags, odd capitalisation, spaces — becomes a visible nudge rather than a block.

## The scheme you leave out

Typing a bare host is normal, so the builder fills in what a browser would add for you. Two examples from the session:

- `example.com/landing` became `https://example.com/landing` before any tag was applied.
- The hint under the field states the rule in one line: "https:// is added when you leave it out."

The check is a pattern, not a guess: a value that already starts with a scheme is left alone, and a Windows path such as `C:/` is not mistaken for one. Everything else gets `https://` in front and is handed to the browser's URL parser.

## What happens to parameters already in the link

This is where the detail matters most. The test destination was deliberately messy:

```
example.com/landing?utm_source=old-newsletter&id=7#pricing
```

After adding source `youtube` and medium `email`, the result was:

```
https://example.com/landing?utm_source=youtube&id=7&utm_medium=email#pricing
```

Three things happened at once, and each is a design decision:

1. **The old tag was replaced, in place.** `utm_source=old-newsletter` became `utm_source=youtube` at the same position. A second `utm_source` at the end would have made the link ambiguous for analytics tools that read only one value per key.
2. **The unrelated parameter survived.** `id=7` sits between the two tags, untouched. The tool edits parameters, not the query string as text.
3. **The hash stayed at the end.** `#pricing` remained the final part of the URL, and new tags were inserted before it — which is the only ordering that works, since anything after a `#` is a fragment, not a parameter.

The note in the right pane says the same in plainer words: "Optional fields left empty are dropped, and an existing utm_key on the destination is replaced rather than duplicated."

<figure>
  <img src="/assets/img/blog/utm-links-that-stay-readable/metrics.webp" alt="A close view of an analytics line chart rising on a laptop screen" width="1200" height="675" loading="lazy">
  <figcaption>A report only stays readable while the keys stay consistent. One stray capital creates a second line that looks like a different campaign and is really the same one.</figcaption>
</figure>

## The badge reads your tags, not just the URL

The status badge in the Final link pane has five states, and they fire in a fixed order:

- **Waiting for a URL** on a fresh load, with the copy and open buttons disabled.
- **Invalid URL** when the destination cannot be parsed — the field also turns red and the error line appears under the form.
- **Add a source or medium** when the URL is fine but no tags are filled.
- **Uppercase or spaces in source, medium** — a warning in amber — when a tag value contains a capital letter or a space. The link is still built, still copyable, and the warning names only the affected keys.
- **Tags look clean** when at least one tag is present and none of them trip the warning.

The judgement is deliberately shallow. The badge does not know that `yt` and `youtube` will split a report, nor that `video` and `social` may be different media for the same placement. It catches the two mistakes that are mechanical — capitals and spaces — and leaves the semantic ones to you.

## Spaces, capitals and non-ASCII characters

Encoding is handled by the same URL object that builds the rest of the link, and the session showed three outcomes:

| Input | Result |
| --- | --- |
| Source `YouTube`, medium `email news` | Badge warns; link carries `utm_source=YouTube&utm_medium=email+news` |
| Path `café` | Encoded as `/caf%C3%A9` |
| Source `my channel` | Encoded as `utm_source=my+channel` |

A space in a tag value becomes a plus sign in the query string. That is the form-encoding convention for a query, and it decodes back to a space. The tool's own FAQ calls it `%20`, which is the other common spelling of the same character; both work, and neither changes what the source is called in a report. What does change a report is the capital Y — that is why the badge flags it rather than the encoder fixing it silently.

## What counts as an invalid URL

Only a genuine parse failure stops the panel. The test threw four bad destinations at it:

- `https://` alone failed: the badge changed to **Invalid URL**, the field turned red, the error line read "That does not look like a valid URL. Check the address and try again.", and both copy and open were disabled.
- `http://[bad` failed the same way, because the unterminated bracket breaks the host parser.
- `https://exa mple.com` did **not** fail. The parser accepted the space and encoded it, producing `https://exa%20mple.com/` with the tags attached.
- `ht!tp://nope` did **not** fail either. The scheme pattern did not recognise the broken scheme, so `https://` was prefixed, and the parser accepted `ht!tp` as a host, producing `https://ht!tp//nope`.

Browser parsers are permissive: "looks wrong to a human" and "fails to parse" are different tests, and this tool only runs the second one.

<figure>
  <img src="/assets/img/blog/utm-links-that-stay-readable/tool.webp" alt="The UTM Link Builder with a destination, youtube, video, trim-guide and description-link filled in, the tags table reading 4 of 5 and the badge reading Tags look clean" width="1072" height="541" loading="lazy">
  <figcaption>The measured session at its clean state: four tags, the fifth left empty and dropped, the badge green and the tagged URL ready to copy.</figcaption>
</figure>

## Copy, open and clear

Three buttons close the loop:

- **Copy tagged link** writes the exact URL field to the clipboard and confirms with the toast "Tagged link copied". If the clipboard API refuses, the toast says "Could not copy" instead — no silent failure.
- **Open link** opens the tagged URL in a new tab with `noopener`, which is the right default: the destination cannot reach back into the builder tab.
- **Clear** empties every field, resets the badge to "Waiting for a URL", drops the tag table to "No tags yet" and puts the cursor back in the destination field. In the session, focus returned to the URL input every time.

The tag table under the link is a second copy of the truth: it lists exactly the parameters that were added, in order, and the counter reads "4 of 5" when one optional field is empty. An empty field simply disappears from the table rather than showing a blank row.

## What it does not do

A short list of things to expect elsewhere:

- **No shortening.** The link can be long, especially with a hash and existing parameters. If it has to fit in a bio line or a print QR code, shorten it after tagging — and keep the tagged original, because most shorteners pass query parameters through but some do not.
- **No saved campaigns.** There is no history, no presets and no team list. Every visit starts empty, which is also why nothing about your links is stored.
- **No validation against analytics.** It cannot tell you whether `video` is the medium your reports already use. Check the spelling against an existing export first, then reuse it.
- **No automatic lowercasing.** The badge warns; it does not enforce. A warning ignored is a split report waiting to happen.

## Where to go next

Once the link is clean, the next steps are about where it travels. Put the tagged URL behind a [QR Code Generator](/qr-code-generator/) for print and packaging; the parameters survive the scan. For video descriptions, pair the campaign link with a [YouTube Timestamp Link](/youtube-timestamp-link/) so the visit lands on the right second. If a campaign name needs tidying before it goes into a dashboard, [Text Tools](/text-tools/) strips stray spacing quickly, and the [Character Counter](/character-counter/) shows whether the link plus its surrounding copy fits a platform's limit. The [Title & Caption Preview](/title-preview/) covers the text that sits above the link in a post, and [Developer Tools](/developer-tools/) helps when a platform mangles the encoding and you need to see exactly what changed.

The summary worth remembering: this tool edits parameters, not punctuation. It replaces a key in place, keeps everything else, warns about capitals and spaces, and refuses only what a browser cannot parse. The rest of the discipline — one spelling per source, one medium per channel, one campaign name per push — stays with the person writing the link.