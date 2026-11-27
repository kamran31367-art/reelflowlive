---
title: "Encrypt and Decrypt Text: AES-GCM notes without upload"
description: "Encrypt text locally with a password using AES-GCM and PBKDF2, understand the v1 envelope and avoid irreversible password mistakes."
date: 2026-11-27
draft: false
categories:
  - Developer
cover: assets/img/blog/encrypt-decrypt/hero.svg
coverAlt: "Illustration of a private text note sealed in an authenticated encrypted envelope"
coverCaption: "Encryption protects the text only while the password and implementation remain trustworthy."
takeaways:
  - "Encryption uses AES-GCM with a 256-bit key derived by PBKDF2-SHA-256 at 120000 iterations."
  - "Each encryption creates a fresh 16-byte salt and 12-byte initialization vector."
  - "The output is a v1.salt.iv.ciphertext envelope with each binary component encoded as standard Base64."
  - "A wrong password or modified ciphertext causes authenticated decryption to fail, and there is no recovery route."
  - "Text and password stay in the browser, but clipboard, device and password-handling risks still apply."
faq:
  - q: "Can I recover a forgotten password?"
    a: "No. The page derives the key from the exact password text and provides no recovery key, escrow or reset flow. If the password is lost, the ciphertext cannot be decrypted through this tool."
  - q: "Does the encrypted value work with other encryption tools?"
    a: "Not automatically. The page writes and reads its own version-1 envelope with a specific salt, IV, PBKDF2 iteration count and AES-GCM key size. Another tool must implement that exact format to read it."
  - q: "Can I encrypt a file here?"
    a: "No. The Text field accepts text and uses UTF-8 encoding. There is no file picker, compression or archive format. Large binary files need a dedicated file-encryption workflow rather than conversion into this text box."
  - q: "Why can decryption fail even when I kept the password?"
    a: "AES-GCM authenticates the encrypted data. A changed password, edited envelope or damaged Base64 component can prevent recovery of the plaintext. Copy the complete value unchanged and keep a verified backup before relying on it."
---

A private note does not always belong in a shared document or an unfamiliar online converter. The [Encrypt and Decrypt Text](/encrypt-decrypt/) tool turns UTF-8 text into an authenticated encrypted envelope using a password, entirely inside the browser.

It is suitable when you understand the format and can protect the password separately. The absence of a server upload is valuable, but it does not remove the need for careful key handling or a tested backup.

## What this tool is for

Use this tool for a short note, configuration fragment or message that needs password-based confidentiality before you move it through another channel. The same page can reverse the operation when you have the complete envelope and the exact password.

AES-GCM provides confidentiality and authenticity: decryption detects modified ciphertext rather than returning silently corrupted text. PBKDF2 derives the encryption key from a human password with a random salt, so encrypting the same text twice does not produce the same envelope.

The page is not a password manager, encrypted archive, secure messaging service or audited storage product. It does not manage identities, rotate keys, synchronize devices or protect against malware on the device performing decryption.

## Controls and defaults

**Text** starts with `Private note` and is a five-row textarea. **Password** starts empty and is masked in the interface. **Mode** offers **Encrypt** and **Decrypt**, with Encrypt selected initially.

The action button always reads **Run encryption**, including when Decrypt is selected. Read the Mode field before pressing it. **Reset** restores the sample text, clears the password, returns to Encrypt and clears the output.

A note beneath the fields warns: `Use a strong password. There is no password recovery.` Both text and password are required; whitespace-only text is rejected.

## Worked example

Choose **Encrypt**, replace the text with `Ready at 09:00` and enter a long, unique password. The result has four dot-separated sections:

```text
v1.<Base64 salt>.<Base64 IV>.<Base64 ciphertext>
```

The literal version is `v1`. The 16-byte salt encodes to 24 Base64 characters, and the 12-byte IV encodes to 16. The ciphertext includes the encrypted 14-byte note plus the 16-byte authentication tag, so its Base64 section is 40 characters.

Because the salt and IV are random, the complete 85-character envelope changes every time you encrypt, even with the same note and password. Do not expect a repeatable sample ciphertext.

<figure>
  <img src="/assets/img/blog/encrypt-decrypt/example.svg" alt="Plaintext encrypted into a versioned envelope with separate salt, IV and authenticated ciphertext" width="1200" height="675" loading="lazy">
  <figcaption>The v1 envelope carries the random salt, initialization vector and AES-GCM ciphertext needed for password-based decryption.</figcaption>
</figure>

To reverse it, choose **Decrypt**, paste the entire envelope into **Text**, enter the same password and press **Run encryption**. The output is the original plaintext: `Ready at 09:00`.

## Output and formats

The output heading is **Encrypted or decrypted text**. In Encrypt mode, the result is the versioned Base64 envelope. In Decrypt mode, it is recovered UTF-8 text, not another envelope.

**Copy** copies the result and **Download** saves it as a `.txt` file. There is no JSON wrapper, binary file output, key export or password confirmation step. The status reads **Complete** after success.

Malformed envelopes that do not start with `v1` or lack the expected components produce `This encrypted value is not valid.` Wrong-password or tampering failures surface as browser decryption errors, whose wording can vary.

## Limits and edge cases

The operation uses a 16-byte salt, 12-byte IV, PBKDF2-SHA-256 with 120,000 iterations and a 256-bit AES-GCM key. These choices are implemented in the page's custom version-1 format; changing any one of them would break compatibility with existing envelopes.

No explicit character or byte limit is configured. Practical size is constrained by browser memory and the time required for derivation and encryption. The tool does not compress text, stream large inputs or encrypt attachments.

For long notes, test the round trip before relying on the workflow and keep the original in an approved location until the encrypted backup is verified. Repeated PBKDF2 derivation can take noticeable time, especially on a slower mobile device; that pause is expected work, not a failed conversion.

Password text is used exactly as supplied; there is no normalization, confirmation or strength meter. Unicode text and passwords are encoded as UTF-8. The salt and IV are not secret because they are carried in the envelope, but the password must remain secret.

## Common mistakes

Do not store the password beside the ciphertext and call the pair secure. Anyone who obtains both can attempt decryption. Use a strong, unique password and keep it in a separate approved secret store.

Do not edit the envelope or copy only one section. Decryption expects the complete versioned value. Do not treat AES-GCM as password recovery: authentication tells you that something failed, not how to repair it.

Finally, do not assume local browser encryption makes an endpoint safe. Malware, a compromised browser extension or an insecure clipboard can read plaintext before encryption or after decryption.

## Browser and privacy

The text, password and cryptographic operations stay in the page. Encryption and decryption use Web Crypto and do not send the note to a server as part of this operation. That is useful for sensitive material that should not pass through a remote service.

Web Crypto support and secure-context requirements still depend on the browser and how the site is served. The password exists in page memory while you work, and the result can leave through Copy or Download. Use a trusted device, clear the fields afterward and avoid leaving decrypted text open in a shared session.

## A practical workflow

Write the plaintext, choose Encrypt and use a unique password stored separately. Generate the envelope, then immediately switch to Decrypt and prove that a round trip works before moving the ciphertext anywhere.

Store the complete envelope and password through separate approved channels. Include the `v1` format in your notes if future migration matters, and verify backups by decrypting them on a trusted device.

<figure>
  <img src="/assets/img/blog/encrypt-decrypt/workflow.svg" alt="Workflow from plaintext and separate password through encryption and round-trip verification to protected backups" width="1200" height="675" loading="lazy">
  <figcaption>A usable encrypted note requires a verified round trip, separate password storage and an untouched copy of the full envelope.</figcaption>
</figure>

## Preflight checklist

- Confirm Mode says Encrypt before creating a new envelope.
- Use a long, unique password and store it separately.
- Copy the entire v1 value without edits or missing sections.
- Test decryption before relying on the ciphertext.
- Keep encrypted backups and verify them periodically.
- Clear plaintext and password from shared or untrusted devices.
