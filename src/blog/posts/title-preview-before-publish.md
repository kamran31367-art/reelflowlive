---
title: "Title and caption previews, measured: where 100 characters actually end"
description: "A 97-character title showed two of its four lines in the search card, the first cut landed at 66 characters, and an Instagram caption stayed at two lines until the more link. A measured walk through the Title Preview tool."
date: 2026-11-27
categories:
  - YouTube
  - Social
cover: assets/img/blog/title-preview-before-publish/hero.webp
coverAlt: "A person in an ochre knit sweater typing a title on a laptop at a wooden desk near a window"
coverCaption: "A title is written once and read in cards of several widths, and the card is where the length stops being a number and becomes a visible cut."
takeaways:
  - "In the search mock the title column was 253 pixels wide at 15.5-pixel text, and the first clip of a sample sentence came at 67 characters: 66 fitted in two lines, one more pushed a third line out of view."
  - "A 97-character title, three under YouTube's limit, filled four lines in the mock and showed two, so the counter said nothing was wrong while half the words were hidden."
  - "Going past 100 characters changed only the counter, which read 111 (over the 100 limit), and the card looked identical to the 97-character version."
  - "The Instagram card held 202 and 400 characters to the same two lines, revealed the more link only when text was really hidden, and expanded to the full caption on a click."
  - "The Narrow phone width switch shrank the mock to 300 pixels and the title column to 90, but the thumbnail stayed 168 wide at desktop sizes, so the rearrangement is only fully shown on a real phone viewport."
faq:
  - q: "Is this the real YouTube layout?"
    a: "No, it is an approximation built for judging length. The mock uses a 168-pixel thumbnail and a 253-pixel title column, while the real search card changes with the window, the device and the language. Use it to find where a title stops being readable, then confirm the final text on the platform itself."
  - q: "Does the 100-character counter block longer titles?"
    a: "No. Past 100 characters the number turns red and gains the words over the 100 limit, but the preview keeps rendering and nothing is disabled. In the test a 131-character title produced the same card as a 111-character one because the third line was already out of view."
  - q: "Why does the more link appear on some captions and not others?"
    a: "The page measures a hidden copy of the full caption against the clamped two-line box. When the copy is taller, the more link appears; when the text fits, the link and its note stay hidden. A 202-character caption showed the link; a one-line caption never did."
  - q: "Is anything uploaded when I pick a thumbnail?"
    a: "No. The file is turned into a local object URL and drawn inside the mock card, and the page never sends it anywhere. Removing the image revokes that URL and brings back the plain 16:9 placeholder."
  - q: "Can I preview a title for another platform?"
    a: "Only the two cards on the page: a YouTube search result and an Instagram post. The counters follow YouTube's 100 and Instagram's 2200 character limits, and other platforms are out of scope."
---

A title is a sentence written in an editor and read inside a card. The editor gives it a character counter; the card gives it two lines and a cut. Those two facts disagree more often than people expect, and the [Title Preview tool](/title-preview/) exists to put them side by side. This post walks through a measured session so the numbers behind the mock are visible.

## What the page previews, and what it leaves out

The left pane takes a title, a channel name, an optional thumbnail and an Instagram caption. The right pane renders them in two cards: a YouTube search result and an Instagram post. Everything updates as you type, with a short debounce, and nothing leaves the device.

The mock is deliberately simple. The search card uses a fixed 168-pixel thumbnail and a title column that measured 253 pixels at a 433-pixel card width. Real search cards resize with the window and the device, so treat the mock as a ruler for length, not a photograph of the platform.

## The search card is 433 pixels wide

At that width the title is set at 15.5 pixels with a line height of 20.15, clamped to two lines, which is a 40-pixel box. Long text does not overflow the card; it is cut, exactly like the real thing, and there is no ellipsis in the title itself in this mock, just the sharp end of the second line.

The default meta line reads "Your channel · 1.2K views · 3 days ago". Typing a channel name replaces "Your channel" in both cards, so the same name appears under the search result and beside the Instagram avatar. The two mock channels switch the views text: Small channel gives 1.2K views and 3 days ago, Large channel gives 480K views and 2 weeks ago.

<figure>
  <img src="/assets/img/blog/title-preview-before-publish/tool.webp" alt="The Title Preview tool with a 97 character title, the Kitchen Cuts channel, an uploaded thumbnail and a 202 character Instagram caption showing the more link" width="1072" height="683" loading="lazy">
  <figcaption>The measured session: a 97-character title, a photo thumbnail, and an Instagram caption whose third line is already behind the more link.</figcaption>
</figure>

## A 97-character title showed two of its four lines

The test title read: "How I cut a one minute Short in ten minutes without losing the hook, the ending or the good takes". It is 97 characters, so the counter showed a clean 97 with no warning. In the card, however, the text measured 81 pixels of content inside a 40-pixel clamp: four lines written, two shown.

The boundary is worth knowing by heart. With a plain sample sentence, 66 characters fitted inside the two lines and 67 pushed a third line out of view. That number is specific to the wording, since narrow letters fit more, but the scale is the point: in this column, a title stops being fully visible somewhere in the high sixties.

## The 100-character limit is not the limit that matters

YouTube allows up to 100 characters, and the counter enforces that rule visibly. At 111 characters it read "111 (over the 100 limit)" in red, and at 131 it read the same with the larger number. The card did not change between the two, because the cut had happened long before either count.

That is the honest gap the page exposes. The platform limit is a ceiling for the field; the card is a ceiling for the reader. A title designed against the first number alone can be two lines of useful words with two more lines nobody sees. The practical target for this mock is nearer 60 to 70 characters, with the rest treated as a bonus for wider cards.

The flip side also matters: a short title is not automatically a good one. The card shows length, not clarity, and a 45-character title that says nothing is still a weak result.

## Instagram shows two lines, then decides about "more"

The caption box takes up to 2200 characters and counts them without a warning until the limit; at 2210 the counter gained the words "over the 2200 limit". The card itself is clamped to two lines at 13-pixel text, a 40-pixel box, and whether the "… more" link appears is decided by measurement rather than by length.

The page builds an invisible copy of the full caption at the card's own width and compares heights. A 202-character caption produced a 40-pixel box against a taller hidden copy, so the link appeared. A 400-character caption showed the same two lines from a 121-pixel copy, six lines in total. A one-line caption showed no link and no explanatory note, because nothing was hidden.

<figure>
  <img src="/assets/img/blog/title-preview-before-publish/phone-social.webp" alt="A hand holding a phone in front of tall city buildings, an Instagram profile page open on the screen" width="1200" height="675" loading="lazy">
  <figcaption>The caption is written on a desk and read on a phone in one hand, where two lines is roughly what fits before the feed gets busy.</figcaption>
</figure>

Clicking the more line expands the card to the full caption and changes the label to Show less; clicking again clamps it back. The state resets when the caption is edited, which is correct: a new draft should start collapsed.

The practical reading is the same as the title. The first two lines are the whole caption for most viewers, so the hook has to sit inside roughly 90 to 100 characters at this width. Hashtags and links belong further down, where the more link is already a choice the reader made.

## Two mock channels, one switch

The Small and Large channel buttons only change the views text in the meta line. They do not change placement, ranking or the card layout, and the page says as much by labelling them as the meta line only.

The Narrow phone width switch caps the preview column at 300 pixels. The card then measured 270 pixels wide, and because the thumbnail kept its 168-pixel width at desktop sizes, the title column collapsed to 90 pixels while the text clamp stayed at two lines. The note under the card says the card rearranges to a small thumbnail, which is what happens on a real phone viewport, where the stylesheet drops the thumbnail to 128 pixels. On a desktop window the switch shows the narrow text consequences without the thumbnail change, and that difference is worth knowing before trusting the switch alone.

At 90 pixels the cut came at about 30 characters of the sample sentence, so the same 97-character title showed barely a third of itself. This is the closest the page gets to the phone experience, and the most useful setting for a Shorts title.

## Failures and limits

Choosing a non-image file produces the toast "Please choose an image file." and clears the file input. Removing the image puts the plain placeholder back and revokes the local URL.

The quieter limits: only two surfaces are mocked, the cards cannot be resized freely, the counters do not stop typing past the limits, and there is no mobile thumbnail swap on the narrow switch as described above. The Instagram avatar is a colour circle rather than a chosen image, and the views numbers are fixed rather than estimates. All of that keeps the page a length ruler, which is what it is for.

## A working order

1. Type the title as it would be published, then read the counter and the card separately.
2. Rewrite until the meaning survives inside the first two lines at the default width.
3. Switch on Narrow phone width and check what remains; a Shorts title should still work there.
4. Paste the caption and confirm the hook sits before the more link, not after it.
5. Add the real thumbnail so the text is judged against the picture, then take the pair to the [Thumbnail Safe Zone](/thumbnail-safe-zone/) before uploading.

For the pieces around this job, the [Character Counter](/character-counter/) checks platform limits without a layout, the [Text Tools](/text-tools/) tidy a pasted draft, and the [YouTube Chapters](/youtube-chapters/) page covers the other line of text that viewers read before they click.