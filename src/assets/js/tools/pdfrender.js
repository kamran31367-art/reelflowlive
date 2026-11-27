/* PDF to Images & Text - render pages to PNG and extract text with pdf.js, locally. */
(function () {
  'use strict';

  var pdfjs = window.pdfjsLib || null;
  var WORKER_SRC = '/assets/js/vendor/pdfjs/pdf.worker.min.js';

  var dropzone = document.getElementById('pdfDropzone');
  var fileInput = document.getElementById('pdfFile');
  var infoBox = document.getElementById('pdfInfo');
  var nameEl = document.getElementById('pdfName');
  var countEl = document.getElementById('pdfCount');
  var bytesEl = document.getElementById('pdfBytes');

  var pageRange = document.getElementById('pageRange');
  var rangeHint = document.getElementById('rangeHint');
  var scaleSeg = document.getElementById('scaleSeg');
  var scaleValue = document.getElementById('scaleValue');
  var viewSeg = document.getElementById('viewSeg');

  var renderBtn = document.getElementById('renderBtn');
  var clearBtn = document.getElementById('clearPdf');
  var errorEl = document.getElementById('renderError');
  var progressBox = document.getElementById('renderProgress');
  var progressFill = document.getElementById('renderProgressFill');
  var progressLabel = document.getElementById('renderProgressLabel');
  var resultHint = document.getElementById('resultHint');

  var imagesPane = document.getElementById('imagesPane');
  var textPane = document.getElementById('textPane');
  var pageSummary = document.getElementById('pageSummary');
  var sumPages = document.getElementById('sumPages');
  var sumScale = document.getElementById('sumScale');
  var downloadAll = document.getElementById('downloadAll');
  var multiHint = document.getElementById('multiHint');
  var pageGrid = document.getElementById('pageGrid');
  var gridEmpty = document.getElementById('gridEmpty');

  var downloadText = document.getElementById('downloadText');
  var textBlocks = document.getElementById('textBlocks');
  var textEmpty = document.getElementById('textEmpty');

  if (!renderBtn || !dropzone) return;

  var state = {
    file: null,
    doc: null,
    pageCount: 0,
    scale: 2,
    view: 'images',
    busy: false,
    token: 0,
    baseName: 'document',
    pageBlobs: {},
    textPages: {}
  };

  if (!pdfjs) {
    setError('The PDF renderer could not load. Reload the page to try again.');
    renderBtn.disabled = true;
    return;
  }
  pdfjs.GlobalWorkerOptions.workerSrc = WORKER_SRC;

  /* ---------- shared helpers ---------- */

  function setError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function setRangeHint(message, bad) {
    if (!rangeHint) return;
    rangeHint.textContent = message;
    if (bad) rangeHint.classList.add('err');
    else rangeHint.classList.remove('err');
  }

  function setHint(message) {
    if (resultHint) resultHint.textContent = message;
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
    state.busy = next;
    renderBtn.disabled = next || !state.doc;
    renderBtn.textContent = next ? 'Working…' : (state.doc ? 'Render pages' : 'Render pages');
    Array.prototype.forEach.call(scaleSeg.querySelectorAll('button'), function (btn) { btn.disabled = next; });
    Array.prototype.forEach.call(viewSeg.querySelectorAll('button'), function (btn) { btn.disabled = next; });
    if (!next) syncDownloadButtons();
  }

  function syncDownloadButtons() {
    var hasPages = Object.keys(state.pageBlobs).length > 0;
    downloadAll.disabled = state.busy || !hasPages;
    downloadText.disabled = state.busy || !state.doc;
    renderBtn.disabled = state.busy || !state.doc;
  }

  function describeError(err) {
    var message = (err && err.message) || String(err || 'Unknown error');
    if (/password/i.test(message)) return 'the file is password protected (unlock it first)';
    if (/invalid pdf|no pdf header|could not parse|missing pdf/i.test(message)) return 'the file is not a readable PDF';
    return message;
  }

  function fileNameError(err) {
    return 'Could not open ' + (state.file ? state.file.name : 'the file') + ': ' + describeError(err) + '.';
  }

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

  function selectedPages() {
    var text = pageRange.value.trim();
    var parsed = parseRanges(text, state.pageCount);
    return {
      pages: text ? parsed.pages : parseRanges('1-' + state.pageCount, state.pageCount).pages,
      invalid: parsed.invalid
    };
  }

  function readableFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(new Uint8Array(reader.result)); };
      reader.onerror = function () { reject(new Error('the file could not be read')); };
      reader.readAsArrayBuffer(file);
    });
  }

  /* pdf.js never settles on some truncated files, so cap the wait. */
  function openDocument(bytes) {
    return Promise.race([
      pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise.then(function (doc) {
        return doc;
      }, function (firstError) {
        return runWithoutWorker(bytes).catch(function () {
          throw firstError;
        });
      }),
      new Promise(function (resolve, reject) {
        setTimeout(function () { reject(new Error('the file took too long to open')); }, 20000);
      })
    ]);
  }

  function runWithoutWorker(bytes) {
    if (typeof window.Worker === 'undefined') return Promise.reject(new Error('this browser cannot start PDF workers'));
    var RealWorker = window.Worker;
    window.Worker = function () {
      return {
        postMessage: function () {},
        terminate: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
        onmessage: null
      };
    };
    function restore() { window.Worker = RealWorker; }
    try {
      return pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise.then(function (doc) {
        restore();
        return doc;
      }, function (err) {
        restore();
        throw err;
      });
    } catch (err) {
      restore();
      return Promise.reject(err);
    }
  }

  function closeDoc() {
    if (state.doc && typeof state.doc.destroy === 'function') {
      try { state.doc.destroy(); } catch (err) { /* already closed */ }
    }
    state.doc = null;
  }

  function clearOutputs() {
    Object.keys(state.pageBlobs).forEach(function (key) {
      URL.revokeObjectURL(state.pageBlobs[key].url);
    });
    state.pageBlobs = {};
    state.textPages = {};
    pageGrid.textContent = '';
    textBlocks.textContent = '';
    pageSummary.hidden = true;
    multiHint.hidden = true;
    gridEmpty.hidden = false;
    textEmpty.hidden = false;
    syncDownloadButtons();
  }

  /* ---------- file loading ---------- */

  function loadFile(file) {
    if (!file) return;
    var isPdf = /\.pdf$/i.test(file.name) || file.type === 'application/pdf';
    if (!isPdf) {
      CT.toast('Choose a PDF file', 'err');
      return;
    }
    var token = ++state.token;
    state.file = file;
    state.baseName = CT.baseName(file.name);
    closeDoc();
    clearOutputs();
    setError('');
    setBusy(true);
    nameEl.textContent = file.name;
    bytesEl.textContent = CT.fmtBytes(file.size);
    countEl.textContent = 'Reading…';
    infoBox.hidden = false;
    setHint('Reading ' + file.name);
    showProgress(15, 'Opening ' + file.name);

    readableFile(file).then(function (bytes) {
      return openDocument(bytes);
    }).then(function (doc) {
      if (token !== state.token) return;
      state.doc = doc;
      state.pageCount = doc.numPages;
      countEl.textContent = String(doc.numPages) + (doc.numPages === 1 ? ' page' : ' pages');
      setRangeHint('Counted from 1. This file has ' + doc.numPages + (doc.numPages === 1 ? ' page.' : ' pages.'), false);
      showProgress(100, 'Opened');
      hideProgress();
      setBusy(false);
      setHint('Ready to render');
      return renderSelected(token);
    }).catch(function (err) {
      if (token !== state.token) return;
      hideProgress();
      state.doc = null;
      state.pageCount = 0;
      countEl.textContent = '—';
      setBusy(false);
      renderBtn.disabled = true;
      setError(fileNameError(err));
      setHint('Failed');
      CT.toast('Could not open ' + file.name, 'err');
    });
  }

  /* ---------- rendering ---------- */

  function renderSelected(token) {
    if (!state.doc) return Promise.resolve();
    var picked = selectedPages();
    if (picked.invalid.length) {
      var message = 'Invalid page range: ' + picked.invalid.join('; ') + '.';
      setError(message);
      setRangeHint('Invalid page range: ' + picked.invalid.join('; ') + '.', true);
      CT.toast('Check the page range', 'err');
      return Promise.resolve();
    }
    if (!picked.pages.length) {
      setError('The range selects no pages.');
      return Promise.resolve();
    }
    clearOutputs();
    setError('');
    setBusy(true);
    setRangeHint(picked.pages.length + ' page' + (picked.pages.length === 1 ? '' : 's') + ' selected.', false);
    setHint('Rendering…');
    sumScale.textContent = state.scale + 'x';

    var chain = Promise.resolve();
    picked.pages.forEach(function (pageNumber, index) {
      chain = chain.then(function () {
        if (token !== state.token) return;
        showProgress(5 + Math.round((index / picked.pages.length) * 85), 'Rendering page ' + pageNumber + ' of ' + picked.pages.length);
        return renderPage(pageNumber).then(function (page) {
          if (token !== state.token) return;
          addPageCell(pageNumber, page);
          sumPages.textContent = String(index + 1);
          pageSummary.hidden = false;
          gridEmpty.hidden = true;
          syncDownloadButtons();
        }).catch(function (err) {
          if (token !== state.token) return;
          setError('Page ' + pageNumber + ' could not be rendered: ' + describeError(err) + '.');
        });
      });
    });

    return chain.then(function () {
      if (token !== state.token) return;
      return extractText(picked.pages, token);
    }).then(function () {
      if (token !== state.token) return;
      hideProgress();
      setBusy(false);
      var done = Object.keys(state.pageBlobs).length;
      setHint(done ? done + ' page' + (done === 1 ? '' : 's') + ' ready' : 'Nothing rendered');
    });
  }

  function renderPage(pageNumber) {
    return state.doc.getPage(pageNumber).then(function (page) {
      var viewport = page.getViewport({ scale: state.scale });
      var canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.ceil(viewport.width));
      canvas.height = Math.max(1, Math.ceil(viewport.height));
      var ctx = canvas.getContext('2d', { alpha: false });
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      var task = page.render({ canvasContext: ctx, viewport: viewport, background: '#ffffff' });
      return task.promise.then(function () {
        return new Promise(function (resolve, reject) {
          canvas.toBlob(function (blob) {
            if (blob) resolve({ blob: blob, width: canvas.width, height: canvas.height });
            else reject(new Error('the PNG could not be created'));
          }, 'image/png');
        });
      });
    });
  }

  function addPageCell(pageNumber, page) {
    var url = URL.createObjectURL(page.blob);
    state.pageBlobs[pageNumber] = { blob: page.blob, url: url };

    var cell = document.createElement('div');
    cell.className = 'page-cell';

    var img = document.createElement('img');
    img.src = url;
    img.alt = 'Page ' + pageNumber + ' of ' + (state.file ? state.file.name : 'the PDF');
    img.loading = 'lazy';

    var label = document.createElement('span');
    label.textContent = 'Page ' + pageNumber + ' · ' + page.width + ' x ' + page.height + ' px';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost btn-sm';
    btn.style.marginTop = '6px';
    btn.textContent = 'PNG';
    btn.setAttribute('aria-label', 'Download page ' + pageNumber + ' as PNG');
    btn.addEventListener('click', function () {
      var entry = state.pageBlobs[pageNumber];
      if (entry) CT.downloadBlob(entry.blob, pageFileName(pageNumber));
    });

    cell.appendChild(img);
    cell.appendChild(label);
    cell.appendChild(btn);
    pageGrid.appendChild(cell);
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function pageFileName(pageNumber) {
    return state.baseName + '-page-' + pad2(pageNumber) + '.png';
  }

  /* ---------- text ---------- */

  function textOfContent(content) {
    var out = '';
    var items = content.items || [];
    items.forEach(function (item, index) {
      if (typeof item.str !== 'string') return;
      out += item.str;
      if (item.hasEOL) out += '\n';
      else if (index < items.length - 1) out += ' ';
    });
    return out.replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').trim();
  }

  function extractText(pages, token) {
    var chain = Promise.resolve();
    pages.forEach(function (pageNumber) {
      chain = chain.then(function () {
        if (token !== state.token) return;
        return state.doc.getPage(pageNumber).then(function (page) {
          return page.getTextContent();
        }).then(function (content) {
          if (token !== state.token) return;
          var text = textOfContent(content);
          state.textPages[pageNumber] = text;
          addTextBlock(pageNumber, text);
          textEmpty.hidden = true;
        }).catch(function () {
          if (token !== state.token) return;
          state.textPages[pageNumber] = '';
          addTextBlock(pageNumber, '');
          textEmpty.hidden = true;
        });
      });
    });
    return chain;
  }

  function addTextBlock(pageNumber, text) {
    var card = document.createElement('div');
    card.className = 'counter-card';

    var head = document.createElement('div');
    head.className = 'counter-head';

    var title = document.createElement('b');
    title.textContent = 'Page ' + pageNumber;

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-ghost btn-sm';
    copyBtn.textContent = 'Copy page text';
    copyBtn.addEventListener('click', function () {
      CT.copy(state.textPages[pageNumber] || '').then(function (ok) {
        CT.toast(ok ? 'Page ' + pageNumber + ' text copied' : 'Copy failed', ok ? '' : 'err');
      });
    });

    head.appendChild(title);
    head.appendChild(copyBtn);

    var body = document.createElement('p');
    body.style.margin = '0';
    body.style.fontSize = '13px';
    body.style.whiteSpace = 'pre-wrap';
    body.style.color = '#475569';
    body.textContent = text || 'No text on this page (it may be a scanned image).';

    card.appendChild(head);
    card.appendChild(body);
    textBlocks.appendChild(card);
  }

  function buildTextFile() {
    var numbers = Object.keys(state.textPages).map(Number).sort(function (a, b) { return a - b; });
    return numbers.map(function (n) {
      return '--- Page ' + n + ' ---\n' + (state.textPages[n] || '');
    }).join('\n\n') + '\n';
  }

  /* ---------- view + downloads ---------- */

  function setView(next) {
    state.view = next;
    Array.prototype.forEach.call(viewSeg.querySelectorAll('button'), function (btn) {
      var on = btn.getAttribute('data-view') === next;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    imagesPane.hidden = next !== 'images';
    textPane.hidden = next !== 'text';
  }

  function setScale(next) {
    state.scale = next;
    scaleValue.value = String(next);
    Array.prototype.forEach.call(scaleSeg.querySelectorAll('button'), function (btn) {
      var on = Number(btn.getAttribute('data-scale')) === next;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    sumScale.textContent = next + 'x';
  }

  function downloadAllPages() {
    var numbers = Object.keys(state.pageBlobs).map(Number).sort(function (a, b) { return a - b; });
    if (!numbers.length) return;
    multiHint.hidden = false;
    numbers.forEach(function (pageNumber, index) {
      setTimeout(function () {
        var entry = state.pageBlobs[pageNumber];
        if (!entry) return;
        CT.downloadBlob(entry.blob, pageFileName(pageNumber));
        /* Each file needs its own object URL alive while the browser starts saving;
           they are released one by one instead of on the shared 4 s timer. */
        setTimeout(function () { URL.revokeObjectURL(entry.url); }, 20000);
        if (index === numbers.length - 1) CT.toast(numbers.length + ' page PNG files sent', '');
      }, index * 180);
    });
  }

  /* ---------- wiring ---------- */

  dropzone.addEventListener('click', function () { fileInput.click(); });
  dropzone.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput.click();
    }
  });
  dropzone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('dragover'); });
  dropzone.addEventListener('drop', function (event) {
    event.preventDefault();
    dropzone.classList.remove('dragover');
    if (event.dataTransfer.files.length) loadFile(event.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) loadFile(fileInput.files[0]);
    fileInput.value = '';
  });

  scaleSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-scale]');
    if (!btn || state.busy) return;
    setScale(Number(btn.getAttribute('data-scale')));
  });

  viewSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-view]');
    if (btn) setView(btn.getAttribute('data-view'));
  });

  renderBtn.addEventListener('click', function () {
    if (state.busy || !state.doc) return;
    renderSelected(++state.token);
  });

  downloadAll.addEventListener('click', downloadAllPages);

  downloadText.addEventListener('click', function () {
    var text = buildTextFile();
    if (!text) return;
    CT.downloadBlob(new Blob([text], { type: 'text/plain' }), state.baseName + '-text.txt');
  });

  clearBtn.addEventListener('click', function () {
    state.token++;
    state.file = null;
    state.pageCount = 0;
    closeDoc();
    clearOutputs();
    infoBox.hidden = true;
    pageRange.value = '';
    setError('');
    hideProgress();
    setRangeHint('Counted from 1. Leave empty to use every page.', false);
    setHint('Nothing yet');
    renderBtn.disabled = true;
    countEl.textContent = '—';
  });

  setScale(2);
  setView('images');
  renderBtn.disabled = true;
})();
