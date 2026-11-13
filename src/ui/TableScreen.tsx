// A whole table filled from memory, then checked in one go (research principle 5: compare cases side by side).
import { useMemo, useRef, useState } from 'react';
import type { ItemId, Pack, TableItem } from '../content/types';
import { conceptOf, itemsOf } from '../content/types';
import type { ConceptProgress, Outcome } from '../engine/progress';
import type { RunSummary } from '../engine/session';
import { Confetti } from './Confetti';
import { FillRows } from './FillRows';
import { tableRows } from './ItemView';

interface Props {
  group: string;
  pack: Pack;
  onAnswer: (id: ItemId, outcome: Outcome) => { progress: ConceptProgress; fixed: boolean };
  onFinish: (summary: RunSummary) => void;
  onExit: () => void;
  /** The next of today's tasks, when the table was opened from the task list. */
  next?: { title: string; start: () => void };
  dayDone?: boolean;
}

export function TableScreen({ group, pack, onAnswer, onFinish, onExit, next, dayDone }: Props) {
  const rows = useMemo(
    () => itemsOf(pack).filter((it): it is TableItem => it.type === 'table' && it.group === group),
    [pack, group],
  );
  const blank = () => Object.fromEntries(rows.map((r) => [r.id, r.cells.map(() => null as number | null)]));
  const [values, setValues] = useState<Record<ItemId, (number | null)[]>>(blank);
  const [checked, setChecked] = useState(false);
  const reported = useRef(false);

  const cells = rows.reduce((n, r) => n + r.cells.length, 0);
  const filled = rows.reduce((n, r) => n + values[r.id].filter((v) => v !== null).length, 0);
  const rowRight = (r: TableItem) => r.cells.every((c, i) => values[r.id][i] === c.answer);
  const rightCount = rows.filter(rowRight).length;

  const check = () => {
    const missed = rows.filter((r) => !rowRight(r)).map((r) => r.id);
    // Rows that test the same thing to know are marked together: right only if every one of them is right.
    for (const concept of new Set(rows.map(conceptOf))) {
      const group = rows.filter((r) => conceptOf(r) === concept);
      const firstWrong = group.find((r) => !rowRight(r));
      onAnswer((firstWrong ?? group[0]).id, firstWrong ? 'wrong' : 'right');
    }
    if (!reported.current) {
      reported.current = true;
      onFinish({ asked: rows.length, firstTimeRight: rows.length - missed.length, missed });
    }
    setChecked(true);
    window.scrollTo(0, 0);
  };

  const retry = () => {
    setValues(blank());
    setChecked(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="session">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
        <div className="session-title">{group}</div>
      </header>

      <main className="session-body table-body">
        {checked ? (
          <div className={`table-result ${rightCount === rows.length ? 'good' : 'retry'}`} role="status">
            {rightCount === rows.length && <Confetti />}
            <strong>{rightCount} of {rows.length} rows right</strong>
            <span>{rightCount === rows.length ? 'A perfect table!' : 'The answers are shown below. Have another go from memory.'}</span>
            {dayDone && <span><strong>🎉 Today's preparation is finished!</strong></span>}
          </div>
        ) : (
          <p className="muted">Fill in every box from memory, then check the whole table.</p>
        )}

        {rows.map((r) => (
          <section key={r.id} className={`card table-row${checked ? (rowRight(r) ? ' row-right' : ' row-wrong') : ''}`}>
            <h2>{r.rowHeader}</h2>
            <FillRows rows={tableRows(r)} values={values[r.id]} locked={checked}
              onChange={(i, v) => setValues((cur) => ({ ...cur, [r.id]: cur[r.id].map((x, j) => (j === i ? v : x)) }))} />
          </section>
        ))}
      </main>

      <footer className="table-foot">
        {checked ? (
          <>
            <button type="button" className="btn ghost" onClick={retry}>Try again</button>
            {next && !dayDone
              ? <button type="button" className="btn primary" onClick={next.start}>Next task</button>
              : <button type="button" className="btn primary" onClick={onExit}>Done</button>}
          </>
        ) : (
          <button type="button" className="btn primary" disabled={filled < cells} onClick={check}>
            {filled < cells ? `${filled} of ${cells} boxes filled` : 'Check the table'}
          </button>
        )}
      </footer>
    </div>
  );
}
