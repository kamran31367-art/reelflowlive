---
title: "Video to GIF: the numbers behind a file that still loads"
description: "Four measured runs of the Video to GIF converter: 30 frames at 480 px came out at 516.6 KB, 45 frames at 640 px at 1.2 MB, and the quality slider barely moved the size. What each dial really costs."
date: 2026-11-27
categories:
  - Video
  - Social
cover: assets/img/blog/video-to-gif-size-guide/hero.webp
coverAlt: "White and blue spiral lines drawn on a dark background, a visual shorthand for a looping animation"
coverCaption: "A GIF is a loop of still frames. Everything about its file size follows from how many frames you ask for and how many pixels each one carries."
takeaways:
  - "A 3-second section at 2 s, encoded at 480 px and 10 fps, produced 30 frames and a 529,047-byte GIF, shown as Done - 516.6 KB, in 3,336 ms."
  - "The same 3 seconds at 640 px and 15 fps produced 45 frames and 1,249,210 bytes, 2.4 times the file for 2.4 times the frame-pixel count, and took 6,243 ms."
  - "GIF delays are stored in hundredths of a second, so 15 fps is written as 70 ms per frame, not 66.7, and 8 fps as 130 ms, not 125."
  - "Loop speed does not touch the capture: at 2x the tool still captured 24 frames, it just wrote a 60 ms delay so they play at six frames per second."
  - "The quality slider is not the size lever. Quality 5 came out at 203.5 KB against 201.4 KB for quality 20 on the same small clip, a 1 percent difference."
faq:
  - q: "What size GIF should I make for chat apps?"
    a: "Start at 320 or 480 px wide, 8 to 10 fps and a length of two to three seconds. In the test a 3-second 320 px clip at 8 fps was 201.4 KB, and the same length at 480 px and 10 fps was 516.6 KB. Both open instantly on a phone; the 640 px version at 1.2 MB is noticeably slower to send."
  - q: "Why is my GIF bigger than the video it came from?"
    a: "GIF has no interframe compression. Every frame is stored as a full picture with its own 256-colour palette, while an MP4 stores small differences between frames. A 3-second MP4 of the same clip is typically a few hundred kilobytes; the GIF of it was 516.6 KB at 480 px and 1.2 MB at 640 px. That is the format, not the tool."
  - q: "Does the loop speed change the file size?"
    a: "No. The tool captures exactly the window you set, then writes a per-frame delay into the GIF. At 1x and 10 fps each frame waits 100 ms; choosing 2x rewrites the same 24 captured frames to a 60 ms delay, which plays as six frames per second. The picture count and the file weight stay the same."
  - q: "Why does the tool refuse a start time at the end of the clip?"
    a: "It checks the typed time against the duration it read from the file. With a 12.00-second clip, entering 12 or more shows Start time is past the end of this video (12.00 s). A time it cannot parse, such as 0:xx, gets Start time is not a valid time. Use seconds like 2.5 or m:ss like 0:12."
  - q: "What happens if the browser cannot decode my file?"
    a: "The preview pane shows This browser cannot decode <name>. and an error line asks for an MP4 (H.264) or WebM file. Make GIF stays disabled, so a broken file cannot start a run. Some containers, such as basic .mov or screen-recording WebM with unusual codecs, decode in some browsers and not others; converting to H.264 MP4 first is the reliable fix."
---

A GIF looks like a still image that moves, but it is a stack of complete pictures, each with its own 256-colour palette, plus a header that says how long to show each one. That design is from 1987 and it is why a five-second loop can weigh more than a minute of MP4. The [Video to GIF converter](/video-to-gif/) keeps the format's limits visible: an 8-second ceiling, three widths, four frame rates. This post walks through four real runs on one 12-second 1280 × 720 test clip, all starting at 2 s with a 3-second length, and reports what the files contained.

## One clip, four runs, four different files

Every run used the same source and the same window. Only width, frame rate, loop speed and quality changed, one at a time:

| Settings | Frames | File | Encode time |
| --- | --- | --- | --- |
| 480 px, 10 fps, 1x, q10 | 30 | 516.6 KB (529,047 B) | 3,336 ms |
| 640 px, 15 fps, 1x, q10 | 45 | 1.2 MB (1,249,210 B) | 6,243 ms |
| 320 px, 8 fps, 2x, q10 | 24 | 201.4 KB (206,251 B) | 2,141 ms |
| 320 px, 8 fps, 1x, q5 | 24 | 203.5 KB (208,391 B) | 2,568 ms |

The result pane reports exactly what it made. After the first run the hint above the preview read "480 x 270 GIF", the progress line settled on "Done - 516.6 KB", and the meta rows listed Frames 30 at 10 fps and Size 516.6 KB. The height was never a setting: the tool took the source's 16:9 shape and derived 270 from the 480 width, 360 from 640, 180 from 320. You choose one number and the other follows.

<figure>
  <img src="/assets/img/blog/video-to-gif-size-guide/tool.webp" alt="The Video to GIF page after a finished run: the clip pane on the left with start, length and width settings, and the result pane on the right showing a 480 x 270 GIF and its frame and size rows" width="1072" height="861" loading="lazy">
  <figcaption>The state behind the first row of the table: 3-second length from 2 s, 480 px, 10 fps, quality 10. The pane reports 30 frames at 10 fps and a 516.6 KB file.</figcaption>
</figure>

Note that 30 frames is exactly 3 seconds times 10 fps, and 45 is exactly 3 times 15. The tool captures what you asked for and nothing else; there is no smart trimming or frame deduplication. That predictability is useful when comparing files, and it is also the first place size comes from.

## Width sets the pixel bill, twice over

Each doubling of width multiplies the pixels per frame by four, not two: 480 × 270 is 129,600 pixels, 640 × 360 is 230,400, and 320 × 180 is 57,600. Frames times pixels is the raw material the encoder has to squeeze into 256 colours.

<figure>
  <img src="/assets/img/blog/video-to-gif-size-guide/frames.webp" alt="Large flat planes of red, purple, green and blue paper overlapping at diagonal angles, each a single uniform colour" width="1200" height="675" loading="lazy">
  <figcaption>Flat fields of colour compress superbly in GIF and dither badly in gradients. A clip built from bold shapes survives the format far better than soft skies and skin tones.</figcaption>
</figure>

That is why the jump from 480 px to 640 px was the costliest change in the table: 1.5 times the width, 2.25 times the pixels per frame, 1.5 times the frames per second, and the file went from 516.6 KB to 1.2 MB. When a GIF feels too heavy, halving the width is the single biggest saving available, because it divides pixel count by four.

The 640 px ceiling is deliberate. The width buttons stop at 640, and the code clamps any value to that maximum before encoding. Chat and forum apps rarely display animated images wider than that; the extra pixels get scaled down after you have paid for them in bytes.

## Frame rate, and the hundredths problem

GIF does not store a frame rate. It stores a delay per frame in hundredths of a second, and that rounding is visible in real files. A 10 fps run is written as a 100 ms delay, which is exact. A 15 fps run cannot be: 66.7 ms lands between the format's steps, so the file carries 70 ms. An 8 fps run comes out at 130 ms rather than 125. Playback therefore drifts slightly from the nominal rate, and a 3-second capture can play a few hundredths of a second longer than the length you set.

The practical effect is that 15 fps is not 50 percent smoother than 10 fps in the file; it is 45 frames instead of 30, each shown a little longer than one-fifteenth of a second. On a small loop of movement, 10 to 12 fps already reads as animation. Reach for 15 only when the motion is fast and the clip is short enough to keep the frame count down.

## Loop speed changes the delay, not the capture

The 2x run in the table is the clearest demonstration. With width, frame rate and quality held at 320 px, 8 fps and q10, choosing 2x produced the same 24 frames as 1x. What changed was the delay written between them: 60 ms instead of 130, so the loop plays at roughly six frames per second and looks fast and slightly stepped.

In other words, loop speed is a playback instruction, and the page says so in one line under the control: "Playback speed of the GIF, not of the capture." If you want more frames of motion rather than faster playback, raise the frame rate or the length; if you want the same motion to feel quicker, 2x costs nothing in file size. The 0.5x option doubles the delays and produces a slow, deliberate loop at identical weight.

## The quality slider is not the size lever

GIF has no adjustable compression in the way JPEG or H.264 do. What the quality control changes is how aggressively the encoder quantises colour and how it dithers the result, trading palette accuracy for smaller codes, not resolution or frame count.

The fourth run tested that directly: 320 px, 8 fps, 1x, with quality dropped from 10 to 5. The result was 203.5 KB, slightly larger than the 201.4 KB quality-10 file from the same settings. On a clip this small the difference is noise; the slider is a sharpness dial more than a size dial. The page's own hint says the same thing: "Lower is sharper and larger; higher is smaller and softer." If you need a smaller file, cut frames or pixels first, and only then sweep quality from 10 upward.

## Seeking decides what the first frame looks like

Frames are captured by seeking the video to each time and drawing it to a canvas. Browsers land on the nearest frame they can decode, so the frame at "2.0 s" may actually be the frame at 1.96 s. The note under the result pane does not hide this: the first frame may differ by one frame step from the time you typed.

The visible consequence is a loop that almost closes. When a GIF jumps back from its last frame to its first, any offset between them shows as a small stutter. Starting on a still moment, or on a frame where the motion is at the same point it will be on the last frame, hides the seam far better than fine-tuning decimals ever will.

## What the browser measures before it starts

The clip pane reads the file's duration and pixel size as soon as metadata arrives, and both are enforced. Entering a start time past the end of the 12-second test clip produced "Start time is past the end of this video (12.00 s)." and a start time the parser cannot read produced "Start time is not a valid time. Use seconds like 2.5 or m:ss like 0:12." A blur on the field marks bad input with a red hint and an invalid state, so you see the problem before pressing Make GIF.

Decode failures are caught before any encoding begins. A file the browser cannot play shows "The browser cannot decode <name>. Try an MP4 (H.264) or WebM file, or convert it first." and keeps the button disabled. The type check on load only asks whether the file claims to be video; a mislabelled file that the decoder rejects ends up in the same message, which is why the fix it recommends is a conversion, not a rename.

## Sizes that work in the places GIFs live

Pulling the measured numbers into a rule of thumb:

- **Chat reactions:** 320 px, 8 fps, two to three seconds. Around 200 KB, sends instantly, plays at a glance.
- **Forum and support threads:** 480 px, 10 fps, three seconds. Around 500 KB, the classic compromise.
- **Blog posts and docs:** 640 px, 10 to 12 fps, keep it under three seconds. Expect 1 MB and up; treat it as a small video, not an image.
- **Email signatures and slide decks:** 320 px, 8 fps, one to two seconds. Most mail clients cap images at a few hundred kilobytes.

One more check before you commit: loop the finished GIF twice, once watching the motion and once watching the numbers. If the file is over budget, halve the width before touching anything else; if it looks stepped, raise the frame rate before the width. And if the destination accepts video at all, an MP4 of the same clip will be a fraction of the size with better colour, and the [Video Trimmer](/video-trimmer/) makes those cuts without an upload.