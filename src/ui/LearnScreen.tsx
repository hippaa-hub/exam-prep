// A lesson: Learn cards that teach a topic before any questions. Each card reveals the teacher's worked example
// one step at a time, with a "why" for every step, then a quick "why?" tap, then a faded example where she
// does the last step herself. Nothing here is marked: it is teaching, not testing.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Lesson, LearnCard } from '../content/types';
import { pretty } from '../engine/algebra';
import { judgeExpression } from '../engine/judge';
import { Confetti } from './Confetti';
import { Mascot } from './Mascot';
import { MathsKeypad, lettersFor } from './MathsKeypad';
import { play } from './sound';

interface Props {
  lesson: Lesson;
  /** The card to start on (she can close the lesson half-way and come back to the same card). */
  startAt: number;
  onProgress: (cardIndex: number) => void;
  /** `tapsRight`: how many "why?" taps she got right first time. */
  onDone: (tapsRight: number) => void;
  onExit: () => void;
  /** The next of today's tasks, offered at the end. */
  next?: { title: string; start: () => void };
}

export function LearnScreen({ lesson, startAt, onProgress, onDone, onExit, next }: Props) {
  const [index, setIndex] = useState(Math.min(startAt, lesson.cards.length - 1));
  const [tapsRight, setTapsRight] = useState(0);
  const [finished, setFinished] = useState(false);
  const card = lesson.cards[index];

  const nextCard = () => {
    if (index + 1 >= lesson.cards.length) {
      setFinished(true);
      onDone(tapsRight);
      return;
    }
    setIndex(index + 1);
    onProgress(index + 1);
    window.scrollTo(0, 0);
  };

  if (finished) return <LessonDone lesson={lesson} onExit={onExit} next={next} />;

  return (
    <div className="session learn">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close the lesson (it remembers where you were)">✕</button>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={lesson.cards.length} aria-valuenow={index}
          aria-label="Progress through the lesson">
          <div className="bar-fill" style={{ width: `${(index / lesson.cards.length) * 100}%` }} />
        </div>
        <span className="count">{index + 1}/{lesson.cards.length}</span>
      </header>
      <main className="session-body">
        <CardView key={card.id} card={card} last={index + 1 === lesson.cards.length}
          onTapRight={() => setTapsRight((n) => n + 1)} onNext={nextCard} />
      </main>
    </div>
  );
}

type Stage = 'steps' | 'tap' | 'faded' | 'remember';

function CardView({ card, last, onTapRight, onNext }: { card: LearnCard; last: boolean; onTapRight: () => void; onNext: () => void }) {
  const [shown, setShown] = useState(card.steps.length > 0 ? 1 : 0);
  const [stage, setStage] = useState<Stage>('steps');
  const allShown = shown >= card.steps.length;
  // Keep what just appeared on screen: the newest step, or the question that opens after the steps.
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (stage === 'faded') return; // the faded example scrolls itself to its top
    if (shown > 1 || stage !== 'steps') bottom.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
  }, [shown, stage]);
  const afterSteps = (): Stage => (card.tap ? 'tap' : card.faded ? 'faded' : 'remember');

  return (
    <div className="learn-card">
      <div className="kicker">Learn</div>
      <h2 className="learn-title"><span className="learn-emoji" aria-hidden="true">{card.emoji}</span> {card.title}</h2>
      <p className="learn-intro">{card.intro}</p>

      <ol className="learn-steps">
        {card.steps.slice(0, shown).map((s, i) => (
          <li key={i} className="learn-step">
            <div className="learn-show">{s.show}</div>
            <div className="learn-why"><span>Why?</span> {s.why}</div>
          </li>
        ))}
      </ol>

      {stage === 'steps' && !allShown && (
        <button type="button" className="btn primary" onClick={() => setShown((n) => n + 1)}>
          Next step ▶ <small>{shown} of {card.steps.length}</small>
        </button>
      )}
      {stage === 'steps' && allShown && (
        <button type="button" className="btn primary" onClick={() => setStage(afterSteps())}>Got it ▶</button>
      )}

      {(stage === 'tap' || ((stage === 'faded' || stage === 'remember') && card.tap)) && card.tap && (
        <WhyTap tap={card.tap} locked={stage !== 'tap'} onRight={onTapRight}
          onDone={() => setStage(card.faded ? 'faded' : 'remember')} />
      )}

      {(stage === 'faded' || (stage === 'remember' && card.faded)) && card.faded && (
        <Faded faded={card.faded} locked={stage !== 'faded'} onDone={() => setStage('remember')} />
      )}

      {stage === 'remember' && (
        <>
          <div className="remember" role="status"><span>⭐ Remember</span>{card.remember}</div>
          <button type="button" className="btn primary big" onClick={onNext} autoFocus>
            {last ? 'Finish the lesson' : 'Next card ▶'}
          </button>
        </>
      )}
      <div ref={bottom} aria-hidden="true" />
    </div>
  );
}

/** A small "why?" question about the card. A wrong pick is fine: the reason is shown, and she moves on. */
function WhyTap({ tap, locked, onRight, onDone }: {
  tap: NonNullable<LearnCard['tap']>; locked: boolean; onRight: () => void; onDone: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    play(i === tap.answer ? 'right' : 'almost');
    if (i === tap.answer) onRight();
  };
  return (
    <section className="why-tap">
      <h3>🤔 {tap.question}</h3>
      <div className="options">
        {tap.options.map((o, i) => (
          <button key={o} type="button" disabled={picked !== null}
            className={picked === null ? 'option' : i === tap.answer ? 'option right' : i === picked ? 'option wrong' : 'option dim'}
            onClick={() => pick(i)}>{o}</button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className={picked === tap.answer ? 'tap-why good' : 'tap-why'}>
            <strong>{picked === tap.answer ? 'Yes! ' : 'Not quite. '}</strong>{tap.why}
          </p>
          {!locked && <button type="button" className="btn primary" onClick={onDone}>Continue ▶</button>}
        </>
      )}
    </section>
  );
}

/** The faded example: the first steps are done for her; she builds the last step on the keypad. */
function Faded({ faded, locked, onDone }: { faded: NonNullable<LearnCard['faded']>; locked: boolean; onDone: () => void }) {
  const [text, setText] = useState('');
  const [tries, setTries] = useState(0);
  const [state, setState] = useState<'open' | 'right' | 'shown'>('open');
  const [note, setNote] = useState<string | null>(null);
  const letters = useMemo(() => lettersFor(faded.expr, faded.answer), [faded]);
  useEffect(() => { if (state === 'right') play('right'); }, [state]);

  const check = () => {
    const v = judgeExpression({ id: 'faded', type: 'expression', prompt: '', expr: faded.expr, answer: faded.answer, kind: faded.kind ?? 'multiply' }, text);
    if (v.kind === 'unreadable' || v.kind === 'simplify') { setNote(v.say); return; }
    if (v.kind === 'right') { setState('right'); setNote(null); return; }
    const n = tries + 1;
    setTries(n);
    play('almost');
    setNote(n >= 2 ? null : `${v.say ?? 'Not yet.'} Hint: ${faded.hint}`);
    if (n >= 2) setState('shown');
  };

  const top = useRef<HTMLElement>(null);
  useEffect(() => { if (!locked) top.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }); }, [locked]);
  return (
    <section className="faded" ref={top}>
      <h3>✏️ Your turn! {faded.prompt}</h3>
      <div className="maths-big">{pretty(faded.expr)}</div>
      <ol className="learn-steps">
        {faded.given.map((s, i) => (
          <li key={i} className="learn-step">
            <div className="learn-show">{s.show}</div>
            <div className="learn-why"><span>Why?</span> {s.why}</div>
          </li>
        ))}
        <li className="learn-step blank">
          <div className="learn-show">
            {state === 'open' ? (text ? `= ${pretty(text)}` : '= ?') : `= ${pretty(faded.answer)}`}
          </div>
          <div className="learn-why"><span>Last step</span> Put it all together. You do this one.</div>
        </li>
      </ol>
      {note && <p className="maths-note" role="status">{note}</p>}
      {state === 'open' && !locked && (
        <>
          <MathsKeypad letters={letters} onKey={(k) => { setNote(null); setText((t) => t + k); }}
            onDelete={() => setText((t) => [...t].slice(0, -1).join(''))} onClear={() => setText('')} />
          <button type="button" className="btn primary" disabled={!text.trim()} onClick={check}>Check</button>
        </>
      )}
      {state === 'right' && <p className="tap-why good"><strong>🎉 Yes! </strong>That is exactly it.</p>}
      {state === 'shown' && <p className="tap-why"><strong>Here it is. </strong>{faded.hint} The questions will give you more goes.</p>}
      {state !== 'open' && !locked && <button type="button" className="btn primary" onClick={onDone}>Continue ▶</button>}
    </section>
  );
}

function LessonDone({ lesson, onExit, next }: { lesson: Lesson; onExit: () => void; next?: { title: string; start: () => void } }) {
  useEffect(() => play('done'), []);
  return (
    <div className="summary">
      <Confetti />
      <div className="summary-card">
        <div className="summary-lola"><Mascot mood="cheer" size={132} /></div>
        <h1>Lesson done!</h1>
        <p className="summary-score">{lesson.title}: {lesson.cards.length} cards</p>
        <p className="summary-points">You can open this lesson again any time from More practice.</p>
      </div>
      <div className="summary-actions">
        {next ? (
          <>
            <button type="button" className="btn primary big" onClick={next.start}>Next task<small>{next.title}</small></button>
            <button type="button" className="btn ghost" onClick={onExit}>Back to today's tasks</button>
          </>
        ) : <button type="button" className="btn primary" onClick={onExit}>Done</button>}
      </div>
    </div>
  );
}
