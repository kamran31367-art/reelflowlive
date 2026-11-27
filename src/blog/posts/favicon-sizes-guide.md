---
title: "Favicon sizes: the seven files a site actually needs"
description: "Which favicon sizes browsers and phones ask for, how to design for 16 pixels, and where each file goes so the tab, bookmark and home screen all look right."
date: 2026-11-27
categories:
  - Images
  - Website
draft: false
---

A favicon shows up in the browser tab, in bookmarks, in search results and on a phone home screen. Each of those placements asks for a different size, so one oversized PNG renamed to `favicon.ico` is the usual reason a new site looks blurry or blank in the tab.

## The sizes worth generating

Seven square PNGs cover every placement that matters:

- **16 and 32 px** - browser tabs, bookmarks and history.
- **48 px** - Windows shortcuts and some Android launchers.
- **64 px** - high-density tabs and older desktop integrations.
- **180 px** - the Apple touch icon, used when a page is added to an iPhone or iPad home screen.
- **192 and 512 px** - the web app manifest sizes Android uses for the home screen, splash screen and task switcher.

On top of the PNGs, a single `favicon.ico` that packs the 16, 32 and 48 px versions covers browsers that still ask for the classic file. The [Favicon Generator](/favicon-generator/) builds all seven PNGs and that `.ico` from one image or from one or two letters, and previews each size at real dimensions.

## Designing for the smallest size

The 16 px tab icon is the hard constraint. At that size a detailed logo turns into a grey blob, so:

- Use a simple shape with one or two colours.
- Keep the mark centred with a small margin, because some platforms round the corners.
- Avoid thin lines and text - they disappear below roughly 24 px.

If the brand has a distinctive single letter, a coloured square with that letter is often more recognisable in a tab than the full logo.

## Letter icons are a legitimate option

Not every project has a usable logo file. The generator can render one or two letters with a chosen background and text colour across the same seven sizes. It is the quickest way to get a consistent icon for a new site, and you can replace it later without changing any URLs.

## Where the files go

Upload the icons to the site root so the standard paths work:

```
/favicon.ico
/favicon-16x16.png
/favicon-32x32.png
/apple-touch-icon.png        (180 px)
/icon-192.png
/icon-512.png
```

Reference the small PNGs and the `.ico` in the page head, the 180 px file as the Apple touch icon, and the 192/512 px files in the web app manifest. Browsers cache icons aggressively, so after replacing one, a hard reload or a new tab is often needed before the change appears.

## Why generate them locally

A favicon is the first thing a site publishes and usually the last thing worth uploading to a third-party service. The generator draws every size on a canvas in the browser, so the source image and the letter settings never leave your device.
