import type { Item, ItemId, Pack } from '../content/types';
import { conceptOf, shortLabel } from '../content/types';
import { FIX_TARGET, type ProgressMap } from '../engine/progress';
import { Mascot } from './Mascot';

interface Props {
  pack: Pack;
  progress: ProgressMap;
  ids: ItemId[];
  items: Map<ItemId, Item>;
  onStart: () => void;
}

export function Mistakes({ progress, ids, items, onStart }: Props) {
  return (
    <>
      <header className="page-head">
        <h1>Fix My Mistakes</h1>
        <p>Only the questions you missed. Each one leaves this list as soon as you get it right.</p>
      </header>

      {ids.length === 0 ? (
        <section className="card empty">
          <Mascot mood="happy" size={110} />
          <h2>Nothing to fix</h2>
          <p className="muted">When you miss a question it waits here for another go. Mistakes are useful: they show what to practise.</p>
        </section>
      ) : (
        <>
          <button type="button" className="btn primary big" onClick={onStart}>
            Fix {ids.length} question{ids.length === 1 ? '' : 's'}
          </button>
          <section className="card">
            <ul className="fix-list">
              {ids.map((id) => {
                const it = items.get(id)!;
                const done = progress[conceptOf(it)]?.fix ?? 0;
                return (
                  <li key={id}>
                    <span>{shortLabel(it)}</span>
                    <span className="dots" aria-label={`Right ${done} of ${FIX_TARGET} times`}>
                      {Array.from({ length: FIX_TARGET }, (_, i) => <i key={i} className={i < done ? 'on' : ''} />)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
