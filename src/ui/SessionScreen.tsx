// Runs one session: a question, the teacher's wording straight after it, then the next question.
import { useEffect, useRef, useState } from 'react';
import type { SessionSpec } from '../App';
import type { Item, ItemId, Pack } from '../content/types';
import { answerText, shortLabel } from '../content/types';
import type { ConceptProgress, Outcome } from '../engine/progress';
import { POINTS_FIXED_MISTAKE, POINTS_SESSION } from '../engine/rewards';
import { answerRun, currentId, isFinished, runFraction, startRun, summarise, type RunSummary } from '../engine/session';
import { Confetti } from './Confetti';
import { ItemView } from './ItemView';
import { Mascot } from './Mascot';

interface Props {
  spec: SessionSpec;
  pack: Pack;
  items: Map<ItemId, Item>;
  mistakeCount: number;
  onAnswer: (id: ItemId, outcome: Outcome, credit?: boolean) => { progress: ConceptProgress; fixed: boolean };
  onFinish: (summary: RunSummary) => void;
  onExit: () => void;
  onFix: () => void;
  /** The next of today's tasks, offered at the end of a guided session. */
  next?: { title: string; start: () => void };
  /** True once every task of the day is done. */
  dayDone: boolean;
}

export function SessionScreen({ spec, items, mistakeCount, onAnswer, onFinish, onExit, onFix, next: nextTask, dayDone }: Props) {
  const [run, setRun] = useState(() => startRun(spec.ids));
  const [result, setResult] = useState<{ outcome: Outcome; askAgain: boolean } | null>(null);
  const [fixed, setFixed] = useState(0);
  const reported = useRef(false);
  const finished = isFinished(run);

  useEffect(() => {
    if (finished && !reported.current && spec.ids.length > 0) {
      reported.current = true;
      onFinish(summarise(run));
    }
  }, [finished, run, spec.ids.length, onFinish]);

  if (finished) {
    return (
      <Summary spec={spec} summary={summarise(run)} items={items} fixed={fixed}
        mistakeCount={mistakeCount} onExit={onExit} onFix={onFix} next={nextTask} dayDone={dayDone} />
    );
  }

  const id = currentId(run)!;
  const item = items.get(id)!;
  const again = (run.asks[id] ?? 0) > 0;

  const handleResult = (outcome: Outcome) => {
    // A repeat straight after a miss earns no credit, except in Fix My Mistakes, where the repeats are the point.
    const saved = onAnswer(id, outcome, !again || spec.kind === 'fix');
    if (saved.fixed) setFixed((n) => n + 1);
    // A miss comes back later in this session. In Fix My Mistakes a right answer comes back too, until it is right twice.
    const askAgain = outcome !== 'right' || (spec.kind === 'fix' && saved.progress.fix !== undefined);
    if (item.type === 'term') {
      // Flashcards have already shown the teacher's definition, so move straight on.
      setRun((r) => answerRun(r, outcome, askAgain));
      window.scrollTo(0, 0);
    } else {
      setResult({ outcome, askAgain });
    }
  };

  const next = () => {
    if (!result) return;
    setRun((r) => answerRun(r, result.outcome, result.askAgain));
    setResult(null);
    window.scrollTo(0, 0);
  };

  const right = result?.outcome === 'right';
  const showAnswer = result && !right && (item.type === 'choice' || item.type === 'pair' || item.type === 'order');

  return (
    <div className="session">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={Math.round(runFraction(run) * 100)} aria-label="Progress through this session">
          <div className="bar-fill" style={{ width: `${runFraction(run) * 100}%` }} />
        </div>
        <span className="count">{Math.min(run.index + 1, run.queue.length)}/{run.queue.length}</span>
      </header>

      <main className="session-body">
        {again && !result && <div className="again-tag">Back again. You've got this.</div>}
        <ItemView key={`${id}:${run.index}`} item={item} locked={result !== null} onResult={handleResult} />
      </main>

      {result && (
        <footer className={`feedback ${right ? 'good' : 'retry'}`} role="status">
          <h2 className="feedback-head">{right ? '✓ Correct!' : 'Not quite. This one will come back.'}</h2>
          {showAnswer && <div className="feedback-answer"><span>Answer</span>{answerText(item)}</div>}
          {item.explain && <p className="feedback-explain">{item.explain}</p>}
          <button type="button" className="btn primary" onClick={next} autoFocus>Continue</button>
        </footer>
      )}
    </div>
  );
}

function Summary({ spec, summary, items, fixed, mistakeCount, onExit, onFix, next, dayDone }: {
  spec: SessionSpec; summary: RunSummary; items: Map<ItemId, Item>; fixed: number; mistakeCount: number;
  onExit: () => void; onFix: () => void; next?: { title: string; start: () => void }; dayDone: boolean;
}) {
  const points = POINTS_SESSION + fixed * POINTS_FIXED_MISTAKE;
  const allRight = summary.missed.length === 0;
  return (
    <div className="summary">
      <Confetti />
      <div className="summary-card">
        <div className="summary-lola"><Mascot mood={allRight || (spec.guided && dayDone) ? 'cheer' : 'happy'} size={132} /></div>
        <h1>{spec.kind === 'fix' ? 'Good fixing!' : spec.guided ? 'Task done!' : 'Round done!'}</h1>
        <p className="summary-score">
          <strong>{summary.firstTimeRight}</strong> of <strong>{summary.asked}</strong> right first time
        </p>
        <p className="summary-points">+{points} points{fixed > 0 ? ` · ${fixed} mistake${fixed === 1 ? '' : 's'} fixed` : ''}</p>
      </div>

      {spec.guided && dayDone && (
        <section className="card tint-good day-done" role="status">
          <h2>🎉 Today's preparation is finished!</h2>
          <p>That is everything for today. Close the app and rest. See you tomorrow.</p>
        </section>
      )}

      {summary.missed.length > 0 && (
        <section className="card">
          <h2>These will come back</h2>
          <p className="muted">Mistakes are how you find out what to practise. Nothing is lost.</p>
          <ul className="missed">
            {summary.missed.map((id) => {
              const it = items.get(id)!;
              return (
                <li key={id}>
                  <div className="missed-q">{shortLabel(it)}</div>
                  <div className="missed-a">{answerText(it)}</div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="summary-actions">
        {spec.guided ? (
          dayDone || !next ? (
            <button type="button" className="btn primary" onClick={onExit}>Done</button>
          ) : (
            <>
              <button type="button" className="btn primary big" onClick={next.start}>
                Next task
                <small>{next.title}</small>
              </button>
              <button type="button" className="btn ghost" onClick={onExit}>Back to today's tasks</button>
            </>
          )
        ) : (
          <>
            {spec.kind !== 'fix' && mistakeCount > 0 && (
              <button type="button" className="btn primary" onClick={onFix}>Fix my mistakes ({mistakeCount})</button>
            )}
            {spec.again && (
              <button type="button" className={`btn ${spec.kind !== 'fix' && mistakeCount > 0 ? 'ghost' : 'primary'}`} onClick={spec.again}>
                Another round
              </button>
            )}
            <button type="button" className="btn ghost" onClick={onExit}>Done</button>
          </>
        )}
      </div>
    </div>
  );
}
