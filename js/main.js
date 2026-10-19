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
// متن‌های طولانی را برای پیام کوتاه می‌کند
const short = (text, max = 28) =>
    text.length > max ? `${text.slice(0, max)}…` : text;

// ---------- عملیات هر آیتم ----------
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

// ---------- افزودن ----------
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

// ---------- جستجو ----------
// ---------- حالت افزودن / جستجو (یک input برای هر دو) ----------
const PLACEHOLDER_ADD = 'یک تسک جدید بنویس...';
const PLACEHOLDER_SEARCH = 'جستجو در تسک‌ها...';
let searchMode = false;

function setSearchMode(on) {
    searchMode = on;

    addForm.classList.toggle('is-search', on);
    addExtras.inert = on;                       // در حالت جستجو فوکوس‌پذیر نیست
    modeBtn.setAttribute('aria-pressed', String(on));
    modeBtn.title = on ? 'بستن جستجو' : 'جستجو در تسک‌ها';
    modeBtn.setAttribute('aria-label', modeBtn.title);
    todoInput.placeholder = on ? PLACEHOLDER_SEARCH : PLACEHOLDER_ADD;
    todoInput.maxLength = on ? 200 : 100;

    // متن تایپ‌شده را جابه‌جا نمی‌کنیم؛ هر حالت فقط با ورودی خودش کار می‌کنه
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
// کلیک یا لمس بیرون از فرم، حالت جستجو را می‌بندد
document.addEventListener('pointerdown', (e) => {
    if (!searchMode) return;
    if (addForm.contains(e.target)) return;   // داخل فرم (شامل ذره‌بین/ضربدر) نباشه
    setSearchMode(false);
});

// ---------- فیلتر ----------
filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
        render();
    });
});

// ---------- پاک کردن همه ----------
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

// ---------- شروع ----------
renderStaticIcons();
initTheme();
syncAddButton();
initDragDrop(handlers);
initDateField();
render();

// ---------- پایان لودینگ ----------
const pageLoader = document.getElementById('pageLoader');

const hideLoader = () => {
    if (!pageLoader) return;
    pageLoader.classList.add('is-hidden');
    pageLoader.addEventListener('transitionend', () => pageLoader.remove(), { once: true });
};

// منتظر فونت‌ها می‌مونیم، ولی حداکثر ۱.۵ ثانیه
Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
]).then(() => setTimeout(hideLoader, 400));