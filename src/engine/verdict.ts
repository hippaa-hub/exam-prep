// The parent's "Ready?" card: one plain answer, then what is still missing, in the order to do it.
import type { Pack } from '../content/types';
import type { MathsMockResult } from './mathsMock';
import { bandTop } from './mathsMock';
import type { SessionRecord } from './plan';
import { READY_AT, topicReadiness, type ProgressMap } from './progress';
import { learnTaskId } from './tasks';

export interface Verdict {
  level: 'ready' | 'nearly' | 'not-yet';
  headline: string;
  /** What is still to do, most important first. Empty when ready. */
  todo: string[];
  /** What is already done. */
  done: string[];
}

export function readyVerdict(
  pack: Pack, progress: ProgressMap, sessions: readonly SessionRecord[], ring: number, mistakes: number,
  mathsMocks: Record<string, MathsMockResult> = {},
): Verdict {
  const todo: string[] = [];
  const done: string[] = [];

  // Lessons first: a topic she has not been taught cannot be tested.
  for (const l of pack.lessons ?? []) {
    const learned = sessions.some((s) => s.task === learnTaskId(l.topic));
    const name = pack.catchUp === l.topic ? `the lesson she missed (${l.title})` : `the lesson "${l.title}"`;
    if (learned) done.push(`Did ${name}`);
    else todo.push(`Do ${name}`);
  }

  const weak = pack.topics.filter((t) => topicReadiness(t, progress) < READY_AT);
  const strong = pack.topics.filter((t) => topicReadiness(t, progress) >= READY_AT);
  if (strong.length > 0) done.push(`Ready (${READY_AT}% or more): ${strong.map((t) => t.short).join(', ')}`);
  if (weak.length > 0) {
    todo.push(`Not ready yet: ${weak.map((t) => `${t.short} ${topicReadiness(t, progress)}%`).join(', ')}`);
  }
  if (mistakes > 0) todo.push(`${mistakes} question${mistakes === 1 ? '' : 's'} waiting in Fix My Mistakes`);

  const mocks = (pack.mocks ?? []).filter((m) => m.maths);
  const results = mocks.map((m) => mathsMocks[m.id]).filter((r): r is MathsMockResult => !!r);
  if (mocks.length > 0) {
    if (results.length === 0) todo.push('Sit the Mock Test (45 minutes, Criteria B and C)');
    else {
      const best = results.reduce((a, b) => (bandTop(b.b) + bandTop(b.c) > bandTop(a.b) + bandTop(a.c) ? b : a));
      done.push(`Mock Test: Criterion B ${best.b}, Criterion C ${best.c} (her own marking)`);
      if (bandTop(best.b) < 7) todo.push('Criterion B: test the rule on a new stage and explain why it works');
      if (bandTop(best.c) < 7) todo.push('Criterion C: show every step and explain in full sentences');
    }
  }

  const mockOk = mocks.length === 0 || results.length > 0;
  const level = ring >= READY_AT && weak.length === 0 && mockOk ? 'ready' : ring >= 60 && todo.length <= 3 ? 'nearly' : 'not-yet';
  const headline = level === 'ready' ? 'Ready ✓' : level === 'nearly' ? 'Nearly ready' : 'Not ready yet';
  return { level, headline, todo, done };
}
