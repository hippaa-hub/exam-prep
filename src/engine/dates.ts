import type { DateKey } from '../content/types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Today's calendar day on this phone, as 'YYYY-MM-DD'. */
export function dateKeyOf(now: Date): DateKey {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function toUtc(key: DateKey): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(key: DateKey, n: number): DateKey {
  const dt = new Date(toUtc(key) + n * 86400000);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** Whole days from a to b (positive when b is later). */
export function daysBetween(a: DateKey, b: DateKey): number {
  return Math.round((toUtc(b) - toUtc(a)) / 86400000);
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 'Wednesday 18 November' */
export function formatLong(key: DateKey): string {
  const dt = new Date(toUtc(key));
  return `${DAYS[dt.getUTCDay()]} ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`;
}

/** 'Sat 14 Nov' */
export function formatShort(key: DateKey): string {
  const dt = new Date(toUtc(key));
  return `${DAYS[dt.getUTCDay()].slice(0, 3)} ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()].slice(0, 3)}`;
}
