---
title: "How to download a YouTube thumbnail in full size"
description: "Every size YouTube stores for a thumbnail, how to grab the largest one, and what to do when the download is blocked on a phone."
date: 2026-11-27
categories:
  - YouTube
  - Images
draft: false
---

There are a few honest reasons to download a thumbnail: you are moving an old video to a new channel, you lost the original design file, or you want a reference for your own next upload. Whatever the reason, the image already exists on a YouTube server, so there is no need to screenshot the player.

## Every size YouTube stores

For each video, YouTube keeps several copies of the thumbnail:

- **maxresdefault** - 1280 x 720, the full HD version.
- **sddefault** - 640 x 480.
- **hqdefault** - 480 x 360, always exists.
- **mqdefault** - 320 x 180.
- **default** - 120 x 90, a small square crop.

The catch is the first one: YouTube only creates `maxresdefault` when the uploader set a custom thumbnail at full resolution. Many older or auto-generated thumbnails stop at `hqdefault`, which is why a download can look softer than expected.

## Paste the link, pick the size

The [YouTube Thumbnail Downloader](/youtube-thumbnail-downloader/) reads all of those sizes for a video at once. Paste a watch link, a `youtu.be` short link, a Shorts or Live URL, or just the 11-character video ID. The tool shows every size the video actually has and marks the largest one. Save that.

It is worth knowing what the numbers mean before you click:

- If **1280 x 720** is offered, take it. That is the exact size YouTube recommends for thumbnails.
- If the largest is **480 x 360**, the video has no HD thumbnail. You can still use the image, but do not scale it up - it will only get blurry.
- The 120 x 90 copy is a square center crop, not the full frame. Avoid it unless you need an avatar.

## When the browser blocks the download

Mobile browsers sometimes ignore a download link and open the image instead. The tool has two fallbacks for that: **Copy image URL** puts the direct address on your clipboard, and **Open image** loads it in a new tab where you can long-press and save. Both give you the same original file, not a re-compressed copy.

## What to do with the image next

A downloaded thumbnail is usually a starting point, not the final asset:

- Need a different crop for Shorts? Use the [Image Resizer](/image-resizer/) with the 1080 x 1920 preset.
- Need the file under a size limit? Run it through the [Image Compressor](/image-compressor/).
- Designing from scratch? The [thumbnail size guide](/blog/youtube-thumbnail-size/) lists the specs YouTube checks on upload.

## A quick word on ownership

Downloading a thumbnail does not give you the rights to the artwork. Use it as a reference, for archiving your own uploads, or with the owner's permission. Re-uploading someone else's design as your own is a copyright problem regardless of how the file was obtained.

## Checklist

- Paste the video link and pick the largest available size.
- Expect 1280 x 720 only when the uploader set a full-size thumbnail.
- On a phone, use Copy image URL or Open image if the download is blocked.
- Resize or compress afterwards with the browser tools, not with a screenshot.
