import { pretty as prettyMaths } from '../engine/algebra';
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
  /**
   * "Show me how": the method, one step at a time, which she can open before she answers.
   * For a calculation it is also the worked solution shown after she answers.
   */
  how?: string[];
  /** A drawn growing pattern shown above the question (matchsticks, dots, tiles…). */
  picture?: Picture;
}

/** The growing patterns the app can draw from numbers. */
export type PictureKind = 'matchsticks' | 'toothpicks' | 'tile-cross' | 'dot-triangles' | 'dot-squares' | 'mosaic';
export interface Picture {
  kind: PictureKind;
  /** Which figures (stages) to draw, for example [1, 2, 3]. */
  figures: number[];
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

/** A known slip and what to say about it. `answer` is compared by value, so any way of writing it counts. */
export interface Slip { answer: string; say: string }

/** An algebra answer built on the maths keypad, checked by value (7x + 3y = 3y + 7x), not by spelling. */
export interface ExpressionItem extends ItemBase {
  type: 'expression';
  /** The expression to work on, shown big under the instruction. */
  expr: string;
  /** One right answer. Any equal expression is accepted. */
  answer: string;
  /** True (the default) when the answer must be fully simplified: 5x + 2x is not accepted for 7x. */
  simplest?: boolean;
  /**
   * 'multiply' lets the app spot the usual multiplication slips by itself. 'brackets' spots a sign not changed
   * after a minus. 'rule' is an nth-term rule: any equal form is accepted and a wrong rule is tested on the terms.
   */
  kind?: 'multiply' | 'collect' | 'brackets' | 'rule' | 'other';
  /** Slips this question is known for, with what to say. */
  slips?: Slip[];
  /** Letters for the keypad. Left out, they are taken from the expression. */
  letters?: string[];
  /** Shown instead of `expr` when the question is not the calculation itself (a missing expression, a rule to find). */
  show?: string;
  /** For a rule (kind 'rule'): the first terms, so a wrong rule can be tested against them. */
  terms?: number[];
}

/** One or more number answers, typed on a number pad. */
export interface NumericItem extends ItemBase {
  type: 'numeric';
  fields: {
    label: string;
    answer: number;
    /** The calculation that gives the answer, for example "1 - (-3)^2". The tests work it out again. */
    calc?: string;
  }[];
  /** Known wrong answers (for the first field) and what to say about them. */
  slips?: { answer: number; say: string }[];
}

/** A sequence: type the next two terms, say what kind it is, and give the evidence. */
export interface SequenceItem extends ItemBase {
  type: 'sequence';
  terms: number[];
  next: [number, number];
  kind: 'arithmetic' | 'geometric' | 'neither';
  /** The evidence, as one of `evidence`'s options, for example "+4 each time". */
  rule: string;
  evidence: string[];
}

/** Error Detective: a worked solution with one wrong line. Tap the wrong line, then pick the fix. */
export interface ErrorFindItem extends ItemBase {
  type: 'errorFind';
  lines: string[];
  /** The index of the wrong line. */
  wrong: number;
  /** The corrected line (one of `fixes`). */
  fix: string;
  /** Options for the fix, including `fix`. */
  fixes: string[];
}

export type Item = TermItem | ChoiceItem | PairItem | MatchItem | TableItem | OrderItem | ShortItem | ExpressionItem | NumericItem | SequenceItem | ErrorFindItem;
export type ItemType = Item['type'];

export interface Topic {
  id: TopicId;
  title: string;
  /** Short label for lists. */
  short: string;
  items: Item[];
}

/** An extra activity for a plan day, on top of the rounds of questions. */
export type DayExtra = { kind: 'game'; game: Game } | { kind: 'table'; group: string } | { kind: 'argument' } | { kind: 'learn'; topic: TopicId };

/** One step of a worked example, with why it is done. */
export interface LearnStep { show: string; why: string }

/** A Learn card: the teacher's worked example revealed one step at a time, then a "why?" tap and a faded example. */
export interface LearnCard {
  id: string;
  emoji: string;
  title: string;
  /** What this card is about, in one or two plain sentences. */
  intro: string;
  steps: LearnStep[];
  /** A quick "why?" question after the steps. */
  tap?: { question: string; options: string[]; answer: number; why: string };
  /** A faded example: the first steps are given, she does the last one herself. */
  faded?: { prompt: string; expr: string; given: LearnStep[]; answer: string; hint: string; kind?: 'multiply' | 'collect' | 'brackets' | 'rule'; show?: string };
  /** A drawn pattern for the card. */
  picture?: Picture;
  /** The one thing to remember. */
  remember: string;
}

/** The lesson for one topic: Learn cards to go through before the questions. */
export interface Lesson {
  topic: TopicId;
  title: string;
  /** Shown on the task card. */
  blurb: string;
  cards: LearnCard[];
}

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
  /** Lessons (Learn cards) that teach a topic before it is tested. */
  lessons?: Lesson[];
  /** A lesson she missed in class: Home shows a big "Catch up" card until it is done. */
  catchUp?: TopicId;
  /**
   * After a miss, the question comes back with different numbers (another question on the same idea),
   * never the same one again. Fix My Mistakes does the same.
   */
  freshNumbers?: boolean;
  /** Old names of things to know that were merged into others: saved progress moves to the new name. */
  conceptAliases?: Record<ConceptId, ConceptId>;
  /** Round sizes for this pack, when the default (15, and 20 on the last day) cannot fill the ring in time. */
  sizes?: { round?: number; lastDay?: number };
  /** Questions added late (after a slide-by-slide check). A mixed day asks these first, in a round of their own. */
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
  if (item.type === 'expression') return `${item.prompt} ${prettyMaths(item.show ?? item.expr)}`;
  if (item.type === 'sequence') return `${item.terms.map(fmtNum).join(', ')}, …`;
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

/** A number with a real minus sign. */
export function fmtNum(n: number): string {
  return n < 0 ? `−${Math.abs(n)}` : String(n);
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
    case 'expression': return prettyMaths(item.answer);
    case 'numeric': return item.fields.map((f) => `${f.label}: ${fmtNum(f.answer)}`).join('\n');
    case 'sequence': return `Next: ${item.next.map(fmtNum).join(', ')} · ${item.kind} · ${item.rule}`;
    case 'errorFind': return `Wrong line: ${prettyMaths(item.lines[item.wrong])}\nFix: ${prettyMaths(item.fix)}`;
  }
}
