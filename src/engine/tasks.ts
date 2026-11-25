// Today's tasks: the short list Adele works through each day. When every task is done,
// the preparation for today is finished. Each task carries a tip on how to do it well.
import type { DateKey, Game } from '../content/types';
import { isSprint, type SessionRecord, type TodayPlan } from './plan';
import { LAST_DAY_SIZE, TODAY_SIZE, WARM_UP_SIZE } from './session';

export type TaskKind = 'round' | 'game' | 'table' | 'fix' | 'warm-up' | 'argument' | 'mock' | 'learn';

export interface Task {
  id: string;
  kind: TaskKind;
  title: string;
  /** How long it is, in a few words. */
  detail: string;
  /** How to do this task well. Shown in the speech bubble on Home. */
  tip: string;
  done: boolean;
  game?: Game;
  group?: string;
  /** For a lesson: the topic it teaches. */
  topic?: string;
}

/** What the task list needs to know about a lesson. */
export interface LessonInfo { title: string; detail: string; tip: string }

export const GAME_TITLES: Record<Game, string> = {
  'key-terms': 'Key Terms flashcards',
  'this-or-that': 'This or That',
  'which-system': 'Which system?',
  'which-responsibility': 'Which responsibility?',
  tables: 'Tables',
  quiz: 'Quick Quiz',
  write: 'Write it',
};

const GAME_TIPS: Record<Game, string> = {
  'key-terms': 'Say or type what each word means. New to you? Tap "I don\'t know yet" and I will show you. Then read the simple words and the examples.',
  'this-or-that': 'Go slowly: these pairs are easy to mix up. After each one, read why your choice was right or not.',
  'which-system': 'Look for the clue: who holds the power, and how did they get it? Then read why.',
  'which-responsibility': 'Pick the responsibility, then write one sentence saying why it matters.',
  tables: 'Fill every box without looking, then check.',
  quiz: 'Answer from memory. Then read why the right answer is right.',
  write: 'Say or type a full sentence, as you will in the test. I will tell you how close you were.',
};

export const gameTaskId = (game: Game) => `game:${game}`;
export const tableTaskId = (group: string) => `table:${group}`;
export const mockTaskId = (mock: string) => `mock:${mock}`;
export const learnTaskId = (topic: string) => `learn:${topic}`;
export const ARGUMENT_TASK = 'argument';
/** Marks a finished round of glossary words (Part 2). It is optional, so it is not one of the day's tasks. */
export const GLOSSARY_TASK = 'glossary';
export const LATE_TASK = 'round-new';
/** A practice round of tomorrow's topics, done early. Optional, so it is not one of the day's tasks. */
export const AHEAD_TASK = 'ahead';

const minutes = (questions: number) => Math.max(2, Math.round(questions * 0.65));
const questions = (n: number) => `${n} question${n === 1 ? '' : 's'} · about ${minutes(n)} min`;

/**
 * The tasks for today, in the order to do them:
 * the Key Terms flashcards (on the days that have them), round 1 of today's questions, the day's other
 * activities, round 2 (what is left, plus a review of earlier days), then Fix My Mistakes.
 * On the Mock Exam day (the day before the exam): a mixed round, then Fix My Mistakes, then the Mock Exam
 * last, once she is warmed up and her old mistakes are fixed (Jenia's order, 17 Nov).
 * On that last day every round counts towards the ring, so two more rounds ask what is not full yet;
 * with all of them done she can reach 95%, and the exam-morning warm-up adds the rest (Jenia, 17 Nov).
 * A mixed day before that (no new topics) is the same without the Mock Exam: one mixed round, then Fix.
 * On exam day there is only the warm-up.
 *
 * `due` is how many things are still to practise today; `mistakes` is the length of the Fix list.
 */
export function tasksFor(
  plan: TodayPlan, sessions: readonly SessionRecord[], today: DateKey, due: number, mistakes: number,
  /** Glossary words that join the last day's mixed round (0 when the pack has no glossary). */
  wordsInMix = 0,
  /** Questions added late that she has not met yet: the first task of a mixed day (0 = no such task). */
  lateLeft = 0,
  /** The planned mock exam's length, for its task card. */
  mockMinutes = 35,
  /** The lessons of the day's topics, if the pack has them. */
  lessonInfo?: (topic: string) => LessonInfo | undefined,
  /** The pack's round sizes, for the task cards. */
  sizes: { round: number; lastDay: number } = { round: TODAY_SIZE, lastDay: LAST_DAY_SIZE },
): Task[] {
  const todays = sessions.filter((s) => s.date === today);
  const rounds = todays.filter((s) => s.kind === 'today').length;
  const didTask = (id: string) => todays.some((s) => s.task === id);

  if (plan.phase === 'past') return [];
  if (plan.phase === 'exam-day') {
    return [{
      id: 'warm-up', kind: 'warm-up', title: 'Three-minute warm-up', detail: `${WARM_UP_SIZE} questions · about 3 min`,
      tip: 'A quick look at your weakest questions. It adds the last part of your ring, and a miss takes nothing away today. You are ready.', done: rounds >= 1,
    }];
  }

  // A mixed day: everything at once, with glossary words, in one round. The Mock Exam day is one too.
  const sprint = isSprint(plan);
  const mixDay = plan.phase === 'mix' || !!plan.mock || sprint;
  const mockDone = plan.mock ? didTask(mockTaskId(plan.mock)) : false;
  const size = Math.min(sizes.round, due || sizes.round) + (mixDay ? wordsInMix : 0);
  const tasks: Task[] = [];

  // The Key Terms flashcards come before the questions: she meets the words first, then is asked about them.
  const isFlashcards = (e: (typeof plan.extras)[number]) => e.kind === 'game' && e.game === 'key-terms';
  if (plan.extras.some(isFlashcards)) {
    tasks.push({
      id: gameTaskId('key-terms'), kind: 'game', game: 'key-terms', title: GAME_TITLES['key-terms'],
      detail: 'Ten key terms · about 8 min', tip: GAME_TIPS['key-terms'], done: didTask(gameTaskId('key-terms')),
    });
  }

  // Lessons come first: she is taught a topic before she is asked about it. A lesson done once stays done.
  for (const extra of plan.extras) {
    if (extra.kind !== 'learn') continue;
    const info = lessonInfo?.(extra.topic);
    if (!info) continue;
    const id = learnTaskId(extra.topic);
    tasks.push({ id, kind: 'learn', topic: extra.topic, title: info.title, detail: info.detail, tip: info.tip, done: sessions.some((x) => x.task === id) });
  }

  // A mixed day starts with the questions added after the slide-by-slide check, so none is met for the first time in the mock.
  if (mixDay && lateLeft > 0) {
    tasks.push({
      id: LATE_TASK, kind: 'round', title: 'New questions from the slides', detail: questions(lateLeft),
      tip: 'These were added after checking every slide. Say or type your answers; new to you? Tap "I don\'t know yet" and read why.',
      done: didTask(LATE_TASK),
    });
  }

  tasks.push({
    id: 'round-1', kind: 'round', title: mixDay && plan.topics.length === 0 ? 'A mixed round of everything' : "Round 1: today's questions",
    detail: rounds >= 1 ? 'Done' : questions(size),
    tip: mixDay && plan.topics.length === 0
      ? 'Everything from both lessons, plus new glossary words. Say or type your answers from memory. New to you? Tap "I don\'t know yet" and I will show you. After each answer, read why.'
      : 'Say or type your answers from memory. New to you? Tap "I don\'t know yet" and I will show you. After each answer, read why.',
    done: rounds >= 1,
  });

  for (const extra of plan.extras) {
    if (isFlashcards(extra) || extra.kind === 'learn') continue; // already first in the list
    if (extra.kind === 'game') {
      tasks.push({
        id: gameTaskId(extra.game), kind: 'game', game: extra.game, title: GAME_TITLES[extra.game],
        detail: 'One round · about 5 min', tip: GAME_TIPS[extra.game], done: didTask(gameTaskId(extra.game)),
      });
    } else if (extra.kind === 'table') {
      tasks.push({
        id: tableTaskId(extra.group), kind: 'table', group: extra.group, title: `Fill the table: ${extra.group.replace(/^The /, '')}`,
        detail: 'From memory · about 5 min',
        tip: 'Fill every box without looking, then check. The test asks you to compare, and this is the best practice for it.',
        done: didTask(tableTaskId(extra.group)),
      });
    } else {
      tasks.push({
        id: ARGUMENT_TASK, kind: 'argument', title: 'Argument Builder', detail: 'One question · about 10 min',
        tip: 'Say or type your own ideas in all four boxes: your argument, a country example, how power is distributed, and another view.',
        done: didTask(ARGUMENT_TASK),
      });
    }
  }

  // Round 2 is finished after a second round, or straight away if round 1 left nothing to do.
  // A mixed day has one round only.
  if (!mixDay) {
    const round2Done = rounds >= 2 || (rounds >= 1 && due === 0);
    tasks.push({
      id: 'round-2', kind: 'round', title: 'Round 2: what is left',
      detail: round2Done ? 'Done' : rounds >= 1 ? questions(size) : 'After round 1',
      tip: 'A second go at what you met today, with a few things from earlier days. Try to answer before you tap "I don\'t know yet".',
      done: round2Done,
    });
  }

  // The last day before the exam: every round counts, so two more rounds ask what is not full yet.
  // They are skipped when nothing is left, and closed once the Mock Exam is done (its misses must not reopen them).
  if (sprint) {
    for (const k of [2, 3]) {
      const done = rounds >= k || (rounds >= 1 && due === 0) || mockDone;
      tasks.push({
        id: `round-${k}`, kind: 'round', title: `Round ${k}: what is not full yet`,
        detail: done ? 'Done' : rounds >= k - 1 ? questions(Math.min(sizes.lastDay, due || sizes.lastDay)) : `After round ${k - 1}`,
        tip: 'Today every round counts. Each thing you get right in a new round fills one more step of your ring.',
        done,
      });
    }
  }

  // Fix My Mistakes comes after the rounds, so it only counts once everything before it is done.
  const before = tasks.every((t) => t.done);
  const fixedToday = todays.some((s) => s.kind === 'fix');
  tasks.push({
    id: 'fix', kind: 'fix', title: 'Fix My Mistakes',
    detail: mistakes > 0 ? `${mistakes} question${mistakes === 1 ? '' : 's'} waiting` : 'Nothing to fix',
    tip: 'These are the ones you missed. Each one leaves the list as soon as you get it right.',
    // The mock's own new mistakes must not reopen this task once the mock is done.
    done: before && (mistakes === 0 || fixedToday || mockDone),
  });

  // On the Mock Exam day the mock comes last: warmed up, mistakes fixed, then the real-test practice.
  if (plan.mock) {
    tasks.push({
      id: mockTaskId(plan.mock), kind: 'mock', title: 'Mock Exam', detail: `Like the real test · about ${mockMinutes} min`,
      tip: 'Do it like the real test: notes closed, answer every question yourself (write, or say it and fix the words). At the end it shows you what to fix.',
      done: mockDone,
    });
  }
  return tasks;
}

export function nextTask(tasks: readonly Task[]): Task | undefined {
  return tasks.find((t) => !t.done);
}

/** True when there were tasks today and every one of them is done: the day's preparation is finished. */
export function dayFinished(tasks: readonly Task[]): boolean {
  return tasks.length > 0 && tasks.every((t) => t.done);
}
