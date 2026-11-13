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
  /** How to do this task well. Lola says it on Home. */
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
  'key-terms': 'Say the whole definition out loud before you flip the card. Be honest when you rate yourself.',
  'this-or-that': 'Go slowly. These are the pairs that lose marks, so read each one twice.',
  'which-system': 'Look for the clue: who holds the power, and how did they get it?',
  'which-responsibility': 'Pick the responsibility, then write one sentence saying why it matters.',
  tables: 'Fill every box without looking, then check.',
  quiz: 'Answer from memory, then read the teacher\'s wording.',
  write: 'Write full sentences, as you will in the test. Then tick the ideas you really had.',
};

export const gameTaskId = (game: Game) => `game:${game}`;
export const tableTaskId = (group: string) => `table:${group}`;
export const mockTaskId = (mock: string) => `mock:${mock}`;
export const ARGUMENT_TASK = 'argument';

const minutes = (questions: number) => Math.max(2, Math.round(questions * 0.65));
const questions = (n: number) => `${n} question${n === 1 ? '' : 's'} · about ${minutes(n)} min`;

/**
 * The tasks for today, in the order to do them:
 * round 1 of today's questions, the day's special activities, round 2 (what is left, plus a review
 * of earlier days), then Fix My Mistakes. On exam day there is only the warm-up.
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

  // On the day of the mock exam, the mock comes first, while she is fresh.
  if (plan.mock) {
    tasks.push({
      id: mockTaskId(plan.mock), kind: 'mock', title: 'Mock Exam', detail: 'Like the real test · about 35 min',
      tip: 'Do it like the real test: notes closed, and write every answer in full sentences. You mark it at the end, and it shows you what to fix.',
      done: didTask(mockTaskId(plan.mock)),
    });
  }

  tasks.push({
    id: 'round-1', kind: 'round', title: plan.mock ? 'A mixed round of everything' : "Round 1: today's questions",
    detail: rounds >= 1 ? 'Done' : questions(size),
    tip: "Close your notes and answer from memory. After each answer, read your teacher's wording once in your head.",
    done: rounds >= 1,
  });

  for (const extra of plan.extras) {
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
        tip: 'Fill all four boxes in your own words: your argument, a country example, how power is distributed, and another view. The example answer comes after you finish.',
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
      tip: 'A second go at what is left, with a few things from earlier days mixed in. Coming back to them is what makes them stay.',
      done: round2Done,
    });
  }

  // Fix My Mistakes comes last, so it only counts once everything before it is done.
  const before = tasks.every((t) => t.done);
  const fixedToday = todays.some((s) => s.kind === 'fix');
  tasks.push({
    id: 'fix', kind: 'fix', title: 'Fix My Mistakes',
    detail: mistakes > 0 ? `${mistakes} question${mistakes === 1 ? '' : 's'} waiting` : 'Nothing to fix',
    tip: 'Each question leaves the list when you get it right twice. Mistakes here are useful: they show what to practise.',
    done: before && (mistakes === 0 || fixedToday),
  });
  return tasks;
}

export function nextTask(tasks: readonly Task[]): Task | undefined {
  return tasks.find((t) => !t.done);
}

/** True when there were tasks today and every one of them is done: the day's preparation is finished. */
export function dayFinished(tasks: readonly Task[]): boolean {
  return tasks.length > 0 && tasks.every((t) => t.done);
}
