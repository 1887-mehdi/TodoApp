export function load(key, fallback) {
    let raw = null;
    try {
        raw = localStorage.getItem(key);
    } catch {
        return fallback;
    }
    if (raw === null) return fallback;

    try {
        return JSON.parse(raw);
    } catch {
        return raw; // مقدارهای قدیمی که JSON نیستند (مثل dark)
    }
}

export function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* حافظه پر یا غیرفعال است */
    }
}