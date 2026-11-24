// The maths keypad: digits, the letters of the question, powers, signs and brackets. No phone keyboard needed.
import { normalise } from '../engine/algebra';

/** The letters to offer: the ones in the question and its answer, in alphabetical order. */
export function lettersFor(...texts: string[]): string[] {
  const set = new Set(texts.flatMap((t) => normalise(t).match(/[a-z]/g) ?? []));
  return [...set].sort();
}

export function MathsKeypad({ letters, onKey, onDelete, onClear }: {
  letters: string[]; onKey: (k: string) => void; onDelete: () => void; onClear: () => void;
}) {
  const key = (k: string, label = k, cls = '', aria = label) => (
    <button key={`${k}-${label}`} type="button" className={`mkey ${cls}`} aria-label={aria} onClick={() => onKey(k)}>{label}</button>
  );
  return (
    <div className="mkeypad" role="group" aria-label="Maths keypad">
      <div className="mrow letters">
        {letters.map((l) => key(l, l, 'letter'))}
        {key('²', '²', 'power', 'squared')}
        {key('³', '³', 'power', 'cubed')}
        {key('⁴', '⁴', 'power', 'to the power 4')}
        {key('⁵', '⁵', 'power', 'to the power 5')}
      </div>
      <div className="mgrid">
        {key('7')}{key('8')}{key('9')}{key('+', '+', 'op', 'plus')}
        {key('4')}{key('5')}{key('6')}{key('-', '−', 'op', 'minus')}
        {key('1')}{key('2')}{key('3')}{key('×', '×', 'op', 'times')}
        {key('(', '(', 'op', 'open bracket')}{key('0')}{key(')', ')', 'op', 'close bracket')}
        <button type="button" className="mkey del" aria-label="Delete" onClick={onDelete}>⌫</button>
      </div>
      <button type="button" className="text-link small" onClick={onClear}>Clear</button>
    </div>
  );
}
