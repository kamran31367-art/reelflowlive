---
title: "YAML to JSON and Back: A Practical Conversion Guide"
description: "Convert configuration between YAML and JSON locally, understand type handling and formatting, and avoid the input mistakes that produce misleading output."
date: 2026-11-27
categories:
  - Developer
cover: assets/img/blog/yaml-json-converter/hero.svg
coverAlt: "A YAML configuration converting into indented JSON with matching keys and values"
coverCaption: "The converter changes syntax and layout, not the meaning of the keys, lists and scalar values you provide."
takeaways:
  - "Conversion starts in YAML to JSON mode with a three-key sample configuration already in the input field."
  - "YAML input uses the bundled parser's JSON schema, so date-like and yes/no text remain strings rather than being silently retyped."
  - "YAML to JSON output is indented with two spaces; JSON to YAML disables references and uses a 100-column line-width setting."
  - "Comments, anchors and presentation details are not preserved as JSON, because JSON has no equivalent representation for them."
  - "A YAML document that parses to undefined can produce the literal word undefined; check that the source contains an actual value."
faq:
  - q: "Does the converter preserve YAML comments?"
    a: "No. Comments are useful to people but have no JSON equivalent. Anchors and aliases are also resolved into ordinary data when the YAML is loaded for JSON output."
  - q: "Are values such as 2026-11-27 or yes converted automatically?"
    a: "Not under the selected JSON schema. Date-like scalars stay strings, and yes/no text is not treated as a JSON boolean. Use true or false when you need a Boolean value."
  - q: "Can I convert a JSON object with nested arrays?"
    a: "Yes. JSON.parse reads the complete value, and the YAML emitter can represent nested objects and arrays. This is a data-shape conversion, not a schema transformation."
  - q: "Is the input sent to a server?"
    a: "No. Parsing, JSON serialization and YAML emission happen in the browser using the bundled JavaScript libraries. The page does not submit your configuration to a conversion service."
draft: false
---

Configuration often moves between a human-edited YAML file and a JSON API. The [YAML/JSON Converter](/yaml-json-converter/) handles that syntax change without an upload or account. It is best for straightforward configuration data; it is not a schema migrator and it cannot preserve comments that the destination format does not support.

## When conversion is useful

Use YAML to JSON when a deployment file, workflow definition or application setting must be inspected as structured data. JSON's explicit braces and quoted keys make it easier to check nesting in a debugger or API client. Use JSON to YAML when a generated response needs to become a readable configuration file.

The tool is also useful for a quick round trip. If a key, list or Boolean changes meaning after conversion, the problem is usually in the source representation rather than in the act of changing formats.

## Controls and defaults

The **Conversion** select starts at **YAML to JSON** and also offers **JSON to YAML**. The **Input** textarea has six rows, spellchecking disabled and this default:

```yaml
name: ReelFlow
tools: 139
local: true
```

Press **Convert** to run the selected direction. **Reset** restores the sample and YAML to JSON mode. Changing the mode does not transform the existing text automatically, so replace the input with valid source syntax before converting again.

## Worked example: the default configuration

With the default input and YAML to JSON selected, the result is:

```json
{
  "name": "ReelFlow",
  "tools": 139,
  "local": true
}
```

The key names and values stay the same. JSON adds quotation marks around keys and strings, braces around the object, and two-space indentation. Switch to JSON to YAML, paste that JSON, and the emitter returns the compact mapping form:

```yaml
name: ReelFlow
tools: 139
local: true
```

<figure>
  <img src="/assets/img/blog/yaml-json-converter/example.svg" alt="The default ReelFlow YAML mapping converting into matching two-space-indented JSON" width="1200" height="675" loading="lazy">
  <figcaption>The sample keeps its three values unchanged while JSON supplies explicit object syntax and indentation.</figcaption>
</figure>

## Understand the YAML schema

YAML parsers can attach types to ambiguous text. This tool loads YAML with the bundled library's `JSON_SCHEMA`, which keeps the result aligned with JSON-style types. A scalar such as `2026-11-27` therefore remains a string instead of becoming a date object that `JSON.stringify` would later turn into an ISO timestamp.

Under that schema, plain `yes` and `no` are strings, while `true` and `false` are Booleans. Numbers become JSON numbers when valid. This matters when a downstream API distinguishes the string `"true"` from the Boolean `true`; conversion does not guess which one you intended.

Nested structures follow the same rules. A YAML sequence headed by `services:` can contain mappings with fields such as `name` and `port`; JSON represents that sequence as an array of objects. Indentation in YAML communicates which fields belong to each item, so a shifted key can change the data shape even though every line looks valid. After conversion, inspect the brackets and nesting rather than checking only the leaf values. Quoted numbers such as `"139"` remain strings, while unquoted `139` becomes a JSON number.

## Output, formatting and file handling

YAML to JSON uses two-space indentation. JSON to YAML uses `noRefs: true`, which avoids YAML anchors and aliases in emitted output, and `lineWidth: 100`, which lets the emitter wrap long content. The result is displayed as plain text and can be copied directly.

Long YAML strings may be folded across lines by the emitter. That is valid YAML presentation, not a change to the decoded value, but manual rewrapping can accidentally alter spacing. Let the receiving YAML parser read the emitted text instead of editing line breaks by eye. Keep the file in UTF-8 and validate it with the same application or schema that will consume it; a visually tidy configuration can still contain the wrong type or nesting.

**Download** saves `yaml-json-converter.txt` in either direction. The extension does not change with the selected mode, so rename the file to `.yaml` or `.yml` when it will be used as configuration. The downloaded content is text, not a packaged project or archive.

## Limitations and edge cases

Comments have no JSON representation. Formatting choices, quoting style and YAML anchors are also presentation or reference mechanisms rather than JSON data. If those details matter, keep the original YAML alongside the converted JSON instead of expecting a lossless source-to-source transformation.

Invalid YAML and invalid JSON produce an error message and disable Copy and Download. Duplicate mapping keys can be rejected by the YAML loader. Custom YAML tags and syntax outside the selected schema may not produce ordinary JSON-compatible values.

One subtle case deserves a check: an input made only of comments or a YAML document marker can parse to `undefined`. Because the operation serializes that value, the visible result can be the literal text `undefined` rather than valid JSON `null`. Confirm that your YAML document contains a real mapping, sequence or scalar before using the output.

## Common mistakes to avoid

Do not switch to JSON to YAML and leave YAML in the field; the operation calls `JSON.parse`, so YAML syntax will fail. Do not quote every YAML number if the destination API expects a number, and do not rely on unquoted `yes` to become a Boolean.

Avoid pasting a complete multi-document YAML stream unless the receiving library explicitly supports it. The tool is designed around one parsed value. After conversion, validate the result with the application or schema that will consume it; successful text conversion does not prove that every required field is present.

## Browser and privacy behavior

The bundled YAML library parses the input locally, and JSON serialization runs in the same tab. There is no configuration-upload request. Treat the page as a temporary workspace: resetting or reloading removes the visible input and result. Configuration can still contain secrets, so use redacted examples before sharing any converted text.

## A practical conversion workflow

1. Choose the source and destination formats.
2. Confirm that the input contains one valid document or JSON value.
3. Check ambiguous scalars such as dates, yes/no text and quoted numbers.
4. Press **Convert** and inspect the nesting and value types.
5. Validate against the destination schema or application.
6. Copy the result or download and rename the text file appropriately.

<figure>
  <img src="/assets/img/blog/yaml-json-converter/workflow.svg" alt="Workflow showing YAML input, schema-aware parsing, JSON output and a reverse conversion check" width="1200" height="675" loading="lazy">
  <figcaption>A round trip through JSON checks keys, lists and scalar types while leaving comments and YAML-only presentation outside the conversion.</figcaption>
</figure>

## Final checklist

Check the direction, the top-level value, Boolean and number types, nested lists, and any fields the destination requires. Keep the original source when comments or formatting carry operational meaning.
