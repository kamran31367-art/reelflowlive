import { operations, escapeHtml, sanitizeLocalHtml, requireFile, readText, textResult, htmlResult } from './core.js';

operations['mailto-link-generator'] = (v) => {
  const params = [];
  if (v.cc) params.push('cc=' + encodeURIComponent(v.cc));
  if (v.bcc) params.push('bcc=' + encodeURIComponent(v.bcc));
  if (v.subject) params.push('subject=' + encodeURIComponent(v.subject));
  if (v.body) params.push('body=' + encodeURIComponent(v.body));
  const link = 'mailto:' + encodeURIComponent(v.to || '').replace(/%40/g, '@') + (params.length ? '?' + params.join('&') : '');
  return textResult(link);
};

function decodeQuotedPrintable(value) {
  return value.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function decodeBase64(value) {
  try { return new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g, '')), (c) => c.charCodeAt(0))); } catch (error) { return ''; }
}

function decodeHeader(value) {
  return value.replace(/=\?([^?]+)\?([BQ])\?([^?]+)\?=/gi, (_, charset, encoding, data) => {
    try {
      if (encoding.toUpperCase() === 'B') return decodeBase64(data);
      const bytes = Uint8Array.from(decodeQuotedPrintable(data.replace(/_/g, ' ')), (c) => c.charCodeAt(0));
      return new TextDecoder(charset).decode(bytes);
    } catch (error) { return data; }
  });
}

function parseHeaders(raw) {
  const unfolded = raw.replace(/\r?\n[ \t]+/g, ' ');
  const headers = {};
  for (const line of unfolded.split(/\r?\n/)) {
    const index = line.indexOf(':');
    if (index < 0) continue;
    headers[line.slice(0, index).toLowerCase()] = decodeHeader(line.slice(index + 1).trim());
  }
  return headers;
}

function parsePart(raw, headers, output) {
  const contentType = (headers['content-type'] || 'text/plain').split(';')[0].trim().toLowerCase();
  const transfer = (headers['content-transfer-encoding'] || '').toLowerCase();
  let body = raw;
  if (transfer === 'base64') body = decodeBase64(body);
  else if (transfer === 'quoted-printable') body = decodeQuotedPrintable(body);
  if (contentType.startsWith('multipart/')) {
    const boundary = (headers['content-type'].match(/boundary="?([^";]+)"?/i) || [])[1];
    if (!boundary) return;
    const parts = body.split('--' + boundary);
    for (const part of parts) {
      const cleaned = part.replace(/^\r?\n/, '').replace(/\r?\n$/, '');
      const split = cleaned.search(/\r?\n\r?\n/);
      if (split < 0) continue;
      const partHeaders = parseHeaders(cleaned.slice(0, split));
      parsePart(cleaned.slice(split).replace(/^\r?\n/, ''), partHeaders, output);
    }
  } else {
    const disposition = (headers['content-disposition'] || '').toLowerCase();
    if (disposition.includes('attachment')) {
      const name = (headers['content-disposition'].match(/filename="?([^";]+)"?/i) || [])[1] || 'attachment';
      output.attachments.push({ name, type: contentType, size: body.length });
    } else if (contentType === 'text/plain') output.text.push(body.trim());
    else if (contentType === 'text/html') output.html.push(body.trim());
  }
}

operations['eml-viewer'] = async (v, files) => {
  const raw = await readText(requireFile(files, 'eml'));
  const split = raw.search(/\r?\n\r?\n/);
  if (split < 0) throw new Error('This file does not look like a complete email.');
  const headers = parseHeaders(raw.slice(0, split));
  const output = { text: [], html: [], attachments: [] };
  parsePart(raw.slice(split).replace(/^\r?\n/, ''), headers, output);
  const plain = output.text.join('\n\n');
  let bodyHtml = '';
  if (output.html.length) {
    bodyHtml = sanitizeLocalHtml(output.html.join('<hr>'));
    bodyHtml = bodyHtml.replace(/<img\b[^>]*>/gi, '<p class="mini">[Remote image blocked for privacy]</p>').replace(/<link\b[^>]*>/gi, '');
  } else bodyHtml = '<pre style="white-space:pre-wrap">' + escapeHtml(plain || 'No text body found.') + '</pre>';
  const rows = ['from', 'to', 'cc', 'subject', 'date'].filter((key) => headers[key]).map((key) => `<tr><td>${key}</td><td>${escapeHtml(headers[key])}</td></tr>`).join('');
  const attachments = output.attachments.length ? `<h3>Attachments</h3><ul>${output.attachments.map((a) => `<li>${escapeHtml(a.name)} (${escapeHtml(a.type)}, ${a.size} bytes)</li>`).join('')}</ul>` : '';
  const html = `<div class="utility-list"><table class="kv-table">${rows}</table><div class="preview-frame">${bodyHtml}</div>${attachments}</div>`;
  const headerText = ['from', 'to', 'cc', 'subject', 'date'].filter((key) => headers[key]).map((key) => `${key}: ${headers[key]}`).join('\n');
  const text = `${headerText}\n\n${plain || '[HTML email body]'}${attachments ? '\n\nAttachments:\n' + output.attachments.map((a) => a.name).join('\n') : ''}`;
  return { html, text, copyText: text };
};
