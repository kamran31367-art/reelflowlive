---
title: "Cron Expression Explainer: read five fields before scheduling"
description: "Translate five-field cron expressions into plain English, preview upcoming runs and avoid timezone, weekday and syntax assumptions before deployment."
date: 2026-11-27
draft: false
categories:
  - Developer
  - Workflow
cover: assets/img/blog/cron-explainer/hero.svg
coverAlt: "Illustration of five cron fields mapped to minute, hour, day, month and weekday"
coverCaption: "A cron expression is a schedule contract, and its timezone is part of that contract."
takeaways:
  - "The tool accepts exactly five fields: minute, hour, day of month, month and day of week."
  - "The default */15 * * * * explanation means every 15 minutes, with five upcoming runs shown."
  - "Run timestamps are printed as ISO 8601 UTC, but evaluation has no timezone control and follows the browser's local zone."
  - "When day of month and day of week are both restricted, the parser matches either field rather than requiring both."
  - "Simple wildcards, lists, ranges and steps produce the clearest explanations; advanced parser syntax is not fully described."
faq:
  - q: "Can I enter a six-field expression with seconds?"
    a: "No. The page rejects anything other than five whitespace-separated fields with the message Use five cron fields: minute hour day month weekday. Convert a second-based schedule to an appropriate five-field expression or use a scheduler with a documented seconds field."
  - q: "Are the upcoming runs calculated in UTC?"
    a: "They are formatted in UTC with a trailing Z, but the page does not pass a timezone to the parser. Scheduling is evaluated in the browser's local timezone, then converted to an ISO timestamp. Compare the result with the target scheduler's timezone before relying on it."
  - q: "What happens if both day of month and day of week are set?"
    a: "The parser uses the common cron OR rule: a date can match either the restricted day of month or the restricted day of week. This can produce more runs than someone expecting an AND condition intends."
  - q: "Does it support @daily or question-mark syntax?"
    a: "The five-field check rejects @daily because it is one token. Some advanced syntax, including question marks, L, #, H and named months or weekdays, can reach the parser, but the plain-English writer does not fully explain those forms. Prefer simple fields for a reliable reading."
---

A cron line is short enough to look obvious and compact enough to hide a costly mistake. The [Cron Expression Explainer](/cron-explainer/) turns five fields into labelled English and previews upcoming executions, making it easier to review a schedule before it reaches a server.

Use the preview as a sanity check, not as a substitute for the target scheduler's documentation. Timezone, day matching and parser extensions can change what a production system actually does.

## What this tool is for

This tool is useful when inheriting a crontab, reviewing a scheduled job or checking that a proposed expression matches operational intent. It separates minute, hour, day of month, month and day of week so each part can be read independently.

It also answers a practical question: when is the next run? A schedule that sounds right in English may be wrong near a month boundary, a weekend or a daylight-saving transition. A few generated timestamps expose many of those surprises before deployment.

The page does not execute jobs, install a crontab, monitor failures or account for a hosting platform's minimum interval. It explains and calculates; scheduling remains the responsibility of the destination system.

## Controls and defaults

**Cron expression** starts with `*/15 * * * *`. This is a five-field expression covering every quarter hour. **Next runs to show** starts at `5` and accepts whole numbers from `1` to `20`.

Press **Explain cron** to run the operation. Automatic running is disabled, so edits do not replace the result until you act. **Reset** restores the default expression and five runs while clearing the previous output.

There is no timezone selector, reference-date field or seconds field. The current browser time is used as the starting point each time the expression is explained.

## Worked example

Run the default `*/15 * * * *`. The explanation is:

```text
Minute: every 15 minutes; Hour: every hour; Day of month: every day of the month; Month: every month; Day of the week: every day of the week
```

Below it, the output adds `Next 5 runs (UTC):` and five ISO timestamps. Those timestamps are generated when you press the button, so they are not fixed examples you can copy into a runbook as permanent dates.

For a weekday schedule, enter `30 9 * * 1-5`. The explanation reads minute 30, hour 9, every day of the month, every month, and Monday through Friday. In plain operational terms, that is 09:30 on weekdays, subject to the timezone caveat below.

<figure>
  <img src="/assets/img/blog/cron-explainer/example.svg" alt="Five-field cron expression mapped to an English explanation and a list of upcoming run timestamps" width="1200" height="675" loading="lazy">
  <figcaption>The default quarter-hour expression produces a field-by-field reading followed by five timestamps calculated at run time.</figcaption>
</figure>

## Output and formats

The result pane is headed **Explanation and next runs**. The first part is a semicolon-separated sentence with a label for every field. The second part names the requested count and prints one ISO 8601 timestamp per line, ending in `Z` to denote UTC.

**Copy** copies the complete explanation and timestamp list. **Download** saves the same text as a `.txt` file. There is no iCalendar export, crontab installation file or JSON schedule output.

A successful lookup ends with status **Complete**. Empty input asks you to enter a cron expression, and an expression with the wrong number of fields receives the explicit five-field guidance.

Treat the timestamp list as a fresh observation rather than a durable schedule export. Running the same expression later starts from a later instant, so the first line moves forward. If you need an audit record, save the expression, the time you inspected it and the target scheduler's timezone together.

## Limits and edge cases

The five-field rule excludes seconds and years. It also means a full crontab line containing a user or command will fail; paste only the schedule expression. The underlying parser has a 1,024-character expression ceiling, although practical expressions are much shorter.

Timezone is the largest caveat. The operation passes the current date but no `tz` option, so the parser evaluates fields in the browser's local timezone and `toISOString()` formats the resulting instant in UTC. A UTC server can therefore differ from the preview made on a laptop in another zone.

The English writer handles numeric values, `*`, lists, ranges and steps most clearly. Named months, weekday names, `?`, last-day markers, nth weekdays and hashed values may be accepted by the parser without receiving an equally clear explanation. Impossible calendar combinations can also fail during iteration.

## Common mistakes

Do not paste a six-field schedule and assume the missing explanation identifies the problem. Count the fields first: minute, hour, day of month, month, weekday. Remember that weekday numbering uses Sunday as `0` or `7`, not Monday as `1`.

Do not expect both day fields to mean AND. If both are restricted, the parser uses OR matching. Do not assume the `UTC` heading proves the schedule was evaluated in UTC, and do not ignore daylight-saving behavior when a job must run at a stable local wall-clock time.

Finally, a generated list is not evidence that a platform will run a job at that frequency. Check provider limits, maintenance windows and whether the scheduler uses the same cron dialect.

## Browser and privacy

The expression and calculation stay in the browser. No cron line is uploaded, and there is no account or remote job registration. That makes the page suitable for reviewing internal maintenance schedules without exposing them to another service.

A copied schedule can still reveal infrastructure timing through clipboard history or shared documents. Treat rare production windows as operational details, and reset the page if you are working on a shared device.

## A practical workflow

Write the intended behavior in plain language first, then translate it into five fields. Paste the expression, request a handful of runs and inspect dates around weekends, month ends and clock changes.

Compare the timestamps with the target scheduler's documented timezone and dialect. Record that timezone beside the expression in deployment notes, then verify the first real execution and its logs after rollout.

<figure>
  <img src="/assets/img/blog/cron-explainer/workflow.svg" alt="Workflow from scheduling intent through cron explanation and timezone comparison to monitored production runs" width="1200" height="675" loading="lazy">
  <figcaption>A safe schedule review checks the expression, the browser preview and the production scheduler as three separate agreement points.</figcaption>
</figure>

## Preflight checklist

- Confirm there are exactly five fields and no command or username.
- Check weekday numbering and any ranges or steps.
- Review whether restricted day fields create OR matching.
- Compare browser-local evaluation with the scheduler's timezone.
- Inspect upcoming dates across weekends, month ends and clock changes.
- Confirm the hosting provider supports the expression and requested frequency.
