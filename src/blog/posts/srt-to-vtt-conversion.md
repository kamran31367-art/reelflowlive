---
title: "SRT to VTT and back: convert subtitles and fix timing without an account"
description: "A four-cue subtitle file converted to WebVTT in one click, shifted by two seconds, and pushed too far on purpose. What the panel measures, what it flags, and the two places where it can still hand you a broken cue."
date: 2026-11-27
categories:
  - Subtitles
cover: assets/img/blog/srt-to-vtt-conversion/hero.webp
coverAlt: "Two people watching a film on a living room television, seen from behind the sofa"
coverCaption: "Subtitle problems usually reach you here, on the sofa: the words are all there, but they arrive at the wrong moment."
takeaways:
  - "A four-cue SRT was detected as SRT, listed as 4 cues with a duration of 0:15 and 0 issues, and the same cues exported to VTT with a WEBVTT header and a dot before the milliseconds."
  - "+2 seconds moved the first cue from 00:00:00,500 to 00:00:02,500 and the last cue end from 00:00:15,250 to 00:00:17,250, with the duration row following to 0:17."
  - "A -5 second shift produced the issue '2 cue(s) would start before 0:00 and were clamped.' and the first cue exported as 00:00:00,000 --> 00:00:00,000, a cue that never appears on screen."
  - "A WebVTT cue whose identifier line sat above its timing was not read: the panel kept 1 cue and reported 'Block 2: no valid timing line found.'"
  - "A cue whose end time comes before its start time is flagged but still exported, so on a broken file the issue list is the only warning you get before download."
faq:
  - q: "Does the SRT editor upload my subtitle file?"
    a: "No. The file is read by the browser tab and every conversion happens in memory there. Opening a file from disk uses the browser's own file reader, not a server. That is also why there is no account and no per-file size limit other than your device's memory."
  - q: "Why did a cue turn into 00:00:00,000 --> 00:00:00,000 after a large shift?"
    a: "Because the tool clamps any time that the shift would push below zero, and it clamps start and end separately. In the measured session a -5 second shift pulled the first cue's start from 0.500 to -4.500 and its end from 3.000 to -2.000; both were raised to zero, so the cue kept its text but lost its duration. The issue line counts that cue, but the file is still downloadable, so read the issue count before you export."
  - q: "Can it fix subtitles that drift further out of sync as the video plays?"
    a: "Not directly. One constant shift moves every cue by the same amount, which fixes the case where every line is early or late by an identical gap. A file that starts fine and ends late by seconds needs a stretch (a different frame rate) or per-cue retiming, and neither is a slider in this tool. A spreadsheet script or a subtitle timing tool with a rate change is the right place for that repair."
  - q: "Does it understand WebVTT cue identifiers, NOTE blocks and STYLE blocks?"
    a: "NOTE, STYLE and REGION blocks are skipped without complaint, which is the safe behaviour. Cue identifiers are not supported: in the measured session a cue written with an identifier line above its timing time was dropped and logged as 'Block 2: no valid timing line found.' If your VTT uses identifiers, remove those lines first or the cue will not survive the trip."
  - q: "What happens to styling tags and position data?"
    a: "Text is carried over as written, so simple tags such as italics survive as characters in the cue text. Styling that depends on settings outside the cue, such as font size defaults or positional alignment, is not interpreted and not recreated. For plain dialogue and burned-in captions that is enough; for heavily styled karaoke-style subtitles, check the result in a player before publishing."
---

A subtitle file can be perfectly spelled and still be useless if the lines arrive two seconds late. Two different jobs hide behind that sentence: the format may be wrong for the player, and the timing may be wrong for the video. The [SRT Subtitle Editor](/srt-editor/) handles both in one panel, and this post walks through a real session, so every number below is what the tool reported.

## SRT and VTT in one screen each

**SRT** is the oldest subtitle format still in daily use. Each cue is a number, a timing line with a comma before the milliseconds, and the text:

```
1
00:00:01,000 --> 00:00:03,500
Hello and welcome.
```

**WebVTT** is the web standard behind HTML5 captions. It opens with a `WEBVTT` header and uses a dot instead of a comma:

```
WEBVTT

00:00:01.000 --> 00:00:03.500
Hello and welcome.
```

Same idea, different punctuation and one mandatory header line. Players that follow the HTML5 track standard only read VTT, which is why a working SRT file can show no subtitles at all in a self-hosted web player.

## What the panel reads back before you export

Paste a file or open it from disk, and the panel answers three questions before you touch anything: what the input is, how much of it parsed, and whether anything looked wrong. With the four-cue SRT from the session, the top row said **Detected: SRT**, and the stats line read **4 cues, duration 0:15, 0 issues**.

The duration is the latest cue end, rounded down for display: the last cue ended at 0:15,250 and the row showed 0:15.

Below the stats sits the cue table, one row per cue with the number, start, end and a flattened copy of the text. This table is the fastest way to spot the classic problems without exporting anything: a first cue that starts at 0:00.000 when speech begins later, a gap of several seconds, or one cue that runs across a cut.

<figure>
  <img src="/assets/img/blog/srt-to-vtt-conversion/tool.webp" alt="The SRT Subtitle Editor with a four cue SRT pasted, a plus two second shift applied, VTT selected and the WEBVTT preview at the bottom" width="1072" height="632" loading="lazy">
  <figcaption>The measured session: four cues, a +2 second shift and VTT selected. The preview adds the WEBVTT header and rewrites every timestamp with a dot.</figcaption>
</figure>

## The export is a rewrite, not a rename

The format buttons change the output, not the input: the pasted text stays as typed, and the preview rewrites it. For the same four cues, choosing VTT produced this opening:

```
WEBVTT

00:00:00.500 --> 00:00:03.000
Welcome back to the workshop.
```

Every timestamp was rebuilt with a dot and padded to `hh:mm:ss.mmm`, even though the source wrote times the same way SRT does. The downloaded file from that session was **sample.vtt, 356 bytes**: the source file was named sample.srt, the extension followed the chosen format, and the base name was kept. If you paste text instead of opening a file, the download is named subtitles plus the extension.

The TXT option strips timing entirely and joins the cue texts with blank lines. That output is for turning subtitles into a script, a transcript or a description block, and the tool says so plainly: plain text cannot be converted back into a timed format, because the timing is gone.

## Shifting timing by a constant offset

The second control is the timing shift: a number in seconds (or milliseconds, via the unit dropdown) applied to every start and end. Positive delays the subtitles, negative moves them earlier.

In the session, +2 seconds moved the first cue from 00:00:00,500 to 00:00:02,500 and the last cue end from 00:00:15,250 to 00:00:17,250. The duration row followed the file to 0:17. Every gap between cues stayed identical, which is the whole point of a constant offset: shape preserved, position moved.

<figure>
  <img src="/assets/img/blog/srt-to-vtt-conversion/clapper.webp" alt="A clapperboard held up against a desert sky, its timecode display showing the running time of the take" width="1200" height="675" loading="lazy">
  <figcaption>A constant shift is the subtitle equivalent of resetting the slate: the content does not change, only the moment it is stamped with.</figcaption>
</figure>

## When the shift goes too far

Shifts are not guarded, only clamped. A -5 second shift on the same file produced exactly one issue line:

> 2 cue(s) would start before 0:00 and were clamped.

That count is literal. Two cues had a start time below zero before clamping, but the visible damage is bigger than the count suggests. The first cue's exported timing came out as:

```
1
00:00:00,000 --> 00:00:00,000
Welcome back to the workshop.
```

Start and end are clamped separately, so this cue kept its text and lost its entire duration. The second cue survived as 00:00:00,000 --> 00:00:02,400, squeezed from its original 4.2 seconds because only its start fell below zero.

Two lessons follow. First, the issue counter and the issue text are the warning system, and the download button stays enabled no matter what, so check the count before you export. Second, if a big negative shift is genuinely needed, it usually means some cues belong at the very start of the video and need their own timings rather than a global move.

## Shift or drift: read the pattern first

Before reaching for any offset, watch the first minute of the video with the subtitles on:

- **Every line is early or late by the same amount.** You need one constant shift, and the field above is the whole fix.
- **The gap grows as the video plays.** The file was made for a different frame rate or was edited after the subtitles were written. A global shift cannot fix this.
- **Only a few lines are wrong.** Those lines need individual edits, not a global move.

Write down the error on the first line and on the last line. If the two numbers match, shift. If the last error is larger, it is drift.

Drift has three usual causes, all worth checking before you re-time anything by hand. **Frame rate:** a file timed for 23.976 fps played at 24 fps drifts by roughly 3.6 seconds per hour. **Cuts:** if scenes were removed after the subtitles were timed, every later line moves earlier by the length of the removed material. **Speed changes:** a clip slowed by 5 percent pushes all speech later, again growing over time.

Frame rate and speed problems need a stretch, which this editor deliberately does not offer. Cuts are usually fixed by editing the affected cues by hand, and a single missing or extra intro segment is still a constant shift.

## What the parser accepts, and what it flags

The reader is forgiving about the parts of real-world files that vary for no good reason. It strips a byte-order mark, normalises Windows line endings, accepts times as `hh:mm:ss.mmm`, `mm:ss.mmm` or `mm:ss` without milliseconds, and accepts both comma and dot as the millisecond separator. The cue number is optional. NOTE, STYLE and REGION blocks are skipped silently, which keeps a modern VTT file's header blocks from being reported as broken cues.

It is strict about two things, and both appear in the issue list rather than failing silently. A block with no valid timing line is dropped and logged with its position, e.g. **Block 2: no valid timing line found.** That is exactly what happened when a VTT cue carried an identifier line above its timing: the identifier is not understood, so the cue was lost and only the identifier-less cue survived the parse.

Reversed timing is different. A cue whose end comes before its start is logged as **Block 3: end time is before start time.** and then still exported, unchanged:

```
00:00:09,000 --> 00:00:06,000
End before start.
```

That keeps the file complete rather than repairing it silently, with one side effect: the duration row takes the latest end time, so a reversed cue ending at 0:06 reports a 0:06 file even though its start reads 0:09. With timing like that, treat the file as broken rather than as shifted.

## Cue table, preview and naming

The cue table shows the first 100 cues and says so: past that it reads "Showing first 100 of N cues", while the export and every stat still cover the whole file. Text in the table is flattened and cut at 140 characters with an ellipsis, so long multi-line cues are readable in one line; the preview and the export keep the original line breaks.

The preview textarea is read-only on purpose. The shift is applied to the exported file, never to your pasted text, so you can try a different offset, compare the preview, and still have the original underneath.

Downloads take the name of the file you opened, with the extension of the chosen format. Content typed straight into the textarea downloads as subtitles.srt, subtitles.vtt or subtitles.txt. The VTT file is served as text/vtt, which some players use to recognise it.

## A short checklist before export

- The first line appears when the speaker starts, and the last line clears after the sentence ends.
- No cue is shorter than a second or longer than about seven seconds.
- Two cues never overlap, and none starts before the previous one ends.
- The issue count is zero, or every issue is understood.
- The file name matches the video file name, base name included.

Nothing is uploaded and there is no account; nothing survives a reload unless you save it yourself. Keep the original file until the converted one has been watched once end to end. The shift is one field, but the only proof that it worked is still the play button.