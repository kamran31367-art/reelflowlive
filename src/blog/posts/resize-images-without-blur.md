---
title: "Resizing an image without blur: what the numbers actually show"
description: "Measured exports of one 2400 pixel photo: 151 KiB as a 1280 by 720 JPG, 111 KiB as WebP, 1.8 MB as PNG, and why a 640 pixel original upscaled to 1280 scored five times softer."
date: 2026-11-27
categories:
  - Images
  - Social
cover: assets/img/blog/resize-images-without-blur/hero.webp
coverAlt: "A laptop screen showing a photo editor open on a portrait photo of someone holding a camera"
coverCaption: "Resizing is the last step before upload, and it decides whether the platform gets sharp pixels or stretched ones."
takeaways:
  - "One 2400 by 1600 photo of 864.9 KiB became 151.1 KiB as a 1280 by 720 JPG at quality 0.86, 111.5 KiB as WebP at the same setting, and 1.8 MB as PNG."
  - "A 640 by 360 original upscaled to 1280 by 720 came out smaller at 102.6 KiB but measured a detail score of 65.9 against 322.7 for a native 1280 export, about five times softer."
  - "Crop to fill, fit inside and stretch are the three outcomes: edges removed, whole image with bars, or distorted pixels, and crop is anchored at the centre."
  - "The export keeps the source name and appends the size, so the downloaded file reads like photo-1280x720.jpg and nothing gets overwritten silently."
  - "Everything runs in the tab with the browser canvas; the re-encode strips EXIF and GPS, which is a privacy gain but also means colour profile data does not travel with the file."
faq:
  - q: "Does upscaling ever make an image sharper?"
    a: "No. Enlarging interpolates between existing pixels, so a 640 pixel wide original stretched to 1280 has the same detail spread over four times the area. In our test it came out at 102.6 KiB with a detail score of 65.9, while a real 1280 export of the same scene scored 322.7. The smaller file is a symptom of the missing detail, not a bonus."
  - q: "Why is PNG so much bigger than JPG here?"
    a: "PNG is lossless, so a photographic frame keeps every pixel variation, and a noisy photo compresses badly in a lossless format. The same 1280 by 720 frame measured 151.1 KiB as JPG at quality 0.86 and 1.8 MB as PNG, about twelve times larger. PNG earns its size on flat graphics, logos and transparency, not on photos."
  - q: "Does the resizer keep my photo's location data?"
    a: "No. The tool draws the image onto a canvas and exports that canvas, and canvas exports do not carry the original metadata block. EXIF, including GPS coordinates, is dropped, which is usually what you want before posting a photo taken at home. The trade-off is that colour profile information can be dropped too, so a wide gamut photo may shift slightly in colour on some viewers."
  - q: "Can it open HEIC photos from an iPhone?"
    a: "Only if the browser can decode HEIC. Chrome and Edge on Windows generally cannot, so an iPhone HEIC will fail with a clear message rather than producing a broken file. Convert the photo to JPG first, or set the iPhone camera to most compatible, and the resizer will handle it normally."
  - q: "Is there a file size or pixel limit?"
    a: "Each side is capped at 8000 pixels and there is no upload limit because nothing is uploaded. The practical ceiling is your device's memory: a very large photo is decoded at full resolution in the tab, so an older phone with a 100 megapixel original may take a few seconds or refuse the file. One image at a time, by design."
---

Almost every platform asks for an image at one exact size, and almost every camera produces something else. The [Image Resizer](/image-resizer/) does the conversion in the browser and shows the output size, the output weight and a live preview before anything is saved. This post walks through a measured session with one photo, so the numbers below are the numbers the panel showed.

## Start from the larger file

The source in the test was a 2400 by 1600 photograph, 864.9 KiB, imported from a photo library. The panel read the dimensions and the weight immediately and offered the presets: 1280 by 720 for a YouTube thumbnail, 1080 by 1920 for Shorts and Reels, 1080 by 1080 square, 1080 by 1350 portrait and 1200 by 675 for X.

Choosing a preset fills the width and height fields; typing your own numbers switches the preset to Custom. The download uses the source name plus the output size, so the test file saved as `rescan-hero-2400-1280x720.jpg` and nothing in the original folder changed.

<figure>
  <img src="/assets/img/blog/resize-images-without-blur/tool.webp" alt="The Image Resizer showing a 2400 by 1600 photo reduced to 1280 by 720, a crop to fill preview, JPG at quality 0.86 and an output of 151.1 KiB" width="1072" height="791" loading="lazy">
  <figcaption>The measured session: 2400 by 1600 source, YouTube thumbnail preset, crop to fill, JPG at 0.86, 151.1 KiB output.</figcaption>
</figure>

## What one resize actually did

With the preset at 1280 by 720 and crop to fill, the same frame exported as:

- **JPG at quality 0.86:** 151.1 KiB, measured 154,701 bytes.
- **WebP at quality 0.86:** 111.5 KiB, measured 114,198 bytes, about 26 percent smaller than the JPG.
- **PNG:** 1.8 MB, measured 1,867,456 bytes, about twelve times the JPG.
- **JPG at quality 0.60:** 70.5 KiB, measured 72,165 bytes.

Four exports, one source, and the spread between the smallest and largest is more than twenty-five times. That is why the format choice matters more than most people expect when a platform enforces a maximum file size.

## Three fit modes, three different pictures

The Fit control is where most confusion starts, because the output dimensions stay the same while the picture inside changes.

**Crop to fill** scales the photo until it covers the frame, then removes the overflow. For a 3:2 photo in a 16:9 thumbnail that means the top and bottom are trimmed, and the crop is anchored at the centre. Nothing needs adjusting for a landscape photo with the subject in the middle, and everything needs adjusting for a portrait where the face sits high in the frame.

**Fit inside** keeps the whole image and fills the leftover area with the background colour, white by default. A landscape photo in the Shorts preset leaves large bars above and below, which is honest but rarely what a cover wants.

**Stretch** maps the source onto the target and ignores the aspect ratio, so a face becomes wider or taller. It is there for the rare case where distortion is acceptable, and it is the fastest way to make a person look wrong.

## Format and quality, matched to content

The measurements above suggest a simple rule. Photos are JPG or WebP; graphics are PNG.

- **JPG** is the safe default. Quality 0.86 kept the frame at 151.1 KiB, and the preview matched the downloaded file pixel for pixel, so what you see is what saves.
- **WebP** produced the smallest photographic file at the same quality. Modern browsers, and all the platforms in these presets, accept it.
- **PNG** disabled the quality slider entirely, because it is lossless. The 1.8 MB result is fine for a logo with three colours and wrong for a photograph.
- **Lower quality** is a real lever. Dropping from 0.86 to 0.60 cut the JPG from 151.1 to 70.5 KiB, more than half, and for a thumbnail viewed at a few hundred pixels wide the difference is hard to see at feed size.

If a platform still rejects the file on weight, the [Image Compressor](/image-compressor/) handles that separately. Compress after resizing, never before, so the pixels are re-encoded once instead of twice.

## Upscaling, measured instead of argued

The common claim is that upscaling makes images blurry. A measured version is more useful.

The test took a 640 by 360 copy of the same photo, 45.6 KiB, and asked the resizer for 1280 by 720 with crop to fill. The export came out at 102.6 KiB, measured 105,075 bytes, and it looks fine in a small preview. Detail tells a different story: a Laplacian variance score, which measures how much genuine edge contrast an image carries, came out at **65.9** for the upscaled frame against **322.7** for a native 1280 export of the same scene.

That is roughly five times less edge detail, and the file is smaller too, which sounds backwards until you remember that interpolation cannot invent texture. It spreads the pixels it has across a larger grid, so there is less fine variation to compress. A smaller upscaled file is evidence of missing detail, not efficiency.

<figure>
  <img src="/assets/img/blog/resize-images-without-blur/scan.webp" alt="A close-up of a vintage camera lens showing fine engraved numbers and rings on the barrel" width="1200" height="675" loading="lazy">
  <figcaption>Engraved numbers like these are the first thing to mush when a small original is stretched; no resizer can recreate the grooves.</figcaption>
</figure>

## What happens to the metadata

Because the tool draws the photo onto a canvas and exports that canvas, the original metadata block does not travel with the file. Two consequences matter.

**Location data is stripped.** A photo taken at home loses its GPS coordinates on export, which is a quiet privacy win for anything posted publicly. Camera model, lens and capture time go with it, so a photo library will show the export as having no capture date.

**Colour profiles can be dropped.** Canvas exports sometimes lose the embedded profile, so a photo edited in a wide gamut space can look slightly flatter or shift hue in a browser that assumes sRGB. For social uploads, which are converted to sRGB anyway, this rarely shows.

## Rotation and phone photos

Phone cameras store orientation in metadata rather than rotating pixels. The tool asks the browser to apply that orientation while decoding where the feature is available, so a portrait photo taken sideways does not arrive rotated 90 degrees. This is also why the metadata strip above matters: once the orientation has been applied to pixels, it no longer needs to be stored.

## A working order

1. Open the largest copy of the image you have, not a version already resized by a chat app.
2. Pick the preset for the destination, then decide crop or fit by looking at the preview.
3. Keep the JPG quality near 0.86 unless the file weight matters more than fine detail.
4. Check the output dimensions and weight in the panel before downloading.
5. Only step the quality down, or move to compressor, if the platform still refuses the file.

## What it deliberately does not do

- **No batch.** One image at a time, which keeps the interface simple and the memory use predictable.
- **No crop repositioning.** Crop to fill is centred, so an off-centre subject needs a crop in an editor first, then a resize here.
- **No sharpening.** The export is the resampled image, not a processed one; that is what keeps the preview honest.
- **No DPI field.** Screens measure pixels; DPI is a print concept and is ignored by every platform in the preset list.

For related work, the [Image Converter](/image-converter/) changes formats without resizing, the [Thumbnail Safe Zone](/thumbnail-safe-zone/) checks a finished thumbnail against player overlays, and the [Video Frame Grabber](/video-frame-grabber/) turns a video frame into a still you can bring back here.