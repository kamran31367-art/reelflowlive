/* Background Remover - MediaPipe selfie segmenter run locally, alpha cut on canvas. */
(function () {
  'use strict';

  var drop = document.getElementById('bgDrop');
  var fileInput = document.getElementById('bgFile');
  var info = document.getElementById('bgInfo');
  var nameEl = document.getElementById('bgName');
  var dimsEl = document.getElementById('bgDims');
  var threshold = document.getElementById('bgThreshold');
  var thresholdValue = document.getElementById('bgThresholdValue');
  var soften = document.getElementById('bgSoften');
  var softenValue = document.getElementById('bgSoftenValue');
  var statusEl = document.getElementById('bgStatus');
  var emptyEl = document.getElementById('bgEmpty');
  var canvas = document.getElementById('bgCanvas');
  var downloadBtn = document.getElementById('bgDownload');
  var resetBtn = document.getElementById('bgReset');
  var errorEl = document.getElementById('bgError');

  if (!drop) return;

  var image = null;
  var fileName = '';
  var segmenterPromise = null;
  var running = false;
  var pending = false;

  function setError(msg) {
    errorEl.textContent = msg || '';
    errorEl.hidden = !msg;
  }

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  function moduleReady() {
    if (window.__mp) return Promise.resolve(window.__mp);
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () {
        reject(new Error('the segmentation engine did not load (check the browser console)'));
      }, 20000);
      window.addEventListener('mp-ready', function () {
        clearTimeout(timer);
        resolve(window.__mp);
      }, { once: true });
    });
  }

  function getSegmenter() {
    if (segmenterPromise) return segmenterPromise;
    segmenterPromise = moduleReady().then(function (mp) {
      setStatus('Downloading the model (about 10 MB, cached after this)…');
      return mp.FilesetResolver.forVisionTasks('/assets/js/vendor/mediapipe/wasm').then(function (fileset) {
        return mp.ImageSegmenter.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: '/assets/js/vendor/mediapipe/models/selfie_segmenter.tflite',
            delegate: 'CPU'
          },
          runningMode: 'IMAGE',
          outputCategoryMask: true,
          outputConfidenceMask: true
        });
      });
    });
    segmenterPromise.catch(function () { segmenterPromise = null; });
    return segmenterPromise;
  }

  function blurAlpha(src, w, h, radius) {
    if (radius <= 0) return src;
    var tmp = new Float32Array(src.length);
    var out = new Float32Array(src.length);
    var x, y, k, sum, count;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        sum = 0;
        count = 0;
        for (k = -radius; k <= radius; k++) {
          var xx = x + k;
          if (xx >= 0 && xx < w) { sum += src[y * w + xx]; count++; }
        }
        tmp[y * w + x] = sum / count;
      }
    }
    for (x = 0; x < w; x++) {
      for (y = 0; y < h; y++) {
        sum = 0;
        count = 0;
        for (k = -radius; k <= radius; k++) {
          var yy = y + k;
          if (yy >= 0 && yy < h) { sum += tmp[yy * w + x]; count++; }
        }
        out[y * w + x] = sum / count;
      }
    }
    return out;
  }

  function alphaFromConfidence(conf, t) {
    var band = 0.14;
    var lo = Math.max(0, t - band);
    var hi = Math.min(1, t + band);
    var span = Math.max(0.0001, hi - lo);
    var out = new Float32Array(conf.length);
    for (var i = 0; i < conf.length; i++) {
      var a = (conf[i] - lo) / span;
      out[i] = a < 0 ? 0 : a > 1 ? 1 : a;
    }
    return out;
  }

  function compose(alpha, mw, mh) {
    var w = image.naturalWidth;
    var h = image.naturalHeight;

    var maskCanvas = document.createElement('canvas');
    maskCanvas.width = mw;
    maskCanvas.height = mh;
    var maskCtx = maskCanvas.getContext('2d');
    var maskData = maskCtx.createImageData(mw, mh);
    for (var i = 0; i < alpha.length; i++) {
      maskData.data[i * 4] = 255;
      maskData.data[i * 4 + 1] = 255;
      maskData.data[i * 4 + 2] = 255;
      maskData.data[i * 4 + 3] = Math.round(Math.max(0, Math.min(1, alpha[i])) * 255);
    }
    maskCtx.putImageData(maskData, 0, 0);

    var scaled = document.createElement('canvas');
    scaled.width = w;
    scaled.height = h;
    var sctx = scaled.getContext('2d');
    sctx.imageSmoothingEnabled = true;
    sctx.drawImage(maskCanvas, 0, 0, w, h);
    var alphaScaled = sctx.getImageData(0, 0, w, h).data;

    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(image, 0, 0);
    var imgData = ctx.getImageData(0, 0, w, h);
    for (var p = 0; p < w * h; p++) {
      imgData.data[p * 4 + 3] = alphaScaled[p * 4 + 3];
    }
    ctx.putImageData(imgData, 0, 0);

    canvas.hidden = false;
    emptyEl.hidden = true;
    downloadBtn.disabled = false;
    setStatus(w + ' x ' + h + ' cut-out ready');
  }

  function cut() {
    if (!image) return;
    if (running) { pending = true; return; }
    running = true;
    pending = false;
    setError('');
    downloadBtn.disabled = true;
    setStatus('Finding the person…');

    getSegmenter().then(function (seg) {
      var result = seg.segment(image);
      var confMasks = result.confidenceMasks || [];
      var catMask = result.categoryMask;
      var alpha = null;
      var mw = 0;
      var mh = 0;
      var t = parseInt(threshold.value, 10) / 100;
      var radius = parseInt(soften.value, 10);

      if (confMasks.length >= 2) {
        var mask = confMasks[1];
        mw = mask.width;
        mh = mask.height;
        alpha = alphaFromConfidence(mask.getAsFloat32Array(), t);
      } else if (confMasks.length === 1) {
        var only = confMasks[0];
        mw = only.width;
        mh = only.height;
        alpha = alphaFromConfidence(only.getAsFloat32Array(), t);
      } else if (catMask) {
        mw = catMask.width;
        mh = catMask.height;
        var cats = catMask.getAsUint8Array();
        alpha = new Float32Array(cats.length);
        for (var i = 0; i < cats.length; i++) alpha[i] = cats[i] ? 1 : 0;
      }

      if (!alpha || !mw || !mh) {
        if (result.close) result.close();
        throw new Error('the model returned an empty mask');
      }

      alpha = blurAlpha(alpha, mw, mh, radius);

      if (result.close) result.close();
      else {
        confMasks.forEach(function (m) { if (m.close) m.close(); });
        if (catMask && catMask.close) catMask.close();
      }

      compose(alpha, mw, mh);
    }).catch(function (err) {
      setStatus('Could not cut the photo');
      setError('Could not cut this photo: ' + (err && err.message ? err.message : 'unknown error'));
    }).finally(function () {
      running = false;
      if (pending && image) cut();
    });
  }

  function loadFile(file) {
    if (!file || !/^image\//.test(file.type)) {
      CT.toast('Choose an image file', 'err');
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        image = img;
        fileName = file.name;
        info.hidden = false;
        nameEl.textContent = file.name;
        dimsEl.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
        cut();
      };
      img.onerror = function () { setError('That image could not be read.'); };
      img.src = reader.result;
    };
    reader.onerror = function () { setError('That file could not be read.'); };
    reader.readAsDataURL(file);
  }

  drop.addEventListener('click', function () { fileInput.click(); });
  drop.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput.click();
    }
  });
  drop.addEventListener('dragover', function (event) {
    event.preventDefault();
    drop.classList.add('dragover');
  });
  drop.addEventListener('dragleave', function () { drop.classList.remove('dragover'); });
  drop.addEventListener('drop', function (event) {
    event.preventDefault();
    drop.classList.remove('dragover');
    if (event.dataTransfer.files.length) loadFile(event.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) loadFile(fileInput.files[0]);
    fileInput.value = '';
  });

  var recut = CT.debounce(cut, 300);
  threshold.addEventListener('input', function () {
    thresholdValue.textContent = threshold.value;
    recut();
  });
  soften.addEventListener('input', function () {
    softenValue.textContent = soften.value;
    recut();
  });

  downloadBtn.addEventListener('click', function () {
    canvas.toBlob(function (blob) {
      if (blob) CT.downloadBlob(blob, CT.baseName(fileName || 'photo') + '-no-bg.png');
      else CT.toast('PNG export failed', 'err');
    }, 'image/png');
  });

  resetBtn.addEventListener('click', function () {
    image = null;
    fileName = '';
    info.hidden = true;
    canvas.hidden = true;
    canvas.width = canvas.height = 0;
    emptyEl.hidden = false;
    downloadBtn.disabled = true;
    setError('');
    setStatus('Waiting for a photo');
    threshold.value = '50';
    thresholdValue.textContent = '50';
    soften.value = '1';
    softenValue.textContent = '1';
  });
})();
