import {
    todoList, emptyState, emptyIcon, emptyTitle, emptyText,
    counter, percent, progressBar, progressTrack, clearBtn, filterBtns,
} from '../core/dom.js';
import {
    getTodos, getVisibleTodos, getFilter, getSearch, getStats, consumeLastAddedId,
} from '../core/state.js';
import { createTodoItem } from './todoItem.js';
import { icon } from '../utils/icons.js';

const toFa = (n) => n.toLocaleString('fa-IR');

function renderList(handlers) {
    const newId = consumeLastAddedId();
    const visible = getVisibleTodos();

    todoList.innerHTML = '';
    visible.forEach((task) => {
        todoList.appendChild(
            createTodoItem(task, { isNew: task.id === newId, handlers })
        );
    });

    renderEmpty(visible.length);
}

function renderEmpty(visibleCount) {
    emptyState.hidden = visibleCount > 0;
    if (visibleCount > 0) return;

    if (getTodos().length === 0) {
        emptyIcon.innerHTML = icon('clipboard', 34);
        emptyTitle.textContent = 'هنوز تسکی نداری';
        emptyText.textContent = 'اولین تسک رو از بالا اضافه کن.';
    } else if (getSearch().trim() !== '') {
        emptyIcon.innerHTML = icon('search', 34);
        emptyTitle.textContent = 'نتیجه‌ای پیدا نشد';
        emptyText.textContent = 'عبارت دیگه‌ای رو جستجو کن.';
    } else {
        emptyIcon.innerHTML = icon('clipboard', 34);
        emptyTitle.textContent = 'این بخش خالیه';
        emptyText.textContent = 'در این دسته تسکی وجود نداره.';
    }
}

function renderStats() {
    const { total, remaining, percent: pct } = getStats();

    counter.textContent = total === 0
        ? 'هنوز کاری اضافه نشده'
        : `${toFa(remaining)} کار باقی مانده`;

    percent.textContent = `${toFa(pct)}٪`;
    progressBar.style.width = `${pct}%`;
    progressTrack.setAttribute('aria-valuenow', pct);

    clearBtn.disabled = total === 0;
}

function renderFilters() {
    const filter = getFilter();
    filterBtns.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
}

export function renderApp(handlers) {
    renderList(handlers);
    renderStats();
    renderFilters();
}