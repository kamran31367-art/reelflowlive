---
title: "Trimming without uploading: what the recorder really saves"
description: "A 3-second cut from a 12-second clip finished in 3.3 seconds and produced a 2,691,049-byte MP4 with H.264 video and mono AAC audio at 6.9 Mbps. A measured walk through the Video Trimmer, including the quiet corrections it makes to typed times."
date: 2026-11-27
categories:
  - Video
  - Editing
cover: assets/img/blog/trim-video-without-upload/hero.webp
coverAlt: "A video editing timeline on a large monitor, with coloured clips stacked across several tracks"
coverCaption: "A trim tool promises to keep the file on your device. The interesting part is how the output is made: not by copying bytes, but by playing the section once and recording it again."
takeaways:
  - "A 2 s to 5 s cut of a 12-second 1280 × 720 clip finished in 3,323 ms and produced a 2,691,049-byte MP4, labelled Done - 0:03.0 clip, 2.6 MB."
  - "The export is a fresh recording, not a copied byte range: ffprobe read back a 3.134-second file, H.264 video plus 48 kHz mono AAC audio, at 6,869,229 bits per second."
  - "That bitrate is higher than the source: the 12-second original was 3.8 MB, about 2.6 Mbps, so the short clip is denser per second than the file it came from."
  - "Typing 0:01,5 in the End box was accepted as 0:01.5, and the clip length updated to 0:03.5 with the start still at 0:02.0."
  - "An end time earlier than the start is corrected without a message: 0:02.0 to 0:01.0 became a 0.1-second clip ending at 0:02.1."
faq:
  - q: "Does the Video Trimmer upload my file anywhere?"
    a: "No. The browser reads the file straight from disk, plays it in a video element and records that element with MediaRecorder. The dropzone note says the file stays on your device, and the finished clip is built in memory before it is offered as a download. Nothing crosses the network, which is why the page works with Wi-Fi switched off after it loads."
  - q: "Why is my trimmed file larger than the part I cut out?"
    a: "Because the tool records the section again at a fixed target of 6 Mbps rather than copying the original bytes. In the test the source averaged about 2.6 Mbps, so a 3-second cut came out at 6.9 Mbps and 2.6 MB. Expect a small clip to carry more data than the same seconds of the original, and run it through a compressor if size matters."
  - q: "The label said 0:03.0 but the file plays 3.13 seconds. Why?"
    a: "The recorder starts slightly before the section and stops shortly after it, and the browser rounds the container duration up to the next block. The 0:03.0 on screen is the range you chose, not a frame-accurate guarantee. For cutting that must land on an exact frame, use a desktop editor such as the one built into ReelFlow Live."
  - q: "Will the export be MP4 or WebM?"
    a: "It depends on the browser. The tool asks for MP4 with H.264 and AAC first; Chrome answered yes and wrote an MP4. Browsers that cannot record MP4 fall back through WebM with VP9 or VP8, and the downloaded file is named with the right extension either way."
  - q: "Why did the audio come out mono at 48 kHz?"
    a: "That is what Chrome's recorder produced from the played element in this test. The tool does not set channel or sample-rate options; it captures the stream of whatever the browser decodes. Stereo sources usually stay stereo, but treat the layout as the browser's choice, not a setting on the page."
---

Most trim tools ask you to drag a file onto a page, wait for an upload and then wait again for a server to cut it. The [Video Trimmer](/video-trimmer/) does none of that. It loads the file from disk into a video element, plays the section you pick and records that playback in the browser. The result is a new file, not a slice of the old one, and that distinction explains almost everything odd about the output. This post is a measured walk through one real session: a 12-second test clip, a three-second cut, and an `ffprobe` run on the result.

## What the page reads before you pick a range

Dropping `clip12.mp4` on the source pane filled four rows: **File** clip12.mp4, **Size** 3.8 MB, **Length** 0:12.0 and **Frame size** 1280 x 720. The hint under the preview changed from the placeholder to "0:12.0 clip". Only after metadata arrives do the sliders unlock, which is why the Start and End fields are greyed out on a fresh load and the note says: "Choose a video first. Times accept 12.5 or 1:02.5."

The acceptance list in the pane header is MP4, WebM and MOV. The check is only that the file's type starts with `video/`; anything else triggers a short toast, "Choose a video file", and leaves whatever was loaded before untouched. A wrong file never wipes a good session.

## Why a trim takes as long as the clip plays

There is no cutting here in the frame-accurate sense. The tool calls `captureStream()` on the video element, hands the stream to `MediaRecorder` and presses play. The recorder runs until the playhead crosses your end time, then it stops and the collected chunks become a Blob.

That design has two consequences worth knowing before you start:

- **Time is one to one.** The page says it plainly: "The clip is recorded as it plays, so a 20-second section takes about 20 seconds. Keep this tab open until it finishes." A 3-second cut of the test clip finished in 3,323 ms, which is the section plus the seek and the final flush.
- **You must not touch the tab.** The recording follows the element, not a background job. Switching tabs can throttle the page timer that decides when to stop, so the progress bar is the thing to watch.

The progress label counts up "Recording 12% … 46% …" in steps of about 120 ms, and the fill bar follows. If the recorder errors mid-run, the message names the error type rather than freezing silently.

<figure>
  <img src="/assets/img/blog/trim-video-without-upload/phone-editing.webp" alt="Hands holding a strip of 35 mm film up to warm light against an orange background" width="1200" height="675" loading="lazy">
  <figcaption>Cutting film physically meant splicing strips; cutting in the browser means replaying a range and recording it again. The visible result is similar, the mechanism is not.</figcaption>
</figure>

## The measured run: 0:02.0 to 0:05.0

The sliders were set to Start 0:02.0 and End 0:05.0, and the grey note under them read "Clip length: 0:03.0". One press of **Trim video** produced this sequence:

1. The source player seeked to 0:02.0, briefly showed "Preparing…", then played unmuted so its sound reached the recorder.
2. The bar moved for roughly three seconds with the label "Recording… keep this tab open".
3. The recorder stopped just before 0:05.0, the source paused, and the label turned into **"Done - 0:03.0 clip, 2.6 MB"**.
4. The output player filled with the trimmed video and the **Download trimmed clip** button enabled. The file was offered as `clip12-trimmed.mp4`.

The finished Blob measured 2,691,049 bytes with the MIME type `video/mp4`. The Reset button next to the download clears everything, including the sliders, back to the "Choose a video first" state.

<figure>
  <img src="/assets/img/blog/trim-video-without-upload/tool.webp" alt="The Video Trimmer with a 12-second test clip loaded, Start at 0:02.0 and End at 0:05.0, and a finished 3-second MP4 shown below a progress bar reading Done" width="1072" height="725" loading="lazy">
  <figcaption>The measured session: 12 seconds in, 3 seconds out, and a bar that finished at "Done - 0:03.0 clip, 2.6 MB". The remaining tab had to stay open for the whole recording.</figcaption>
</figure>

## What the exported file actually contains

Because the output is a fresh recording, its internals are the browser's choices, not the source's. Running `ffprobe` on the downloaded clip told the rest of the story:

- **Duration 3.134 seconds**, slightly over the 3.0 on the label, because the recorder begins a touch early and the container rounds its last packet up.
- **H.264 video at 1280 × 720**, the same frame size as the source, with no scaling or letterboxing.
- **AAC audio at 48 kHz, mono**, carried over from the played element.
- **Bitrate about 6,869,229 bits per second**, against roughly 2.6 Mbps in the 12-second original.

That last number is the one people find surprising. The page asks the recorder for a target of 6 Mbps, so a short clip can be heavier per second than the file it was cut from: 2.6 MB of output from a section that weighed about 1 MB inside the original. The trade is simplicity and privacy for size. If the clip is headed for a chat app or a captions workflow, a compression pass afterwards is normal.

## Typed times, commas and quiet corrections

The text boxes beside the sliders accept several formats, and the tests exercised each:

- `12.5` is read as twelve and a half seconds. A plain number is seconds.
- `1:02.5` is read as one minute, two and a half seconds. More colon groups keep multiplying by sixty.
- `0:01,5` was accepted and normalised to `0:01.5`. A comma is treated as a decimal point, which helps anyone used to European decimal commas.

The corrections matter more than the formats. Values are clamped, not rejected: a start past the end of the file lands on the last tenth of a second, and an end of 0:01.0 under a start of 0:02.0 was silently replaced with 0:02.1, producing "Clip length: 0:00.1". No error appears in that case, so if a clip comes out suspiciously short, look at the two boxes before blaming the recorder. The only explicit range error, "The end time must be after the start time", is effectively unreachable through the sliders because the same clamping runs first.

## When the decode fails

Two failure paths are worth knowing because they look different on screen:

- **A file that is not a video at all** stops at the dropzone with the toast "Choose a video file". The previous clip stays loaded.
- **A real-looking MP4 the browser cannot decode**, in the test a file renamed to `fake.mp4`, is accepted at the dropzone and then fails at the player. The hint under the preview changes to "Cannot play this file" and a second line explains: "Cannot decode this video. Try an MP4 with H.264."

There is also a browser gate at load time. If `MediaRecorder` is missing or cannot record any of the accepted codecs, the page says so up front — "This browser cannot record video, so trimming is not available here." — instead of letting you set a range that could never finish.

## What it does not do

The tool is honest about being a recorder rather than a cutter, and the limits follow from that:

- **No frame-accurate cuts.** The start and end land within a keyframe interval, not on a chosen frame. For frame-precise edits, take the clip into a timeline editor.
- **No re-timing.** Everything between start and end plays at normal speed. Slowing, speeding and re-framing belong to other tools.
- **No audio-only export.** The sound is kept, but extracting it as an MP3 is a separate job — the [Audio Extractor](/audio-extractor/) handles that.
- **One range at a time.** There is no queue and no batch, by design: each session records live, and stacking jobs would fight over the same player.

## Where to go next

The recording approach works best for everyday cuts: trimming a phone clip before sending it, shortening a screen recording before subtitling, or lifting one moment out of a long take for a thumbnail. From a trimmed clip, the natural next steps are grabbing a still with the [Video Frame Grabber](/video-frame-grabber/), turning a short loop into an animation with [Video to GIF](/video-to-gif/), or writing subtitles against the new, shorter runtime in the [SRT Editor](/srt-editor/). If the clip is going to YouTube, add timestamps with the [YouTube Chapters](/youtube-chapters/) tool, or share a jump-to link built with the [Timestamp Link](/youtube-timestamp-link/) tool.

The short version: pick the range, keep the tab open, and expect a file that is a faithful re-recording — slightly longer than the label, denser than the original, and never a byte-for-byte copy. That is the price of never letting the file leave your machine, and for most quick cuts it is a very good price.