const $ = (id) => document.getElementById(id);

// Form and inputs
export const addForm = $('addForm');
export const todoInput = $('todoInput');
export const prioritySelect = $('prioritySelect');
export const addBtn = $('addBtn');
export const modeBtn = $('modeBtn');
export const addExtras = $('addExtras');
export const filterBtns = document.querySelectorAll('.filter-btn');
export const dueInput = $('dueInput');
export const dateField = $('dateField');
export const dateBtn = $('dateBtn');
export const dateText = $('dateText');
export const dateClear = $('dateClear');
export const editDueBtn = $('editDueBtn');
export const editDueText = $('editDueText');
export const editDueClear = $('editDueClear');

// List and empty state
export const todoList = $('todoList');
export const emptyState = $('emptyState');
export const emptyIcon = $('emptyIcon');
export const emptyTitle = $('emptyTitle');
export const emptyText = $('emptyText');

// Statistics
export const counter = $('counter');
export const percent = $('percent');
export const progressBar = $('progressBar');
export const progressTrack = $('progressTrack');

// Buttons
export const clearBtn = $('clearBtn');
export const themeToggle = $('themeToggle');

// Edit Modal
export const editModal = $('editModal');
export const editForm = $('editForm');
export const editTitle = $('editTitle');
export const editDescription = $('editDescription');
export const editPriority = $('editPriority');
export const editError = $('editError');
export const editCounter = $('editCounter');
export const editDue = $('editDue');

// Confirm Modal
export const confirmModal = $('confirmModal');
export const confirmTitle = $('confirmTitle');
export const confirmMessage = $('confirmMessage');
export const confirmOk = $('confirmOk');
export const confirmCancel = $('confirmCancel');
export const confirmClose = $('confirmClose');

// Messages
export const toasts = $('toasts');