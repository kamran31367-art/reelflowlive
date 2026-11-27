---
title: "Tailwind grid generator: exact columns, rows and gaps"
description: "Build a fixed grid, set independent row and column gaps, choose a Tailwind breakpoint prefix and export matching CSS with a worked example."
date: 2026-11-27
categories:
  - Tailwind
cover: assets/img/blog/tailwind-grid-generator/hero.svg
coverAlt: "An eight-cell dashboard grid with labelled columns, rows and separate horizontal and vertical gaps"
coverCaption: "A useful grid definition makes both the track count and the spacing explicit."
takeaways:
  - "Defaults are three columns, two rows and a 16-pixel gap, with Fixed responsive behaviour."
  - "Blank column and row overrides inherit the main gap, while a zero override is respected."
  - "CSS export always uses repeat with minmax zero and one fraction for every track."
  - "The responsive menu prefixes Tailwind columns, rows and gap classes, but adds no CSS media query."
  - "There are no auto-fit, spanning, named-area or item-placement controls."
faq:
  - q: "Does choosing md make the downloaded CSS responsive?"
    a: "No. The selected breakpoint is added to the Tailwind classes only. The CSS download contains fixed grid declarations without a media query, so responsiveness must be handled separately in CSS."
  - q: "What happens when a gap override is left blank?"
    a: "The generator uses the main Gap value for that axis. Entering zero is different from leaving the field blank: zero becomes a zero-pixel gap, while blank inherits the shared gap."
  - q: "Can I create an auto-fitting or masonry-style grid?"
    a: "No. The tool generates a fixed number of equal columns and rows. It does not expose auto-fit, auto-fill, min-content, masonry behaviour or variable track sizes."
  - q: "Why does a breakpoint appear on the row classes too?"
    a: "The implementation adds the selected prefix to grid-cols, grid-rows and both gap classes. That is the current behaviour even though the control is labelled Responsive columns. Review the complete class string before using it."
draft: false
---

Rebuilding the same card layout by hand usually means counting tracks, checking gap shorthand and then translating everything into Tailwind classes. The [Tailwind CSS Grid Generator](/tailwind-grid-generator/) gives you one place to define columns, rows and independent gaps, with a numbered cell preview and two export formats.

It suits fixed layouts such as dashboards, image groups, feature tiles and form sections. Choose it when the required track count is known. If the number of columns should adapt automatically to available width, or cards need different spans, the generated equal-track grid will not express that design without further work.

## What the preview represents

The **Grid layout** panel contains the track and spacing controls. The **Grid code** panel renders one numbered cell for every column-row intersection, then shows separate **Tailwind** and **CSS** blocks. Changes run automatically, and **Generate grid** is available as a manual action. **Reset** restores the defaults.

The preview uses equal fractional columns and fixed 58-pixel rows. The exported CSS uses equal fractional rows as well, so the preview communicates arrangement rather than final vertical sizing. Add height, alignment or content-driven sizing in your component after export.

## Exact controls and defaults

The default configuration is:

- **Columns:** 3, with a configured range of 1 to 12.
- **Rows:** 2, with a configured range of 1 to 12.
- **Gap (px):** 16, with a configured range of 0 to 100.
- **Column gap override (px):** blank, with a configured range of 0 to 100.
- **Row gap override (px):** blank, with a configured range of 0 to 100.
- **Responsive columns:** **Fixed**, with alternatives **sm and up**, **md and up** and **lg and up**.

Blank overrides are intentional. The column gap and row gap each fall back to the main **Gap (px)** value. Entering `0` in an override is not treated as blank; it produces a zero-pixel gap on that axis. This lets you create a grid with vertical spacing but no horizontal spacing, or the reverse.

The maximum configured layout is 12 by 12, which produces 144 numbered preview cells. Smaller layouts are easier to inspect and usually sufficient for component work.

## Worked example: a four-column dashboard strip

Suppose a dashboard needs four equal statistic cards on medium screens and above, with slightly wider horizontal gutters than row spacing. Set:

1. **Columns** to 4.
2. **Rows** to 2.
3. **Gap (px)** to 16.
4. **Column gap override (px)** to 24.
5. **Row gap override (px)** to 12.
6. **Responsive columns** to **md and up**.

The Tailwind output is:

```html
grid md:grid-cols-4 md:grid-rows-2 gap-x-[24px] gap-y-[12px]
```

The CSS output is:

```css
display: grid;
grid-template-columns: repeat(4, minmax(0, 1fr));
grid-template-rows: repeat(2, minmax(0, 1fr));
column-gap: 24px;
row-gap: 12px;
```

The eight preview cells correspond to four columns across two rows. Notice that the breakpoint appears on every track class, not only `grid-cols-4`. Without a base `grid-cols-*` rule elsewhere, the grid has no explicit column count below the selected breakpoint.

<figure>
  <img src="/assets/img/blog/tailwind-grid-generator/example.svg" alt="Four columns and two rows of numbered dashboard cells with 24-pixel column gaps and 12-pixel row gaps" width="1200" height="675" loading="lazy">
  <figcaption>Worked example: four equal columns, two equal rows, a 24-pixel horizontal gap and a 12-pixel vertical gap, prefixed with md in Tailwind.</figcaption>
</figure>

## Output and supported formats

The **Tailwind** block uses `grid`, prefixed `grid-cols-*` and `grid-rows-*` classes when selected, and arbitrary pixel values for the two gaps. The main **Copy** action combines the Tailwind line and the CSS block.

**Download** saves `grid.css`. That file contains fixed CSS declarations and no selector or media query. If you chose a responsive Tailwind option, the breakpoint is still absent from the CSS download.

Both exports use `minmax(0, 1fr)` for the CSS tracks. The zero minimum helps prevent oversized content from forcing a track wider than its share, but long unbroken strings can still require overflow handling inside the grid items.

## The responsive setting, precisely

**Fixed** produces no prefix. The other options add `sm:`, `md:` or `lg:` to the column, row and gap utilities. This can be useful when the same complete layout should begin at a chosen Tailwind breakpoint.

It is not a mobile-first column fallback generator. The tool does not output something like `grid-cols-1 md:grid-cols-4`; it emits only the selected prefixed layout. It also does not include the breakpoint in the CSS export. Treat the control as a prefix for the generated Tailwind string, then add base or additional breakpoint classes in your project as needed.

## Limits and edge cases

The generator has no controls for `auto-fit`, `auto-fill`, fractional track sizes, minimum content widths, named grid areas, `grid-column`, `grid-row`, dense packing or alignment properties. It also does not set container width, item height or overflow behaviour.

Equal rows are not always appropriate for cards with different text lengths. The CSS `repeat(2, minmax(0, 1fr))` makes equal fractional row tracks; if content needs natural row heights, change the row definition after export and verify the result.

The configured min and max attributes guide the number inputs, but the operation itself formats the values it receives. Keep values within the displayed ranges and use whole numbers for predictable class names and preview geometry.

## Common mistakes

Do not interpret **Responsive columns** as a complete responsive design. Review the generated rows and gaps as well. Do not expect a blank override to remove spacing; blank means inherit, while zero means no gap.

Avoid copying the CSS track lines into a Tailwind class string. They are different formats. Also avoid using the fixed 58-pixel preview rows as a production height: they exist to make the numbered cells visible, not to prescribe component sizing.

## Browser and privacy behaviour

Grid generation and preview rendering happen in the browser. There is no upload or account requirement, and these modules do not store the entered values in browser storage. **Reset** restores the original track counts and gaps.

Loading the page still requires its HTML and scripts to be available. Clipboard access may depend on browser permission, and the download is created locally as `grid.css`. If you work with sensitive dashboard content, remember that the grid tool receives dimensions only, not the content that will eventually fill the cells.

## A practical workflow

1. Decide the maximum useful column count from the real card width, not the desktop viewport alone.
2. Set rows and the shared gap, then add axis-specific overrides only where they differ.
3. Choose **Fixed** or the breakpoint at which the entire generated layout should apply.
4. Copy the Tailwind line and inspect every prefixed class before adding it to a component.
5. Add base columns, item spans, alignment and overflow rules in the project, then test narrow and wide screens.

<figure>
  <img src="/assets/img/blog/tailwind-grid-generator/workflow.svg" alt="A grid workflow showing track-count selection, gap overrides, breakpoint review and narrow-screen component testing" width="1200" height="675" loading="lazy">
  <figcaption>Working order: define the equal-track layout first, then add the responsive and item-level rules that this generator intentionally leaves out.</figcaption>
</figure>

## Pre-export checklist

- Confirm the column and row counts match the number of intended items.
- Check both gap overrides, including whether blank should inherit or zero should remove spacing.
- Review all breakpoint-prefixed classes, not just the column count.
- Add a mobile layout separately when the selected breakpoint is not enough.
- Add a selector if using the CSS download.
- Test long content, narrow screens and any cards that need unequal spans.
