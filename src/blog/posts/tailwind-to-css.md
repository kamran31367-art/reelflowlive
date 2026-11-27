---
title: "Tailwind to CSS: inspect the declarations behind classes"
description: "Convert a focused Tailwind class list into readable CSS declarations, with exact mappings, a worked example and clear limits for variants and arbitrary values."
date: 2026-11-27
categories:
  - Tailwind
  - Workflow
cover: assets/img/blog/tailwind-to-css/hero.svg
coverAlt: "A Tailwind class attribute beside an ordered list of plain CSS declarations"
coverCaption: "Reading the declarations helps reveal spacing, colour and layout decisions hidden in a class list."
takeaways:
  - "Paste classes and press Convert to CSS; the converter does not run automatically."
  - "It recognises a focused set of display, flex, spacing, radius, colour, type and shadow utilities."
  - "Output follows input-token order and contains declarations without a selector or rule wrapper."
  - "Responsive, state and many directional or arbitrary utilities are not fully interpreted."
  - "Download saves tailwind-to-css.css, while Copy returns only the generated declarations."
faq:
  - q: "Does this reproduce Tailwind's final computed CSS?"
    a: "No. It translates recognised tokens into readable declarations using built-in lookup tables. It does not run Tailwind, resolve your theme, apply variants, merge conflicting classes or calculate cascade precedence."
  - q: "Why is there no selector around the output?"
    a: "The tool returns a declaration list only. Add a selector or move the declarations into your component styling system before using the download as a CSS rule."
  - q: "What happens to responsive and hover classes?"
    a: "Tokens such as md:flex or hover:bg-blue-600 are not translated by the current parser. Restore their breakpoint or state conditions manually; do not expect media queries or pseudo-class rules in the output."
  - q: "Can arbitrary values contain spaces?"
    a: "The parser splits the input on whitespace, so an arbitrary class with a literal space can be broken into separate tokens. Tailwind usually represents those spaces with underscores, and recognised arbitrary values are not always decoded back into spaces here."
draft: false
---

A Tailwind class list can be compact enough to hide its design decisions. The [Tailwind to CSS Converter](/tailwind-to-css/) makes a focused set of those utilities readable as ordinary declarations, which is useful when documenting a component, explaining spacing or preparing a non-Tailwind handoff.

It is not a Tailwind compiler. The converter reads text tokens and uses built-in lookup tables, so theme customisation, variants and the cascade remain outside its scope. Use the output to inspect common base utilities, then compare it with the project's actual compiled CSS when exact behaviour matters.

## How the conversion works

The **Tailwind classes** textarea starts with a representative class list. This tool has automatic running disabled, so press **Convert to CSS** after editing or pasting. **Reset** restores the sample. Empty or whitespace-only input produces **Paste some Tailwind classes first.**

The parser removes simple `className="..."` quoting, splits the remaining text on whitespace and checks each token against its supported patterns. The resulting declarations stay in token order. There is no attempt to sort properties, combine duplicates or decide which of two conflicting utilities should win.

## Utilities it recognises

The supported set includes:

- Display: `flex`, `inline-flex`, `grid`, `block`, `inline-block` and `hidden`.
- Flex direction: `flex-row`, `flex-col`, `flex-row-reverse` and `flex-col-reverse`.
- Wrapping: `flex-wrap`, `flex-nowrap` and `flex-wrap-reverse`.
- Alignment: common `items-*` and `justify-*` values.
- Spacing: `gap-*`, `p-*`, `px-*`, `py-*` and `m-*`.
- Radius: `rounded` with common named sizes or an arbitrary value.
- Background: `bg-*`.
- Text: known font-size names, known colour names or an arbitrary text value.
- Weight: `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold` and `font-black`.
- Shadow: `sm`, default, `md`, `lg`, `xl`, `2xl` and `none`.

Named spacing values use a lookup table spanning selected steps from `0` through `24`, including half steps such as `0.5`, `1.5` and `2.5`. A numeric value absent from that table receives a `px` suffix; other unmatched text is retained unless another rule handles it. Named colours cover only a small set: white, black, transparent, slate-900, blue-600, red-500, green-500 and gray-500.

## Worked example: the supplied class list

The default input is:

```html
flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-lg
```

Pressing **Convert to CSS** returns:

```css
display: flex;
align-items: center;
gap: 0.75rem;
border-radius: 0.75rem;
background-color: #2563eb;
padding-left: 1rem;
padding-right: 1rem;
padding-top: 0.5rem;
padding-bottom: 0.5rem;
color: #ffffff;
box-shadow: 0 10px 15px -3px rgba(15,23,42,.18);
```

The `px-4` token becomes separate left and right declarations, and `py-2` becomes top and bottom declarations. That makes the axis-specific padding explicit. The output still needs a selector before it can become a usable CSS rule.

<figure>
  <img src="/assets/img/blog/tailwind-to-css/example.svg" alt="The default Tailwind flex card classes beside their exact ordered CSS declarations and rem spacing values" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: gap-3 becomes 0.75rem, px-4 becomes one-rem side padding and shadow-lg becomes the converter's built-in literal value.</figcaption>
</figure>

## Output and supported formats

The **CSS** panel contains plain declarations. The main **Copy** action copies that text, and **Download** saves it as `tailwind-to-css.css`. The file does not include a selector, braces, media query or comment header.

Input is a pasted class list, not an HTML file or compiled stylesheet. The output is readable CSS text rather than a Tailwind configuration, Sass file or complete component.

Because declarations follow the class-token order, review duplicates before pasting. Two conflicting colour or display tokens will both be represented, and their order in the output does not by itself reproduce Tailwind's generated stylesheet order.

## Limits and edge cases

A custom theme is another reason to treat the output as illustrative. If the project changes its `blue-600` token or shadow scale, the converter still prints its built-in `#2563eb` and stored shadow literal. Use the generated CSS to understand the utility, then inspect the compiled stylesheet for exact project values.

Variants are a major boundary. Tokens prefixed with `md:`, `lg:`, `hover:`, `focus:`, `dark:` or similar selectors are not translated. Group and peer variants are also outside the parser. Removing the prefix yourself loses the condition, so restore it in CSS deliberately.

Many familiar utilities are unsupported, including directional margin such as `mx-*`, individual padding sides such as `pt-*`, width and height, borders, positioning, overflow, transforms and arbitrary multi-layer shadows. Tokens that do not match a supported pattern are silently skipped rather than reported as errors. Some recognised prefixes with unknown named values are printed raw, and an unknown shadow name can produce `box-shadow: undefined;`, so review the output instead of assuming every line is usable.

Arbitrary values need review. A simple token such as `gap-[12px]` is recognised, but the input is split on whitespace before parsing. Underscores in recognised arbitrary values are not consistently converted back to spaces. In addition, `text-[16px]` follows the text-colour branch and can become `color: 16px`, so inspect type-related arbitrary values carefully.

## Common mistakes

Do not assume every input class appears in the output. Compare the declaration list with the original tokens and look for missing properties. Do not treat the built-in colour and shadow tables as your project theme; a custom Tailwind configuration can produce different values.

Avoid wrapping arbitrary classes in quotes incorrectly. The parser handles simple class-attribute quoting, but nested template expressions, conditional class builders and escaped strings are not a supported input format.

Finally, do not delete a working Tailwind implementation based on this output alone. The converter is useful for explanation and drafting, but the project's generated CSS remains the reference for computed behaviour.

## Browser and privacy behaviour

Class parsing and declaration generation happen in the browser. There is no file upload or account requirement, and these modules do not save the class list in browser storage. **Reset** restores the supplied sample.

The page assets must load for the tool to run. Copying uses browser clipboard support and may require permission; if it fails, select the output manually. Downloaded CSS is local text and contains only the declarations you generated, not an uploaded file or external resource.

## A practical workflow

1. Paste one component's base class list rather than a page full of conditional classes.
2. Press **Convert to CSS** and compare the declarations with the input tokens.
3. Add a selector and any properties the converter skipped.
4. Recreate responsive, hover, focus and dark-mode conditions manually.
5. Replace built-in colour or shadow values when your Tailwind theme differs.
6. Use the project's compiled CSS as the final check before sharing the handoff.

<figure>
  <img src="/assets/img/blog/tailwind-to-css/workflow.svg" alt="A conversion workflow from base-class input through missing-property review to manual variant and theme restoration" width="1200" height="675" loading="lazy">
  <figcaption>Working order: inspect the base declarations first, then restore variants and theme-specific values that the token converter cannot infer.</figcaption>
</figure>

## Pre-export checklist

- Confirm that every important input class produced a declaration.
- Add a selector around the output before saving it as a rule.
- Check rem spacing and built-in colour values against your design tokens.
- Restore responsive and interaction conditions manually.
- Inspect arbitrary values, especially text sizes and multi-part shadows.
- Compare the result with the project's compiled Tailwind CSS before relying on it.
