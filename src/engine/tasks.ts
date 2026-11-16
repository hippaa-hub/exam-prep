// Today's tasks: the short list Adele works through each day. When every task is done,
// the preparation for today is finished. Each task carries a tip on how to do it well.
import type { DateKey, Game } from '../content/types';
import type { SessionRecord, TodayPlan } from './plan';
import { TODAY_SIZE, WARM_UP_SIZE } from './session';

export type TaskKind = 'round' | 'game' | 'table' | 'fix' | 'warm-up' | 'argument' | 'mock';

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
}

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
export const ARGUMENT_TASK = 'argument';
/** Marks a finished round of glossary words (Part 2). It is optional, so it is not one of the day's tasks. */
export const GLOSSARY_TASK = 'glossary';

const minutes = (questions: number) => Math.max(2, Math.round(questions * 0.65));
const questions = (n: number) => `${n} question${n === 1 ? '' : 's'} · about ${minutes(n)} min`;

/**
 * The tasks for today, in the order to do them:
 * the Key Terms flashcards (on the days that have them), round 1 of today's questions, the day's other
 * activities, round 2 (what is left, plus a review of earlier days), then Fix My Mistakes.
 * On the Mock Exam day (the day before the exam): a mixed round, then Fix My Mistakes, then the Mock Exam
 * last, once she is warmed up and her old mistakes are fixed (Jenia's order, 17 Nov).
 * On exam day there is only the warm-up.
 *
 * `due` is how many things are still to practise today; `mistakes` is the length of the Fix list.
 */
export function tasksFor(
  plan: TodayPlan, sessions: readonly SessionRecord[], today: DateKey, due: number, mistakes: number,
): Task[] {
  const todays = sessions.filter((s) => s.date === today);
  const rounds = todays.filter((s) => s.kind === 'today').length;
  const didTask = (id: string) => todays.some((s) => s.task === id);

  if (plan.phase === 'past') return [];
  if (plan.phase === 'exam-day') {
    return [{
      id: 'warm-up', kind: 'warm-up', title: 'Three-minute warm-up', detail: `${WARM_UP_SIZE} questions · about 3 min`,
      tip: 'Just a quick look at your weakest questions. Nothing new today. You are ready.', done: rounds >= 1,
    }];
  }

  const size = Math.min(TODAY_SIZE, due || TODAY_SIZE);
  const tasks: Task[] = [];

  // The Key Terms flashcards come before the questions: she meets the words first, then is asked about them.
  const isFlashcards = (e: (typeof plan.extras)[number]) => e.kind === 'game' && e.game === 'key-terms';
  if (plan.extras.some(isFlashcards)) {
    tasks.push({
      id: gameTaskId('key-terms'), kind: 'game', game: 'key-terms', title: GAME_TITLES['key-terms'],
      detail: 'Ten key terms · about 8 min', tip: GAME_TIPS['key-terms'], done: didTask(gameTaskId('key-terms')),
    });
  }

  tasks.push({
    id: 'round-1', kind: 'round', title: plan.mock ? 'A mixed round of everything' : "Round 1: today's questions",
    detail: rounds >= 1 ? 'Done' : questions(size),
    tip: 'Say or type your answers from memory. New to you? Tap "I don\'t know yet" and I will show you. After each answer, read why.',
    done: rounds >= 1,
  });

  for (const extra of plan.extras) {
    if (isFlashcards(extra)) continue; // already first in the list
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
  // The mock exam day has one round only: the mock is the long task that day.
  if (!plan.mock) {
    const round2Done = rounds >= 2 || (rounds >= 1 && due === 0);
    tasks.push({
      id: 'round-2', kind: 'round', title: 'Round 2: what is left',
      detail: round2Done ? 'Done' : rounds >= 1 ? questions(size) : 'After round 1',
      tip: 'A second go at what you met today, with a few things from earlier days. Try to answer before you tap "I don\'t know yet".',
      done: round2Done,
    });
  }

  // Fix My Mistakes comes after the rounds, so it only counts once everything before it is done.
  const before = tasks.every((t) => t.done);
  const fixedToday = todays.some((s) => s.kind === 'fix');
  const mockDone = plan.mock ? didTask(mockTaskId(plan.mock)) : false;
  tasks.push({
    id: 'fix', kind: 'fix', title: 'Fix My Mistakes',
    detail: mistakes > 0 ? `${mistakes} question${mistakes === 1 ? '' : 's'} waiting` : 'Nothing to fix',
    tip: 'These are the ones you missed. Each one leaves the list when you get it right twice.',
    // The mock's own new mistakes must not reopen this task once the mock is done.
    done: before && (mistakes === 0 || fixedToday || mockDone),
  });

  // On the Mock Exam day the mock comes last: warmed up, mistakes fixed, then the real-test practice.
  if (plan.mock) {
    tasks.push({
      id: mockTaskId(plan.mock), kind: 'mock', title: 'Mock Exam', detail: 'Like the real test · about 35 min',
      tip: 'Do it like the real test: notes closed, and write every answer yourself. No microphone here. At the end it shows you what to fix.',
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
