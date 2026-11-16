// The mock exam: like the real test. No help and no answers until she hands in;
// then she marks it against the teacher's wording, and it ends with "what to fix".
// She writes or says every answer (Jenia asked for the microphone here too, 17 Nov); nothing is read aloud.
import { useEffect, useRef, useState } from 'react';
import { useLeftApp } from './useLeftApp';
import type { Item, ItemId, MockExam, Pack, ShortItem } from '../content/types';
import { ARGUMENT_BOXES, ARGUMENT_CHECKLIST, examplesFor, simpleWords } from '../content/types';
import { formatDuration } from '../engine/time';
import { mockScore, whatToFix, type MockAnswerA, type MockAnswerB, type MockResult } from '../engine/writing';
import { ArgumentBoxes, ArgumentText, Checklist, emptyTicks } from './ArgumentBoxes';
import { Confetti } from './Confetti';
import { DictationBox } from './Dictation';
import { IdeaVerdict } from './IdeaVerdict';
import { Mascot } from './Mascot';
import { clockText, useStudyClock } from './useStudyClock';

interface Props {
  mock: MockExam;
  pack: Pack;
  items: Map<ItemId, Item>;
  /** Unfinished answers from last time, if any. */
  draft?: string[];
  onDraft: (answers: string[]) => void;
  /** Called once, when marking is finished. `seconds` is the time spent writing. */
  onDone: (partA: MockAnswerA[], partB: MockAnswerB[], seconds: number) => MockResult;
  onTime: (seconds: number) => void;
  onExit: () => void;
  /** Called when she leaves the app while writing the paper. */
  onLeft?: () => void;
  next?: { title: string; start: () => void };
  dayDone?: boolean;
}

type Phase = 'intro' | 'exam' | 'marking' | 'result';
const PER_B = ARGUMENT_BOXES.length;

export function MockScreen({ mock, pack, items, draft, onDraft, onDone, onTime, onExit, onLeft, next, dayDone }: Props) {
  const partA = mock.partA.map((id) => items.get(id)).filter((it): it is ShortItem => it?.type === 'short');
  const partB = mock.partB.map((id) => pack.arguments?.find((a) => a.id === id)).filter((a) => a !== undefined);
  const total = partA.length + partB.length;
  const blank = () => Array.from({ length: partA.length + partB.length * PER_B }, () => '');

  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<string[]>(() => (draft && draft.length === blank().length ? draft : blank()));
  const [page, setPage] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [ticksA, setTicksA] = useState<boolean[][]>(() => partA.map((q) => q.ideas.map(() => false)));
  const [ticksB, setTicksB] = useState<boolean[][]>(() => partB.map(() => emptyTicks()));
  const [result, setResult] = useState<MockResult | null>(null);
  // Leaving the app while writing the paper is counted for the parent view. It changes nothing in the paper.
  useLeftApp(phase === 'exam', () => onLeft?.());
  const writingSeconds = useRef(0);
  const clock = useStudyClock(onTime, phase === 'exam' || phase === 'marking');

  // Save the draft a moment after she stops writing, and when she leaves.
  const latest = useRef(answers);
  latest.current = answers;
  const saveDraft = useRef(onDraft);
  saveDraft.current = onDraft;
  const dirty = useRef(false);
  useEffect(() => {
    if (phase !== 'exam' || !dirty.current) return;
    const id = window.setTimeout(() => { saveDraft.current(latest.current); dirty.current = false; }, 800);
    return () => window.clearTimeout(id);
  }, [answers, phase]);
  useEffect(() => () => { if (dirty.current) saveDraft.current(latest.current); }, []);

  const setAnswer = (i: number, text: string) => {
    dirty.current = true;
    setAnswers((cur) => cur.map((a, j) => (j === i ? text : a)));
  };
  const boxesOf = (b: number) => answers.slice(partA.length + b * PER_B, partA.length + (b + 1) * PER_B);
  const isBlank = (q: number) => (q < partA.length ? !answers[q].trim() : boxesOf(q - partA.length).every((x) => !x.trim()));
  const blanks = Array.from({ length: total }, (_, q) => q).filter(isBlank).length;
  const go = (p: number) => { setPage(p); setConfirming(false); window.scrollTo(0, 0); };

  const handIn = () => {
    writingSeconds.current = clock.total();
    dirty.current = false;
    setPhase('marking');
    go(0);
  };

  const finishMarking = (a: boolean[][], b: boolean[][]) => {
    clock.flush();
    const r = onDone(
      partA.map((q, i) => ({ id: q.id, text: answers[i], ticks: a[i] })),
      partB.map((q, i) => ({ id: q.id, boxes: boxesOf(i), ticks: b[i] })),
      writingSeconds.current,
    );
    setResult(r);
    setPhase('result');
    window.scrollTo(0, 0);
  };

  const isA = page < partA.length;
  const kicker = isA
    ? `Part A · Question ${page + 1} of ${partA.length}`
    : `Part B · Question ${page - partA.length + 1} of ${partB.length}`;
  const over = clock.seconds > mock.minutes * 60;

  return (
    <div className="session">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
        <div className="session-title">{mock.title}</div>
        {phase === 'exam' && (
          <span className={over ? 'exam-clock over' : 'exam-clock'} aria-label="Time used">
            {clockText(clock.seconds)} <small>/ {mock.minutes}:00</small>
          </span>
        )}
      </header>

      <main className="session-body mock">
        {phase === 'intro' && (
          <>
            <div className="hero">
              <Mascot mood="think" size={96} />
              <div className="bubble">This is a practice for the real test. Do it the way you will do the real one.</div>
            </div>
            <section className="card">
              <h2>How it works</h2>
              <ul className="bullets">
                <li><strong>Part A:</strong> {partA.length} questions on knowing and understanding. Answer in full sentences.</li>
                <li><strong>Part B:</strong> {partB.length} questions on thinking critically. Build an argument in four boxes.</li>
                <li>Write your answers in full sentences, or say them with the microphone and fix the words. In the real test you will write.</li>
                <li>Notes closed. No help and no answers until you hand in.</li>
                <li>About {mock.minutes} minutes. The clock is only a guide: nobody stops you.</li>
                <li>At the end you mark it yourself, and it shows you what to fix.</li>
              </ul>
            </section>
            {draft && draft.some((x) => x.trim()) && <p className="muted">Your answers from last time are still here.</p>}
            <button type="button" className="btn primary big" onClick={() => { setPhase('exam'); go(0); }}>Start the exam</button>
          </>
        )}

        {phase === 'exam' && (
          <>
            <div className="prompt">
              <div className="kicker">{kicker}</div>
              <h2>{isA ? partA[page].prompt : partB[page - partA.length].prompt}</h2>
            </div>
            {isA ? (
              <DictationBox value={answers[page]} onChange={(t) => setAnswer(page, t)} rows={6} label="Your answer"
                placeholder="Write your answer in full sentences." />
            ) : (
              <ArgumentBoxes idPrefix={`mock-${page}`} boxes={boxesOf(page - partA.length)}
                onChange={(b) => b.forEach((text, k) => setAnswer(partA.length + (page - partA.length) * PER_B + k, text))} />
            )}
            {over && <p className="muted small">You are past the suggested time. That is fine: finish your answer.</p>}
            {confirming && (
              <section className="card tint-accent" role="alertdialog" aria-label="Hand in">
                <h2>{blanks > 0 ? `${blanks} answer${blanks === 1 ? ' is' : 's are'} still empty. Hand in anyway?` : 'Hand in your exam?'}</h2>
                <p>After this you cannot change your answers.</p>
                <div className="row-actions">
                  <button type="button" className="btn ghost" onClick={() => setConfirming(false)}>Keep writing</button>
                  <button type="button" className="btn primary" onClick={handIn}>Hand in</button>
                </div>
              </section>
            )}
            <div className="row-actions">
              <button type="button" className="btn ghost" disabled={page === 0} onClick={() => go(page - 1)}>Back</button>
              {page < total - 1
                ? <button type="button" className="btn primary" onClick={() => go(page + 1)}>Next question</button>
                : <button type="button" className="btn primary" onClick={() => setConfirming(true)}>Hand in</button>}
            </div>
          </>
        )}

        {phase === 'marking' && (
          <>
            <div className="prompt">
              <div className="kicker">Marking · {kicker}</div>
              <h2>{isA ? partA[page].prompt : partB[page - partA.length].prompt}</h2>
            </div>
            {isA ? (
              <>
                <div className="yours"><span>Your answer</span>{answers[page].trim() || '(nothing written)'}</div>
                <IdeaVerdict key={page} ideas={partA[page].ideas} need={partA[page].need} text={answers[page]}
                  modelLabel="The teacher's wording" model={partA[page].model} simple={simpleWords(pack, partA[page])} examples={examplesFor(pack, partA[page])}
                  doneLabel={page < total - 1 ? 'Next answer' : 'See my result'}
                  onDone={(_outcome, ticks) => {
                    const a = ticksA.map((t, i) => (i === page ? ticks : t));
                    setTicksA(a);
                    if (page < total - 1) go(page + 1); else finishMarking(a, ticksB);
                  }} />
              </>
            ) : (
              <>
                <ArgumentText boxes={boxesOf(page - partA.length)} />
                <Checklist ticks={ticksB[page - partA.length]}
                  onChange={(t) => setTicksB((cur) => cur.map((x, i) => (i === page - partA.length ? t : x)))} />
                <div className="teacher">
                  <span>One possible answer. Yours can be different and just as good.</span>
                  {partB[page - partA.length].example}
                </div>
                <button type="button" className="btn primary"
                  onClick={() => (page < total - 1 ? go(page + 1) : finishMarking(ticksA, ticksB))}>
                  {page < total - 1 ? 'Next answer' : 'See my result'}
                </button>
              </>
            )}
          </>
        )}

        {phase === 'result' && result && <MockResultView mock={mock} pack={pack} items={items} result={result}
          next={next} dayDone={dayDone} onExit={onExit} />}
      </main>
    </div>
  );
}

function MockResultView({ mock, pack, items, result, next, dayDone, onExit }: {
  mock: MockExam; pack: Pack; items: Map<ItemId, Item>; result: MockResult;
  next?: { title: string; start: () => void }; dayDone?: boolean; onExit: () => void;
}) {
  const score = mockScore(result, items);
  const fixes = whatToFix(result, mock, pack, items);
  return (
    <>
      <Confetti />
      <div className="summary-card">
        <div className="summary-lola"><Mascot mood="cheer" size={120} /></div>
        <h1>Mock exam done!</h1>
        <p className="summary-points">Time writing: {formatDuration(result.seconds)}</p>
      </div>
      <section className="card">
        <ul className="facts">
          <li><span>Part A: answers with the key ideas</span><strong>{score.partARight} of {score.partATotal}</strong></li>
          <li><span>Part B: checklist points</span><strong>{score.partBTicks} of {score.partBTotal}</strong></li>
        </ul>
        <p className="muted small">This is your own marking against {ARGUMENT_CHECKLIST.length} checklist points and the teacher's wording. It is practice, not a grade.</p>
      </section>
      {fixes.length > 0 ? (
        <section className="card">
          <h2>What to fix</h2>
          <p className="muted">Finding these now is the whole point of a mock exam. The Part A ones are waiting in Fix My Mistakes.</p>
          <ul className="missed">
            {fixes.map((f) => (
              <li key={f.question}>
                <div className="missed-q">{f.question}</div>
                <div className="missed-a">{f.missing.join('\n')}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="card tint-good"><h2>Nothing to fix. A full paper!</h2></section>
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
  );
}
