---
title: "MAC Address Generator: locally administered lab addresses"
description: "Generate locally administered unicast MAC addresses for labs and test fixtures, with exact formatting, bit rules, batch limits and uniqueness caveats."
date: 2026-11-27
draft: false
categories:
  - Developer
cover: assets/img/blog/mac-address-generator/hero.svg
coverAlt: "Illustration of six hexadecimal byte pairs forming a lab MAC address"
coverCaption: "A locally administered address is a structural label, not a globally assigned manufacturer identity."
takeaways:
  - "Each address contains six random bytes formatted as six two-digit hexadecimal pairs."
  - "The first byte sets the locally administered bit and clears the multicast bit, producing a locally administered unicast address."
  - "Defaults generate five uppercase, colon-separated addresses in one run."
  - "How many accepts 1 to 100; Letter case and Separator control presentation without changing the underlying bytes."
  - "The generator provides no OUI assignment, duplicate scan or guarantee of global uniqueness, so use it for labs and testing."
faq:
  - q: "Are these globally unique MAC addresses?"
    a: "No guarantee is made. The generator sets the locally administered bit and leaves the remaining bits random, but it has no registry or duplicate check. Large-scale deployments should use an approved allocation scheme and detect collisions in the target environment."
  - q: "Do these addresses belong to a hardware manufacturer?"
    a: "No. They are locally administered values for scenarios such as test fixtures, network simulations and isolated labs. They do not carry an assigned organizationally unique identifier and should not be presented as manufacturer-issued hardware addresses."
  - q: "Why is the first byte never odd?"
    a: "The least significant bit of the first octet is the multicast bit. The generator clears it so the address is unicast, while setting the next bit to mark it locally administered. The other six bits of that first byte remain random."
  - q: "Can this tool change my device's MAC address?"
    a: "No. It only creates text locally and offers Copy and Download. It does not access network interfaces, install drivers, bypass permissions or modify any device configuration."
---

Network tests often need plausible interface identifiers without borrowing a real device's address. The [MAC Address Generator](/mac-address-generator/) creates locally administered unicast values as text, ready for a lab inventory, fixture file or simulation.

The key is to use the address for what it represents. These values follow the local/unicast bit structure, but they are not manufacturer assignments and should not be treated as a global identity service.

## What this tool is for

Use this tool when a lab needs a batch of distinct-looking interface labels, a test suite needs valid address strings, or a network simulation needs locally administered unicast values. It avoids copying a production device's identifier into documentation or screenshots.

The generator uses Web Crypto for each six-byte address. It then adjusts two bits in the first byte: the locally administered bit is set, and the multicast bit is cleared. That produces the address class promised by the page.

It does not create an EUI-64 identifier, assign an OUI, reserve an address range or configure an interface. A real deployment with many virtual or physical devices needs a deliberate allocation plan beyond random test data.

## Controls and defaults

**How many** starts at `5` and accepts whole numbers from `1` to `100`. **Letter case** starts at **Uppercase**, with **Lowercase** as the alternative.

**Separator** starts at **Colon**. Its other choices are **Hyphen** and **None**. These choices affect only the characters between byte pairs; they do not change the random bytes.

Press **Generate MAC addresses** to create a new batch. Automatic running is disabled, so you can finish choosing settings first. **Reset** restores five addresses, uppercase and colon separators, then clears the previous result.

There is no prefix or OUI field, no duplicate filter and no option to include a multicast address. Every run produces a fresh set.

## Worked example

Set **How many** to `3`, choose **Lowercase** and **Hyphen**, then generate. The output has this shape:

```text
02-a1-4f-9c-30-7b
06-18-c2-55-0d-e9
0a-73-24-b8-61-f0
```

Those values are illustrative, not reproducible output. A real run will produce different random bytes. Each first byte is even, so its multicast bit is zero, and its second-lowest bit is set, marking the address as locally administered.

Switch **Separator** to **None** and the same kind of address becomes a continuous twelve-character hexadecimal string. Uppercase changes the presentation of letters such as `a` through `f`, not the address value.

<figure>
  <img src="/assets/img/blog/mac-address-generator/example.svg" alt="Three generated MAC byte pairs with local and unicast bits highlighted in the first octet" width="1200" height="675" loading="lazy">
  <figcaption>Illustrative lab addresses use six byte pairs; setting the local bit and clearing the multicast bit makes each first octet locally administered and unicast.</figcaption>
</figure>

## Output and formats

The output heading is **Generated addresses**, with one address per line. **Copy** copies the whole batch, and **Download** saves the newline-separated values as a `.txt` file.

Colon output looks like `02:A1:4F:9C:30:7B`; hyphen output looks like `02-A1-4F-9C-30-7B`; no-separator output looks like `02A14F9C307B`. Every format contains twelve hexadecimal digits.

The status is **Complete** after generation. The page does not report duplicate checks, allocation ranges or byte-level entropy, so those properties should not be inferred from the clean output alone.

## Limits and edge cases

Two bits of the first byte are fixed by the address class, leaving 46 random bits across the six-byte value. That is a large space, but random generation is not a uniqueness guarantee and the tool keeps no registry of previously generated addresses.

The batch is capped at 100 addresses by the interface. The operation does not validate every numeric edge case itself, so keep **How many** within the displayed range and use a whole number.

A locally administered address is still a unicast address, not a multicast group. The tool cannot generate EUI-64 values, include an assigned manufacturer OUI or determine whether an address is already present on a particular network.

If a lab uses DHCP reservations, static allowlists or configuration templates, store the allocated address beside the fixture name and interface role. The text file from this page is only a candidate list. Turning it into infrastructure is the step where duplicate detection, documentation and cleanup become necessary.

For screenshots and example logs, generated addresses are preferable to copying a workstation's real identifier. They still reveal the structure of your test setup, but they avoid publishing an unnecessary hardware detail from a production or personal device.

## Common mistakes

Do not publish generated values as manufacturer-issued hardware identities. Do not assume random generation is suitable for a large managed deployment without collision detection and an allocation record.

Do not mistake the multicast bit for the local bit. The lowest bit of the first octet must be zero for unicast; the next bit must be one for local administration. Do not force the entire first byte to `02`, because the remaining bits are intentionally random.

Finally, avoid using a generated address to impersonate or access a device you do not control. This page creates test text; interface changes require separate operating-system tools, permissions and authorization.

## Browser and privacy

The bytes are generated locally through `crypto.getRandomValues`. No address list is uploaded, and the tool does not inspect or modify network hardware. That makes it suitable for private lab documentation and offline fixture preparation.

Generated addresses are usually not secret, but an inventory can reveal lab topology or device counts. Treat downloaded lists as internal project data when they are tied to real infrastructure, and avoid sharing screenshots that expose more of the environment than necessary.

## A practical workflow

Choose the batch size and textual format required by the consuming system. Generate once, then copy or download the list into the lab's fixture or inventory location.

Check for duplicates in the target environment, especially when combining lists from multiple sessions. Record which devices or fixtures use each value, and remove the allocation when the test is complete so old labels do not accumulate.

<figure>
  <img src="/assets/img/blog/mac-address-generator/workflow.svg" alt="Workflow from lab address requirements through local generation and collision review to fixture allocation" width="1200" height="675" loading="lazy">
  <figcaption>Random local addresses become useful test data only after formatting, collision review and allocation to a specific lab fixture.</figcaption>
</figure>

## Preflight checklist

- Keep the batch between 1 and 100 whole addresses.
- Choose the separator expected by the consuming tool.
- Confirm uppercase or lowercase matches the fixture format.
- Use these values only where locally administered addresses are appropriate.
- Check duplicates across imported and previously generated lists.
- Record allocations and remove them when the lab test ends.
