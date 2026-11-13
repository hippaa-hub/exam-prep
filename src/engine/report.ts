// The parent's tracker: what happened on each day.
import type { DateKey, Pack } from '../content/types';
import { addDays } from './dates';
import type { SessionRecord } from './plan';
import { secondsOn, type StudyTime } from './time';

export interface DayReport {
  day: DateKey;
  /** Seconds spent answering. */
  seconds: number;
  /** Rounds, games, tables and fix sessions completed. */
  sessions: number;
  /** Different questions answered in completed sessions. */
  asked: number;
  firstTimeRight: number;
  /** True if she finished every task that day. */
  finished: boolean;
}

export function dayReport(
  day: DateKey, sessions: readonly SessionRecord[], studyTime: StudyTime | undefined, daysDone: readonly DateKey[],
): DayReport {
  const todays = sessions.filter((s) => s.date === day);
  return {
    day,
    seconds: secondsOn(studyTime, day),
    sessions: todays.length,
    asked: todays.reduce((n, s) => n + s.asked, 0),
    firstTimeRight: todays.reduce((n, s) => n + s.firstTimeRight, 0),
    finished: daysDone.includes(day),
  };
}

/**
 * One line per day, newest first: from the day the plan starts (or her first practice, if earlier)
 * up to today, and never past the exam.
 */
export function dayReports(
  pack: Pack, sessions: readonly SessionRecord[], studyTime: StudyTime | undefined, daysDone: readonly DateKey[], today: DateKey,
): DayReport[] {
  const last = today < pack.date ? today : pack.date;
  const planStart = addDays(pack.date, Math.min(0, ...pack.plan.map((d) => d.day)));
  const active = [...sessions.map((s) => s.date), ...Object.keys(studyTime ?? {})].sort();
  const firstActive = active[0] ?? last;
  let first = planStart < firstActive ? planStart : firstActive;
  if (first > last) first = last;
  const out: DayReport[] = [];
  for (let day = last; day >= first; day = addDays(day, -1)) out.push(dayReport(day, sessions, studyTime, daysDone));
  return out;
}

/** 'right first time' as a percentage, or null when nothing was answered. */
export function accuracy(r: Pick<DayReport, 'asked' | 'firstTimeRight'>): number | null {
  return r.asked === 0 ? null : Math.round((r.firstTimeRight / r.asked) * 100);
}
