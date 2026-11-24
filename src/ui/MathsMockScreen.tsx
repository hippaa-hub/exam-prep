// The maths Mock Test, like the real one: 45 minutes, Criteria B and C.
// Part 1: short questions, answers typed here, working written on paper. Part 2: an investigation.
// Nothing shows right or wrong until she hands in. Then the app marks what it can, she marks the rest
// with the teacher's simplified descriptors, and it ends with "what to fix".
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Item, ItemId, MockExam } from '../content/types';
import { answerText, fmtNum } from '../content/types';
import { pretty } from '../engine/algebra';
import {
  B_LEVELS, C_CHECKS, bBand, cBand, checkInvestigation, emptyInvestigation, mathsWhatToFix,
  type InvestigationAnswers, type MathsMockResult,
} from '../engine/mathsMock';
import type { Outcome } from '../engine/progress';
import { Confetti } from './Confetti';
import { DictationBox } from './Dictation';
import { ItemView } from './ItemView';
import { Mascot } from './Mascot';
import { MathsKeypad } from './MathsKeypad';
import { NumberPad, readNumber, showNumber } from './NumberPad';
import { PatternPicture } from './PatternPicture';
import { play } from './sound';
import { useLeftApp } from './useLeftApp';
import { clockText, useStudyClock } from './useStudyClock';

type Phase = 'intro' | 'part1' | 'part2' | 'marking' | 'result';

/** Everything she has done so far, saved as a draft so closing the app loses nothing. */
interface State {
  phase: Phase;
  ids: ItemId[];
  page: number;
  outcomes: (Outcome | null)[];
  steps: boolean[];
  inv: InvestigationAnswers;
  /** Her typed text for the number boxes and the rule, as she typed it. */
  raw: Record<string, string>;
  describeTicks: boolean[];
  justifyTicks: boolean[];
  bTicks: boolean[];
  cTicks: boolean[];
}

interface Props {
  mock: MockExam;
  items: Map<ItemId, Item>;
  /** The Part 1 questions, chosen fresh for this sitting. */
  part1: ItemId[];
  draft?: string;
  onDraft: (json: string) => void;
  onDone: (result: Omit<MathsMockResult, 'date'>) => void;
  onTime: (seconds: number) => void;
  onExit: () => void;
  onLeft?: () => void;
  next?: { title: string; start: () => void };
}

export function MathsMockScreen({ mock, items, part1, draft, onDraft, onDone, onTime, onExit, onLeft, next }: Props) {
  const spec = mock.maths!;
  const inv = spec.investigation;
  const [st, setSt] = useState<State>(() => {
    try {
      const d = draft ? (JSON.parse(draft) as State) : null;
      if (d && d.phase !== 'result' && d.ids?.length) return d;
    } catch { /* a broken draft starts again */ }
    return {
      phase: 'intro', ids: part1, page: 0, outcomes: part1.map(() => null), steps: part1.map(() => false),
      inv: emptyInvestigation(inv), raw: {}, describeTicks: inv.describe.ideas.map(() => false),
      justifyTicks: inv.justify.ideas.map(() => false), bTicks: B_LEVELS.map(() => false), cTicks: C_CHECKS.map(() => false),
    };
  });
  const [result, setResult] = useState<Omit<MathsMockResult, 'date'> | null>(null);
  const writing = st.phase === 'part1' || st.phase === 'part2';
  const clock = useStudyClock(onTime, writing || st.phase === 'marking');
  const seconds = useRef(0);
  useLeftApp(writing, () => onLeft?.());

  // Save the draft whenever something changes (not after the result: the result is saved instead).
  const saveDraft = useRef(onDraft);
  saveDraft.current = onDraft;
  useEffect(() => { if (st.phase !== 'intro' && st.phase !== 'result') saveDraft.current(JSON.stringify(st)); }, [st]);

  const set = (change: Partial<State>) => setSt((cur) => ({ ...cur, ...change }));
  const top = () => window.scrollTo(0, 0);
  const total = st.ids.length;
  const over = clock.seconds > mock.minutes * 60;

  if (st.phase === 'intro') {
    return (
      <Shell title={mock.title} onExit={onExit}>
        <div className="hero"><Mascot mood="think" size={96} /><div className="bubble">This is a practice of Friday's test. Do it like the real one!</div></div>
        <section className="card">
          <h2>How it works</h2>
          <ul className="bullets">
            <li><strong>Get paper and a pencil.</strong> Write your working on paper, every step, like in the real test. Type only the answer here.</li>
            <li><strong>Part 1:</strong> {total} short questions. After each one, tick whether you showed every step.</li>
            <li><strong>Part 2:</strong> an investigation of a growing pattern: table, rule, test, explain.</li>
            <li>About {mock.minutes} minutes. The clock is only a guide: nobody stops you.</li>
            <li>No "Show me how" and no answers until you hand in. Then you mark it with your teacher's Criterion B and C checklists.</li>
          </ul>
        </section>
        <button type="button" className="btn primary big" onClick={() => { set({ phase: 'part1' }); top(); }}>Start the Mock Test</button>
      </Shell>
    );
  }

  const header = (
    <span className={over ? 'exam-clock over' : 'exam-clock'} aria-label="Time used">{clockText(clock.seconds)} <small>/ {mock.minutes}:00</small></span>
  );

  if (st.phase === 'part1') {
    const id = st.ids[st.page];
    const item = items.get(id)!;
    const saved = st.outcomes[st.page] !== null;
    const goTo = (page: number) => { set(page >= total ? { phase: 'part2' } : { page }); top(); };
    return (
      <Shell title={`Part 1 · question ${st.page + 1} of ${total}`} onExit={onExit} right={header}>
        {item.picture && <PatternPicture picture={item.picture} />}
        <ItemView key={`${id}:${saved}`} item={item} quiet locked={saved}
          onResult={(outcome) => set({ outcomes: st.outcomes.map((o, i) => (i === st.page ? outcome : o)) })} />
        {saved && (
          <>
            <p className="saved-note">✓ Answer saved.</p>
            <fieldset className="checklist">
              <legend>Criterion C habit</legend>
              <label>
                <input type="checkbox" checked={st.steps[st.page]}
                  onChange={(e) => set({ steps: st.steps.map((x, i) => (i === st.page ? e.target.checked : x)) })} />
                <span>I wrote every step on paper, with correct notation</span>
              </label>
            </fieldset>
            <button type="button" className="btn primary" onClick={() => goTo(st.page + 1)}>
              {st.page + 1 < total ? 'Next question ▶' : 'On to Part 2: the investigation ▶'}
            </button>
          </>
        )}
        {!saved && (
          <button type="button" className="text-link" onClick={() => goTo(st.page + 1)}>Skip this one for now</button>
        )}
        {st.page > 0 && <button type="button" className="text-link" onClick={() => goTo(st.page - 1)}>‹ Back</button>}
      </Shell>
    );
  }

  if (st.phase === 'part2') {
    return (
      <Shell title="Part 2 · Investigation" onExit={onExit} right={header}>
        <Part2 state={st} set={set} onHandIn={() => { seconds.current = clock.total(); clock.flush(); set({ phase: 'marking' }); top(); }}
          onBack={() => { set({ phase: 'part1', page: total - 1 }); top(); }} mock={mock} />
      </Shell>
    );
  }

  if (st.phase === 'marking') {
    const auto = checkInvestigation(inv, st.inv);
    const finish = () => {
      const r: Omit<MathsMockResult, 'date'> = {
        seconds: seconds.current || clock.total(),
        part1: st.ids.map((id, i) => ({ id, outcome: st.outcomes[i] ?? 'wrong', steps: st.steps[i] })),
        inv: st.inv, describeTicks: st.describeTicks, justifyTicks: st.justifyTicks, bTicks: st.bTicks, cTicks: st.cTicks,
        b: bBand(st.bTicks), c: cBand(st.cTicks),
      };
      setResult(r);
      onDone(r);
      set({ phase: 'result' });
      top();
    };
    const tick = (key: 'describeTicks' | 'justifyTicks' | 'bTicks' | 'cTicks', i: number, v: boolean) =>
      set({ [key]: st[key].map((x, j) => (j === i ? v : x)) } as Partial<State>);
    return (
      <Shell title="Mark your test" onExit={onExit}>
        <section className="card">
          <h2>Part 1: the app marked these</h2>
          <ol className="mock-marks">
            {st.ids.map((id, i) => {
              const it = items.get(id)!;
              const ok = st.outcomes[i] === 'right';
              return (
                <li key={id} className={ok ? 'good' : 'bad'}>
                  <span className="mark">{ok ? '✓' : '✗'}</span>
                  <span>{label(it)}<br /><small>{ok ? 'Right' : `Answer: ${answerText(it).replace(/\n/g, '; ')}`}{st.steps[i] ? ' · steps shown' : ''}</small></span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="card">
          <h2>Part 2: the parts the app can check</h2>
          <ol className="mock-marks">
            <li className={auto.table.every(Boolean) ? 'good' : 'bad'}><span className="mark">{auto.table.every(Boolean) ? '✓' : '✗'}</span><span>a) Table<br /><small>{inv.terms.map(fmtNum).join(', ')}</small></span></li>
            <li className={auto.rule ? 'good' : 'bad'}><span className="mark">{auto.rule ? '✓' : '✗'}</span><span>c) General rule<br /><small>{pretty(inv.rule)} (yours: {st.inv.rule ? pretty(st.inv.rule) : 'blank'})</small></span></li>
            <li className={auto.test ? 'good' : 'bad'}><span className="mark">{auto.test ? '✓' : '✗'}</span><span>d) Stage {inv.test.stage}<br /><small>{inv.test.value}</small></span></li>
            <li className={auto.which ? 'good' : 'bad'}><span className="mark">{auto.which ? '✓' : '✗'}</span><span>e) Which stage has {inv.target.value}?<br /><small>Stage {inv.target.stage}</small></span></li>
          </ol>
        </section>

        <SelfMark title="b) Describe what changes" yours={st.inv.describe} model={inv.describe.model} ideas={inv.describe.ideas.map((x) => x.label)}
          ticks={st.describeTicks} onTick={(i, v) => tick('describeTicks', i, v)} />
        <SelfMark title="f) Explain why the rule works" yours={st.inv.justify} model={inv.justify.model} ideas={inv.justify.ideas.map((x) => x.label)}
          ticks={st.justifyTicks} onTick={(i, v) => tick('justifyTicks', i, v)} />

        <fieldset className="checklist">
          <legend>Criterion B: investigating patterns. Tick what you did.</legend>
          {B_LEVELS.map((l, i) => (
            <label key={l.label}>
              <input type="checkbox" checked={st.bTicks[i]} onChange={(e) => tick('bTicks', i, e.target.checked)} />
              <span>{l.label} <small className="muted">({l.band} marks)</small></span>
            </label>
          ))}
          <p className="muted small">The app's check: table {auto.table.every(Boolean) ? '✓' : '✗'}, rule {auto.rule ? '✓' : '✗'}, test {auto.test ? '✓' : '✗'}, which stage {auto.which ? '✓' : '✗'}.</p>
        </fieldset>
        <fieldset className="checklist">
          <legend>Criterion C: communicating. Tick what your answers have.</legend>
          {C_CHECKS.map((c, i) => (
            <label key={c}>
              <input type="checkbox" checked={st.cTicks[i]} onChange={(e) => tick('cTicks', i, e.target.checked)} />
              <span>{c}</span>
            </label>
          ))}
          <p className="muted small">In Part 1 you ticked "every step shown" for {st.steps.filter(Boolean).length} of {total} questions.</p>
        </fieldset>
        <button type="button" className="btn primary big" onClick={finish}>Finish marking</button>
      </Shell>
    );
  }

  return <Result mock={mock} result={result} items={items} onExit={onExit} next={next} />;
}

function label(it: Item): string {
  if (it.type === 'expression') return `${it.prompt} ${pretty(it.show ?? it.expr)}`;
  if (it.type === 'sequence') return `Sequence ${it.terms.map(fmtNum).join(', ')}, …`;
  return it.prompt;
}

function Shell({ title, onExit, right, children }: { title: string; onExit: () => void; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="session">
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close (your answers are kept)">✕</button>
        <div className="session-title">{title}</div>
        {right}
      </header>
      <main className="session-body">{children}</main>
    </div>
  );
}

/** Part 2: the investigation, in the teacher's Criterion B steps. */
function Part2({ state: st, set, onHandIn, onBack, mock }: {
  state: State; set: (c: Partial<State>) => void; onHandIn: () => void; onBack: () => void; mock: MockExam;
}) {
  const inv = mock.maths!.investigation;
  const [active, setActive] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const raw = st.raw;
  const numKey = (key: string) => (k: string) => {
    const cur = raw[key] ?? '';
    const nextText = k === '-' ? (cur.startsWith('-') ? cur.slice(1) : `-${cur}`) : cur.length >= 6 ? cur : cur + k;
    store(key, nextText);
  };
  const store = (key: string, text: string) => {
    const n = readNumber(text);
    const invNext: InvestigationAnswers = { ...st.inv, table: [...st.inv.table] };
    if (key.startsWith('t')) invNext.table[Number(key.slice(1))] = n;
    if (key === 'test') invNext.test = n;
    if (key === 'which') invNext.which = n;
    if (key === 'rule') invNext.rule = text;
    set({ raw: { ...raw, [key]: text }, inv: invNext });
  };
  const del = (key: string) => store(key, [...(raw[key] ?? '')].slice(0, -1).join(''));
  const field = (key: string, lbl: string) => (
    <button key={key} type="button" className={`num-box${active === key ? ' active' : ''}`} onClick={() => setActive(key)}>
      <span className="num-label">{lbl}</span>
      <span className="num-value">{raw[key] ? (key === 'rule' ? pretty(raw[key]) : showNumber(raw[key])) : '?'}</span>
    </button>
  );
  const pad = (keys: string[]) => active && keys.includes(active) && (
    active === 'rule'
      ? <MathsKeypad letters={['n']} onKey={(k) => store('rule', (raw.rule ?? '') + k)} onDelete={() => del('rule')} onClear={() => store('rule', '')} />
      : <NumberPad onKey={numKey(active)} onDelete={() => del(active)} />
  );
  const blanks = [
    st.inv.table.some((v) => v === null), !st.inv.describe.trim(), !st.inv.rule.trim(), st.inv.test === null, st.inv.which === null, !st.inv.justify.trim(),
  ].filter(Boolean).length;
  const tableKeys = inv.terms.map((_, i) => `t${i}`);

  return (
    <>
      <p className="learn-intro">{inv.intro}</p>
      <PatternPicture picture={inv.picture} />

      <section className="inv-part">
        <h3>a) Count the tiles and complete the table for stages 1 to {inv.terms.length}.</h3>
        <p className="muted small">Count stages 1 to 3 in the picture; continue the pattern for the rest.</p>
        <div className="num-boxes">{tableKeys.map((k, i) => field(k, `Stage ${i + 1}`))}</div>
        {pad(tableKeys)}
      </section>

      <section className="inv-part">
        <h3>b) Describe what changes from one stage to the next.</h3>
        <DictationBox value={st.inv.describe} onChange={(t) => set({ inv: { ...st.inv, describe: t } })} rows={3} label="Your description"
          placeholder="Each new stage adds …" />
      </section>

      <section className="inv-part">
        <h3>c) Write the general rule for the number of tiles at stage n.</h3>
        <div className="num-boxes">{field('rule', 'tiles = ')}</div>
        {pad(['rule'])}
      </section>

      <section className="inv-part">
        <h3>d) Test your rule: use it to find stage {inv.test.stage}.</h3>
        <p className="muted small">On paper, write the substitution with brackets, for example 5({inv.test.stage}) + …</p>
        <div className="num-boxes">{field('test', `Stage ${inv.test.stage}`)}</div>
        {pad(['test'])}
      </section>

      <section className="inv-part">
        <h3>e) Which stage has {inv.target.value} tiles?</h3>
        <div className="num-boxes">{field('which', 'Stage')}</div>
        {pad(['which'])}
      </section>

      <section className="inv-part">
        <h3>f) Explain in 2–3 sentences why your rule works. Link each number in the rule to the picture.</h3>
        <DictationBox value={st.inv.justify} onChange={(t) => set({ inv: { ...st.inv, justify: t } })} rows={4} label="Your explanation"
          placeholder="My pattern begins with … Each new stage adds … Therefore stage n has … I checked this using stage …" />
      </section>

      {!confirm ? (
        <button type="button" className="btn primary big" onClick={() => (blanks > 0 ? setConfirm(true) : onHandIn())}>Hand in</button>
      ) : (
        <section className="card tint-accent" role="alert">
          <p>{blanks} part{blanks === 1 ? ' is' : 's are'} still blank. In the real test, try every part: even a start can earn marks.</p>
          <button type="button" className="btn primary" onClick={onHandIn}>Hand in anyway</button>
          <button type="button" className="btn ghost" onClick={() => setConfirm(false)}>Keep working</button>
        </section>
      )}
      <button type="button" className="text-link" onClick={onBack}>‹ Back to Part 1</button>
    </>
  );
}

function SelfMark({ title, yours, model, ideas, ticks, onTick }: {
  title: string; yours: string; model: string; ideas: string[]; ticks: boolean[]; onTick: (i: number, v: boolean) => void;
}) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="yours"><span>You wrote</span>{yours.trim() || '(nothing)'}</div>
      <div className="teacher"><span>A model answer</span>{model}</div>
      <fieldset className="checklist">
        <legend>Tick what your answer has:</legend>
        {ideas.map((idea, i) => (
          <label key={idea}>
            <input type="checkbox" checked={ticks[i]} onChange={(e) => onTick(i, e.target.checked)} />
            <span>{idea}</span>
          </label>
        ))}
      </fieldset>
    </section>
  );
}

function Result({ mock, result, items, onExit, next }: {
  mock: MockExam; result: Omit<MathsMockResult, 'date'> | null; items: Map<ItemId, Item>; onExit: () => void; next?: { title: string; start: () => void };
}) {
  useEffect(() => play('done'), []);
  const fixes = useMemo(() => (result ? mathsWhatToFix(mock.maths!, { ...result, date: '' }, items) : []), [mock, result, items]);
  if (!result) return null;
  const right = result.part1.filter((p) => p.outcome === 'right').length;
  return (
    <div className="summary">
      <Confetti />
      <div className="summary-card">
        <div className="summary-lola"><Mascot mood="cheer" size={120} /></div>
        <h1>Mock Test done!</h1>
        <div className="crit-scores">
          <div><span>Criterion B</span><strong>{result.b}</strong><small>out of 8</small></div>
          <div><span>Criterion C</span><strong>{result.c}</strong><small>out of 8</small></div>
        </div>
        <p className="summary-points">Part 1: {right} of {result.part1.length} right · time {clockText(result.seconds)}</p>
      </div>
      <section className="card">
        <h2>What to fix before Friday</h2>
        {fixes.length === 0 ? <p>Nothing! That is a full-marks answer by your own checklists. 🎉</p> : (
          <ul className="bullets">{fixes.map((f) => <li key={f}>{f}</li>)}</ul>
        )}
        <p className="muted small">Your own marking is practice, not a grade. The questions you missed in Part 1 are waiting in Fix My Mistakes.</p>
      </section>
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
