import { todoList } from '../core/dom.js';

const SCROLL_ZONE = 48;   // Distance from the edge at which auto-scroll begins (px)
const SCROLL_SPEED = 14;  // Scroll speed (px per frame)

let dragId = null;
let handlers = null;
let dropTarget = null;    // { id, position } | { edge }
let scrollDir = 0;
let rafId = null;

const area = () => todoList.closest('.list-area');

// ---------- Line indicating the drop position ----------
function clearIndicators() {
    todoList
        .querySelectorAll('.drop-before, .drop-after')
        .forEach((el) => el.classList.remove('drop-before', 'drop-after'));
    area()?.classList.remove('drop-start', 'drop-end');
}

function showIndicator(target) {
    clearIndicators();
    if (!target) return;

    if (target.edge === 'start') {
        area()?.classList.add('drop-start');
    } else if (target.edge === 'end') {
        area()?.classList.add('drop-end');
    } else {
        const el = todoList.querySelector(`[data-id="${CSS.escape(target.id)}"]`);
        el?.classList.add(target.position === 'after' ? 'drop-after' : 'drop-before');
    }
}

// ---------- Finding the destination based on the mouse location ----------
function resolveTarget(y) {
    const items = [...todoList.querySelectorAll('.todo-item:not(.is-dragging)')];
    if (items.length === 0) return null;

    for (const el of items) {
        const rect = el.getBoundingClientRect();
        if (y < rect.top + rect.height / 2) {
            return { id: el.dataset.id, position: 'before' };
        }
    }
    // Below the midpoint of all items
    return { id: items[items.length - 1].dataset.id, position: 'after' };
}

// ---------- Auto-scroll near the edges ----------
function tickScroll() {
    const el = area();
    if (el && scrollDir !== 0) {
        el.scrollTop += scrollDir * SCROLL_SPEED;
        rafId = requestAnimationFrame(tickScroll);
    } else {
        rafId = null;
    }
}

function updateAutoScroll(y) {
    const el = area();
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (y < rect.top + SCROLL_ZONE) scrollDir = -1;
    else if (y > rect.bottom - SCROLL_ZONE) scrollDir = 1;
    else scrollDir = 0;

    if (scrollDir !== 0 && rafId === null) {
        rafId = requestAnimationFrame(tickScroll);
    }
}

// ---------- End of Drag ----------
function finish() {
    dragId = null;
    dropTarget = null;
    scrollDir = 0;
    clearIndicators();
    todoList
        .querySelectorAll('.is-dragging')
        .forEach((el) => el.classList.remove('is-dragging'));
    todoList.classList.remove('is-sorting');
}

// ---------- API for todoItem.js ----------
export function bindDragSource(li, id) {
    li.draggable = true;

    li.addEventListener('dragstart', (e) => {
        dragId = id;
        li.classList.add('is-dragging');
        todoList.classList.add('is-sorting');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
    });

        li.addEventListener('dragend', () => setTimeout(finish, 0));
}

// ---------- Once over the entire list area ----------
export function initDragDrop(itemHandlers) {
    handlers = itemHandlers;
    const zone = area();
    if (!zone) return;

    // The entire area (including the empty space above and below) is a drop zone.
        zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        dropTarget = resolveTarget(e.clientY);
        showIndicator(dropTarget);
        updateAutoScroll(e.clientY);
    });

    zone.addEventListener('dragleave', (e) => {
        // Only when it has truly moved out of the entire area
        if (!zone.contains(e.relatedTarget)) {
            clearIndicators();
            scrollDir = 0;
        }
    });

        zone.addEventListener('drop', (e) => {
            console.log('DROP', dragId, dropTarget);
        e.preventDefault();

        const id = dragId ?? e.dataTransfer.getData('text/plain');
        if (!id) return;

        const target = dropTarget ?? resolveTarget(e.clientY);
        finish();

        if (target) handlers.onMove(id, target.id, target.position);
    });
}