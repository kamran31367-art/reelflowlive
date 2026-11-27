import { operations, $, escapeHtml, requireFile, htmlResult } from './core.js';

operations['video-to-step-guide'] = async (v, files) => {
  const file = requireFile(files, 'video');
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.preload = 'auto'; video.muted = true; video.playsInline = true; video.src = url;
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('The video metadata took too long to load.')), 10000);
      video.onloadedmetadata = () => { clearTimeout(timer); resolve(); };
      video.onerror = () => { clearTimeout(timer); reject(new Error('This video could not be decoded.')); };
    });
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) throw new Error('The video duration is not available.');
    const steps = [];
    for (let time = 0; time < duration; time += v.interval) {
      video.currentTime = Math.min(time, duration - .05);
      await new Promise((resolve) => {
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          video.onseeked = null;
          resolve();
        };
        const timer = setTimeout(done, 1200);
        video.onseeked = done;
      });
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 960 / video.videoWidth);
      canvas.width = Math.round(video.videoWidth * scale); canvas.height = Math.round(video.videoHeight * scale);
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      steps.push({ time, image: canvas.toDataURL('image/jpeg', .78) });
      if (steps.length >= 120) break;
    }
    const notes = v.notes.replace(/\r/g, '').split('\n');
    const rows = steps.map((step, index) => `<section class="step-row"><b>${formatTime(step.time)}</b><div><img src="${step.image}" alt="Frame at ${formatTime(step.time)}" style="width:100%;border-radius:8px"><p>${escapeHtml(notes[index] || `Step ${index + 1}: describe what happens here.`)}</p></div></section>`).join('');
    const content = `<article class="post-content"><h1>Step-by-step guide</h1>${rows}</article>`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Step-by-step guide</title><style>body{font:16px/1.6 system-ui;max-width:900px;margin:40px auto;padding:0 20px;color:#0f172a}img{max-width:100%}section{display:grid;grid-template-columns:90px 1fr;gap:16px;margin:24px 0}@media(max-width:600px){section{grid-template-columns:1fr}}</style></head><body>${content}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    return { html: `<div class="step-list">${rows}</div>`, blob, filename: 'video-step-guide.html', copyText: steps.map((step, i) => `${formatTime(step.time)} ${notes[i] || ''}`.trim()).join('\n'), status: `${steps.length} steps created` };
  } finally {
    video.onloadedmetadata = null; video.onseeked = null; video.onerror = null;
    video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url);
  }
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

operations['webcam-mirror'] = () => ({
  html: `<div class="utility-list"><video class="media-preview" autoplay playsinline muted></video><div class="split-actions"><button class="btn btn-primary" data-camera-start type="button">Start camera</button><button class="btn btn-ghost" data-camera-stop type="button" hidden>Stop</button><button class="btn btn-ghost" data-camera-flip type="button">Flip</button><button class="btn btn-primary" data-camera-snapshot type="button" hidden>Save snapshot</button></div></div>`,
  interactive: 'webcam', status: 'Camera stopped'
});

operations['online-audio-recorder'] = () => ({
  html: `<div class="utility-list"><div class="stat-big" data-record-timer>00:00</div><audio controls class="media-preview"></audio><div class="split-actions"><button class="btn btn-primary" data-record-start type="button">Start recording</button><button class="btn btn-ghost" data-record-stop type="button" hidden>Stop</button><a class="btn btn-primary" data-record-download download="recording.webm" hidden>Download recording</a></div></div>`,
  interactive: 'recorder', status: 'Ready to record'
});
