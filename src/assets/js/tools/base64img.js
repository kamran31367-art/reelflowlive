/* Image to Base64 - encode a file to a data URI or decode one back to an image. */
(function () {
  'use strict';

  var dirSeg = document.getElementById('dirSeg');
  var encodePane = document.getElementById('encodePane');
  var decodePane = document.getElementById('decodePane');
  var encodeOut = document.getElementById('encodeOut');
  var decodeOut = document.getElementById('decodeOut');
  var outEmpty = document.getElementById('outEmpty');
  var outHint = document.getElementById('outHint');

  var dropzone = document.getElementById('b64Dropzone');
  var fileInput = document.getElementById('b64File');
  var infoBox = document.getElementById('b64Info');
  var nameEl = document.getElementById('b64Name');
  var dimsEl = document.getElementById('b64Dims');
  var bytesEl = document.getElementById('b64Bytes');
  var encodedEl = document.getElementById('b64Encoded');
  var dataOutput = document.getElementById('dataOutput');
  var copyData = document.getElementById('copyData');
  var downloadData = document.getElementById('downloadData');

  var dataInput = document.getElementById('dataInput');
  var decodeHint = document.getElementById('decodeHint');
  var decodedImg = document.getElementById('decodedImg');
  var decodedEmpty = document.getElementById('decodedEmpty');
  var decodedType = document.getElementById('decodedType');
  var decodedSize = document.getElementById('decodedSize');
  var downloadDecoded = document.getElementById('downloadDecoded');

  if (!dropzone) return;

  var mode = 'encode';
  var decodedBlob = null;
  var decodedExt = 'png';
  var lastDataUri = '';

  function setMode(next) {
    mode = next;
    Array.prototype.forEach.call(dirSeg.querySelectorAll('button'), function (btn) {
      var on = btn.getAttribute('data-dir') === next;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    encodePane.hidden = next !== 'encode';
    decodePane.hidden = next !== 'decode';
    encodeOut.hidden = next !== 'encode' || !lastDataUri;
    decodeOut.hidden = next !== 'decode' || !decodedBlob;
    outEmpty.hidden = next === 'encode' ? !!lastDataUri : !!decodedBlob;
    outHint.textContent = next === 'encode' ? (lastDataUri ? 'Data URI ready' : 'Nothing yet') : (decodedBlob ? 'Image ready' : 'Waiting for a data URI');
  }

  function handleFile(file) {
    if (!file || !/^image\//.test(file.type)) {
      CT.toast('Choose an image file', 'err');
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var dataUri = reader.result;
      lastDataUri = dataUri;
      dataOutput.value = dataUri;
      infoBox.hidden = false;
      nameEl.textContent = file.name;
      bytesEl.textContent = CT.fmtBytes(file.size);
      encodedEl.textContent = CT.fmtBytes(dataUri.length);
      var img = new Image();
      img.onload = function () {
        dimsEl.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
      };
      img.src = dataUri;
      setMode('encode');
    };
    reader.onerror = function () { CT.toast('That file could not be read', 'err'); };
    reader.readAsDataURL(file);
  }

  function extFromMime(mime) {
    var map = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/gif': 'gif', 'image/avif': 'avif', 'image/bmp': 'bmp' };
    return map[mime] || 'img';
  }

  function decode() {
    var value = dataInput.value.trim();
    decoderHintReset();
    if (!value) {
      decodedBlob = null;
      decodedImg.hidden = true;
      decodedEmpty.hidden = false;
      downloadDecoded.disabled = true;
      decodedType.textContent = '—';
      decodedSize.textContent = '—';
      setMode('decode');
      return;
    }
    var match = value.match(/^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/i);
    if (!match) {
      decodeHint.textContent = 'This does not look like an image data URI. It must start with data:image/…;base64,';
      decodeHint.classList.add('err');
      decodedBlob = null;
      decodedImg.hidden = true;
      decodedEmpty.hidden = false;
      downloadDecoded.disabled = true;
      setMode('decode');
      return;
    }
    try {
      var binary = atob(match[2].replace(/\s+/g, ''));
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      decodedBlob = new Blob([bytes], { type: match[1] });
      decodedExt = extFromMime(match[1]);
      decodedType.textContent = match[1];
      decodedSize.textContent = CT.fmtBytes(decodedBlob.size);
      decodedImg.src = value;
      decodedImg.hidden = false;
      decodedEmpty.hidden = true;
      downloadDecoded.disabled = false;
    } catch (err) {
      decodeHint.textContent = 'The Base64 part could not be decoded. Check that the string was copied completely.';
      decodeHint.classList.add('err');
      decodedBlob = null;
      decodedImg.hidden = true;
      decodedEmpty.hidden = false;
      downloadDecoded.disabled = true;
    }
    setMode('decode');
  }

  function decoderHintReset() {
    decodeHint.textContent = 'Start with data:image/…;base64, - everything after the comma is the image.';
    decodeHint.classList.remove('err');
  }

  dirSeg.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-dir]');
    if (btn) setMode(btn.getAttribute('data-dir'));
  });

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

  copyData.addEventListener('click', function () {
    CT.copy(dataOutput.value).then(function (ok) {
      CT.toast(ok ? 'Data URI copied' : 'Copy failed', ok ? '' : 'err');
    });
  });

  downloadData.addEventListener('click', function () {
    if (!lastDataUri) return;
    CT.downloadBlob(new Blob([lastDataUri], { type: 'text/plain' }), CT.baseName(nameEl.textContent || 'image') + '.base64.txt');
  });

  dataInput.addEventListener('input', CT.debounce(decode, 250));

  downloadDecoded.addEventListener('click', function () {
    if (decodedBlob) CT.downloadBlob(decodedBlob, 'decoded-image.' + decodedExt);
  });

  setMode('encode');
})();
