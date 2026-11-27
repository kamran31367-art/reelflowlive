import {
  operations, $, $$, clamp, randomInt, pick, escapeHtml, shuffle, hexToRgb, rgbToHex,
  rgbToHsl, imageCanvas, loadImage, requireFile, requireFiles, readArrayBuffer,
  canvasBlob, textResult, htmlResult, canvasResult, blobResult
} from './core.js';

const vendor = () => window.CT_VENDOR || {};

async function sourceCanvas(files) {
  return imageCanvas(requireFile(files));
}

function imageOutput(canvas, extra = {}) {
  return canvasResult(canvas, { status: 'Image ready', ...extra });
}

operations['image-watermark'] = async (v, files) => {
  const canvas = await sourceCanvas(files);
  const ctx = canvas.getContext('2d');
  const scale = Math.max(1, canvas.width / 1000);
  const size = v.size * scale;
  ctx.save(); ctx.globalAlpha = v.opacity / 100; ctx.fillStyle = v.color;
  ctx.font = `700 ${size}px system-ui, sans-serif`;
  ctx.textBaseline = 'middle';
  const metrics = ctx.measureText(v.watermark);
  const pad = 20 * scale;
  const x = v.position.includes('right') ? canvas.width - metrics.width - pad : v.position.includes('left') ? pad : (canvas.width - metrics.width) / 2;
  const y = v.position.includes('bottom') ? canvas.height - size : v.position.includes('top') ? size : canvas.height / 2;
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 8 * scale;
  ctx.fillText(v.watermark, x, y);
  ctx.restore();
  return imageOutput(canvas);
};

operations['laser-eyes-meme'] = async (v, files) => {
  const canvas = await sourceCanvas(files);
  const ctx = canvas.getContext('2d');
  const eyes = [[v.leftX / 100 * canvas.width, v.leftY / 100 * canvas.height], [v.rightX / 100 * canvas.width, v.rightY / 100 * canvas.height]];
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y] of eyes) {
    const targets = [[-canvas.width * .2, -canvas.height * .2], [canvas.width * 1.2, -canvas.height * .2], [-canvas.width * .2, canvas.height * 1.2], [canvas.width * 1.2, canvas.height * 1.2]];
    for (const [tx, ty] of targets) {
      const gradient = ctx.createLinearGradient(x, y, tx, ty);
      gradient.addColorStop(0, v.laserColor); gradient.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.strokeStyle = gradient; ctx.lineWidth = canvas.width * .012; ctx.shadowColor = v.laserColor; ctx.shadowBlur = v.intensity * .5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(x, y, canvas.width * .015, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.shadowBlur = v.intensity; ctx.fill();
  }
  ctx.restore();
  return imageOutput(canvas);
};

operations['invert-image'] = async (v, files) => {
  const canvas = await sourceCanvas(files);
  const ctx = canvas.getContext('2d');
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < image.data.length; i += 4) {
    image.data[i] = 255 - image.data[i]; image.data[i + 1] = 255 - image.data[i + 1]; image.data[i + 2] = 255 - image.data[i + 2];
  }
  ctx.putImageData(image, 0, 0);
  return imageOutput(canvas);
};

operations['image-pixelator'] = async (v, files) => {
  const canvas = await sourceCanvas(files);
  const small = document.createElement('canvas');
  small.width = Math.max(1, Math.round(canvas.width / v.blockSize));
  small.height = Math.max(1, Math.round(canvas.height / v.blockSize));
  const sctx = small.getContext('2d'); sctx.imageSmoothingEnabled = true; sctx.drawImage(canvas, 0, 0, small.width, small.height);
  const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
  return imageOutput(canvas);
};

operations['image-blur-pixelate'] = async (v, files) => {
  if (v.mode === 'pixelate') return operations['image-pixelator']({ blockSize: v.amount * 2 }, files);
  const canvas = await sourceCanvas(files);
  const ctx = canvas.getContext('2d');
  ctx.save(); ctx.filter = `blur(${v.amount}px)`; ctx.drawImage(canvas, 0, 0); ctx.restore();
  return imageOutput(canvas);
};

operations['image-color-picker'] = async (v, files) => {
  const canvas = await sourceCanvas(files);
  const ctx = canvas.getContext('2d');
  const x = clamp(Math.round(v.x / 100 * (canvas.width - 1)), 0, canvas.width - 1);
  const y = clamp(Math.round(v.y / 100 * (canvas.height - 1)), 0, canvas.height - 1);
  const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
  const hex = rgbToHex(r, g, b), rgb = `rgb(${r}, ${g}, ${b})`, hslValue = rgbToHsl(r, g, b), hsl = `hsl(${hslValue.h} ${hslValue.s}% ${hslValue.l}%)`;
  const text = `HEX: ${hex}\nRGB: ${rgb}\nHSL: ${hsl}\nPosition: ${x}, ${y}\nAlpha: ${(a / 255 * 100).toFixed(1)}%`;
  const html = `<div class="utility-list"><div class="utility-swatch" style="background:${hex}"></div><pre class="utility-code">${escapeHtml(text)}</pre></div>`;
  return { html, text, copyText: `${hex}\n${rgb}\n${hsl}` };
};

operations['random-color-generator'] = (v) => {
  const colours = Array.from({ length: v.count }, () => {
    const rgb = { r: randomInt(0, 255), g: randomInt(0, 255), b: randomInt(0, 255) };
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const value = v.format === 'rgb' ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : v.format === 'hsl' ? (() => { const h = rgbToHsl(rgb.r, rgb.g, rgb.b); return `hsl(${h.h} ${h.s}% ${h.l}%)`; })() : hex;
    return { hex, value };
  });
  const html = `<div class="utility-list">${colours.map((c) => `<div class="utility-item"><span class="utility-chip"><i style="background:${c.hex}"></i>${escapeHtml(c.value)}</span><button class="btn btn-ghost" type="button" data-copy="${c.value}">Copy</button></div>`).join('')}</div>`;
  return { html, copyText: colours.map((c) => c.value).join('\n'), onMount: (preview) => preview.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', () => window.CT.copy(button.dataset.copy))) };
};

async function encodeGif(frames, options) {
  return new Promise((resolve, reject) => {
    if (!window.GIF) { reject(new Error('The GIF encoder is unavailable.')); return; }
    const gif = new window.GIF({ workers: 2, quality: options.quality || 10, colors: options.colors || 256, workerScript: '/assets/js/vendor/gif/gif.worker.js', width: options.width, height: options.height });
    frames.forEach((frame) => gif.addFrame(frame.canvas, { delay: frame.delay, copy: true }));
    gif.on('finished', (blob) => resolve(blob));
    gif.on('abort', () => reject(new Error('GIF encoding was cancelled.')));
    try { gif.render(); } catch (error) { reject(error); }
  });
}

async function decodeGif(file) {
  const buffer = await readArrayBuffer(file);
  const parsed = vendor().parseGIF(buffer);
  const frames = vendor().decompressFrames(parsed, true);
  return { parsed, frames };
}

operations['resize-gif'] = async (v, files) => {
  const { parsed, frames } = await decodeGif(requireFile(files, 'gif'));
  const scale = v.width / parsed.lsd.width;
  const width = Math.max(1, Math.round(v.width));
  const height = Math.max(1, Math.round(parsed.lsd.height * scale));
  const composite = document.createElement('canvas'); composite.width = parsed.lsd.width; composite.height = parsed.lsd.height;
  const cctx = composite.getContext('2d');
  const outputFrames = [];
  for (const frame of frames) {
    const previous = frame.disposalType === 3 ? cctx.getImageData(0, 0, composite.width, composite.height) : null;
    const patch = document.createElement('canvas'); patch.width = frame.dims.width; patch.height = frame.dims.height;
    patch.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height), 0, 0);
    cctx.drawImage(patch, frame.dims.left, frame.dims.top);
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.drawImage(composite, 0, 0, width, height);
    outputFrames.push({ canvas, delay: Math.round(1000 / v.fps) });
    if (frame.disposalType === 2) cctx.clearRect(0, 0, composite.width, composite.height);
    if (previous) cctx.putImageData(previous, 0, 0);
  }
  const blob = await encodeGif(outputFrames, { width, height, quality: 10 });
  return blobResult(blob, 'resized.gif', { status: 'GIF ready' });
};

operations['compress-gif'] = async (v, files) => {
  const { parsed, frames } = await decodeGif(requireFile(files, 'gif'));
  const scale = v.scale / 100;
  const width = Math.max(1, Math.round(parsed.lsd.width * scale));
  const height = Math.max(1, Math.round(parsed.lsd.height * scale));
  const originalFps = 1000 / Math.max(1, frames.reduce((sum, frame) => sum + frame.delay, 0) / frames.length);
  const step = Math.max(1, Math.round(originalFps / v.fps));
  const composite = document.createElement('canvas'); composite.width = parsed.lsd.width; composite.height = parsed.lsd.height;
  const cctx = composite.getContext('2d');
  const outputFrames = [];
  frames.forEach((frame, index) => {
    const previous = frame.disposalType === 3 ? cctx.getImageData(0, 0, composite.width, composite.height) : null;
    const patch = document.createElement('canvas'); patch.width = frame.dims.width; patch.height = frame.dims.height;
    patch.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height), 0, 0);
    cctx.drawImage(patch, frame.dims.left, frame.dims.top);
    if (index % step === 0) {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.drawImage(composite, 0, 0, width, height);
      outputFrames.push({ canvas, delay: Math.round(1000 / v.fps) });
    }
    if (frame.disposalType === 2) cctx.clearRect(0, 0, composite.width, composite.height);
    if (previous) cctx.putImageData(previous, 0, 0);
  });
  const blob = await encodeGif(outputFrames, { width, height, quality: 20, colors: v.colors });
  return blobResult(blob, 'compressed.gif', { status: 'GIF ready' });
};

operations['trim-transparent-pixels'] = async (v, files) => {
  const canvas = await sourceCanvas(files);
  const ctx = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    if (data[(y * canvas.width + x) * 4 + 3] > 0) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
  if (maxX < 0) throw new Error('This image is fully transparent.');
  minX = Math.max(0, minX - v.padding); minY = Math.max(0, minY - v.padding);
  maxX = Math.min(canvas.width - 1, maxX + v.padding); maxY = Math.min(canvas.height - 1, maxY + v.padding);
  const output = document.createElement('canvas'); output.width = maxX - minX + 1; output.height = maxY - minY + 1;
  output.getContext('2d').drawImage(canvas, minX, minY, output.width, output.height, 0, 0, output.width, output.height);
  return imageOutput(output);
};

operations['image-border'] = async (v, files) => {
  const source = await sourceCanvas(files);
  const size = Math.round(v.size);
  const output = document.createElement('canvas'); output.width = source.width + size * 2; output.height = source.height + size * 2;
  const ctx = output.getContext('2d');
  ctx.fillStyle = v.borderColor; ctx.fillRect(0, 0, output.width, output.height);
  if (v.style === 'rounded') {
    ctx.save(); roundRect(ctx, 0, 0, output.width, output.height, size * 1.5); ctx.clip(); ctx.drawImage(source, size, size); ctx.restore();
  } else {
    ctx.drawImage(source, size, size);
    if (v.style === 'double') {
      ctx.strokeStyle = v.borderColor; ctx.lineWidth = Math.max(2, size * .22); ctx.strokeRect(size * .45, size * .45, output.width - size * .9, output.height - size * .9);
      ctx.strokeRect(size, size, source.width, source.height);
    } else if (v.style === 'dashed') {
      ctx.save(); ctx.strokeStyle = v.borderColor; ctx.lineWidth = Math.max(2, size * .3); ctx.setLineDash([size * .55, size * .35]);
      ctx.strokeRect(size * .5, size * .5, output.width - size, output.height - size); ctx.restore();
    }
  }
  return imageOutput(output);
};

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

operations['image-splitter'] = async (v, files) => {
  const source = await sourceCanvas(files);
  if (v.columns > source.width || v.rows > source.height) throw new Error('The grid cannot have more rows or columns than the image has pixels.');
  const zip = new (vendor().JSZip)();
  const thumbs = [];
  for (let row = 0; row < v.rows; row++) for (let col = 0; col < v.columns; col++) {
    const left = Math.floor(col * source.width / v.columns);
    const top = Math.floor(row * source.height / v.rows);
    const right = Math.floor((col + 1) * source.width / v.columns);
    const bottom = Math.floor((row + 1) * source.height / v.rows);
    const canvas = document.createElement('canvas'); canvas.width = right - left; canvas.height = bottom - top;
    canvas.getContext('2d').drawImage(source, left, top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    const blob = await canvasBlob(canvas);
    zip.file(`tile-${row + 1}-${col + 1}.png`, blob);
    thumbs.push(`<img src="${canvas.toDataURL('image/png')}" alt="Tile ${row + 1}-${col + 1}" style="max-width:150px;border-radius:6px">`);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const html = `<div class="page-grid">${thumbs.join('')}</div>`;
  return { html, blob, filename: 'image-tiles.zip', copyText: '', status: `${v.rows * v.columns} tiles ready` };
};

operations['merge-images'] = async (v, files) => {
  const list = requireFiles(files);
  const canvases = await Promise.all(list.map((file) => imageCanvas(file)));
  const gap = Math.round(v.gap);
  let width, height;
  if (v.layout === 'horizontal') { width = canvases.reduce((sum, c) => sum + c.width, 0) + gap * (canvases.length - 1); height = Math.max(...canvases.map((c) => c.height)); }
  else if (v.layout === 'vertical') { width = Math.max(...canvases.map((c) => c.width)); height = canvases.reduce((sum, c) => sum + c.height, 0) + gap * (canvases.length - 1); }
  else { width = Math.max(...canvases.map((c) => c.width)) * v.columns + gap * (v.columns - 1); const rows = Math.ceil(canvases.length / v.columns); height = Math.max(...canvases.map((c) => c.height)) * rows + gap * (rows - 1); }
  const output = document.createElement('canvas'); output.width = Math.max(1, width); output.height = Math.max(1, height);
  const ctx = output.getContext('2d'); ctx.fillStyle = v.background; ctx.fillRect(0, 0, width, height);
  let x = 0, y = 0;
  canvases.forEach((canvas, index) => {
    if (v.layout === 'horizontal') { ctx.drawImage(canvas, x, (height - canvas.height) / 2); x += canvas.width + gap; }
    else if (v.layout === 'vertical') { ctx.drawImage(canvas, (width - canvas.width) / 2, y); y += canvas.height + gap; }
    else {
      const col = index % v.columns, row = Math.floor(index / v.columns);
      const maxW = Math.max(...canvases.map((c) => c.width)), maxH = Math.max(...canvases.map((c) => c.height));
      ctx.drawImage(canvas, col * (maxW + gap) + (maxW - canvas.width) / 2, row * (maxH + gap) + (maxH - canvas.height) / 2);
    }
  });
  return imageOutput(output);
};

operations['pixel-art-converter'] = async (v, files) => {
  const source = await sourceCanvas(files);
  const small = document.createElement('canvas');
  small.width = Math.max(1, Math.round(source.width / v.pixelSize)); small.height = Math.max(1, Math.round(source.height / v.pixelSize));
  const sctx = small.getContext('2d'); sctx.drawImage(source, 0, 0, small.width, small.height);
  const image = sctx.getImageData(0, 0, small.width, small.height);
  const counts = new Map();
  for (let i = 0; i < image.data.length; i += 4) {
    const key = [image.data[i] >> 3, image.data[i + 1] >> 3, image.data[i + 2] >> 3].join(',');
    const entry = counts.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    entry.count++; entry.r += image.data[i]; entry.g += image.data[i + 1]; entry.b += image.data[i + 2]; counts.set(key, entry);
  }
  const palette = Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, v.colors).map((c) => [Math.round(c.r / c.count), Math.round(c.g / c.count), Math.round(c.b / c.count)]);
  const work = new Float32Array(image.data.length);
  for (let i = 0; i < image.data.length; i += 4) {
    work[i] = image.data[i]; work[i + 1] = image.data[i + 1]; work[i + 2] = image.data[i + 2];
  }
  for (let y = 0; y < small.height; y++) for (let x = 0; x < small.width; x++) {
    const i = (y * small.width + x) * 4;
    const r = clamp(Math.round(work[i]), 0, 255), g = clamp(Math.round(work[i + 1]), 0, 255), b = clamp(Math.round(work[i + 2]), 0, 255);
    let best = palette[0], distance = Infinity;
    for (const colour of palette) {
      const d = (colour[0] - r) ** 2 + (colour[1] - g) ** 2 + (colour[2] - b) ** 2;
      if (d < distance) { distance = d; best = colour; }
    }
    image.data[i] = best[0]; image.data[i + 1] = best[1]; image.data[i + 2] = best[2];
    if (v.dither) {
      const errors = [r - best[0], g - best[1], b - best[2]];
      const spread = (nx, ny, factor) => {
        if (nx < 0 || nx >= small.width || ny >= small.height) return;
        const target = (ny * small.width + nx) * 4;
        for (let channel = 0; channel < 3; channel++) work[target + channel] += errors[channel] * factor;
      };
      spread(x + 1, y, 7 / 16); spread(x - 1, y + 1, 3 / 16); spread(x, y + 1, 5 / 16); spread(x + 1, y + 1, 1 / 16);
    }
  }
  sctx.putImageData(image, 0, 0);
  const output = document.createElement('canvas'); output.width = source.width; output.height = source.height;
  const ctx = output.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.drawImage(small, 0, 0, output.width, output.height);
  return imageOutput(output);
};

operations['paste-image-download'] = async (v, files) => imageOutput(await sourceCanvas(files));

operations['image-to-ascii'] = async (v, files) => {
  const source = await sourceCanvas(files);
  const width = Math.min(v.width, source.width);
  const height = Math.max(1, Math.round(source.height / source.width * width * .48));
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d'); ctx.drawImage(source, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;
  const sets = { standard: ' .:-=+*#%@', detailed: ' .,:;irsXA253hMHGS#9B&@', blocks: ' ░▒▓█', binary: ' 01' };
  const chars = sets[v.charset];
  const lines = [];
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const luminance = .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2];
      line += chars[Math.min(chars.length - 1, Math.floor(luminance / 256 * chars.length))];
    }
    lines.push(line);
  }
  return textResult(lines.join('\n'));
};

operations['image-exif-tool'] = async (v, files) => {
  const source = requireFile(files);
  if (v.mode === 'view') {
    let metadata = {};
    try { metadata = await vendor().exifr.parse(source, { mergeOutput: true }) || {}; } catch (error) { metadata = { note: 'No readable EXIF metadata found.' }; }
    const entries = Object.entries(metadata);
    if (!entries.length) return textResult('No EXIF metadata found.');
    return textResult(entries.map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`).join('\n'));
  }
  const canvas = await imageCanvas(source);
  const blob = await canvasBlob(canvas);
  return blobResult(blob, 'metadata-removed.png', { status: 'Metadata removed by re-encoding' });
};

operations['flip-image'] = async (v, files) => {
  const source = await sourceCanvas(files);
  const output = document.createElement('canvas'); output.width = source.width; output.height = source.height;
  const ctx = output.getContext('2d');
  ctx.translate(v.axis === 'vertical' ? 0 : output.width, v.axis === 'horizontal' ? 0 : output.height);
  ctx.scale(v.axis === 'vertical' ? 1 : -1, v.axis === 'horizontal' ? 1 : -1);
  ctx.drawImage(source, 0, 0);
  return imageOutput(output);
};

operations['collage-maker'] = async (v, files) => {
  const list = requireFiles(files);
  const images = await Promise.all(list.map((file) => loadImage(file)));
  const gap = Math.round(v.gap);
  const tileW = Math.max(...images.map((img) => img.naturalWidth || img.width));
  const tileH = Math.max(...images.map((img) => img.naturalHeight || img.height));
  const rows = Math.ceil(images.length / v.columns);
  const output = document.createElement('canvas'); output.width = tileW * v.columns + gap * (v.columns - 1); output.height = tileH * rows + gap * (rows - 1);
  const ctx = output.getContext('2d'); ctx.fillStyle = v.background; ctx.fillRect(0, 0, output.width, output.height);
  images.forEach((img, index) => {
    const col = index % v.columns, row = Math.floor(index / v.columns);
    const x = col * (tileW + gap), y = row * (tileH + gap);
    ctx.save();
    if (v.rounded) { roundRect(ctx, x, y, tileW, tileH, 18); ctx.clip(); }
    const scale = Math.max(tileW / img.naturalWidth, tileH / img.naturalHeight);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    ctx.drawImage(img, x + (tileW - w) / 2, y + (tileH - h) / 2, w, h);
    ctx.restore();
  });
  return imageOutput(output);
};
