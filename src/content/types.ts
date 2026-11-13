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

/** A flashcard: see the term, say the definition, flip, then rate yourself. */
export interface TermItem extends ItemBase {
  type: 'term';
  term: string;
  definition: string;
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
}

/** This or That: one statement, two buttons. */
export interface PairItem extends ItemBase {
  type: 'pair';
  options: [string, string];
  answer: 0 | 1;
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

export type Item = TermItem | ChoiceItem | PairItem | MatchItem | TableItem | OrderItem;
export type ItemType = Item['type'];

export interface Topic {
  id: TopicId;
  title: string;
  /** Short label for lists. */
  short: string;
  items: Item[];
}

/** An extra activity for a plan day, on top of the rounds of questions. */
export type DayExtra = { kind: 'game'; game: Game } | { kind: 'table'; group: string };

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
}

/** Which practice game an item belongs to. */
export type Game = 'key-terms' | 'this-or-that' | 'which-system' | 'which-responsibility' | 'tables' | 'quiz';

export function gameOf(item: Item): Game {
  switch (item.type) {
    case 'term': return 'key-terms';
    case 'pair': return 'this-or-that';
    case 'table': return 'tables';
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

/** A short name for a question, for lists (the mistakes list, the end-of-session summary). */
export function shortLabel(item: Item): string {
  if (item.type === 'term') return `Key term: ${item.term}`;
  if (item.type === 'table') return `${item.group}: ${item.rowHeader}`;
  return item.prompt.replace(/\n/g, ' ');
}

export function itemsOf(pack: Pack): Item[] {
  return pack.topics.flatMap((t) => t.items);
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
  }
}
