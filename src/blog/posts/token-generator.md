---
title: "Token Generator: secure random bytes in three formats"
description: "Generate local Web Crypto tokens in hexadecimal, Base64 or URL-safe Base64, with exact length, padding and batch limits explained."
date: 2026-11-27
draft: false
categories:
  - Developer
cover: assets/img/blog/token-generator/hero.svg
coverAlt: "Illustration of random bytes flowing into hexadecimal and Base64 token strings"
coverCaption: "A token's security starts with its random source and byte length, not its visual complexity."
takeaways:
  - "Randomness comes from crypto.getRandomValues, not Math.random."
  - "The default is one 32-byte hexadecimal token, producing 64 characters and 256 bits of random input."
  - "Random bytes range from 1 to 256, and each run can generate 1 to 50 newline-separated tokens."
  - "Base64 keeps padding characters, while Base64 URL-safe replaces plus and slash and removes trailing equals signs."
  - "Tokens are not deduplicated, prefixed or registered with any service; generation and storage remain separate jobs."
faq:
  - q: "Is a generated token automatically a strong password?"
    a: "It is random text with the entropy of the chosen byte count, but password policies and human use are separate concerns. A 32-byte hexadecimal token has 256 bits of random input; use an appropriate length, protect the value and store it in a password manager or secret system."
  - q: "Which format should I use in a URL?"
    a: "Choose Base64 URL-safe for a token that must travel in a URL path or query without standard Base64's plus, slash or equals characters. URL-encode the complete URL correctly and confirm what the receiving service accepts."
  - q: "Does the generator check for duplicate tokens?"
    a: "No. Every token is generated independently with no duplicate scan or registry check. With an adequate byte length, accidental collisions are extremely unlikely, but uniqueness constraints in a database or external system still belong in that system."
  - q: "Can tokens be generated without internet access?"
    a: "Once the page has loaded, generation uses the browser's Web Crypto API and does not need a network request for each token. The browser must provide crypto.getRandomValues, and the copied or downloaded result still needs secure storage."
---

Test accounts, reset links and fixture records often need values that cannot be guessed. The [Token Generator](/token-generator/) creates random bytes with the browser's cryptographic API and encodes them as text you can copy into a local test or development workflow.

It is deliberately small: choose byte length, encoding and batch size, then generate. The tool does not know what the token will authenticate, so the security decision continues wherever you use it.

## What this tool is for

Use this tool for local test data, disposable identifiers, development credentials or values required by a script that accepts a random string. Web Crypto provides the randomness, and local generation avoids asking a remote website to create a secret on your behalf.

The byte count is the main security control. Encoding changes how the same bytes are represented, not how much randomness they contain. A long Base64 string and a short hexadecimal string can therefore represent very different amounts of entropy.

For production authentication, follow the receiving service's token specification. Many services generate and store credentials server-side. This page is a convenient source of random material, not an account manager, API client or replacement for a secret vault.

## Controls and defaults

**Random bytes** starts at `32` and accepts whole numbers from `1` to `256`. **Format** starts at **Hexadecimal**, with **Base64** and **Base64 URL-safe** as alternatives.

**Number of tokens** starts at `1` and accepts `1` to `50`. Press **Generate tokens** to create a fresh batch. Automatic running is disabled, so changing a setting does not silently replace a token you may already have copied.

**Reset** restores 32 bytes, Hexadecimal and one token, then clears the output. There is no character-set selector, prefix field, exclusion rule or duplicate check.

## Worked example

Keep the defaults and generate one token. The output is 64 hexadecimal characters: two characters for each of 32 random bytes. The exact value changes on every run, and each byte is represented by a value from `00` through `ff`.

Switch to **Base64** with the same 32 bytes of randomness. The result is 44 characters, including one trailing `=` padding character. Switch to **Base64 URL-safe**, and the same encoding becomes 43 characters because trailing padding is removed and `+` or `/` would be replaced by `-` or `_`.

For a batch, set **Number of tokens** to `3`. The result contains three independent tokens on separate lines, each generated with the current byte and format settings.

<figure>
  <img src="/assets/img/blog/token-generator/example.svg" alt="Thirty-two random bytes represented as 64 hex characters and padded or unpadded Base64" width="1200" height="675" loading="lazy">
  <figcaption>Encoding changes length and character set, not entropy: 32 bytes become 64 hex characters, 44 padded Base64 characters or 43 URL-safe characters.</figcaption>
</figure>

## Output and formats

The output heading is **Secure tokens**. Each token occupies its own line, and **Copy** copies the entire batch. **Download** saves the same newline-separated text as a `.txt` file.

Hexadecimal is lowercase and contains no separators. Standard Base64 uses the conventional alphabet and padding. URL-safe Base64 substitutes `-` for `+`, `_` for `/`, and strips trailing `=` characters.

The page does not label individual lines with numbers or settings. If you download a batch, record the byte length and format in the filename or accompanying secret metadata before distributing it to test fixtures.

Avoid regenerating a batch simply because one value needs replacement. Generate the replacement separately and update its fixture record, leaving the other allocations untouched. That makes rotations easier to audit and reduces the chance of changing credentials that were already installed elsewhere.

## Limits and edge cases

The configured range is 1 to 256 bytes per token and 1 to 50 tokens per run. Those are interface limits, not universal token-security recommendations. One byte provides only eight bits of random input and is unsuitable for a secret that must resist guessing.

Encoding length follows the byte count. For Base64, padding depends on the remainder after groups of three bytes: one remainder byte adds `==`, two add `=`, and a multiple of three needs none. URL-safe output removes that padding.

The generator does not enforce a minimum length for a particular use case, check a service's alphabet, guarantee uniqueness or remember previous batches. Each click creates a new set; there is no history or recovery feature inside the page.

## Common mistakes

Do not choose length by how impressive the string looks. Compare random bits and the receiving system's requirements. A 16-byte token is 128 bits of random input even when encoded as a much longer-looking Base64 string; a 32-byte token remains 256 bits in any of the three formats.

Do not mix standard and URL-safe alphabets when copying a token between systems. Do not assume Base64 padding is accepted by every API. And do not use `Math.random()` as a substitute when a credential depends on unpredictability.

Avoid putting live tokens directly into source code, URLs that appear in analytics, screenshots or support tickets. A random value is still a bearer credential if the receiving system treats it as one.

## Browser and privacy

Generation calls `crypto.getRandomValues` locally. The token does not need to be uploaded to be created, which reduces exposure to a third-party generator and its logs.

That does not make the clipboard or downloaded file private. Clipboard synchronization, browser extensions, cloud-backed folders and shared sessions can copy secrets elsewhere. Generate only what you need, move values into an approved secret store and clear the page afterward.

## A practical workflow

Start with the receiving system's required alphabet and minimum entropy. Choose a byte length that comfortably meets it, select the encoding and generate a single token before creating a batch.

Store the value immediately in the intended secret manager or fixture system. Test the consuming service with a non-production value, and keep tokens out of logs and version control. Rotate or delete the value when its purpose ends.

<figure>
  <img src="/assets/img/blog/token-generator/workflow.svg" alt="Workflow from token requirements through local generation and encoding to protected storage and rotation" width="1200" height="675" loading="lazy">
  <figcaption>Generation is only the first step; format compatibility, protected storage and lifecycle rules determine whether the token is useful.</figcaption>
</figure>

## Preflight checklist

- Confirm the receiving system's alphabet and minimum entropy.
- Choose enough random bytes rather than judging string length.
- Select standard or URL-safe Base64 deliberately.
- Check padding expectations before pasting into an API.
- Store tokens outside source code, logs and shareable URLs.
- Generate a fresh value and remove old copies when rotation is due.
