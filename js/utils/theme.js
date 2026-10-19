import { themeToggle } from '../core/dom.js';
import { load, save } from '../core/storage.js';

const THEME_KEY = 'theme';

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark', isDark);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.title = isDark ? 'تم روشن' : 'تم تیره';
}

export function initTheme() {
    let theme = load(THEME_KEY, null);

    if (theme === null) {
        theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(theme);

    themeToggle.addEventListener('click', () => {
        theme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(theme);
        save(THEME_KEY, theme);
    });
}