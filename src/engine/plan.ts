// The countdown plan (PLAN.md section 5): which topics to practise today.
import type { DateKey, DayExtra, Pack, TopicId } from '../content/types';
import { daysBetween } from './dates';

export type SessionKind = 'today' | 'practice' | 'fix';

/** One finished session, kept so the plan knows what has been covered. */
export interface SessionRecord {
  date: DateKey;
  kind: SessionKind;
  /** The plan topics the session focused on (empty for a mixed or practice session). */
  topics: TopicId[];
  /** How many different questions were asked. */
  asked: number;
  /** How many she got right the first time. */
  firstTimeRight: number;
  /** Which of the day's tasks this session was (see tasks.ts), if any. */
  task?: string;
}

export type PlanPhase =
  | 'early'      // before the plan starts: a head start on the first day's topics
  | 'study'      // a normal plan day
  | 'mix'        // a day with no new topics before the last day: a mixed round of everything
  | 'last-day'   // fewer than two days left: mixed quiz, plus the mock exam
  | 'exam-day'   // the three-minute warm-up
  | 'past';      // the exam is over; the pack can still be practised

export interface TodayPlan {
  phase: PlanPhase;
  /** Days until the exam (0 on exam day, negative afterwards). */
  daysToGo: number;
  label: string;
  /** Today's focus topics. Empty means a mixed quiz of everything. */
  topics: TopicId[];
  /** Topics moved onto today because an earlier day was missed. */
  catchUp: TopicId[];
  /** Today's special activities, on top of the rounds of questions. */
  extras: DayExtra[];
  /** The mock exam to sit today, if any. */
  mock?: string;
  /** True once today's session has been finished. */
  doneToday: boolean;
}

/** The last day before the exam: every round counts there, because there are no more days to wait for. */
export function isSprint(plan: Pick<TodayPlan, 'phase' | 'daysToGo'>): boolean {
  return plan.phase === 'last-day' && plan.daysToGo === 1;
}

/**
 * The stamp a right answer is recorded under. Normally it is the day: a thing to know gains one level a day.
 * On the last day before the exam each finished round starts a new stamp, so a thing can gain a level in
 * every round she gets it right. That is what lets her fill the ring on the last day (Jenia, 17 Nov).
 */
export function occasionFor(plan: Pick<TodayPlan, 'phase' | 'daysToGo'>, sessions: readonly SessionRecord[], today: DateKey): DateKey {
  if (!isSprint(plan)) return today;
  const finished = sessions.filter((s) => s.date === today).length;
  return finished === 0 ? today : `${today}#${finished + 1}`;
}

/** True once the exam-morning warm-up has been finished. */
export function warmUpDone(pack: Pack, sessions: readonly SessionRecord[]): boolean {
  return sessions.some((s) => s.date === pack.date && s.task === 'warm-up');
}

/** Days from today until the exam. */
export function daysToGo(pack: Pack, today: DateKey): number {
  return daysBetween(today, pack.date);
}

/** The pack to show on Home: the nearest upcoming exam, or else the most recent past one. */
export function pickPack(packs: readonly Pack[], today: DateKey): Pack | undefined {
  const upcoming = packs.filter((p) => p.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  if (upcoming.length > 0) return upcoming[0];
  return [...packs].sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function pastPacks(packs: readonly Pack[], today: DateKey): Pack[] {
  return packs.filter((p) => p.date < today).sort((a, b) => b.date.localeCompare(a.date));
}

export function planFor(pack: Pack, sessions: readonly SessionRecord[], today: DateKey): TodayPlan {
  const left = daysToGo(pack, today);
  const off = -left; // -4 means four days before the exam
  const known = new Set(pack.topics.map((t) => t.id));
  const studyDays = pack.plan
    .map((d) => ({ ...d, topics: (d.topics ?? []).filter((t) => known.has(t)) }))
    .filter((d) => d.topics.length > 0)
    .sort((a, b) => a.day - b.day);
  const planned = pack.plan.find((d) => d.mock)?.mock;
  // The mock exam is only offered if the pack really has it.
  const mock = planned && pack.mocks?.some((m) => m.id === planned) ? planned : undefined;
  const doneToday = sessions.some((s) => s.kind === 'today' && s.date === today);
  const base = { daysToGo: left, catchUp: [] as TopicId[], extras: [] as DayExtra[], doneToday };

  if (left < 0) return { ...base, phase: 'past', label: 'Mixed quiz of everything', topics: [] };
  if (left === 0) return { ...base, phase: 'exam-day', label: 'Three-minute warm-up', topics: [] };
  if (left < 2 || studyDays.length === 0) {
    const day = pack.plan.find((d) => d.day === off);
    const dayTopics = (day?.topics ?? []).filter((t) => known.has(t));
    // Without new topics the last day is a mixed quiz of everything (owed topics are part of "everything").
    if (left !== 1 || dayTopics.length === 0) {
      return { ...base, phase: 'last-day', label: day?.label ?? 'Mixed quiz of everything', topics: [], mock, extras: day?.extras ?? [] };
    }
    // A short countdown can put new topics on the last day too (the maths test: patterns on the day before).
    // Topics from earlier days that were never done come first, with their lessons.
    const done = new Set(sessions.filter((s) => s.kind === 'today' && s.date < today).flatMap((s) => s.topics));
    const owedDays = studyDays.filter((d) => d.day < off && d.topics.some((t) => !done.has(t)));
    const owed = unique(owedDays.flatMap((d) => d.topics).filter((t) => !done.has(t)));
    const owedLessons = owedDays.flatMap((d) => d.extras ?? []).filter((e) => e.kind === 'learn' && owed.includes(e.topic));
    return {
      ...base, phase: 'last-day', label: day?.label ?? 'Mixed quiz of everything', topics: unique([...owed, ...dayTopics]),
      catchUp: owed, mock, extras: uniqueExtras([...owedLessons, ...(day?.extras ?? [])]),
    };
  }

  const first = studyDays[0];
  if (off < first.day) {
    return { ...base, phase: 'early', label: `Head start: ${lowerFirst(first.label)}`, topics: first.topics, extras: first.extras ?? [] };
  }

  // Topics count as covered once a "today" session on an earlier day focused on them.
  const covered = new Set(
    sessions.filter((s) => s.kind === 'today' && s.date < today).flatMap((s) => s.topics),
  );
  const scheduledDay = studyDays.find((d) => d.day === off);
  const scheduled = scheduledDay?.topics ?? [];
  const missed = unique(studyDays.filter((d) => d.day < off).flatMap((d) => d.topics)).filter((t) => !covered.has(t));

  if (missed.length === 0 && !scheduledDay) {
    // Nothing new is planned for today and nothing is owed: a mixed round of everything.
    const day = pack.plan.find((d) => d.day === off);
    return { ...base, phase: 'mix', label: day?.label ?? 'Mixed quiz of everything', topics: [], extras: day?.extras ?? [] };
  }
  if (missed.length === 0) {
    return {
      ...base, phase: 'study', label: scheduledDay?.label ?? 'Mixed quiz of everything', topics: scheduled,
      extras: scheduledDay?.extras ?? [],
    };
  }

  // A day was missed: re-spread everything still to do over the study days that are left.
  const future = studyDays.filter((d) => d.day > off).flatMap((d) => d.topics);
  const pending = unique([...missed, ...scheduled, ...future]);
  // The last day before the exam is kept for the mock exam, unless the plan puts topics on it too.
  const lastDayHasTopics = studyDays.some((d) => d.day === -1);
  const studyDaysLeft = Math.max(1, left - 1 + (lastDayHasTopics ? 1 : 0));
  const perDay = Math.ceil(pending.length / studyDaysLeft);
  const topics = pending.slice(0, perDay);
  return {
    ...base,
    phase: 'study',
    label: 'Catching up, then on with the plan',
    topics,
    catchUp: topics.filter((t) => missed.includes(t)),
    // The activities of the days whose topics landed on today: two at most, to keep the day short,
    // and the argument first, because it is the closest practice for half of the test.
    // Every lesson for today's topics comes too: a topic is always taught before it is asked.
    extras: [
      ...uniqueExtras(studyDays.flatMap((d) => d.extras ?? []).filter((e) => e.kind === 'learn' && topics.includes(e.topic))),
      ...uniqueExtras(studyDays.filter((d) => d.topics.some((t) => topics.includes(t))).flatMap((d) => d.extras ?? []))
        .filter((e) => e.kind !== 'learn')
        .sort((a, b) => Number(b.kind === 'argument') - Number(a.kind === 'argument'))
        .slice(0, 2),
    ],
  };
}

function uniqueExtras(list: DayExtra[]): DayExtra[] {
  const seen = new Set<string>();
  return list.filter((e) => {
    const key = JSON.stringify(e);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function unique<T>(list: T[]): T[] {
  return [...new Set(list)];
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
