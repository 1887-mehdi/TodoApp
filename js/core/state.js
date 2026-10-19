import { load, save } from './storage.js';
import { PRIORITIES, FILTERS } from './constants.js';

const makeId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// Converts legacy data (lacking an ID and description) into the new structure
function normalize(list) {
    if (!Array.isArray(list)) return [];
    return list
        .filter((t) => t && typeof t.title === 'string')
        .map((t) => ({
            id: t.id ?? makeId(),
            title: t.title,
            description: t.description ?? '',
            completed: Boolean(t.completed),
            priority: PRIORITIES.includes(t.priority) ? t.priority : 'medium',
            dueDate: typeof t.dueDate === 'string' ? t.dueDate : '',
            createdAt: typeof t.createdAt === 'number' ? t.createdAt : null,
        }));
}

const state = {
    todos: normalize(load('todos', [])),
    filter: load('filter', 'all'),
    search: '',
    lastAddedId: null,
};

if (!FILTERS.includes(state.filter)) state.filter = 'all';

function persist() {
    save('todos', state.todos);
}

persist();

// ---------- Getters ----------
export const getTodos = () => state.todos;
export const getFilter = () => state.filter;
export const getSearch = () => state.search;
export const getTodoById = (id) => state.todos.find((t) => t.id === id);

export function getVisibleTodos() {
    const query = state.search.trim().toLowerCase();

    return state.todos.filter((t) => {
        if (state.filter === 'active' && t.completed) return false;
        if (state.filter === 'done' && !t.completed) return false;
        if (!query) return true;
        return (
            t.title.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
        );
    });
}

export function getStats() {
    const total = state.todos.length;
    const done = state.todos.filter((t) => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, remaining: total - done, percent };
}

export function consumeLastAddedId() {
    const id = state.lastAddedId;
    state.lastAddedId = null;
    return id;
}

// ---------- Actions ----------
export function addTodo(title, priority = 'medium', dueDate = '') {
    const todo = {
        id: makeId(),
        title,
        description: '',
        completed: false,
        priority,
        dueDate,
        createdAt: Date.now(),
    };
    state.todos.push(todo);
    state.lastAddedId = todo.id;
    persist();
    return todo;
}

export function removeTodo(id) {
    const index = state.todos.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const [removed] = state.todos.splice(index, 1);
    persist();
    return { todo: removed, index };
}

export function updateTodo(id, changes) {
    const todo = getTodoById(id);
    if (!todo) return;
    Object.assign(todo, changes);
    persist();
}

/**
 * Places the task with `fromId` next to the task with `targetId`.
 * position: 'before' (before the target) or 'after' (after the target)
 */
export function moveTodo(fromId, targetId, position = 'before') {
    if (fromId === targetId) return;

    const from = state.todos.findIndex((t) => t.id === fromId);
    if (from === -1) return;

    const [item] = state.todos.splice(from, 1);

    const target = state.todos.findIndex((t) => t.id === targetId);
    if (target === -1) {
        state.todos.splice(from, 0, item); // Target not found; return to original position
        return;
    }

    state.todos.splice(position === 'after' ? target + 1 : target, 0, item);
    persist();
}

/** Places the task with `fromId` at the beginning or end of the list. */
export function moveTodoToEdge(fromId, edge = 'end') {
    const from = state.todos.findIndex((t) => t.id === fromId);
    if (from === -1) return;

    const [item] = state.todos.splice(from, 1);
    if (edge === 'start') state.todos.unshift(item);
    else state.todos.push(item);
    persist();
}

export function clearTodos() {
    const previous = state.todos;
    state.todos = [];
    persist();
    return previous;
}

export function restoreTodo(todo, index) {
    if (state.todos.some((t) => t.id === todo.id)) return;
    state.todos.splice(Math.min(index, state.todos.length), 0, todo);
    persist();
}

export function restoreAll(list) {
    state.todos = list;
    persist();
}

export function setFilter(filter) {
    state.filter = filter;
    save('filter', filter);
}

export function setSearch(value) {
    state.search = value;
}

