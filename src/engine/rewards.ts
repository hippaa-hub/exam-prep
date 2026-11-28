import type { Pack } from '../content/types';
import { conceptsOf, glossaryOf, itemsOf } from '../content/types';
import type { PackSave } from '../storage/db';
import { READY_AT, isTopicReady, readiness } from './progress';
import { packRing } from './ring';
import { totalSeconds } from './time';

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
/** A round needs at least this many questions for the Perfect round badge. */
export const PERFECT_ROUND_MIN = 5;

/**
 * Every badge this pack offers, grouped by what they reward: rounds, days, activities, knowledge.
 * Each one is decided from what is saved, so it is always a true statement about what she has done.
 */
export function badgesFor(pack: Pack, save: PackSave): Badge[] {
  const { progress, sessions } = save;
  const items = itemsOf(pack);
  const concepts = conceptsOf(items);
  const terms = items.filter((it) => it.type === 'term');
  const hasTables = items.some((it) => it.type === 'table');
  const glossary = glossaryOf(pack);

  const rounds = sessions.length;
  const studyDays = new Set(sessions.map((s) => s.date)).size;
  const daysDone = save.daysDone?.length ?? 0;
  const minutes = totalSeconds(save.studyTime) / 60;
  const ring = packRing(pack, progress, sessions);
  const tried = concepts.filter((c) => (progress[c]?.seen ?? 0) > 0).length;
  const learned = concepts.filter((c) => (progress[c]?.level ?? 0) >= 3).length;
  const wordsMet = glossary.filter((w) => (progress[w.id]?.seen ?? 0) > 0).length;
  const didTask = (test: (task: string) => boolean) => sessions.some((s) => s.task !== undefined && test(s.task));
  const half = Math.ceil(concepts.length / 2);

  const list: (Badge | false)[] = [
    // ---- Rounds: for turning up and doing the work ----
    { id: 'first-round', icon: '🌱', title: pack.journey ? 'First task' : 'First round', how: pack.journey ? 'Finish your first task.' : 'Finish your first round.', earned: rounds >= 1 },
    { id: 'five-rounds', icon: '🖐️', title: pack.journey ? 'Five tasks' : 'Five rounds', how: pack.journey ? 'Finish five tasks.' : 'Finish five rounds.', earned: rounds >= 5 },
    { id: 'ten-rounds', icon: '🔟', title: pack.journey ? 'Ten tasks' : 'Ten rounds', how: pack.journey ? 'Finish ten tasks.' : 'Finish ten rounds.', earned: rounds >= 10 },
    { id: 'twenty-rounds', icon: '💪', title: pack.journey ? 'Twenty tasks' : 'Twenty rounds', how: pack.journey ? 'Finish twenty tasks.' : 'Finish twenty rounds.', earned: rounds >= 20 },
    { id: 'points-100', icon: '💯', title: '100 points', how: 'Collect 100 points.', earned: save.points >= 100 },
    { id: 'time-30', icon: '⏱️', title: 'Half an hour', how: 'Study for 30 minutes in total.', earned: minutes >= 30 },
    { id: 'time-60', icon: '⏰', title: 'One hour', how: 'Study for one hour in total.', earned: minutes >= 60 },

    // ---- Days: for keeping going ----
    { id: 'day-done', icon: '✅', title: 'Day finished', how: "Finish all of a day's tasks.", earned: daysDone >= 1 },
    { id: 'two-done', icon: '✌️', title: 'Two days finished', how: "Finish all the day's tasks on two days.", earned: daysDone >= 2 },
    { id: 'three-done', icon: '🏅', title: 'Three days finished', how: "Finish all the day's tasks on three days.", earned: daysDone >= 3 },
    { id: 'three-days', icon: '📅', title: 'Three days of study', how: 'Study on three different days.', earned: studyDays >= 3 },

    // ---- Activities: for trying every kind of practice ----
    terms.length > 0 && {
      id: 'flashcards', icon: '🗂️', title: 'Flashcard round', how: 'Finish a round of Key Terms flashcards.', earned: didTask((t) => t === 'game:key-terms'),
    },
    hasTables && { id: 'table', icon: '📋', title: 'Table filled', how: 'Fill a whole table from memory.', earned: didTask((t) => t.startsWith('table:')) },
    hasTables && {
      id: 'table-perfect', icon: '💎', title: 'Perfect table', how: 'Fill a whole table with no mistakes.',
      earned: sessions.some((s) => s.task?.startsWith('table:') && s.asked > 0 && s.firstTimeRight === s.asked),
    },
    (pack.arguments?.length ?? 0) > 0 && {
      id: 'argument', icon: '🧩', title: 'Argument writer', how: 'Write an argument in the Argument Builder.',
      earned: Object.keys(save.writing ?? {}).length > 0 || didTask((t) => t === 'argument'),
    },
    { id: 'fixer', icon: '🔧', title: 'Mistake fixer', how: 'Finish a round of Fix My Mistakes.', earned: sessions.some((s) => s.kind === 'fix') },
    {
      id: 'perfect-round', icon: '⭐', title: 'Perfect round', how: 'Get every question right first time in a round.',
      earned: sessions.some((s) => s.asked >= PERFECT_ROUND_MIN && s.firstTimeRight === s.asked),
    },
    glossary.length >= GLOSSARY_BADGE_WORDS && {
      id: 'glossary', icon: '📖', title: 'Word collector', how: `Meet ${GLOSSARY_BADGE_WORDS} glossary words.`, earned: wordsMet >= GLOSSARY_BADGE_WORDS,
    },
    (pack.mocks?.length ?? 0) > 0 && {
      id: 'mock', icon: '📝', title: 'Mock exam finished', how: 'Finish the mock exam.', earned: Object.keys(save.mockResults ?? {}).length + Object.keys(save.mathsMocks ?? {}).length > 0,
    },

    // ---- Knowledge: for what she now knows ----
    ...(pack.adventure?.worlds ?? []).map((w) => ({
      id: `world-${w.id}`, icon: w.emoji, title: w.badge, how: `Finish the game ${w.title}.`,
      earned: sessions.some((s) => s.task === `play:${w.id}`),
    })),
    { id: 'tried-half', icon: '🔍', title: 'Explorer', how: 'Try half of the things to know.', earned: concepts.length > 0 && tried >= half },
    { id: 'tried-all', icon: '🧭', title: 'Tried everything', how: 'Try every thing to know at least once.', earned: concepts.length > 0 && tried >= concepts.length },
    { id: 'first-learned', icon: '🌟', title: 'First one learned', how: 'Get one thing right on three different days.', earned: learned >= 1 },
    { id: 'ten-learned', icon: '🌠', title: 'Ten learned', how: 'Get ten things right on three different days.', earned: learned >= 10 },
    { id: 'halfway', icon: '⛰️', title: 'Halfway there', how: 'Fill the ring to 50%.', earned: ring >= 50 },
    { id: 'topic-ready', icon: '🎯', title: 'First topic ready', how: `Get one topic to ${READY_AT}%.`, earned: pack.topics.some((t) => isTopicReady(t, progress)) },
    terms.length > 0 && {
      id: 'key-terms', icon: '🔑', title: 'Key terms ready', how: `Get the key terms to ${READY_AT}%.`, earned: readiness(terms, progress) >= READY_AT,
    },
    { id: 'ready', icon: '🏆', title: 'Ready for the exam', how: `Fill the ring to ${READY_AT}%.`, earned: ring >= READY_AT },
  ];
  // A daily-journey pack has no flashcard rounds, tables or Fix My Mistakes task: no badges she could never earn.
  const notInJourney = new Set(['flashcards', 'table', 'table-perfect', 'fixer', 'key-terms', 'glossary']);
  return list.filter((b): b is Badge => b !== false && !(pack.journey && notInJourney.has(b.id)));
}

/** The earned badges she has not been shown yet. */
export function newBadges(badges: readonly Badge[], seen: readonly string[] = []): Badge[] {
  return badges.filter((b) => b.earned && !seen.includes(b.id));
}
