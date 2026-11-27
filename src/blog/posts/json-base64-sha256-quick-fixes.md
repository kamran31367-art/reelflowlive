---
title: "Quick JSON, Base64 and hash fixes without an account"
description: "Format messy JSON, encode or decode Base64, take a SHA-256 checksum and generate a strong password - all in one page that runs offline."
date: 2026-11-27
categories:
  - Developer
draft: false
---

These four chores show up constantly: a minified JSON blob needs reading, a Base64 value needs decoding, a checksum needs verifying, and a throwaway password needs generating. Each has a dozen ad-supported websites, and every one of them asks you to paste data into a server you do not control. The [Developer Tools page](/developer-tools/) does all four locally.

## JSON formatting

A formatter does two jobs: it fails loudly on invalid JSON, and it lays valid JSON out with indentation. Failing loudly matters most - a missing comma or a trailing comma is invisible in a wall of text and obvious once the parser points at a line. Minifying goes the other way: strip whitespace before shipping a config file.

## Base64 encode and decode

Base64 turns bytes into safe text for places that only accept text: headers, data URIs, tokens. Encoding is not encryption - anyone can decode it. The decode direction is the useful one when debugging: a token that looks like noise becomes readable JSON in one step.

Watch for the URL-safe variant, which replaces `+` and `/` with `-` and `_`. A decoder that accepts only the standard alphabet will refuse valid values from URLs.

## SHA-256 checksums

A SHA-256 hash is a fingerprint of the input. Change one character and the hash changes completely. That makes it the standard way to verify that two copies of a value are identical - a downloaded file's checksum, a signature comparison, a cache key. SHA-1 is included only for comparing legacy values; it is not safe for anything new.

## Password generation

The password generator draws characters from `crypto.getRandomValues`, the browser's cryptographic random source - not `Math.random`, which is predictable. Set the length and the character groups; 16 characters mixing cases, digits and symbols is a solid default for a site you cannot protect with two-factor authentication.

## Why local matters

The strings people paste into these tools are often tokens, keys, customer records or unreleased config. Processing them in the page means no upload, no account, no server-side log. Close the tab and the data is gone.
