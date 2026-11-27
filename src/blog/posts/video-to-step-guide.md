---
title: "Turn a video into a step-by-step guide with timed frames"
description: "Sample a local video at fixed intervals, add one note per step, and download a self-contained HTML guide with embedded frames and timestamps."
date: 2026-11-27
categories:
  - Video & Audio
cover: assets/img/blog/video-to-step-guide/hero.svg
coverAlt: "A sequence of video frames connected to numbered steps in a browser-based guide"
coverCaption: "The guide is built by sampling time, not by understanding actions. Your notes turn a regular sequence of frames into instructions."
takeaways:
  - "Choose one browser-decodable video, an interval from 1 to 300 seconds, and optional notes with one line per step."
  - "Sampling starts at 00:00 and continues at fixed intervals while the time is below the video duration, up to 120 steps."
  - "Frames wider than 960 pixels are scaled down to 960 pixels; smaller frames keep their source width."
  - "The download is video-step-guide.html with JPEG frames embedded as data URLs, so it does not depend on the original video."
  - "Notes can be edited after export in an HTML or text editor; the tool page itself has no editing controls for the generated steps."
faq:
  - q: "Does the tool upload my video?"
    a: "No. The file is opened through a local object URL and sampled in the browser. The resulting HTML is built in memory and offered as a download."
  - q: "Can I edit the guide on the tool page?"
    a: "Not after generation. The notes textarea supplies one line per step before you build, and the preview is read-only. For changes, download the HTML and edit it in an HTML or text editor, or return and rebuild with revised notes."
  - q: "Which video and output formats are supported?"
    a: "Input depends on what the browser can decode, commonly H.264 MP4, WebM and supported MOV files. The downloadable guide is HTML with embedded JPEG frames; there is no PDF, DOCX, Markdown or video export."
  - q: "Why is a step missing, repeated or not on the exact action?"
    a: "Frames are taken on a fixed clock, not at detected scene changes. The first frame can be black, a seek can time out, and a long video stops at the 120-step cap. Choose a shorter clip or interval that places samples close to the actions you need."
draft: false
---

A screen recording can show a process clearly and still be awkward to follow as a written procedure. The [Video to Step-by-Step Guide](/video-to-step-guide/) takes frames at fixed intervals and pairs them with your notes. It does not watch the video or infer the actions; it gives you a timed visual skeleton that you can turn into instructions.

## When fixed-interval frames are enough

This approach suits demonstrations with a predictable rhythm: opening a settings panel, changing an option, previewing a result and confirming the change. It also works for a short product walkthrough where a frame every ten seconds is close enough to the important moments.

It is less suitable for fast editing or uneven procedures. If important actions are separated by long pauses, trim the source into focused clips and build separate guides rather than relying on one coarse interval.

## Set the video, interval and notes

Select one video in the **Video** dropzone or file picker. The field advertises `video/*`; actual decoding still depends on the browser. **Seconds between steps** defaults to `10` and advertises a range of `1` to `300` with a step of `1`. Use a whole number inside that range as an instruction, not as a guarantee of validation: the operation does not add its own range check.

**Step notes (one per line)** is optional. Write one instruction per line in the same order as the planned frames, then press **Build guide**. The button is disabled and reads **Working…** while the operation runs. Changes do not rebuild automatically; press **Build guide** again. **Reset** clears the form and preview but does not cancel extraction already in progress.

<figure>
  <img src="/assets/img/blog/video-to-step-guide/workflow.svg" alt="Workflow from a local video and guide settings through frame sampling to a step-by-step HTML guide" width="1200" height="675" loading="lazy">
  <figcaption>A local video is sampled on a fixed interval, each frame is paired with the corresponding note, and the rows are packaged as a standalone HTML guide.</figcaption>
</figure>

## Worked example: a 45-second settings demo

Use a 45-second H.264 MP4 showing a four-part export process. Set **Seconds between steps** to `10` and enter these five note lines:

```text
Open the project panel.
Choose Export settings.
Select 1080p.
Start the render.
Check the finished file.
```

The sample times are `00:00`, `00:10`, `00:20`, `00:30` and `00:40`. The tool does not add a step at `00:45`, because sampling runs only while the current time is less than the duration. If the source is 1280 × 720, each frame is scaled to 960 × 540.

After building, the status reads `5 steps created`. The preview shows five rows, each with its timestamp, JPEG frame and note. Press **Download** to save `video-step-guide.html`. The downloaded page has the generic title **Step-by-step guide**, five embedded images and the same instructions; it does not need the MP4 to display them.

<figure>
  <img src="/assets/img/blog/video-to-step-guide/example.svg" alt="Worked video guide example showing a video input, a ten-second interval and a step-by-step guide result" width="1200" height="675" loading="lazy">
  <figcaption>A 45-second source sampled every ten seconds produces five rows, from the opening frame at 00:00 through the final check at 00:40.</figcaption>
</figure>

## What the downloaded guide contains

The output is a complete HTML document with inline CSS and base64 JPEG images. It opens directly in a browser and can be hosted as a static page. The frames are embedded, but the file can become large.

The preview uses the same step rows. **Copy** produces timestamp-and-note text, with missing notes left blank; it does not copy images or full HTML. **Download** saves the visual guide. Individual frames, PNG, PDF, Word and Markdown are not offered.

## How frames and timestamps are chosen

Sampling begins at zero, then adds the interval repeatedly. Times are formatted as whole seconds with two-digit minutes and seconds. There is no scene detection, motion analysis or attempt to identify the start of an action. A 75-second video sampled every ten seconds therefore yields times at `00:00` through `01:10`, not a final frame at `01:15`.

For each sample, the tool seeks the hidden video element, waits for the `seeked` event and allows up to 1.2 seconds before continuing. It draws the current video frame to a canvas. Only downscaling is applied: the target width is at most 960 pixels, and height is rounded proportionally. JPEG quality is fixed at `0.78`; there is no resolution or quality control on the page.

## Notes and editing after export

Notes are split on line breaks and assigned to steps by position. The first line belongs to the first frame, the second to the second, and so on. A missing or blank line receives the preview placeholder `Step N: describe what happens here.` Extra lines beyond the available steps are ignored.

The word editable describes the exported HTML, not an editor inside the tool. Open the downloaded file in a text or HTML editor to change headings, wording, styling or image layout. If you only need to revise the note list, return to the tool, update the textarea and rebuild. Keep a copy of the original video and notes so you can reproduce the guide after changes.

## Limitations and edge cases

Metadata must load within ten seconds, and the duration must be finite and greater than zero. Unsupported codecs produce `This video could not be decoded.` A source without usable video dimensions may fail during canvas capture. Sampling stops after 120 steps even if the video is longer, so a long recording can omit its ending entirely. A zero or blank interval can repeat the opening frame until that cap is reached.

There is no audio in the guide, no source-video preview on the page and no progress bar. The first frame may be black or a fade. A timed-out seek still captures whatever frame is available, so review every step before publishing. Large sources and many embedded frames can consume substantial memory and take time because each sample requires a seek. Keep the tab active and let the build finish rather than assuming Reset has aborted it.

## Common mistakes, performance and privacy

Do not choose an interval from the video's average pace when one short action is the point of the guide. Do not write more note lines than expected steps and assume they will all appear. Do not publish placeholder notes, and do not call the result an automatic transcription: the tool has no speech recognition or action detection.

The video is processed locally with browser APIs and is not uploaded by the operation. There is no camera or microphone permission. Performance depends on the device, codec, file length and number of seeks, not on a remote queue. Download the HTML before closing or resetting the page; the generated Blob and preview are held in the current session only.

## Workflow and checklist

Prepare the source before opening the tool. Trim dead time, decide what a reader must see at each step, and write instructions that describe outcomes rather than mouse movement. Then sample, inspect and revise.

- Choose a short, browser-decodable video with visible actions.
- Estimate the step count as the duration divided by the interval, remembering the 120-step cap.
- Put exactly one useful note on each line, in frame order.
- Build the guide and inspect every timestamp, frame and note.
- Download the self-contained HTML and edit its generic title or layout if needed.
- Test the exported file in a browser without relying on the original video.

The result is strongest when the video supplies evidence and your notes supply the explanation. Fixed-interval sampling handles the extraction; clear editorial work turns it into a guide someone can follow.
