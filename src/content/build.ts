// Small helpers so that pack files read like the teacher's notes
// and cannot point at an answer that is not among the options.
import type { ChoiceItem, ChoiceSet, Item, MatchItem, OrderItem, PairItem, TableCell, TableItem, TermItem } from './types';

export const SYSTEMS = [
  'Absolute monarchy',
  'Constitutional monarchy',
  'Direct democracy',
  'Representative democracy',
  'Dictatorship',
] as const;

export const RESPONSIBILITIES = [
  'Maintaining public order',
  'Protecting citizens',
  'Providing public services',
  'Enforcing laws',
] as const;

export const COUNTRIES = ['United Kingdom', 'Japan', 'Saudi Arabia', 'Switzerland', 'North Korea'] as const;

export const LEVELS = ['Individual', 'Local', 'National'] as const;

const SETS: Record<ChoiceSet, readonly string[]> = {
  system: SYSTEMS,
  responsibility: RESPONSIBILITIES,
  country: COUNTRIES,
  level: LEVELS,
};

function indexIn(options: readonly string[], correct: string, id: string): number {
  const i = options.indexOf(correct);
  if (i < 0) throw new Error(`Item ${id}: "${correct}" is not one of its options`);
  return i;
}

export function term(id: string, name: string, definition: string): TermItem {
  return { id, type: 'term', term: name, definition, prompt: `What does "${name}" mean?` };
}

/** A free choice: the correct answer first, then the wrong ones. The app shuffles them on screen. */
export function choice(id: string, prompt: string, correct: string, wrong: string[], explain?: string): ChoiceItem {
  return { id, type: 'choice', prompt, options: [correct, ...wrong], answer: 0, explain };
}

/** A choice from one of the fixed answer sets. */
export function fromSet(set: ChoiceSet, id: string, prompt: string, correct: string, explain?: string): ChoiceItem {
  const options = [...SETS[set]];
  return { id, type: 'choice', set, prompt, options, answer: indexIn(options, correct, id), explain };
}

export const sys = (id: string, prompt: string, correct: (typeof SYSTEMS)[number], explain?: string) =>
  fromSet('system', id, prompt, correct, explain);
export const resp = (id: string, prompt: string, correct: (typeof RESPONSIBILITIES)[number], explain?: string) =>
  fromSet('responsibility', id, prompt, correct, explain);
export const country = (id: string, prompt: string, correct: (typeof COUNTRIES)[number], explain?: string) =>
  fromSet('country', id, prompt, correct, explain);
export const level = (id: string, prompt: string, correct: (typeof LEVELS)[number], explain?: string) =>
  fromSet('level', id, prompt, correct, explain);

export function pair(id: string, prompt: string, options: [string, string], correct: string, explain?: string): PairItem {
  return { id, type: 'pair', prompt, options, answer: indexIn(options, correct, id) as 0 | 1, explain };
}

export function match(id: string, prompt: string, pairs: [string, string][], explain?: string): MatchItem {
  return { id, type: 'match', prompt, pairs: pairs.map(([left, right]) => ({ left, right })), explain };
}

export function order(id: string, prompt: string, steps: string[], explain?: string): OrderItem {
  return { id, type: 'order', prompt, steps, explain };
}

export function cell(correct: string, options: readonly string[]): TableCell {
  const sorted = [...options].sort((a, b) => a.localeCompare(b));
  return { options: sorted, answer: indexIn(sorted, correct, `cell "${correct}"`) };
}

export function tableRow(
  id: string, group: string, rowHeader: string, columns: string[], cells: TableCell[], explain?: string,
): TableItem {
  if (cells.length !== columns.length) throw new Error(`Table row ${id}: ${cells.length} cells for ${columns.length} columns`);
  return { id, type: 'table', group, rowHeader, columns, cells, prompt: `Fill in the row: ${rowHeader}`, explain };
}

/**
 * Groups a topic's questions into the things to know. Each rule is [concept, pattern];
 * a question joins the first concept whose pattern matches its id. Every question must match one.
 */
export function withConcepts(items: Item[], rules: [concept: string, pattern: RegExp][]): Item[] {
  return items.map((it) => {
    const rule = rules.find(([, pattern]) => pattern.test(it.id));
    if (!rule) throw new Error(`Item ${it.id} does not belong to any concept`);
    return { ...it, concept: rule[0] };
  });
}
