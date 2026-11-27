---
title: "Tailwind button generator: style, preview and export"
description: "Create a button style with exact colour, padding, radius and weight controls, then copy Tailwind classes or CSS while knowing what still needs adding."
date: 2026-11-27
categories:
  - Tailwind
cover: assets/img/blog/tailwind-button-generator/hero.svg
coverAlt: "A teal call-to-action button with spacing, corner radius and font-weight annotations"
coverCaption: "A good button starts with clear geometry and still needs deliberate interaction states."
takeaways:
  - "Defaults use blue, white text, 20 by 12 pixels of padding, a 12-pixel radius and semibold text."
  - "Button text changes the preview only; it is not included in the copied code or downloaded CSS."
  - "Tailwind output omits the inline-flex and centring classes that are present in the CSS output."
  - "Add shadow uses the named shadow-lg class but a custom literal shadow in the CSS export."
  - "Hover, focus, active, disabled and responsive states must be added in the component."
faq:
  - q: "Does the generator output button HTML?"
    a: "No. It outputs a Tailwind class list and CSS declarations. The label appears in the preview, but the main Copy action and button.css download do not include an HTML button element."
  - q: "Why should I add inline-flex and centring classes in Tailwind?"
    a: "The CSS export includes display inline-flex, align-items center and justify-content center. The Tailwind string does not. Add inline-flex items-center justify-center when you want the Tailwind version to match that layout."
  - q: "Is Add shadow identical in Tailwind and CSS?"
    a: "The Tailwind output uses shadow-lg. The CSS output writes 0 10px 15px -3px rgba(15,23,42,.18). Review both in your project rather than assuming the named utility and literal declaration are byte-for-byte equivalent."
  - q: "Can I define hover and focus styles here?"
    a: "No. The controls cover base colours, padding, radius, font weight and an optional shadow. Interaction, focus-visible, disabled, loading and responsive variants need to be added separately."
draft: false
---

A button can look polished in a preview and still be incomplete in code: the layout classes are missing, the label was never exported, or the focus state was left to the browser. The [Tailwind CSS Button Generator](/tailwind-button-generator/) makes the base visual style quick to adjust and gives you both Tailwind and CSS output.

Use it to establish colour, spacing, corner radius, weight and an optional shadow. Treat the result as a base style rather than a finished accessible component. The tool does not create markup or interaction states, so a production implementation still needs a deliberate `<button>`, focus treatment and any variants your interface requires.

## What the workspace previews

The **Button style** panel contains a text field, two colour pickers, three numeric spacing controls, a weight menu and a shadow checkbox. The **Button preview and code** panel shows the labelled button on a light background followed by separate **Tailwind** and **CSS** blocks.

Changes update automatically. **Generate button** reruns the operation manually, while **Reset** restores every default. The preview inherits the selected colours, dimensions, radius, weight and shadow, but it does not demonstrate hover, keyboard focus, disabled or loading behaviour.

## Exact controls and defaults

The default button is labelled **Get started** and uses:

- **Background:** `#2563eb`.
- **Text colour:** `#ffffff`.
- **Horizontal padding:** 20 pixels, with a configured range of 0 to 64.
- **Vertical padding:** 12 pixels, with a configured range of 0 to 40.
- **Corner radius:** 12 pixels, with a configured range of 0 to 40.
- **Font weight:** **Semibold**, value `600`.
- **Add shadow:** checked.

The weight menu offers **Normal** (400), **Medium** (500), **Semibold** (600) and **Bold** (700). These are the only weight choices. Padding and radius are independent pixel values; there is no automatic size preset that adjusts them together.

The text field changes the visible label and is escaped before it enters the preview. It does not flow into the generated code. If you need a specific label, keep it in your component markup or template rather than expecting the export to contain it.

## Worked example: a compact teal action

Suppose a pricing card needs a firm, compact call to action. Enter:

1. **Button text:** `Book a demo`.
2. **Background:** `#0f766e`.
3. **Text colour:** `#ffffff`.
4. **Horizontal padding:** 24.
5. **Vertical padding:** 12.
6. **Corner radius:** 10.
7. **Font weight:** **Bold**.
8. Leave **Add shadow** checked.

The Tailwind output is:

```html
px-[24px] py-[12px] rounded-[10px] bg-[#0f766e] text-[#ffffff] font-700 shadow-lg
```

The CSS output is:

```css
display: inline-flex;
align-items: center;
justify-content: center;
padding: 12px 24px;
border-radius: 10px;
background: #0f766e;
color: #ffffff;
font-weight: 700;
box-shadow: 0 10px 15px -3px rgba(15,23,42,.18);
```

For a Tailwind implementation that follows the same layout, add `inline-flex items-center justify-center` to the generated class list. Then add your own hover, focus-visible and disabled variants around that base.

<figure>
  <img src="/assets/img/blog/tailwind-button-generator/example.svg" alt="A teal Book a demo button with labelled 24-pixel horizontal padding, 12-pixel vertical padding and a 10-pixel radius" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: the teal base style uses 24 by 12 pixels of padding, a 10-pixel radius, bold text and the optional shadow.</figcaption>
</figure>

## Output and supported formats

The result panel gives each format its own inline **Copy** button. The main **Copy** action combines the Tailwind class list and CSS declarations in that order. Neither form contains HTML, a selector or the button label.

**Download** saves `button.css`. It contains the CSS declarations only, including `display: inline-flex` and the centring properties. Add a class selector or place the declarations in your component's styling system as appropriate.

The Tailwind export uses arbitrary values for pixel padding, radius and colours, plus `font-700` and optionally `shadow-lg`. Keep the full class list when pasting. The CSS export writes equivalent base values directly, but its shadow is a literal custom declaration rather than the text of a Tailwind preset.

## Limits and edge cases

There is no markup export, so the preview's `<button>` does not tell you what `type`, name, value, ARIA attributes or event handling your component should use. In a form, remember that a button without an explicit type can submit by default; set that deliberately in your implementation.

The tool has no hover, active, focus-visible, disabled, loading, icon, border, outline, letter-spacing, transition or full-width control. It also does not adapt padding or label size at breakpoints. Very long labels can make the preview cramped, while zero padding or radius can produce an intentionally sharp result that still needs usability review.

The generator emits numeric weight classes such as `font-600` and `font-700` literally. Verify them against your Tailwind setup: default Tailwind uses named weight utilities, and a numeric arbitrary weight normally needs a form such as `font-[700]`. The preview can look correct even when a copied class does not compile.

The colour pickers provide opaque colours. There is no separate text-opacity or background-opacity control, and the tool does not measure contrast between the selected foreground and background.

## Common mistakes

The biggest mismatch is copying the Tailwind classes without adding layout. The CSS version centres content; the Tailwind version currently does not include those three classes. Another is expecting the label to appear in the export when only the preview contains it.

Do not assume `shadow-lg` exactly reproduces the custom CSS shadow. Review the result in the project's Tailwind theme. Avoid treating a default browser focus ring as a complete focus design, and avoid changing colour alone to communicate hover or disabled state without checking legibility.

## Browser and privacy behaviour

The preview and both exports are generated locally in the tab. There is no upload or account step, and these modules do not save the settings in browser storage. **Reset** returns the fields to their defaults; reloading has the same practical effect for this workspace.

The page and scripts must load before the controls run. Copying depends on browser clipboard support and permission, with manual copying as a fallback. The CSS download is a local file and does not include the label or any form data.

## A practical workflow

1. Set the label so the preview reflects realistic text length.
2. Choose foreground and background colours, then check their contrast in your project.
3. Tune vertical and horizontal padding separately before increasing the radius.
4. Select a weight and decide whether the shadow supports the surface rather than overpowering it.
5. Copy the base style, add the missing layout and interaction classes, and write the actual button markup with an explicit type.

<figure>
  <img src="/assets/img/blog/tailwind-button-generator/workflow.svg" alt="A button workflow from label and colour selection through padding and radius to markup, focus and disabled-state checks" width="1200" height="675" loading="lazy">
  <figcaption>Working order: generate the base visual style, then complete the markup, layout and interaction states in the component.</figcaption>
</figure>

## Pre-export checklist

- Check the label length in the preview, then place the real label in markup.
- Verify foreground and background contrast on the intended surface.
- Confirm horizontal padding, vertical padding and radius independently.
- Add `inline-flex items-center justify-center` when using the Tailwind output.
- Add explicit button type, focus-visible, hover, active and disabled behaviour.
- Review the shadow in the actual project theme rather than assuming preset equivalence.
