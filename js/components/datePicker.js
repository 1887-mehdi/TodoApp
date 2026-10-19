import {
    JALALI_MONTHS, jalaliMonthLength, toJalali, toGregorian,
    isoToJalali, jalaliToIso,
} from '../utils/jalali.js';
import { todayISO } from '../utils/date.js';
import { icon } from '../utils/icons.js';

const WEEK = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const toFa = (n) => Number(n).toLocaleString('fa-IR', { useGrouping: false });

let pop = null;
let current = null;   // { anchor, value, onPick, view: {jy, jm} }

function build() {
    pop = document.createElement('div');
    pop.className = 'jdp';
    pop.hidden = true;
    document.body.appendChild(pop);

    // کلیک بیرون از تقویم و بیرون از دکمه‌ی بازکننده، تقویم را می‌بندد
    document.addEventListener('click', (e) => {
        if (!current) return;
        if (pop.contains(e.target)) return;
        if (current.anchor.contains(e.target)) return;
        close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', close);
}

export function prepareDatePicker() {
    if (!pop) build();
}

function weekdayOfFirst(jy, jm) {
    const { gy, gm, gd } = toGregorian(jy, jm, 1);
    const day = new Date(gy, gm - 1, gd).getDay();   // 0=یکشنبه
    return (day + 1) % 7;                            // 0=شنبه
}

function render() {
    const { view, value } = current;
    const len = jalaliMonthLength(view.jy, view.jm);
    const offset = weekdayOfFirst(view.jy, view.jm);
    const t = isoToJalali(todayISO());
    const sel = value ? isoToJalali(value) : null;

    let cells = '';
    for (let i = 0; i < offset; i++) cells += '<span class="jdp__cell jdp__cell--empty"></span>';
    for (let d = 1; d <= len; d++) {
        const isToday = t.jy === view.jy && t.jm === view.jm && t.jd === d;
        const isSel = sel && sel.jy === view.jy && sel.jm === view.jm && sel.jd === d;
        cells += `<button type="button" class="jdp__cell${isToday ? ' is-today' : ''}${isSel ? ' is-selected' : ''}" data-day="${d}">${toFa(d)}</button>`;
    }

    pop.innerHTML = `
        <div class="jdp__head">
            <button type="button" class="jdp__nav" data-nav="1" aria-label="ماه بعد">${icon('chevron-right', 18)}</button>
            <span class="jdp__title">${JALALI_MONTHS[view.jm - 1]} ${toFa(view.jy)}</span>
            <button type="button" class="jdp__nav" data-nav="-1" aria-label="ماه قبل">${icon('chevron-left', 18)}</button>
        </div>
        <div class="jdp__week">${WEEK.map((w) => `<span>${w}</span>`).join('')}</div>
        <div class="jdp__grid">${cells}</div>
        <div class="jdp__foot">
            <button type="button" class="jdp__link" data-today="1">امروز</button>
            <button type="button" class="jdp__link jdp__link--muted" data-clear="1">پاک کردن</button>
        </div>`;
}

function position() {
    const r = current.anchor.getBoundingClientRect();
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;

    let left = r.right - w;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));

    let top = r.bottom + 8;
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);

    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
}

function pick(iso) {
    const cb = current.onPick;
    close();
    cb(iso);
}

function onClick(e) {
    const nav = e.target.closest('[data-nav]');
    if (nav) {
        const step = Number(nav.dataset.nav);
        let { jy, jm } = current.view;
        jm += step;
        if (jm > 12) { jm = 1; jy++; }
        if (jm < 1) { jm = 12; jy--; }
        current.view = { jy, jm };
        render();
        return;
    }

    const day = e.target.closest('[data-day]');
    if (day) {
        pick(jalaliToIso(current.view.jy, current.view.jm, Number(day.dataset.day)));
        return;
    }

    if (e.target.closest('[data-today]')) pick(todayISO());
    if (e.target.closest('[data-clear]')) pick('');
}

export function openDatePicker({ anchor, value = '', onPick }) {
    if (!pop) build();

    const base = value ? isoToJalali(value) : isoToJalali(todayISO());
    current = { anchor, value, onPick, view: { jy: base.jy, jm: base.jm } };

    pop.onclick = onClick;
    render();
    pop.hidden = false;
    position();
}

export function close() {
    if (pop) pop.hidden = true;
    current = null;
}