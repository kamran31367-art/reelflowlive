---
title: "JPG, PNG or WebP: choosing a format per image"
description: "When a photo belongs in JPG, when a screenshot needs PNG, and when WebP saves the most bytes, with measured examples, the transparency trap and the files conversion cannot fix."
date: 2026-11-27
categories:
  - Images
cover: assets/img/blog/jpg-png-webp-conversion/hero.webp
coverAlt: "A stack of instant photo prints and patterned paper envelopes resting on a dark wooden table"
coverCaption: "One picture, several containers. The container decides the size, and sometimes the background."
takeaways:
  - "JPG for photographs, PNG for flat graphics and transparency, WebP when the smallest file matters and the destination accepts it."
  - "The converter re-encodes at the original pixel size, so it changes the format and the bytes, never the dimensions."
  - "A 143.1 KB JPG photograph became a 46.7 KB WebP at quality 0.80 in a measured batch, while a small PNG shrank by only 42 bytes."
  - "Transparent pixels in a JPG export become the chosen background colour, so a transparent logo arrives on a white disc unless you pick a colour."
  - "Converting never recovers detail already lost, and canvas exports drop camera metadata such as EXIF and GPS."
faq:
  - q: "Does converting a JPG to PNG improve the quality?"
    a: "No. The JPG already threw detail away when it was saved, and converting to a lossless format stores what remains exactly, at a much larger size. PNG is the right target when you need lossless editing or transparency, not when you hope to repair a compressed photo. Converting back to a high-quality JPG or WebP is the move when the goal is a smaller file."
  - q: "Why did my file get bigger after converting?"
    a: "Two usual reasons. A photograph saved as PNG is lossless and can be several times larger than the same photo as JPG. And an image already in the chosen format is re-encoded again, which for a very small or already optimised file can add a few bytes instead of removing them. The converter reports the real before and after size for every row, so the growth is visible rather than silent."
  - q: "Which quality setting should I use?"
    a: "Start at 0.80 for photographs and check a face and a gradient at full size. Below about 0.60 artefacts appear as blocky patches in smooth areas and ringing around edges. The slider runs from 0.40 to 0.95 and defaults to 0.86, which is a safe general setting. PNG ignores the slider entirely because it is lossless."
  - q: "Is WebP safe to use on a website now?"
    a: "Every current browser displays WebP: Chrome, Firefox, Safari and Edge all read it, including transparency and animation. The risk is older software outside the browser, such as a legacy CMS, an email client or an office suite that refuses the file. When the destination is narrow, send JPG and keep WebP for the page itself. The converter makes both from the same source in seconds."
  - q: "Does conversion strip metadata like EXIF and GPS?"
    a: "Yes. The converter draws each image onto a canvas and re-encodes it, and canvas exports carry no EXIF block, so camera model, capture time and GPS coordinates are not passed on. For client photos that is usually a privacy gain. It also means a phone photo's rotation is baked into the pixels before export, so the result opens upright without needing the orientation tag."
---

Most image problems are format problems in disguise. The same picture can take 300 KB as WebP, 800 KB as JPG and 2 MB as PNG, and a format swap is often the whole fix for a slow page or a rejected upload. The [Image Format Converter](/image-converter/) converts a batch of JPG, PNG and WebP files on a canvas in the browser, with a quality dial for the lossy formats.

This guide covers which format belongs where, what the quality slider is really doing, and the two cases that surprise people: transparency in JPG, and the small file that grows.

<figure>
  <img src="/assets/img/blog/jpg-png-webp-conversion/prints.webp" alt="A grid of photographic prints laid out on a dark wooden surface, each a different subject" width="1200" height="675" loading="lazy">
  <figcaption>Photographs are the easy case: smooth colour and fine detail, which is exactly what lossy compression is built for.</figcaption>
</figure>

## The one-line rule

- **JPG** for photographs and anything with smooth colour.
- **PNG** for flat graphics, screenshots, icons and anything that needs transparency.
- **WebP** when you want the smallest file with broad support, photos included.

That rule covers the large majority of files. The rest of this guide is the reasoning behind it.

## What each format is good at

JPG is tuned for photographs. It discards subtle colour detail the eye is unlikely to notice, which is why a portrait at 80 percent quality looks untouched at a fraction of the size. It has no transparency at all, and the format carries no alpha channel to fall back on.

PNG is lossless. Every pixel is kept exactly, which makes it ideal for text, charts, UI screenshots and logos with a transparent background. The price is size: a photograph saved as PNG can be several times bigger than the same photograph as JPG, because photographic noise is the worst possible input for a lossless encoder.

WebP does both jobs with newer compression. It supports transparency like PNG and beats JPG on photographs at similar quality, and every current browser displays it. AVIF goes further on size but has narrower support outside browsers, so WebP is the practical modern default.

## A measured batch

Two files went through the converter on a WebP export at quality 0.80: a 1600x900 photograph and a 900x900 logo with a transparent background.

- The photograph, 143.1 KB as JPG, came out at 46.7 KB, 96.4 KB smaller. That is a 67 percent cut with no visible change at normal viewing size.
- The logo, 8.1 KB as PNG, came out at 8.0 KB, 42 bytes smaller. WebP barely helped, because a flat circle on a transparent background is already about as compressible as an image gets.

The summary bar adds the batch up: two files, 151.2 KB before, 54.7 KB after, 96.5 KB saved. That is the shape of the tool: it does not promise every file shrinks, it shows what each one did.

<figure>
  <img src="/assets/img/blog/jpg-png-webp-conversion/tool.webp" alt="The Image Format Converter with two files converted to WebP at 0.80 quality, showing 143.1 KB down to 46.7 KB and a summary of 151.2 KB to 54.7 KB" width="1072" height="435" loading="lazy">
  <figcaption>A real batch: a photograph and a transparent logo, both re-encoded to WebP at 0.80. The second row shows the honest small case, 42 bytes saved rather than a dramatic cut.</figcaption>
</figure>

## What the quality slider does

The slider runs from 0.40 to 0.95 and defaults to 0.86. It only applies to JPG and WebP; the field hides itself when the target is PNG, since a lossless format has no quality dial.

Guidance that holds up in practice:

- **0.80** is a safe default for photographs that will be viewed at normal size.
- **0.70 to 0.75** works for thumbnails and previews, where the image is small anyway.
- **Below 0.60** artefacts become obvious: blocky patches in skies and skin, ringing around high-contrast edges, and banding across gradients.

Changing the setting re-encodes the whole list, so one slider position applies to the batch. That is deliberate: mixed quality within a set of related images is harder to reason about than one consistent setting.

## The transparency trap

JPG cannot store transparency, so the converter has to put something behind transparent pixels. It fills the canvas with the colour in the "Background for JPG" field, white by default, before drawing the image.

That single step changes how a logo looks. A mark designed on transparency arrives as a white square, and a round logo arrives on a white disc, which is fine on a white page and wrong on a dark header. Pick the background colour to match the destination, or keep the file as PNG or WebP where the alpha channel survives untouched.

## When the file gets bigger

Two honest cases where conversion adds bytes:

- **A photograph to PNG.** Lossless storage of photographic detail is exactly the situation PNG handles worst.
- **A file already in the target format.** Every listed image is re-encoded, so a tiny, already optimised file can come out slightly larger. The measured logo above lost 42 bytes; a less friendly file could gain them.

The tool shows the real number per row and does not round it away. If a row reports a bigger file, delete it from the list and keep the original.

## What conversion cannot do

It cannot recover detail. A heavily compressed JPG converted to PNG is a larger file with the same blocky sky, and the compression that already happened is the ceiling. Converting down to a lower quality again stacks a second round of loss on the first, which is why repeated re-saves of the same JPG should be avoided.

It also does not resize. The converter keeps the original pixel dimensions, so a 1600x900 file comes out 1600x900 in the new format. When the problem is dimensions rather than format, the [Image Resizer](/image-resizer/) is the right door, and the [Image Compressor](/image-compressor/) is the one for squeezing a single image without changing its format.

Metadata goes too. Canvas exports carry no EXIF block, so camera model, capture date and GPS coordinates are dropped. For client work that is usually welcome; for archive files that should keep their metadata, export from an editor instead.

## Formats it does not touch

The input list accepts JPG, PNG and WebP only, up to 30 files at a time. GIF, AVIF, TIFF and HEIC are outside the scope, and HEIC is the one people hit most often, because iPhones save photos in it by default. The fix on an iPhone is to share the photo as JPG or switch the camera setting to "Most Compatible" before taking it.

For files inside those formats, a desktop converter or the phone's own export is the simpler path. The browser converter is for the three formats that cover almost every web image.

## Where this fits

- **CMS upload limits** that reject anything over half a megabyte.
- **Email attachments** where five photos at 800 KB each is a problem and five at 150 KB is not.
- **Blog and product pages** that want WebP for the page and JPG as a fallback copy.
- **Receiving screenshots** in PNG that only need to be read once, where a JPG at 0.75 is a quarter of the size.

Everything runs on your device: the files are read locally, drawn to a canvas, and encoded by the browser, so nothing is uploaded and nothing waits in a queue. That matters when the batch is client work under embargo or a folder of private screenshots.

## A short working order

1. Decide the destination first: page, email, upload form or archive.
2. Pick the format that destination accepts, defaulting to WebP for web use.
3. Set quality once for the batch, starting at 0.80.
4. Read the before and after column, and drop anything that grew.
5. Download the set and keep the originals untouched.

A format swap is the cheapest fix in image work: no reshooting, no editing, just a smaller file that looks the same.