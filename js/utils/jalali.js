const div = (a, b) => Math.trunc(a / b);

export function toJalali(gy, gm, gd) {
    const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const gy2 = gm > 2 ? gy + 1 : gy;
    let days = 355666 + 365 * gy + div(gy2 + 3, 4) - div(gy2 + 99, 100)
        + div(gy2 + 399, 400) + gd + gdm[gm - 1];
    let jy = -1595 + 33 * div(days, 12053);
    days %= 12053;
    jy += 4 * div(days, 1461);
    days %= 1461;
    if (days > 365) {
        jy += div(days - 1, 365);
        days = (days - 1) % 365;
    }
    const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
    const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    return { jy, jm, jd };
}

export function toGregorian(jy, jm, jd) {
    jy += 1595;
    let days = -355668 + 365 * jy + div(jy, 33) * 8 + div((jy % 33) + 3, 4)
        + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
    let gy = 400 * div(days, 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * div(--days, 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * div(days, 1461);
    days %= 1461;
    if (days > 365) {
        gy += div(days - 1, 365);
        days = (days - 1) % 365;
    }
    let gd = days + 1;
    const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
    const sal = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 0;
    while (gm < 13 && gd > sal[gm]) gd -= sal[gm++];
    return { gy, gm, gd };
}

export function isJalaliLeap(jy) {
    return toJalali(...Object.values(toGregorian(jy, 12, 30))).jm === 12;
}

export function jalaliMonthLength(jy, jm) {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    return isJalaliLeap(jy) ? 30 : 29;
}

export const JALALI_MONTHS = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

// "2026-10-18" ⇄ { jy, jm, jd }
export function isoToJalali(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return toJalali(y, m, d);
}

export function jalaliToIso(jy, jm, jd) {
    const { gy, gm, gd } = toGregorian(jy, jm, jd);
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}