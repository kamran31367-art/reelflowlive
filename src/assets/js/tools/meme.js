/* Meme Generator - draws classic top/bottom captions on a canvas at full resolution. */
(function () {
  'use strict';

  var dropzone = document.getElementById('memeDropzone');
  var fileInput = document.getElementById('memeFile');
  var infoBox = document.getElementById('memeInfo');
  var nameEl = document.getElementById('memeName');
  var dimsEl = document.getElementById('memeDims');
  var topInput = document.getElementById('memeTop');
  var bottomInput = document.getElementById('memeBottom');
  var sizeInput = document.getElementById('memeSize');
  var sizeValue = document.getElementById('memeSizeValue');
  var colorInput = document.getElementById('memeColor');
  var upperSeg = document.getElementById('upperSeg');
  var upperInput = document.getElementById('memeUpper');
  var outlineSeg = document.getElementById('outlineSeg');
  var outlineInput = document.getElementById('memeOutline');
  var canvas = document.getElementById('memeCanvas');
  var emptyEl = document.getElementById('memeEmpty');
  var hintEl = document.getElementById('memeHint');
  var downloadBtn = document.getElementById('memeDownload');
  var resetBtn = document.getElementById('memeReset');

  if (!dropzone) return;

  var image = null;

  function setSeg(seg, input, attr, value) {
    input.value = value;
    Array.prototype.forEach.call(seg.querySelectorAll('button'), function (btn) {
      var on = btn.getAttribute('data-' + attr) === value;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function handleFile(file) {
    if (!file || !/^image\//.test(file.type)) {
      CT.toast('Choose an image file', 'err');
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        image = img;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        infoBox.hidden = false;
        nameEl.textContent = file.name;
        dimsEl.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
        render();
      };
      img.onerror = function () { CT.toast('That image could not be read', 'err'); };
      img.src = reader.result;
    };
    reader.onerror = function () { CT.toast('That file could not be read', 'err'); };
    reader.readAsDataURL(file);
  }

  function wrapText(ctx, text, maxWidth) {
    var words = text.split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var lines = [];
    var line = words[0];
    for (var i = 1; i < words.length; i++) {
      var test = line + ' ' + words[i];
      if (ctx.measureText(test).width <= maxWidth) {
        line = test;
      } else {
        lines.push(line);
        line = words[i];
      }
    }
    lines.push(line);
    return lines;
  }

  function drawCaption(ctx, text, position) {
    if (!text) return;
    var fontSize = Math.max(12, Math.round(canvas.width * (parseFloat(sizeInput.value) / 100)));
    var lineHeight = fontSize * 1.12;
    var padding = canvas.width * 0.03;
    ctx.font = '700 ' + fontSize + 'px Impact, "Arial Black", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var lines = wrapText(ctx, text, canvas.width - padding * 2);
    var outline = outlineInput.value === '1';

    lines.forEach(function (lineText, index) {
      var y = position === 'top'
        ? padding + index * lineHeight
        : canvas.height - padding - fontSize - (lines.length - 1 - index) * lineHeight;
      if (outline) {
        ctx.lineWidth = Math.max(3, fontSize * 0.09);
        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.strokeText(lineText, canvas.width / 2, y);
      }
      ctx.fillStyle = colorInput.value;
      ctx.fillText(lineText, canvas.width / 2, y);
    });
  }

  function render() {
    if (!image) {
      canvas.hidden = true;
      emptyEl.hidden = false;
      downloadBtn.disabled = true;
      hintEl.textContent = 'No image yet';
      return;
    }
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    var upper = upperInput.value === '1';
    var topText = upper ? topInput.value.toUpperCase() : topInput.value;
    var bottomText = upper ? bottomInput.value.toUpperCase() : bottomInput.value;

    drawCaption(ctx, topText, 'top');
    drawCaption(ctx, bottomText, 'bottom');

    canvas.hidden = false;
    emptyEl.hidden = true;
    downloadBtn.disabled = false;
    hintEl.textContent = image.naturalWidth + ' x ' + image.naturalHeight;
  }

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
    if (event.dataTransfer.files.length) handleFile(event.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
    fileInput.value = '';
  });

  var live = CT.debounce(render, 120);
  topInput.addEventListener('input', live);
  bottomInput.addEventListener('input', live);
  colorInput.addEventListener('input', live);
  sizeInput.addEventListener('input', function () {
    sizeValue.textContent = sizeInput.value;
    live();
  });

  upperSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-upper]');
    if (btn) { setSeg(upperSeg, upperInput, 'upper', btn.getAttribute('data-upper')); render(); }
  });
  outlineSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-outline]');
    if (btn) { setSeg(outlineSeg, outlineInput, 'outline', btn.getAttribute('data-outline')); render(); }
  });

  downloadBtn.addEventListener('click', function () {
    canvas.toBlob(function (blob) {
      if (blob) CT.downloadBlob(blob, 'meme.png');
      else CT.toast('PNG export failed', 'err');
    }, 'image/png');
  });

  resetBtn.addEventListener('click', function () {
    image = null;
    fileInput.value = '';
    infoBox.hidden = true;
    topInput.value = '';
    bottomInput.value = '';
    setSeg(upperSeg, upperInput, 'upper', '1');
    setSeg(outlineSeg, outlineInput, 'outline', '1');
    render();
  });

  render();
})();
