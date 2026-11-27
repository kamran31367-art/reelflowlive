---
title: "Character limits on YouTube, TikTok, Instagram and X, counted once"
description: "Five limits are checked live as you type, emoji are counted as whole characters, and the test caption below shows 654 characters fitting two platforms while sitting 374 over on X."
date: 2026-11-27
categories:
  - Social
  - Writing
cover: assets/img/blog/platform-character-limits/hero.webp
coverAlt: "Someone in a dark jacket holding a phone and typing with both thumbs in a bright office"
coverCaption: "The place a caption finally gets tested is a phone, not the desktop editor it was written in."
takeaways:
  - "Five limits are checked at once: YouTube title 100, YouTube description 5,000, TikTok caption 2,200, Instagram caption 2,200 and X 280."
  - "A 654-character test caption left 4,346 characters of YouTube description room and 1,546 on both short-video platforms, while X showed 654 of 280 and 374 over."
  - "Counting uses whole characters: a family emoji built from seven code points counts as one character, and it was the difference between fitting and not."
  - "Hashtags are pulled from both fields and deduplicated case-insensitively, so a test string with seven tags and two spellings of Shorts reported seven hashtags and six unique."
  - "Each meter turns amber at ninety percent of its limit and red only once the text is over, which is the point to cut rather than after a platform does it."
faq:
  - q: "Does X still have a 280 character limit?"
    a: "For standard posts, yes. What X actually charges is not always the raw count: every link is treated as a fixed length through its t.co shortener, whatever the original URL, so a long link reads higher here than it will on the platform. The counter is honest about this in a note and counts the characters you typed."
  - q: "Why does an emoji count as one character?"
    a: "Because the counter measures grapheme clusters, the units a reader sees as a single glyph. A family emoji is built from several code points joined by zero-width joiners, seven in our test, yet it renders as one picture, so it counts once. Browsers with the standard text segmentation API do this natively; a very old browser falls back to counting code points, which would count that family emoji seven times."
  - q: "Do hashtags count toward the caption limit?"
    a: "Yes, they are ordinary characters in the caption, and the tool counts them like any other word. It also lists every hashtag it finds, deduplicated without regard to case, and the Copy hashtags button writes the unique list back out space separated. That is useful when a caption has been edited several times and the same tag has crept in twice."
  - q: "Why do TikTok and Instagram share the same 2,200 limit?"
    a: "Because both platforms landed on the same number for photo and video captions, at different times. The practical consequence is that one caption file can serve both without edits. It is not a promise that they will stay identical forever, which is why the limits here are shown per platform rather than merged into one shared meter."
  - q: "Is the text I paste counted on a server?"
    a: "No. The page is static and the counting runs in the browser as you type, with no request leaving the tab. That matters for unpublished captions, client names and anything else that should not exist on someone else's server before it is posted."
---

Every platform sets its own ceiling on titles and captions, and the ceilings are not close to each other. A caption written comfortably for TikTok can be hundreds of characters over on X, and a YouTube title that looks fine in the editor loses its ending long before the 100-character field complains. The [Character Counter](/character-counter/) puts five of those ceilings on one screen and counts the text once, live.

## The five limits, one screen

The tool checks a title and a caption against five published limits:

- **YouTube title:** 100 characters.
- **YouTube description:** 5,000 characters.
- **TikTok caption:** 2,200 characters.
- **Instagram caption:** 2,200 characters.
- **X post:** 280 characters.

The title field feeds only the first meter; the caption field feeds the other four. Each meter shows used and left, fills a bar in proportion, turns amber once the count reaches ninety percent of the limit, and turns red with an "over" figure the moment the text passes it. The bar itself stops at 100 percent, so an overrun is shown by the number and the colour, not by a runaway stripe.

<figure>
  <img src="/assets/img/blog/platform-character-limits/drafting.webp" alt="An overhead desk with an open notebook being written in, a coffee cup, glasses, a laptop and a tablet" width="1200" height="675" loading="lazy">
  <figcaption>The draft is usually written somewhere calmer, then pasted into a phone where the first line decides everything.</figcaption>
</figure>

## What counts as a character here

The counter measures grapheme clusters, the units a person sees as one glyph, rather than the bytes or the 16-bit code units underneath. Modern browsers ship the text segmentation API that makes this exact; the page uses it whenever it is available.

The difference is easy to measure. A family emoji, one mother, one father, a girl and a boy joined into a single picture, is seven code points and eleven UTF-16 units, and the counter reads it as **1**. A flag emoji built from two regional letter symbols reads as **1**. A thumbs up with a skin tone modifier reads as **1**. A platform that counts characters the way a reader counts them agrees with all three; a byte counter or a naive length check would not.

The same choice keeps accented letters sane. A letter typed with a combining accent is two code points and one visible character, and it counts once.

## A real caption, measured

Our test session used a title of 61 characters and a caption of 654, with line breaks, plain sentences and seven hashtags at the end. The five meters read:

- **YouTube title:** 61 of 100, 39 left.
- **YouTube description:** 654 of 5,000, 4,346 left.
- **TikTok caption:** 654 of 2,200, 1,546 left.
- **Instagram caption:** 654 of 2,200, 1,546 left.
- **X post:** 654 of 280, 374 over.

This is the pattern most creators will recognise. The same text is comfortable on three platforms and almost two and a half times the X allowance, which is why the usual advice is to keep a short version for X rather than paste the long one and trim it live in the composer.

<figure>
  <img src="/assets/img/blog/platform-character-limits/tool.webp" alt="The Character Counter with a 61 character title and a 654 character caption, five platform meters and six unique hashtag chips" width="1072" height="619" loading="lazy">
  <figcaption>The measured session: 61 of 100 on the title, 654 characters against four caption limits, X 374 over, and the hashtag list showing seven tags with six unique.</figcaption>
</figure>

## The hashtag ledger

Below the fields, every hashtag found in the title or caption appears as a chip, with a count such as "7 hashtags · 6 unique". A hashtag is recognised as a hash followed by letters, digits and underscores, including non-Latin scripts, so a tag in Arabic or Devanagari is picked up like any English one.

Duplicates are matched without regard to case: `#Shorts` and `#shorts` are one tag, which is why the test session had seven tags on screen but six chips. That is close to how the platforms treat them, and it catches the common case of copy-pasting a tag block that has drifted into two spellings. Copy hashtags writes the unique list back, space separated, ready to paste somewhere else.

## Spaces, line breaks and links

Three things surprise people once they start counting honestly.

**Spaces are characters.** The 654-character test caption included 109 of them, and there is no platform that ignores them. Removing double spaces after full stops is a real saving when the text is close to a limit, not a cosmetic one.

**Line breaks count as one each.** A blank line between paragraphs is two, so a caption broken into five blocks costs eight characters before a word is read. That is cheap for the readability it buys, but it is not free, and it is the first place to look when a plan for four short paragraphs suddenly sits over the X limit.

**A link is counted by its letters here, not by what X charges.** X replaces every URL with a fixed-length link behind the scenes, so a two-hundred-character tracking URL and a bare domain both cost the platform the same small number. This counter shows the raw text you pasted, which means a caption carrying a long UTM link can read over on the X meter while still publishing fine. Treat the X number as an upper bound whenever a link is in the text, and build the link with the [UTM Link Builder](/utm-link-builder/) if it needs to stay readable.

## The visible limit is shorter than the enforced limit

Passing the meter means the platform will accept the text. It does not mean anyone sees it. Three separate cuts happen after that point:

- **The YouTube title** survives about sixty characters in most search and suggested placements before it is truncated with an ellipsis; the remaining forty characters exist but rarely appear.
- **The short-video captions** collapse to the first line or two under a "more" control. The opening sentence is doing almost all the work.
- **Links on X** count as a fixed length through the platform's shortener, so a long URL costs less on X than this counter says, and a short one costs slightly more than its letters.

That is why the writing advice matters as much as the counting: the strongest sentence belongs first, and the rest is for people who chose to expand. The [Title & Caption Preview](/title-preview/) shows what those cuts look like on the feed before publishing.

## A working order for one post

1. Draft in the caption field with everything included, hashtags and all, and read the two 2,200 meters.
2. Keep the opening line self-contained, then check the X meter and write the short version from the hook rather than by deleting sentences.
3. Set the title under about sixty characters even though the meter allows a hundred.
4. Prune the hashtags to the unique chips that matter, and copy the cleaned list out.
5. Paste into the platforms, and treat the amber state as a note that the next sentence added is where cutting starts.

## What it deliberately does not do

- **It does not know every limit.** Comment limits, bio limits, profile names and ad copy have their own numbers on each platform; this page covers the five fields most videos actually use.
- **It does not shorten for you.** No automatic rewrite, no AI trim, no "make it fit" button. The number you see is the text you wrote.
- **It does not schedule or post.** It is a counter, not a publishing tool.
- **It does not phone home.** Counting runs in the tab, and a draft caption stays on the device until you choose to copy it somewhere.

For longer text work, the [Text Tools](/text-tools/) page handles case conversion, duplicate lines and other cleanups on the same text; for chapter lists that go into a YouTube description, the [YouTube Chapters Generator](/youtube-chapters/) builds the timestamps to paste in.