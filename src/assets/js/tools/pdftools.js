/* PDF Merge & Split - merge, extract, rotate and build PDFs locally with pdf-lib. */
(function () {
  'use strict';

  var lib = window.PDFLib || null;

  var modeSeg = document.getElementById('pdfModeSeg');
  var panels = {
    merge: document.getElementById('panel-merge'),
    extract: document.getElementById('panel-extract'),
    rotate: document.getElementById('panel-rotate'),
    images: document.getElementById('panel-images')
  };
  var runBtn = document.getElementById('pdfRun');
  var downloadBtn = document.getElementById('pdfDownload');
  var hintEl = document.getElementById('pdfHint');
  var errorEl = document.getElementById('pdfError');
  var pagesEl = document.getElementById('pdfPages');
  var sizeEl = document.getElementById('pdfSize');
  var progressBox = document.getElementById('pdfProgress');
  var progressFill = document.getElementById('pdfProgressFill');
  var progressLabel = document.getElementById('pdfProgressLabel');

  var mergeInput = document.getElementById('mergeFile');
  var mergeDropzone = document.getElementById('mergeDropzone');
  var mergeList = document.getElementById('mergeList');
  var mergeEmpty = document.getElementById('mergeEmpty');
  var mergeHint = document.getElementById('mergeHint');
  var mergePick = document.getElementById('mergePick');
  var mergeClear = document.getElementById('mergeClear');

  var extractInput = document.getElementById('extractFile');
  var extractName = document.getElementById('extractName');
  var extractRange = document.getElementById('extractRange');
  var extractHint = document.getElementById('extractHint');
  var extractPick = document.getElementById('extractPick');

  var rotateInput = document.getElementById('rotateFile');
  var rotateName = document.getElementById('rotateName');
  var rotateSeg = document.getElementById('rotateSeg');
  var rotateAngleInput = document.getElementById('rotateAngle');
  var rotateRange = document.getElementById('rotateRange');
  var rotateHint = document.getElementById('rotateHint');
  var rotatePick = document.getElementById('rotatePick');

  var imagesInput = document.getElementById('imagesFile');
  var imagesList = document.getElementById('imagesList');
  var imagesEmpty = document.getElementById('imagesEmpty');
  var imagesHint = document.getElementById('imagesHint');
  var imagesPick = document.getElementById('imagesPick');
  var imagesClear = document.getElementById('imagesClear');
  var imagePageSize = document.getElementById('imagePageSize');

  if (!runBtn || !modeSeg) return;

  var RUN_LABELS = { merge: 'Merge PDFs', extract: 'Extract pages', rotate: 'Rotate pages', images: 'Create PDF' };
  var DEFAULT_HINTS = {
    merge: 'Add two or more PDFs, then set their order.',
    extract: 'Counted from 1. Leave empty to keep every page.',
    rotate: 'Optional range like 1-3,5. Empty rotates the whole document.',
    images: 'JPG, PNG or WebP. Each image becomes one page, in list order.'
  };
  var MARGIN = 24;

  var mode = 'merge';
  var busy = false;
  var result = null;

  var mergeItems = [];
  var extractDoc = null;
  var extractNameText = '';
  var rotateDoc = null;
  var rotateNameText = '';
  var imageItems = [];

  if (!lib) {
    setError('The PDF library could not load. Reload the page to try again.');
    if (hintEl) hintEl.textContent = 'Library missing';
    runBtn.disabled = true;
    return;
  }

  /* ---------- helpers ---------- */

  function fmtFileBytes(bytes) {
    return window.CT && CT.fmtBytes ? CT.fmtBytes(bytes) : String(bytes) + ' B';
  }

  function describeError(err) {
    var message = (err && err.message) || String(err || 'Unknown error');
    if (/encrypt/i.test(message)) return 'the file is password protected (unlock it first)';
    if (/no pdf header|could not parse|invalid|header/i.test(message)) return 'the file is not a readable PDF';
    return message;
  }

  function setError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function setHint(message) {
    if (hintEl) hintEl.textContent = message;
  }

  function setInlineHint(el, message, bad) {
    if (!el) return;
    el.textContent = message;
    if (bad) el.classList.add('err');
    else el.classList.remove('err');
  }

  function readAsArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('could not be read')); };
      reader.readAsArrayBuffer(file);
    });
  }

  function readAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('could not be read')); };
      reader.readAsDataURL(file);
    });
  }

  function loadPdf(file) {
    return readAsArrayBuffer(file).then(function (buffer) {
      return lib.PDFDocument.load(buffer, { updateMetadata: false, throwOnInvalidObject: false });
    });
  }

  function showProgress(value, label) {
    if (!progressBox) return;
    progressBox.hidden = false;
    if (progressLabel) {
      progressLabel.hidden = false;
      progressLabel.textContent = label || '';
    }
    if (progressFill) progressFill.style.width = Math.max(0, Math.min(100, value)) + '%';
  }

  function hideProgress() {
    if (progressBox) progressBox.hidden = true;
    if (progressFill) progressFill.style.width = '0%';
    if (progressLabel) {
      progressLabel.hidden = true;
      progressLabel.textContent = '';
    }
  }

  function setBusy(next) {
    busy = next;
    syncRun();
    Array.prototype.forEach.call(modeSeg.querySelectorAll('button'), function (btn) {
      btn.disabled = next;
    });
    runBtn.textContent = next ? 'Working…' : RUN_LABELS[mode];
    if (!next) syncDownload();
  }

  function syncRun() {
    var missing = (mode === 'extract' && !extractDoc) || (mode === 'rotate' && !rotateDoc);
    runBtn.disabled = busy || missing;
  }

  function syncDownload() {
    downloadBtn.disabled = !result || busy;
  }

  function publish(blob, pageCount, name, summary) {
    result = { blob: blob, name: name };
    pagesEl.textContent = String(pageCount) + (pageCount === 1 ? ' page' : ' pages');
    sizeEl.textContent = fmtFileBytes(blob.size);
    setHint(summary || 'Ready to download');
    syncDownload();
    if (window.CT && CT.toast) CT.toast(summary || 'PDF ready');
  }

  function resetMeta(hintText) {
    result = null;
    pagesEl.textContent = '—';
    sizeEl.textContent = '—';
    setHint(hintText || 'Waiting for input');
    syncDownload();
  }

  function fail(fileName, err) {
    result = null;
    pagesEl.textContent = '—';
    sizeEl.textContent = '—';
    var message = 'Could not open ' + fileName + ': ' + describeError(err);
    setError(message);
    setHint('Failed');
    syncDownload();
    if (window.CT && CT.toast) CT.toast('Could not open ' + fileName, 'err');
  }

  function runTask(task) {
    setError('');
    hideProgress();
    setBusy(true);
    showProgress(8, 'Preparing');
    return task().then(function () {
      showProgress(100, 'Done');
      setTimeout(function () {
        hideProgress();
        setBusy(false);
      }, 200);
    }).catch(function (err) {
      hideProgress();
      setBusy(false);
      if (!err || !err.__reported) {
        setError(describeError(err));
        setHint('Failed');
        result = null;
        syncDownload();
      }
    });
  }

  function reportFileError(fileName, err) {
    fail(fileName, err);
    var wrapped = new Error('reported');
    wrapped.__reported = true;
    return wrapped;
  }

  /* ---------- page ranges ---------- */

  function parseRanges(text, pageCount) {
    var tokens = String(text || '').split(',').map(function (part) { return part.trim(); });
    var pages = [];
    var invalid = [];
    tokens.forEach(function (token) {
      if (!token) return;
      var match = token.match(/^(\d+)\s*(?:[-\u2013]\s*(\d+))?$/);
      if (!match) {
        invalid.push(token + ' (not a number or range)');
        return;
      }
      var from = parseInt(match[1], 10);
      var to = match[2] ? parseInt(match[2], 10) : from;
      if (from < 1 || to < 1) {
        invalid.push(token + ' (pages start at 1)');
        return;
      }
      if (from > pageCount || to > pageCount) {
        invalid.push(token + ' (document has ' + pageCount + ' pages)');
        return;
      }
      var step = from <= to ? 1 : -1;
      for (var i = from; ; i += step) {
        pages.push(i);
        if (i === to) break;
      }
    });
    return { pages: pages, invalid: invalid };
  }

  /* ---------- mode switching ---------- */

  function setMode(next) {
    if (busy) return;
    mode = next;
    Array.prototype.forEach.call(modeSeg.querySelectorAll('button'), function (btn) {
      var on = btn.getAttribute('data-mode') === next;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    Object.keys(panels).forEach(function (key) {
      if (panels[key]) panels[key].hidden = key !== next;
    });
    runBtn.textContent = RUN_LABELS[next];
    setError('');
    resetMeta('Waiting for input');
    syncRun();
  }

  /* ---------- merge ---------- */

  function renderMergeList() {
    mergeList.textContent = '';
    mergeEmpty.hidden = mergeItems.length > 0;
    mergeItems.forEach(function (item, index) {
      var row = document.createElement('li');
      row.className = 'file-row';
      row.style.marginBottom = '8px';
      row.style.background = '#fff';
      row.style.border = '1px solid var(--line)';
      row.style.borderRadius = '10px';
      row.style.padding = '8px 10px';

      var info = document.createElement('div');
      info.style.minWidth = '0';
      info.style.flex = '1';

      var name = document.createElement('div');
      name.className = 'file-name';
      name.textContent = (index + 1) + '. ' + item.file.name;
      name.title = item.file.name;

      var meta = document.createElement('div');
      meta.className = 'file-sizes';
      meta.textContent = item.doc
        ? item.doc.getPageCount() + (item.doc.getPageCount() === 1 ? ' page' : ' pages') + ' · ' + fmtFileBytes(item.file.size)
        : item.error ? 'Not readable · ' + item.error : 'Reading…';

      info.appendChild(name);
      info.appendChild(meta);

      var actions = document.createElement('div');
      actions.className = 'file-actions';
      actions.appendChild(iconButton('Up', '▲', 'Move ' + item.file.name + ' up', index === 0, function () { moveMerge(index, -1); }));
      actions.appendChild(iconButton('Down', '▼', 'Move ' + item.file.name + ' down', index === mergeItems.length - 1, function () { moveMerge(index, 1); }));
      actions.appendChild(iconButton('Remove', '×', 'Remove ' + item.file.name, false, function () {
        mergeItems.splice(index, 1);
        renderMergeList();
      }));

      row.appendChild(info);
      row.appendChild(actions);
      mergeList.appendChild(row);
    });
    mergePick.textContent = mergeItems.length ? 'Add more PDFs' : 'Add PDFs';
  }

  function iconButton(label, glyph, aria, disabled, onClick) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost btn-sm';
    btn.textContent = glyph;
    btn.title = label;
    btn.setAttribute('aria-label', aria);
    btn.disabled = disabled;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function moveMerge(index, delta) {
    var target = index + delta;
    if (target < 0 || target >= mergeItems.length) return;
    var moved = mergeItems.splice(index, 1)[0];
    mergeItems.splice(target, 0, moved);
    renderMergeList();
  }

  function addMergeFiles(fileList) {
    var files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return;
    var skipped = 0;
    files.forEach(function (file) {
      var isPdf = /\.pdf$/i.test(file.name) || file.type === 'application/pdf';
      if (!isPdf) {
        skipped++;
        return;
      }
      var item = { id: Date.now() + '-' + Math.random(), file: file, doc: null, error: '' };
      mergeItems.push(item);
      loadPdf(file).then(function (doc) {
        item.doc = doc;
        renderMergeList();
      }, function (err) {
        item.error = describeError(err);
        renderMergeList();
        if (window.CT && CT.toast) CT.toast(file.name + ': ' + item.error, 'err');
      });
    });
    if (skipped) CT.toast('Skipped ' + skipped + ' non-PDF ' + (skipped === 1 ? 'file' : 'files'), 'err');
    renderMergeList();
  }

  function runMerge() {
    if (!mergeItems.length) {
      setError('Add at least one PDF first.');
      return Promise.resolve();
    }
    var pending = mergeItems.filter(function (item) { return !item.doc && !item.error; });
    if (pending.length) {
      setError('Wait until every file is read.');
      return Promise.resolve();
    }
    var broken = mergeItems.filter(function (item) { return item.error; });
    var usable = mergeItems.filter(function (item) { return item.doc; });
    if (!usable.length) {
      setError('None of the added files could be opened. Encrypted PDFs must be unlocked first.');
      return Promise.resolve();
    }
    var mergeQueue = usable.slice();
    return runTask(function () {
      return lib.PDFDocument.create().then(function (out) {
        var copied = 0;
        var chain = Promise.resolve();
        mergeQueue.forEach(function (item, index) {
          chain = chain.then(function () {
            showProgress(10 + Math.round((index / mergeQueue.length) * 70), 'Copying ' + item.file.name);
            return out.copyPages(item.doc, item.doc.getPageIndices()).then(function (pages) {
              pages.forEach(function (page) {
                out.addPage(page);
                copied++;
              });
            });
          });
        });
        return chain.then(function () {
          showProgress(88, 'Writing the PDF');
          return out.save();
        }).then(function (bytes) {
          var blob = new Blob([bytes], { type: 'application/pdf' });
          var summary = 'Merged ' + mergeQueue.length + ' files into ' + copied + ' pages';
          publish(blob, copied, 'merged.pdf', summary);
          if (broken.length) setError(broken.length + ' file' + (broken.length === 1 ? ' was' : 's were') + ' skipped: ' + broken.map(function (b) { return b.file.name; }).join(', ') + '.');
        });
      });
    });
  }

  /* ---------- extract ---------- */

  function handleExtractFile(file) {
    if (!file) return;
    extractDoc = null;
    syncRun();
    extractNameText = file.name;
    extractName.textContent = file.name + ' · reading…';
    resetMeta('Reading ' + file.name);
    setError('');
    loadPdf(file).then(function (doc) {
      extractDoc = doc;
      syncRun();
      var count = doc.getPageCount();
      extractName.textContent = file.name + ' · ' + count + (count === 1 ? ' page' : ' pages');
      setInlineHint(extractHint, 'Counted from 1. This file has ' + count + (count === 1 ? ' page.' : ' pages.'), false);
      setHint('Ready to extract');
    }, function (err) {
      syncRun();
      extractName.textContent = file.name;
      setInlineHint(extractHint, 'Ignored — this file could not be opened.', true);
      fail(file.name, err);
    });
  }

  function runExtract() {
    if (!extractDoc) {
      setError('Choose a PDF first.');
      return Promise.resolve();
    }
    var source = extractDoc;
    var count = source.getPageCount();
    var text = extractRange.value.trim();
    var parsed = text ? parseRanges(text, count) : { pages: [], invalid: [] };
    if (parsed.invalid.length) {
      var message = 'Invalid page range: ' + parsed.invalid.join('; ') + '.';
      setError(message);
      setInlineHint(extractHint, 'Invalid page range: ' + parsed.invalid.join('; ') + '.', true);
      CT.toast('Check the page range', 'err');
      return Promise.resolve();
    }
    var pages = text ? parsed.pages : parseRanges('1-' + count, count).pages;
    if (!pages.length) {
      setError('The range selects no pages.');
      return Promise.resolve();
    }
    setInlineHint(extractHint, pages.length + ' page' + (pages.length === 1 ? '' : 's') + ' selected in the order written.', false);
    return runTask(function () {
      return lib.PDFDocument.create().then(function (out) {
        showProgress(30, 'Copying ' + pages.length + ' pages');
        var source = extractDoc;
        return out.copyPages(source, pages.map(function (n) { return n - 1; })).then(function (copied) {
          copied.forEach(function (page) { out.addPage(page); });
          showProgress(88, 'Writing the PDF');
          return out.save();
        }).then(function (bytes) {
          publish(new Blob([bytes], { type: 'application/pdf' }), pages.length, 'pages.pdf', 'Kept ' + pages.length + ' of ' + count + ' pages');
        });
      });
    });
  }

  /* ---------- rotate ---------- */

  function handleRotateFile(file) {
    if (!file) return;
    rotateDoc = null;
    syncRun();
    rotateNameText = file.name;
    rotateName.textContent = file.name + ' · reading…';
    resetMeta('Reading ' + file.name);
    setError('');
    loadPdf(file).then(function (doc) {
      rotateDoc = doc;
      syncRun();
      var count = doc.getPageCount();
      rotateName.textContent = file.name + ' · ' + count + (count === 1 ? ' page' : ' pages');
      setInlineHint(rotateHint, 'Optional range like 1-3,5. This file has ' + count + (count === 1 ? ' page.' : ' pages.'), false);
      setHint('Ready to rotate');
    }, function (err) {
      syncRun();
      rotateName.textContent = file.name;
      setInlineHint(rotateHint, 'Ignored — this file could not be opened.', true);
      fail(file.name, err);
    });
  }

  function runRotate() {
    if (!rotateDoc) {
      setError('Choose a PDF first.');
      return Promise.resolve();
    }
    var count = rotateDoc.getPageCount();
    var text = rotateRange.value.trim();
    var parsed = text ? parseRanges(text, count) : { pages: [], invalid: [] };
    if (parsed.invalid.length) {
      var message = 'Invalid page range: ' + parsed.invalid.join('; ') + '.';
      setError(message);
      setInlineHint(rotateHint, 'Invalid page range: ' + parsed.invalid.join('; ') + '.', true);
      CT.toast('Check the page range', 'err');
      return Promise.resolve();
    }
    var targets = text ? parsed.pages : parseRanges('1-' + count, count).pages;
    if (!targets.length) {
      setError('The range selects no pages.');
      return Promise.resolve();
    }
    var angle = parseInt(rotateAngleInput.value, 10) || 90;
    setInlineHint(rotateHint, targets.length + ' page' + (targets.length === 1 ? '' : 's') + ' will turn ' + angle + ' degrees.', false);
    return runTask(function () {
      showProgress(40, 'Turning ' + targets.length + ' pages');
      var pages = rotateDoc.getPages();
      targets.forEach(function (n) {
        var page = pages[n - 1];
        if (!page) return;
        page.setRotation(lib.degrees((page.getRotation().angle + angle) % 360));
      });
      showProgress(88, 'Writing the PDF');
      return rotateDoc.save().then(function (bytes) {
        publish(new Blob([bytes], { type: 'application/pdf' }), count, 'rotated.pdf', 'Rotated ' + targets.length + ' of ' + count + ' pages by ' + angle + ' degrees');
      });
    });
  }

  /* ---------- images to PDF ---------- */

  var PAGE_SIZES = {
    a4: [595.28, 841.89],
    letter: [612, 792]
  };

  function renderImagesList() {
    imagesList.textContent = '';
    imagesEmpty.hidden = imageItems.length > 0;
    imageItems.forEach(function (item, index) {
      var row = document.createElement('li');
      row.className = 'file-row';
      row.style.marginBottom = '8px';
      row.style.background = '#fff';
      row.style.border = '1px solid var(--line)';
      row.style.borderRadius = '10px';
      row.style.padding = '8px 10px';

      var thumb = document.createElement('img');
      thumb.alt = '';
      thumb.src = item.thumbUrl;

      var info = document.createElement('div');
      info.style.minWidth = '0';
      info.style.flex = '1';

      var name = document.createElement('div');
      name.className = 'file-name';
      name.textContent = (index + 1) + '. ' + item.file.name;
      name.title = item.file.name;

      var meta = document.createElement('div');
      meta.className = 'file-sizes';
      meta.textContent = item.width + ' x ' + item.height + ' px · ' + fmtFileBytes(item.file.size);

      info.appendChild(name);
      info.appendChild(meta);

      var actions = document.createElement('div');
      actions.className = 'file-actions';
      actions.appendChild(iconButton('Up', '▲', 'Move ' + item.file.name + ' up', index === 0, function () { moveImage(index, -1); }));
      actions.appendChild(iconButton('Down', '▼', 'Move ' + item.file.name + ' down', index === imageItems.length - 1, function () { moveImage(index, 1); }));
      actions.appendChild(iconButton('Remove', '×', 'Remove ' + item.file.name, false, function () {
        URL.revokeObjectURL(item.thumbUrl);
        imageItems.splice(index, 1);
        renderImagesList();
      }));

      row.appendChild(thumb);
      row.appendChild(info);
      row.appendChild(actions);
      imagesList.appendChild(row);
    });
    imagesPick.textContent = imageItems.length ? 'Add more images' : 'Add images';
  }

  function moveImage(index, delta) {
    var target = index + delta;
    if (target < 0 || target >= imageItems.length) return;
    var moved = imageItems.splice(index, 1)[0];
    imageItems.splice(target, 0, moved);
    renderImagesList();
  }

  function loadImageElement(file) {
    return readAsDataUrl(file).then(function (url) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve({ img: img, url: url }); };
        img.onerror = function () { reject(new Error('the image could not be decoded')); };
        img.src = url;
      });
    });
  }

  function webpToPng(file) {
    return loadImageElement(file).then(function (loaded) {
      var canvas = document.createElement('canvas');
      canvas.width = loaded.img.naturalWidth;
      canvas.height = loaded.img.naturalHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(loaded.img, 0, 0);
      return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
          if (blob) resolve(blob);
          else reject(new Error('the WebP image could not be converted'));
        }, 'image/png');
      });
    });
  }

  function addImageFiles(fileList) {
    var files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return;
    var skipped = 0;
    files.forEach(function (file) {
      var type = (file.type || '').toLowerCase();
      var ok = type === 'image/jpeg' || type === 'image/png' || type === 'image/webp' || /\.(jpe?g|png|webp)$/i.test(file.name);
      if (!ok) {
        skipped++;
        return;
      }
      var item = { id: Date.now() + '-' + Math.random(), file: file, thumbUrl: '', width: 0, height: 0, ready: false };
      var thumbUrl = URL.createObjectURL(file);
      item.thumbUrl = thumbUrl;
      imageItems.push(item);
      var probe = new Image();
      probe.onload = function () {
        item.width = probe.naturalWidth;
        item.height = probe.naturalHeight;
        item.ready = true;
        renderImagesList();
      };
      probe.onerror = function () {
        item.error = 'the image could not be decoded';
      };
      probe.src = thumbUrl;
    });
    if (skipped) CT.toast('Skipped ' + skipped + ' unsupported ' + (skipped === 1 ? 'file' : 'files'), 'err');
    renderImagesList();
  }

  function embedImage(out, item) {
    var type = (item.file.type || '').toLowerCase();
    var isWebp = type === 'image/webp' || /\.webp$/i.test(item.file.name);
    var isPng = type === 'image/png' || /\.png$/i.test(item.file.name);
    if (isWebp) {
      return webpToPng(item.file).then(function (pngBlob) {
        return pngBlob.arrayBuffer();
      }).then(function (buffer) {
        return out.embedPng(buffer);
      });
    }
    return readAsArrayBuffer(item.file).then(function (buffer) {
      if (isPng) return out.embedPng(buffer);
      if (type === 'image/jpeg' || /\.jpe?g$/i.test(item.file.name)) return out.embedJpg(buffer);
      return out.embedPng(buffer).catch(function () { return out.embedJpg(buffer); });
    });
  }

  function runImages() {
    var ready = imageItems.filter(function (item) { return item.ready; });
    var broken = imageItems.filter(function (item) { return item.error && !item.ready; });
    if (!ready.length) {
      setError('Add at least one JPG, PNG or WebP image first.');
      return Promise.resolve();
    }
    var sizeKey = imagePageSize.value;
    return runTask(function () {
      return lib.PDFDocument.create().then(function (out) {
        var chain = Promise.resolve();
        var placed = 0;
        ready.forEach(function (item, index) {
          chain = chain.then(function () {
            showProgress(10 + Math.round((index / ready.length) * 70), 'Adding ' + item.file.name);
            return embedImage(out, item).then(function (image) {
              var natural = image.size();
              var pageWidth;
              var pageHeight;
              if (sizeKey === 'fit') {
                pageWidth = natural.width + MARGIN * 2;
                pageHeight = natural.height + MARGIN * 2;
              } else {
                var size = PAGE_SIZES[sizeKey] || PAGE_SIZES.a4;
                pageWidth = size[0];
                pageHeight = size[1];
              }
              var page = out.addPage([pageWidth, pageHeight]);
              var boxWidth = pageWidth - MARGIN * 2;
              var boxHeight = pageHeight - MARGIN * 2;
              var scale = Math.min(boxWidth / natural.width, boxHeight / natural.height);
              var drawWidth = natural.width * scale;
              var drawHeight = natural.height * scale;
              page.drawImage(image, {
                x: (pageWidth - drawWidth) / 2,
                y: (pageHeight - drawHeight) / 2,
                width: drawWidth,
                height: drawHeight
              });
              placed++;
            }, function (err) {
              throw reportFileError(item.file.name, err);
            });
          });
        });
        return chain.then(function () {
          showProgress(88, 'Writing the PDF');
          return out.save();
        }).then(function (bytes) {
          publish(new Blob([bytes], { type: 'application/pdf' }), placed, 'images.pdf', 'Built ' + placed + ' page' + (placed === 1 ? '' : 's') + ' from images');
          if (broken.length) setError('Skipped ' + broken.length + ' image' + (broken.length === 1 ? '' : 's') + ' that could not be read.');
        });
      });
    });
  }

  /* ---------- wiring ---------- */

  modeSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-mode]');
    if (btn) setMode(btn.getAttribute('data-mode'));
  });

  runBtn.addEventListener('click', function () {
    if (busy) return;
    if (mode === 'merge') runMerge();
    else if (mode === 'extract') runExtract();
    else if (mode === 'rotate') runRotate();
    else runImages();
  });

  downloadBtn.addEventListener('click', function () {
    if (!result) return;
    CT.downloadBlob(result.blob, result.name);
  });

  mergePick.addEventListener('click', function () { mergeInput.click(); });
  mergeInput.addEventListener('change', function () {
    addMergeFiles(mergeInput.files);
    mergeInput.value = '';
  });
  mergeDropzone.addEventListener('click', function () { mergeInput.click(); });
  mergeDropzone.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      mergeInput.click();
    }
  });
  mergeDropzone.addEventListener('dragover', function (event) {
    event.preventDefault();
    mergeDropzone.classList.add('dragover');
  });
  mergeDropzone.addEventListener('dragleave', function () { mergeDropzone.classList.remove('dragover'); });
  mergeDropzone.addEventListener('drop', function (event) {
    event.preventDefault();
    mergeDropzone.classList.remove('dragover');
    addMergeFiles(event.dataTransfer.files);
    mergeInput.value = '';
  });
  mergeClear.addEventListener('click', function () {
    mergeItems.length = 0;
    renderMergeList();
    if (window.CT && CT.toast) CT.toast('List cleared');
  });

  extractPick.addEventListener('click', function () { extractInput.click(); });
  extractInput.addEventListener('change', function () {
    if (extractInput.files.length) handleExtractFile(extractInput.files[0]);
    extractInput.value = '';
  });

  rotatePick.addEventListener('click', function () { rotateInput.click(); });
  rotateInput.addEventListener('change', function () {
    if (rotateInput.files.length) handleRotateFile(rotateInput.files[0]);
    rotateInput.value = '';
  });
  rotateSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-angle]');
    if (!btn) return;
    var angle = btn.getAttribute('data-angle');
    rotateAngleInput.value = angle;
    Array.prototype.forEach.call(rotateSeg.querySelectorAll('button'), function (b) {
      var on = b === btn;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });

  imagesPick.addEventListener('click', function () { imagesInput.click(); });
  imagesInput.addEventListener('change', function () {
    addImageFiles(imagesInput.files);
    imagesInput.value = '';
  });
  imagesClear.addEventListener('click', function () {
    imageItems.forEach(function (item) { if (item.thumbUrl) URL.revokeObjectURL(item.thumbUrl); });
    imageItems.length = 0;
    renderImagesList();
  });

  setMode('merge');
  renderMergeList();
  renderImagesList();
})();
