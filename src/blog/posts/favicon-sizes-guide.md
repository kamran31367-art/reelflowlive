---
title: "Favicon sizes: the seven files a site actually needs"
description: "Which favicon sizes browsers and phones ask for, how to design for 16 pixels, and where each file goes so the tab, bookmark and home screen all look right."
date: 2026-11-27
categories:
  - Images
  - Website
cover: assets/img/blog/favicon-sizes-guide/hero.webp
coverAlt: "A phone lying on a wooden table with its home screen full of app icons"
coverCaption: "The home screen is where the 180 px and 512 px files are read. The shapes have to survive at 16 px before they earn a place here."
takeaways:
  - "A site needs seven square PNGs (16, 32, 48, 64, 180, 192, 512) plus one favicon.ico that packs the 16, 32 and 48 px versions."
  - "The 16 px tab icon is the hard constraint: two letters inside it are drawn at 7 px, so thin detail is wasted effort."
  - "The 180 px file is the Apple touch icon, and 192 plus 512 feed the Android home screen and splash screen."
  - "An oversized PNG renamed to favicon.ico is the usual reason a new site looks blurry or blank in the tab."
  - "Browsers cache icons aggressively, so a replaced favicon often needs a hard reload or a new tab to appear."
faq:
  - q: "Do I really need all seven PNG sizes?"
    a: "The minimum that works everywhere is 16 and 32 px for the tab and bookmarks, 180 px for an iPhone home screen and 512 px for the manifest. The 48, 64 and 192 px files cost a few kilobytes and cover Windows shortcuts, scaled tab bars and Android launchers, so generating all seven is simpler than guessing which platform will ask next."
  - q: "Why does my favicon look blurry or blank in the tab?"
    a: "Two common causes. Either a large image was renamed to favicon.ico without being split into small sizes, so the browser shrinks one big picture and the result is soft, or the old icon is still cached. Check the file by opening /favicon.ico in a new tab, then hard reload the site. A relative path from a subpage is the third cause: icons belong in the site root with paths that start with a forward slash."
  - q: "Should I use an SVG favicon instead?"
    a: "An SVG icon stays sharp at any size, and Chrome, Firefox and Edge display it, but Safari does not render SVG favicons, so a site that ships only SVG shows a blank tab there. The safe arrangement is an SVG for browsers that take it, plus the PNG set and the .ico as the fallback. A PNG set covers everything without that if."
  - q: "Does the favicon affect search ranking?"
    a: "No, it is not a ranking factor. It does appear beside search results and in bookmarks, so it carries brand recognition, and a missing or broken icon makes a site look unfinished. The complete set costs under 30 KB, which is why there is little reason to ship a site without one."
  - q: "Can I use a photo as the icon?"
    a: "Yes, the generator crops any image to a square from the centre and scales it down. A busy photo usually turns into a grey blur at 16 px, so a logo with one or two shapes reads better, and a photo works best when the subject sits in the middle with space around it."
---

A favicon shows up in the browser tab, in bookmarks, in search results and on a phone home screen, and each of those placements asks for a different size. The [Favicon Generator](/favicon-generator/) draws the standard set from one image or from one or two letters, all on a canvas in the browser, and packs the small sizes into a single `.ico` file.

This guide covers which sizes matter, how to design something that survives at 16 pixels, and where each file goes so the tab, the bookmark bar and the home screen all render the same mark.

<figure>
  <img src="/assets/img/blog/favicon-sizes-guide/dock-icons.webp" alt="A Mac dock on a grassy wallpaper with Safari, Chrome, Mail and other app icons, Mail carrying a red notification badge" width="1200" height="620" loading="lazy">
  <figcaption>A dock at normal size. The red Mail badge is bigger than most favicons get to be, which is why the shape has to carry the meaning, not the detail.</figcaption>
</figure>

## The seven sizes, and what asks for each one

| Size | Where it is used |
| --- | --- |
| 16 px | Browser tabs, bookmark bars, history menus |
| 32 px | Tabs on high-density screens, some mobile bookmarks |
| 48 px | Windows shortcuts, some Android launchers |
| 64 px | Scaled tab bars and older desktop integrations |
| 180 px | Apple touch icon, for a page saved to an iPhone or iPad home screen |
| 192 px | Web app manifest, Android home screen |
| 512 px | Web app manifest, splash screen and task switcher |

On top of the PNGs, a single `favicon.ico` that packs the 16, 32 and 48 px versions covers browsers that still request the classic file by name from the site root. The generator builds that `.ico` by hand: 6 bytes of header, 16 bytes per packed image, then the PNG data, which comes to a little over 2 KB for a letter icon.

<figure>
  <img src="/assets/img/blog/favicon-sizes-guide/tool.webp" alt="The Favicon Generator in text mode with the letters RF on a blue rounded square, showing seven rendered icons from 16 to 512 pixels and a Download favicon.ico button" width="1072" height="454" loading="lazy">
  <figcaption>A real run with two letters on #2563eb. The seven PNGs measure 409 bytes at 16 px and 16,537 bytes at 512 px, 28,609 bytes together, and the `.ico` that packs the three small ones is about 2.1 KB.</figcaption>
</figure>

## Designing for 16 pixels

The tab icon is the constraint everything else follows from. At 16 px, two letters are drawn at 7 px of type, and the rounded corner radius on that shape is about 3.5 px. There is no room for a tagline, a gradient or a hairline.

What survives:

- One or two thick shapes with strong contrast.
- A single letter, or a two-letter abbreviation, as the smallest readable version of a wordmark.
- A small margin around the mark, because some platforms round the corners further and clip the edges.

What disappears: thin strokes, small text, drop shadows and any logo that needs three colours to be recognised. If the full logo fails that test, a coloured square with the brand's first letter usually beats it in the tab.

## Letters, and the colour behind them

A letter icon is two decisions: which letters, and which pair of colours. For the letters, one or two characters are all the generator accepts, sliced to the first two and uppercased, and one letter is drawn larger than two, so a single initial fills the square better than an abbreviation.

For the colours, the rule is the same one that governs caption text: contrast decides legibility, not taste. A mid-grey letter on a slightly lighter grey looks refined at full size and turns into a smudge at 16 px, and the same happens on a home screen where the icon sits among brighter neighbours. Dark ink on a light background, or white on a saturated dark one, both read at tab size. The [contrast guide](/blog/contrast-ratio-captions/) covers the ratios if you want a number instead of a guess.

The shape matters less than the colours. Square, rounded and circle all render cleanly at every size offered here, and a rounded square matches what most operating systems draw anyway.

## The `.ico` file is still worth shipping

Browsers today read PNG icons from the head just fine, so the `.ico` looks redundant. It is not, for two reasons. First, some older tabs and bookmark bars still request `/favicon.ico` by name when no `link` tag says otherwise. Second, a `.ico` that contains several sizes lets a browser pick a 16 px bitmap for the tab and a 48 px one for a desktop shortcut from one file.

The generator gives you both paths: the seven PNGs for the head and the manifest, and the packed `.ico` for anything that falls back to the old default. Keeping the two in step costs nothing, because both come from the same canvas.

## Where the files go

Upload everything to the site root, with these names:

```
/favicon.ico
/favicon-16x16.png
/favicon-32x32.png
/favicon-48x48.png
/favicon-64x64.png
/apple-touch-icon.png        (180 px)
/favicon-192x192.png
/favicon-512x512.png
```

The 180 px file keeps the name `apple-touch-icon.png` because iOS looks for that name at the root before it reads any `link` tag. The 192 and 512 px files are referenced from the web app manifest, not from the page head.

## The snippet the head needs

The Copy HTML snippet button returns the six lines that reference the small PNGs, the `.ico` and the touch icon:

```
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" href="/favicon.ico" sizes="48x48">
```

Paste it between the `head` tags of every page. On a static site that usually means one shared layout file, which is the only place the paths should live.

## Why the new icon does not show up

Browsers treat favicons as long-lived assets and cache them hard, often for weeks. After replacing one, the old image can survive a normal reload. What clears it in practice:

- A hard reload, which bypasses the cache for that page load.
- Opening the site in a brand new tab or window.
- Checking `/favicon.ico` and `/favicon-32x32.png` directly in the address bar, to confirm the file on the server is the new one.
- On iOS, removing the home screen shortcut and adding it again, because the touch icon is captured at that moment.

If the file is correct and only one browser is stale, the cache is the explanation. Changing a file name and updating the snippet also works, at the cost of one extra file left on the server.

## Where the generator stops

It draws PNG and `.ico` only, so there is no SVG output; an SVG icon needs a vector source, and only some browsers display one. It does not write a `manifest.json`, though the 192 and 512 px files it produces are exactly what a manifest asks for. Icons are generated edge to edge, so a manifest that requests a maskable icon will still need the safe-zone padding Android applies on its own.

Two smaller notes. Image mode crops to a square from the centre with no manual crop, so a portrait photo loses its sides. Letter mode always paints a solid background, which means the tab icon is a coloured block rather than a transparent glyph. Both are visible in the previews before you download anything, so neither is a surprise.

## A short working order

1. Pick the mark: a logo with one or two shapes, or a two-letter abbreviation.
2. Check it at 16 px in the preview grid before downloading the rest.
3. Download all seven PNGs and the `.ico` into the site root.
4. Paste the snippet into the shared head, or copy the paths if you maintain the head by hand.
5. If the site is installable, add the 192 and 512 px files to the manifest.
6. Hard reload, open a new tab, and confirm the tab, the bookmark and the phone home screen each show the same mark.

The whole set is under 30 KB, which is less than one thumbnail on most sites, and it is the first image a visitor sees from a search result. Getting the seven sizes right once means never noticing the icon again, which is the point.