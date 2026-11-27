---
title: "The tape effect on audio: speed and pitch measured together"
description: "A 60-second stereo file at 2x came out at 0:30 and 5,760,044 bytes, a 440 Hz tone measured 880.0 Hz in the export, and the panel's pitch row still read 0 st. What that means for length, pitch and the waveform PNG."
date: 2026-11-27
categories:
  - Audio
cover: assets/img/blog/speed-audio-tape-effect/hero.webp
coverAlt: "A TDK SA90 cassette seen from the front, black shell with a white and gold label, on a plain white background"
coverCaption: "The tape effect is named after this object: play the same tape faster and the voice rises while the song gets shorter, in one motion."
takeaways:
  - "2x on a 60-second stereo file produced a 0:30 output in the panel and a WAV of 5,760,044 bytes that measured exactly 30.000 seconds."
  - "The pitch slider multiplies into the same factor: 1.5x with +3 semitones showed 1.78x and 0:34, and 2x with +6 semitones showed 2.83x and 0:21."
  - "In the 2x export a 440 Hz tone measured 880.0 Hz, an exact octave, while the pitch row still read 0 st because it reports the slider, not the total shift."
  - "The waveform PNG exports at 2400 by 720 pixels, with the file name, the total length and a 0:00 label drawn into the image, at 89.5 KB."
  - "There is no time-stretch anywhere in the tool: speed and pitch cannot be separated, so fitting a voiceover into a shorter slot will change how the person sounds."
faq:
  - q: "Can I change the speed without changing the pitch?"
    a: "Not in this tool, and the note under the controls says so in plain words: this is a tape-style change with no time-stretching. A speed change that keeps the voice identical needs a time-stretch algorithm, which lives in video and audio editors rather than here. Use this page when the pitch movement is acceptable or wanted."
  - q: "Why does doubling the speed raise the pitch by an octave?"
    a: "Because the same samples are played twice as fast, every frequency in the file doubles. A 440 Hz tone becomes 880 Hz, which is exactly twelve semitones, one octave. In the measured session the export's dominant frequency read 880.0 Hz against 440.0 Hz in the source, so the change is not approximate."
  - q: "Does the tool upload my file?"
    a: "No. The file is decoded in the tab by the browser's own audio decoder and re-rendered there by the offline audio engine. Nothing is sent anywhere, which also means an hour-long file is limited by your device's memory rather than by an upload size."
  - q: "Can I load a video instead of an audio file?"
    a: "Yes. The dropzone accepts MP4, MOV and WebM as well as MP3, WAV, M4A and OGG, and the browser pulls the audio track out of the video. Only audio comes back out: the export is a WAV of the sound, never a video file."
  - q: "Why does the sample rate read 48 kHz when my file is 44.1 kHz?"
    a: "The browser decodes into its own audio context, which usually runs at the device rate of 48 kHz, and the export is rendered at that same rate. The row shows the decoded rate, not the header of your file. For speech and music sharing the difference is inaudible; the trade is that the WAV carries a rate your original did not."
---

Two different things get called changing the speed of audio. One squeezes time and keeps the voice; the other plays the same samples faster, so time shortens and pitch rises together. The [Audio Speed & Pitch tool](/audio-speed-pitch/) does the second, the tape effect, and this post is a measured walk through a real session so the numbers behind the panel are visible.

## Two controls, one multiplier

The input side reads a video or audio file and shows four rows: name, duration, channels and sample rate. Below them sit a speed row with presets at 0.5x, 0.75x, 1x, 1.25x, 1.5x and 2x, and a pitch slider that runs from -6 to +6 semitones in half steps.

The two are not independent. They multiply into one playback factor: speed times 2 to the power of semitones divided by 12. In the test, 1.5x alone would be a factor of 1.50; adding +3 semitones (a factor of about 1.19) turned it into the 1.78x the panel showed. The readout under the controls names this directly: playback factor, output length, pitch shift.

<figure>
  <img src="/assets/img/blog/speed-audio-tape-effect/tool.webp" alt="The Audio Speed and Pitch tool with a 60 second stereo file loaded, 2x selected, a waveform across the panel and an output length of 0:30" width="1072" height="649" loading="lazy">
  <figcaption>The measured session: a 1:00 stereo file at 2x showed a 2.00x factor and a 0:30 output, and the exported WAV measured 30.000 seconds.</figcaption>
</figure>

## What the tape effect does to length

Length is the simplest consequence: the output is the source duration divided by the factor. In the test the source was exactly one minute, 60.00 seconds, stereo, and the panel reported:

- **1x, no pitch:** factor 1.00x, output 1:00 (was 1:00), with the hint reading original timing.
- **2x:** factor 2.00x, output 0:30 (was 1:00).
- **0.5x:** factor 0.50x, output 2:00 (was 1:00).
- **2x with +6 semitones:** factor 2.83x, output 0:21.
- **1.5x with +3 semitones:** factor 1.78x, output 0:34.

The clock rounds to whole seconds, so 0:34 stands for 33.7 seconds. That is a display choice, not an error: the WAV itself is rendered to the exact frame count, and the 2x export measured 30.000 seconds against 30 seconds predicted.

The pattern worth keeping: moving the pitch slider always shortens a sped-up file further, and always lengthens a slowed one. At 0.5x with -6 semitones, both levers point the same way and the result is longer than either lever alone would give.

## The pitch row reports the slider, not the total

Here is the honest oddity in the panel. At 2x the pitch row read **0 st**, while the audio underneath had gone up a full octave. The row shows the semitone slider's own value, not the pitch change the speed introduces, and the difference is 12 semitones at this setting.

The measurement: the test file opens with a sustained 440 Hz tone. Analysing the exported `test-loop-60s-2x.wav` over its first second found a dominant frequency of **880.0 Hz**, against **440.0 Hz** in the source. Exactly double, exactly one octave, with the panel showing 0 st beside it.

That is not a bug so much as a division of responsibility: the readout answers "what did I set on this slider", and the note under the controls answers "what will happen to the sound". Both are true, and a reader who only watches the number would misread the effect. The safe habit is to trust the factor and the length, and to remember that speed itself carries pitch.

## What the exported WAV contains

The export at 2x saved as `test-loop-60s-2x.wav`, 5.5 MB, measured 5,760,044 bytes. The header reads stereo, 48 kHz, 1,440,000 frames, which is 30.000 seconds exactly. It is standard 16-bit PCM, so anything that opens a WAV opens this.

Two details in that sentence deserve their own line. The name is the source name plus the factor, with a trailing zero trimmed, so 2x gives `-2x` and a fractional setting gives something like `-1.78x`. And the file is 48 kHz even though the source was written at 44.1 kHz, because the browser decodes into its audio context at the device rate and the export follows that rate. The panel's sample rate row shows the decoded rate for the same reason.

The render runs in an offline audio engine, which is why a longer file takes a moment and the progress bar exists. The percentage is an estimate paced by the expected duration, not a frame counter, so it can sit still for a beat and then finish.

## The waveform image

The second download button draws the loaded audio on a white card at 2400 by 720 pixels and saves it as `test-loop-60s-waveform.png`, 89.5 KB in the test. The card carries the file name and total length at the top, the peaks in blue across a 180 pixel band, and 0:00 and the end time along the bottom edge.

One detail shows up when you look at a short clip: below one minute, the waveform is drawn inside a fixed one-minute window and centred, with the empty margins dimmed. A twelve-second clip occupies a fifth of the width instead of being stretched edge to edge, so two cards from the same page stay comparable and the real length is visible at a glance.

That makes the PNG useful for podcast cover art, show notes and article headers, where a waveform strip says more about the content than a stock microphone photo. Export the image before changing the speed if the picture should describe the original; after, if it should describe the export.

<figure>
  <img src="/assets/img/blog/speed-audio-tape-effect/console.webp" alt="A close view of a mixing console with rows of faders, knobs and lit buttons fading into the background" width="1200" height="675" loading="lazy">
  <figcaption>Speeding up a mix is a resample: the same samples move past faster, which is why the pitches rise with the tempo.</figcaption>
</figure>

## When tape is right, and when it is wrong

**The right cases** are the ones where the movement is the point: the chipmunk or slowed-and-reverbed voice meme, a quick pitch check to hear a melody an octave down, and nightcore-style edits where everything rising together is the style. Slowing speech slightly also helps some listeners follow fast narration, with the caveat that the voice deepens.

**The wrong cases** all share one problem: a demand that the pitch not move.

- A voiceover that must fit a shorter slot and still sound like the same person needs time-stretch, not tape. This page will make the speaker sound like someone else.
- A music edit that must keep its key needs a tempo change with pitch locked, which a video editor's rate control does better.
- Transcription prep wants the original; faster speech is harder for both people and models.
- Repeated passes compound. Each tape-style pass resamples again, so undo a wrong pass on a copy rather than stacking corrections.

## Failures and limits

A file the browser cannot decode fails loudly. A text file renamed to `broken.wav` produced a message that quoted the file name, listed the codecs the browser does handle (MP4, WebM, MP3, WAV, M4A, OGG) and disabled both download buttons. The panel did not keep the previous file's numbers pretending they applied to the new one.

Two quieter limits: one file at a time, with a toast telling you to wait if a render is still running, and no time-stretch option anywhere, which is a design decision rather than a missing feature. There is also no trim and no MP3 export; the WAV is uncompressed, so a long export at 48 kHz stereo is large by nature.

## A working order

1. Load the file and read the duration and channels before touching the controls, so the expected length is easy to compute.
2. Choose the factor first: pick the speed preset, then adjust pitch by small steps if the movement should be stronger.
3. Check the output length against your slot, remembering the clock rounds to whole seconds.
4. Download and listen at the start, the middle and the end; speed changes can clip a fade that sat exactly at the edge.
5. Export the waveform PNG from whichever state the picture should describe.

For the neighbouring jobs, the [Audio Extractor & Trimmer](/audio-extractor/) pulls audio out of a video and trims it without touching pitch, the [Video Trimmer](/video-trimmer/) cuts the clip itself, and the [SRT Subtitle Editor](/srt-editor/) is where timings must be rewritten if a faster version replaces the original in a published video.