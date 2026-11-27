---
title: "Tailwind gradients: from colour picks to copyable code"
description: "Build linear, radial and conic gradients with exact controls, a worked example, export formats and practical checks for Tailwind projects."
date: 2026-11-27
categories:
  - Tailwind
cover: assets/img/blog/tailwind-gradient-generator/hero.svg
coverAlt: "Three colourful gradient bands flowing across a dark interface grid"
coverCaption: "A gradient is simple code, but its direction and stop order decide whether it supports the content."
takeaways:
  - "Choose linear, radial or conic output, then set three colour pickers and one of eight directions."
  - "Include middle colour is enabled by default and adds the via stop only while it remains checked."
  - "The default gradient runs from indigo through purple to pink at 135 degrees."
  - "Copy returns Tailwind and CSS together, while Download saves only gradient.css."
  - "There are no stop-position, size or alpha controls, so complex gradients still need manual edits."
faq:
  - q: "How do linear, radial and conic gradients differ?"
    a: "A linear gradient changes colour along an angle. A radial gradient changes colour outward from a calculated circle position. A conic gradient arranges colour around a point, starting at the selected direction. The same three colour stops feed all three modes."
  - q: "Can I add transparent colours or exact stop positions?"
    a: "Not through the controls. The colour inputs produce opaque HEX values, and each stop is placed automatically. You can edit the copied CSS or Tailwind arbitrary value by hand, but the on-page preview will not reflect those manual changes."
  - q: "Does the tool generate responsive gradient classes?"
    a: "No. It returns one background declaration or one arbitrary Tailwind class. Add breakpoint or state variants in your project after export, and test the resulting cascade rather than assuming the generated class changes at a screen size."
  - q: "Are the chosen colours uploaded?"
    a: "The gradient operation runs in the browser and does not send the field values to a conversion endpoint. The page and its scripts still need to load, and copying or downloading uses normal browser permissions and local files."
draft: false
---

A gradient can give a hero, button or empty state depth without adding another image, but retyping stop order and direction in two places invites mistakes. The [Tailwind and CSS Gradient Generator](/tailwind-gradient-generator/) keeps the swatch and both code forms together, so you can adjust the visual result before moving it into a component.

It is best for straightforward backgrounds built from two or three solid colours. Use it when you know the mood and direction but do not want to hand-write arbitrary-value syntax. For layered meshes, image overlays, transparent stops or precise colour-stop positions, treat its output as a starting point and finish the CSS in your editor.

## What the generator actually builds

The workspace has a **Gradient colours** panel and a **Gradient code** panel. Changing a colour, type, direction or the middle-colour checkbox refreshes the result automatically; the **Generate gradient** button is also available. **Reset** restores the original fields.

For a linear gradient, the direction is a CSS angle and the colours are emitted in `from, via, to` order. Radial output uses a circle centred at a position calculated from that same angle. Conic output uses `from <direction>` and arranges the stops around that centre. There is one background preview, not separate previews for each type.

That makes the tool useful during early component design: compare directions quickly, decide whether the middle stop helps, then copy the version you intend to implement. It does not decide which colours will remain readable over the gradient.

<figure>
  <img src="/assets/img/blog/tailwind-gradient-generator/example.svg" alt="A three-stop indigo, violet and rose gradient beside its matching CSS and Tailwind arbitrary class" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: a 135-degree linear gradient moves from dark indigo through blue to amber, with the same stop order in CSS and Tailwind.</figcaption>
</figure>

## Controls and defaults

The exact defaults produce a familiar indigo-to-pink blend:

- **From colour:** `#6366f1`.
- **Via colour:** `#a855f7`.
- **To colour:** `#ec4899`.
- **Gradient type:** **Linear**.
- **Direction:** **135deg**, labelled **To bottom right**.
- **Include middle colour:** checked.

The direction menu offers 0, 45, 90, 135, 180, 225, 270 and 315 degrees. Their labels run from **To top** through **To bottom right** to **To top left**. These are fixed choices, not a free-entry angle field.

When **Include middle colour** is unchecked, the via value is ignored and the result contains only the from and to stops. Checking it again restores the middle stop. All three pickers remain visible either way, which is useful when you are comparing a two-stop gradient with a three-stop version.

## A concrete gradient example

Suppose a dark landing-page hero needs a restrained accent rather than the default purple-pink blend. Set these fields:

1. **From colour** to `#0f172a`.
2. **Via colour** to `#2563eb`.
3. **To colour** to `#f59e0b`.
4. Keep **Gradient type** on **Linear**.
5. Keep **Direction** at **135deg** and leave **Include middle colour** checked.

The CSS output is:

```css
background: linear-gradient(135deg, #0f172a, #2563eb, #f59e0b);
```

The matching Tailwind output is:

```html
bg-[linear-gradient(135deg,#0f172a,#2563eb,#f59e0b)]
```

This is a useful check of direction. In CSS, 0 degrees points upward and 90 degrees points right, so 135 degrees travels toward the lower-right. Put light text over this example only after checking the actual area behind it; the amber stop can make a single contrast decision unreliable.

## Reading and exporting the output

The result panel shows a live swatch plus separate **Tailwind** and **CSS** blocks. Each block has its own **Copy** button. The main **Copy** action combines both blocks in Tailwind-then-CSS order, so paste carefully if you only need one format.

**Download** creates `gradient.css`. It contains the CSS `background` declaration, not the Tailwind class and not a complete stylesheet. Rename or merge the file appropriately when it reaches your project.

Tailwind output is an arbitrary background value. Spaces inside the value are converted to underscores where required by the class syntax. The CSS version uses normal declaration spacing and ends with a semicolon. Neither export includes a selector, browser fallback or custom-property wrapper.

## Limits and edge cases

The controls cover colour, type, direction and optional middle stop. They do not expose alpha transparency, stop percentages, gradient size, repeating gradients or multiple background layers. A colour picker value such as `#2563eb80` cannot be entered through this field and reproduced by the preview.

Radial direction is not a CSS radial-angle control. The generator converts the selected angle into `circle at x% y%`, moving the centre around the box. Conic direction controls where the colour sequence starts. These are useful approximations, but they are not a full radial or conic positioning editor.

Also check the final surface. A gradient that looks balanced in a wide swatch can collapse into a narrow strip on a button or phone header. The generated code does not respond to container dimensions by itself.

## Common mistakes to avoid

The first mistake is assuming the default via stop disappears when its picker changes. It disappears only when **Include middle colour** is unchecked. The second is copying both output blocks into a stylesheet: the Tailwind line is a class value, not CSS.

Do not confuse the conic starting angle with the linear travel direction. They use related numbers but describe different arrangements. Finally, avoid stacking the exported `background` shorthand after a more specific background image without checking the cascade; the shorthand can replace other background properties rather than merely adding colour.

## Browser and privacy behaviour

Gradient calculations, swatch rendering and code generation happen locally in the current tab. There is no file upload or account step, and these modules do not save the chosen colours in browser storage. Reloading or pressing **Reset** returns the fields to their defaults.

The page and its JavaScript assets must be available for the workspace to run. Clipboard access can depend on browser permission; if copying fails, select the displayed code and copy it manually. Downloaded CSS is an ordinary local file, so handle it like any other project asset.

## A practical workflow

1. Start with the default three colours and choose the gradient type before tuning individual stops.
2. Set the direction, then judge the transition at the aspect ratio of the real component.
3. Toggle **Include middle colour** and keep it only if the extra stop improves the transition.
4. Copy one format, not both, and apply it to a representative element in your project.
5. Check text contrast, narrow screens, hover states and any existing background rules before committing the result.

<figure>
  <img src="/assets/img/blog/tailwind-gradient-generator/workflow.svg" alt="A five-step flow from gradient type and direction through stop tuning, code export and component contrast checks" width="1200" height="675" loading="lazy">
  <figcaption>Working order: choose the geometry first, tune the stops second, then verify the exported class against the component that will use it.</figcaption>
</figure>

## Pre-export checklist

- Confirm **Linear**, **Radial** or **Conic** matches the intended visual effect.
- Check the eight-step direction menu rather than assuming CSS angle conventions.
- Verify whether the middle stop is included.
- Copy only the needed format and keep the CSS declaration inside a selector.
- Test the gradient on its real surface, especially where text crosses light and dark stops.
- Add responsive or state variants separately when the component needs them.
