---
title: "Morse Code Practice: a listening drill with reveal and sound"
description: "Learn the ReelFlow Morse Code Practice controls, fixed word pools, 620 Hz playback, reveal behavior and text output, with a worked HELLO example and a practical drill checklist."
date: 2026-11-27
draft: false
categories:
  - Text
cover: assets/img/blog/morse-code-practice/hero.svg
coverAlt: "Morse Code Practice guide cover with the tool title on a dark green gradient"
coverCaption: "A short listening drill is more useful than rushing through a word list."
takeaways:
  - "The Level control chooses Easy letters, Letters and numbers, or Mixed characters from fixed pools."
  - "The target word is visible from the start; the hidden-looking bullet line is only a placeholder until Reveal Morse is pressed."
  - "Play sound generates a 620 Hz tone locally, with 100 ms dots, 300 ms dashes and short gaps."
  - "Next word can repeat a previous entry because the random picker does not exclude earlier words."
  - "Copy saves the current word, while a revealed result downloaded as TXT contains the word and its Morse code."
faq:
  - q: "Can I enter my own words for practice?"
    a: "No. This page is a practice card, not the Morse Code Translator. It chooses from fixed easy, medium and hard pools, so custom phrases, punctuation and spacing drills need the translator or another practice source."
  - q: "Why can I see the answer before revealing the Morse code?"
    a: "The large word is the target and remains visible. Before revelation, the code area shows a fixed bullet placeholder rather than the real code. Use the placeholder as a cue to listen without reading the code."
  - q: "Does Play sound use my microphone?"
    a: "No. It creates a local Web Audio oscillator at 620 Hz. There is no microphone permission, recording or speech recognition; you supply the answer by reading the displayed word and checking the revealed pattern."
  - q: "What exactly do Copy and Download save?"
    a: "Copy always saves the current word. Download saves a UTF-8 text file; after Reveal Morse it contains the word on one line and the code on the next. The file reflects the card's current reveal state."
---
Morse code becomes easier to recognise when sound, timing and a short answer cycle stay together. The [Morse Code Practice](/morse-code-practice/) tool provides that cycle in one browser card: choose a level, listen, reveal the pattern and move to another word.

It is deliberately small. There is no custom word field, score sheet or speed setting, just material for focused daily practice.

## What this practice page does

The tool turns a word from a predefined pool into International Morse patterns for letters and digits. A dot is a short tone and a dash is a longer tone. The card then gives you three actions: reveal the written pattern, play the tone sequence, or fetch another word.

That makes it useful for beginners who know the alphabet but need repetition, and for experienced learners who want a quick listening warm-up. It is not a translator, a radio simulator or a scored course. The value comes from repeating the same recognise-and-check loop without preparing material first.

The page opens on **Easy letters** and starts a practice card automatically. Changing the level also refreshes the card after a short delay. Pressing **Start practice** draws again from the selected pool.

## Controls and the practice card

The only input control is **Level**, with three choices:

- **Easy letters:** SOS, HELLO, WATER, LIGHT, WORLD, BRAVE, SMILE and DREAM.
- **Letters and numbers:** REELFLOW, TOOLKIT, CREATE, BROWSER, CAMERA and PUZZLE42.
- **Mixed characters:** QWERTY, JINXED, VORTEX, ZEPHYR, QUIZ99 and MYSTIC7.

The names describe the pools, but the distinction is not strict complexity scoring. Easy contains several longer words, while medium includes numbers in only one entry. Treat the levels as different practice sets rather than measured difficulty bands.

The result card shows the selected word in large type. Under it, the code area initially reads a fixed row of bullet groups. That row is a placeholder, not encoded output. **Reveal Morse** replaces it with the real dot-and-dash pattern and changes the button to **Hide Morse**. **Next word** chooses from the current pool and hides the code again. **Reset** restores Easy letters and starts a fresh card.

<figure>
  <img src="/assets/img/blog/morse-code-practice/workflow.svg" alt="Morse Code Practice workflow from choosing a level to local processing and a practice card" width="1200" height="675" loading="lazy">
  <figcaption>The practice workflow: select a level, let the browser choose a pool entry, then reveal, play or advance on the result card.</figcaption>
</figure>

## Worked example: HELLO

HELLO is one of the easy-pool entries, so it is a valid example of the card's output. Its letter patterns are:

- H: `....`
- E: `.`
- L: `.-..`
- L: `.-..`
- O: `---`

Joined with spaces, the revealed line is `.... . .-.. .-.. ---`. The spaces separate letters; they are not extra dashes. Because selection is random, opening the tool does not guarantee that HELLO appears first. Use this sequence to understand the format rather than expecting a reproducible draw.

A useful drill is to press **Play sound**, write the letters you hear, and only then press **Reveal Morse**. The visible target makes this a recognition exercise, not a blind dictation test. For a harder variation, cover the large word with a note or look away from it while the tone plays.

<figure>
  <img src="/assets/img/blog/morse-code-practice/example.svg" alt="Morse Code Practice worked example panel showing the Easy letters level setting" width="1200" height="675" loading="lazy">
  <figcaption>The example panel records Easy letters as the setting; the actual word is drawn at random, and HELLO is one possible pool entry.</figcaption>
</figure>

## How playback sounds

**Play sound** uses the browser's Web Audio support to build a tone sequence. The oscillator frequency is **620 Hz**. Each dot lasts **100 ms**, each dash lasts **300 ms**, and there is an **80 ms** gap after a tone. A space between letters adds **180 ms**.

Those timings are fixed. There is no words-per-minute slider, pitch control, volume control or pause button. The code starts shortly after the click, so have your answer ready before pressing it. If the browser lacks the required AudioContext support, the play action does nothing visible.

Playback is blocked while another sequence is active. Pressing the button again during a tone will not queue a second copy. Changing the level or resetting the tool closes the active audio context when the card is rebuilt. **Next word** does not stop a sequence that is already playing, so wait for it to finish before advancing if timing matters.

## Copy and download output

The result supports both **Copy** and **Download**. Copy is intentionally simple: it saves only the current word, whether the Morse line is revealed or hidden.

Download creates a UTF-8 `.txt` file named `morse-code-practice.txt`. Before revelation, its text is the word alone. After revelation, the file contains the word, a line break, and the spaced Morse pattern. **Hide Morse** returns the downloadable text to the word alone.

This is plain text, not an audio file. The tool does not export WAV, MP3 or a practice transcript with scores.

## Limits and edge cases

The fixed pools are the main limitation. You cannot paste a phrase, choose a specific word, adjust pool size or remove an entry after seeing it. **Next word** uses the same unrestricted random picker as the initial draw, so repeats are possible and immediate repeats are not prevented.

Only A-Z and 0-9 have Morse mappings in this implementation. None of the practice pools contains punctuation, accented letters or spaces between words. The bullet placeholder also looks similar to a real sequence at a glance; read the button label before treating it as an answer.

There is no progress tracking, accuracy score, streak, timer or saved session. Refreshing the page starts again from the defaults. If a sequence seems silent, check the device volume and browser audio permission behavior before assuming the word has no code.

## Common mistakes

The biggest mistake is reading the large word as though it were a hidden answer that must be uncovered. It is always displayed. The reveal control hides or shows the written Morse, not the target.

Another mistake is expecting **Start practice** to guarantee a different word. It simply draws again from the pool. Use **Next word** during a session and accept occasional repetition as part of the practice.

Do not mistake the fixed playback speed for adjustable training speed. If you need slower timing, use the written pattern and tap it manually. Also avoid copying the placeholder bullets into notes as Morse; copy the word, or reveal first if you need the real sequence in a text file.

## Browser and privacy

The word selection, Morse mapping and tone generation run in the page's JavaScript. The tool does not upload text, request microphone access or send a recording anywhere. Sound is synthesised locally through the browser's audio output.

Copy writes to your clipboard only when you press the button. Download creates a local file only when requested. The page does not save practice history for these cards, so copy or download anything you want to keep before refreshing or closing the tab.

## A ten-minute workflow and checklist

A short routine is easier to repeat than an ambitious session:

1. Choose Easy letters and play one card.
2. Write what you hear before revealing the pattern.
3. Compare your answer with both the large word and the Morse line.
4. Say the pattern aloud using "dot" and "dash" once.
5. Advance through four or five more cards, noting only the letters you miss.
6. Move to Letters and numbers when the easy pool feels familiar.
7. Finish by copying the last word or downloading a revealed card for reference.

Before each drill, check the level, device volume and whether the Morse line is hidden. Before leaving, save any result you need. The method matters more than the score: listen, attempt, reveal, repeat.
