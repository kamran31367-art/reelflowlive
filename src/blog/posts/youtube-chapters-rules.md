---
title: "YouTube chapters: the rules, and the checks that catch you first"
description: "Three timestamps, the first at 0:00, ten seconds apart, in ascending order and written on their own lines. What the YouTube Chapters builder checks live, from its first load to a copied description block."
date: 2026-11-27
categories:
  - YouTube
  - Video
cover: assets/img/blog/youtube-chapters-rules/hero.webp
coverCaption: "A chapter list is plain text in the description, but every line has to survive a set of rules before the player draws a chapter rail."
coverAlt: "A video editing timeline seen from an angle, with clips laid out as coloured blocks across several tracks"
takeaways:
  - "The builder opens with three rows and one filled time, 0:00, so the first check already passes while the count line reads At least 3 chapters (1 so far)."
  - "A new row takes the last valid time plus 30 seconds: a list ending at 1:30 produced 2:00, and after adding 3:10 the next row started at 3:40."
  - "Blurring a time field rewrites it: 125 became 2:05, 90.6 became 1:30, and 1:02,5 was accepted as 1:02 because the converter floors partial seconds."
  - "Two chapters on the same timestamp fail two checks at once: ascending order and the 10-second gap, while the count line still says 4 so far."
  - "The output is a plain block, one line per chapter, ending in a newline; an untitled row is still written as 0:45 (untitled chapter) even though the title check is red."
faq:
  - q: "What are YouTube's actual chapter requirements?"
    a: "A description needs at least three timestamps, the first one at 00:00, and each chapter must run at least ten seconds. The timestamps must appear in ascending order, one per line, each followed by a title. When those hold, the player shows a chapter rail instead of a single progress bar. The builder here enforces the same four rules and adds optional length checks."
  - q: "Why does the counter say 1 chapter even though there are three rows?"
    a: "Only rows with a parseable time count. The page starts with 0:00 filled and two blank rows, so the live check reads At least 3 chapters (1 so far) and the first-chapter check is already green. Filling the blanks with times raises the count; leaving a time empty keeps the row out of the output."
  - q: "What happens if I type 125 instead of 2:05?"
    a: "Nothing until you leave the field. On blur the tool parses the number as seconds and rewrites it in m:ss form, so 125 becomes 2:05. The same step handles 1:02,5 with a comma decimal and drops parts of a second: 90.6 becomes 1:30, and 1:02:03.5 is written as 1:02:03 in the copied block."
  - q: "Can I copy the block while a check is red?"
    a: "Yes, as long as at least one row has a valid time. Copy and Download only disable when no row parses, so a list with two chapters or a missing title can still be copied. Treat the red rows as a preview of what YouTube will refuse, and fix them before pasting."
  - q: "Do I need to add the video length?"
    a: "It is optional. Without it you get five checks; with it, two more appear: every chapter inside the video length, and the last chapter running at least ten seconds before the end. A 4:00 length approved a list ending at 3:10, while entering 3:10 or 2:00 as the length turned both new checks red."
---

Chapters are one of the few YouTube features that still runs on plain text. You type timestamps into the description, and the player reads them back and draws a chapter rail. There is no chapter editor and no upload step, which is good news for anyone who has a transcript, a plan, or a rough cut already sitting in front of them. The catch is that one malformed line is enough for YouTube to ignore the whole block. The [YouTube Chapters builder](/youtube-chapters/) exists to make that failure visible before you paste, and this post walks through what its checks do, using a short measured session.

## The four rules behind every chapter list

YouTube's own conditions are short: at least three timestamps, the first at `00:00`, each chapter lasting at least ten seconds, and the list in ascending order. Titles are optional in the strictest reading of the format, but an untitled line reads badly and makes the rail hard to scan, so the builder flags it too.

The page states the rules in a single note under the rows: "YouTube needs at least 3 chapters, the first at 0:00, and every chapter at least 10 seconds long. Press Enter in a title to add the next chapter." Everything else in the tool — the live checks, the sorting, the optional length field — exists to help you satisfy that sentence.

## What the page shows before you type anything

A fresh load creates three rows: `0:00` in the first time box, two blank rows under it, and no titles. The checks panel beside it already has an opinion:

- ✕ At least 3 chapters (1 so far)
- ✓ First chapter starts at 0:00
- ✓ Timestamps are in ascending order
- ✓ Every chapter is at least 10 seconds apart
- ✕ Every chapter has a title

Two reds on a blank page might look harsh, but they are accurate. Only one row has a parseable time, and no row has a title. The description block below the checks is not empty either: it contains the single line `0:00 (untitled chapter)`. That placeholder is the tool's way of showing what an untitled time looks like in the output rather than silently dropping it.

One surprise worth knowing: Copy chapters and Download .txt are enabled from that first moment, because the only gate is whether any row parses. The checks are advice, not a lock.

## Why the counter and the output disagree

Filling three titled rows at 0:00, 0:45 and 1:30 brings every default check green, and the block becomes three clean lines:

```
0:00 Intro
0:45 Setup
1:30 Main demo
```

An empty time box is simply skipped by the parser, while an untitled one is kept in the output with the placeholder text. Those two behaviours are different on purpose: a missing time means the row is not yet a chapter, but a missing title is a chapter you have not named. The check list keeps telling you which is which.

<figure>
  <img src="/assets/img/blog/youtube-chapters-rules/tool.webp" alt="The YouTube Chapters builder with four rows filled and a 4:00 video length, showing all seven live checks green and the generated description block with four lines" width="1072" height="560" loading="lazy">
  <figcaption>Four chapters and a 4:00 length: seven checks, all green, and a block ready to paste. The checks rebuild on every keystroke, so a typo turns the list red immediately.</figcaption>
</figure>

## Time fields reformat on blur, not while you type

The time boxes accept several shapes: `125`, `2:05`, `1:02:03.5`, and yes, `1:02,5` with a comma. The field only rewrites the value when you leave it. Typing `125` and tabbing away turned it into `2:05`; `90.6` became `1:30`, and `1:02:03.5` was written as `1:02:03` in the output, because the formatter floors seconds rather than rounding them.

That floor matters for cuts that land mid-second. A start of `1:02:03.9` is advertised as `1:02:03`, one second earlier than the frame you meant, so start chapters on whole seconds and the number on screen will match the picture.

A value the parser cannot read is not thrown away, it is marked. `abc` stays in the box with a red border, adds one more check — ✕ Fix the highlighted time fields — and is left out of the output, so the copyable block never contains junk. The count in the first check also ignores it: three valid rows around one bad row still reads (3 so far).

## New rows inherit a time, thirty seconds later

The + Add chapter button does more than append an empty row. It looks at the last parseable time and adds 30 seconds, which is a reasonable first guess for talking-head videos and tutorials where each section runs half a minute or more. A list ending at 1:30 produced a new row at 2:00; after adding 3:10, the next row started at 3:40.

Enter inside a title box triggers the same add, which keeps both hands on the keyboard while you transcribe a plan. Delete rows with the × button; deleting the final remaining row immediately recreates a blank `0:00` row, so the page can never reach a state with nothing to edit.

## Order is checked by arithmetic, not by rows

The ascending check compares each time with the one above it, and the spacing check measures the same difference against ten seconds. Both use your row order, which is why Sort by time exists. Feeding it rows out of order — 0:45 above 0:00 — and pressing the button put them back in sequence and turned the list green again. Rows with unreadable times sort to the bottom rather than breaking the sort.

The interesting case is a duplicate. Two chapters at 0:45 fail both checks at once, because a zero difference is not ascending and it is certainly under ten seconds. The count line still reads four chapters, which is correct and misleading in equal measure: four timestamps exist, but one pair of them would not survive the player.

## The optional length field adds two checks

Without a video length, five checks run. Adding one — `4:00` in the test — appends two more: All chapters are inside the video length, and The last chapter runs at least 10 seconds. Together they catch the two failure modes that timestamps alone cannot: a chapter pointing past the end of the video, and a final chapter so close to the end that the rail has nowhere to display it.

In the measured session, a 4:00 length happily approved a list ending at 3:10, leaving 50 seconds for the last chapter. Setting the same length to 3:10 turned both new checks red, since the final chapter no longer sits strictly inside the video and nothing remains after it. Setting it to 2:00 kept both red.

<figure>
  <img src="/assets/img/blog/youtube-chapters-rules/watch.webp" alt="A laptop showing the YouTube home page in a browser, with the sidebar, category chips and a video thumbnail visible" width="1200" height="675" loading="lazy">
  <figcaption>The description is where chapters live: the player reads the timestamps from that block and builds the rail itself. Nothing is uploaded from the builder.</figcaption>
</figure>

## What actually lands in the description

The output is plain text, one chapter per line, time first and title second, exactly the shape YouTube parses. A trailing newline is added when you download, which matters for pasting into a description that already has text above it. Copy writes the same block to the clipboard and confirms with "Chapters copied - paste them into your description." Download saves `youtube-chapters.txt` with the same content and its own confirmation toast.

Two honest limits. First, the placeholder line is copied like any other, so an untitled chapter becomes `0:45 (untitled chapter)` in your description — name it before copying unless you want that literal text on the rail. Second, the builder does not know your video's real duration unless you type it, and it never talks to YouTube, so nothing verifies the pasted result. Open the watch page after saving and look for the chapter rail; that is the only proof that counts.

## A workflow that passes on the first paste

- Write the chapter titles first, in the order you would explain the video, and leave the times for a second pass with the cut in front of you.
- Fill `0:00` with the intro's real title, not "Intro" — the first chapter sets the tone of the rail.
- Keep sections at half-minute steps or longer; the 30-second auto-time already nudges you that way.
- Add the video length before trusting the green ticks, then press Sort by time once as a final arithmetic check.
- Copy, paste at the end of the description with a blank line between it and the text above, save, and check the watch page.

When the timestamps are right but you also want to share a single moment, the [YouTube Timestamp Link](/youtube-timestamp-link/) builds a URL that opens directly at one of those seconds. And if the video itself is not cut yet, the [Video Trimmer](/video-trimmer/) makes the sections the chapter list describes.