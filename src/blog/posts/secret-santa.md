---
title: "Secret Santa Generator: fair assignments without the paper draw"
description: "Build a Secret Santa gift cycle from a participant list, block pairs who should not be matched, then copy or download the assignments as plain text."
date: 2026-11-27
categories:
  - Misc
cover: assets/img/blog/secret-santa/hero.svg
coverAlt: "Wrapped gifts and handwritten name cards arranged around a table for a Secret Santa exchange"
coverCaption: "A clear assignment list keeps the surprise while removing the folded-paper admin."
takeaways:
  - "Enter one participant per line; blank lines are ignored and repeated names are removed."
  - "Add exclusions as two exact names separated by a comma, one pair per line."
  - "Assignments form one continuous cycle, so everyone gives once and receives once without giving to themselves."
  - "The generator retries up to 2,000 times before reporting that the exclusions cannot be satisfied."
  - "Copy or download the result as text, then share each person's line privately rather than publishing the full list."
faq:
  - q: "Can someone be assigned to themselves?"
    a: "No. The generator builds a cycle in which each participant gives to the next person and receives from the previous one. It checks every assignment for self-matching before accepting the result."
  - q: "How do exclusions work?"
    a: "Put two participant names on a line, separated by a comma. Pair order does not matter, but spelling, capitalisation and extra words must match the participant list because names are matched exactly after surrounding spaces are trimmed."
  - q: "Why does it say no valid assignment satisfies all exclusions?"
    a: "The tool tried 2,000 random cycles and could not avoid every excluded pair. This can happen when too many pairings are blocked. Remove a restriction, confirm that the names match, or use a different matching method for an unusual group."
  - q: "Does the tool message the participants for me?"
    a: "No. It creates the assignment list locally in your browser. You decide how to share it, and you should send each participant only their own recipient rather than exposing the complete cycle."
---

Secret Santa is simple until the group has couples, housemates or a previous-year repeat that everyone wants to avoid. The [Secret Santa Generator](/secret-santa/) turns a participant list into a complete gift-giving cycle and checks excluded pairs before it returns a result. There is no folded paper, manual shuffle or sign-up screen.

Use it to prepare the matching, not to deliver the reveals. The output is a reusable text list, which makes private messages, printed cards or a host-managed announcement straightforward.

<figure>
  <img src="/assets/img/blog/secret-santa/workflow.svg" alt="Three step Secret Santa workflow showing participant names, excluded pairs and a completed gift cycle" width="1200" height="675" loading="lazy">
  <figcaption>Prepare the names, define pairs to avoid, then distribute one private assignment line to each participant.</figcaption>
</figure>

## What the generator is designed to do

The tool creates one Secret Santa cycle for a group. Every participant appears once as a giver and once as a recipient. Nobody gives to themselves, and any listed exclusion is treated as a forbidden pairing in either direction.

That structure is useful for office exchanges, family gatherings and online communities where a host already has the participant list. It solves the matching problem, but it does not set a spending limit, collect addresses, send invitations or reveal assignments automatically.

The minimum group size is two distinct names. Repeated lines are removed before matching, so entering the same person twice does not create two entries.

## Controls and input format

The page has two text areas and a **Generate assignments** button:

- **Participants:** one name per line. The tool trims surrounding spaces, ignores empty lines and removes exact duplicates.
- **Excluded pairs:** one pair per line, written as `Name A, Name B`.

Names are case-sensitive identifiers. `Sam` and `sam` are treated as different entries, while `Sam` and `Sam ` become the same after trimming. A pair is ignored unless its line contains exactly two non-empty comma-separated values.

An exclusion must refer to names that exist in the participant list to have an effect. A misspelled name does not create a useful restriction. Names containing commas are also a poor fit for this simple pair format.

Use **Reset** to restore the sample inputs and clear the result. Generation is manual; changing a text area does not immediately reshuffle the group.

## Worked example: six people and two exclusions

Start with these participants:

```text
Ayesha
Bilal
Chen
Daniyal
Emma
Farah
```

Add two restrictions:

```text
Ayesha, Bilal
Chen, Daniyal
```

Press **Generate assignments**. One possible valid result is:

```text
Ayesha → Chen
Chen → Farah
Farah → Bilal
Bilal → Emma
Emma → Daniyal
Daniyal → Ayesha
```

Ayesha does not have Bilal, and Chen does not have Daniyal. Following the arrows gives one closed loop through all six people. Your result will probably be a different loop because every run shuffles the names again.

<figure>
  <img src="/assets/img/blog/secret-santa/example.svg" alt="Example Secret Santa result connecting six participants in a cycle while two excluded pairs are absent" width="1200" height="675" loading="lazy">
  <figcaption>One possible six-person result: each arrow is a gift, and the final arrow closes the cycle back to the first giver.</figcaption>
</figure>

## Reading, copying and downloading the result

Assignments appear as plain lines in the result pane. The arrow means “gives a gift to,” so keep that direction clear when you copy a line into a message.

**Copy** places the complete list on your clipboard. **Download** saves a UTF-8 text file named `secret-santa.txt`. There is no PDF, spreadsheet, email or participant-specific link export.

Before sharing, split the list mentally or in your messaging app. A recipient only needs their own line. A host may keep the full file as a backup, but sending it to the whole group removes the surprise and exposes everyone's recipient.

## Randomness, limits and edge cases

The generator makes up to 2,000 attempts. On each attempt it shuffles the participant list and assigns each person to the next name, wrapping the final person back to the first. It accepts the first cycle that avoids self-matches and every exclusion.

This is a single-cycle generator, not a general derangement tool. It will not split a large group into several independent circles. If your event needs that structure, run smaller participant lists separately and check that no names overlap.

Heavy exclusions can make a cycle impossible or unlikely within the retry budget. Three people with two or more pairings blocked are a common example. The error does not prove that every mathematically possible matching is impossible; it means the random search did not find a valid cycle in 2,000 tries.

Duplicate removal is exact and case-sensitive. Standardise names before generating, especially when a list mixes nicknames, initials or inconsistent capitalisation.

## Common mistakes to avoid

The most costly mistake is publishing the full result. Copy it to a private host note, then send each person only their assignment.

Other avoidable problems include:

- Using a nickname in the exclusions while entering a full name in the participant list.
- Expecting pair order to matter; `Ayesha, Bilal` and `Bilal, Ayesha` block the same match.
- Assuming a misspelled exclusion will be detected automatically.
- Treating two case variants of one name as two participants without checking the roster.
- Regenerating repeatedly until a favourite pairing appears, which changes the fairness of the draw.

Keep a final roster before generating. A late participant addition requires a fresh draw for everyone, not a hand-edited arrow.

## A practical host workflow

1. Confirm the final roster and normalise names.
2. Enter participants, then add household, couple or manager restrictions.
3. Generate once and inspect every giver, recipient and exclusion.
4. Copy or download the complete result for the host.
5. Send each person their own line through the channel your group already uses.
6. Set the gift deadline and spending guidance separately; this tool does not store event rules.

For a workplace group, consider whether the full recipient list should be visible even to the host. If not, distribute the individual lines and discard the master copy after everyone confirms receipt.

## Browser privacy and safe sharing

The matching code runs in the browser and does not upload the participant list for processing. There is no account or participant invitation step. Loading the website can still make ordinary requests for page assets, so avoid entering sensitive information you would not want present in a browser tab.

Clipboard and download actions put the result on your device. From that point, privacy depends on where you paste or save it. Use private messages rather than a public document, and do not screen-share the full result during a video call.

## Final checklist

- Every participant has exactly one outgoing and one incoming arrow.
- The cycle includes everyone and closes back on itself.
- Every excluded pair is absent.
- Names are spelled consistently and duplicates are intentional.
- Each person receives only their own assignment.
- The host keeps a private backup until gifts are exchanged.

Once those checks pass, the administrative work is finished. The remaining decisions—budget, deadline and whether socks count—belong to the group.
