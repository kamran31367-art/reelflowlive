---
title: "Mirror your webcam and save the view as a PNG"
description: "Start a user-facing webcam preview locally, flip the mirror, stop the camera and save a snapshot as a PNG without recording or uploading video."
date: 2026-11-27
categories:
  - Video & Audio
cover: assets/img/blog/webcam-mirror/hero.svg
coverAlt: "A mirrored webcam preview with flip controls and a saved camera snapshot"
coverCaption: "Mirroring changes how the preview reads, not what the camera captures. The snapshot uses whichever view you have selected."
takeaways:
  - "The main Start camera button reveals the camera controls; the Start camera button inside the preview requests camera access."
  - "The live view starts mirrored, requests video without audio, and prefers a user-facing camera when one is available."
  - "Flip switches between mirrored and unmirrored preview, and that choice is applied to the next PNG snapshot."
  - "Save snapshot downloads webcam-snapshot.png at the video element's native width and height."
  - "There is no video recording, camera selector, resolution control or gallery; Stop ends the stream and hides snapshot controls."
faq:
  - q: "Is my webcam video uploaded?"
    a: "No. The tool requests a local media stream and assigns it to a video element in the page. The camera code does not send the stream to a server. A snapshot is created locally and downloaded as a PNG."
  - q: "Why is the camera black or unavailable?"
    a: "Check the browser's site permission, the operating-system camera setting and whether another application is holding the camera. The page also needs a supported secure context, normally HTTPS or localhost. Access failures appear as a toast."
  - q: "Does Flip change the saved image?"
    a: "Yes. Flip changes the live preview and the next snapshot. In mirrored mode the canvas is horizontally flipped before the PNG is created; in unmirrored mode the frame is saved as supplied by the camera."
  - q: "Can I record video or choose a different camera resolution?"
    a: "No. This tool provides a live preview, Flip, Stop and still snapshots. It does not record clips, expose a camera list or set resolution, frame rate, zoom, filters or audio."
draft: false
---

A webcam preview can feel backwards even when the camera is working correctly. The [Webcam Mirror Online](/webcam-mirror/) tool gives you a mirrored live view, a Flip control and a local PNG snapshot. It is useful for checking framing, demonstrating a physical setup or capturing a quick still without installing an app or recording a clip.

## When a mirrored preview helps

Mirroring matches the way people commonly expect to see themselves: move your hand to the right and the preview responds in a familiar direction. That makes it practical for checking hair, headroom, lighting and the position of a product held near the camera.

Text is the important exception. A mirrored preview reverses writing, logos and labels. Flip to the unmirrored view before judging those details or saving a snapshot for documentation. The mirror is a presentation choice, not a correction to the camera's raw image.

## Start the camera and grant access

There are two **Start camera** actions. First press the main button in the tool's input pane. This renders the camera workspace in the result pane. Then press **Start camera** inside that workspace to request access. The browser or operating system may show a permission prompt; access is requested only after this second action.

The request is for video with `facingMode: "user"` and no audio. The facing mode is a preference, not a promise that a particular camera will be chosen. Once playback begins, the inner Start button is hidden and **Stop** and **Save snapshot** appear. If permission is denied or no stream can be opened, a toast reports the browser's error and the start control becomes available again.

<figure>
  <img src="/assets/img/blog/webcam-mirror/workflow.svg" alt="Workflow from webcam controls through local camera access to a mirrored preview and PNG snapshot" width="1200" height="675" loading="lazy">
  <figcaption>The main action opens the camera workspace, the inner action requests a local stream, and Save snapshot turns the selected mirrored or unmirrored view into a PNG.</figcaption>
</figure>

## Use Flip and Stop deliberately

The preview starts mirrored. **Flip** toggles a horizontal CSS transform, switching to the unmirrored view on the next press and back again on the following press. The button is visible even before the camera starts, but it has no useful effect until a stream is displayed.

**Stop** ends every track in the active stream, clears the video source and hides Stop and Save snapshot. It also brings the inner Start camera button back. Press Stop when the check is finished rather than leaving a live preview running while you move to another task. **Reset** also runs the camera cleanup; switching back to the main Start action replaces the workspace and releases its stream.

## Worked example: checking a product label

Suppose you are photographing a small box for a support article. Start the camera, allow access and position the box so its label fills enough of the frame to read. In the default mirrored preview, the lettering appears reversed. That is expected and does not mean the camera has altered the label.

Press **Flip** once to inspect the label in its true orientation. If your camera supplies a 1280 × 720 video stream, the saved PNG will also be 1280 × 720 because the tool uses the video element's native dimensions. Press **Save snapshot**, open `webcam-snapshot.png`, and check focus, crop and background before placing the image in your article. Stop the camera as soon as the still is saved.

<figure>
  <img src="/assets/img/blog/webcam-mirror/example.svg" alt="Worked webcam example showing camera controls, a flipped live preview and a snapshot output" width="1200" height="675" loading="lazy">
  <figcaption>The worked check uses Flip to read a product label correctly, then saves one still. The camera remains a live local preview rather than a recording.</figcaption>
</figure>

## Snapshot output and file behaviour

Save snapshot draws the current video frame onto a canvas and downloads it as `webcam-snapshot.png`. If mirroring is active, the canvas is flipped before drawing, so the orientation is baked into the file. If it is off, the camera frame is saved directly. The PNG is lossless and keeps the native video dimensions; no resizing or quality setting is applied.

The outer **Download** and **Copy** buttons are disabled for this tool. Snapshot saving is handled by the control inside the preview. There is no gallery or filename field. Saving several stills uses the same base filename, and the browser may add a number to avoid overwriting an existing download. Download the file you need before starting another session or clearing the page.

## Camera and browser limitations

The tool does not list available cameras or expose resolution, frame rate, zoom, aspect ratio, brightness, background effects or audio controls. A `user` facing-mode preference may fall back to another camera or behave differently on a phone. Actual dimensions depend on the stream supplied by the browser and device.

Save snapshot becomes available after playback starts, but the handler returns without saving if the video has no dimensions yet. A black preview can therefore mean permission is still being resolved, playback has not started or the camera is obstructed. The status text is not a recording indicator; use the visible Stop and Save snapshot controls to confirm that a stream is active. There is no countdown, timer or video recording feature.

## Common mistakes to avoid

Do not press the main Start camera button once and assume permission has been requested; the preview has its own start action. Do not judge writing or clothing graphics in mirrored mode. Do not expect the disabled Download button to save the camera stream. Finally, do not treat a snapshot as private merely because it was created locally: check what documents, screens, family members or identifying details appear behind you.

Repeated snapshots can also create confusing filenames in a busy downloads folder. Open each PNG, give it a meaningful name in your normal file workflow and remove anything you did not intend to keep. The tool does not manage that archive for you.

## Permission, privacy and cleanup

Camera access normally requires a secure browser context and an explicit user action. Permission can be blocked at either the site or operating-system level, and another application may prevent the camera from opening. Denial is reported as a toast rather than a settings tutorial, so check those layers separately when the preview stays empty.

The camera handler requests no microphone and does not upload the stream. The preview exists only in this tab, and Stop releases the hardware tracks. Reset runs the camera cleanup, and the browser releases page media when the tab closes, but make Stop your deliberate final step. Browser camera indicators and operating-system privacy controls remain the authoritative signs of whether the camera is active.

## Workflow and checklist

Prepare the scene before opening the camera so permission time is not spent adjusting the room. Then start, orient, capture and stop in one short sequence.

- Use a supported browser on HTTPS or localhost and check site camera permission.
- Press the main Start camera, then the preview's Start camera.
- Frame the subject and improve lighting before taking the still.
- Use Flip when reading text or checking a label's true orientation.
- Save the PNG, open it and verify focus, orientation and background.
- Press Stop, then rename and store the snapshot in your normal workflow.

A mirrored view is most useful as a framing aid. Flip for accuracy, save only the still you need, and release the camera when the check is complete.
