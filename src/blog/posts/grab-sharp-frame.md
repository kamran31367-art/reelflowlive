---
title: "Grab a sharp frame from any video"
description: "How to save the exact second as a full-resolution PNG, why the preview and the export match, and when motion blur makes a frame unusable."
date: 2026-11-27
categories:
  - Video
  - Images
draft: false
---

A single frame is useful for more than thumbnails: a reference for colour grading, a still for a client review, a cover for an article about the video. Screenshot tools capture the player, the interface and the screen's resolution. A frame grabber reads the video itself.

## Full resolution, not screen resolution

The [Video Frame Grabber](/video-frame-grabber/) seeks the video to the chosen time and saves what the decoder produces. A 1920x1080 clip gives a 1920x1080 PNG - no scaling, no player chrome, no window borders. Step the time in fractions of a second to land on the frame you want; the browser seeks to the nearest frame it can decode, so the saved image matches the preview.

## Motion blur is real

A frame from fast movement is blurred in the source video. The grabber cannot fix that; the blur is in the data. Pick a moment where the subject pauses, or accept a softer still. For thumbnails, the cleanest frame is usually a beat after a cut, when the camera has settled.

## PNG and file size

The export is PNG, which is lossless - good for text and graphics in the frame, larger for photos. A 1080p frame can be 2-4 MB. If the destination has a limit, resize or convert to JPG afterwards.

## Which videos work

Anything the browser can play. MP4 with H.264 works everywhere; MOV and MKV depend on the browser's codecs. If a file refuses to load, the codec is the first suspect, not the file size.

## Three common uses

- **Thumbnail base** - grab a clean frame, add text in a design tool, upload.
- **Colour reference** - hand the still to a collaborator instead of a timestamp.
- **Documentation** - show a specific moment in a bug report or a tutorial.

All of it happens locally: the video is decoded in the page and the PNG is written by the browser, so unreleased footage never leaves your device.
