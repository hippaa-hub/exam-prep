// One question on screen. Each kind of item has its own way of being answered;
// all of them report a single outcome and then show the marking.
import { useMemo, useState } from 'react';
import type { ChoiceItem, Item, MatchItem, OrderItem, PairItem, TableItem, TermItem } from '../content/types';
import type { Outcome } from '../engine/progress';
import { shuffle } from '../engine/rng';
import { FillRows, type FillRow } from './FillRows';

interface ViewProps<T extends Item> {
  item: T;
  /** True once she has answered: the view shows the marking and nothing can be changed. */
  locked: boolean;
  onResult: (outcome: Outcome) => void;
}

export function ItemView(props: ViewProps<Item>) {
  const { item } = props;
  switch (item.type) {
    case 'term': return <TermView {...props} item={item} />;
    case 'choice': return <ChoiceView {...props} item={item} />;
    case 'pair': return <PairView {...props} item={item} />;
    case 'match': return <MatchView {...props} item={item} />;
    case 'table': return <TableRowView {...props} item={item} />;
    case 'order': return <OrderView {...props} item={item} />;
  }
}

function Prompt({ text, kicker }: { text: string; kicker?: string }) {
  const [first, ...rest] = text.split('\n');
  return (
    <div className="prompt">
      {kicker && <div className="kicker">{kicker}</div>}
      <h2>{first}</h2>
      {rest.length > 0 && <blockquote>{rest.join(' ')}</blockquote>}
    </div>
  );
}

const SET_KICKER: Record<string, string> = {
  system: 'Which system?',
  responsibility: 'Which responsibility?',
  country: 'Which country?',
  level: 'Which level of decision?',
};

function optionClass(i: number, picked: number | null, answer: number, locked: boolean): string {
  if (!locked) return i === picked ? 'option picked' : 'option';
  if (i === answer) return 'option right';
  if (i === picked) return 'option wrong';
  return 'option dim';
}

function ChoiceView({ item, locked, onResult }: ViewProps<ChoiceItem>) {
  const order = useMemo(() => {
    const idx = item.options.map((_, i) => i);
    return item.set ? idx : shuffle(idx);
  }, [item]);
  const [picked, setPicked] = useState<number | null>(null);
  const [why, setWhy] = useState('');
  // "Which responsibility?" also asks her to say why it matters, before she sees the teacher's wording.
  const twoStep = item.set === 'responsibility';

  const pick = (i: number) => {
    if (locked) return;
    setPicked(i);
    if (!twoStep) onResult(i === item.answer ? 'right' : 'wrong');
  };

  return (
    <div className="item">
      <Prompt text={item.prompt} kicker={item.set ? SET_KICKER[item.set] : undefined} />
      <div className="options" role="group" aria-label="Answers">
        {order.map((i) => (
          <button key={i} type="button" className={optionClass(i, picked, item.answer, locked)}
            disabled={locked} aria-pressed={i === picked} onClick={() => pick(i)}>
            {item.options[i]}
          </button>
        ))}
      </div>
      {twoStep && picked !== null && (
        <div className="why">
          <label htmlFor={`why-${item.id}`}>Why does it matter? One sentence in your own words (you can skip this).</label>
          <textarea id={`why-${item.id}`} rows={2} value={why} readOnly={locked}
            onChange={(e) => setWhy(e.target.value)} placeholder="It matters because…" />
          {!locked && (
            <button type="button" className="btn primary" onClick={() => onResult(picked === item.answer ? 'right' : 'wrong')}>
              Check
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PairView({ item, locked, onResult }: ViewProps<PairItem>) {
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => {
    if (locked) return;
    setPicked(i);
    onResult(i === item.answer ? 'right' : 'wrong');
  };
  return (
    <div className="item">
      <div className="kicker">This or that?</div>
      <div className="statement">{item.prompt}</div>
      <div className="pair" role="group" aria-label="Answers">
        {item.options.map((label, i) => (
          <button key={label} type="button" className={optionClass(i, picked, item.answer, locked)}
            disabled={locked} aria-pressed={i === picked} onClick={() => pick(i)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FillView({ prompt, kicker, rows, locked, onResult }: {
  prompt: string; kicker: string; rows: FillRow[]; locked: boolean; onResult: (o: Outcome) => void;
}) {
  const [values, setValues] = useState<(number | null)[]>(() => rows.map(() => null));
  const complete = values.every((v) => v !== null);
  return (
    <div className="item">
      <Prompt text={prompt} kicker={kicker} />
      <FillRows rows={rows} values={values} locked={locked}
        onChange={(i, v) => setValues((cur) => cur.map((x, j) => (j === i ? v : x)))} />
      {!locked && (
        <button type="button" className="btn primary" disabled={!complete}
          onClick={() => onResult(rows.every((r, i) => values[i] === r.answer) ? 'right' : 'wrong')}>
          Check
        </button>
      )}
    </div>
  );
}

function MatchView({ item, locked, onResult }: ViewProps<MatchItem>) {
  const rows = useMemo<FillRow[]>(() => {
    const rights = shuffle(item.pairs.map((p) => p.right));
    return item.pairs.map((p) => ({ label: p.left, options: rights, answer: rights.indexOf(p.right) }));
  }, [item]);
  return <FillView prompt={item.prompt} kicker="Match" rows={rows} locked={locked} onResult={onResult} />;
}

export function tableRows(item: TableItem): FillRow[] {
  return item.columns.map((c, i) => ({ label: c, options: item.cells[i].options, answer: item.cells[i].answer }));
}

function TableRowView({ item, locked, onResult }: ViewProps<TableItem>) {
  const rows = useMemo(() => tableRows(item), [item]);
  return <FillView prompt={item.rowHeader} kicker={`${item.group}: fill in the row`} rows={rows} locked={locked} onResult={onResult} />;
}

function OrderView({ item, locked, onResult }: ViewProps<OrderItem>) {
  const pool = useMemo(() => {
    const idx = item.steps.map((_, i) => i);
    let mixed = shuffle(idx);
    // Never hand her the steps already in the right order.
    if (idx.length > 1 && mixed.every((v, i) => v === i)) mixed = [...idx.slice(1), idx[0]];
    return mixed;
  }, [item]);
  const [placed, setPlaced] = useState<number[]>([]);
  const left = pool.filter((i) => !placed.includes(i));
  const complete = placed.length === item.steps.length;
  const allRight = placed.every((v, i) => v === i);

  return (
    <div className="item">
      <Prompt text={item.prompt} kicker="Put in order" />
      <ol className="placed" aria-label="Your order">
        {placed.map((i, pos) => (
          <li key={i}>
            <button type="button" disabled={locked}
              className={locked ? (i === pos ? 'chip right' : 'chip wrong') : 'chip placed-chip'}
              onClick={() => setPlaced((cur) => cur.filter((x) => x !== i))}
              aria-label={locked ? item.steps[i] : `${item.steps[i]} (tap to take back)`}>
              <span className="num">{pos + 1}</span>{item.steps[i]}
            </button>
          </li>
        ))}
        {!complete && <li className="slot">Tap the next step below</li>}
      </ol>
      {left.length > 0 && (
        <div className="chips" role="group" aria-label="Steps to place">
          {left.map((i) => (
            <button key={i} type="button" className="chip" onClick={() => setPlaced((cur) => [...cur, i])}>
              {item.steps[i]}
            </button>
          ))}
        </div>
      )}
      {!locked && (
        <button type="button" className="btn primary" disabled={!complete} onClick={() => onResult(allRight ? 'right' : 'wrong')}>
          Check
        </button>
      )}
    </div>
  );
}

function TermView({ item, locked, onResult }: ViewProps<TermItem>) {
  const [flipped, setFlipped] = useState(false);
  const [typed, setTyped] = useState('');
  return (
    <div className="item">
      <div className="kicker">Key term</div>
      <div className="term-card">
        <div className="term">{item.term}</div>
        {!flipped && <p className="hint">Say the definition out loud or in your head. You can type it too.</p>}
      </div>
      {!flipped ? (
        <>
          <textarea className="term-input" rows={3} value={typed} onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the definition (you can skip this)" aria-label="Your definition" />
          <button type="button" className="btn primary" onClick={() => setFlipped(true)}>Flip the card</button>
        </>
      ) : (
        <>
          {typed.trim() && (
            <div className="yours"><span>You wrote</span>{typed.trim()}</div>
          )}
          <div className="teacher"><span>The teacher's definition</span>{item.definition}</div>
          <p className="hint">How close were you?</p>
          <div className="rate" role="group" aria-label="How close were you?">
            <button type="button" className="btn rate-good" disabled={locked} onClick={() => onResult('right')}>Knew it</button>
            <button type="button" className="btn rate-almost" disabled={locked} onClick={() => onResult('almost')}>Almost</button>
            <button type="button" className="btn rate-notyet" disabled={locked} onClick={() => onResult('wrong')}>Not yet</button>
          </div>
        </>
      )}
    </div>
  );
}
