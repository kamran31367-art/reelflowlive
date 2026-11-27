---
title: "Flip a Coin: make a small choice and keep the rule"
description: "Use ReelFlow's Flip a Coin for a quick heads-or-tails choice, understand its short animation and local randomness, and avoid treating it as a secure or auditable system."
date: 2026-11-27
categories:
  - Misc
cover: assets/img/blog/flip-a-coin/hero.svg
coverAlt: "A virtual coin suspended between a heads side and a tails side above two choice cards"
coverCaption: "The coin settles a choice only after you decide what each side means."
takeaways:
  - "Press Flip coin to run a short animation that settles on Heads or Tails."
  - "The button is disabled during the flip, which lasts about a second, and the final result can be downloaded as text."
  - "Each displayed choice and the final winner come from the browser's Math.random function."
  - "There is no call input, custom wording, history, repeated-flip batch or Copy button."
  - "The result is suitable for casual choices, not secure randomness, gambling certification or high-stakes decisions."
faq:
  - q: "Is the result generated on a server?"
    a: "No. The choices are made in the browser with Math.random. No coin result is sent to a server or saved in an account. Loading the website still uses normal web requests, but the flip operation itself is local."
  - q: "Can I choose Heads or Tails before flipping?"
    a: "No. There is no call selector or custom option field. Decide outside the tool which choice you are assigning to Heads and which to Tails, then accept the displayed result."
  - q: "Does the tool remember previous flips?"
    a: "No. It shows only the current result and does not maintain a history or tally. You can download the current winner as flip-a-coin.txt, but keeping a sequence of results requires your own record."
  - q: "Is this cryptographically secure or provably fair?"
    a: "No. It uses JavaScript's Math.random rather than a cryptographic random source, and there is no seed, audit log or fairness proof. Use it for casual decisions, not security-sensitive selection or gambling systems."
draft: false
---

A coin is useful when two acceptable options have stalled a decision. Assign one to Heads and the other to Tails, make one flip and honour the result. The [Flip a Coin](/flip-a-coin/) tool provides that small ritual without an account, registration or setup.

Its scope is intentionally narrow. It returns one of two words after a brief animation. It does not decide whether the options are sensible, record a series of flips or offer a weighted choice.

## What the tool is for

Use the coin for low-stakes ties: which of two films to watch, who goes first in a casual game, or whether to tackle one of two equally acceptable errands. The point is to stop indecision, not to outsource judgement.

The two options must be real alternatives. A coin cannot choose between a safe plan and a dangerous one, and it should not be used to avoid information that would make the decision clear.

It also helps to agree on the rule before pressing the button. If Heads means one option and Tails the other, write that mapping down or say it aloud. Otherwise a result can be reinterpreted after it appears.

## Open and run a flip

The page does not flip automatically. Press the left-pane **Flip coin** action to create the result area, which initially displays **Ready** and a second **Flip coin** button inside the result pane.

Activate the button inside the result pane to start the animation. It becomes disabled while the words Heads and Tails alternate rapidly. After roughly one second, one final word remains and the button becomes available again. Pressing the left-pane action again recreates the result area at Ready rather than starting an animation.

This is a text animation rather than a physical coin model. There is no 3D toss, motion setting or sound control. Standard **Reset** clears the page result; it does not affect a saved record because the tool keeps none.

<figure>
  <img src="/assets/img/blog/flip-a-coin/workflow.svg" alt="Coin workflow from assigning two options, through a disabled-button animation, to one final heads-or-tails result" width="1200" height="675" loading="lazy">
  <figcaption>The decision rule comes first; the animation only selects one of two labels and does not interpret your options.</figcaption>
</figure>

## How the result is produced

The code uses `Math.random` through a two-item picker for every displayed Heads or Tails value. The final winner is selected with another call after the short animation finishes.

The button is locked while the flip runs, preventing a second click from starting an overlapping animation. The rapid intermediate words are visual feedback, not a history of separate coin tosses.

Each choice is drawn from the same two-item list, so the tool does not support weighted odds or custom labels. JavaScript's random generator is not a cryptographic source, and the page provides no seed or independent audit mechanism.

## Worked example: choose between two errands

Suppose you need to choose between buying groceries and washing the car, and either can be done now. Assign Heads to groceries and Tails to the car before opening the result.

Press **Flip coin**. During the animation the button is disabled and the labels alternate. If the final display reads **Heads**, buy groceries. Do not flip again because the car now feels more convenient; that would turn the agreed rule into a search for a preferred answer.

If you need to record the choice, download the winner as `flip-a-coin.txt`. The file contains only `Heads` or `Tails`, so add the option mapping in your own note if the result will be read later.

<figure>
  <img src="/assets/img/blog/flip-a-coin/example.svg" alt="Worked coin example assigning Heads to groceries and Tails to car washing, ending with Heads selected" width="1200" height="675" loading="lazy">
  <figcaption>The example fixes both mappings before the flip and treats the final Heads result as the decision.</figcaption>
</figure>

## Output and limits

The result pane shows one large word. The page status also changes to Heads or Tails after a completed flip. During the animation, the intermediate labels replace one another until the final choice appears.

**Download** becomes available for a finished result and saves a plain text file named `flip-a-coin.txt`. **Copy** is disabled. There is no image export, share link, call history, running tally or batch of multiple flips.

Pressing the flip button again replaces the current result with another animation. That is a new choice, not an extension of a stored sequence. If you are keeping score, record each result yourself outside the tool.

## Randomness without security claims

For a casual two-option decision, a browser random picker is enough to avoid choosing through habit. It does not mean every short sequence will look balanced. Several Heads results in a row are possible, just as several Tails results are possible.

The tool does not promise a physical coin's imperfections, predict future results or prove fairness after the fact. `Math.random` should not be treated as suitable for passwords, security tokens, prize allocation with real value or regulated gambling.

If a decision has meaningful consequences, define criteria, gather information or use a process designed for that stakes level. A coin is a tie-breaker, not a substitute for due diligence.

## Common decision mistakes

Re-flipping until the preferred result appears is the clearest mistake. It breaks the rule that made the coin useful. Decide in advance whether one flip is final; for casual best-of-three play, record each accepted flip rather than discarding inconvenient ones.

Another mistake is assigning vague options. "Do something productive" gives the coin no stable meaning. Choose two concrete actions that you are genuinely willing to accept.

Do not confuse a random outcome with a recommendation. Heads only wins because you mapped it to an option. The tool has no understanding of cost, safety, timing or preference.

## A fair casual workflow

1. Name two acceptable, concrete options.
2. Assign Heads and Tails before running the flip.
3. Agree whether the decision is one flip or a recorded short series.
4. Run the animation and wait for the final word.
5. Accept the result or use a separate decision process if the stakes are higher.
6. Download or note the result only when a record is useful.

For a game that also needs a list of turns or tasks, the [Checklist Manager](/checklist-manager/) can hold those records separately. The coin selects a label; the checklist preserves the context around the game.

## Browser privacy and final check

The flip runs locally in the page, and the result is not stored in local storage or tied to an account. The current winner is available for a text download, but navigating away discards it. Ordinary website requests still occur when loading the site; the random choice itself is not sent to a server.

Before using the result, confirm that both options are acceptable and that the mapping is clear. If either condition fails, close the page and make the decision with a method suited to the real stakes.
