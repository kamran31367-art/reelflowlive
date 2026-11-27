/* Title & Caption Preview */
(function () {
  const CT = window.CT;
  const titleInput = document.getElementById('titleInput');
  if (!titleInput || !CT) return;

  const channelInput = document.getElementById('channelInput');
  const thumbInput = document.getElementById('thumbInput');
  const thumbClear = document.getElementById('thumbClear');
  const thumbName = document.getElementById('thumbName');
  const captionInput = document.getElementById('captionInput');
  const titleCount = document.getElementById('titleCount');
  const captionCount = document.getElementById('captionCount');
  const viewsSeg = document.getElementById('viewsSeg');
  const viewsMode = document.getElementById('viewsMode');
  const narrowToggle = document.getElementById('narrowToggle');
  const mockWrap = document.getElementById('mockWrap');
  const ytThumb = document.getElementById('ytThumb');
  const ytTitle = document.getElementById('ytTitle');
  const ytMeta = document.getElementById('ytMeta');
  const ytNote = document.getElementById('ytNote');
  const igUser = document.getElementById('igUser');
  const igCaption = document.getElementById('igCaption');
  const igMore = document.getElementById('igMore');
  const igNote = document.getElementById('igNote');

  const VIEWS = {
    small: '1.2K views · 3 days ago',
    large: '480K views · 2 weeks ago'
  };
  const TITLE_MAX = 100;
  const CAPTION_MAX = 2200;
  const NARROW_WIDTH = '300px';

  let thumbUrl = null;
  let captionExpanded = false;

  function channelName() {
    return channelInput.value.trim() || 'Your channel';
  }

  function countLabel(el, value, max) {
    el.textContent = value + (value > max ? ' (over the ' + max + ' limit)' : '');
    el.className = value > max ? 'over' : '';
  }

  function renderThumb() {
    CT.$$('img', ytThumb).forEach(function (img) { img.remove(); });
    if (thumbUrl) {
      const img = document.createElement('img');
      img.src = thumbUrl;
      img.alt = 'Your thumbnail in the search card';
      ytThumb.appendChild(img);
      ytThumb.setAttribute('data-has-image', 'true');
      thumbName.textContent = 'Using your uploaded image';
      thumbClear.hidden = false;
    } else {
      ytThumb.textContent = '16:9 thumbnail';
      ytThumb.removeAttribute('data-has-image');
      thumbName.textContent = 'No image - a placeholder is shown';
      thumbClear.hidden = true;
    }
  }

  /* Only offer "more" when the clamp really hides text. */
  function updateMoreVisibility() {
    const full = captionInput.value;
    if (!full.trim() || captionExpanded) {
      igMore.hidden = true;
      igNote.hidden = false;
      return;
    }
    /* Measure a clone of the full caption against the clamped height. */
    const probe = igCaption.cloneNode(false);
    probe.className = 'ig-caption';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.width = igCaption.getBoundingClientRect().width + 'px';
    probe.textContent = full;
    igCaption.parentNode.appendChild(probe);
    const needsMore = probe.getBoundingClientRect().height > igCaption.getBoundingClientRect().height + 1;
    probe.remove();
    igMore.hidden = !needsMore;
    igNote.hidden = !needsMore;
  }

  function render() {
    const title = titleInput.value;
    const caption = captionInput.value;
    const channel = channelName();

    countLabel(titleCount, title.length, TITLE_MAX);
    countLabel(captionCount, caption.length, CAPTION_MAX);

    ytTitle.textContent = title || 'Your title appears here';
    ytMeta.textContent = channel + ' · ' + VIEWS[viewsMode.value];
    igUser.textContent = channel;
    igCaption.textContent = caption || 'Your caption appears here.';

    igCaption.classList.toggle('clamped', !captionExpanded && !!caption.trim());
    igMore.textContent = captionExpanded ? 'Show less' : '… more';
    igMore.setAttribute('aria-expanded', captionExpanded ? 'true' : 'false');
    updateMoreVisibility();

    mockWrap.style.maxWidth = narrowToggle.checked ? NARROW_WIDTH : '';
    if (narrowToggle.checked) {
      ytNote.textContent = 'Narrow phone width: the card rearranges to a small thumbnail, and the cut can move by a word or two.';
    } else {
      ytNote.textContent = 'The title is clamped at two lines, exactly like the search card.';
    }
  }

  const scheduleRender = CT.debounce(render, 80);

  [titleInput, channelInput].forEach(function (el) {
    el.addEventListener('input', scheduleRender);
  });

  captionInput.addEventListener('input', function () {
    captionExpanded = false;
    scheduleRender();
  });

  CT.$$('button', viewsSeg).forEach(function (btn) {
    btn.addEventListener('click', function () {
      CT.$$('button', viewsSeg).forEach(function (b) {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      viewsMode.value = btn.getAttribute('data-views');
      render();
    });
  });

  narrowToggle.addEventListener('change', render);

  function toggleCaption() {
    if (captionInput.value.trim()) {
      captionExpanded = !captionExpanded;
      render();
    }
  }
  igMore.addEventListener('click', toggleCaption);
  igMore.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCaption();
    }
  });

  function clearThumb() {
    if (thumbUrl) {
      URL.revokeObjectURL(thumbUrl);
      thumbUrl = null;
    }
    thumbInput.value = '';
    renderThumb();
  }

  thumbInput.addEventListener('change', function () {
    const file = thumbInput.files && thumbInput.files[0];
    if (!file) return;
    if (!file.type || file.type.indexOf('image/') !== 0) {
      CT.toast('Please choose an image file.', 'err');
      thumbInput.value = '';
      return;
    }
    if (thumbUrl) URL.revokeObjectURL(thumbUrl);
    thumbUrl = URL.createObjectURL(file);
    renderThumb();
  });

  thumbClear.addEventListener('click', clearThumb);

  channelInput.addEventListener('input', function () {
    igUser.textContent = channelName();
  });

  renderThumb();
  render();
})();
