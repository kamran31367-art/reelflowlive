---
title: "QR codes that scan: size, margin and contrast rules"
description: "The quiet zone, minimum print size, contrast limits and PNG versus SVG - the reasons a QR code works on screen and fails on a business card."
date: 2026-11-27
categories:
  - Design
  - Workflow
draft: false
---

A QR code is a pattern of data plus a border. Most failed scans are not bad data - they are a missing border, too little contrast, or a code printed smaller than a phone camera can resolve.

## The quiet zone is not decoration

Every QR code needs a blank margin around it, usually four modules wide. Scanners use that empty area to find the code's edges. Remove the margin, or place the code on a busy photo, and the camera struggles to lock on.

If you must place a code on an image, put it on a solid light panel inside a white frame. Never crop straight to the black squares.

## Size depends on distance

The practical rule: the code should be at least one tenth of the scanning distance. A code read from 30 cm needs about 3 cm of width; a poster read from 3 metres needs around 30 cm. Below 2 cm, most phones need good lighting and a steady hand.

Small codes also carry less data safely. Long URLs force a denser pattern with smaller modules, which is harder to scan. A short link beats a long one with tracking parameters.

## Contrast: dark on light

Scanners expect dark modules on a light background. Inverted codes (light on dark) fail on many phone cameras. Mid-tone colours reduce the contrast ratio and shorten the usable range; pure black on white is the safest, with brand colours kept dark and saturated.

## PNG or SVG

- **PNG** for social posts, slides, stickers and print up to poster size. Use a generous pixel size - a 500 px code blown up to A3 looks soft.
- **SVG** for logos, packaging and anything that will be resized. Vector output stays sharp at any size.

The [QR Code Generator](/qr-code-generator/) takes a link, plain text or Wi-Fi details, lets you set the size and quiet-zone margin, and exports both formats. The code is generated on your device, so the downloaded file keeps working offline - the data is inside the image.

## Test like a stranger

Open the printed or on-screen code with two different phones, at the real distance and in normal light. If it takes more than a second to register, fix the margin, the size or the contrast before shipping the batch.
