---
title: "Keycode JavaScript Info: read key, code and legacy values"
description: "Inspect keyboard key names, modifiers, code and legacy keyCode values with ReelFlow's local keycode tool, including its capture and mapping limits."
date: 2026-11-27
draft: false
categories:
  - Developer
cover: assets/img/blog/keycode-info/hero.svg
coverAlt: "Illustration of a keyboard event with key, code and modifier labels"
coverCaption: "A key name describes the character; a physical code describes the key position."
takeaways:
  - "The default Enter result reports key Enter, code Enter and legacy keyCode and which values of 13."
  - "Type combinations such as Ctrl+Shift+S, or press a key while the page is open to populate the field."
  - "The tool reconstructs code from the key name; it does not read the browser event's physical code property."
  - "Unknown non-character keys show keyCode and which as not available instead of a guessed number."
  - "New event handlers should prefer event.key for actions and event.code for physical-position shortcuts."
faq:
  - q: "Is the code value the same as the key value?"
    a: "No. key represents the logical key or character, while code represents a physical key position. The tool approximates code from a small mapping and from single-character names, so it is a quick reference rather than a full KeyboardEvent inspector."
  - q: "Why does an unfamiliar key show not available?"
    a: "The legacy keyCode table covers common named keys, and single characters use their uppercase character code. Other names fall back to zero, which the output displays as not available. That is more honest than inventing a browser-specific number."
  - q: "Can I inspect any keyboard shortcut safely?"
    a: "Use a harmless test combination or type the shortcut into the Key name field. The page listens for keydown but does not cancel the browser's default action, so combinations such as Ctrl+S may still invoke browser commands."
  - q: "Does the tool upload my keystrokes?"
    a: "No. Key capture and lookup happen in the browser, and no typed text is sent as part of this operation. The value remains in the page until you reset, close the tab or overwrite it."
---

Keyboard shortcuts fail for subtle reasons: the character changed with a layout, the physical key moved, or an old `keyCode` check no longer matches. The [Keycode JavaScript Info](/keycode-info/) tool gives you a quick local view of the values an event handler is likely to see.

Use it to compare a named key, a modifier combination and an unknown key before writing a branch. Just as importantly, understand which values are reconstructed by the tool and which come from an actual key event.

## What this tool is for

This page is useful while implementing keyboard navigation, debugging a shortcut or explaining the difference between `event.key` and `event.code`. It can answer small questions without adding logging code to an application: What name does Space use? Which legacy number belongs to Escape? How should Control be written in the input?

It is not a keylogger, shortcut recorder or complete browser-event console. It does not capture keyup events, repeat state, event locations, composed text or the original DOM event object. Its purpose is a compact reference for common keyboard-handler decisions.

## Controls and defaults

The single field is **Key name**. It starts with `Enter`, and its placeholder reads `Type a key name or press a key on this page`. The **Inspect key** button runs the lookup; because automatic running is enabled, the starting result appears on page load and updates after input changes.

You can type a key directly or join modifiers with plus signs. The tool recognizes aliases including `control`, `option`, `cmd` and `command`. For example, `ctrl+shift+s` and `Ctrl+Shift+S` are both interpreted as a shifted S with Ctrl and Shift modifiers.

**Reset** restores Enter and reruns the automatic lookup. Pressing a key on the page also writes a combined value into the field, so you can inspect the captured name without retyping it.

For a quick comparison, inspect the base key first, then add one modifier at a time. This separates a naming problem from a modifier problem. If the base key is already unknown, adding Ctrl or Shift will not make the legacy mapping more reliable, so use the application's real event object for deeper diagnosis.

## Worked example

Leave the default `Enter` in place and inspect it. The output contains six labelled lines:

```text
key: "Enter"
modifiers: none
code: Enter
keyCode (legacy): 13
which (legacy): 13
length: 5
```

Now enter `Ctrl+Shift+S`. The key becomes `"S"`, modifiers become `Ctrl, Shift`, code becomes `KeyS`, and both legacy values become `83`. The length is one because it describes the normalized key, not the entire shortcut.

This makes the distinction visible: the shortcut has three logical parts, but the reported key is the final character. Your handler still needs to inspect the modifier booleans separately.

<figure>
  <img src="/assets/img/blog/keycode-info/example.svg" alt="Key details for Enter and Ctrl Shift S showing logical key, code and legacy values" width="1200" height="675" loading="lazy">
  <figcaption>Enter maps to legacy value 13, while the typed Ctrl+Shift+S example resolves to key S, code KeyS and legacy value 83.</figcaption>
</figure>

## Output and formats

The result pane is titled **JavaScript key details**. Its fields are `key`, `modifiers`, `code`, `keyCode (legacy)`, `which (legacy)` and `length`. **Copy** copies all six lines, while **Download** saves them as a `.txt` file.

Quotes around the key are added with JSON formatting, so spaces and special characters remain readable. Modifier aliases are normalized to names such as Ctrl, Shift, Alt and Meta; unrecognized modifier text is retained rather than rejected.

The status is simply **Complete** after a successful lookup. Empty input produces `Press a key or enter a key name.`, and the output controls remain unavailable until a valid result exists.

## Limits and edge cases

Captured keydown events supply `event.key`, with Space and literal plus signs renamed for readability. However, the operation does not read `event.code`. It reconstructs code from known names such as Enter and ArrowUp, or assumes `KeyA` for a single character.

That approximation has consequences. Punctuation names, numpad distinctions, international layouts, Dead keys, IME composition and many function keys can produce `Unknown` for code. For an unknown multi-character name, legacy `keyCode` and `which` also display `not available`.

A typed lowercase `a` remains lowercase in `key`, while a typed `Ctrl+Shift+a` is displayed as uppercase because Shift is present. The page normalizes names for lookup but is not a model of every browser's keyboard behavior.

## Common mistakes

Do not use legacy `keyCode` or `which` for new shortcut logic when `key` and `code` are available. Legacy values vary across browsers, layouts and event types, and this tool's table is deliberately small.

Do not choose `key` when you mean physical position. A shortcut assigned to `code === 'KeyQ'` follows that key across keyboard layouts; a check against a character follows the produced character instead. Conversely, use `key` when the action belongs to a character or named control such as Enter.

Finally, avoid testing destructive browser shortcuts on this page. Key capture does not suppress default actions, so the browser may navigate, save or open a dialog while the result updates.

## Browser and privacy

The lookup is local and does not send captured key names anywhere. That makes it suitable for investigating application shortcuts without adding analytics or remote logging. It also means the page cannot tell you which application outside the browser receives a key.

Treat the open field as temporary diagnostic state. Do not type passwords into it. Reset or close the tab after a shared-machine session, and remember that a copied result may pass through clipboard history or synchronization.

## A practical workflow

First decide whether the shortcut is character-based or position-based. Type the candidate into **Key name**, inspect the normalized key and code, then compare those values with the branch you plan to write.

For browser-specific behavior, capture a harmless key on the page and check the result, but verify the real event in application code before shipping. Add tests for the layouts and modifier combinations your users actually need.

<figure>
  <img src="/assets/img/blog/keycode-info/workflow.svg" alt="Decision workflow choosing event key for characters and event code for physical keyboard positions" width="1200" height="675" loading="lazy">
  <figcaption>Choose the event property from the intended behavior, then use the tool as a quick reference before implementing the handler.</figcaption>
</figure>

## Preflight checklist

- Decide whether the shortcut follows a character or a physical key.
- Use **Inspect key** after typing modifiers and the final key.
- Check both `key` and `code`, not only a legacy number.
- Verify browser behavior for punctuation, numpad and international keys.
- Test with and without Ctrl, Shift, Alt and Meta where relevant.
- Avoid key combinations that trigger default browser actions during inspection.
