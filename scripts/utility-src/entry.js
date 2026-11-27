import { init, operations } from './core.js';
import './tailwind.js';
import './developer.js';
import './image.js';
import './mail.js';
import './text.js';
import './video.js';
import './converters.js';
import './misc.js';

window.CT_UTILITY_OPERATIONS = Object.keys(operations).sort();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
