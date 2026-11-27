---
title: "Share a YouTube video at the exact second"
description: "The t parameter, the start parameter for embeds, how to write times that survive in comments, and what to do with Shorts and youtu.be links."
date: 2026-11-27
categories:
  - YouTube
draft: false
---

The moment a video gets long, "watch from 1:42" stops working. The viewer scrubs, overshoots, and gives up. A timestamped link opens the player at the right second, and writing one is a small piece of URL syntax.

## The basic form

Add `t=` to the URL with a time value:

```
https://www.youtube.com/watch?v=VIDEOID&t=102
```

The value is in seconds. YouTube's own Share button writes it the same way, which is why it works in comments, descriptions, chat and email.

## Formats the parser should handle

A person thinks in `1:42`; the URL wants `102`. A good timestamp tool accepts both and shows the parsed seconds so a typo is visible before the link is copied. It should also accept:

- `1:42:05` for hours, minutes, seconds.
- `42` as plain seconds.
- `1m42s`, the format YouTube sometimes copies from its own player.

## Embeds use start

If the video is embedded on a page rather than watched on YouTube, the player reads `start=` instead of `t=`:

```
https://www.youtube.com/embed/VIDEOID?start=102
```

The [YouTube Timestamp Link tool](/youtube-timestamp-link/) shows both forms side by side, so the watch link and the embed link are one copy away.

## Which link types it accepts

Watch URLs, `youtu.be` short links, Shorts, Live and embed URLs, or the bare 11-character video ID all work. Extra parameters such as playlists are kept unless they conflict with the time parameter.

## Times that break

- **A negative time** - not valid, and some sites strip the parameter silently.
- **A time past the end** - the player starts at the end or at 0:00 depending on the surface. Use the tool to keep the time inside the video.
- **A time in the wrong unit** - `t=142` is not 1:42. It is 2:22. This is the classic mistake when writing links by hand.

## One more use

The same timestamp text is handy in a comment: "the fix is at [1:42]" links the viewer straight to the moment, and the plain text is readable even where links do not render.
