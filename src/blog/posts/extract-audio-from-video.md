---
title: "Extract audio from video: WAV or MP3, and when each wins"
description: "Pull the sound out of a video, cut the part you need, and choose between lossless WAV and a tenth-the-size MP3 without uploading anything."
date: 2026-11-27
categories:
  - Audio
  - Video
cover: assets/img/blog/extract-audio-from-video/hero.webp
coverAlt: "Rows of faders and lit buttons on a purple-lit audio mixing desk"
coverCaption: "Most of the sound people need is already sitting inside a video file, waiting to be decoded once."
takeaways:
  - "The browser decodes the file on your device; nothing is uploaded, and closing the tab discards the job."
  - "WAV keeps every decoded sample at about 10 MB per stereo minute; MP3 at 128 kbps is roughly a tenth of that."
  - "The extractor cannot restore quality the source never had: a thin 96 kbps track stays thin as WAV."
  - "Start and end fields cut while exporting; empty fields keep the whole track."
  - "A codec the browser cannot read is named in the error message, never a silent failure."
faq:
  - q: "Which files can the extractor read?"
    a: "Anything the browser itself can decode: MP4, MOV and WebM video, plus MP3, WAV, M4A and OGG audio. That covers almost every phone recording and editor export. The usual failures are professional codecs such as ProRes, HEVC in some containers, and AC-3 audio inside a MOV; the tool names the file and says it could not be decoded instead of producing an empty download."
  - q: "Can it extract audio from a YouTube link?"
    a: "No. It reads files from your device only. There is no URL field and nothing is fetched from the network, which also means no download of copyrighted streams. If the sound is yours, export the file from your editor or download your own upload from your channel tools first, then drop it in."
  - q: "Why is the WAV 48 kHz when my file was 44.1 kHz?"
    a: "The browser decodes every file into an audio buffer at the AudioContext sample rate, which is typically 48 kHz regardless of the file. The WAV is written at that decoded rate, which is why the panel shows the actual buffer rate rather than the file label. It is not added quality and not a bug: it is one resample, done once. If a downstream tool insists on 44.1 kHz, convert there rather than extracting twice."
  - q: "Does extracting audio change the video file?"
    a: "Not at all. The video is read into memory, the audio track is decoded, and the export writes a new WAV or MP3 next to your download folder. The original video on disk is never modified, so it is safe to drop a file that you are not sure about."
---

Sometimes the picture is irrelevant: a voice memo recorded as video, a song inside a clip, a podcast guest who sent an MP4. Extracting the audio track is a one-step job if the tool decodes locally. The [Audio Extractor & Trimmer](/audio-extractor/) does exactly that, with a trim range and two output formats.

For a real example: a 95-second test clip measured below produced a 22.5-second cut that the tool sized at about 2.1 MB as WAV and 356 KB as MP3. That gap is the whole decision.

## WAV or MP3

- **WAV** is uncompressed and lossless. Every decoded sample is kept, and the file is large: 16-bit PCM stereo at 48 kHz is roughly 11 MB per minute. Use it when the audio will be edited further, transcribed, or measured.
- **MP3** compresses. At 128 kbps it is about a tenth of the WAV size and fine for listening, messaging and most uploads. It is a lossy second generation if the source was already compressed, so do not stack conversions.

The common mistake is exporting WAV "for quality" into a workflow that then compresses again anyway, paying the size cost twice. Pick the format the next step actually needs, and if the next step is transcription, check whether the service caps file size before choosing WAV.

<figure>
  <img src="/assets/img/blog/extract-audio-from-video/waveform.webp" alt="A close view of an audio editing screen showing large orange waveform blocks" width="1200" height="800" loading="lazy">
  <figcaption>An editor's view of the same decisions: the waveform shows loud and quiet, not quality. Format is chosen at export.</figcaption>
</figure>

## Cutting while extracting

Often only part of the audio is wanted: the interview answer, the chorus, the clean take. Setting a start and an end exports just that section. Times accept `mm:ss.mmm` or plain seconds, and either field can be left empty, which means the start of the file or its end.

The fields validate as you type. An impossible range - end before start, a value past the file length - turns the hint red and keeps the export buttons disabled instead of producing a truncated surprise. When a range is set, the output name carries it, for example `fixture-audio-12s-34.5s.mp3`, so two cuts from the same file never overwrite each other.

<figure>
  <img src="/assets/img/blog/extract-audio-from-video/tool.webp" alt="The Audio Extractor showing a 95-second MP4 decoded as mono 48 kHz with a 0:12 to 0:34.5 export range and size estimates for WAV and MP3" width="1120" height="707" loading="lazy">
  <figcaption>A real run on a 95-second MP4: the decoded buffer is mono at 48 kHz, the 22.5-second cut is estimated at 2.1 MB as WAV and 356 KB as MP3 before either button is pressed.</figcaption>
</figure>

## What happens under the hood

The file is read from disk into memory, then decoded with the browser's own Web Audio decoder. From that decoded buffer the tool slices the requested frames and writes them out:

- **WAV** is written by hand as 16-bit PCM with the standard RIFF header, at the decoded sample rate. No library, no hidden conversion.
- **MP3** is encoded in the page with lamejs at 128 kbps, in chunks with a progress bar, so a long file does not freeze the tab.

Both estimates in the export panel come from the same maths the encoder will use: frames times channels times two bytes for WAV, and bitrate times length for MP3. They are close predictions rather than guesses, which is why the finished file lands within a few kilobytes of the label.

## Quality expectations

The extracted audio cannot be better than the source. A video whose sound was encoded at 96 kbps will not become studio quality as WAV. What you can control is not losing anything further: decode once, export once.

Two honest signals worth checking before you invest time:

- **The source bitrate.** Roughly 128 kbps is fine for speech, 192 to 256 kbps for music. Camera audio usually sits lower than people assume.
- **The channel count.** The panel reports mono or stereo as decoded. A phone recording that says stereo but shows identical channels will not gain width in the export.

If the file needs cleaning, volume levelling or noise reduction, those are separate jobs. Extract first, edit the WAV, then compress the final result once.

## Files it cannot read

Decoding depends on the browser, not on the tool. Common formats are safe: H.264 MP4, WebM, MOV with AAC, MP3, WAV, M4A, OGG. The failures cluster around broadcast and editing codecs that browsers deliberately do not ship: ProRes, many HEVC variants, AC-3 and DTS inside MOV. In those cases the error names the file and lists the formats that do work, so you know which side to fix. Re-exporting from the editor as MP4 or M4A is usually the shortest path.

The preview player can also complain while the decode succeeded, for example when the video codec is unsupported but the audio is fine. The tool says so explicitly and keeps the export buttons enabled, because the audio path is independent of the picture.

## Privacy and speed

Files are decoded and encoded in the page, so there is no upload and no queue. Speed depends on the length of the file and your machine, not on a server. A few minutes of video exports in seconds; an hour-long recording takes longer and uses more memory while it does. The 95-second test clip decoded and exported its 22.5-second cut in a few seconds, and most of that wait was reading the file from disk.

Closing the tab cancels the job and discards the data. Nothing is stored, so if the result matters, download it before navigating away.

## Four cases that come up weekly

The same tool, four different format decisions:

- **A voice memo recorded as video.** Speech only, usually mono and already compressed. MP3 at 128 kbps is plenty; the transcript and the listener will not tell it from the WAV.
- **A podcast guest's MP4.** Interview audio that will be edited later. Extract WAV, cut it in the editor, then encode the finished episode once.
- **A screen recording of a call.** The audio track is the point and the picture is context. Trim to the answers you need before extracting, not after.
- **A song inside a clip.** Music is the case where bitrate matters most. If the clip's audio is 96 kbps, no format choice will repair it, which is a good reason to check with the source before promising quality.

In each case the trim range does more for the result than the format does, because it removes dead air and the wrong take before anything is encoded.

## Where this fits

Extracted audio is usually a first step, and the next step changes the format choice:

- **Captions or a transcript?** WAV gives the transcriber the cleanest input; then fix the result in the [SRT Subtitle Editor](/srt-editor/).
- **A faster or slower version?** Feed the MP3 to the [Audio Speed & Pitch](/audio-speed-pitch/) tool rather than re-encoding the video.
- **A loudness boost for mobile listening?** Normalise in an editor, then compress the export once.
- **Only the first 30 seconds for a preview?** Trim on the way out, not afterwards.

The order saves a generation: cut and choose the format at the same moment, because every later conversion only subtracts.

## Checklist

- Drop the video and confirm the decoded length, channels and rate in the panel.
- Set start and end if you only need a section; leave them empty for the whole track.
- Choose WAV when the next step edits or transcribes, MP3 for listening and uploads.
- Expect the WAV rate to follow the decoded rate, not the file name.
- Download before closing the tab; nothing is kept.

One file in, one file out, no upload, and a format chosen for the next step rather than by habit. That is the whole tool, and it is enough for the job in most weeks.