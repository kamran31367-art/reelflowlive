---
title: "Name Wheel: run a transparent random name pick"
description: "Use the Name Wheel with a clean participant list, understand equal odds and repeat draws, and avoid common mistakes when choosing a person for a task or activity."
date: 2026-11-27
categories:
  - Misc
cover: assets/img/blog/name-wheel/hero.svg
coverAlt: "A wheel of participant names with one selected name highlighted below"
coverCaption: "A transparent name pick starts with an accurate list and a rule everyone understands before the wheel moves."
takeaways:
  - "The Names field starts with Ayesha, Bilal, Chen, Daniyal, Emma and Farah, each on its own line."
  - "Each non-empty trimmed line becomes one entry, and duplicate names remain separate wheel segments."
  - "A spin chooses one entry without removing it, so the same person can be selected again on the next spin."
  - "The result is displayed as Winner: followed by the full name, even when the canvas label is shortened."
  - "Copy is disabled, while Download saves the current name list as name-wheel.txt rather than a winner-only record."
faq:
  - q: "Can I use the wheel to choose several different people?"
    a: "Yes, with a manual step. After each selection, remove the chosen name from the list and rebuild the wheel before spinning again. The tool does not automatically exclude previous winners."
  - q: "Does everyone have the same chance?"
    a: "Each entry has one equal segment. If a name appears twice, it has two segments and therefore twice the chance of a name entered once. Remove duplicates and confirm that all intended participants are present."
  - q: "Why is a name shortened on the wheel?"
    a: "Canvas labels longer than 18 characters are shortened with an ellipsis. The complete name is preserved in the winner display and downloaded text list, so use a recognizable short label for a shared screen."
  - q: "Does the tool keep a history of selected names?"
    a: "No. It shows the latest winner but does not store or export a draw history. Keep a separate attendance or selection log when repeatability matters."
draft: false
---

Choosing who goes first can become awkward when the group can see whose turn it is. The [Name Wheel](/name-wheel/) gives everyone the same visible list and selects one entry with a short animation. It is useful for classroom volunteers, meeting prompts and informal team activities, provided the list is accurate and the group agrees on what a repeated selection means.

## What makes a fair name pick

The wheel randomises among the entries you supply; it cannot repair an incomplete list. Before treating a result as fair, check that every eligible person appears once, nobody ineligible has been added and spelling differences have not split one participant into multiple entries.

This tool uses ordinary browser randomness through `Math.random`. It is appropriate for casual selection, not a regulated lottery, a security-sensitive draw or a process that needs independently verifiable results. There is no seed, audit log or certificate of randomness.

Repeated selection can still be useful. If an activity allows the same volunteer more than once, leave every eligible name on the wheel and treat each spin as a fresh opportunity. If the goal is to give everyone one turn, switch to the removal workflow instead. Deciding which model you want before the first draw prevents a fair random result from being judged against the wrong rule afterward.

## Controls and defaults

The input panel is labelled **Names** and contains one seven-row text area. The default entries are `Ayesha`, `Bilal`, `Chen`, `Daniyal`, `Emma` and `Farah`. Replace them with the real participants; leaving the defaults in place produces a wheel unrelated to your group.

The main action says **Spin names**. It builds the wheel from the list. Use the separate **Spin** button inside the output to start the approximately 3.2-second animation. Automatic processing is enabled, so editing the list rebuilds the wheel after a brief pause and clears an earlier winner.

**Reset** restores the six sample names. There are no filters, team groups, exclusion controls or automatic winner removal.

## Worked example: choosing a discussion starter

Suppose four people are eligible to introduce the next topic: Ayesha, Bilal, Chen and Daniyal. Enter exactly those four names, one per line, and remove Emma and Farah from the default list.

Generate the wheel and count four visible segments. Each person then has a one-in-four chance on that spin. If the animation stops on Chen, the output reads `Winner: Chen`. The outcome is illustrative; any of the four names can be selected.

If the activity requires three different speakers, do not spin the unchanged wheel three times. Record Chen, delete the Chen line, rebuild with Ayesha, Bilal and Daniyal, then spin again. Repeat the removal step for the next pick so every selected person is ineligible afterward.

<figure>
  <img src="/assets/img/blog/name-wheel/example.svg" alt="Four participant names on a wheel with Chen shown as an example selected speaker" width="1200" height="675" loading="lazy">
  <figcaption>Chen is one possible winner from a four-name list; removing that line before the next draw prevents an immediate repeat.</figcaption>
</figure>

## Reading the output and formats

The result pane contains a circular canvas, a **Spin** button and a status area. It begins with **Ready**. After the animation, the winner appears as `Winner:` plus the selected entry, and the pane's status repeats that text. The spin button is disabled while the animation runs.

**Download** saves `name-wheel.txt` as plain text, with one current name per line. It downloads the list, not an image of the wheel and not a separate winner file. After a spin, that list is still what the download contains. The **Copy** button is disabled, so manually record the winner when you need a durable selection log.

## Limits and edge cases

Empty lines are discarded and surrounding whitespace is trimmed. A blank list produces `Add at least one wheel choice.` There is no configured maximum number of names, but a crowded wheel becomes difficult to read and verify on a projector or phone.

Duplicates are kept. Entering both `Chen` and `chen ` results in one trimmed `chen` segment alongside `Chen`, so a participant may have two chances under visually similar labels. Decide on one spelling and capitalisation convention before generating the wheel.

Labels longer than 18 characters are shortened on the canvas with an ellipsis. The full entry is retained in the result and text file. Long names can therefore look similar on the wheel even though the final winner display distinguishes them.

## Common mistakes to avoid

Do not leave sample names in the list or assume the tool knows who is present. Do not interpret one spin as proof that the process will distribute turns evenly over a day. Equal segment sizes mean equal probability per spin, not a guaranteed rotation or quota.

Avoid repeatedly spinning because a particular person was not chosen. Set the rule first: first result counts, or previous winners are removed. If you use removal, actually edit the list and rebuild; the animation itself does not eliminate anyone.

For sensitive selections, avoid displaying full personal details. A first name and initial may identify a participant sufficiently while reducing unnecessary exposure on a shared screen.

## Browser use and privacy

The names are processed and drawn locally in the current browser tab. This operation does not upload the list, create a participant database or save a selection history. Refreshing the page or pressing **Reset** clears the session and restores the sample data.

Local processing is not the same as confidentiality. Other people can read the screen, and the downloaded text file exposes the whole list. Do not use a public or shared computer to prepare a list containing information that should not remain in the browser session, and close the tab when finished.

## A transparent selection workflow

Define eligibility before opening the tool. Confirm attendance, write one line per person and remove duplicates. For a no-repeat activity, prepare the full list and a separate place to record each winner.

Show the list to the group, generate the wheel and state the rule aloud. Spin once, announce the displayed result and record it. If another unique winner is needed, remove that entry and rebuild before the next spin. At the end, save only the selection record you actually need rather than the full participant list.

<figure>
  <img src="/assets/img/blog/name-wheel/workflow.svg" alt="Name-picker workflow from attendance checks to duplicate removal, accepted spin and winner logging" width="1200" height="675" loading="lazy">
  <figcaption>A no-repeat draw combines the wheel with a manual log and a rebuilt list after every selected name.</figcaption>
</figure>

## Checklist before choosing a name

- Confirm who is actually eligible and present.
- Replace all six sample names.
- Use one consistently spelled line per participant.
- Remove blank lines and accidental duplicates.
- Decide whether repeat winners are allowed.
- Accept the first result under the agreed rule.
- Record winners separately if the activity needs a history.
