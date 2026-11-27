---
title: "Sharing a YouTube video at the exact second"
description: "One watch link with a playlist and 1:42 in the time field became 102 seconds and four copyable links, plus the 142 trap that turns 1:42 into 2:22 and the loose inputs the parser lets through."
date: 2026-11-27
categories:
  - YouTube
cover: assets/img/blog/share-youtube-at-second/hero.webp
coverAlt: "A person lying on a bed wearing white headphones, watching a laptop beside a blue mug"
coverCaption: "The part of a shared link a viewer notices first is where the playhead lands, and that is one small number in the URL."
takeaways:
  - "A watch link with a playlist plus 1:42 in the time field produced 102 seconds, a youtu.be link ending in ?t=102, a watch link with the playlist kept, an embed link using ?start=102 and the plain comment text 1:42."
  - "Typing 142 instead of 1:42 gave 142 seconds and a clock of 2:22: the t= parameter counts seconds from zero, and the tool shows the parsed side by side so the mistake is visible before copying."
  - "The rebuilt watch link replaced only the time keys t, start, time_continue and v; everything else in the original URL, including a 34-character playlist ID, survived the round trip."
  - "Watch, youtu.be, Shorts, Live and embed links, or the bare 11-character ID, are all accepted as input, and a link typed without https:// is recognised too."
  - "The time parser adds values rather than range-checking them, so 1:102 was accepted as 162 seconds, which is 2:42; a typo shifts the moment without any error message."
faq:
  - q: "Does the t= value have to be in seconds?"
    a: "Yes. YouTube writes t= as a count of seconds from the start, so 1:42 has to become 102. The tool accepts both and shows the converted number, because typing 142 by hand gives 2:22, not 1:42. That one-digit error is the most common way a timestamped link lands in the wrong place."
  - q: "Why does the embed link use start= instead of t=?"
    a: "The embedded iframe player documents start as its parameter, while the watch page and youtu.be links use t. The tool prints both forms so you copy the one your player reads, instead of swapping parameters by hand and hoping."
  - q: "Is the link still valid if the video is re-uploaded?"
    a: "No. A timestamp is stored next to the video ID, not the file. A re-upload becomes a new ID, so the old link fails completely rather than starting at the wrong second. Keep the link for the video you published, and if you must replace the upload, update the link wherever it is shared."
  - q: "Does the tool upload or store the video or the link?"
    a: "No. Everything runs in the tab: the link is parsed, the seconds are formatted and the fields are filled, with no network request and no history. Refresh the page and the fields start empty, apart from what the URL of the tool page itself carries."
  - q: "Can it tell me if the time is inside the video?"
    a: "No, because it does not fetch the video or its duration. A time past the end opens at the end of the video instead of the moment you wanted, so the honest check is to click the short link once and watch where it lands before sending it to anyone."
---

A long video and a verbal "watch from 1:42" is a small act of goodwill that almost never works. The viewer scrubs, overshoots, backs up, and lands somewhere near it. A [timestamped YouTube link](/youtube-timestamp-link/) puts the playhead on the second itself, and this post is a measured walk through the tool that writes one, including the mistakes the numbers reveal.

## The two fields that matter

The tool has an input side with a video field and a time field, and a results side that stays empty until both sides parse. The video field took a full watch URL in the test, `https://www.youtube.com/watch?v=aqz-KE-bpKQ&list=PL590L5WQmH8fJ54F369BLDSqIwcs-TCfs`, but the parser also reads a `youtu.be` short link, a Shorts, Live or embed link, a music.youtube.com link, or the bare 11-character ID. A link pasted without `https://` in front is recognised too; the same video typed as `youtube.com/watch?v=aqz-KE-bpKQ` produced a working set of links.

The time field reads seconds (`102`), minutes and seconds (`1:42`) or hours, minutes and seconds (`1:02:03`), and a decimal with a comma is accepted as well. Updates are debounced by 120 milliseconds, so the results settle a moment after typing stops instead of flashing on every keystroke.

<figure>
  <img src="/assets/img/blog/share-youtube-at-second/tool.webp" alt="The YouTube Timestamp Link tool with a watch URL and 1:42 typed in, showing a video ID, 102 seconds, and four copyable output links" width="1072" height="739" loading="lazy">
  <figcaption>The measured session: a watch link with a playlist plus 1:42 gave 102 seconds, and every output kept the corrected time.</figcaption>
</figure>

## 1:42 becomes 102, and 142 means 2:22

With both fields filled, the results panel filled in the video ID, `102 s` and a readable clock of `1:42`, then four links. The important number is the one in the middle. YouTube counts the start in whole seconds from zero, so every other representation is bookkeeping around that figure.

The same test with `142` typed in the time field showed `142 s` and a clock of `2:22`. That is the trap in one line: the URL parameter looks like a clock to a reader and behaves like a stopwatch counter. The tool prints both readings side by side, so the discrepancy is visible before anything is copied, which is the whole reason the results row exists.

Decimals are kept for parsing and floored for output. `102,5` parses as 102.5 seconds and produces `t=102`, because YouTube reads the parameter as an integer position and half a second has no meaning there.

## Hours and long videos

For a two-hour stream, `1:02:03` parsed as `3723 s` and the outputs carried `t=3723`, with the comment clock printed back as `1:02:03`. The readable clock chooses its form automatically: hours only appear once the value reaches one hour, so a short timestamp stays `2:22` rather than `0:02:22`.

That matters in comments. A reader scanning a description recognises `1:02:03` instantly, while `3723` reads as an ID or a phone number. The tool writes the long form in the comment field and the seconds in the links, which is the split the platform itself uses.

## Four outputs, four places to paste

The four forms are not interchangeable, and that is why all four are on screen at once.

- **Short link:** `https://youtu.be/aqz-KE-bpKQ?t=102`. The form for chat, email and social posts, where the short host looks tidier.
- **Full watch link:** `https://www.youtube.com/watch?v=aqz-KE-bpKQ&list=...&t=102`. The form for descriptions and pinned comments, and the one that keeps the playlist it came from.
- **Embed link:** `https://www.youtube.com/embed/aqz-KE-bpKQ?start=102`. For a page where the video plays inside an iframe, because the embed player documents `start=`.
- **Comment timestamp:** `1:42` on its own line. YouTube turns a timestamp written that way into a clickable jump, and the plain text still reads correctly wherever links do not render.

The copy button for each field also carries a small variation: the markdown link button produces `[1:42](https://youtu.be/aqz-KE-bpKQ?t=102)`, which is the form a shared note or a documentation page wants. All five copy buttons stay disabled until both fields parse, so a half-built link cannot be copied by accident.

## What happens to the rest of the link

The tool rebuilds the URL rather than pasting the time onto it. It drops the keys that carry a time (`t`, `start`, `time_continue` and `v`) and keeps everything else, then writes the time fresh. In the test the 34-character playlist parameter came through unchanged, and the watch link read `...&list=PL590L5WQmH8fJ54F369BLDSqIwcs-TCfs&t=102`.

Two consequences follow. A link that already carried a different `t=` value loses it during the rebuild, which is the point: the time field is the only source of truth. And an input form that is not a watch page is normalised. A Shorts link or an embed link becomes a `youtube.com/watch?v=...` base in the output, because the watch page is the surface whose time parameter behaves predictably.

## Loose input and the two errors

The parser is friendlier than the platform it writes for, and the friendliness has a cost worth knowing.

`1:102` typed in the time field parsed as **162 seconds**, printed back as `2:42`. The parser reads the middle value as minutes and adds, without checking that seconds should stay under 60. For a value copied from somewhere it is harmless; for a typo it is a silent shift of a minute, which is exactly the failure the tool is meant to prevent. If you type minutes and seconds, keep the seconds under 60 and read the converted value back.

The `1m42s` style that older YouTube links and some third-party players write is **not** accepted: the field wants `1:42`. The error state is explicit rather than silent: the hint under the field switches to "That time cannot be read", the input border turns red, all outputs reset to placeholders and every copy button disables again.

A link that does not contain a video ID does the same on the other side. A Vimeo URL produced the message "That link does not contain a YouTube video ID" and a disabled results panel, with the video field marked invalid. Nothing half-parsed survives to the outputs.

<figure>
  <img src="/assets/img/blog/share-youtube-at-second/timeline.webp" alt="A video editor timeline showing a stack of colourful clips with the playhead resting on the ruler" width="1200" height="675" loading="lazy">
  <figcaption>The seconds on the editor timeline are the source of a good timestamp; the tool's job is only to convert them into the URL form.</figcaption>
</figure>

## A link that already has a time

Paste a timestamped link into the video field and the tool strips its time rather than adopting it, because the time field is the one input it trusts. The habit that avoids the confusion: paste the link, then type the moment you want, then copy.

The tool page itself accepts a prefilled state through its own address. Opening it with `?v=aqz-KE-bpKQ&t=102` fills the video field and the time field, so a bookmarked tool can be tied to a video you timestamp often, and a trailing `s` on the time value is tolerated for links copied from players that write `t=102s`.

## A working order

1. Copy the video's watch URL from the address bar, or the Shorts link if that is what you have.
2. Read the second from the editor timeline or the player, then type it in clock form (`1:42`) rather than guessing a raw count.
3. Check the parsed seconds in the results row before copying anything.
4. Use the short link for people and the full watch link where a playlist should survive.
5. Click your own link once and watch it land, especially for anything past the halfway mark.

## What it deliberately does not do

- **No video data.** It does not fetch the video, its title or its duration, so it cannot warn that a time is past the end.
- **No download.** The video stays on YouTube; this is a link builder, not a downloader.
- **No history.** Links are not stored anywhere in the page, which is why a refresh clears the fields.
- **No channel or playlist timestamps.** One video, one moment; a list of chapters belongs to the [YouTube Chapters Generator](/youtube-chapters/).

For the moments where a link is the wrong answer, the [Video Trimmer](/video-trimmer/) cuts the segment out of the file, the [Video to GIF](/video-to-gif/) turns it into a loopable clip, and the [SRT Subtitle Editor](/srt-editor/) is where the same clock values get typed as subtitle timings. A timestamped link stays the lightest option when the video is not yours to cut.