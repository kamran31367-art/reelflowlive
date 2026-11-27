import { interactiveHandlers } from './interactive.js';

const operations = {};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function hexToRgb(hex) {
  let value = String(hex || '#000000').replace('#', '').trim();
  if (value.length === 3) value = value.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(value)) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return { r: Math.round(hue(h + 1 / 3) * 255), g: Math.round(hue(h) * 255), b: Math.round(hue(h - 1 / 3) * 255) };
}

function rgbToOklch(r, g, b) {
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const BB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + BB * BB);
  let H = C < 0.00001 ? 0 : Math.atan2(BB, A) * 180 / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: H };
}

function parseColor(value) {
  const input = String(value || '').trim().toLowerCase();
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/.test(input)) return hexToRgb(input);
  const rgb = input.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] };
  const hsl = input.match(/^hsla?\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%/i);
  if (hsl) return hslToRgb(+hsl[1], +hsl[2], +hsl[3]);
  return hexToRgb(input);
}

function formatColor(rgb, format) {
  if (format === 'rgb') return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
  if (format === 'hsl') { const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b); return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`; }
  if (format === 'oklch') { const c = rgbToOklch(rgb.r, rgb.g, rgb.b); return `oklch(${(c.l * 100).toFixed(2)}% ${c.c.toFixed(4)} ${c.h.toFixed(2)})`; }
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function canvasBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('The browser could not encode this image.')), type, quality));
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = typeof source === 'string' ? source : URL.createObjectURL(source);
    img.onload = () => { if (typeof source !== 'string') URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { if (typeof source !== 'string') URL.revokeObjectURL(url); reject(new Error('This image format could not be decoded by your browser.')); };
    img.src = url;
  });
}

async function imageCanvas(source) {
  const img = await loadImage(source);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  return canvas;
}

function readText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('The file could not be read.'));
    reader.readAsText(file);
  });
}

function readArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('The file could not be read.'));
    reader.readAsArrayBuffer(file);
  });
}

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('The file could not be read.'));
    reader.readAsDataURL(file);
  });
}

function requireFile(files, id = 'image') {
  const value = files[id];
  const first = Array.isArray(value) ? value[0] : value;
  if (!first) throw new Error('Choose a file first.');
  return first;
}

function requireFiles(files, id = 'images') {
  const value = files[id];
  const list = Array.isArray(value) ? value : value ? [value] : [];
  if (!list.length) throw new Error('Choose at least one file.');
  return list;
}

function textResult(text, extra = {}) {
  return { text: String(text ?? ''), copyText: String(text ?? ''), ...extra };
}

function htmlResult(html, extra = {}) {
  return { html, copyText: extra.copyText || '', ...extra };
}

function canvasResult(canvas, extra = {}) {
  return { canvas, ...extra };
}

function blobResult(blob, filename, extra = {}) {
  return { blob, filename, text: extra.text || 'Ready to download.', ...extra };
}

let config = {};
let values = {};
let files = {};
let current = null;
let running = false;
let runAgain = false;
let cleanup = [];
let autoRunTimer = null;
const onCleanup = (fn) => cleanup.push(fn);
const runCleanup = () => { while (cleanup.length) { try { cleanup.pop()(); } catch (error) { console.warn(error); } } };
const scheduleAutoRun = () => {
  if (!config.autoRun) return;
  clearTimeout(autoRunTimer);
  autoRunTimer = setTimeout(() => { autoRunTimer = null; run(); }, 180);
};

function setBusy(busy) {
  running = busy;
  const button = $('#utilityRun');
  if (button) { button.disabled = busy; button.textContent = busy ? 'Working…' : (config.actionLabel || 'Generate'); }
}

function updateCurrent(patch) {
  if (!current) current = {};
  Object.assign(current, patch);
  const status = $('#utilityStatus');
  if (status) status.textContent = current.status || (current.blob ? 'Ready' : 'Complete');
  const download = $('#utilityDownload'), copy = $('#utilityCopy');
  const downloadable = current.blob || current.canvas || current.downloadUrl || current.text != null || current.copyText;
  if (download) download.disabled = !downloadable || !!config.disableDownload || !!current.disableDownload;
  if (copy) copy.disabled = !!config.disableCopy || !!current.disableCopy || !(current.copyText || current.text || current.html);
}

function updateRange(field) {
  const input = document.getElementById(field.id);
  const output = document.getElementById(field.id + 'Value');
  if (input && output) output.textContent = input.value;
}

function readValues() {
  const next = {};
  for (const field of config.fields || []) {
    const element = document.getElementById(field.id);
    if (!element) continue;
    if (field.type === 'file') continue;
    if (field.type === 'checkbox') next[field.id] = element.checked;
    else if (field.type === 'number' || field.type === 'range') next[field.id] = element.value === '' ? '' : Number(element.value);
    else next[field.id] = element.value;
  }
  values = next;
  return values;
}

function resetOutput() {
  clearTimeout(autoRunTimer);
  autoRunTimer = null;
  runCleanup();
  current = null;
  const preview = $('#utilityPreview'), canvas = $('#utilityCanvas'), text = $('#utilityText'), empty = $('#utilityEmpty');
  if (preview) { preview.hidden = true; preview.innerHTML = ''; }
  if (canvas) canvas.hidden = true;
  if (text) { text.hidden = false; text.textContent = config.placeholder || 'Your result will appear here.'; }
  if (empty) { empty.hidden = false; empty.textContent = config.emptyText || 'Add your input to see the result.'; }
  const status = $('#utilityStatus'); if (status) status.textContent = 'Ready';
  const download = $('#utilityDownload'), copy = $('#utilityCopy');
  if (download) download.disabled = true;
  if (copy) copy.disabled = true;
}

function renderResult(result) {
  runCleanup();
  current = result || {};
  const preview = $('#utilityPreview'), canvas = $('#utilityCanvas'), text = $('#utilityText'), empty = $('#utilityEmpty');
  if (preview) { preview.hidden = true; preview.innerHTML = ''; }
  if (canvas) canvas.hidden = true;
  if (text) text.hidden = true;
  if (empty) empty.hidden = true;
  if (result.canvas && canvas) {
    canvas.width = result.canvas.width; canvas.height = result.canvas.height;
    canvas.getContext('2d').drawImage(result.canvas, 0, 0);
    canvas.hidden = false;
  }
  if (result.html && preview) {
    preview.innerHTML = window.CT_VENDOR?.DOMPurify ? window.CT_VENDOR.DOMPurify.sanitize(result.html) : result.html;
    preview.hidden = false;
  }
  if (result.text != null && text) {
    text.textContent = String(result.text);
    text.hidden = false;
  }
  if (!result.canvas && !result.html && result.text == null && empty) {
    empty.hidden = false;
    empty.textContent = config.emptyText || 'Add your input to see the result.';
  }
  const status = $('#utilityStatus'); if (status) status.textContent = result.status || (result.blob ? 'Ready' : 'Complete');
  const download = $('#utilityDownload'), copy = $('#utilityCopy');
  const downloadable = result.blob || result.canvas || result.downloadUrl || result.text != null || result.copyText;
  if (download) download.disabled = !downloadable || !!config.disableDownload || !!result.disableDownload;
  if (copy) copy.disabled = !!config.disableCopy || !!result.disableCopy || !(result.copyText || result.text || result.html);
  if (result.interactive && interactiveHandlers[result.interactive]) interactiveHandlers[result.interactive](preview, result, { config, values, files, onCleanup, setCurrent: updateCurrent });
  if (result.onMount) result.onMount(preview, { onCleanup, setCurrent: updateCurrent });
}

async function run() {
  if (running) { runAgain = true; return; }
  setBusy(true);
  try {
    do {
      runAgain = false;
      readValues();
      const runValues = { ...values };
      const runFiles = { ...files };
      try {
        const operation = operations[config.operation];
        if (!operation) throw new Error('This tool operation is not available.');
        const result = await operation(runValues, runFiles);
        if (!runAgain) renderResult(result);
      } catch (error) {
        console.error(error);
        if (!runAgain) {
          runCleanup();
          current = null;
          const text = $('#utilityText'), preview = $('#utilityPreview'), canvas = $('#utilityCanvas'), empty = $('#utilityEmpty');
          if (preview) preview.hidden = true;
          if (canvas) canvas.hidden = true;
          if (empty) empty.hidden = true;
          if (text) { text.hidden = false; text.textContent = 'Error: ' + (error?.message || error); }
          const status = $('#utilityStatus'); if (status) status.textContent = 'Error';
          const download = $('#utilityDownload'), copy = $('#utilityCopy');
          if (download) download.disabled = true;
          if (copy) copy.disabled = true;
          window.CT?.toast?.(error?.message || 'Something went wrong.', 'error');
        }
      }
    } while (runAgain);
  } finally {
    setBusy(false);
  }
}

function reset() {
  runCleanup();
  for (const field of config.fields || []) {
    const element = document.getElementById(field.id);
    if (!element) continue;
    if (field.type === 'file') { element.value = ''; files[field.id] = field.multiple ? [] : null; }
    else if (field.type === 'checkbox') element.checked = !!field.value;
    else if (field.type === 'number' || field.type === 'range') element.value = field.value ?? '';
    else element.value = field.value ?? '';
    updateRange(field);
  }
  resetOutput();
  if (config.autoRun) run();
}

function wireDropzone(field) {
  const input = document.getElementById(field.id);
  const drop = document.getElementById(field.id + 'Drop');
  if (!input || !drop) return;
  const choose = () => input.click();
  drop.addEventListener('click', choose);
  drop.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(); } });
  ['dragenter', 'dragover'].forEach((name) => drop.addEventListener(name, (event) => { event.preventDefault(); drop.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach((name) => drop.addEventListener(name, (event) => { event.preventDefault(); drop.classList.remove('dragover'); }));
  drop.addEventListener('drop', (event) => {
    const list = Array.from(event.dataTransfer?.files || []);
    if (!list.length) return;
    const transfer = new DataTransfer();
    (field.multiple ? list : list.slice(0, 1)).forEach((item) => transfer.items.add(item));
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  input.addEventListener('change', () => {
    const list = Array.from(input.files || []);
    files[field.id] = field.multiple ? list : (list[0] || null);
    scheduleAutoRun();
  });
}

async function downloadCurrent() {
  if (!current || config.disableDownload) return;
  try {
    if (current.blob) {
      const filename = current.filename || `${config.operation}.${config.downloadExt || 'txt'}`;
      window.CT.downloadBlob(current.blob, filename);
    } else if (current.canvas) {
      const blob = await canvasBlob(current.canvas, config.downloadExt === 'jpg' ? 'image/jpeg' : 'image/png', 0.92);
      window.CT.downloadBlob(blob, `${config.operation}.${config.downloadExt || 'png'}`);
    } else if (current.downloadUrl) {
      window.CT.downloadUrl(current.downloadUrl, current.filename || `${config.operation}.${config.downloadExt || 'txt'}`);
    } else if (current.text != null || current.copyText) {
      const blob = new Blob([current.text ?? current.copyText ?? ''], { type: 'text/plain;charset=utf-8' });
      window.CT.downloadBlob(blob, current.filename || `${config.operation}.${config.downloadExt || 'txt'}`);
    }
  } catch (error) {
    window.CT?.toast?.(error.message || 'Download failed.', 'error');
  }
}

async function copyCurrent() {
  if (!current || config.disableCopy) return;
  const value = current.copyText || current.text || current.html || '';
  if (!value) return;
  await window.CT.copy(value);
  window.CT?.toast?.('Copied to clipboard.');
}

function init() {
  const node = document.getElementById('utilityConfig');
  if (!node) return;
  try { config = JSON.parse(node.textContent); } catch (error) { console.error(error); return; }
  for (const field of config.fields || []) {
    if (field.type === 'file') { files[field.id] = field.multiple ? [] : null; wireDropzone(field); }
    const element = document.getElementById(field.id);
    if (!element) continue;
    if (field.type === 'range') {
      updateRange(field);
      element.addEventListener('input', () => { updateRange(field); scheduleAutoRun(); });
    } else if (field.type !== 'file') {
      element.addEventListener('input', scheduleAutoRun);
      element.addEventListener('change', scheduleAutoRun);
    }
  }
  document.addEventListener('keydown', (event) => {
    if (config.operation === 'keycode-info') {
      values.key = event.key;
      const input = document.getElementById('key');
      if (input) input.value = event.key === ' ' ? 'Space' : event.key;
      if (config.autoRun) run();
    }
  });
  document.addEventListener('paste', (event) => {
    if (config.operation !== 'paste-image-download') return;
    const item = Array.from(event.clipboardData?.items || []).find((entry) => entry.type.startsWith('image/'));
    if (!item) return;
    event.preventDefault();
    const pasted = item.getAsFile();
    if (!pasted) return;
    files.image = pasted;
    run();
  });
  $('#utilityRun')?.addEventListener('click', run);
  $('#utilityReset')?.addEventListener('click', reset);
  $('#utilityDownload')?.addEventListener('click', downloadCurrent);
  $('#utilityCopy')?.addEventListener('click', copyCurrent);
  resetOutput();
  if (config.autoRun) run();
}

export {
  operations, $, $$, clamp, randomInt, pick, escapeHtml, sleep, shuffle,
  hexToRgb, rgbToHex, rgbToHsl, hslToRgb, rgbToOklch, parseColor, formatColor,
  canvasBlob, loadImage, imageCanvas, readText, readArrayBuffer, readDataUrl,
  requireFile, requireFiles, textResult, htmlResult, canvasResult, blobResult,
  init, run
};
