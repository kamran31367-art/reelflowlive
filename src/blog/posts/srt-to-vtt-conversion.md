---
title: "SRT to VTT and back: convert subtitles without an account"
description: "What SRT and WebVTT files are, where each one is accepted, how to shift subtitle timing safely, and why the conversion needs no upload."
date: 2026-11-27
categories:
  - Subtitles
draft: false
---

Subtitle files look like plain text, but the format matters. YouTube accepts SRT, but a self-hosted video player usually wants WebVTT. Some editors export one and some export the other. Converting between them should take seconds, and it does - if the file is well formed.

## SRT and VTT in one paragraph each

**SRT** is the oldest and most common subtitle format. Each cue is a number, a timing line with a comma before milliseconds, then the text:

```
1
00:00:01,000 --> 00:00:03,500
Hello and welcome.
```

**WebVTT** is the web standard. It starts with a `WEBVTT` header and uses a dot before milliseconds:

```
WEBVTT

00:00:01.000 --> 00:00:03.500
Hello and welcome.
```

Same idea, different punctuation. Players that follow the HTML5 track standard only read VTT, which is why a working SRT file can show no subtitles at all on a web player.

## Convert with a paste

The [SRT Subtitle Editor](/srt-editor/) detects the input format on its own. Paste the file or open it, choose SRT, VTT or TXT as the output, and download. VTT export adds the required header and rewrites the timestamps; SRT export goes the other way.

The TXT export strips all timing and leaves the dialogue. That is handy for turning subtitles into a script, a blog transcript, or a description block - not for uploading as subtitles.

## Shifting timing

The most common subtitle problem is not format, it is sync. The audio starts a second later than the text, or an intro was cut and every cue is now early by four seconds.

Enter a positive number of seconds to delay every cue, or a negative number to move them earlier. Two details that a good tool handles for you:

- **Cues cannot start before 0:00.** If the shift would push a cue past the start, it is clamped and counted as an issue. You should see that count, not a silently corrupted file.
- **Every cue moves by the same amount.** If the subtitle drifts progressively - fine at the start, worse at the end - one global shift is not the fix. That file needs retiming per cue, or new subtitles.

## Formatting that survives the trip

Basic text, line breaks and simple emphasis tags carry over. Exotic styling, embedded fonts and positional data are the first things to break in any conversion. If you rely on those, check the result in a player before publishing.

## Why the conversion happens locally

Subtitle files can contain unreleased scripts or private notes. The editor reads and rewrites the file inside your browser with no server round trip, so nothing is uploaded and there is no account. The same applies to large files: processing time depends on your machine, not on a queue.

## Checklist

- A VTT file must start with `WEBVTT`; an SRT file must use commas before milliseconds.
- Choose the format the destination actually accepts, not the one you already have.
- Shift timing in whole numbers of seconds unless you know the offset precisely.
- Watch for clamped cues at 0:00 - they mean the shift was too large.
- Use TXT only for scripts and transcripts.
