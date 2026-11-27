---
title: "Build a mailto link that pre-fills the right draft"
description: "Create a mailto link with To, CC, BCC, subject and message fields, then copy or download it for a support page, signature or resource email."
date: 2026-11-27
categories:
  - Mail
cover: assets/img/blog/mailto-link-generator/hero.svg
coverAlt: "A compose window and encoded mailto link representing a pre-filled email draft"
coverCaption: "A mailto link carries draft fields, not a sent message. Careful encoding and a quick recipient review matter more than the length of the link."
takeaways:
  - "The generator accepts To, CC, BCC, Subject and Message, and builds the link only when you press Generate mailto link."
  - "Non-empty CC, BCC, subject and body values are percent-encoded; multiple To addresses separated by commas have the comma encoded as %2C."
  - "There is no email-address validation, whitespace trimming or automatic formatting of the message."
  - "Copy saves the link and Download saves it as mailto-link-generator.txt; neither action sends an email."
  - "The receiving mail app or webmail decides how the draft appears, so test the link with the clients your audience actually uses."
faq:
  - q: "Does clicking a generated link send the email?"
    a: "No. A mailto link asks the browser to hand draft fields to a configured mail handler. The person still chooses the recipients, reviews the draft and sends it. Browser prompts and mail-app behaviour vary."
  - q: "Can I include more than one recipient?"
    a: "Yes. Enter comma-separated addresses in To, CC or BCC. The generator percent-encodes the whole field, so commas appear as %2C in the link. Whether a particular client displays and resolves them correctly should be tested."
  - q: "Why are spaces and punctuation shown as codes?"
    a: "The subject and message use encodeURIComponent, which keeps the link valid when values contain spaces, ampersands, line breaks or non-English characters. The mail handler decodes those values when it builds the draft."
  - q: "Is a BCC address private in the generated link?"
    a: "No. BCC is a draft header, not encryption. Anyone who can read the link can decode the address. Keep BCC values out of publicly posted links, and review recipient fields before sending."
draft: false
---

A good contact link removes repetition. Instead of asking someone to remember an address, type a subject and explain their request, you can give them a draft that is already started. The [Mailto Link Generator](/mailto-link-generator/) builds that link from five fields, entirely in the browser, so you can place it on a support page, resource download or email signature.

## When a pre-filled draft helps

Mailto links are useful when the next action is an email with predictable context. A sample-page button might pre-fill `Please send the project brief`, while a press-kit link might name the asset in the subject. The visitor remains in control: they can edit every field, choose another account or decide not to send.

Do not use a public mailto link for secrets, private customer details or long attachments. The values are readable in the URL itself, and mailto links do not attach files. For structured form submissions or sensitive information, use an appropriate form and privacy process instead.

## Enter the draft fields

The form has **To**, **CC**, **BCC**, **Subject** and **Message**. To is always included in the generated address; the other four values are omitted when empty. The tool does not mark a field as required and does not check whether an address exists or is spelled correctly.

Press **Generate mailto link** after entering the values. Editing a field does not update an earlier result automatically, so generate again whenever you change the draft. **Reset** empties all five fields and clears the result. There is no saved template, recipient book or history between visits.

<figure>
  <img src="/assets/img/blog/mailto-link-generator/workflow.svg" alt="Workflow from email detail fields through local mailto encoding to a copyable link" width="1200" height="675" loading="lazy">
  <figcaption>The five draft fields are encoded locally, combined into one mailto address and exposed as text for copying or downloading. Sending remains a separate mail-client action.</figcaption>
</figure>

## Worked example: a weekly reel review

Suppose you want a link for two reviewers, with a producer copied and an archive address blind-copied. Enter these values:

- **To:** `studio@example.com, reviews@example.com`
- **CC:** `producer@example.com`
- **BCC:** `archive@example.com`
- **Subject:** `Weekly reel review`
- **Message:** `Please review the 30-second cut.` followed by a new line and `Notes: captions due Friday.`

The generated result is:

```text
mailto:studio@example.com%2Creviews@example.com?cc=producer@example.com&bcc=archive@example.com&subject=Weekly%20reel%20review&body=Please%20review%20the%2030-second%20cut.%0ANotes%3A%20captions%20due%20Friday.
```

Notice that `@` remains readable, the comma between To addresses becomes `%2C`, spaces become `%20`, and the message's new line becomes `%0A`. The order is fixed: To first, then CC, BCC, subject and body when those fields are present.

<figure>
  <img src="/assets/img/blog/mailto-link-generator/example.svg" alt="Worked mailto example showing recipient fields and an encoded mailto link as the expected result" width="1200" height="675" loading="lazy">
  <figcaption>Two To recipients, visible CC and BCC fields, a subject and a two-line message become one encoded link. The values stay inspectable rather than being hidden.</figcaption>
</figure>

## How recipients and message text are encoded

Each recipient field is encoded as one string, with encoded `@` characters restored to the literal `@` used in the address. That means spaces in a display name, commas between addresses and other punctuation are escaped rather than normalised. For example, `Maya, Studio <maya@example.com>` is not converted into a clean address-book entry; it is escaped as supplied.

Subject and Message use the same component-encoding approach. Ampersands become `%26`, so they cannot accidentally start another URL parameter. Line breaks are encoded, non-English text is percent-encoded, and repeated spaces are preserved. The generator does not add a greeting, signature or trailing new line. Write the message exactly as you want the draft to begin, while remembering that the recipient can change it.

## Copy, download and place the link

After generation, **Copy** writes the complete mailto address to the clipboard. If the browser refuses clipboard access, select the result text and copy it manually. **Download** saves the same address as `mailto-link-generator.txt`, which is convenient for keeping a source record while you update a page.

To use the result in HTML, paste it into an anchor's `href` attribute, escaping quotation marks as required by your page system. To share it with a colleague, send the text through your normal channel. Do not assume that pasting it into a word processor preserves the full string; long links may wrap visually without containing an actual space.

## Limits and mail-client differences

An empty form still produces `mailto:`. A subject without a To address produces a link such as `mailto:?subject=Weekly%20reel%20review`. That is valid output from the code, but many people will find it unhelpful. Check the address yourself because there is no validation layer.

There is no HTML body, rich-text formatting, attachment field or send tracking. Very long messages can create links that a browser, website CMS or mail handler truncates. There is no built-in length warning, so keep the body concise and test the final placement. Mailto support also differs across desktop apps, mobile apps and browser-based email; a link that works in one handler may open an empty draft or ask the user to choose an app in another.

## Common mistakes and privacy

The biggest mistake is publishing BCC or personal context in a public link. Percent-encoding is not encryption. Another is assuming the generator cleans addresses: leading spaces, misspelled domains and display names are passed through. A third is treating a generated link as a delivery system. It only requests a draft; it cannot confirm that anything was sent.

The generator does not upload your fields or contact a mail server. Copying may involve the browser's clipboard permission, and opening the finished link hands its decoded values to whichever mail handler the user has configured. That later handling is outside this tool. Keep confidential information out of the link and review CC/BCC fields before distributing it.

## Workflow and checklist

Use a short draft that gives context without doing the recipient's thinking for them. Generate once, test with your own mail app, then copy the verified link into its final location.

- Enter a complete To address and add CC or BCC only when each has a clear purpose.
- Write a specific subject and a brief message with intentional line breaks.
- Generate again after every edit; the output is not live.
- Copy or download the exact result without inserting spaces.
- Test the link in the mail clients your audience uses, including mobile where relevant.
- Remove private details and avoid exposing BCC addresses in public links.

A mailto link works best as a small head start: enough context to prevent a vague email, but not so much that it becomes a fragile or public data store.
