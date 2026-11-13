// After a multiple-choice or this-or-that answer: why the right answer is right,
// and, if she chose another one, why that one is not.
import type { ChoiceItem, Pack, PairItem } from '../content/types';

export interface Explanation {
  correct: string;
  /** Why the right answer is right. */
  whyRight: string;
  /** What she chose, if it was not the right answer. */
  chosen?: string;
  /** Why her choice is not right. */
  whyNot?: string;
}

export function explainChoice(pack: Pick<Pack, 'meanings'>, item: ChoiceItem | PairItem, chosen?: string): Explanation {
  const correct = item.options[item.answer];
  const whyRight = item.explain ?? pack.meanings?.[correct] ?? '';
  if (chosen === undefined || chosen === correct) return { correct, whyRight };
  return { correct, whyRight, chosen, whyNot: item.whyNot?.[chosen] ?? pack.meanings?.[chosen] };
}
