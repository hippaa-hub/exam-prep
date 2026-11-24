// Marking an algebra answer: right, wrong (with what went wrong if it is a known slip),
// "right value, now simplify it", or "I can't read that yet".
import type { ExpressionItem } from '../content/types';
import { equivalent, isSimplified, multiplySlip, normalise, parse, pretty } from './algebra';

export type Verdict =
  | { kind: 'right'; say?: string }
  | { kind: 'wrong'; say?: string }
  | { kind: 'simplify'; say: string }
  | { kind: 'unreadable'; say: string };

export function judgeExpression(item: ExpressionItem, typed: string): Verdict {
  if (!parse(typed)) {
    return { kind: 'unreadable', say: "I can't read that yet. Check the brackets and the signs." };
  }
  if (equivalent(typed, item.answer)) {
    if ((item.simplest ?? true) && !isSimplified(typed)) {
      return {
        kind: 'simplify',
        say: item.kind === 'multiply'
          ? 'Correct value! Now write it as one term: multiply the numbers and put the letters together.'
          : 'Correct value! Now simplify it: collect the like terms so each kind of term appears once.',
      };
    }
    if (!alphabetical(typed)) {
      return { kind: 'right', say: `Tip: your teacher writes the letters in alphabetical order: ${pretty(item.answer)}.` };
    }
    return { kind: 'right' };
  }
  const known = item.slips?.find((s) => equivalent(typed, s.answer));
  if (known) return { kind: 'wrong', say: known.say };
  if (item.kind === 'multiply') {
    const slip = multiplySlip(item.expr, item.answer, typed);
    if (slip) return { kind: 'wrong', say: slip };
  }
  if (item.kind === 'collect') {
    return { kind: 'wrong', say: 'Group the like terms first (same letters, same powers), then add or subtract only the numbers in front. Keep each sign with its term.' };
  }
  return { kind: 'wrong' };
}

/** True when the letters in each term are in alphabetical order (yx³ is not; x³y is). */
export function alphabetical(typed: string): boolean {
  return normalise(typed).split(/[+-]/).every((term) => {
    const letters = term.replace(/\^\d+/g, '').replace(/[^a-z]/g, '');
    return [...letters].every((c, i) => i === 0 || letters[i - 1] <= c);
  });
}
