---
title: "Fix subtitle timing without re-typing the file"
description: "Subtitles that appear too early or too late usually need one time offset, not a full rewrite. Here is when to shift and when to re-sync."
date: 2026-11-24
categories:
  - Subtitles
  - Workflow
draft: false
---

A subtitle file can be perfectly spelled and still be useless if the lines arrive two seconds late. The good news is that most timing problems are not typing problems. They are offset problems, and an offset is easy to fix.

## Read the pattern first

Open the video, play the first minute, and watch the subtitles.

- **Every line is early or late by the same amount.** The file needs one constant shift.
- **The gap grows as the video plays.** The file was made for a different frame rate or was edited after the subtitles were written.
- **Only a few lines are wrong.** Those lines need individual fixes, not a global shift.

Write down the difference in seconds for the first and last line. That tells you which case you have.

## The fast fix for a constant offset

An SRT file stores time as `hours:minutes:seconds,milliseconds`. A constant offset adds or subtracts the same value from every start and end time.

For example, if the first line should start at 00:00:03,000 but starts at 00:00:01,000, every line needs +2 seconds. A shift of 2000 milliseconds fixes the whole file at once.

The [SRT Subtitle Editor](/srt-editor/) does this with one field: paste the file, enter the offset and download the corrected version. Nothing leaves your browser.

## When a shift is not enough

If the first line is correct and the last line is late, a constant offset will not help. Check three things before you re-type anything:

1. **Frame rate.** A file made for 23.976 fps played at 24 fps drifts by about 3.6 seconds per hour.
2. **Cuts.** If scenes were removed after the subtitles were timed, every later line moves earlier.
3. **Speed changes.** A clip slowed by 5 percent pushes all speech later.

Frame rate and speed problems need a stretch, not a shift. A few cut scenes are better fixed by editing the affected cues by hand.

## Convert formats without losing timing

SRT and VTT store time differently. SRT uses a comma before milliseconds; VTT uses a dot. A plain text export keeps the words and throws the timing away.

Convert with a tool that rewrites the timestamps, not with a text editor. The same editor can switch between SRT, VTT and plain text from one dropdown.

## A short checklist before export

- First line appears when the speaker starts.
- Last line disappears after the sentence ends.
- No cue is shorter than one second or longer than about seven seconds.
- Two cues never overlap.
- The file name matches the video file name.

Fix the offset first. If the drift remains, check the frame rate. Only then spend time on individual lines.
