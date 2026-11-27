---
title: "How to view and remove image metadata locally"
description: "Inspect camera and EXIF details as text, or create a clean PNG by re-encoding the image without copying the source metadata block."
date: 2026-11-27
categories:
  - Image
cover: assets/img/blog/image-exif-tool/hero.svg
coverAlt: "A photograph beside a list of metadata fields including camera model and capture date"
coverCaption: "Metadata describes a file; removing it changes the export, not the visible information inside the photo."
takeaways:
  - "View metadata reads supported fields with the bundled parser and returns them as selectable, downloadable text."
  - "Remove metadata draws the image on a canvas and exports metadata-removed.png instead of editing the original file."
  - "The cleaned PNG keeps the decoded pixel dimensions, but it is not a selective tag editor or a forensic guarantee."
  - "Visible details, faces, screens and text remain in the pixels, so metadata removal is not redaction."
  - "Both modes run locally in the browser, with no image upload or account required."
faq:
  - q: "Does removing metadata change the image dimensions?"
    a: "No. The decoded source dimensions are used for the output canvas. The format changes to PNG, and metadata is not copied from the source, but the width and height stay the same."
  - q: "Can I remove only GPS or edit one EXIF field?"
    a: "No. Remove mode re-encodes the whole image and does not copy the source metadata block. It does not offer individual field selection or editing."
  - q: "Does this guarantee that every trace of private data is gone?"
    a: "No. Source EXIF is not carried into the new canvas PNG, but visible information remains, and metadata removal is not a guarantee against every form of hidden data. Review the actual exported file for high-risk publishing."
  - q: "Which image formats can it process?"
    a: "View mode depends on the bundled metadata parser, while Remove mode also depends on the browser's ability to decode the image. Common JPG, PNG and WebP files work; HEIC and TIFF support varies."
draft: false
---

A photograph can carry more than the scene you see. Camera model, capture time, orientation and sometimes GPS coordinates may be stored alongside the pixels. Those details are useful in a photo library but are not always appropriate in a public handoff.

The [Image EXIF Viewer and Metadata Remover](/image-exif-tool/) offers two local modes: inspect supported metadata as text, or create a new PNG by re-encoding the image without copying the source metadata. It never modifies the original file.

## What the metadata tool is for

Use View mode to answer practical questions: which camera made the file, when it was captured, what orientation information it contains, or whether location fields are present. The output is text, so it can be copied into a handoff note or downloaded for review.

Use Remove mode when you want a clean derivative for publishing, a client portal or a folder of images that should not carry source camera metadata. The tool takes the simple route: decode the image, draw the pixels and encode a fresh PNG.

It is not a forensic examiner, tag editor or privacy filter for visible content. Metadata removal does not blur faces, hide a screen or erase a licence plate; those tasks require pixel editing.

## Controls and what they change

Choose one image with the file control. The input label accepts `image/*`, but actual parsing and decoding depend on the file and the browser.

**Mode** has two choices:

- **View metadata:** the bundled parser reads supported metadata fields and returns key-value text.
- **Remove metadata:** the browser decodes the image, draws it on a canvas and produces a PNG.

Press **Process image** after choosing the file and mode. This tool does not auto-run when the selection changes, so you can switch modes before starting.

View mode merges parser output into one object. Simple values appear directly; nested objects are formatted as JSON. With no entries, the result says no EXIF metadata was found. A parsing exception is reported as no readable EXIF rather than a partial field list.

<figure>
  <img src="/assets/img/blog/image-exif-tool/workflow.svg" alt="Workflow from a source photo into either metadata text or a freshly encoded PNG without source metadata" width="1200" height="675" loading="lazy">
  <figcaption>View mode reports supported fields as text; Remove mode creates a new canvas export rather than deleting tags in place.</figcaption>
</figure>

Parser coverage is not identical across every format. A field that matters to your workflow should be checked in the actual output instead of assumed to exist.

## Worked example: checking a phone photo

Suppose you have a JPG from a phone and want to inspect it before publishing. Choose the file, leave mode on View metadata and press **Process image**.

The result may list fields such as camera make, model, capture date, orientation and location when those tags are present. The exact list depends on what the phone wrote and what the parser supports. No readable metadata is also a valid result.

Next, switch to Remove metadata and process the same file. The tool creates `metadata-removed.png`. A 4032 by 3024 source produces a 4032 by 3024 PNG. The scene remains, but source camera and GPS metadata are not copied into the canvas export.

Compare the files in your photo library if it exposes metadata. Also inspect the visible pixels at full size. Dimensions remain fixed, but colour management and orientation handling can affect how different viewers present the PNG.

<figure>
  <img src="/assets/img/blog/image-exif-tool/example.svg" alt="A phone photo with metadata fields on the left and a cleaned PNG with the same dimensions on the right" width="1200" height="675" loading="lazy">
  <figcaption>The cleaned derivative keeps the decoded 4032 by 3024 pixels while leaving the source metadata block out of the PNG export.</figcaption>
</figure>

If the photo contains a readable document, a private address or an account screen, metadata removal does not solve that problem. Crop or redact the visible content in an editor before using the cleaned file.

## Output and formats

View mode produces text that can be copied or downloaded as `image-exif-tool.txt`. It is a report, not a modified image.

Remove mode produces `metadata-removed.png`. PNG is the only export format, so a JPG becomes a new PNG rather than a JPG with selected fields removed. The original stays untouched.

Source EXIF is not carried into the canvas export. PNG can still contain standard image information or data added later. “Metadata removed” means the source block is not copied; it does not promise a metadata-free binary in every viewer.

Animated inputs become a still frame. Transparency supported by the browser can remain in the PNG. Wide-gamut colour profiles may not survive unchanged, so inspect critical colour work before publishing.

## Limits and edge cases

There is one image at a time, no batch export and no field-by-field editing. The viewer cannot restore metadata that was already stripped by a messaging app or earlier export.

Remove mode needs the browser to decode the full image. Very large photos can consume significant memory, and there is no configured file-size cap. Use a smaller derivative when full resolution is unnecessary.

HEIC and TIFF behavior varies by browser. View mode may read some metadata even when Remove mode cannot decode the image, because parsing and pixel decoding are different operations. If removal fails, convert the file to a browser-supported format first and review that conversion separately.

## Common mistakes to avoid

Do not treat metadata removal as anonymisation. A face, a reflection, a road sign or a document can identify a person or place without any EXIF field. Review the visible content independently.

Do not expect Remove mode to preserve the original format, filename or animation. The result is always a new PNG with a fixed download name. Rename it after saving to avoid confusion with other cleaned images.

Be equally careful not to overstate the viewer. “No readable EXIF metadata found” means the parser did not return usable fields, not proof that the file contains no hidden data anywhere. For high-risk publication, inspect the exported file with an appropriate metadata tool and review the visible pixels.

## Local privacy and file handling

The image is processed inside the browser tab: metadata parsing, canvas decoding and PNG encoding are local. There is no upload queue or account. The original remains on disk, while the report and cleaned PNG are separate downloads. Store sensitive outputs appropriately on shared hardware.

## A practical workflow

1. Keep an untouched original in a safe location.
2. Run View metadata and save the report if the fields matter to the handoff.
3. Decide whether visible content also needs cropping or redaction.
4. Switch to Remove metadata and create the PNG.
5. Inspect the exported dimensions, orientation and colour.
6. Check the exported file's metadata with another trusted viewer when the stakes are high.
7. Rename the cleaned file clearly and store it beside, not over, the original.

For routine web publishing, this process is usually enough to avoid carrying phone camera metadata into a new upload. For documentary archives, keep the original metadata intact and export a separate publishing copy.

## Final checklist

- Confirm whether you need a text report, a cleaned image or both.
- Check that View mode found the fields you expected.
- Review visible private information separately from metadata.
- Expect Remove mode to output PNG at the decoded source dimensions.
- Inspect orientation and colour in the exported file.
- Keep the original untouched.
- Rename the cleaned derivative before sharing it.

Metadata is only one layer of an image file. Inspect it when you need facts, re-encode when you need a clean derivative, and always review what the picture itself reveals.
