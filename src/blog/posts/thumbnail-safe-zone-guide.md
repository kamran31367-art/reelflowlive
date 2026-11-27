---
title: "Thumbnail safe zones, measured in pixels: what the guides cover"
description: "A 1280 × 720 JPEG passed the shape check with four guides on, a 1600 × 600 file was flagged as not 16:9 yet still exported, and the PNG came out at 1,540,183 bytes. A measured walk through the Thumbnail Safe Zone tool."
date: 2026-11-27
categories:
  - YouTube
  - Images
cover: assets/img/blog/thumbnail-safe-zone-guide/hero.webp
coverAlt: "A video creator in a purple-lit home studio speaking into a microphone with a camera and laptop beside her"
coverCaption: "The room where a thumbnail gets designed is never the place where it gets seen: phones crop it, players darken the bottom and a badge covers the corner."
takeaways:
  - "A 1280 × 720 JPEG read back as 1280 × 720 and passed the shape check with the hint 16:9 - the same shape YouTube uses for thumbnails."
  - "A 1600 × 600 file triggered Not 16:9 (1600 × 600). YouTube crops it, so check the checked guides before you publish, yet the download button stayed enabled."
  - "A 320 × 180 file passed the same check with no warning at all, so the panel gates the shape of a thumbnail but never its resolution."
  - "The export keeps the source size: the 1280 × 720 file produced a 1,540,183-byte PNG and the 1600 × 600 file a 1,440,348-byte PNG."
  - "The guides are fixed fractions of the frame: a 5% margin, a 30% bottom band, a badge 1.2% from the right edge and phone lines at 25% and 75%."
faq:
  - q: "Does the tool upload my thumbnail?"
    a: "No. The image is decoded in the tab by the browser, drawn onto a canvas and saved from that canvas. Nothing is sent anywhere, which is why the whole page works with the network switched off after it has loaded."
  - q: "What size should a YouTube thumbnail be?"
    a: "YouTube's own help page asks for 1280 × 720 and a file under 2 MB. This tool does not enforce either number: it compares only the shape, so a 1920 × 1080 file passes and so does a 320 × 180 one. Check the resolution row yourself before exporting."
  - q: "Why is the exported PNG much bigger than my JPEG?"
    a: "PNG is lossless. A 207.8 KB photograph in JPEG became a 1,540,183-byte PNG at the same 1280 × 720 size. The export is meant for comparing guides on top of the picture, not for uploading, so run it through the Image Compressor if you want a small copy."
  - q: "Do the guides change my image?"
    a: "No. The guides are drawn on a copy at export time; the original file is never altered. Uncheck them, export again and the picture comes back with whatever guides remain, down to a plain copy if all four are off."
  - q: "Is the 5% margin exactly what YouTube covers?"
    a: "It is a design aid, not a platform measurement. The real overlays vary by surface, by player and by phone model. Treat the margin as the conservative line, put essential text well inside it, and confirm the final file with a real upload and a look at the phone feed."
---

A thumbnail is designed in one place and seen in another. The designer sees a flat 16:9 picture; the viewer sees a card that has been cropped to a narrower shape, darkened at the bottom, and stamped with a duration in the corner. The [Thumbnail Safe Zone tool](/thumbnail-safe-zone/) puts those layers over the picture before it is published, and this post is a measured walk through a real session so the numbers behind the guides are visible.

## What the panel reads before you draw anything

The dropzone accepts JPG, PNG and WebP. A 1280 × 720 JPEG of 207.8 KB appeared in the panel with three rows: the file name, the dimensions as **1280 × 720**, and the size. Under them the shape check printed its verdict, and a line below that said which guides were on.

The image is decoded by the browser itself and then drawn in three places: the 16:9 player card, the 9:16 phone card and the export canvas. There is no upload step, and the note under the buttons says the same in plainer words. The Reset button clears the file and puts all four toggles back to checked, which matters because the toggles are the whole interface.

## The four guides, in pixels at 1280 by 720

Each guide is a fixed fraction of the frame, so the pixel values follow from the size of the file you loaded:

- **Safe margin:** a dashed rectangle inset by 5% on every side. At 1280 × 720 that is 64 pixels in from the left and right and 36 pixels in from the top and bottom.
- **Bottom gradient band:** the lower 30% of the frame, 216 pixels, fading from transparent at the top to 82% black at the bottom edge.
- **Duration badge:** the text 12:46 in a dark box, in the bottom-right corner. The font is sized from the width (width divided by 42, so 30 pixels here) and the box is held 1.2% from the right edge and 2.2% above the bottom.
- **Phone lines:** two dashed verticals at 25% and 75% of the frame, which is x = 320 and x = 960 at this width.

The toggles are independent. Turning all four off, as the test did, left the download button enabled and produced a clean copy of the picture; switching them back restored the guides exactly. Nothing snaps, nothing moves, and no setting is remembered between visits, so a fresh load always starts with all four checked.

<figure>
  <img src="/assets/img/blog/thumbnail-safe-zone-guide/tool.webp" alt="The Thumbnail Safe Zone tool with a 1280 by 720 image loaded, four guides switched on, and the 16:9, 9:16 phone and export cards showing the same picture" width="1072" height="798" loading="lazy">
  <figcaption>The measured session: a 1280 × 720 file of 207.8 KB, all four guides on, and the text EDGE TITLE sitting just outside the dashed safe margin.</figcaption>
</figure>

## The shape check reads a ratio, not a size

The check compares the width-to-height ratio of the file with 1280 divided by 720, allowing a tolerance of 0.01. That tolerance is what decides between two very different messages:

- **1920 × 1080** passed with the hint "16:9 - the same shape YouTube uses for thumbnails." A downscaled 320 × 180 file passed with the same hint. There is no minimum-resolution gate anywhere in the page.
- **1600 × 600** produced the warning "Not 16:9 (1600 × 600). YouTube crops it, so check the checked guides before you publish." in the error style, and every other control kept working, including the download.

So the panel gates shape and never size. A 320 × 180 file passes the ratio test and exports at 320 × 180, which is honest but not something to publish: YouTube displays thumbnails far larger than that, and an upscaled 320-wide picture is soft at every size. Read the dimensions row with the same attention as the hint.

A 0.01 tolerance works out to about 0.6% of the ratio, so a file such as 1280 × 722 or 1280 × 718 still counts as 16:9. That is deliberate slack for files that were cropped by one or two pixels, not a licence to ignore a visibly different shape.

## The phone preview crops harder than it looks

The phone card is 190 pixels wide and 338 tall, a 9:16 frame, and the picture inside is drawn with object-fit cover. Cover means the image is scaled until it fills the frame and the overflow is cut away, so a 16:9 still is scaled by height and only its middle strip survives: about 32% of the width, the centre third.

The two dashed lines at 25% and 75% sit inside that already-cropped view and mark its middle half. Put together, a word at 10% from the left of the original design never appears in this card at all, and a word at 30% appears but sits outside the marked band.

<figure>
  <img src="/assets/img/blog/thumbnail-safe-zone-guide/phone-feed.webp" alt="A person holding a phone open on the YouTube app, a video page with a thumbnail and a list of suggested videos below it" width="1200" height="675" loading="lazy">
  <figcaption>The phone is the smallest place a thumbnail is seen, and the feed draws its own text and buttons over the lower part of the picture.</figcaption>
</figure>

That is why the phone card is worth checking first. If the headline still reads there, the 16:9 card will not surprise you later.

## The exported PNG keeps the source size

The download button draws the guides onto a copy of the image at its natural size and saves it as the file name plus `-guides.png`. In the session, the 1280 × 720 file produced `thumb16x9-guides.png` at **1,540,183 bytes**, and the 1600 × 600 file produced a **1,440,348-byte** PNG still at 1600 × 600.

Two consequences follow. First, the guides scale with the picture, so a line that looks thin at 1280 stays proportionally thin at 1920. Second, the file is large for a thumbnail: a 207.8 KB photograph became a 1.5 MB PNG because PNG is lossless. YouTube's help page asks for a file under 2 MB, so a big source near the limit can cross it after export. The [Image Compressor](/image-compressor/) is the next stop when the exported copy has to go online.

The export is also blind to what you intend. There is no JPEG option, no resize field and no way to export only one guide at a larger scale: what is checked is drawn, and what is drawn is the size of the file you loaded. If the picture needs a different size, the [Image Resizer](/image-resizer/) handles that before the guides go on.

## Where the 5% margin is generous, and where it is not

The margin is a rectangle, and rectangle margins are a compromise. Two details in the measured session show where it stops being safe:

- The badge box sits inside the bottom-right corner of the margin, so text that ends exactly on the 5% line can still meet the badge. Leave a gap larger than one character.
- The gradient starts at 70% of the height, and the margin starts at 95%. The whole bottom margin is inside the gradient, so a caption placed on the line still loses contrast even though it is technically outside the cut.

The honest statement is that 5% is a design aid, not a platform measurement. YouTube's overlay sizes differ between the watch page, search, the home feed and the phone app, and they change over time. Use the margin to catch text that is obviously too close to an edge, then confirm with the [Title Preview](/title-preview/) and a real upload before trusting it.

## Failures and limits

A file with a wrong type gets the toast "Please choose an image file (JPG, PNG or WebP)." and a file the browser cannot decode gets "That image could not be opened. Try a JPG, PNG or WebP file." Both messages are clear, but neither state is a reset: the previous thumbnail, with its old name and numbers, stays in the panel. Watch the file name row after a failed drop so you do not export guides over the wrong picture.

The quieter limits: one image at a time, no zoom into the guides, no saved settings, no minimum-resolution warning, and an export that is always PNG. The phone card is a fixed 9:16 approximation of a feed that varies by device.

## A working order

1. Load the thumbnail at 1280 × 720 and read the dimensions row before looking at anything else.
2. Switch guides on or off as needed, and treat the 5% margin as the outer limit, not a target.
3. Check the phone card first; if the words survive the centre third, the rest is easier.
4. Export the guided copy and view it at 100% rather than fitted to the window.
5. Compress or resize the exported PNG before uploading, and keep the original JPEG untouched.

For the frames themselves, the [Video Frame Grabber](/video-frame-grabber/) pulls a still from the clip and the [YouTube Thumbnail Downloader](/youtube-thumbnail-downloader/) fetches a published one, so both ends of the job stay on the same device.