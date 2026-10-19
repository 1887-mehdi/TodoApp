import { icon } from '../utils/icons.js';
import { PRIORITIES, PRIORITY_LABELS } from '../core/constants.js';
import { bindDragSource } from './dragDrop.js';
import { formatDue, dueStatus, formatCreated } from '../utils/date.js';

function createIconButton(className, label, iconName) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `icon-btn ${className}`;
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = icon(iconName, 18);
    return btn;
}

export function createTodoItem(task, { isNew, handlers }) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = task.id;
    li.dataset.priority = task.priority;
    li.classList.toggle('is-completed', task.completed);
    li.classList.toggle('is-new', isNew);

    // Drag handle
    const grip = document.createElement('span');
    grip.className = 'todo-item__grip';
    grip.innerHTML = icon('grip', 18);

    // Checkbox
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'todo-item__check';
    checkBox.checked = task.completed;
    checkBox.setAttribute('aria-label', 'انجام شد');
    checkBox.addEventListener('change', () =>
        handlers.onToggle(task.id, checkBox.checked));

    // Title and description
    const content = document.createElement('div');
    content.className = 'todo-item__content';

    const title = document.createElement('span');
    title.className = 'todo-item__title';
    title.textContent = task.title;
    content.appendChild(title);

    if (task.description) {
        const desc = document.createElement('p');
        desc.className = 'todo-item__desc';
        desc.textContent = task.description;
        content.appendChild(desc);
    }

    // Operations
    const actions = document.createElement('div');
    actions.className = 'todo-item__actions';

    const select = document.createElement('select');
    select.className = 'priority-select';
    select.setAttribute('aria-label', 'اولویت');
    select.innerHTML = PRIORITIES
        .map((p) => `<option value="${p}">${PRIORITY_LABELS[p]}</option>`)
        .join('');
    select.value = task.priority;
    select.addEventListener('change', () =>
        handlers.onPriorityChange(task.id, select.value));

    const editLabel = task.completed ? 'تسک انجام‌شده قابل ویرایش نیست' : 'ویرایش';
    const editBtn = createIconButton('editBtn', editLabel, 'edit');
    editBtn.disabled = task.completed;
    editBtn.addEventListener('click', () => handlers.onEdit(task.id));

    const deleteBtn = createIconButton('icon-btn--danger', 'حذف', 'trash');
    deleteBtn.addEventListener('click', () => handlers.onDelete(task.id));

        actions.append(select);

    if (task.dueDate) {
        const status = task.completed ? 'done' : dueStatus(task.dueDate);

        const due = document.createElement('span');
        due.className = `todo-item__due todo-item__due--${status}`;
        due.title = 'تاریخ سررسید';
        due.innerHTML = icon('calendar', 14);

        const dueText = document.createElement('span');
        dueText.textContent = formatDue(task.dueDate);
        due.appendChild(dueText);

        actions.append(due);
    }

    actions.append(editBtn, deleteBtn);
    // Drag and drop
    bindDragSource(li, task.id);
    li.append(grip, checkBox, content, actions);
    if (task.createdAt) {
        const created = document.createElement('span');
        created.className = 'todo-item__created';
        created.textContent = formatCreated(task.createdAt);
        created.title = 'تاریخ اضافه شدن';
        li.append(created);
    }
    return li;
}