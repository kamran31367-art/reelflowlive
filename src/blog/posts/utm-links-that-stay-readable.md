---
title: "UTM links: a naming habit that keeps reports readable"
description: "The five UTM fields, why capital letters split your data, how to tag a link that already has parameters, and the links that should never be tagged."
date: 2026-11-27
categories:
  - Marketing
  - Social
draft: false
---

UTM parameters are the standard way to tell analytics where a visit came from. They cost nothing and work with almost every tool. The problems start later, when a spreadsheet shows `YouTube`, `youtube` and `yt` as three different sources because nobody agreed on a spelling.

## The five fields

- `utm_source` - where the click happened: `youtube`, `instagram`, `newsletter`.
- `utm_medium` - the kind of placement: `social`, `email`, `video`, `cpc`.
- `utm_campaign` - the specific push: `november-launch`, `ep12`.
- `utm_term` - the paid keyword, when relevant.
- `utm_content` - which variant: `thumbnail-a`, `top-button`.

Source and medium do the heavy lifting. Campaign, content and term are optional but make the report useful.

## Spelling rules that prevent cleanup work

Analytics tools compare strings exactly. So:

- Use lower case everywhere: `youtube`, not `YouTube`.
- Use hyphens instead of spaces; a space becomes `%20` in the URL and looks broken in reports.
- Keep `source` for the platform and `medium` for the type of placement. A YouTube video description is `source=youtube&medium=video`; the same channel's newsletter is `source=newsletter&medium=email`.
- Write the campaign name once and paste it everywhere. One typo splits one campaign into two rows forever.

## Links that already have parameters

Many share URLs already carry `?si=` or a video ID. The [UTM Link Builder](/utm-link-builder/) appends the tags after the existing parameters instead of replacing them, which is what you want: the tracking opens the right page and the original parameters still work.

## Links that should not be tagged

- **Internal links.** Tagging a link from one page of your site to another pollutes the report and can restart the visitor's session in some analytics setups.
- **Links you paste in chat or email to a colleague** - the tag leaks into their history and, later, into reports as fake traffic.

## Check before sending

Open the finished link in a private window and confirm it lands on the right page. Then look at the URL once more: the parameter order does not matter, but a missing `&` turns the next field into part of the previous value.
