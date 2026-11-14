import { describe, expect, it } from 'vitest';
import { choice } from '../content/build';
import type { Pack } from '../content/types';
import type { SessionRecord } from './plan';
import { accuracy, dayReport, dayReports, reportMessage } from './report';

const pack: Pack = {
  id: 'p', subject: 's', title: 't', date: '2026-11-18', criteria: [],
  topics: [{ id: 'A', title: 'A', short: 'A', items: [choice('a', 'q', 'yes', ['no'])] }],
  plan: [{ day: -4, label: 'A', topics: ['A'] }, { day: -1, label: 'Mixed' }],
};
const rec = (date: string, asked: number, right: number): SessionRecord => ({ date, kind: 'today', topics: [], asked, firstTimeRight: right });

describe("the parent's tracker", () => {
  const sessions = [rec('2026-11-14', 15, 9), rec('2026-11-14', 10, 8), rec('2026-11-16', 15, 15)];
  const time = { '2026-11-14': 1260, '2026-11-16': 540 };

  it('sums up one day', () => {
    const r = dayReport('2026-11-14', sessions, time, ['2026-11-14']);
    expect(r).toEqual({ day: '2026-11-14', seconds: 1260, sessions: 2, asked: 25, firstTimeRight: 17, finished: true });
    expect(accuracy(r)).toBe(68);
  });

  it('shows a day with no practice as empty, not missing', () => {
    const r = dayReport('2026-11-15', sessions, time, ['2026-11-14']);
    expect(r).toEqual({ day: '2026-11-15', seconds: 0, sessions: 0, asked: 0, firstTimeRight: 0, finished: false });
    expect(accuracy(r)).toBeNull();
  });

  it('lists every day from the start of the plan to today, newest first', () => {
    const days = dayReports(pack, sessions, time, ['2026-11-14'], '2026-11-16').map((r) => r.day);
    expect(days).toEqual(['2026-11-16', '2026-11-15', '2026-11-14']);
  });

  it('includes a head start before the plan begins', () => {
    const early = [rec('2026-11-13', 15, 10)];
    expect(dayReports(pack, early, { '2026-11-13': 600 }, [], '2026-11-14').map((r) => r.day)).toEqual(['2026-11-14', '2026-11-13']);
  });

  it('shows just today before the plan has started', () => {
    expect(dayReports(pack, [], undefined, [], '2026-11-12').map((r) => r.day)).toEqual(['2026-11-12']);
  });

  it('stops at the exam day', () => {
    const days = dayReports(pack, sessions, time, [], '2026-11-25').map((r) => r.day);
    expect(days[0]).toBe('2026-11-18');
    expect(days[days.length - 1]).toBe('2026-11-14');
  });
});

describe('the report message for a parent', () => {
  const sessions = [rec('2026-11-14', 15, 9), rec('2026-11-14', 10, 8), rec('2026-11-16', 15, 15)];
  const time = { '2026-11-14': 1260, '2026-11-16': 540 };
  const reports = dayReports(pack, sessions, time, ['2026-11-14'], '2026-11-16');

  it('says how long she studied today, what she finished and how ready she is', () => {
    const text = reportMessage({ name: 'Adele', today: '2026-11-16', reports, tasksDone: 2, tasksTotal: 4, ready: 41.6, daysToGo: 2 });
    expect(text.split('\n')).toEqual([
      "Adele's exam prep · Mon 16 Nov",
      'Studied today: 9 min',
      'Tasks done: 2 of 4',
      'Questions: 15, 100% right first time',
      'Ready for the exam: 42% · 2 days to go',
      '',
      'Earlier days:',
      'Sun 15 Nov: 0 min',
      'Sat 14 Nov: 21 min ✓ finished',
    ]);
  });

  it('marks a finished day and leaves out the score when nothing was completed', () => {
    const text = reportMessage({ name: 'Adele', today: '2026-11-14', reports: dayReports(pack, [], { '2026-11-14': 30 }, [], '2026-11-14'), tasksDone: 3, tasksTotal: 3, ready: 0, daysToGo: 1 });
    expect(text.split('\n')).toEqual([
      "Adele's exam prep · Sat 14 Nov",
      'Studied today: under 1 min',
      'All 3 tasks finished ✓',
      'Ready for the exam: 0% · exam tomorrow',
    ]);
  });

  it('still makes sense on a day with no study at all', () => {
    const text = reportMessage({ name: 'Adele', today: '2026-11-15', reports: [], tasksDone: 0, tasksTotal: 4, ready: 10, daysToGo: 3 });
    expect(text).toContain('Studied today: 0 min');
    expect(text).toContain('Tasks done: 0 of 4');
  });
});
