---
title: "QR codes that scan: size, margin and contrast rules"
description: "The quiet zone, minimum print size, data length and PNG versus SVG - the reasons a QR code works on a screen and fails on a business card, and the checks that catch it first."
date: 2026-11-27
categories:
  - Design
  - Workflow
cover: assets/img/blog/qr-code-generator/hero.webp
coverAlt: "A hand holding a phone that displays a QR code on a wooden table"
coverCaption: "A QR code is data plus a margin. Remove the margin and the scan fails before the data is ever read."
takeaways:
  - "The quiet zone is at least four modules of blank space; without it, scanners cannot find the edges."
  - "The code should be about one tenth of the scanning distance; 3 cm at arm's length, 30 cm on a poster."
  - "Dark modules on a light background is the only safe combination in general use."
  - "Short links beat long ones because fewer characters make a coarser, easier pattern."
  - "Export SVG for anything that will be resized; PNG for quick posts and slides."
faq:
  - q: "How small can a printed QR code be?"
    a: "Around 2 cm of width is the practical floor for a short link read at arm's length in good light, and it needs a steady hand below that. The safer rule is one tenth of the scanning distance: 3 cm for 30 cm away, 30 cm for a poster read from 3 metres."
  - q: "Why does my QR code fail when I put a logo in the middle?"
    a: "A logo covers modules, and error correction only tolerates so much damage. Keep the logo under about a quarter of the width, keep it centred, and raise error correction to the high level so the covered area can be rebuilt. Test the printed code with two phones before shipping."
  - q: "Do I need internet for the code to work?"
    a: "The code itself needs no internet, because the data lives inside the pattern. What needs a connection is the destination - a link opens a browser and then a website. A code pointing at a Wi-Fi network works fully offline."
  - q: "Can I change the destination of a code after printing it?"
    a: "Only if the code points at a redirect you control, such as a short link you can edit. A static code carries the final URL, so changing it means printing a new code. For campaigns, point the code at a short link you own."
---

A QR code is a pattern of data plus a border. Most failed scans are not bad data. They are a missing border, too little contrast, too much data crammed into a small print, or a code placed on a busy photograph where the camera cannot find the edges.

The [QR Code Generator](/qr-code-generator/) makes codes for a link, plain text or Wi-Fi details, with control over size and the quiet zone, and exports both PNG and SVG. This guide covers the rules that decide whether the code scans on the first try, because a code that needs explaining is already a failed code.

## What separates a working code from a pretty one

Design trends and scannability pull in opposite directions. A code that survives real use meets these five conditions.

- **A blank margin** around the pattern, never cropped to the black squares.
- **Enough physical size** for the distance at which it will be scanned.
- **Strong contrast** between dark and light modules.
- **Short data**, so the pattern stays coarse and forgiving.
- **A format that stays sharp** at the final print or display size.

Everything below is a version of one of those five.

## The quiet zone is not decoration

Every QR code needs a blank margin around it, usually four modules wide. Scanners use that empty area to locate the code's edges and correct for angle. Remove the margin, or place the code on a busy image, and the camera struggles before it reads a single module.

If the code must sit on a photo, put it on a solid light panel inside a white frame. That panel is not a design choice; it is the quiet zone doing its job. Never crop a downloaded code to the black squares, and never let a layout tool trim "empty" space around it.

## Size depends on distance

The practical rule: the code should be at least one tenth of the scanning distance. A code read from 30 cm needs about 3 cm of width. A poster read from 3 metres needs around 30 cm. Below 2 cm, most phones need good light and a steady hand, which is a lot to ask of a stranger.

Small codes also carry less data safely. A long URL forces a denser pattern with smaller modules, and smaller modules need a better camera. This is why a short link beats a long one with tracking parameters: fewer characters buy a coarser grid that survives printing, glare and a cheap phone.

<figure>
  <img src="/assets/img/blog/qr-code-generator/phone.webp" alt="A phone on a wooden table displaying a large QR code" width="1200" height="800" loading="lazy">
  <figcaption>The screen version can be large and backlit. The printed version has neither advantage, so plan for the worse of the two.</figcaption>
</figure>

## Contrast: dark on light

Scanners expect dark modules on a light background. Inverted codes, light modules on a dark background, fail on many phone cameras because the software expects the opposite polarity. Mid-tone colours reduce the contrast ratio and shorten the usable range.

Pure black on white is the safest combination. Brand colours are fine when the dark side stays genuinely dark and saturated, and the light side stays genuinely light. A code in two mid-tone shades looks modern in a mock-up and unreliable in a shop.

## Short data, long life

Error correction lets a scanner rebuild damaged modules, and the generator sets a sensible level by default. It cannot rescue a code whose modules are too small for the camera or whose data is so long that the grid is dense.

Three habits keep the data short:

- Use a short link, not the full URL with campaign parameters.
- Keep Wi-Fi passwords in the Wi-Fi mode rather than a text note.
- Point campaign codes at a redirect you control, so the destination can change without reprinting.

That last point is the difference between a static code and a campaign asset. A static code carries the final URL forever; a code pointing at a short link you own can be redirected next month.

## PNG or SVG

- **PNG** for social posts, slides, stickers and print up to poster size. Use a generous pixel size; a 500 px code blown up to A3 looks soft.
- **SVG** for logos, packaging and anything that will be resized. Vector output stays sharp at any size and prints crisply at any DPI.

The generator exports both from the same settings, and the preview shows the module count so you can see when a long payload has made the pattern denser. The code is produced on your device, so the downloaded file carries its data and keeps working offline.

<figure>
  <img src="/assets/img/blog/qr-code-generator/tool.webp" alt="The QR code generator with a ReelFlow link typed in and the live preview showing the code" width="1120" height="710" loading="lazy">
  <figcaption>The preview updates as you edit, and the export buttons produce PNG or SVG from the same pattern.</figcaption>
</figure>

## Where codes fail in the physical world

Print adds problems a screen never shows. A laminated code reflects the room lights and the camera sees a white rectangle. A sticker on a curved bottle bends the pattern. A code printed on a dark door needs an extra white panel behind it, because the surrounding surface replaces the quiet zone.

Three habits cover most of these cases. Print the code on matte paper when it will be laminated, and angle the first copy towards a window to check for glare. Keep the code flat, or enlarge it when the surface curves. And always place the code on a light panel with a border when the label itself is dark.

Distance matters as much as size. A code on the back of a product box is read from 20 cm, so 2 to 3 cm is enough. A code on a shop window is read from a metre, so it needs around 10 cm and a margin that survives the window frame. When in doubt, go one size larger: a code that is slightly too big looks fine, while one that is slightly too small fails silently.

## Wi-Fi codes without leaking the password

A Wi-Fi QR code carries the network name and password in plain text inside the pattern. That is convenient for guests, and it is also a printed copy of the password: anyone with a phone can read it from the wall.

Use Wi-Fi codes for a guest network, not the main one, and change the guest password when the event ends. If the code is printed on a table stand, the password is public for as long as the stand exists. That is usually acceptable for a cafe and rarely acceptable for an office.

## Test like a stranger

Open the printed or on-screen code with two different phones, at the real distance and in normal light. Do not test by holding the phone close with the screen bright; test the way a customer will, standing where they will stand.

If the code takes more than a second to register, fix the margin, the size or the contrast before shipping the batch. A reprint costs far more than the minute this check takes.

## The mistakes that repeat

- Cropping the quiet zone to make the code "fit".
- Printing at 1.5 cm because the layout looked tidy.
- Inverted colours for a dark theme.
- A long tracking URL on a business card.
- A JPEG export of a PNG that introduced compression noise around the modules.
- Testing only on the designer's phone, at arm's length, indoors.

Every item on that list has broken a real campaign. None of them is exotic.

## Where the code fits

Print the code at the size the reader will meet it, export SVG when it will be resized, and let a short link do the heavy lifting. The related tools below cover the rest of the job: tagging and shortening the destination, placing the code in a poster, and checking that the colours around it still contrast.