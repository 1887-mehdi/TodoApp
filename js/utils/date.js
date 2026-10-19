const DAY = 24 * 60 * 60 * 1000;

// "2026-10-18" → Date در ساعت ۰۰:۰۰ محلی
function parse(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function today() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// تعداد روز تا سررسید (منفی = گذشته)
export function daysUntil(iso) {
    return Math.round((parse(iso) - today()) / DAY);
}

const faDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
});

const faDateYear = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export function formatDue(iso) {
    const diff = daysUntil(iso);

    if (diff === 0) return 'امروز';
    if (diff === 1) return 'فردا';
    if (diff === -1) return 'دیروز';

    const date = parse(iso);
    const sameYear = date.getFullYear() === today().getFullYear();
    return (sameYear ? faDate : faDateYear).format(date);
}

// وضعیت برای رنگ‌دهی: overdue | today | soon | later
export function dueStatus(iso) {
    const diff = daysUntil(iso);
    if (diff < 0) return 'overdue';
    if (diff === 0) return 'today';
    if (diff <= 2) return 'soon';
    return 'later';
}

// تاریخ امروز برای min و مقدار پیش‌فرض input (در صورت نیاز)
export function todayISO() {
    const t = today();
    const mm = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    return `${t.getFullYear()}-${mm}-${dd}`;
}

const faFull = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

// timestamp → «۲۷ مهر ۱۴۰۵» (یا «امروز» اگر همین امروز بود)
export function formatCreated(ts) {
    const d = new Date(ts);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.round((day - today()) / DAY);

    if (diff === 0) return 'امروز';
    if (diff === -1) return 'دیروز';
    return faFull.format(d);
}