---
title: "Tailwind shadow generator: build a layered elevation effect"
description: "Tune offsets, blur, spread and opacity, then copy a two-layer Tailwind shadow or CSS declaration with a practical worked example."
date: 2026-11-27
categories:
  - Tailwind
cover: assets/img/blog/tailwind-shadow-generator/hero.svg
coverAlt: "Layered interface cards casting soft blue-grey shadows on a light workspace"
coverCaption: "Elevation comes from several coordinated values, not blur alone."
takeaways:
  - "Every generated shadow contains a primary layer and a softer ambient layer."
  - "The default colour is dark slate, with 25 percent opacity, 24 pixels of blur and a negative eight-pixel spread."
  - "Inset shadow applies to both generated layers rather than only the primary one."
  - "Copy includes Tailwind and CSS, while Download saves the declaration as shadow.css."
  - "The preview card is white, so dark surfaces and textured backgrounds still need a separate check."
faq:
  - q: "Why does the output contain two shadows?"
    a: "The generator creates a primary shadow from your settings and an ambient shadow using rounded half-values for offsets, blur and spread. The ambient layer uses half the opacity. Together they give the effect more depth than a single copied value."
  - q: "What does Spread change?"
    a: "Positive spread expands the shadow shape before blur is applied; negative spread pulls it inward. It is separate from Blur, which controls how softly the edge fades. Blur ranges from 0 to 100, while offsets and spread range from -50 to 50."
  - q: "Can I create a coloured glow or transparent shadow colour?"
    a: "You can choose any opaque shadow colour and control its opacity separately. A bright colour can produce a glow-like effect, but there is no direct alpha input for the colour itself. The generated layers share the selected RGB colour."
  - q: "Will the white preview show how the shadow looks on a dark card?"
    a: "No. The preview surface is fixed to white. Export the result and test it on the actual light, dark or coloured surface, because background colour changes how visible the shadow appears."
draft: false
---

A shadow that looks convincing in a design file often fails after implementation because one value was copied incorrectly or the softer second layer was lost. The [Tailwind CSS Shadow Generator](/tailwind-shadow-generator/) produces a complete two-layer value while you adjust the controls, which makes the relationship between offset, blur and spread easier to inspect.

Use it for cards, popovers, dialogs and raised buttons when you need a custom shadow rather than a named Tailwind preset. It is a focused styling tool: it does not manage stacking order, responsive elevation or interaction states, and its white preview cannot represent every production surface.

## How the two-layer shadow works

The **Shadow settings** panel feeds a **Shadow code** panel. Output updates automatically as you move a slider or change a checkbox, and **Generate shadow** can run it again manually. **Reset** returns all values to their defaults.

The first layer uses your horizontal offset, vertical offset, blur, spread, colour and opacity directly. The second, ambient layer rounds the offsets, blur and spread to roughly half their values and uses half the opacity. That means the final value is not just one shadow with a blur adjustment; it is a pair of coordinated declarations inside a single `box-shadow` property.

This structure is helpful when a single hard layer looks pasted on. It also means changing one slider affects two layers in different proportions.

## Exact controls and defaults

The starting configuration is:

- **Shadow colour:** `#0f172a`.
- **Opacity:** 25, ranging from 0 to 100 in steps of 1.
- **Blur:** 24, ranging from 0 to 100 in steps of 1.
- **Horizontal offset:** 0, ranging from -50 to 50.
- **Vertical offset:** 16, ranging from -50 to 50.
- **Spread:** -8, ranging from -50 to 50.
- **Inset shadow:** unchecked.

Positive horizontal values move the shadow right; positive vertical values move it down. Negative spread tightens the shadow, while positive spread expands it. With the defaults, the primary layer is `0px 16px 24px -8px` and the ambient layer is `0px 8px 12px -4px`, both using the selected dark slate colour.

Opacity is converted to a decimal and displayed to two places. The primary layer uses that value; the ambient layer uses half of it. At 25 percent, those values are `0.25` and `0.13` respectively.

## Worked example: a restrained raised card

Imagine a light card that needs visible separation without a heavy border. Enter these settings:

1. Keep **Shadow colour** at `#0f172a`.
2. Set **Opacity** to 40.
3. Set **Blur** to 32.
4. Set **Horizontal offset** to 4.
5. Set **Vertical offset** to 12.
6. Set **Spread** to -6.
7. Leave **Inset shadow** unchecked.

The resulting CSS is:

```css
box-shadow: 0px 4px 32px -6px rgba(15, 23, 42, 0.40), 2px 6px 16px -3px rgba(15, 23, 42, 0.20);
```

The matching Tailwind arbitrary value is:

```html
shadow-[0px_4px_32px_-6px_rgba(15,_23,_42,_0.40),2px_6px_16px_-3px_rgba(15,_23,_42,_0.20)]
```

The ambient layer keeps the same direction as the primary layer but uses smaller geometry and lower opacity. If the card feels too heavy, reduce opacity before increasing blur; that changes visibility without making the shadow excessively diffuse.

<figure>
  <img src="/assets/img/blog/tailwind-shadow-generator/example.svg" alt="A white card with a four-pixel offset shadow and a labelled breakdown of its primary and ambient layers" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: a 40 percent primary layer and a 20 percent ambient layer share one colour but use different offsets, blur and spread.</figcaption>
</figure>

## Output and supported formats

The result panel shows the white preview card plus separate **Tailwind** and **CSS** blocks. Each has an inline **Copy** button. The main **Copy** action combines both outputs, with the Tailwind class first and the CSS declaration second.

**Download** saves `shadow.css`, containing only the `box-shadow` declaration. Add the appropriate selector yourself. There is no standalone HTML export and no named preset selection in this tool.

The Tailwind form replaces spaces inside the arbitrary value with underscores. Keep those underscores when moving the class into JSX, HTML or a template. The CSS form is already valid declaration syntax and can be pasted into a rule or an inline style where your project permits it.

## Limits and edge cases

There is one generated shadow pair, not an editable list of arbitrary layers. You cannot independently change the ambient layer, add a third shadow or specify separate colours through the controls. Manual edits after export are possible, but the preview will not validate them.

The slider ranges cover -50 to 50 pixels for offsets and spread, and 0 to 100 for blur and opacity percentages. The operation formats the supplied numbers directly rather than converting units, so think in pixels when comparing the preview with your layout.

**Inset shadow** prefixes both layers with `inset`. That can create a strong combined inner effect, especially when spread is negative. Check it at the intended border radius and on the actual background. The generator does not add a border or compensate for the space an inset shadow occupies.

## Common mistakes

Do not paste the Tailwind class into a CSS file or treat the downloaded declaration as a complete rule. Do not assume `shadow-lg` and this arbitrary output are interchangeable: the generator has its own two-layer values.

A large blur cannot fully hide a large offset. If the shadow points too far away from the card, adjust horizontal or vertical offset first. Also avoid stacking a second box shadow from another class without checking which declaration wins in the cascade.

Finally, remember that the preview is a fixed white card. A dark shadow may disappear on a dark surface or look muddy over a coloured panel even though the generated numbers are reasonable.

## Browser and privacy behaviour

All colour conversion and shadow calculations run in the page using browser JavaScript. There is no file input, upload step or account requirement, and these modules do not persist the settings in browser storage. **Reset** and reloading return the workspace to its defaults.

The page assets must load before the controls work. Copying uses the browser clipboard, which may require permission; manual selection is the fallback. The downloaded `shadow.css` is created locally and should be reviewed before it is merged into a component stylesheet.

## A practical workflow

1. Begin with a small spread and a vertical offset that matches the interface's visual language.
2. Set blur and opacity together instead of maximising either one immediately.
3. Compare the two-layer result with a flat border or no shadow at all.
4. Copy one output format and apply it to a real component with its final border radius.
5. Check light and dark themes, keyboard focus states and any hover transition that also changes the shadow.

<figure>
  <img src="/assets/img/blog/tailwind-shadow-generator/workflow.svg" alt="A workflow moving from offset and spread through blur and opacity to real-component checks in light and dark themes" width="1200" height="675" loading="lazy">
  <figcaption>Working order: establish the shadow geometry, tune its visibility, then test the final surface rather than relying on the white preview.</figcaption>
</figure>

## Pre-export checklist

- Confirm both generated layers are present in the copied value.
- Check the sign and size of horizontal offset, vertical offset and spread.
- Compare primary and ambient opacity instead of expecting a single uniform opacity.
- Decide whether both layers should be inset.
- Add a selector or component class around the CSS declaration.
- Test the effect on the real background, not only the white preview card.
