---
title: "Video to GIF: pick a size that still loads"
description: "GIF files are huge by design. How width, frame rate and duration trade against each other, and the settings that work for chat, forums and posts."
date: 2026-11-27
categories:
  - Video
  - Social
draft: false
---

A GIF is a stack of frames with a 256-colour palette each, and that is why a five-second loop can weigh more than a minute of MP4. The format survives because it autoplays everywhere and needs no controls. Getting a usable file is about picking numbers that fit the place it will be seen.

## The three dials

- **Duration** - the biggest lever. Two seconds of a reaction is usually enough.
- **Width** - resolution falls off fast: 640 px is roughly twice the pixels of 480 px, and twice the file.
- **Frame rate** - 10 to 15 fps reads as motion; 25 fps doubles the frames for a small gain in smoothness.

A five-second loop at 480 px and 12 fps is the reliable middle ground for chat and forums. For a post that will be viewed at arm's length on a phone, 640 px is worth the extra weight.

## Start and end on clean frames

A loop looks broken when the last frame jumps back to the first. Choose a clip where the movement returns near its start, or end on a pause. Trimming into a cut mid-motion guarantees a visible snap each loop.

## How the tool works

The [Video to GIF converter](/video-to-gif/) takes a few seconds of video, a width and a frame rate. Frames are drawn to a canvas and encoded by a Web Worker on your device - nothing is uploaded, and the 8-second ceiling exists because GIF size grows faster than usefulness.

## When MP4 is the better answer

GIF wins on compatibility, not on file size. If the destination accepts video - most social platforms do - an MP4 of the same clip will be a fraction of the size and smoother. Use GIF for chat apps, documentation, email signatures and places that refuse video embeds.

## A quick checklist

- Duration under five seconds unless the story needs more.
- Width 480 px for chat, up to 640 px for posts.
- Frame rate 10-15 fps.
- Loop checked twice: once for motion, once for size.
