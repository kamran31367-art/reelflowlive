---
title: "Phone Parser and Formatter: normalize numbers with E.164"
description: "Parse international and national phone numbers locally, compare E.164 and display formats, and understand country, type and validity limits."
date: 2026-11-27
draft: false
categories:
  - Developer
  - Workflow
cover: assets/img/blog/phone-parser/hero.svg
coverAlt: "Illustration of one phone number shown in national, international and E.164 formats"
coverCaption: "Store a normalized number for routing; keep a readable format for people."
takeaways:
  - "The tool returns International, National, E.164, Country and Type for a valid parsed number."
  - "The default +44 7700 900123 example resolves to United Kingdom mobile formatting and E.164 +447700900123."
  - "Default country offers eight choices and matters when the input has no international calling-code prefix."
  - "A leading plus sign lets an international number override the selected default country."
  - "Numbering-plan validity does not prove that a line is active, belongs to a person or supports SMS."
faq:
  - q: "What if the number has no plus sign?"
    a: "The parser uses Default country to interpret the national number. The available defaults are the United States, United Kingdom, Pakistan, India, United Arab Emirates, Australia, Germany and France. Choose the correct one before parsing a local number."
  - q: "Can I parse a number from a country outside those eight?"
    a: "Yes, when the number includes its international calling code, such as a leading plus. The default-country list supplies context for national input; it does not limit the international metadata used by the parser."
  - q: "Why does Type say unknown?"
    a: "Some valid numbering plans do not map cleanly to a fixed-line or mobile category, and some shared calling codes do not identify a single country. The tool prints unknown rather than inventing a classification."
  - q: "Does parsing send the number to a server?"
    a: "No. The bundled phone-number parser runs in the browser on the local input. No lookup, carrier request or ownership verification is made, although copied results can remain in clipboard history or downloaded files."
---

Contact forms, spreadsheets and CRMs rarely agree on how a phone number should look. The [Phone Parser and Formatter](/phone-parser/) normalizes an international or national number and shows display-friendly forms beside the compact E.164 value.

That makes it useful for cleaning data and checking a country assumption before integration. It does not contact the number or verify who owns it, so parsing should be the start of validation rather than the end.

## What this tool is for

Use this tool when one system stores `+44 7700 900123`, another stores `07700 900123`, and an API expects `+447700900123`. It provides a consistent E.164 value for routing while retaining national and international formats for display.

It also helps diagnose ambiguous local input. A ten-digit number can mean something different under a United States default than under a United Kingdom default. Selecting the country explicitly makes that assumption visible.

The parser checks numbering-plan structure and validity. It does not make a call, send an SMS, check porting status, identify a subscriber or guarantee that a valid-looking number is currently assigned.

## Controls and defaults

**Phone number** starts with `+44 7700 900123`. **Default country** starts with **United States**, even though the sample includes a UK calling code.

The country menu contains eight options: United States, United Kingdom, Pakistan, India, United Arab Emirates, Australia, Germany and France. Press **Parse number** to run the operation. Automatic running is disabled, so you can finish editing before parsing.

**Reset** restores the UK sample and US default. There is no extension field, output-format selector, batch upload or country search outside the supplied list.

## Worked example

Run the default sample unchanged. The plus sign tells the parser that this is an international UK number, so the US default does not reinterpret it. The result is:

```text
International: +44 7700 900123
National: 07700 900123
E.164: +447700900123
Country: GB
Type: MOBILE
```

The International line is grouped for reading. The National line uses domestic presentation. E.164 removes spaces and formatting, leaving the plus sign and digits required by the normalized representation.

For a national-input check, replace the sample with `07700 900123` and choose **United Kingdom** as Default country. The same normalized E.164 value should result.

<figure>
  <img src="/assets/img/blog/phone-parser/example.svg" alt="UK mobile number displayed in international, national and compact E.164 formats" width="1200" height="675" loading="lazy">
  <figcaption>The default UK mobile example keeps a readable international form and a domestic form while producing +447700900123 for storage or routing.</figcaption>
</figure>

## Output and formats

The output pane is titled **Parsed phone details**. Its five lines are `International`, `National`, `E.164`, `Country` and `Type`. **Copy** copies the full block, and **Download** saves it as a `.txt` file.

Country is normally a two-letter code such as `GB` or `US`. Type is an uppercase parser category such as `MOBILE`, `FIXED_LINE`, `FIXED_LINE_OR_MOBILE`, `VOIP` or `unknown`.

A valid parse ends with status **Complete**. Empty input asks for a phone number, and an invalid number produces `This phone number is not valid.` If the bundled parser cannot load, the page reports that the phone parser is unavailable.

## Limits and edge cases

The default-country menu is intentionally short. National numbers from countries outside those eight cannot be interpreted by this interface alone, but international numbers with a calling code are not restricted to the menu.

A valid number can still have `Country: unknown` or `Type: unknown`. Non-geographic services and shared numbering plans do not always identify a country or line category. Formatting depends on the bundled numbering metadata and can differ from a carrier's preferred display.

Extensions are not shown as a separate output line, and the E.164 value covers the main number rather than an extension. The tool does not output carrier, timezone, RFC 3966 `tel:` URI or ownership data. There is also no configured text-length ceiling; practical use is governed by browser memory and parser behavior.

When a contact record includes an extension, keep it in a separate field rather than appending it blindly to E.164. Otherwise two people on the same switchboard can become indistinguishable, and the receiving telephony API may reject a value it does not expect.

For spreadsheets, normalize a copy instead of overwriting the source column. Preserve the original text so a surprising country or type can be traced back to the data entry. This is especially important when numbers were collected through several forms with different default countries.

## Common mistakes

Do not use a formatted national number as a database key when an API expects E.164. Keep the normalized value for matching and routing, and format it for display only when the audience's locale is known.

Do not leave Default country at United States while parsing local numbers from elsewhere. Do not assume a plus-prefixed number needs to match the selected default; the international calling code takes precedence.

Finally, do not equate a successful parse with deliverability. A number can fit a numbering plan without being active, reachable or permitted to receive SMS. Use an appropriate verification step when that distinction matters.

## Browser and privacy

Parsing runs locally with the bundled phone-number library. The number is not uploaded for formatting and no external ownership or carrier lookup occurs. This is useful for contact-list cleanup and private customer records.

Phone numbers are still personal data. Copied output, downloaded text and browser history can expose them on a shared or synchronized device. Limit how much contact data you paste, avoid logging full numbers unnecessarily and reset the page after sensitive work.

## A practical workflow

Start with the most complete form available, including the international calling code. Parse it, confirm the country and type, then copy the E.164 value for storage or an API field.

Keep a separate display value or format according to the user's locale at presentation time. For national input, choose the correct default country before parsing. If the service requires active-line verification, add that as a separate consent-aware step.

<figure>
  <img src="/assets/img/blog/phone-parser/workflow.svg" alt="Workflow from a raw contact number through country-aware parsing to E.164 storage and locale-aware display" width="1200" height="675" loading="lazy">
  <figcaption>Normalize once for routing, preserve the country assumption and format for people only when their locale is known.</figcaption>
</figure>

## Preflight checklist

- Include the international calling code whenever it is available.
- Choose the correct Default country for national input.
- Confirm Country and Type before accepting the parse.
- Store the E.164 value without spaces or display punctuation.
- Keep national and international formats for presentation, not identity.
- Add separate verification if active service or ownership matters.
