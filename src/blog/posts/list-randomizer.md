---
title: "List Randomizer: Pick or Shuffle Without Losing Track of the Rules"
description: "Use the List Randomizer to pick items or shuffle every line, with clear guidance on counts, duplicate prevention, blank lines and browser-only processing."
date: 2026-11-27
categories:
  - Text
  - Workflow
cover: assets/img/blog/list-randomizer/hero.svg
coverAlt: "A list of fruit names being rearranged into a short random selection and a full shuffled order"
coverCaption: "Picking a few entries and shuffling the whole list are different operations."
takeaways:
  - "Each non-empty line becomes one list entry after surrounding spaces are trimmed."
  - "Pick items returns the requested number of entries, while Shuffle all returns every entry."
  - "No duplicates prevents selecting the same list entry twice; it does not merge identical text."
  - "A unique pick is capped at the number of entries, even when the requested count is higher."
  - "Results are plain text with no seed, weighting, exclusions or saved draw history."
faq:
  - q: "What happens when Items to pick is larger than my list?"
    a: "With No duplicates selected, the tool returns the whole shuffled list and stops at the available number of entries. With No duplicates cleared, it can repeat entries until it reaches the requested count."
  - q: "Does No duplicates remove repeated names from my input?"
    a: "No. It prevents one list position from being selected more than once. If the same text appears on two input lines, both lines remain eligible and can both appear in a unique pick."
  - q: "Does Items to pick affect Shuffle all?"
    a: "No. Shuffle all ignores the count and returns every non-empty input line in a random order. The No duplicates setting is also irrelevant in that mode because each input line is used once."
  - q: "Can I reproduce a previous random result?"
    a: "No. The tool does not expose a seed or draw history. Copy or download the result if you need to keep the exact order that was produced."
draft: false
---

A list is easy to read and surprisingly easy to rearrange badly. The [List Randomizer](/list-randomizer/) handles two common jobs: selecting a few entries from a list and shuffling the complete list into a new order. Both happen in the browser and return plain text.

The important distinction is not visual. Pick items changes how many entries you receive; Shuffle all changes their order. Choosing the wrong mode is the fastest way to get a result that looks random but does not answer the question you asked.

## What gets treated as an item

Paste one item per line in List items. The tool removes carriage returns, trims spaces from both ends of every line and discards empty lines. That makes ordinary copy-and-paste from a spreadsheet, document or chat usable without manually cleaning each row.

There is no comma, semicolon or tab parser in this operation. If you paste `Apple, Banana, Cherry` on one line, it is one entry, not three. Split the values onto separate lines first when your source uses another delimiter.

Repeated lines are preserved as separate entries. This matters when the same name or label legitimately appears more than once, and it also matters when a messy import has created accidental copies. The randomizer does not clean the list for you.

## Pick items versus Shuffle all

The Mode menu has two options:

- **Pick items** uses Items to pick to decide how many entries to return. This is the default mode.
- **Shuffle all** returns every non-empty entry once, in a random order. It ignores Items to pick and the No duplicates checkbox.

Use Pick items for a shortlist, a small set of discussion prompts or a selection from a longer pool. Use Shuffle all when the complete list must remain intact but its order should change, such as a presentation running order or a set of cards.

Shuffle all preserves repeated input lines because each line is an entry. It does not deduplicate values, assign numbers or split the output into separate files.

## What No duplicates really means

No duplicates is selected by default. In Pick items mode, the tool first shuffles the entries and then takes the requested number. Since each shuffled position is used at most once, one list entry cannot be selected twice in that result.

The setting does not compare the text inside entries. If your list contains `Apple` twice, those are two different positions and both can be selected while No duplicates is still on. To guarantee unique values, remove repeated lines before running the tool.

Clearing No duplicates switches to independent picks with replacement. The same entry can appear several times, and the requested count may be larger than the list. This is useful for weighted-by-frequency pools or repeated game turns, but it is usually the wrong choice for selecting distinct people or tasks.

## Worked example: three from five

Paste this list:

```text
Apple
Banana
Cherry
Date
Elderberry
```

Keep Mode set to Pick items, set Items to pick to `3`, and leave No duplicates selected. One possible result is:

```text
Date
Apple
Cherry
```

The result contains three non-empty lines and no list entry has been reused. Another run may produce a different order or a different subset.

Now raise Items to pick to `8` without changing the list or the checkbox. The unique operation can return only five entries, so the output stops at the full list length. It does not invent extra values and it does not report an error. If you clear No duplicates and request eight, repeated entries become possible.

<figure>
  <img src="/assets/img/blog/list-randomizer/example.svg" alt="Five fruit entries with Pick items mode, a count of three and No duplicates selected" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: a five-entry pool produces a three-entry unique pick; the exact subset changes each run.</figcaption>
</figure>

## Reading, copying and downloading the result

Both modes return plain text with one entry per line. There are no bullets, rankings, timestamps or selection numbers added automatically. Copy is useful when the result belongs in a document or message. Download saves it as a `.txt` file named after the tool.

The output replaces the previous result when you run the tool again. The page does not keep a panel of earlier draws, so label or save a result immediately if it matters. Reset restores the default five-fruit list, a count of three, No duplicates selected and Pick items mode.

For a presentation order, you may want to add numbers after downloading or copying. That numbering is a separate editing step, not part of the randomizer.

## Limits and common mistakes

The tool has no weights, exclusions, brackets, seeded randomness or audit log. Every eligible entry has the same chance within the chosen operation. You cannot say that one task is twice as likely as another or that two people must never be selected together.

Do not use the output as a security-sensitive draw or a verifiable record. The underlying browser random function is general-purpose randomness, and the page provides no tamper-evident history. For a high-stakes selection, use a process designed for that purpose and keep its records.

A second common mistake is assuming a shorter result means entries were lost. Check the mode and count first. In Shuffle all, every non-empty line should appear once. In a unique pick, a result shorter than Items to pick usually means the requested count exceeded the available entries.

## Browser privacy and session state

Your list is read from the text area and processed by JavaScript in the open page. This operation does not upload the list, send it to a service or write it to browser storage. Clipboard access and file creation happen only after you choose Copy or Download.

The working list and result live in memory. Refreshing or closing the page clears that session, so keep the source list elsewhere until the accepted result has been pasted back and checked. If the list contains personal information, remember that a downloaded text file is now a separate copy under your control.

## A workflow for a clean selection

A short preparation pass prevents most confusing results:

1. Put one value on each line and remove blank rows.
2. Decide whether you need a subset or a complete reorder.
3. Remove repeated values manually if the final selection must be unique by text.
4. Choose the count and duplicate setting that match the mode.
5. Run the tool, read the result and save it before another draw.
6. Apply any numbering, labels or exclusions in the document where the result will be used.

<figure>
  <img src="/assets/img/blog/list-randomizer/workflow.svg" alt="Workflow showing list cleanup, mode selection, random draw, review and saved text output" width="1200" height="675" loading="lazy">
  <figcaption>A reliable selection starts with one item per line and ends with the accepted order saved outside the page.</figcaption>
</figure>

For recurring activities, maintain the canonical list in a document or spreadsheet. Treat the randomizer as the draw step, not as the system of record.

## Checklist before you accept the result

- Confirm that each intended item is on its own line.
- Choose Pick items or Shuffle all deliberately.
- Check whether repeated input lines are intentional.
- Use No duplicates only when reusing an entry is forbidden.
- Compare the output length with the mode and available entries.
- Save the accepted result before running another draw.

The tool is fast because its rules are simple. Respecting those rules makes the random result useful rather than merely surprising.
