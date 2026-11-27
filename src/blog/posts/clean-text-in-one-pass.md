---
title: "Five text clean-ups that save an editing pass"
description: "Case conversion, line-break removal, duplicate lines, URL slugs and placeholder text - the small fixes that otherwise get done by hand, one at a time."
date: 2026-11-27
categories:
  - Writing
  - Workflow
cover: assets/img/blog/text-tools/hero.webp
coverAlt: "An old typewriter on a dark wooden desk"
coverCaption: "Most text editing is not writing. It is reshaping text that was already written."
takeaways:
  - "Each tab keeps its own text, so switching between the five tools loses nothing."
  - "Title case capitalises every word, including short ones - check small words and acronyms by eye."
  - "Duplicate removal keeps the first occurrence of every line and can ignore case."
  - "Slugs fold accents and turn every other symbol into a hyphen; only Latin letters survive."
  - "Nothing is uploaded or stored, and closing the tab clears it."
faq:
  - q: "Does the tool upload or store my text?"
    a: "No. Every conversion runs in the page, nothing is sent anywhere, and closing the tab clears the text. Refreshing the page also clears it, so copy the result back into your document before you navigate away."
  - q: "Why did title case change my acronyms?"
    a: "The converter capitalises the first letter and lowercases the rest of every word, which turns API into Api and iPhone into Iphone. That rule is right for ordinary headings and wrong for product names. After converting, scan for acronyms and brand names and fix those few words by hand."
  - q: "Does duplicate removal keep the first or the last copy?"
    a: "The first occurrence of every line is kept and later copies are dropped, so the original order survives with the gaps closed. Matching ignores case by default, and the case-sensitive checkbox treats USB and usb as different lines."
  - q: "Why does my slug come out empty or with broken words?"
    a: "The slug is built from Latin letters and digits only. Accented letters are folded to their closest Latin form, but text in other scripts has no mapping and collapses into hyphens, leaving nothing usable. For posts in other scripts, write a transliterated slug by hand."
---

Most text editing is not writing. It is fixing the shape of text that was already written: pasting a list and getting doubled lines, turning a title into a URL, cleaning capitals after a copy from a PDF. Five small tools cover those chores, and on a [Text Tools page](/text-tools/) they share one input box and one output box.

This guide covers what each tab actually does, the traps in each, and the cases where a by-hand edit is still the honest choice.

## Five tabs, one page

The tabs are Case, Lines, Duplicates, Slug and Lorem. Each one keeps its own text, so you can switch back and forth without losing what you pasted - a small thing that matters when the same paragraph needs a slug and a title-case heading.

<figure>
  <img src="/assets/img/blog/text-tools/paper.webp" alt="A typewriter holding a blank sheet of paper against a white background" width="1200" height="800" loading="lazy">
  <figcaption>The chores are mechanical. Nothing here needs judgement until the result is pasted back.</figcaption>
</figure>

## Case conversion, and the small-word caveat

Copied text arrives in whatever case the source used. A headline needs title case, a shouting comment needs lower case, and a description often reads best in sentence case. The Case tab converts a whole block at once and shows a live character and word count above the buttons.

The four modes behave differently, and the difference matters:

- **UPPER CASE** is simple and rarely wrong, unless the source contains accented lowercase letters that have no uppercase form in the font used.
- **lower case** is the fastest way to defuse accidental caps-lock text.
- **Title Case** capitalises the first letter of every word and lowercases the rest. That is correct for headings and labels, but it also produces Of, The and And in the middle of a title, and it mangles acronyms: API becomes Api, iPhone becomes Iphone.
- **Sentence case** lowercases everything and then capitalises the first letter after each full stop, question mark or exclamation mark.

The practical rule: convert first, then read. For a heading, expect to fix two or three words by hand. That is still far faster than retyping.

## Joining lines from a PDF

Text copied from a PDF or a narrow column arrives with a hard break every few words, because the source text had a line break wherever the page ended. Joined back into a paragraph, it becomes normal text again.

Paste the block, keep "Trim spaces around each line" checked, and press Remove line breaks. Breaks become single spaces, doubled spaces collapse, and the result reports its word count so you can tell at a glance that all three paragraphs arrived. With the trim unchecked, leading indentation survives and the joined paragraph inherits odd gaps.

The tool joins; it does not split. Turning one long line into separate lines is a different job, and pasting into a spreadsheet column does it faster than any text converter would.

## Duplicate lines, order preserved

Mailing lists, keyword exports, merged spreadsheets and log dumps collect repeated lines. The Duplicates tab removes them while keeping the original order: the first occurrence of every line survives, later copies disappear, and the page reports how many were removed.

Matching ignores case by default, which is usually what you want when one export says `USB-C HUB` and another says `usb-c hub`. Tick the case-sensitive box when the same words with different capitalisation are genuinely different entries, as in product codes.

Two honest notes. First, the comparison is exact apart from case, so `apple` and `apple ` with a trailing space are different lines and both survive. Second, an empty line counts as a line; if the paste has double spacing, every blank line after the first is removed, which tightens the list rather than breaking it.

<figure>
  <img src="/assets/img/blog/text-tools/tool.webp" alt="The Text Tools page on the Duplicates tab with three duplicate lines removed from an eight-line list" width="1120" height="458" loading="lazy">
  <figcaption>A real run: eight pasted lines in, five unique lines out, with the case-insensitive match folding USB-C HUB into usb-c hub.</figcaption>
</figure>

## Slugs: accents folded, symbols hyphenated

A clean slug - lowercase words separated by hyphens - is easier to share and to read in a search result. The Slug tab converts as you type: "Crème Brûlée Recipe!" becomes `creme-brulee-recipe`.

The conversion is more careful than a plain lowercase-and-replace. Accented letters are decomposed into their base letter first, so é becomes e and ü becomes u. A handful of letters that do not decompose are mapped by hand: ß to ss, æ to ae, œ to oe, ø to o, đ to d, ł to l. Every other symbol and run of symbols becomes one hyphen, and leading or trailing hyphens are trimmed.

Two limits follow from that. Text in scripts other than Latin has no mapping to letters, so a Cyrillic or Arabic title collapses into hyphens and leaves an empty slug - write a transliterated slug by hand for those. And a slug is worth keeping short and stable: changing one after publishing breaks incoming links and throws away whatever the old URL earned. For length, check the finished title against the [character counter](/character-counter/) before choosing where the slug should stop.

## Lorem in whole paragraphs

Design mockups need realistic-looking text of the right length. Lorem ipsum keeps reviewers focused on layout instead of reading the copy, and the paragraph selector - one to five paragraphs - is faster than hunting for a sample block online.

Generate the paragraph count the layout needs, paste it, and replace it later with real copy. The generated text is plain Latin filler with no meaning, which is the point: nothing in it can be mistaken for a content decision.

## A routine for a pasted block

When a whole document arrives as one messy paste, the order of operations saves time:

1. Join the lines first, so paragraph structure is readable again.
2. Remove duplicate lines while the list is still raw.
3. Convert the case of headings and labels last, because joining and de-duplicating can merge two differently-cased copies of a line.
4. Build the slug from the final title, never from a draft.

Doing the slug first is the most common waste: the title changes twice afterwards and the slug has to be rebuilt each time.

## Where this saves a real hour

Video titles are a good example. A YouTube title should read in title case on the channel and in sentence case in a description or a blog embed, and the same line feeds a slug for the article version. Three copies of one sentence, each in a different shape, is exactly the kind of chore that turns into ten minutes of retyping and a typo.

The same pattern repeats on any publishing day: pasted keyword lists that need de-duplicating before they go into a tracker, contact lists merged from two exports, captions copied out of a PDF that arrive broken every eight words. None of it is writing. All of it is the shape of text, and shape is mechanical.

## What the page does not do

There is no find-and-replace with regular expressions, no diffing between two versions, and no file upload. The scope is deliberately narrow: make the text the right shape, then take it back to the editor. For anything that needs pattern matching, a code editor with regex support is the right tool, not a browser converter.

The rest is discipline. These tools work on the text in the page, nothing is stored, and closing the tab clears it. Keep the original document until the cleaned version is pasted back and checked, and treat every converter as a fast first draft - the last read is still yours.