---
title: "Tailwind Flexbox generator: align a layout visually"
description: "Set direction, justification, alignment, wrapping, gap and preview items, then copy exact Tailwind classes or CSS for a flex container."
date: 2026-11-27
categories:
  - Tailwind
cover: assets/img/blog/tailwind-flexbox-generator/hero.svg
coverAlt: "Three flex items arranged between start and end with centred alignment and visible gap spacing"
coverCaption: "Flex alignment becomes clearer when direction, main-axis distribution and cross-axis alignment are considered separately."
takeaways:
  - "Defaults are row direction, start justification, centre alignment, wrapping and a 12-pixel gap."
  - "The preview shows two to six items, but those items are not included in the exported code."
  - "Justify content distributes space along the main axis, while Align items controls the cross axis."
  - "Copy combines Tailwind and CSS, while Download saves only flex.css."
  - "There are no controls for flex grow, shrink, basis, order or align-content."
faq:
  - q: "What is the difference between Justify content and Align items?"
    a: "Justify content distributes items along the main axis, which is horizontal in a row and vertical in a column. Align items positions them on the cross axis. Their apparent left, right, top and bottom effects change when you reverse the direction."
  - q: "Does Preview items change my exported layout?"
    a: "It changes only the number of chips shown in the on-page preview. The Tailwind and CSS output contain container properties, not those chips or any item count."
  - q: "Can I set flex-1 on an item here?"
    a: "No. The generator controls the flex container only. Add flex-grow, flex-shrink, flex-basis, ordering or item-level alignment classes in your component after export."
  - q: "Why might Wrap reverse look unexpected?"
    a: "Wrap reverse reverses the cross-axis direction of the flex lines. Its visible effect depends on the container's direction, height and alignment. Test it with real content because the small preview is only an approximation."
draft: false
---

Flexbox problems often come from mixing up the main axis with the cross axis, not from remembering property names. The [Tailwind Flexbox Generator](/tailwind-flexbox-generator/) lets you set the container behaviour and watch a small group of items respond before you copy the classes.

Use it for navigation bars, toolbars, button groups, media rows and simple centred stacks. It is a container-layout tool: item sizing, ordering and responsive variants still belong in your component. The numbered preview is useful for comparing settings, but it cannot predict how long labels, images or nested controls will behave.

## Reading the flex preview

The **Flex layout** panel contains six controls. The **Flex preview and code** panel renders two to six labelled chips inside a bordered flex area with a minimum height of 160 pixels, then shows separate **Tailwind** and **CSS** blocks.

The workspace updates automatically. **Generate flex layout** is available for a manual run, and **Reset** restores all defaults. Each preview chip has the same general styling, so the preview isolates container behaviour rather than demonstrating differences in item width or typography.

Remember that `justify-*` follows the main axis. In a row it moves items horizontally; in a column it moves them vertically. `items-*` works on the cross axis and therefore changes sides when you switch between row and column layouts.

## Exact controls and defaults

The default configuration is:

- **Direction:** **Row**.
- **Justify content:** **Start**.
- **Align items:** **Center**.
- **Wrap:** **Wrap**.
- **Gap (px):** 12, with a configured range of 0 to 64.
- **Preview items:** 3, with a configured range of 2 to 6.

**Direction** offers Row, Row reverse, Column and Column reverse. **Justify content** offers Start, Center, End, Space between, Space around and Space evenly. **Align items** offers Start, Center, End, Stretch and Baseline.

**Wrap** offers No wrap, Wrap and Wrap reverse. The generator maps the selected values to `flex-nowrap`, `flex-wrap` or `flex-wrap-reverse`, and writes the corresponding `flex-wrap` declaration into CSS.

## Worked example: a three-part navigation row

Suppose a compact navigation bar has a brand, links and an action that should sit at opposite ends while remaining vertically centred. Set:

1. **Direction:** Row.
2. **Justify content:** Space between.
3. **Align items:** Center.
4. **Wrap:** Wrap.
5. **Gap (px):** 12.
6. **Preview items:** 3.

The Tailwind output is:

```html
flex flex-row justify-between items-center flex-wrap gap-[12px]
```

The CSS output is:

```css
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
flex-wrap: wrap;
gap: 12px;
```

Apply these classes or declarations to the navigation container, not to each link. With wrapping enabled, `space-between` distributes items on each flex line, so a wrapped third item may not stay at the far right of a new line. Check the narrow-screen arrangement rather than assuming the three-item desktop pattern survives unchanged.

<figure>
  <img src="/assets/img/blog/tailwind-flexbox-generator/example.svg" alt="A three-item navigation row using space-between, centred alignment, wrapping and a 12-pixel gap" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: a wrapping row centres its items on the cross axis and uses space-between along the main axis with a 12-pixel gap.</figcaption>
</figure>

## Output and supported formats

Each output block has an inline **Copy** button. The main **Copy** action combines the Tailwind class list and the CSS declarations, while **Download** creates `flex.css` containing only the CSS.

There is no HTML export. The preview chips are generated for display and are not part of `copyText` or the downloaded file. You will need to write the container element and its children in your project.

The Tailwind string always starts with `flex` and includes explicit direction, justification, alignment, wrap and arbitrary pixel-gap classes. The CSS version uses ordinary property names and values. Neither output includes a selector, responsive prefix or state variant.

## Limits and edge cases

The generator controls the flex container, not individual items. It has no settings for `flex-grow`, `flex-shrink`, `flex-basis`, `order`, `align-self` or `align-content`. If one item must fill remaining space while others stay compact, add item-level classes after export.

`Baseline` alignment depends on the items sharing a useful text baseline. Chips in the preview may show the effect clearly, while buttons, images and mixed content can align differently in production. `Stretch` also depends on item sizing and cross-size constraints that the preview does not model.

Wrapping is controlled, but there is no container width, height or breakpoint setting. The preview's minimum height is a display aid, not a generated CSS value. Long content can wrap, overflow or shrink differently once real items are inserted.

## Common mistakes

Do not apply `justify-between` when you actually need `items-center`; they solve different axes. Do not change direction without reconsidering both alignment controls. Reversing a row or column also changes how start and end appear.

Avoid treating `gap` as a complete substitute for margins in every legacy layout. The generated CSS uses the modern `gap` property, so check the browsers required by your project. Also avoid copying the preview item count into production code as if it were a configuration value; it only affects the demonstration.

## Browser and privacy behaviour

Flexbox calculations and preview rendering run locally in the page. There is no upload or account step, and these modules do not save the selected values in browser storage. **Reset** restores row, start, centre, wrap, 12-pixel gap and three items.

The page and JavaScript assets must load for the workspace to operate. Copying may require clipboard permission, with manual selection as a fallback. The downloaded `flex.css` is a local declaration file and contains no item content.

## A practical workflow

1. Choose direction first, then identify the main and cross axes for that direction.
2. Set alignment and justification with those axes in mind.
3. Decide whether wrapping is appropriate for the narrowest expected container.
4. Tune the gap after the distribution mode, because both affect perceived separation.
5. Export the container styles and add item-level sizing, ordering and responsive classes in the component.
6. Test with real labels, icons and images at more than one viewport width.

<figure>
  <img src="/assets/img/blog/tailwind-flexbox-generator/workflow.svg" alt="A flex workflow showing direction selection, main and cross-axis checks, gap tuning and real-content testing" width="1200" height="675" loading="lazy">
  <figcaption>Working order: establish direction, align on the correct axes, then add the item-level and responsive rules that the preview does not export.</figcaption>
</figure>

## Pre-export checklist

- Confirm the direction and reconsider start/end after any reversal.
- Check justification on the main axis and alignment on the cross axis.
- Choose No wrap, Wrap or Wrap reverse deliberately.
- Set the gap in pixels and verify it on the real container.
- Add item-level grow, shrink, basis, order or self-alignment where needed.
- Test wrapping and overflow with actual content on narrow screens.
