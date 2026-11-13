// A list of labelled pickers: used for matching, and for filling one row of a table.

export interface FillRow {
  label: string;
  options: string[];
  answer: number;
}

interface Props {
  rows: FillRow[];
  values: (number | null)[];
  locked: boolean;
  onChange: (row: number, value: number | null) => void;
}

export function FillRows({ rows, values, locked, onChange }: Props) {
  return (
    <div className="fill">
      {rows.map((row, i) => {
        const value = values[i];
        const right = locked && value === row.answer;
        const wrong = locked && value !== row.answer;
        return (
          <label key={row.label} className={`fill-row${right ? ' right' : ''}${wrong ? ' wrong' : ''}`}>
            <span className="fill-label">{row.label}</span>
            {/* The real picker sits invisibly on top, so the phone's own picker opens, while the chosen answer can wrap. */}
            <span className="picker">
              <span className={value === null ? 'picker-text unset' : 'picker-text'}>
                {value === null ? 'Choose…' : row.options[value]}
              </span>
              <select value={value ?? ''} disabled={locked} aria-label={row.label}
                onChange={(e) => onChange(i, e.target.value === '' ? null : Number(e.target.value))}>
                <option value="">Choose…</option>
                {row.options.map((o, j) => <option key={o} value={j}>{o}</option>)}
              </select>
            </span>
            {right && <span className="mark" aria-label="Right">✓</span>}
            {wrong && <span className="fill-answer">Answer: {row.options[row.answer]}</span>}
          </label>
        );
      })}
    </div>
  );
}
