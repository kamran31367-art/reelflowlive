---
title: "Spin the Wheel: build a clear choice list and use it well"
description: "Learn how the Spin the Wheel tool handles choices, spins, duplicates, downloads and browser privacy, with a practical example and a pre-spin checklist."
date: 2026-11-27
categories:
  - Misc
cover: assets/img/blog/spin-the-wheel/hero.svg
coverAlt: "A colourful wheel divided into labelled choices with a winner panel beside it"
coverCaption: "A wheel makes a choice visible, but a clean list and agreed rules make the result useful."
takeaways:
  - "The default list contains Option A through Option F, one choice per line, and the wheel is built automatically."
  - "Blank lines are ignored and surrounding spaces are trimmed, but duplicate choices remain separate entries."
  - "Each displayed entry has an equal chance on a spin; repeated spins are independent and do not remove previous winners."
  - "Labels longer than 18 characters are shortened on the canvas, while the complete label remains in the result and text file."
  - "Copy is disabled. Download saves the choice list before a spin and still saves that list after a winner is shown."
faq:
  - q: "How many choices can I add?"
    a: "There is no fixed entry-count limit in the tool configuration. Every non-empty line becomes an entry, but a very long list creates a crowded wheel. Keep the list short enough for labels to remain readable."
  - q: "Does the wheel remove a winner after each spin?"
    a: "No. Every entry stays on the wheel and remains eligible on the next spin. For a draw without replacement, remove the winner from the list, generate the wheel again and spin the remaining choices."
  - q: "Can two lines have the same label?"
    a: "Yes. Duplicate lines are kept as separate entries, giving that label more than one segment. Remove duplicates first if each label should have exactly one chance."
  - q: "Can I copy the winner or download the result?"
    a: "The winner is visible on screen, but the Copy button is disabled for this tool. Download produces a plain-text choice list, not a separate winner-only file; record the displayed result yourself if needed."
draft: false
---

Some decisions need a visible, neutral tie-breaker rather than another meeting. The [Spin the Wheel](/spin-the-wheel/) tool turns a line-by-line list into a colourful wheel and selects one displayed entry when it stops. It works well for low-stakes choices, exercises and activities where everyone can see the same options. The important part is preparing the list before the first spin.

## What the wheel does

Enter the possible choices, build the wheel, then use the **Spin** button inside the wheel panel. The animation runs for about 3.2 seconds, makes six full rotations and finishes with a **Winner:** line. The result is selected from the entries currently on that wheel.

This is a random picker, not a ranking system. It cannot judge difficulty, fairness over time or which option is best. Agree that the displayed winner will be accepted before spinning; otherwise the tool becomes a way to reroll an inconvenient answer rather than resolve a choice.

## Controls and defaults

The single input is **Wheel choices**, a seven-row text area. Its default contents are `Option A`, `Option B`, `Option C`, `Option D`, `Option E` and `Option F`, each on its own line. Replace those placeholders with the real choices before using the wheel in a group.

The main button is labelled **Spin the wheel**, but its first job is to build or rebuild the wheel from the text area. The separate **Spin** button in the output starts the animation. Because automatic processing is enabled, edits also rebuild the wheel after a short pause. That rebuild resets the displayed result to **Ready**.

**Reset** restores the six default options and returns the output to its initial state. The tool has no weighting, removal, history or saved-wheel controls.

## Worked example: choosing a warm-up activity

Imagine a workshop team cannot agree on a ten-minute warm-up. Replace the defaults with four lines:

```text
Two truths and a lie
Quick sketch
One-minute demo
Stretch break
```

Generate the wheel and check that all four labels appear once. The canvas divides the circle into four equal segments. Each segment has the same chance of being selected, so each activity has a one-in-four chance on an individual spin.

If the animation stops on **Quick sketch**, the output reads `Winner: Quick sketch`. That is an illustrative outcome, not a promised result; another run may select any of the four activities. The group can now run the chosen activity without negotiating the answer again.

<figure>
  <img src="/assets/img/blog/spin-the-wheel/example.svg" alt="Four workshop activity choices on a wheel with Quick sketch shown as the illustrative winner" width="1200" height="675" loading="lazy">
  <figcaption>A four-choice warm-up wheel gives each activity one equal segment; Quick sketch is one possible result, not a fixed outcome.</figcaption>
</figure>

## Reading the output and formats

The output pane shows the wheel, a **Spin** button and a result area. Before spinning, the result says **Ready**. During animation the spin button is disabled. Afterward, the selected label appears after **Winner:** and the status area repeats it.

**Download** creates `spin-the-wheel.txt`, a plain-text file with the current choices separated by newlines. The file is a copy of the list, not an image of the wheel and not a log of spins. After a winner appears, the existing download still contains the choices because the spin updates the visible result rather than replacing that file.

**Copy** is disabled in this tool's configuration. If you need a text record, download the list or manually note the displayed winner in the document where the decision is being tracked.

## Limits and edge cases

The parser removes carriage returns, trims each line and discards empty lines. A list containing only blank lines produces the error `Add at least one wheel choice.` It does not impose a fixed maximum number of entries, but readability deteriorates as segments become narrow.

Duplicates are not consolidated. If `Yes` appears three times, it occupies three segments and has three times the selection weight of a label that appears once. Inconsistent spelling and capitalisation can also create accidental duplicates that look like one idea.

Canvas labels are limited to 18 characters; longer text is shortened with an ellipsis. The full label still appears in the winner line and downloaded list. Use concise names such as `Team A` or `Sketch` rather than relying on a long sentence to fit on the wheel.

## Common mistakes to avoid

Do not spin before replacing the placeholder options. Do not assume a fair-looking wheel corrects a biased list: duplicated or missing entries change the odds before randomness is involved. Review the visible segments and the text list together.

Do not interpret a streak as evidence that the wheel is broken. Independent spins can produce the same winner repeatedly, and short runs do not guarantee that every option appears. Equally, do not keep spinning until a preferred answer appears if you promised to accept the first result.

Finally, do not use a browser random picker for lotteries, cryptographic draws or any process that requires an auditable random source. It uses the browser's `Math.random`, with no published seed, draw history or verification record.

## Browser use and privacy

The wheel is drawn on a canvas and the selection happens in the current tab. The choice text is not uploaded to a server for processing, and this operation has no save feature or local-storage history. Reloading the page or resetting it loses the current session's list and result.

That local processing does not make the wheel suitable for confidential lists. Anyone who can see the screen can read the entries and the winner, and a downloaded text file contains every choice. Use participant initials only when appropriate, and avoid putting private client or account information on a shared display.

## A practical group workflow

Start by writing the decision as a neutral question and defining what the winner means. Collect the choices, remove duplicates and shorten labels. Read the final list aloud so everyone can object before the wheel exists.

Generate the wheel, confirm the entries, state that the first spin counts and then spin once. Record the result immediately. If you need several different winners, remove the selected line, rebuild and repeat using the remaining list. This manual removal is essential because the tool does not track previous winners for you.

<figure>
  <img src="/assets/img/blog/spin-the-wheel/workflow.svg" alt="Choice-list workflow from deduplication to wheel generation, one accepted spin and result recording" width="1200" height="675" loading="lazy">
  <figcaption>The group agrees on the list and first-spin rule before the animation begins, then records the displayed winner.</figcaption>
</figure>

## Checklist before you spin

- Replace all six placeholder options.
- Put one choice on each non-empty line.
- Trim spaces and remove unintended duplicates.
- Keep labels short and distinguishable.
- Agree that the first result counts.
- Avoid rerolling to reach a preferred answer.
- Record the winner if it affects a task or schedule.
