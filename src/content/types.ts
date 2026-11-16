/** A calendar day as 'YYYY-MM-DD'. */
export type DateKey = string;

export type TopicId = string;
export type ItemId = string;

export interface ItemBase {
  id: ItemId;
  /** The question as Adele reads it. */
  prompt: string;
  /** The teacher's wording, shown straight after she answers. */
  explain?: string;
  /**
   * The "thing to know" this question tests (for example one key term, or one country).
   * Several questions share one concept, so Adele meets different wordings of the same fact.
   * Levels and readiness are counted per concept. Without it, the question is its own concept.
   */
  concept?: string;
}

/** One key idea a written answer should contain, with the words that show it is there. */
export interface Idea {
  /** The idea in plain words, for the tick-list she marks herself with. */
  label: string;
  /** Words or short phrases that signal the idea. Any one of them is enough. */
  words: string[];
}

/** A flashcard: see the term, say the definition, flip, then rate yourself. */
export interface TermItem extends ItemBase {
  type: 'term';
  term: string;
  definition: string;
  /** The key ideas of the definition, so the app can check a definition she says or types. */
  ideas?: Idea[];
}

/**
 * Fixed answer sets keep their buttons in the same place every time
 * (the five systems, the four responsibilities, the five countries, the three levels).
 */
export type ChoiceSet = 'system' | 'responsibility' | 'country' | 'level';

/** Tap one option out of several. */
export interface ChoiceItem extends ItemBase {
  type: 'choice';
  options: string[];
  answer: number;
  set?: ChoiceSet;
  /** Why a wrong option is wrong, keyed by the option's text. */
  whyNot?: Record<string, string>;
}

/** This or That: one statement, two buttons. */
export interface PairItem extends ItemBase {
  type: 'pair';
  options: [string, string];
  answer: 0 | 1;
  /** Why the other option is wrong, keyed by the option's text. */
  whyNot?: Record<string, string>;
}

/** Match each thing on the left to the right answer from a shared set. */
export interface MatchItem extends ItemBase {
  type: 'match';
  pairs: { left: string; right: string }[];
}

export interface TableCell {
  options: string[];
  answer: number;
}

/** One row of a table to fill from memory, one tap per cell. Rows with the same `group` form a table. */
export interface TableItem extends ItemBase {
  type: 'table';
  group: string;
  rowHeader: string;
  columns: string[];
  cells: TableCell[];
}

/** Put the steps in the right order. `steps` is stored in the correct order. */
export interface OrderItem extends ItemBase {
  type: 'order';
  steps: string[];
}

/** A question answered in full sentences, as in the test. She writes first; the teacher's wording comes after. */
export interface ShortItem extends ItemBase {
  type: 'short';
  ideas: Idea[];
  /** How many of the ideas a full answer needs. Left out, it needs all of them. */
  need?: number;
  /** The teacher's wording, shown only after she has written her own answer. */
  model: string;
}

export type Item = TermItem | ChoiceItem | PairItem | MatchItem | TableItem | OrderItem | ShortItem;
export type ItemType = Item['type'];

export interface Topic {
  id: TopicId;
  title: string;
  /** Short label for lists. */
  short: string;
  items: Item[];
}

/** An extra activity for a plan day, on top of the rounds of questions. */
export type DayExtra = { kind: 'game'; game: Game } | { kind: 'table'; group: string } | { kind: 'argument' };

/** A critical-thinking question (Criterion D), answered in the Argument Builder. */
export interface ArgumentItem {
  id: string;
  prompt: string;
  /** One possible answer, built from the teacher's notes. Shown only after she has written her own. */
  example: string;
}

/** A practice exam in the teacher's format. */
export interface MockExam {
  id: string;
  title: string;
  /** A sensible time for the whole paper. The app shows it but never cuts her off. */
  minutes: number;
  /** Part A, knowing and understanding: ids of written questions. */
  partA: ItemId[];
  /** Part B, thinking critically: ids of argument questions. */
  partB: string[];
}

/** The four boxes of the Argument Builder: the four things the teacher asks for in an argument. */
export const ARGUMENT_BOXES: { label: string; help: string }[] = [
  { label: 'My argument', help: 'One clear sentence: what do you think, and why?' },
  { label: 'A country example', help: 'Which of the countries shows this? What happens there?' },
  { label: 'How power is distributed', help: 'Who holds the power in this system, and how did they get it?' },
  { label: 'Another view, then my conclusion', help: 'What might someone who disagrees say? Then finish with your conclusion.' },
];

/** What she checks her own argument against (PLAN.md section 5). No automatic mark. */
export const ARGUMENT_CHECKLIST: string[] = [
  'A clear argument',
  'Key terms used accurately',
  'A country example',
  'Explains how power is distributed',
  'Considers another view',
  'A justified conclusion',
];

export interface PlanDay {
  /** Days relative to the exam: -4 is four days before, 0 is exam day. */
  day: number;
  label: string;
  topics?: TopicId[];
  /** The day's special activities, such as the flashcards or filling a table from memory. */
  extras?: DayExtra[];
  /** A full mock exam (arrives in Phase 2). */
  mock?: string;
}

export interface Pack {
  id: string;
  subject: string;
  title: string;
  /** The exam date. */
  date: DateKey;
  /** What the exam assesses, in a few words. */
  criteria: string[];
  topics: Topic[];
  plan: PlanDay[];
  /** Advice for the test itself, from the teacher's material. Shown in the Guide. */
  examTips?: { title: string; points: string[] }[];
  /** What each answer option means, in plain words, for explaining right and wrong answers. */
  meanings?: Record<string, string>;
  /**
   * "In simple words": a short everyday explanation shown beside the teacher's wording.
   * Keyed by a question's id, or by the thing to know it belongs to.
   */
  simple?: Record<string, string>;
  /** A few short examples for each definition or idea, keyed like `simple`. */
  examples?: Record<string, string[]>;
  /** The critical-thinking questions for the Argument Builder. */
  arguments?: ArgumentItem[];
  /** Practice exams. */
  mocks?: MockExam[];
  /**
   * The teacher's glossary as flashcards: Part 2 of the day, after the day's tasks.
   * These words are extra. They are not part of `topics`, so they do not count in readiness.
   */
  glossary?: TermItem[];
  /** Glossary words that never appear on the teacher's slides. A round only asks them once the others are met. */
  glossaryLast?: ItemId[];
  /** Questions added late (after a slide-by-slide check). The last day's mixed round asks these first. */
  lateAdditions?: ItemId[];
}

/** Which practice game an item belongs to. */
export type Game = 'key-terms' | 'this-or-that' | 'which-system' | 'which-responsibility' | 'tables' | 'quiz' | 'write';

export function gameOf(item: Item): Game {
  switch (item.type) {
    case 'term': return 'key-terms';
    case 'pair': return 'this-or-that';
    case 'table': return 'tables';
    case 'short': return 'write';
    case 'choice':
      if (item.set === 'system') return 'which-system';
      if (item.set === 'responsibility') return 'which-responsibility';
      return 'quiz';
    default: return 'quiz';
  }
}

export type ConceptId = string;

export function conceptOf(item: Item): ConceptId {
  return item.concept ?? item.id;
}

/** The different things to know behind a list of questions, in order of first appearance. */
export function conceptsOf(items: readonly Item[]): ConceptId[] {
  return [...new Set(items.map(conceptOf))];
}

/** The explanation in simple words for a question: its own, or the one for the thing it tests. */
export function simpleWords(pack: Pick<Pack, 'simple'>, item: Item): string | undefined {
  return pack.simple?.[item.id] ?? pack.simple?.[conceptOf(item)];
}

/** A few short examples for a question's definition or idea, if the pack has them. */
export function examplesFor(pack: Pick<Pack, 'examples'>, item: Item): string[] | undefined {
  return pack.examples?.[item.id] ?? pack.examples?.[conceptOf(item)];
}

/** A short name for a question, for lists (the mistakes list, the end-of-session summary). */
export function shortLabel(item: Item): string {
  if (item.type === 'term') return `Key term: ${item.term}`;
  if (item.type === 'table') return `${item.group}: ${item.rowHeader}`;
  return item.prompt.replace(/\n/g, ' ');
}

export function itemsOf(pack: Pack): Item[] {
  return pack.topics.flatMap((t) => t.items);
}

/** The glossary flashcards (Part 2), if the pack has them. */
export function glossaryOf(pack: Pack): TermItem[] {
  return pack.glossary ?? [];
}

/** Every question the app can show: the topics' questions and the glossary cards. */
export function allItemsOf(pack: Pack): Item[] {
  return [...itemsOf(pack), ...glossaryOf(pack)];
}

export function topicOfItem(pack: Pack, id: ItemId): Topic | undefined {
  return pack.topics.find((t) => t.items.some((i) => i.id === id));
}

/** The right answer in words, for the feedback panel. */
export function answerText(item: Item): string {
  switch (item.type) {
    case 'term': return item.definition;
    case 'choice': return item.options[item.answer];
    case 'pair': return item.options[item.answer];
    case 'match': return item.pairs.map((p) => `${p.left}: ${p.right}`).join('\n');
    case 'table': return item.columns.map((c, i) => `${c}: ${item.cells[i].options[item.cells[i].answer]}`).join('\n');
    case 'order': return item.steps.join(' → ');
    case 'short': return item.model;
  }
}
