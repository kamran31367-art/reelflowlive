---
title: "YouTube chapters: the rules that make the bar appear"
description: "Three chapters at minimum, 0:00 first, ten seconds each, one timestamp per line - and the silent mistakes that keep the chapter bar away."
date: 2026-11-27
categories:
  - YouTube
draft: false
---

Chapters split a long video into labelled sections. Viewers can jump straight to the part they need, and search results sometimes surface the section titles. The feature is free, but it only turns on when the description follows a few strict rules.

## The rules, exactly

YouTube shows chapters when all of these are true:

1. **At least three chapters** are listed.
2. **The first timestamp is 0:00.**
3. **Every chapter lasts at least 10 seconds.**
4. **Each timestamp is written on its own line** at the start of the line, followed by its title.

A valid block looks like this:

```
0:00 Intro
0:42 The problem
1:30 First fix
3:05 Second fix
5:20 Wrap-up
```

Accepted timestamp formats are `m:ss` for videos under an hour and `h:mm:ss` for longer ones. The [YouTube Chapters Generator](/youtube-chapters/) normalises whatever you type into the shortest valid form, so `00:01:30` becomes `1:30`.

## Why chapters silently fail

The chapter bar does not error - it just does not appear. These are the usual reasons:

- **The first timestamp is not 0:00.** Starting at 0:05 is enough to disable the whole block.
- **Only two chapters.** Three is the floor.
- **A chapter is shorter than 10 seconds.** A timestamp 4 seconds after the previous one breaks the list from that point.
- **Timestamps are inside a paragraph.** A timestamp in the middle of a sentence, or with text before it on the same line, is not recognised.
- **The list is too short to matter.** With only a short video, chapters may not be worth adding at all.

A tool that checks each rule as you type saves the upload-check-wait-fix loop. The generator flags a bad first timestamp, a too-short gap and a missing minimum before you paste anything.

## Where the timestamps come from

The most reliable source is the edit itself. Note the moment each section starts while watching your own timeline, then enter the times in order. If you already have subtitles, the first cue of each section is usually close - open the [SRT Subtitle Editor](/srt-editor/) and read the timing from there.

Do not round every chapter to the nearest minute. Sections that start at 1:47 will be frustrating to find if the chapter says 2:00.

## Description budget

A chapter block eats into the 5,000-character description limit with the rest of your text. It is rarely a problem, but if the description is packed with links and credits, check the count with the [Character Counter](/character-counter/) before saving.

## Chapters and retention

Chapters do not just help navigation. Viewers who jump to a section still watch from that point, and a clear structure tells a new visitor what the video covers before they commit. For tutorials longer than about five minutes, a chapter list is close to mandatory.

## Checklist

- Start at 0:00, always.
- Three chapters minimum, ten seconds each.
- One timestamp per line, title after it.
- Use the shortest valid format - `1:30`, not `00:01:30`.
- Check the rules before saving the description, not after.
