// Argument Builder: one Criterion D question, four boxes, then her own checklist and an example answer.
// The example is shown only after she has written her own answer.
import { useEffect, useRef, useState } from 'react';
import type { ArgumentItem } from '../content/types';
import { ARGUMENT_CHECKLIST } from '../content/types';
import { ArgumentBoxes, ArgumentText, Checklist, boxesComplete, emptyBoxes, emptyTicks } from './ArgumentBoxes';
import { Confetti } from './Confetti';
import { Mascot } from './Mascot';
import { useStudyClock } from './useStudyClock';

interface Props {
  item: ArgumentItem;
  /** Unfinished writing from last time, if any. */
  draft?: string[];
  onDraft: (boxes: string[]) => void;
  onDone: (boxes: string[], ticks: boolean[]) => void;
  onTime: (seconds: number) => void;
  onExit: () => void;
  next?: { title: string; start: () => void };
  dayDone?: boolean;
}

export function ArgumentScreen({ item, draft, onDraft, onDone, onTime, onExit, next, dayDone }: Props) {
  const [phase, setPhase] = useState<'write' | 'review' | 'done'>('write');
  const [boxes, setBoxes] = useState<string[]>(() => draft ?? emptyBoxes());
  const [ticks, setTicks] = useState<boolean[]>(emptyTicks);
  const { flush } = useStudyClock(onTime, phase !== 'done');

  // Save the draft a moment after she stops writing, and when she leaves.
  const latest = useRef(boxes);
  latest.current = boxes;
  const saveDraft = useRef(onDraft);
  saveDraft.current = onDraft;
  const dirty = useRef(false);
  useEffect(() => {
    if (phase !== 'write' || !dirty.current) return;
    const id = window.setTimeout(() => { saveDraft.current(latest.current); dirty.current = false; }, 800);
    return () => window.clearTimeout(id);
  }, [boxes, phase]);
  useEffect(() => () => { if (dirty.current) saveDraft.current(latest.current); }, []);

  const change = (b: string[]) => { dirty.current = true; setBoxes(b); };
  const finish = () => {
    dirty.current = false;
    flush();
    onDone(boxes, ticks);
    setPhase('done');
    window.scrollTo(0, 0);
  };
  const ticked = ticks.filter(Boolean).length;
  const missing = ARGUMENT_CHECKLIST.filter((_, i) => !ticks[i]);

  return (
    <div className="session">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
        <div className="session-title">Argument Builder</div>
      </header>

      <main className="session-body">
        {phase === 'done' ? (
          <>
            <Confetti />
            <div className="summary-card">
              <div className="summary-lola"><Mascot mood="cheer" size={120} /></div>
              <h1>Argument written!</h1>
              <p className="summary-score">You ticked <strong>{ticked}</strong> of <strong>{ARGUMENT_CHECKLIST.length}</strong></p>
            </div>
            {missing.length > 0 && (
              <section className="card">
                <h2>Next time, add</h2>
                <ul className="bullets">{missing.map((m) => <li key={m}>{m}</li>)}</ul>
              </section>
            )}
            {dayDone && (
              <section className="card tint-good day-done" role="status">
                <h2>🎉 Today's preparation is finished!</h2>
                <p>That is everything for today. Close the app and rest. See you tomorrow.</p>
              </section>
            )}
            <div className="stack-actions">
              {next && !dayDone ? (
                <>
                  <button type="button" className="btn primary big" onClick={next.start}>Next task<small>{next.title}</small></button>
                  <button type="button" className="btn ghost" onClick={onExit}>Back to today's tasks</button>
                </>
              ) : (
                <button type="button" className="btn primary" onClick={onExit}>Done</button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="prompt">
              <div className="kicker">Thinking critically</div>
              <h2>{item.prompt}</h2>
            </div>
            {phase === 'write' ? (
              <>
                <p className="muted">Fill all four boxes in your own words. Say it or type it. There is more than one good answer.</p>
                <ArgumentBoxes boxes={boxes} onChange={change} idPrefix={item.id} />
                <button type="button" className="btn primary" disabled={!boxesComplete(boxes)}
                  onClick={() => { setPhase('review'); window.scrollTo(0, 0); }}>
                  I have finished
                </button>
                {!boxesComplete(boxes) && <p className="muted small center">Write at least a few words in every box first.</p>}
              </>
            ) : (
              <>
                <ArgumentText boxes={boxes} />
                <Checklist ticks={ticks} onChange={setTicks} />
                <div className="teacher">
                  <span>One possible answer. Yours can be different and just as good.</span>
                  {item.example}
                </div>
                <button type="button" className="btn primary" onClick={finish}>Finish</button>
                <button type="button" className="text-link" onClick={() => { setPhase('write'); window.scrollTo(0, 0); }}>
                  Go back and improve my answer
                </button>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
