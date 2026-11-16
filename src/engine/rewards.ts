import type { Pack } from '../content/types';
import { glossaryOf, itemsOf } from '../content/types';
import type { PackSave } from '../storage/db';
import { READY_AT, isTopicReady, packReadiness, readiness } from './progress';

// Points are for finishing sessions and fixing past mistakes - never for speed (PLAN.md section 5).
export const POINTS_SESSION = 10;
export const POINTS_FIXED_MISTAKE = 2;

// ---- Badges ---------------------------------------------------------------------------------------
// Badges are for effort and for keeping going (PLAN.md section 5), never for speed.
// They are worked out from what is already saved, so progress made before badges existed counts too.

export interface Badge {
  id: string;
  icon: string;
  title: string;
  /** How to earn it, in a few words. */
  how: string;
  earned: boolean;
}

/** How many glossary words she must have met for the Word collector badge. */
export const GLOSSARY_BADGE_WORDS = 12;

/** Every badge this pack offers, in the order they are usually earned. */
export function badgesFor(pack: Pack, save: PackSave): Badge[] {
  const { progress, sessions } = save;
  const items = itemsOf(pack);
  const terms = items.filter((it) => it.type === 'term');
  const glossary = glossaryOf(pack);
  const ring = packReadiness(pack, progress);
  const studyDays = new Set(sessions.map((s) => s.date)).size;
  const daysDone = save.daysDone?.length ?? 0;
  const wordsMet = glossary.filter((w) => (progress[w.id]?.seen ?? 0) > 0).length;

  const list: (Badge | false)[] = [
    { id: 'first-round', icon: '🌱', title: 'First round', how: 'Finish your first round.', earned: sessions.length > 0 },
    { id: 'day-done', icon: '✅', title: 'Day finished', how: "Finish all of a day's tasks.", earned: daysDone >= 1 },
    { id: 'three-days', icon: '📅', title: 'Three days of study', how: 'Study on three different days.', earned: studyDays >= 3 },
    { id: 'fixer', icon: '🔧', title: 'Mistake fixer', how: 'Finish a round of Fix My Mistakes.', earned: sessions.some((s) => s.kind === 'fix') },
    { id: 'halfway', icon: '⛰️', title: 'Halfway there', how: 'Fill the ring to 50%.', earned: ring >= 50 },
    { id: 'topic-ready', icon: '🎯', title: 'First topic ready', how: `Get one topic to ${READY_AT}%.`, earned: pack.topics.some((t) => isTopicReady(t, progress)) },
    terms.length > 0 && {
      id: 'key-terms', icon: '🗂️', title: 'Key terms ready', how: `Get the key terms to ${READY_AT}%.`, earned: readiness(terms, progress) >= READY_AT,
    },
    items.some((it) => it.type === 'table') && {
      id: 'table-perfect', icon: '📋', title: 'Perfect table', how: 'Fill a whole table with no mistakes.',
      earned: sessions.some((s) => s.task?.startsWith('table:') && s.asked > 0 && s.firstTimeRight === s.asked),
    },
    (pack.arguments?.length ?? 0) > 0 && {
      id: 'argument', icon: '🧩', title: 'Argument writer', how: 'Write an argument in the Argument Builder.',
      earned: Object.keys(save.writing ?? {}).length > 0,
    },
    glossary.length >= GLOSSARY_BADGE_WORDS && {
      id: 'glossary', icon: '📖', title: 'Word collector', how: `Meet ${GLOSSARY_BADGE_WORDS} glossary words.`, earned: wordsMet >= GLOSSARY_BADGE_WORDS,
    },
    (pack.mocks?.length ?? 0) > 0 && {
      id: 'mock', icon: '📝', title: 'Mock exam finished', how: 'Finish the mock exam.', earned: Object.keys(save.mockResults ?? {}).length > 0,
    },
    { id: 'three-done', icon: '🏅', title: 'Three days finished', how: "Finish all the day's tasks on three days.", earned: daysDone >= 3 },
    { id: 'ready', icon: '🏆', title: 'Ready for the exam', how: `Fill the ring to ${READY_AT}%.`, earned: ring >= READY_AT },
  ];
  return list.filter((b): b is Badge => b !== false);
}

/** The earned badges she has not been shown yet. */
export function newBadges(badges: readonly Badge[], seen: readonly string[] = []): Badge[] {
  return badges.filter((b) => b.earned && !seen.includes(b.id));
}
