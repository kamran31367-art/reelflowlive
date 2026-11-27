---
title: "Excel to Markdown: turn the first worksheet into a table"
description: "Convert the first XLSX sheet into a Markdown table, with header rules, formula and date limits, size caps and a worked spreadsheet example."
date: 2026-11-27
draft: false
categories:
  - Converters
cover: assets/img/blog/excel-to-markdown/hero.svg
coverAlt: "An Excel worksheet grid flowing into a Markdown pipe table with matching rows and columns"
coverCaption: "The converter reads stored cell values; it does not reproduce the workbook's visual formatting."
takeaways:
  - "Only the first worksheet in an XLSX workbook is converted, and there is no sheet selector."
  - "The first non-empty row becomes the Markdown header; later non-empty rows become data rows."
  - "The workbook must stay below 25 MB, 256 columns, 10,000 rows and 100,000 processed cells."
  - "Values come from stored cell data, so formulas are not recalculated and Excel display formats are not applied."
  - "Output is a pipe table downloaded as excel-to-markdown.md, with pipes escaped and line breaks converted to HTML breaks."
faq:
  - q: "Can I choose which worksheet is converted?"
    a: "No. The converter opens the first sheet listed in the workbook and has no sheet dropdown. If another sheet must be converted, save a copy with that sheet first, or move the desired data into the first worksheet before converting."
  - q: "Does it calculate Excel formulas?"
    a: "No. The converter reads the value stored in the worksheet XML. A formula with a cached result can supply that cached value, but the formula is not recalculated and the formula text is not exported. Open and recalculate the workbook in Excel or another spreadsheet application first when current results matter."
  - q: "Will dates and numbers look exactly as they do in Excel?"
    a: "Not necessarily. The converter reads stored values rather than applying Excel's display formatting. A date stored as a serial number can appear as that number, and a value formatted with currency, percentages or custom decimals can lose that presentation. Format the exported Markdown for its destination."
  - q: "What happens to blank rows, merged cells and multiple sheets?"
    a: "Fully empty rows are dropped, and missing cells in a row are padded so the table stays rectangular. Merged-cell layout is not reconstructed; only stored cell values are read. Sheets after the first are ignored, including their formulas, formatting and data."
---

The [Excel to Markdown Table Converter](/excel-to-markdown/) reads one XLSX workbook and turns its first worksheet into a Markdown table. It is a practical way to move a small grid into documentation, a README or a content management system without manually retyping every cell.

The output is deliberately plain. Colours, borders, fonts and workbook layout disappear; rows, columns and stored values remain. That makes source preparation more important than it looks in a spreadsheet application.

## What the converter is for

Use it for compact tables that belong in text-based documents: specifications, schedules, small inventories, comparison grids and reference data. Markdown tables are readable in source form and render cleanly on many documentation platforms.

The tool is not a workbook renderer. It does not preserve charts, images, conditional formatting, cell comments or interactive spreadsheet features. It also does not convert the entire workbook into multiple tables.

<figure>
  <img src="/assets/img/blog/excel-to-markdown/workflow.svg" alt="An XLSX workbook opening to its first sheet before cell values are mapped into a Markdown pipe table" width="1200" height="675" loading="lazy">
  <figcaption>Workbook selection is automatic: the first sheet supplies the rows that become Markdown.</figcaption>
</figure>

## File control and conversion action

The **Excel workbook** dropzone accepts one `.xlsx` file. Click it to choose a workbook or drag an XLSX onto it. Legacy `.xls`, CSV, `.xlsm` and multiple-file selection are not supported by this field.

Press **Convert workbook** after choosing the file. The converter opens the XLSX package, reads workbook metadata to locate the first sheet, then reads that worksheet's XML. It does not launch Excel or calculate the workbook.

The **Markdown table** pane shows the generated text. **Copy** copies the table, and **Download** saves `excel-to-markdown.md` as UTF-8 text. **Reset** clears the selected workbook and result.

## A worked workbook example

Suppose the first worksheet is called **Inventory** and contains this grid:

| Cell | Column A | Column B | Column C |
| --- | --- | --- | --- |
| 1 | Item | Quantity | Location |
| 2 | Camera | 2 | Studio A |
| 3 | Tripod | 5 | Studio B |
| 4 | Light | 3 | Studio A |

Choose the workbook and press **Convert workbook**. The first non-empty row becomes the header, and the output is:

```markdown
| Item | Quantity | Location |
| --- | --- | --- |
| Camera | 2 | Studio A |
| Tripod | 5 | Studio B |
| Light | 3 | Studio A |
```

<figure>
  <img src="/assets/img/blog/excel-to-markdown/example.svg" alt="A four-row inventory worksheet converted to a Markdown table with Item, Quantity and Location columns" width="1200" height="675" loading="lazy">
  <figcaption>The first non-empty row supplies the headers; the sheet name and visual styling are not exported.</figcaption>
</figure>

## Header rows, blanks and column shape

The converter processes worksheet rows in document order, drops rows whose cells are all empty, and uses the first remaining row as the Markdown header. A title row above the real headers will therefore become the header unless you remove or restructure it.

Missing cells are padded with empty values up to the widest remaining row. This keeps the pipe table rectangular, but it cannot infer what a blank cell means. Fill intentional blanks with a value such as `N/A` when the distinction matters.

Pipes inside cell text are escaped with a backslash so they do not split the Markdown column. Embedded line breaks are replaced with `<br>`, allowing multi-line cell content to remain inside one table row.

## Formulas, dates and stored values

The converter reads stored worksheet values. Shared strings and inline strings are supported, and Boolean cells are written as `TRUE` or `FALSE`. It does not evaluate formulas.

If a formula cell has a cached value in the XLSX file, that value can appear in the Markdown. If the cached value is missing, stale or the workbook has not been recalculated since its inputs changed, the output can be blank or outdated. Recalculate and save the workbook in a spreadsheet application before conversion when formula results matter.

Display formatting is also ignored. A date may appear as an Excel serial number, a currency value may lose its symbol, and a percentage may appear as its underlying decimal. Custom number formats do not become Markdown formatting.

For predictable output, consider pasting values into a clean conversion sheet. Keep the formula workbook separately so the published table has stable, reviewable data.

## Explicit size and structure limits

The implementation enforces several hard boundaries:

- **File size:** the XLSX must not exceed 25 MB, measured as 25 times 1024 times 1024 bytes.
- **Columns:** references beyond 256 columns are rejected.
- **Rows:** row references above 10,000 are rejected.
- **Cells:** processing stops after more than 100,000 cells.
- **Output:** generated Markdown longer than 5,000,000 characters is rejected.

Workbook metadata, relationship data, worksheet XML and the shared-string table also have internal safety caps. These checks exist to keep parsing bounded in the browser, not to guarantee that every file just below a threshold will fit comfortably in memory.

A workbook can be small in bytes but still contain a very wide or dense first sheet. Simplify the conversion copy before trying again rather than repeatedly pressing the action button.

## Common mistakes to avoid

Do not put a report title or explanatory paragraph in row one unless you want it treated as the header. Move the true column labels to the first non-empty row of the conversion copy.

Do not rely on colour alone. Convert status colours into words, and check that symbols or icons have not carried meaning that the Markdown cannot express.

Do not assume formulas are current. A cached result is not a fresh calculation. Likewise, do not expect an Excel date to remain a friendly date unless the cell already contains a suitable stored value.

Finally, keep the workbook. The Markdown download is a static representation of selected values, not a replacement for the source data or its formulas.

## Local processing and privacy

The XLSX file is opened in the browser with bundled JSZip and DOM-parsing code. Worksheet data is read locally and converted in memory. No workbook upload or account is required.

That makes the tool suitable for internal inventories, unpublished planning data and client tables. The file is not sent to a spreadsheet conversion service, and the resulting Markdown remains in the tab until you copy, download or reset it.

Local processing does not remove the need for normal data handling. The open page, clipboard and downloaded file can still expose information on a shared device, and links or formulas in the workbook may point to external sources that are not resolved by this tool.

## A practical workflow

1. Save a copy of the workbook for conversion.
2. Put the desired worksheet first and remove any worksheets you do not want processed.
3. Make the true header row the first non-empty row.
4. Resolve merged cells, subtotals and colour-only meanings where possible.
5. Recalculate formulas and confirm cached results are current.
6. Check that the sheet stays within the size, row, column and cell caps.
7. Choose the XLSX, press **Convert workbook** and inspect the Markdown.
8. Copy or download it, then verify the rendered table in the destination.

## Final checklist

- The file is XLSX and no larger than 25 MB.
- The intended data is on the first worksheet.
- The first non-empty row contains the real headers.
- Formula results have been recalculated and saved.
- Dates and formatted numbers are acceptable as stored values.
- The sheet stays within 256 columns, 10,000 rows and 100,000 cells.
- Pipes, line breaks and blank cells have been reviewed.
- The Markdown renders correctly and the source workbook is retained.

Excel-to-Markdown conversion works best on a deliberately simple sheet. Prepare the data, understand the stored values and treat the result as editable documentation rather than a second spreadsheet.
