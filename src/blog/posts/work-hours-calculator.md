---
title: "Work hours without the spreadsheet: breaks, decimals and pay"
description: "Use ReelFlow's Work Hours Calculator to subtract one unpaid break, handle overnight shifts and estimate pay, with a worked 09:00-17:30 example and clear limits."
date: 2026-11-27
categories:
  - Misc
  - Workflow
cover: assets/img/blog/work-hours-calculator/hero.svg
coverAlt: "A work schedule with a clock, break interval and decimal-hours total arranged on a desk"
coverCaption: "A shift becomes useful recordkeeping only when the break and the time format are unambiguous."
takeaways:
  - "A 09:00-17:30 shift with a 30-minute unpaid break is 8 hours, or 8.00 decimal hours."
  - "An end time earlier than the start is treated as the next day; identical times produce zero hours, not a 24-hour shift."
  - "The optional hourly rate produces a simple gross estimate, without a currency, overtime rules, taxes or deductions."
  - "Only one total unpaid break is accepted; split breaks, dates and payroll rounding policies are outside the tool."
  - "The calculation runs locally, and this tool does not save your schedule or rate between visits."
faq:
  - q: "Can I calculate an overnight shift?"
    a: "Yes. Enter the clock-out time as it appears on the same day's clock, even when it is numerically earlier than the start. For example, 22:00 to 06:00 is treated as eight elapsed hours before the break is subtracted. The tool does not ask for calendar dates."
  - q: "What happens if the start and end times match?"
    a: "The elapsed time is zero. Matching times are not interpreted as a full 24-hour shift. If you genuinely worked a full day, calculate the two parts separately and add the results in your own record."
  - q: "Is the estimated pay my final pay?"
    a: "No. It multiplies paid hours by the rate you enter. It does not apply a currency, overtime premiums, paid-break policy, rounding rules, taxes or deductions. Use it as a quick gross estimate and check the result against your payroll rules."
  - q: "Does the calculator remember previous shifts?"
    a: "No. Inputs recalculate in the current page, but there is no shift history or local save. Copy or download the result before leaving if you need a record."
draft: false
---

A shift can be simple to work and surprisingly awkward to total. The break is easy to forget, clock-out sometimes falls on the next day, and 8 hours 30 minutes is not the decimal number 8.30. The [Work Hours Calculator](/work-hours-calculator/) handles one shift at a time: enter the start, end, unpaid break and optional rate, then read paid hours in two formats.

It is a compact calculator, not a timesheet or payroll engine. Used with that boundary in mind, it is useful for checking a day's total before copying the figure into a timesheet.

## What the calculator is for

The page answers a narrow question: how much paid time remains after one unpaid break? It shows both hours and minutes, which match a clock, and decimal hours, which suit many billing and payroll forms.

A typical use is a quick end-of-day check. You know you started at 09:00, finished at 17:30 and took half an hour away from work. The calculator confirms the total without a spreadsheet formula. Adding a week of separate days is a manual follow-up.

Use it for straightforward schedules. Split shifts, multiple breaks, rounded billing increments and policy-dependent pay need a more detailed record.

## The four controls

The Work schedule panel contains four fields:

- **Start time** and **End time** use the browser's time control, and the calculation reads their values as 24-hour `HH:MM` strings. The defaults are 09:00 and 17:30.
- **Unpaid break (minutes)** defaults to 30. The control is configured for 0 to 720 minutes in one-minute steps.
- **Hourly rate (optional)** defaults to 0. It is configured from 0 to 10,000 in steps of 0.01. A zero rate omits the pay line.

Results update automatically after an input change. **Calculate hours** runs the calculation directly, while **Reset** restores the default fields and recalculates them. The output can be copied or downloaded as a text file named `work-hours-calculator.txt`.

<figure>
  <img src="/assets/img/blog/work-hours-calculator/workflow.svg" alt="Four schedule inputs flowing into a paid-time result and then into a copied or downloaded text record" width="1200" height="675" loading="lazy">
  <figcaption>One shift passes through four inputs; the result is a short text record rather than a stored timesheet.</figcaption>
</figure>

## Worked example: 09:00 to 17:30

Start with the page defaults: 09:00 start, 17:30 end and a 30-minute unpaid break. The elapsed shift is 8 hours 30 minutes, or 510 minutes. Subtracting the break leaves 480 minutes.

The result reads:

```text
Paid time: 8h 00m
Decimal hours: 8.00
```

Add an hourly rate of 18.00 and a third line appears: `Estimated pay: 18.00 × 8.00 = 144.00`. There is no currency symbol because the calculator does not know which currency you mean.

The arithmetic is transparent: 510 minus 30 leaves 480 paid minutes, and 480 divided by 60 equals 8.00 hours. Decimal hours express minutes as a fraction of an hour, not as a two-digit minute field.

<figure>
  <img src="/assets/img/blog/work-hours-calculator/example.svg" alt="Worked example showing 09:00 to 17:30, minus a 30-minute break, producing 8 hours and 144.00 at a rate of 18.00" width="1200" height="675" loading="lazy">
  <figcaption>The worked shift: 510 elapsed minutes become 480 paid minutes, then 8.00 decimal hours and a 144.00 estimate.</figcaption>
</figure>

## Overnight shifts and edge cases

When the end time is earlier than the start, the calculation assumes the shift crossed midnight. A 22:00 start and 06:00 end give 480 elapsed minutes. With the same 30-minute break, the output is 7 hours 30 minutes and 7.50 decimal hours.

The reverse assumption does not apply to identical times. A start and end of 09:00 produce zero elapsed minutes. This avoids silently turning a missing clock-out into a 24-hour day, but it also means a genuine full-day shift must be handled in parts.

A break equal to the entire elapsed shift produces zero paid time. A break longer than the shift produces an error instead of a negative total. Dates, daylight-saving changes and time-zone offsets are not considered; the tool compares clock values only. The number fields advertise the ranges above, but the operation does not independently clamp a manually entered negative break or out-of-range rate, so review those values before using the pay estimate.

## What the pay estimate leaves out

The pay line is multiplication, not a payroll calculation. It uses the entered rate and the paid hours derived from the clock times. Although decimal hours are displayed to two places, the multiplication uses the underlying minute-based value, so a 7-hour-30-minute shift pays from 7.5 rather than a rounded 7.50 approximation invented by the user.

There are no overtime bands, premium rates, currency conversion, taxes, deductions or paid-break exceptions. A policy that pays a different rate after eight hours cannot be represented here. The result also does not round to an employer's billing increment.

Treat the number as a gross sanity check. Keep the actual rate, break rule and final payable amount in the system that governs your work.

## Output and recordkeeping

With a positive rate, the output has three lines: paid time, decimal hours and estimated pay. With a zero or blank rate, it has two. **Copy** places that text on the clipboard, and **Download** saves the same content as a plain text file.

There is no table of days, named client field, editable note or saved history. Reopening the page returns the default example rather than your last shift. If the number matters, copy it into your timesheet while the result is still visible, then compare the copied value with the clock record.

For repeated work, label the record yourself. The downloaded filename does not include a date, employee, client or project.

## Common mistakes

The most common decimal error is reading 8 hours 30 minutes as 8.30. It is 8.50 because 30 divided by 60 is 0.5. The calculator avoids that conversion error by deriving the decimal from minutes.

Do not enter only the unpaid portion you remember if there were several breaks. Add them outside the tool first, then enter one combined total. Conversely, do not subtract a paid rest break unless your policy says it is unpaid.

For overnight work, enter the actual clock-out time rather than adding 24 hours to it. The field accepts a time, not a duration. Finally, check the rate before trusting the pay line; the calculator cannot know whether you intended an hourly, daily or project figure.

## A repeatable workflow and checklist

1. Check the original start and finish against your clock or schedule.
2. Add any separate unpaid breaks into one minute total.
3. Enter the times, break and optional rate.
4. Read both paid time and decimal hours; use the format your record requires.
5. Apply any overtime, rounding or deduction rule outside the calculator.
6. Copy or download the result and label it in your own timesheet.

The [Checklist Manager](/checklist-manager/) can hold the administrative steps around this process, while the calculator remains the arithmetic step. Neither replaces your employer's official record.

## Browser privacy and final check

The shift calculation executes in the page using the values you enter. This tool does not upload the schedule, store it in local browser storage or require an account. Loading the website still involves ordinary web requests, but the work-hours operation itself is local.

Before relying on a result, confirm the date boundary, the break total and the meaning of the rate. If any of those depends on a rule the page does not model, calculate the hours here and make the policy decision in the proper recordkeeping system.
