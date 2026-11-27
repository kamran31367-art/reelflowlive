---
title: "Clean background removal for portraits and product shots"
description: "An on-device model cuts people out of photos in the browser. What it does well, where edges get soft, and the lighting that makes the mask easy."
date: 2026-11-27
categories:
  - Images
  - Design
draft: false
---

A cut-out person on a transparent background is the raw material for thumbnails, profile pictures, product cards and channel art. Cloud services do it well but upload every photo. A segmentation model small enough for the browser now does the same core job locally.

## What the model is good at

The [Background Remover](/background-remover/) uses a selfie-segmentation model trained on people - portraits, talking-head frames, product shots with a person holding the item. It finds the person and cuts everything else away, producing a transparent PNG. That focus is the point: on objects and animals its accuracy drops, and it is honest to say so.

## The first run downloads a model

About 10 MB arrives on the first visit. Later visits use the browser cache and the cut-out is quick. Nothing about the photo is sent anywhere; the download is the model, in the other direction.

## Why edges are soft, and how to handle it

Hair is the hard case for every segmentation model. Strands are thin, semi-transparent and full of gaps, so the mask estimates rather than traces. The edge strength control lets you choose between a soft, natural edge and a cleaner, harder one - the right setting depends on the background the cut-out will sit on. On a dark new background, a softer edge hides halos; on a solid coloured card, a harder edge looks tidier.

## Lighting beats editing

Separation between subject and background decides the mask quality more than any slider:

- Even light on the face and shoulders.
- A background that differs in tone from hair and clothing.
- No bright window directly behind the head.

A photo taken with those three rules needs almost no cleanup. A backlit photo with dark hair against a dark room will always have a ragged edge.

## A practical workflow

1. Grab a clean frame or take the photo with the lighting rules above.
2. Remove the background and download the PNG.
3. Composite on the new background at full resolution - the PNG keeps the source size.
4. Export the final image as JPG if the destination does not need transparency.

Local, transparent, no account - and the original photo never leaves the device.
