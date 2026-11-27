---
title: "Extract audio from video: WAV or MP3, and when each wins"
description: "Pull the sound out of a video file, cut the part you need, and choose between lossless WAV and a tenth-the-size MP3 without uploading anything."
date: 2026-11-27
categories:
  - Audio
  - Video
draft: false
---

Sometimes the picture is irrelevant: a voice memo recorded as video, a song inside a clip, a podcast guest who sent an MP4. Extracting the audio track is a one-step job if the tool decodes locally.

## WAV or MP3

- **WAV** is uncompressed and lossless. Every sample of the decoded audio is kept, and the file is large - roughly 10 MB per minute of stereo at CD quality. Use it when the audio will be edited further, transcribed, or measured.
- **MP3** compresses. At 128 kbps it is about a tenth of the WAV size and fine for listening, messaging and most uploads. It is a lossy second generation if the source was already compressed, so do not stack conversions.

The common mistake is exporting WAV "for quality" into a workflow that then compresses again anyway, paying the size cost twice. Pick the format the next step actually needs.

## Cutting while extracting

Often only part of the audio is wanted: the interview answer, the chorus, the clean take. Setting a start and an end exports just that section. Leave the fields empty to keep the whole file.

The [Audio Extractor & Trimmer](/audio-extractor/) accepts anything the browser can decode - MP4, MOV and WebM video, plus MP3, WAV, M4A and OGG audio - lets you set that range, and writes WAV or MP3 on your device. A rare codec may be refused; the tool names the file instead of failing silently.

## Quality expectations

The extracted audio cannot be better than the source. A video whose sound was encoded at 96 kbps will not become studio quality as WAV. What you can control is not losing anything further: decode once, export once.

## Privacy and speed

Files are decoded and encoded in the page, so there is no upload and no queue. Speed depends on the length of the file and your machine, not on a server. Closing the tab cancels the job and discards the data.
