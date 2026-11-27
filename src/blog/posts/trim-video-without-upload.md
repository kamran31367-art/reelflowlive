---
title: "Trim a video on your device, and why it takes real time"
description: "How an in-browser trimmer cuts to the frame without a keyframe limit, why a 40-second clip takes about 40 seconds, and which files each browser can save."
date: 2026-11-27
categories:
  - Video
  - Workflow
draft: false
---

Most quick trims are small: cut the shaky start, drop the pause at the end, keep the good 30 seconds. Desktop editors handle this well but ask for an install and a project file. A browser trimmer is the faster route when the cut is simple - with one honest trade-off worth understanding.

## Cut points follow the clock, not keyframes

Classic fast trims copy compressed data and can only start on keyframes, which sit every few seconds. The cut drifts to the nearest keyframe and the clip starts a moment off.

The [Video Trimmer](/video-trimmer/) records the chosen section as it plays, so the clip starts at the time you set and stops at the end you set, to the nearest recorded frame. No keyframe snapping, no re-encode of the whole file.

## The trade-off: real time

Recording happens in real time. A 40-second clip takes about 40 seconds. Keep the tab open and in front while it runs; a background tab throttles and the result gets choppy or short. There is no encoder to download and no watermark - the browser's own recorder does the work.

## Which files work

Anything the browser can play. MP4 with H.264 plays everywhere. MOV and MKV depend on the browser's codecs, which vary. Chrome saves MP4; other browsers save WebM. If the destination needs MP4 and you are not in Chrome, trim in Chrome or convert the result afterwards.

## When a browser trimmer is the wrong tool

- **Long cuts** - a 10-minute section takes 10 minutes. A desktop editor is faster for anything past a minute or two.
- **Precise multi-cut editing** - joins, transitions and frame-perfect sync belong in an editor.
- **Colour, audio mixing or effects** - these need a real NLE.

For one clean start and one clean end - the most common task when preparing a clip for upload or a message - it is the right speed.

## Before and after the cut

Check that the export plays with sound and starts where you wanted. If the result is a WebM, some platforms refuse it; convert to MP4 first. And keep the original file: a recording is a second-generation copy, so avoid trimming an already trimmed clip when the source is still around.
