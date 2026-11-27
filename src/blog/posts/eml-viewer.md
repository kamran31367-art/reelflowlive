---
title: "Read an EML file without opening your mail app"
description: "Open .eml messages locally, inspect decoded headers and MIME bodies, understand attachment listings, and copy a plain-text record without uploading the email."
date: 2026-11-27
categories:
  - Mail
cover: assets/img/blog/eml-viewer/hero.svg
coverAlt: "An illustrated email envelope beside decoded message headers and an attachment list"
coverCaption: "An EML file contains the message as data. The viewer exposes the useful headers, body parts and attachment names without asking a mail client to open it."
takeaways:
  - "The viewer reads one .eml file from disk with browser APIs; the tool does not upload the message."
  - "Its preview shows From, To, CC, Subject and Date when present, plus decoded plain-text or sanitised HTML content."
  - "Remote images in HTML email are replaced with a privacy notice instead of being loaded."
  - "Attachments are listed by name, content type and decoded body length, but their files cannot be opened or saved here."
  - "Copy and Download produce a text record, not a reconstructed email; an HTML-only message has a placeholder instead of its full body text."
faq:
  - q: "Does the EML File Viewer upload my email?"
    a: "No. The selected file is read locally by the browser and parsed on the page. There is no account, upload step or server-side mailbox connection."
  - q: "Can I open or download an attachment from the preview?"
    a: "No. The viewer reports attachment names, content types and sizes only. It does not reconstruct attachment files. Use a trusted mail client or archive utility, and apply the same caution you would use with the original message."
  - q: "Why does the preview say a remote image is blocked?"
    a: "The HTML sanitiser removes remote image sources before rendering, and the viewer replaces the image tag with a privacy notice. This prevents simply opening the message from requesting tracking images or other remote image resources."
  - q: "Can the displayed headers prove who sent an email?"
    a: "No. The viewer parses what is written in the file; it does not authenticate the sender, verify SPF, DKIM or DMARC results, or establish that a message is trustworthy. Treat those checks as separate work."
draft: false
---

A saved email is often the only record you have of a booking, a delivery problem or a design approval. The [EML File Viewer](/eml-viewer/) lets you inspect that `.eml` file in a browser without importing it into a mail account. It is useful for reading the message, checking its visible headers and seeing which attachments were included, while keeping the file on your device.

## When this viewer is the right tool

Use the viewer when you already have an EML file and need a quick, readable record. Typical cases include checking the recipient and subject of an exported message, reading a plain-text notification, or confirming the name of an attachment before you request the original again.

It is not a mail client. There is no inbox, sending, replying, forwarding or mailbox sync. It also does not prove that a sender is genuine. For suspicious mail, read the content locally, but verify the sender through an independent channel before acting on a payment request or credential link.

## Select the file and open the message

The input pane contains one **Email file** dropzone. Click it or drop a single `.eml` file onto it, then press **Open email**. The file picker advertises `.eml` and `message/rfc822`, but the operation itself reads the selected file as text; changing a file extension is not a substitute for a complete message.

Opening is manual. Selecting a file does not replace an existing preview until you run the tool. **Reset** clears the selected file and returns both panes to their empty state. If the file has no blank line separating headers from the body, the result is an error: `This file does not look like a complete email.`

<figure>
  <img src="/assets/img/blog/eml-viewer/workflow.svg" alt="Workflow from a local EML input through browser parsing to an email preview and text record" width="1200" height="675" loading="lazy">
  <figcaption>The file moves from the local dropzone to browser-side MIME parsing, then to a preview and a copyable text record. No mailbox or upload service sits in the middle.</figcaption>
</figure>

## Worked example: a message with two bodies and one attachment

Imagine `sprint-review.eml` is a multipart message. Its headers identify `Maya <maya@example.com>`, the recipient `editor@example.com`, and the subject `Sprint review - captions due Friday`. The message contains a plain-text alternative, an HTML alternative and an attached `caption-checklist.txt` whose decoded content is the eight-character word `Approved`.

After **Open email**, the header table shows From, To, Subject and Date if that date header exists. The HTML body is used for the visual preview, while the plain-text part remains available to the text output. The HTML includes a remote tracking pixel, so the preview displays `[Remote image blocked for privacy]` instead. The attachment section lists `caption-checklist.txt`, `text/plain` and `8 bytes`; eight is exact here because the decoded attachment is plain ASCII.

The Copy result contains the selected headers, the plain-text body and the attachment name. It does not contain the HTML formatting or a usable copy of the attached file.

<figure>
  <img src="/assets/img/blog/eml-viewer/example.svg" alt="Worked EML example showing an email file input, local processing and an email preview result" width="1200" height="675" loading="lazy">
  <figcaption>A mixed-body message produces one visual preview and one text record. The attachment remains a listing, while the remote image is deliberately not fetched.</figcaption>
</figure>

## What the preview actually shows

The parser unfolds continued header lines and decodes common encoded header words. The visible table is intentionally limited to **From, To, CC, Subject and Date**. Other headers, such as Return-Path, Message-ID or authentication results, are parsed internally but are not shown in that table.

For the body, plain-text parts are collected and joined with blank lines. HTML parts are joined with a horizontal rule, sanitised and displayed in the preview. If both exist, HTML supplies the visual body. If no HTML part exists, the plain text appears inside a preformatted block. A message with neither reports `No text body found.` The Copy and Download text always prefers the collected plain text; when the body is HTML-only, it uses `[HTML email body]` rather than copying the markup.

## Output, attachments and formats

The tool has no PDF, MSG or EML export. **Copy** writes the text summary to the clipboard, subject to the browser's clipboard permission. **Download** saves that same summary as `eml-viewer.txt`. If clipboard access fails, select the visible text and copy it manually.

Attachment metadata comes from MIME parts marked with an attachment disposition. The listed size is the decoded body's JavaScript character length, not a measurement of the original encoded attachment bytes. It can differ for quoted-printable text, base64 content, Unicode or binary data. Do not use that number as a reliable file-size check. Attachment contents are decoded during parsing but never offered as separate downloads.

## Limitations and unusual messages

This is a compact MIME reader, not a complete mail archive. Duplicate header names overwrite earlier values in its header map. Unusual charsets, malformed boundaries and encoded attachment filenames can produce imperfect text or a generic `attachment` name. Inline MIME images that are not HTML data images are not turned into a gallery. Very large files also require memory for the raw message and decoded parts.

A file can pass the file picker and still fail parsing. The most common example is a plain text email copied from a screen rather than an exported message: it has no proper header/body separation or MIME structure. Keep the original `.eml` when possible, and use a full mail client for forensic headers or complicated archive formats.

## Common mistakes to avoid

Do not rename a `.txt` file to `.eml` and expect conversion; the viewer does not manufacture missing headers. Do not rely on Copy to preserve an HTML newsletter's layout or links. Do not treat an attachment listing as an extraction step. Finally, do not click a link in an untrusted message merely because its text rendered cleanly. Sanitising the preview reduces active-content risks, but it does not make the claims inside an email true.

## Browser access, privacy and email safety

No camera, microphone or account permission is involved. Access begins with the local file picker or dropzone, and the parsing code does not send the message to a server. Remote image sources are removed before the HTML preview is inserted. Ordinary links can still remain in sanitised HTML, so opening one can leave the site and expose information to its destination.

For sensitive mail, use a trusted browser on a private device, avoid cloud-synced download folders when policy forbids them, and close or reset the page when finished. The tool's privacy benefit comes from local processing, not from a guarantee that the original file or your device is secure.

## Workflow and checklist

A dependable review is: select the EML, open it, compare the visible headers with the reason you received the message, read both the preview and the text output when HTML is involved, then record only what you need.

- Choose one complete `.eml` file and press **Open email**.
- Confirm From, To, Subject and Date rather than trusting the display name alone.
- Check whether the preview used HTML and whether any remote image was blocked.
- Treat attachment names and listed sizes as metadata, not extracted files.
- Copy or download the text summary before resetting or closing the tab.
- Verify important requests through a separate, trusted channel.

That sequence makes the viewer useful for everyday message inspection without asking it to replace mail security, attachment handling or a full email client.
