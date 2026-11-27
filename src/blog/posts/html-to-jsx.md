---
title: "HTML to JSX: convert attributes and styles with care"
description: "Turn common HTML attributes, comments and inline styles into JSX syntax, with a worked conversion and the regex limits every React developer should know."
date: 2026-11-27
draft: false
categories:
  - Developer
cover: assets/img/blog/html-to-jsx/hero.svg
coverAlt: "Illustration of HTML markup changing into React JSX attributes and style objects"
coverCaption: "JSX looks like markup, but several attributes and inline styles follow JavaScript rules."
takeaways:
  - "The converter changes class to className, for to htmlFor, tabindex to tabIndex and readonly to readOnly."
  - "Double-quoted onclick and onchange attributes become arrow functions containing the original handler body."
  - "Inline style declarations become camel-cased object properties, with common numeric unitless values left unquoted."
  - "HTML comments become JSX comments wrapped in braces."
  - "The implementation is a narrow text converter, so single quotes, arbitrary attributes and invalid input still require manual review."
faq:
  - q: "Is the output guaranteed to compile as JSX?"
    a: "No. The tool applies targeted replacements without parsing HTML or invoking a JSX compiler. Unsupported syntax, a missing handler identifier, unusual attribute casing or malformed style declarations can produce code that still needs correction."
  - q: "Does it preserve React event-handler behavior?"
    a: "It wraps the original onclick or onchange body in an arrow function, but it does not translate arbitrary browser globals, scope or event semantics. Review the handler in its React context and prefer explicit React props over inline HTML event strings."
  - q: "Will it convert attributes that use single quotes?"
    a: "Not reliably. The event and style replacements specifically match double-quoted values, and several attribute replacements depend on exact lowercase spelling. Single-quoted or unusually formatted markup should be normalized and checked by hand."
  - q: "Is my HTML uploaded?"
    a: "No. Conversion runs in the browser on the HTML input text. Copy and Download act on the local result. The source remains in the page and the result may remain on your clipboard, so avoid pasting private form data."
---

Moving a small piece of markup into React often starts with mechanical syntax changes: class names, label targets, inline styles and event attributes. The [HTML to JSX Converter](/html-to-jsx/) handles a useful subset of those changes locally so you can focus on the component logic.

It is a starting point, not a complete HTML parser or React migration tool. Review the generated code as carefully as you would review a colleague's first draft.

## What this tool is for

Use this converter for a component-sized snippet that is already close to JSX. It saves repetitive editing when a static card, label or button arrives from an HTML template and needs to become part of a React component.

The supported transformations cover common class, label, tabindex, readonly, event, comment and style syntax. That makes the output easier to paste into a `.jsx` file than the original markup, especially when inline CSS is involved.

Do not use it to migrate a full application, convert templates with complex binding syntax or validate untrusted HTML. The tool does not understand the document tree, framework directives, accessibility semantics or the surrounding JavaScript scope.

## Controls and defaults

The single field is **HTML input**, shown as a nine-row textarea with spellcheck disabled. It starts with:

```html
<div class="card" style="color: red; font-size: 16px;">
  <img src="photo.png" alt="Preview" />
  <button onclick="save()">Save</button>
</div>
```

Press **Convert to JSX** to run the conversion. The page does not run automatically after every edit. **Reset** restores this example and clears the result.

There are no options for quote style, indentation, TypeScript, formatting or attribute policy. The converter preserves most of the original layout and changes only the patterns it recognizes.

## Worked example

Convert the default sample without editing it. The output is:

{% raw %}
```jsx
<div className="card" style={{ color: "red", fontSize: "16px" }}>
  <img src="photo.png" alt="Preview" />
  <button onClick={() => {save()}}>Save</button>
</div>
```
{% endraw %}

`class` becomes `className`, the style string becomes an object, and `font-size` becomes `fontSize`. The original `color` value remains a string, while `onclick` becomes a function-valued `onClick` prop.

The spacing inside the generated arrow function is compact and is not automatically formatted. That is expected: the tool changes text, then leaves code formatting to your editor or formatter.

<figure>
  <img src="/assets/img/blog/html-to-jsx/example.svg" alt="Default HTML card converted to JSX with className, style object and onClick prop" width="1200" height="675" loading="lazy">
  <figcaption>The sample conversion keeps the same image and button while translating class, inline style and onclick into JSX-compatible syntax.</figcaption>
</figure>

## Output and formats

The output pane is titled **JSX**. **Copy** copies the complete converted text, and **Download** saves it as a `.jsx` file. The file is plain text with a JSX filename; it is not bundled, type-checked or executed.

A successful conversion sets the status to **Converted**. Empty input produces `Paste HTML first.` rather than returning an empty component. The output controls remain disabled until a result exists.

Comments follow JSX syntax. For example, `<!-- note -->` becomes `{/* note */}`. If a comment appears inside a JavaScript expression area rather than JSX children, its placement still needs manual review.

## Limits and edge cases

The implementation uses targeted regular expressions. It expects exact lowercase attribute spellings and double quotes for event and style values. `CLASS=`, single-quoted styles and attributes split across unusual whitespace can be missed.

Only `class`, `for`, `tabindex`, `readonly`, `onclick` and `onchange` receive dedicated attribute handling. SVG attributes such as `stroke-width`, `xlink:href`, custom data conventions and template bindings are not systematically converted. Self-closing syntax is adjusted only for simple lowercase tag names.

Inline style parsing assumes semicolon-separated declarations and converts hyphenated property names to camel case. A small list treats numeric opacity, zIndex, fontWeight, lineHeight, flex, flexGrow, flexShrink, order and zoom as unitless. Other numeric values remain quoted strings, and CSS custom properties or complex values may need special handling.

A declaration without a colon is not rejected cleanly: the property can consume the whole fragment and the value can become an empty string. Duplicate declarations are preserved rather than resolved. Review style objects for those cases, and prefer moving reusable values into classes or component styles after the initial conversion.

The converter also leaves URLs, template expressions and text content alone. That is helpful for a static snippet, but it means Angular-style bindings, template literals and server-side placeholders can survive into a React file. Remove or replace them deliberately instead of assuming the conversion completed the migration.

## Common mistakes

Do not assume the tool has parsed the HTML. It can rewrite matching text inside an unusual context and can leave non-matching syntax untouched. A successful status means replacements ran, not that React will accept the result.

Do not carry inline HTML event strings into a component without reviewing scope and behavior. `onClick={() => {save()}}` requires `save` to be available in the component, and an empty original handler can generate an empty function body.

Finally, do not let generated markup weaken accessibility. Keep labels associated with controls, preserve meaningful alternative text and check keyboard behavior after moving the snippet into React.

## Browser and privacy

The converter processes HTML in the local page and makes no upload as part of the operation. That is useful for internal templates, customer-facing copy and markup that has not been published.

Local does not mean the source is safe to leave around. Pasted HTML may contain form values, personal data or unpublished content. Reset the page after use, inspect clipboard history if the source is sensitive, and avoid executing generated handlers until their code has been reviewed. Treat copied output as source code as well: review it before pasting into shared repositories or sending it to another person.

## A practical workflow

Paste one small snippet rather than a whole page. Run the conversion, then inspect attributes, style values and event bodies before moving the output into a component.

Compile the component in the real project, resolve missing identifiers and replace inline styles or handlers with the project's preferred patterns. Run the existing component checks and test keyboard and screen-reader behavior where the markup affects interaction.

<figure>
  <img src="/assets/img/blog/html-to-jsx/workflow.svg" alt="Workflow from HTML snippet through JSX conversion and manual review to project compilation" width="1200" height="675" loading="lazy">
  <figcaption>The converter handles recognizable syntax; project compilation and interaction review decide whether the component is actually ready.</figcaption>
</figure>

## Preflight checklist

- Start with a small, valid HTML snippet.
- Check class, label, readonly and tabindex attributes manually.
- Confirm styles use supported declarations and appropriate value types.
- Review every generated event handler and its identifier scope.
- Look for single-quoted, SVG or template syntax the converter may miss.
- Compile in the React project and test accessibility before shipping.
