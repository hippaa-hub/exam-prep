// The app's check of a spoken or written answer: which key ideas it found, which are missing,
// and then the teacher's wording. The app gives the verdict; because speech recognition can mishear,
// Adele can correct it with "The app missed something I said".
import { useMemo, useState } from 'react';
import type { Idea } from '../content/types';
import { checkIdeas, closeness, outcomeOfTicks, VERDICT_WORDS } from '../engine/check';
import type { Outcome } from '../engine/progress';
import { SimpleBox } from './SimpleBox';

interface Props {
  ideas: Idea[];
  /** How many ideas a full answer needs (all of them if left out). */
  need?: number;
  /** What she said or wrote. */
  text: string;
  modelLabel: string;
  model: string;
  /** The same thing in simple words, shown under the teacher's wording. */
  simple?: string;
  /** A few short examples, shown with the simple words. */
  examples?: string[];
  onDone: (outcome: Outcome, ticks: boolean[]) => void;
  /** The label on the button ("Continue" unless said otherwise). */
  doneLabel?: string;
  disabled?: boolean;
}

export function IdeaVerdict({ ideas, need, text, modelLabel, model, simple, examples, onDone, doneLabel = 'Continue', disabled = false }: Props) {
  const check = useMemo(() => checkIdeas(text, ideas), [text, ideas]);
  const [ticks, setTicks] = useState(check.found);
  const [editing, setEditing] = useState(false);
  const outcome = outcomeOfTicks({ ideas, need }, ticks);
  const close = closeness({ ideas, need }, ticks);
  const detail = outcome === 'right'
    ? 'You had the key ideas.'
    : `You had ${close.have} of the ${close.need} key ideas.${outcome === 'wrong' ? ' This one will come back.' : ''}`;

  return (
    <div className="verdict-wrap">
      <section className={`verdict ${outcome === 'right' ? 'good' : 'retry'}`} role="status">
        <h3 className="verdict-word">{outcome === 'right' ? '✓ ' : ''}{VERDICT_WORDS[outcome]}</h3>
        <p className="verdict-detail">{detail}</p>
        <div className="closeness" role="img" aria-label={`${close.have} of ${close.need} key ideas`}>
          {Array.from({ length: close.need }, (_, i) => <i key={i} className={i < close.have ? 'on' : ''} />)}
        </div>
        {need !== undefined && need < ideas.length && <p className="small">This question needs any {need} of these.</p>}
        <ul className="idea-list">
          {ideas.map((it, i) => (
            <li key={it.label} className={ticks[i] ? 'idea-had' : 'idea-missing'}>
              {editing ? (
                <label>
                  <input type="checkbox" checked={ticks[i]}
                    onChange={(e) => setTicks((cur) => cur.map((t, j) => (j === i ? e.target.checked : t)))} />
                  <span>{it.label}</span>
                </label>
              ) : (
                <>
                  <span className="idea-mark" aria-hidden="true">{ticks[i] ? '✓' : '○'}</span>
                  <span><span className="sr-only">{ticks[i] ? 'You had: ' : 'Missing: '}</span>{it.label}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        {check.spelling.length > 0 && (
          <p className="small spelling">
            Spelling: {check.spelling.map((s) => `${s.typed} → ${s.correct}`).join(', ')}
          </p>
        )}
      </section>

      <div className="teacher"><span>{modelLabel}</span>{model}</div>
      <SimpleBox simple={simple} examples={examples} />

      <button type="button" className="btn primary" disabled={disabled} onClick={() => onDone(outcome, ticks)}>{doneLabel}</button>
      {!editing && (
        <button type="button" className="text-link" onClick={() => setEditing(true)}>The app missed something I said</button>
      )}
      {editing && <p className="muted small center">Tick the ideas you really said, then press {doneLabel}.</p>}
    </div>
  );
}
