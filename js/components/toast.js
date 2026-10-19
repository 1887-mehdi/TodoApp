import { toasts } from '../core/dom.js';
import { icon } from '../utils/icons.js';

const MAX_VISIBLE = 1;      // حداکثر پیام همزمان
const DURATION = 3000;      // مدت همه‌ی پیام‌ها (میلی‌ثانیه)

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

    // محتوای پیام
    const row = document.createElement('div');
    row.className = 'app-toast__row';
    row.innerHTML = icon(ICONS[type] ?? ICONS.info, 20);

    const text = document.createElement('span');
    text.className = 'app-toast__text';
    text.textContent = message; // textContent => امن در برابر XSS
    row.appendChild(text);

    let closed = false;
    const dismiss = () => {
        if (closed) return;
        closed = true;
        el.classList.add('app-toast--leaving');
        el.addEventListener('animationend', () => {
            el.remove();
            visible--;
            pump();               // نفر بعدی صف
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

    // نوار شمارش معکوس
    const bar = document.createElement('div');
    bar.className = 'app-toast__bar';
    const fill = document.createElement('div');
    fill.className = 'app-toast__bar-fill';
    bar.appendChild(fill);

    el.append(row, bar);
    toasts.appendChild(el);

    // پایان انیمیشن نوار = بسته شدن پیام (با hover متوقف می‌شه)
    fill.addEventListener('animationend', dismiss, { once: true });
}

/**
 * options.action = { label, onClick }  → دکمه‌ی داخل پیام (مثل «بازگردانی»)
 */
export function showToast(message, type = 'success', options = {}) {
    queue.push({ message, type, options });
    pump();
}