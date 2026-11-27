import {
  operations, $, escapeHtml, requireFile, readText, readArrayBuffer, imageCanvas,
  canvasBlob, textResult, htmlResult, blobResult
} from './core.js';

const romanValues = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
function toRoman(number) {
  if (!Number.isInteger(number) || number < 1 || number > 3999999) throw new Error('Use a whole number from 1 to 3,999,999.');
  let output = '';
  for (const [value, symbol] of romanValues) while (number >= value) { output += symbol; number -= value; }
  return output;
}
function fromRoman(value) {
  const input = value.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(input)) throw new Error('Enter a valid Roman numeral.');
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < input.length; i++) total += map[input[i]] < map[input[i + 1]] ? -map[input[i]] : map[input[i]];
  if (total < 1 || total > 3999999 || toRoman(total) !== input) throw new Error('Use canonical Roman numerals such as IV and IX.');
  return total;
}

operations['roman-numeral-date'] = (v) => {
  if (v.mode === 'to-roman') {
    const match = String(v.date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) throw new Error('Choose a valid date.');
    const [, year, month, day] = match.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new Error('That calendar date is not valid.');
    return textResult(`${toRoman(day)} / ${toRoman(month)} / ${toRoman(year)}`);
  }
  const parts = v.roman.split('/').map((part) => part.trim());
  if (parts.length !== 3) throw new Error('Use DD / MM / YYYY in Roman numerals.');
  const [day, month, year] = parts.map(fromRoman);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new Error('That Roman date is not valid.');
  return textResult(date.toISOString().slice(0, 10));
};

function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, ' ');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const children = () => Array.from(node.childNodes).map(walk).join('');
    const tag = node.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag)) return '\n\n' + '#'.repeat(+tag[1]) + ' ' + children().trim() + '\n\n';
    if (tag === 'p') return '\n\n' + children().trim() + '\n\n';
    if (tag === 'strong' || tag === 'b') return '**' + children().trim() + '**';
    if (tag === 'em' || tag === 'i') return '*' + children().trim() + '*';
    if (tag === 'a') return `[${children().trim()}](${node.getAttribute('href') || ''})`;
    if (tag === 'code') return '`' + node.textContent + '`';
    if (tag === 'pre') return '\n\n```\n' + node.textContent + '\n```\n\n';
    if (tag === 'br') return '\n';
    if (tag === 'li') return '\n- ' + children().trim();
    if (tag === 'ul' || tag === 'ol') return '\n' + children() + '\n';
    if (tag === 'img') return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src') || ''})`;
    if (tag === 'table') {
      const rows = Array.from(node.querySelectorAll('tr')).map((row) => Array.from(row.querySelectorAll('th,td')).map((cell) => walk(cell).trim().replace(/\|/g, '\\|')));
      if (!rows.length) return '';
      return '\n\n| ' + rows[0].join(' | ') + ' |\n| ' + rows[0].map(() => '---').join(' | ') + ' |\n' + rows.slice(1).map((row) => '| ' + row.join(' | ') + ' |').join('\n') + '\n\n';
    }
    return children();
  };
  return walk(doc.body).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function docxToMarkdown(file) {
  const buffer = await readArrayBuffer(file);
  const result = await window.CT_VENDOR.mammoth.convertToHtml({ arrayBuffer: buffer });
  return htmlToMarkdown(result.value);
}

operations['document-to-markdown'] = async (v, files) => {
  const file = requireFile(files, 'document');
  const name = file.name.toLowerCase();
  if (name.endsWith('.docx')) return textResult(await docxToMarkdown(file));
  if (name.endsWith('.html') || name.endsWith('.htm')) return textResult(htmlToMarkdown(await readText(file)));
  return textResult(await readText(file));
};

async function getPdf(file) {
  const data = await readArrayBuffer(file);
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/js/vendor/pdfjs/pdf.worker.min.js';
  return window.pdfjsLib.getDocument({ data }).promise;
}

operations['pdf-to-markdown'] = async (v, files) => {
  const pdf = await getPdf(requireFile(files, 'pdf'));
  const pages = [];
  for (let number = 1; number <= pdf.numPages; number++) {
    const page = await pdf.getPage(number);
    const content = await page.getTextContent();
    const lines = new Map();
    for (const item of content.items) {
      if (!item.str) continue;
      const y = Math.round(item.transform[5]);
      const key = Math.round(y / 4) * 4;
      if (!lines.has(key)) lines.set(key, []);
      lines.get(key).push(item.str);
    }
    const text = Array.from(lines.entries()).sort((a, b) => b[0] - a[0]).map(([, parts]) => parts.join(' ')).join('\n');
    pages.push(`## Page ${number}\n\n${text}`);
  }
  return textResult(pages.join('\n\n'));
};

operations['word-to-markdown'] = async (v, files) => textResult(await docxToMarkdown(requireFile(files, 'document')));

function xmlText(element) {
  return Array.from(element.getElementsByTagName('*')).filter((node) => node.tagName.toLowerCase() === 't').map((node) => node.textContent).join('');
}
function columnIndex(reference) {
  const match = String(reference || 'A1').toUpperCase().match(/^([A-Z]{1,3})([1-9]\d*)$/);
  if (!match) throw new Error('The workbook contains an invalid cell reference.');
  const index = match[1].split('').reduce((sum, letter) => sum * 26 + letter.charCodeAt(0) - 64, 0) - 1;
  const row = Number(match[2]);
  if (index >= 256 || row > 10000) throw new Error('This worksheet is too large. Use up to 256 columns and 10,000 rows.');
  return index;
}

operations['excel-to-markdown'] = async (v, files) => {
  const file = requireFile(files, 'workbook');
  if (file.size > 25 * 1024 * 1024) throw new Error('This workbook is too large. Choose an XLSX file under 25 MB.');
  const zip = await new window.CT_VENDOR.JSZip().loadAsync(await readArrayBuffer(file));
  const workbookEntry = zip.file('xl/workbook.xml'), relsEntry = zip.file('xl/_rels/workbook.xml.rels');
  if (!workbookEntry || !relsEntry) throw new Error('This file is not a valid XLSX workbook.');
  const workbookText = await workbookEntry.async('string');
  const relsText = await relsEntry.async('string');
  if (workbookText.length > 20000000 || relsText.length > 2000000) throw new Error('The workbook metadata is too large to process safely.');
  const workbook = new DOMParser().parseFromString(workbookText, 'application/xml');
  const rels = new DOMParser().parseFromString(relsText, 'application/xml');
  const relMap = new Map(Array.from(rels.getElementsByTagName('Relationship')).map((rel) => [rel.getAttribute('Id'), rel.getAttribute('Target')]));
  const sheet = workbook.getElementsByTagName('sheet')[0];
  if (!sheet) throw new Error('The workbook has no sheets.');
  const target = relMap.get(sheet.getAttribute('r:id')) || relMap.get(sheet.getAttribute('rel:id'));
  if (!target) throw new Error('The worksheet relationship is missing.');
  const sheetPath = target.replace(/^\//, '').startsWith('xl/') ? target.replace(/^\//, '') : 'xl/' + target.replace(/^\//, '');
  const sheetEntry = zip.file(sheetPath);
  if (!sheetEntry) throw new Error('The worksheet file is missing.');
  const sheetText = await sheetEntry.async('string');
  if (sheetText.length > 20000000) throw new Error('This worksheet is too large to process safely.');
  const sheetXml = new DOMParser().parseFromString(sheetText, 'application/xml');
  let shared = [];
  if (zip.file('xl/sharedStrings.xml')) {
    const sharedText = await zip.file('xl/sharedStrings.xml').async('string');
    if (sharedText.length > 20000000) throw new Error('The shared string table is too large to process safely.');
    const sharedXml = new DOMParser().parseFromString(sharedText, 'application/xml');
    shared = Array.from(sharedXml.getElementsByTagName('si')).map(xmlText);
  }
  let cellCount = 0;
  const rows = Array.from(sheetXml.getElementsByTagName('row')).map((row) => {
    const rowReference = row.getAttribute('r');
    if (rowReference && Number(rowReference) > 10000) throw new Error('This worksheet has more than 10,000 rows.');
    const cells = [];
    for (const cell of Array.from(row.getElementsByTagName('c'))) {
      if (++cellCount > 100000) throw new Error('This worksheet has too many cells to convert safely.');
      const index = columnIndex(cell.getAttribute('r') || 'A1');
      const type = cell.getAttribute('t');
      const valueNode = Array.from(cell.getElementsByTagName('*')).find((node) => node.tagName.toLowerCase() === 'v') || Array.from(cell.getElementsByTagName('*')).find((node) => node.tagName.toLowerCase() === 't');
      let value = valueNode?.textContent || '';
      if (type === 's') value = shared[Number(value)] || '';
      else if (type === 'inlineStr') value = xmlText(cell);
      else if (type === 'b') value = value === '1' ? 'TRUE' : 'FALSE';
      cells[index] = String(value).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
    }
    return cells;
  }).filter((row) => row.some((cell) => cell !== undefined && cell !== ''));
  if (!rows.length) throw new Error('The worksheet is empty.');
  const width = Math.max(...rows.map((row) => row.length));
  const normalise = (row) => Array.from({ length: width }, (_, i) => row[i] || '');
  const header = normalise(rows[0]);
  const output = `| ${header.join(' | ')} |\n| ${header.map(() => '---').join(' | ')} |\n` + rows.slice(1).map((row) => `| ${normalise(row).join(' | ')} |`).join('\n');
  if (output.length > 5000000) throw new Error('The resulting Markdown table is too large.');
  return textResult(output);
};

async function renderPdfPage(page, canvas, viewport) {
  const context = canvas.getContext('2d');
  const originalFrame = window.requestAnimationFrame;
  const originalCancel = window.cancelAnimationFrame;
  window.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 16);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
  try {
    await page.render({ canvasContext: context, viewport }).promise;
  } finally {
    window.requestAnimationFrame = originalFrame;
    window.cancelAnimationFrame = originalCancel;
  }
}

operations['scanned-pdf'] = async (v, files) => {
  const pdf = await getPdf(requireFile(files, 'pdf'));
  const output = await window.PDFLib.PDFDocument.create();
  const limit = v.pages === 'first' ? 1 : v.pages === 'first5' ? Math.min(5, pdf.numPages) : pdf.numPages;
  for (let number = 1; number <= limit; number++) {
    const page = await pdf.getPage(number);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    await renderPdfPage(page, canvas, viewport);
    if (v.grayscale || v.noise || v.rotation) {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < image.data.length; i += 4) {
        if (v.grayscale) { const gray = .2126 * image.data[i] + .7152 * image.data[i + 1] + .0722 * image.data[i + 2]; image.data[i] = image.data[i + 1] = image.data[i + 2] = gray; }
        if (v.noise) { const noise = (Math.random() - .5) * v.noise * 4; image.data[i] += noise; image.data[i + 1] += noise; image.data[i + 2] += noise; }
      }
      ctx.putImageData(image, 0, 0);
    }
    let finalCanvas = canvas;
    if (v.rotation) {
      finalCanvas = document.createElement('canvas'); finalCanvas.width = canvas.width; finalCanvas.height = canvas.height;
      const fctx = finalCanvas.getContext('2d'); fctx.translate(finalCanvas.width / 2, finalCanvas.height / 2); fctx.rotate(v.rotation * Math.PI / 180); fctx.scale(.94, .94); fctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    }
    const bytes = await canvasBlob(finalCanvas, 'image/png').then((blob) => blob.arrayBuffer());
    const image = await output.embedPng(bytes);
    const pdfPage = output.addPage([finalCanvas.width, finalCanvas.height]);
    pdfPage.drawImage(image, { x: 0, y: 0, width: finalCanvas.width, height: finalCanvas.height });
  }
  const blob = new Blob([await output.save()], { type: 'application/pdf' });
  return blobResult(blob, 'scanned.pdf', { status: `${limit} page${limit === 1 ? '' : 's'} ready` });
};

operations['number-to-roman'] = (v) => textResult(toRoman(Number(String(v.number).replace(/,/g, ''))));

operations['binary-translator'] = (v) => {
  if (!v.input.trim()) throw new Error('Enter some text first.');
  if (v.mode === 'encode') return textResult(Array.from(new TextEncoder().encode(v.input)).map((byte) => byte.toString(2).padStart(8, '0')).join(' '));
  const parts = v.input.trim().split(/\s+/);
  if (!parts.length || parts.some((part) => !/^[01]{1,8}$/.test(part))) throw new Error('Enter binary bytes made of 0 and 1.');
  return textResult(new TextDecoder().decode(new Uint8Array(parts.map((part) => parseInt(part, 2)))));
};

operations['avif-to-png'] = async (v, files) => {
  const canvas = await imageCanvas(requireFile(files));
  const blob = await canvasBlob(canvas, 'image/png');
  return blobResult(blob, 'converted.png', { status: 'PNG ready' });
};
