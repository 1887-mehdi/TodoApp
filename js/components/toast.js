import { toasts } from '../core/dom.js';
import { icon } from '../utils/icons.js';

const MAX_VISIBLE = 1;      // Maximum concurrent messages
const DURATION = 3000;      // Duration of all messages (milliseconds)

const ICONS = {
    success: 'circle-check',
    danger: 'trash',
    info: 'info',
};

const queue = [];
let visible = 0;

function pump() {
    while (visible < MAX_VISIBLE && queue.length > 0) {
        const { message, type, options } = queue.shift();
        visible++;
        mount(message, type, options);
    }
}

function mount(message, type, { action = null } = {}) {
    const el = document.createElement('div');
    el.className = `app-toast app-toast--${type}`;
    el.setAttribute('role', 'status');
    el.style.setProperty('--toast-duration', `${DURATION}ms`);

    // Message content
    const row = document.createElement('div');
    row.className = 'app-toast__row';
    row.innerHTML = icon(ICONS[type] ?? ICONS.info, 20);

    const text = document.createElement('span');
    text.className = 'app-toast__text';
    text.textContent = message; // textContent => Safe against XSS
    row.appendChild(text);

    let closed = false;
    const dismiss = () => {
        if (closed) return;
        closed = true;
        el.classList.add('app-toast--leaving');
        el.addEventListener('animationend', () => {
            el.remove();
            visible--;
            pump();              // Next person in line
        }, { once: true });
    };

    if (action) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'app-toast__action';
        btn.textContent = action.label;
        btn.addEventListener('click', () => {
            action.onClick();
            dismiss();
        });
        row.appendChild(btn);
    }

    // Countdown bar
    const bar = document.createElement('div');
    bar.className = 'app-toast__bar';
    const fill = document.createElement('div');
    fill.className = 'app-toast__bar-fill';
    bar.appendChild(fill);

    el.append(row, bar);
    toasts.appendChild(el);

    // End of strip animation = message closes (pauses on hover)
    fill.addEventListener('animationend', dismiss, { once: true });
}

/**
 * options.action = { label, onClick }  → A button inside the message (e.g., "Restore")
 */
export function showToast(message, type = 'success', options = {}) {
    queue.push({ message, type, options });
    pump();
}