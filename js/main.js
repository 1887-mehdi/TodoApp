import {
    addForm, todoInput, prioritySelect, dueInput, addBtn, modeBtn, addExtras,
    filterBtns, clearBtn, todoList,
} from './core/dom.js';
import {
    addTodo, removeTodo, updateTodo, moveTodo, clearTodos, restoreTodo, restoreAll,
    setFilter, setSearch, getTodoById,
} from './core/state.js';
import { renderApp } from './components/todoList.js';
import { openEditModal, openConfirmModal } from './components/modal.js';
import { showToast } from './components/toast.js';
import { renderStaticIcons } from './utils/icons.js';
import { initTheme } from './utils/theme.js';
import { initDragDrop } from './components/dragDrop.js';
import { initDateField, resetDateField } from './components/dateField.js';
import { todayISO } from './utils/date.js';
// Shortens long texts for messaging
const short = (text, max = 28) =>
    text.length > max ? `${text.slice(0, max)}…` : text;

// ---------- Operations for each item ----------
const handlers = {
    onToggle(id, completed) {
        updateTodo(id, { completed });
        render();
    },

    onPriorityChange(id, priority) {
        updateTodo(id, { priority });
        render();
    },

    onEdit(id) {
        const todo = getTodoById(id);
        if (!todo || todo.completed) return;

        openEditModal(todo, (changes) => {
            updateTodo(id, changes);
            render();
            showToast('تغییرات ذخیره شد.', 'success');
        });
    },

    onDelete(id) {
        const todo = getTodoById(id);
        if (!todo) return;

        const title = todo.title;

        openConfirmModal(
            {
                title: 'حذف تسک',
                message: `آیا می‌خواهی تسک «${short(title)}» را حذف کنی؟`,
                confirmText: 'بله، حذف کن',
            },
            () => {
                                const finish = () => {
                    const result = removeTodo(id);
                    render();
                    if (!result) return;

                    showToast(`تسک «${short(title)}» حذف شد.`, 'danger', {
                        action: {
                            label: 'بازگردانی',
                            onClick: () => {
                                restoreTodo(result.todo, result.index);
                                render();
                                showToast('تسک بازگردانی شد.', 'success');
                            },
                        },
                    });
                };

                const li = todoList.querySelector(`[data-id="${CSS.escape(id)}"]`);
                if (li) {
                    li.classList.add('is-removing');
                    setTimeout(finish, 250);
                } else {
                    finish();
                }
            }
        );
    },

        onMove(fromId, targetId, position) {
        moveTodo(fromId, targetId, position);
        render();
    },
};

function render() {
    renderApp(handlers);
}

// ---------- Add ----------
function syncAddButton() {
    addBtn.disabled = searchMode || todoInput.value.trim() === '';
}

todoInput.addEventListener('input', () => {
    if (searchMode) {
        setSearch(todoInput.value);
        render();
    } else {
        syncAddButton();
    }
});

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchMode) return;
    const title = todoInput.value.trim();
    if (title === '') return;

    addTodo(title, prioritySelect.value, dueInput.value || todayISO());
    todoInput.value = '';
    resetDateField();
    syncAddButton();
    render();
    todoInput.focus();

    showToast(`تسک «${short(title)}» اضافه شد.`, 'success');
});


// ---------- Search ----------
const PLACEHOLDER_ADD = 'یک تسک جدید بنویس...';
const PLACEHOLDER_SEARCH = 'جستجو در تسک‌ها...';
let searchMode = false;

function setSearchMode(on) {
    searchMode = on;

    addForm.classList.toggle('is-search', on);
    addExtras.inert = on;                       // Not focusable in search mode
    modeBtn.setAttribute('aria-pressed', String(on));
    modeBtn.title = on ? 'بستن جستجو' : 'جستجو در تسک‌ها';
    modeBtn.setAttribute('aria-label', modeBtn.title);
    todoInput.placeholder = on ? PLACEHOLDER_SEARCH : PLACEHOLDER_ADD;
    todoInput.maxLength = on ? 200 : 100;

    // We do not move the typed text; each state works only with its own input.
    todoInput.value = '';
    setSearch('');
    syncAddButton();
    render();
    todoInput.focus();
}

modeBtn.addEventListener('click', () => setSearchMode(!searchMode));

todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchMode) setSearchMode(false);
});
// Clicking or touching outside the form closes the search mode.
document.addEventListener('pointerdown', (e) => {
    if (!searchMode) return;
    if (addForm.contains(e.target)) return;   // Should not be inside the form (including the magnifying glass/cross icon)
    setSearchMode(false);
});

// ---------- Filter ----------
filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
        render();
    });
});

// ---------- Clear All ----------
clearBtn.addEventListener('click', () => {
    openConfirmModal(
        {
            title: 'پاک کردن همه‌ی تسک‌ها',
            message: 'همه‌ی تسک‌ها برای همیشه حذف می‌شن. مطمئنی؟',
            confirmText: 'بله، پاک کن',
        },
                () => {
            const previous = clearTodos();
            render();
            showToast('همه‌ی تسک‌ها پاک شدند.', 'danger', {
                action: {
                    label: 'بازگردانی',
                    onClick: () => {
                        restoreAll(previous);
                        render();
                        showToast('تسک‌ها بازگردانی شدند.', 'success');
                    },
                },
            });
        }
    );
});

// ---------- Start ----------
renderStaticIcons();
initTheme();
syncAddButton();
initDragDrop(handlers);
initDateField();
render();

// ---------- Loading Complete ----------
const pageLoader = document.getElementById('pageLoader');

const hideLoader = () => {
    if (!pageLoader) return;
    pageLoader.classList.add('is-hidden');
    pageLoader.addEventListener('transitionend', () => pageLoader.remove(), { once: true });
};

// We’ll wait for the fonts, but for a maximum of 1.5 seconds.
Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
]).then(() => setTimeout(hideLoader, 400));