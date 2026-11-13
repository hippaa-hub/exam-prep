// Study time: how long Adele actually spent answering, per day.
// Time is added with each answer, so a session she leaves half-way still counts,
// and a long pause (phone left open) does not.
import type { DateKey } from '../content/types';

/** Seconds studied on each day. */
export type StudyTime = Record<DateKey, number>;

/** The most one question can add: longer gaps are treated as a break. */
export const QUESTION_CAP_SECONDS = 90;
/** Filling a whole table from memory is one long answer, so it gets a longer allowance. */
export const TABLE_CAP_SECONDS = 8 * 60;

/** The seconds to count for one answer, given the time since the last one. */
export function creditSeconds(elapsedMs: number, capSeconds = QUESTION_CAP_SECONDS): number {
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return 0;
  return Math.min(Math.round(elapsedMs / 1000), capSeconds);
}

export function addStudyTime(time: StudyTime | undefined, day: DateKey, seconds: number): StudyTime {
  const cur = time ?? {};
  if (seconds <= 0) return cur;
  return { ...cur, [day]: (cur[day] ?? 0) + seconds };
}

export function secondsOn(time: StudyTime | undefined, day: DateKey): number {
  return time?.[day] ?? 0;
}

export function totalSeconds(time: StudyTime | undefined): number {
  return Object.values(time ?? {}).reduce((a, b) => a + b, 0);
}

/** The days with any study time, newest first. */
export function studyDays(time: StudyTime | undefined): { day: DateKey; seconds: number }[] {
  return Object.entries(time ?? {})
    .filter(([, s]) => s > 0)
    .map(([day, seconds]) => ({ day, seconds }))
    .sort((a, b) => b.day.localeCompare(a.day));
}

/** '0 min', 'under 1 min', '18 min', '1 h 5 min' */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 min';
  if (seconds < 60) return 'under 1 min';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
