import {
    editModal as editModalEl, editForm, editTitle, editDescription, editPriority,
    editDue, editError, editCounter,
    confirmModal, confirmTitle, confirmMessage, confirmOk, confirmCancel, confirmClose,
} from '../core/dom.js';

import { openDatePicker } from './datePicker.js';
import { formatDue } from '../utils/date.js';

const editModal = bootstrap.Modal.getOrCreateInstance(editModalEl);

let onSaveCallback = null;
let onConfirmCallback = null;

// کلیک روی بک‌دراپ مودال را می‌بندد (فقط برای مودال تأیید که هنوز <dialog> است)
function closeOnBackdrop(dialog) {
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });
}

function clearError() {
    editError.textContent = '';
    editTitle.classList.remove('is-invalid');
}

// ---------- مودال ویرایش (Bootstrap) ----------
const toFa = (n) => n.toLocaleString('fa-IR');
const MAX_DESC = 300;

function updateCounter() {
    editCounter.textContent = `${toFa(editDescription.value.length)} / ${toFa(MAX_DESC)}`;
}

function syncEditDue() {
    const v = editDue.value;
    editDueText.textContent = v ? formatDue(v) : 'انتخاب تاریخ';
    editDueBtn.classList.toggle('has-value', Boolean(v));
    editDueClear.hidden = !v;
}

editDueBtn.addEventListener('click', (e) => {
    if (e.target.closest('#editDueClear')) {
        editDue.value = '';
        syncEditDue();
        return;
    }
    openDatePicker({
        anchor: editDueBtn,
        value: editDue.value,
        onPick: (iso) => { editDue.value = iso; syncEditDue(); },
    });
});

export function openEditModal(todo, onSave) {
    onSaveCallback = onSave;

    editTitle.value = todo.title;
    editDescription.value = todo.description;
    editPriority.value = todo.priority;
    editDue.value = todo.dueDate || '';      // ← جدید
    clearError();
    updateCounter();
    syncEditDue();
    editModal.show();
}

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = editTitle.value.trim();
    if (title === '') {
        editError.textContent = 'عنوان تسک نمی‌تواند خالی باشد.';
        editTitle.classList.add('is-invalid');
        editTitle.focus();
        return;
    }

    onSaveCallback?.({
        title,
        description: editDescription.value.trim(),
        priority: editPriority.value,
        dueDate: editDue.value,
    });
    editModal.hide();
});

editTitle.addEventListener('input', clearError);
editDescription.addEventListener('input', updateCounter);

// فوکوس روی عنوان بعد از تمام شدن انیمیشن باز شدن
editModalEl.addEventListener('shown.bs.modal', () => editTitle.focus());
editModalEl.addEventListener('hidden.bs.modal', () => { onSaveCallback = null; });

// ---------- مودال تأیید ----------
export function openConfirmModal({ title, message, confirmText = 'تأیید' }, onConfirm) {
    onConfirmCallback = onConfirm;

    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmOk.textContent = confirmText;

    confirmModal.showModal();
}

confirmOk.addEventListener('click', () => {
    onConfirmCallback?.();
    confirmModal.close();
});

confirmCancel.addEventListener('click', () => confirmModal.close());
confirmClose.addEventListener('click', () => confirmModal.close());
confirmModal.addEventListener('close', () => { onConfirmCallback = null; });
closeOnBackdrop(confirmModal);