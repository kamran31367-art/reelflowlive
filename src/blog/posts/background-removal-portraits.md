---
title: "Clean background removal for portraits and product shots"
description: "An on-device model cuts people out of photos in the browser. What it does well, where edges get soft, and the lighting that makes the mask easy."
date: 2026-11-27
categories:
  - Images
  - Design
cover: assets/img/blog/background-removal-portraits/hero.webp
coverAlt: "A person seated on a stool against a plain grey studio backdrop"
coverCaption: "A plain backdrop is half the work: the mask only has to separate one subject from flat tone."
takeaways:
  - "The model is trained on people, so portraits and product shots with a person work best."
  - "Cut strength decides how much of the uncertain edge counts as subject; edge softness decides how gradually it fades."
  - "Hair is the hard case for every mask, and a contrasting background beats any slider."
  - "The download is a transparent PNG at the original resolution, and the photo never leaves the device."
faq:
  - q: "Does the background remover send my photo to a server?"
    a: "No. The segmentation model is downloaded once and then runs inside the browser tab, and the image itself is read from disk by the page and never uploaded. After the first visit the model comes from the browser cache, so the tool also works without a network connection."
  - q: "Why does it cut objects badly?"
    a: "The model is a selfie segmenter, trained to find a person in a frame. Cats, chairs, shoes and plants fall outside what it learned, so their edges come out rough or the subject disappears entirely. For products, place a person holding the item in the frame or shoot the product on a background you can later erase by hand."
  - q: "What is the difference between cut strength and edge softness?"
    a: "Cut strength sets how confident the model has to be before a pixel counts as part of the person. Lower values keep more of the faint halo around hair; higher values make a tighter, cleaner cut. Edge softness sets how many pixels the boundary fades over: zero gives a hard curve, three a gradual blend that hides halos on a dark new background."
  - q: "Will the cut-out keep the full photo resolution?"
    a: "Yes. The mask is calculated at a smaller size and then scaled up to the original image dimensions, so a 1200 by 1500 photo produces a 1200 by 1500 PNG. Keep that PNG as the master copy and scale down only at the last step, when the final size is known."
---

A cut-out person on a transparent background is the raw material for thumbnails, profile pictures, product cards and channel art. Cloud services do it well but upload every photo. A segmentation model small enough for the browser now does the same core job locally, which changes the trade: a little less polish, none of the privacy cost.

The [Background Remover](/background-remover/) uses a selfie-segmentation model trained on people. This guide covers what it does well, where the edges go soft, and how the two sliders should actually be used.

## What the model is good at

The model was trained to find a person in a photo: portraits, talking-head frames from video, product shots with a person holding the item. It cuts everything else away and produces a transparent PNG. That focus is the point. On objects and animals its accuracy drops sharply, and it is honest to say so before you try to cut out a coffee cup.

One clear subject per frame is the contract. Two people standing close together can work if there is visible space between them, but a crowded group photo usually turns into a single blob with a suggestion of shoulders. If the job needs a group cut out, this is the wrong tool, not the wrong slider setting.

## The first run downloads a model

About 10 MB arrives on the first visit, shown in the status line as a download rather than a cut. Later visits use the browser cache, and the cut itself takes a moment on a laptop and a few moments on a phone. Nothing about the photo is sent anywhere. The page reads the file from disk, draws it on a canvas, and writes the result back to the same canvas. The network is used in the other direction, to fetch the model.

That order matters for what the tool can promise. Privacy here is not a policy on a page, it is a consequence of where the code runs. A photo of a document, a child or an unreleased product can go through the tool without anyone else seeing it.

## Two sliders, used one at a time

The model does not return a perfect yes-or-no mask. It returns a confidence value for every pixel, and the two sliders decide how that confidence becomes transparency.

**Cut strength** (15 to 85, default 50) is the line where a pixel stops counting as background and starts counting as person. Sliding it down keeps more of the uncertain halo around the subject, which is useful for soft sweaters and hair that blends into the background. Sliding it up makes a tighter, more decisive cut, which suits a subject against a flat white studio backdrop where there is no ambiguity to preserve.

**Edge softness** (0 to 3, default 1) is a small blur applied to the mask itself. At zero the boundary is a hard curve, and every strand of hair that the model missed becomes a visible notch. At three the edge fades over several pixels, which hides those notches but can make a cut-out look airbrushed against a crisp new background.

Change one slider, wait for the cut to redraw, then decide. Moving both at once makes it impossible to tell which one caused the improvement. Both re-run instantly on the cached model, so experimenting costs nothing.

## Hair is the hard case

Every segmentation model struggles with hair, and this one is no exception. Strands are thin, semi-transparent and full of gaps, so the mask estimates where the edge probably is rather than tracing it. The right setting depends on the background the cut-out will sit on. A soft edge on a dark new background hides halos well. A harder edge on a solid coloured card looks tidier, because there is nothing to blend into.

<figure>
  <img src="/assets/img/blog/background-removal-portraits/studio.webp" alt="A studio portrait of a woman with dark wavy hair against a dark background" width="1200" height="1350" loading="lazy">
  <figcaption>Dark hair against a dark room is the worst input the model can receive, and no slider recovers strands the camera never separated.</figcaption>
</figure>

The same difficulty shows up on thin shoulder straps, glasses frames, fuzzy knitwear and anything the model reads as background through a gap. None of these ruin the result; they just ask for a smaller image, a softer edge, or a different source photo.

## Lighting beats editing

Separation between subject and background decides the mask quality more than any slider:

- Even light on the face and shoulders, so shadows do not read as missing pieces.
- A background that differs in tone from the hair and clothing.
- No bright window directly behind the head.

The rules sound obvious and are routinely broken. Phone cameras lift shadows automatically, so a portrait shot in a dim room can look perfectly fine on screen while the hair and the wall behind it sit within a few shades of each other - the kind of difference an eye forgives and a mask does not. Before blaming the tool, view the photo as a thumbnail. If the head and the background read as one shape at small size, the model is seeing roughly the same thing.

A photo taken with those three rules needs almost no cleanup. A backlit photo with dark hair against a dark room will always have a ragged edge, and that is a photographing problem rather than a filtering one. If the photo can be retaken, retake it; the tool works far better on the second image.

## The cut keeps its resolution

The mask is computed at a smaller size and then scaled up to the photo's real dimensions, so a 1200 by 1500 photo produces a 1200 by 1500 PNG. Nothing is downscaled along the way. That matters for thumbnails, where the cut-out gets placed on a background and then scaled down again; having the full-size master means the sharpening only happens once, at the end.

A transparent PNG is heavier than the JPG it came from, because it holds an alpha channel and lossless data. If the final file needs to be small, composite first, then run the finished image through the [Image Compressor](/image-compressor/), and convert to JPG with the [Image Format Converter](/image-converter/) when the destination does not need transparency.

## When not to use it

The tool is worth skipping in four situations. Objects and animals, as covered above. Transparent or glass objects, where the model has no coherent edge to trace. Very small subjects in a very large frame, where the person is so few pixels wide that the mask cannot resolve the outline. And busy backgrounds directly behind thin hair, where separation is already lost in the photograph.

In each case the fix is upstream: a plainer background, a closer frame, or a different tool that edits by hand.

## A practical workflow

1. Pick a clean frame or take the photo with the lighting rules above.
2. Load it, let the first-run model download finish, then adjust cut strength and softness one at a time.
3. Download the PNG and composite it on the new background at full resolution.
4. Export the final image as JPG if the destination does not need transparency.

<figure>
  <img src="/assets/img/blog/background-removal-portraits/tool.webp" alt="The Background Remover showing a seated person cut out onto a transparent checkerboard" width="1120" height="631" loading="lazy">
  <figcaption>A finished cut in the tool: cut strength 50, edge softness 1, and the result on the transparency checkerboard at the source resolution.</figcaption>
</figure>

## The pattern behind the tool

Background removal is one of the chores that used to justify an upload, a queue and an account, purely because a browser could not run the model. That stopped being true while most workflows did not change with it. A 250 KB model file and a canvas now do the whole job on the device.

The same habit covers the rest of the small image jobs: compress, convert, resize, build a favicon. Each is a two-minute fix that never needed a server, and each one is a little less of your material floating around on someone else's disk.