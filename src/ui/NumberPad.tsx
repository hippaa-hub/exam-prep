// A number pad for number answers: digits, a real minus sign, delete. No phone keyboard needed.
export function NumberPad({ onKey, onDelete }: { onKey: (k: string) => void; onDelete: () => void }) {
  const key = (k: string, label = k, cls = '', aria = label) => (
    <button key={k} type="button" className={`mkey ${cls}`} aria-label={aria} onClick={() => onKey(k)}>{label}</button>
  );
  return (
    <div className="mkeypad" role="group" aria-label="Number pad">
      <div className="mgrid">
        {key('7')}{key('8')}{key('9')}
        <button type="button" className="mkey del" aria-label="Delete" onClick={onDelete}>⌫</button>
        {key('4')}{key('5')}{key('6')}{key('-', '−', 'op', 'minus')}
        {key('1')}{key('2')}{key('3')}{key('0')}
      </div>
    </div>
  );
}

/** What she typed, as a number (null while it is not one yet). Accepts "-" or "−". */
export function readNumber(text: string): number | null {
  const t = text.replace(/[−–]/g, '-').trim();
  return /^-?\d+$/.test(t) ? Number(t) : null;
}

export const showNumber = (text: string) => text.replace(/-/g, '−');
