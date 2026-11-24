// Runs one session: a question, the teacher's wording straight after it, then the next question.
import { useEffect, useRef, useState } from 'react';
import type { SessionSpec } from '../App';
import type { Item, ItemId, Pack } from '../content/types';
import { answerText, examplesFor, shortLabel, simpleWords } from '../content/types';
import { explainChoice } from '../engine/explain';
import type { ConceptProgress, Outcome } from '../engine/progress';
import { POINTS_FIXED_MISTAKE, POINTS_SESSION } from '../engine/rewards';
import { play } from './sound';
import { useLeftApp } from './useLeftApp';
import { answerRun, currentId, isFinished, originOf, runFraction, startRun, summarise, type RunSummary } from '../engine/session';
import { freshVariant } from '../engine/progress';
import { pretty } from '../engine/algebra';
import { ShowMeHow } from './ShowMeHow';
import { Confetti } from './Confetti';
import { ItemView } from './ItemView';
import { Mascot } from './Mascot';

interface Props {
  spec: SessionSpec;
  pack: Pack;
  items: Map<ItemId, Item>;
  mistakeCount: number;
  /** `firstLook`: she said "I don't know yet"; if the thing is new to her, that is not counted as a mistake. */
  onAnswer: (id: ItemId, outcome: Outcome, credit?: boolean, firstLook?: boolean, helped?: boolean) => { progress: ConceptProgress; fixed: boolean };
  /** True if she has never met the thing this question is about. */
  isNew: (id: ItemId) => boolean;
  onFinish: (summary: RunSummary) => void;
  onExit: () => void;
  onFix: () => void;
  /** Called each time she leaves the app while a question is waiting for her answer. */
  onLeft?: () => void;
  /** The next of today's tasks, offered at the end of a guided session. */
  next?: { title: string; start: () => void };
  /** True once every task of the day is done. */
  dayDone: boolean;
  /** True on the day of the exam: the end of the warm-up wishes her luck. */
  examDay?: boolean;
}

export function SessionScreen({ spec, pack, items, mistakeCount, isNew, onAnswer, onFinish, onExit, onFix, onLeft, next: nextTask, dayDone, examDay = false }: Props) {
  const [run, setRun] = useState(() => startRun(spec.ids));
  const [result, setResult] = useState<{ outcome: Outcome; askAgain: boolean; chosen?: string; replacement?: ItemId } | null>(null);
  const [fixed, setFixed] = useState(0);
  const reported = useRef(false);
  const finished = isFinished(run);
  // The questions during which she left the app. An answer after that is practice: it earns no level.
  const [leftOn, setLeftOn] = useState<ReadonlySet<ItemId>>(new Set());
  /** True once she has given her answer to the question on screen. */
  const [committed, setCommitted] = useState(false);
  /** How many steps of "Show me how" she has opened on the question on screen (0 = none). */
  const [helpSteps, setHelpSteps] = useState(0);
  const waitingId = finished || result !== null || committed ? undefined : currentId(run);
  useLeftApp(waitingId !== undefined, () => {
    if (waitingId === undefined || leftOn.has(waitingId)) return;
    setLeftOn((prev) => new Set(prev).add(waitingId));
    onLeft?.();
  });

  useEffect(() => {
    if (finished && !reported.current && spec.ids.length > 0) {
      reported.current = true;
      onFinish(summarise(run));
    }
  }, [finished, run, spec.ids.length, onFinish]);

  if (finished) {
    return (
      <Summary spec={spec} summary={summarise(run)} items={items} fixed={fixed}
        mistakeCount={mistakeCount} onExit={onExit} onFix={onFix} next={nextTask} dayDone={dayDone} examDay={examDay} />
    );
  }

  const id = currentId(run)!;
  const item = items.get(id)!;
  const again = (run.asks[originOf(run, id)] ?? 0) > 0;

  // Is this thing new to her? Then "I don't know yet" is a first look, not a mistake.
  const fresh = isNew(id) && !again;

  const handleResult = (outcome: Outcome, chosen?: string, dontKnow?: boolean) => {
    // A repeat straight after a miss earns no credit, except in Fix My Mistakes, where the repeats are the point.
    const saved = onAnswer(id, outcome, (!again || spec.kind === 'fix') && !leftOn.has(id), dontKnow === true, helpSteps > 0);
    if (saved.fixed) setFixed((n) => n + 1);
    // A miss comes back later in this session. In Fix My Mistakes a right answer is enough: it leaves the list (FIX_TARGET).
    let askAgain = outcome !== 'right' || (spec.kind === 'fix' && saved.progress.fix !== undefined);
    // A written answer takes a while, so it is repeated at most once, and only after a real miss.
    if (item.type === 'short' && spec.kind !== 'fix') askAgain = outcome === 'wrong' && !again;
    // In a maths pack a miss comes back as the same idea with different numbers, not the same question.
    const replacement = askAgain && pack.freshNumbers
      ? freshVariant([...items.values()], item, [], new Set(run.queue)).id
      : undefined;
    if (item.type === 'term' || item.type === 'short') {
      // These have already shown the teacher's wording, so move straight on.
      setRun((r) => answerRun(r, outcome, askAgain, replacement));
      setCommitted(false);
      setHelpSteps(0);
      window.scrollTo(0, 0);
    } else {
      play(outcome);
      setResult({ outcome, askAgain, chosen, replacement });
    }
  };

  const next = () => {
    if (!result) return;
    setRun((r) => answerRun(r, result.outcome, result.askAgain, result.replacement));
    setResult(null);
    setCommitted(false);
    setHelpSteps(0);
    window.scrollTo(0, 0);
  };

  const right = result?.outcome === 'right';
  // For tap-an-answer questions: why the right answer is right, and why her choice was not.
  const why = result && (item.type === 'choice' || item.type === 'pair') ? explainChoice(pack, item, result.chosen) : null;
  const showAnswer = result && !right && item.type === 'order';
  const simple = simpleWords(pack, item);
  const examples = examplesFor(pack, item);
  const exampleLine = examples && examples.length > 0 && (
    <p className="example-line"><em>{examples.length === 1 ? 'Example: ' : 'Examples: '}</em>{examples.join(' · ')}</p>
  );

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
        {again && !result && !run.stand?.[id] && <div className="again-tag">Back again. You've got this.</div>}
        {leftOn.has(id) && !result && (
          <div className="left-note" role="status">
            You left the app during this question, so it will not count this time. Answer it anyway: it will come back later.
          </div>
        )}
        {again && !result && run.stand?.[id] && <div className="again-tag">Same idea, new numbers. You've got this.</div>}
        {item.how && item.how.length > 0 && !result && (
          <ShowMeHow steps={item.type === 'expression' ? item.how.slice(0, -1) : item.how} shown={helpSteps} onMore={() => setHelpSteps((n) => n + 1)} />
        )}
        <ItemView key={`${id}:${run.index}`} item={item} locked={result !== null} onResult={handleResult} onCommit={() => setCommitted(true)} simple={simple} examples={examples} fresh={fresh} />
      </main>

      {result && (
        <footer className={`feedback ${right ? 'good' : 'retry'}`} role="status">
          <h2 className="feedback-head">{right ? '✓ Correct!' : 'Not quite. This one will come back.'}</h2>
          {showAnswer && <div className="feedback-answer"><span>Answer</span>{answerText(item)}</div>}
          {item.type === 'expression' && (
            <div className="why-list">
              {!right && result.chosen && <div className="why not"><span>What happened?</span><p>{result.chosen}</p></div>}
              {right && result.chosen && <p>{result.chosen}</p>}
              {!right && <div className="feedback-answer"><span>Answer</span>{pretty(item.answer)}</div>}
              {item.how && (
                <div className="why yes">
                  <span>{right ? 'The working, step by step' : 'How to get it'}</span>
                  <ol className="working">{item.how.map((h) => <li key={h}>{h}</li>)}</ol>
                </div>
              )}
              {right && helpSteps > 0 && <p className="muted">You used "Show me how": next time, try it on your own first.</p>}
            </div>
          )}
          {item.type === 'expression' ? null : why ? (
            <div className="why-list">
              {why.chosen && (
                <div className="why not">
                  <span>Why not "{why.chosen}"?</span>
                  <p>{why.whyNot}</p>
                </div>
              )}
              <div className="why yes">
                <span>{right ? 'Why is that right?' : `Why "${why.correct}"?`}</span>
                {simple && <p>{simple}</p>}
                {exampleLine}
                {why.whyRight && (
                  <p className={simple ? 'teacher-words' : undefined}>
                    {simple && <em>Your teacher's words: </em>}{why.whyRight}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="why-list">
              {simple && <div className="why yes"><span>In simple words</span><p>{simple}</p>{exampleLine}</div>}
              {item.explain && <p className="feedback-explain">{simple && <em>Your teacher's words: </em>}{item.explain}</p>}
            </div>
          )}
          <button type="button" className="btn primary" onClick={next} autoFocus>Continue</button>
        </footer>
      )}
    </div>
  );
}

function Summary({ spec, summary, items, fixed, mistakeCount, onExit, onFix, next, dayDone, examDay }: {
  spec: SessionSpec; summary: RunSummary; items: Map<ItemId, Item>; fixed: number; mistakeCount: number;
  onExit: () => void; onFix: () => void; next?: { title: string; start: () => void }; dayDone: boolean; examDay: boolean;
}) {
  const points = POINTS_SESSION + fixed * POINTS_FIXED_MISTAKE;
  const allRight = summary.missed.length === 0;
  // A little fanfare when the round is finished.
  useEffect(() => play('done'), []);
  return (
    <div className="summary">
      <Confetti />
      <div className="summary-card">
        <div className="summary-lola"><Mascot mood={allRight || (spec.guided && dayDone) ? 'cheer' : 'happy'} size={132} /></div>
        <h1>{examDay && spec.guided ? 'You are ready!' : spec.kind === 'fix' ? 'Good fixing!' : spec.guided ? 'Task done!' : 'Round done!'}</h1>
        <p className="summary-score">
          <strong>{summary.firstTimeRight}</strong> of <strong>{summary.asked}</strong> right first time
        </p>
        <p className="summary-points">+{points} points{fixed > 0 ? ` · ${fixed} mistake${fixed === 1 ? '' : 's'} fixed` : ''}</p>
      </div>

      {spec.guided && dayDone && (
        <section className="card tint-good day-done" role="status">
          <h2>{examDay ? '🍀 Good luck in your exam!' : "🎉 Today's preparation is finished!"}</h2>
          <p>{examDay
            ? 'Warm-up done. You have practised this for days. Read each question twice, write in full sentences, and show what you know.'
            : 'That is everything for today. Close the app and rest. See you tomorrow.'}</p>
        </section>
      )}

      {summary.missed.length > 0 && (
        <section className="card">
          <h2>{examDay ? 'Read these once more' : 'These will come back'}</h2>
          <p className="muted">{examDay
            ? 'A miss takes nothing away today. Read the answer once more, then go.'
            : 'Mistakes are how you find out what to practise. Nothing is lost.'}</p>
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
