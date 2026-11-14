// The parent's tracker: what happened on each day.
import type { DateKey, Pack } from '../content/types';
import { addDays, formatShort } from './dates';
import type { SessionRecord } from './plan';
import { formatDuration, secondsOn, type StudyTime } from './time';

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

export interface ReportInput {
  name: string;
  today: DateKey;
  /** One line per day, as from dayReports (any order). */
  reports: readonly DayReport[];
  tasksDone: number;
  tasksTotal: number;
  /** Readiness for the exam, 0 to 100. */
  ready: number;
  daysToGo: number;
}

/** The most earlier days listed in one message. */
export const REPORT_EARLIER_DAYS = 6;

/**
 * The report as a short text message, for sending from Adele's phone to a parent's phone.
 * Nothing is sent by the app itself: the phone's own share sheet (WhatsApp, Messages...) does it.
 */
export function reportMessage({ name, today, reports, tasksDone, tasksTotal, ready, daysToGo }: ReportInput): string {
  const now = reports.find((r) => r.day === today);
  const lines = [`${name}'s exam prep · ${formatShort(today)}`, `Studied today: ${formatDuration(now?.seconds ?? 0)}`];
  if (tasksTotal > 0) {
    lines.push(tasksDone >= tasksTotal ? `All ${tasksTotal} tasks finished ✓` : `Tasks done: ${tasksDone} of ${tasksTotal}`);
  }
  const pct = now ? accuracy(now) : null;
  if (now && pct !== null) lines.push(`Questions: ${now.asked}, ${pct}% right first time`);
  const toGo = daysToGo > 1 ? ` · ${daysToGo} days to go` : daysToGo === 1 ? ' · exam tomorrow' : daysToGo === 0 ? ' · exam today' : '';
  lines.push(`Ready for the exam: ${Math.round(ready)}%${toGo}`);

  const earlier = reports.filter((r) => r.day < today).sort((a, b) => b.day.localeCompare(a.day)).slice(0, REPORT_EARLIER_DAYS);
  if (earlier.length > 0) {
    lines.push('', 'Earlier days:');
    for (const r of earlier) lines.push(`${formatShort(r.day)}: ${formatDuration(r.seconds)}${r.finished ? ' ✓ finished' : ''}`);
  }
  return lines.join('\n');
}
