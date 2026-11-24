// One question on screen. Each kind of item has its own way of being answered;
// all of them report a single outcome and then show the marking.
import { useEffect, useMemo, useState } from 'react';
import type { ChoiceItem, ErrorFindItem, ExpressionItem, NumericItem, SequenceItem, Item, MatchItem, OrderItem, PairItem, ShortItem, TableItem, TermItem } from '../content/types';
import { checkIdeas, hasEnoughWords, outcomeOfTicks, verdictSentence } from '../engine/check';
import type { Outcome } from '../engine/progress';
import { shuffle } from '../engine/rng';
import { DictationBox } from './Dictation';
import { MathsKeypad, lettersFor } from './MathsKeypad';
import { NumberPad, readNumber, showNumber } from './NumberPad';
import { fmtNum } from '../content/types';
import { judgeExpression } from '../engine/judge';
import { pretty } from '../engine/algebra';
import { FillRows, type FillRow } from './FillRows';
import { IdeaVerdict } from './IdeaVerdict';
import { ListenRow } from './ListenRow';
import { SimpleBox, spokenHelp } from './SimpleBox';
import { play } from './sound';
import { readAloudOn, speak, stopSpeaking } from './speech';

interface ViewProps<T extends Item> {
  item: T;
  /** True once she has answered: the view shows the marking and nothing can be changed. */
  locked: boolean;
  /**
   * `chosen` is the option she tapped, so the app can explain why it was or was not right.
   * `dontKnow` is true when she said "I don't know yet" instead of answering.
   */
  onResult: (outcome: Outcome, chosen?: string, dontKnow?: boolean) => void;
  /** Called as soon as she has given her answer (or asked to be shown it), before the teacher's wording appears. */
  onCommit?: () => void;
  /** True if she has never met this thing before: not knowing it yet is then a first look, not a mistake. */
  fresh?: boolean;
  /** The answer explained in simple words, shown beside the teacher's wording once she has answered. */
  simple?: string;
  /** A few short examples, shown with the simple words. */
  examples?: string[];
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
    case 'short': return <ShortView {...props} item={item} />;
    case 'expression': return <ExpressionView {...props} item={item} />;
    case 'numeric': return <NumericView {...props} item={item} />;
    case 'sequence': return <SequenceView {...props} item={item} />;
    case 'errorFind': return <ErrorFindView {...props} item={item} />;
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
    if (!twoStep) onResult(i === item.answer ? 'right' : 'wrong', item.options[i]);
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
            <button type="button" className="btn primary" onClick={() => onResult(picked === item.answer ? 'right' : 'wrong', item.options[picked])}>
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
    onResult(i === item.answer ? 'right' : 'wrong', item.options[i]);
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

function TermView({ item, locked, onResult, onCommit, simple, examples, fresh }: ViewProps<TermItem>) {
  // 'front': the term only. 'checked': she answered and the app judged it. 'shown': she did not know, so it was shown to her.
  const [stage, setStage] = useState<'front' | 'checked' | 'shown'>('front');
  const [typed, setTyped] = useState('');
  const [aloud, setAloud] = useState(readAloudOn);
  const cardText = `${item.term}. ${item.definition}${spokenHelp(simple, examples)}`;
  const simpleBox = <SimpleBox simple={simple} examples={examples} />;

  // Stop reading when she moves on to the next question.
  useEffect(() => stopSpeaking, []);

  const check = () => {
    onCommit?.();
    setStage('checked');
    if (item.ideas) play(outcomeOfTicks({ ideas: item.ideas }, checkIdeas(typed, item.ideas).found));
    // The app says the verdict, then reads the card.
    if (aloud && item.ideas) speak(`${verdictSentence({ ideas: item.ideas }, checkIdeas(typed, item.ideas).found)} ${cardText}`);
  };
  const show = () => {
    onCommit?.();
    setStage('shown');
    if (aloud) speak(cardText); // the card reads itself once it is turned over
  };
  const listen = <ListenRow text={cardText} aloud={aloud} onAloud={setAloud} />;

  return (
    <div className="item">
      <div className="kicker">Key term</div>
      <div className="term-card">
        <div className="term">{item.term}</div>
        {stage === 'front' && <p className="hint">{item.ideas ? 'Say or type what it means.' : 'Say the definition, then flip the card.'}</p>}
      </div>

      {stage === 'front' && item.ideas && (
        <>
          <DictationBox value={typed} onChange={setTyped} rows={3} label="Your definition"
            placeholder="Tap the microphone and say the definition, or type it." />
          <button type="button" className="btn primary" disabled={!hasEnoughWords(typed)} onClick={check}>Check my answer</button>
          <button type="button" className="text-link" onClick={show}>I don't know yet. Show me.</button>
        </>
      )}
      {stage === 'checked' && item.ideas && (
        <>
          <div className="yours"><span>You said</span>{typed.trim()}</div>
          <IdeaVerdict ideas={item.ideas} text={typed} modelLabel="The teacher's definition" model={item.definition}
            simple={simple} examples={examples} onDone={(outcome) => onResult(outcome)} disabled={locked} />
          {listen}
        </>
      )}
      {stage === 'shown' && item.ideas && (
        <>
          <FirstLookOrNotYet fresh={fresh} />
          <div className="teacher"><span>The teacher's definition</span>{item.definition}</div>
          {simpleBox}
          {listen}
          <button type="button" className="btn primary" disabled={locked} onClick={() => onResult('wrong', undefined, true)}>Continue</button>
        </>
      )}

      {/* A card with no key ideas listed cannot be checked by the app, so she rates herself. */}
      {!item.ideas && stage === 'front' && (
        <button type="button" className="btn primary" onClick={show}>Flip the card</button>
      )}
      {!item.ideas && stage !== 'front' && (
        <>
          <div className="teacher"><span>The teacher's definition</span>{item.definition}</div>
          {simpleBox}
          {listen}
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

/** What she sees after "I don't know yet": a first look if it is new to her, otherwise "Not yet". */
function FirstLookOrNotYet({ fresh }: { fresh?: boolean }) {
  return fresh ? (
    <section className="verdict first-look" role="status">
      <h3 className="verdict-word">New for you</h3>
      <p className="verdict-detail">Read it and listen to it. It will come back in a moment, so you can try.</p>
    </section>
  ) : (
    <section className="verdict retry" role="status">
      <h3 className="verdict-word">Not yet</h3>
      <p className="verdict-detail">Read it and listen to it. This one will come back.</p>
    </section>
  );
}

/** A question answered in full sentences: she says or writes it, then the app checks it for the key ideas. */
function ShortView({ item, locked, onResult, onCommit, simple, examples, fresh }: ViewProps<ShortItem>) {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(false);
  const [aloud, setAloud] = useState(readAloudOn);
  const modelText = `The teacher's wording. ${item.model}${spokenHelp(simple, examples)}`;

  useEffect(() => stopSpeaking, []);

  const check = () => {
    onCommit?.();
    setChecked(true);
    play(outcomeOfTicks(item, checkIdeas(text, item.ideas).found));
    // The app says the verdict, then reads the teacher's wording.
    if (aloud) speak(`${verdictSentence(item, checkIdeas(text, item.ideas).found)} ${modelText}`);
  };
  const show = () => {
    onCommit?.();
    setShown(true);
    if (aloud) speak(modelText);
  };

  if (shown) {
    return (
      <div className="item">
        <Prompt text={item.prompt} kicker="Say it or write it" />
        <FirstLookOrNotYet fresh={fresh} />
        <div className="teacher"><span>The teacher's wording</span>{item.model}</div>
        <SimpleBox simple={simple} examples={examples} />
        <ListenRow text={modelText} aloud={aloud} onAloud={setAloud} />
        <button type="button" className="btn primary" disabled={locked} onClick={() => onResult('wrong', undefined, true)}>Continue</button>
      </div>
    );
  }

  return (
    <div className="item">
      <Prompt text={item.prompt} kicker="Say it or write it" />
      <DictationBox value={text} onChange={setText} readOnly={checked} rows={5} label="Your answer"
        placeholder="Answer in full sentences, as you will in the test." />
      {!checked ? (
        <>
          <button type="button" className="btn primary" disabled={!hasEnoughWords(text)} onClick={check}>
            Check my answer
          </button>
          <button type="button" className="text-link" onClick={show}>I don't know yet. Show me.</button>
        </>
      ) : (
        <>
          <IdeaVerdict ideas={item.ideas} need={item.need} text={text} modelLabel="The teacher's wording" model={item.model}
            simple={simple} examples={examples} onDone={(outcome) => onResult(outcome)} disabled={locked} />
          <ListenRow text={modelText} aloud={aloud} onAloud={setAloud} />
        </>
      )}
    </div>
  );
}

/** An algebra answer built on the maths keypad. The app checks it by value, and asks to simplify if needed. */
function ExpressionView({ item, locked, onResult, onCommit }: ViewProps<ExpressionItem>) {
  const [text, setText] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const letters = useMemo(() => item.letters ?? lettersFor(item.expr, item.answer), [item]);

  const check = () => {
    const verdict = judgeExpression(item, text);
    if (verdict.kind === 'unreadable') { setNote(verdict.say); return; }
    if (verdict.kind === 'simplify') { setNote(verdict.say); play('almost'); return; }
    onCommit?.();
    setNote(null);
    onResult(verdict.kind === 'right' ? 'right' : 'wrong', verdict.say);
  };

  return (
    <div className="item">
      <Prompt text={item.prompt} kicker={KICKER[item.kind ?? 'other']} />
      <div className="maths-big" aria-label="The expression">{pretty(item.show ?? item.expr)}</div>
      <div className={`maths-answer${locked ? ' locked' : ''}`} aria-live="polite" aria-label="Your answer">
        <span className="eq">=</span>
        {text ? <span>{pretty(text)}</span> : <span className="placeholder">your answer</span>}
      </div>
      {note && <p className="maths-note" role="status">{note}</p>}
      {!locked && (
        <>
          <MathsKeypad letters={letters} onKey={(k) => { setNote(null); setText((t) => t + k); }}
            onDelete={() => { setNote(null); setText((t) => [...t].slice(0, -1).join('')); }}
            onClear={() => { setNote(null); setText(''); }} />
          <button type="button" className="btn primary" disabled={!text.trim()} onClick={check}>Check my answer</button>
          <button type="button" className="text-link" onClick={() => { onCommit?.(); onResult('wrong', undefined, true); }}>
            I don't know yet. Show me.
          </button>
        </>
      )}
    </div>
  );
}

const KICKER: Record<NonNullable<ExpressionItem['kind']>, string> = {
  multiply: 'Multiply', collect: 'Simplify', brackets: 'Brackets', rule: 'Find the rule', other: 'Work it out',
};

/** Boxes for number answers, filled from the number pad. Tap a box to type into it. */
function NumberBoxes({ labels, values, active, locked, marks, onPick }: {
  labels: string[]; values: string[]; active: number; locked: boolean; marks?: boolean[]; onPick: (i: number) => void;
}) {
  return (
    <div className="num-boxes">
      {labels.map((label, i) => (
        <button key={label + i} type="button" disabled={locked} onClick={() => onPick(i)}
          className={`num-box${i === active && !locked ? ' active' : ''}${marks ? (marks[i] ? ' right' : ' wrong') : ''}`}>
          <span className="num-label">{label}</span>
          <span className="num-value">{values[i] ? showNumber(values[i]) : '?'}</span>
        </button>
      ))}
    </div>
  );
}

function useNumberEntry(count: number) {
  const [values, setValues] = useState<string[]>(() => Array(count).fill(''));
  const [active, setActive] = useState(0);
  const key = (k: string) => setValues((v) => v.map((x, i) => {
    if (i !== active) return x;
    if (k === '-') return x.startsWith('-') ? x.slice(1) : `-${x}`;
    return x.length >= 6 ? x : x + k;
  }));
  const del = () => setValues((v) => v.map((x, i) => (i === active ? x.slice(0, -1) : x)));
  const complete = values.every((v) => readNumber(v) !== null);
  return { values, active, setActive, key, del, complete };
}

function NumericView({ item, locked, onResult, onCommit }: ViewProps<NumericItem>) {
  const e = useNumberEntry(item.fields.length);
  const [marks, setMarks] = useState<boolean[] | undefined>();
  const check = () => {
    onCommit?.();
    const got = e.values.map(readNumber);
    const m = item.fields.map((f, i) => got[i] === f.answer);
    setMarks(m);
    const slip = item.slips?.find((s) => s.answer === got[0]);
    const say = slip?.say ?? (m.some((x) => !x) && item.fields.length > 1
      ? `Check ${item.fields.filter((_, i) => !m[i]).map((f) => f.label).join(' and ')}.` : undefined);
    onResult(m.every(Boolean) ? 'right' : 'wrong', say);
  };
  return (
    <div className="item">
      <Prompt text={item.prompt} kicker="Work it out" />
      <NumberBoxes labels={item.fields.map((f) => f.label)} values={e.values} active={e.active} locked={locked} marks={marks} onPick={e.setActive} />
      {!locked && (
        <>
          <NumberPad onKey={e.key} onDelete={e.del} />
          {item.fields.length > 1 && e.active < item.fields.length - 1 && readNumber(e.values[e.active]) !== null && (
            <button type="button" className="btn ghost small" onClick={() => e.setActive(e.active + 1)}>Next box ▶</button>
          )}
          <button type="button" className="btn primary" disabled={!e.complete} onClick={check}>Check my answer</button>
          <button type="button" className="text-link" onClick={() => { onCommit?.(); onResult('wrong', undefined, true); }}>I don't know yet. Show me.</button>
        </>
      )}
    </div>
  );
}

const SEQ_KINDS: SequenceItem['kind'][] = ['arithmetic', 'geometric', 'neither'];

/** Sequence Detective: the next two terms, arithmetic / geometric / neither, and the evidence. */
function SequenceView({ item, locked, onResult, onCommit }: ViewProps<SequenceItem>) {
  const e = useNumberEntry(2);
  const [kind, setKind] = useState<SequenceItem['kind'] | null>(null);
  const evidence = useMemo(() => shuffle(item.evidence), [item]);
  const [rule, setRule] = useState<string | null>(null);
  const [marks, setMarks] = useState<boolean[] | undefined>();
  const check = () => {
    onCommit?.();
    const got = e.values.map(readNumber);
    const m = [got[0] === item.next[0], got[1] === item.next[1]];
    setMarks(m);
    const parts = [m[0] && m[1] ? '' : 'the next terms', kind === item.kind ? '' : 'the type', rule === item.rule ? '' : 'the evidence'].filter(Boolean);
    onResult(parts.length === 0 ? 'right' : 'wrong', parts.length ? `Check ${parts.join(', ')}.` : undefined);
  };
  return (
    <div className="item">
      <Prompt text={item.prompt} kicker="Sequence Detective" />
      <div className="seq-row" aria-label="The sequence">
        {item.terms.map((t, i) => <span key={i} className="seq-term">{fmtNum(t)}</span>)}
      </div>
      <NumberBoxes labels={['Next term', 'Then']} values={e.values} active={e.active} locked={locked} marks={marks} onPick={e.setActive} />
      {!locked && <NumberPad onKey={(k) => { e.key(k); }} onDelete={e.del} />}
      {!locked && e.active === 0 && readNumber(e.values[0]) !== null && (
        <button type="button" className="btn ghost small" onClick={() => e.setActive(1)}>Next box ▶</button>
      )}
      <div className="seq-q">What kind of sequence?</div>
      <div className="seq-kinds">
        {SEQ_KINDS.map((k) => (
          <button key={k} type="button" disabled={locked} onClick={() => setKind(k)}
            className={locked ? (k === item.kind ? 'option right' : k === kind ? 'option wrong' : 'option dim') : k === kind ? 'option picked' : 'option'}>{k}</button>
        ))}
      </div>
      <div className="seq-q">Your evidence:</div>
      <div className="options">
        {evidence.map((r) => (
          <button key={r} type="button" disabled={locked} onClick={() => setRule(r)}
            className={locked ? (r === item.rule ? 'option right' : r === rule ? 'option wrong' : 'option dim') : r === rule ? 'option picked' : 'option'}>{r}</button>
        ))}
      </div>
      {!locked && (
        <>
          <button type="button" className="btn primary" disabled={!e.complete || !kind || !rule} onClick={check}>Check my answer</button>
          <button type="button" className="text-link" onClick={() => { onCommit?.(); onResult('wrong', undefined, true); }}>I don't know yet. Show me.</button>
        </>
      )}
    </div>
  );
}

/** Error Detective: tap the line with the mistake, then pick the fix. */
function ErrorFindView({ item, locked, onResult, onCommit }: ViewProps<ErrorFindItem>) {
  const [line, setLine] = useState<number | null>(null);
  const fixes = useMemo(() => shuffle(item.fixes), [item]);
  const [fix, setFix] = useState<string | null>(null);
  const tapLine = (i: number) => {
    if (locked || line !== null) return;
    setLine(i);
    if (i !== item.wrong) {
      onCommit?.();
      onResult('wrong', `Line ${i + 1} is correct. The mistake is in line ${item.wrong + 1}.`);
    }
  };
  const pickFix = (f: string) => {
    if (locked) return;
    setFix(f);
    onCommit?.();
    onResult(f === item.fix ? 'right' : 'wrong', f === item.fix ? undefined : `You found the wrong line, well done. The fix is: ${pretty(item.fix)}.`);
  };
  return (
    <div className="item">
      <Prompt text={item.prompt} kicker="Error Detective 🔎" />
      <ol className="err-lines">
        {item.lines.map((l, i) => (
          <li key={i}>
            <button type="button" disabled={locked || line !== null} onClick={() => tapLine(i)}
              className={`err-line${line === i ? (i === item.wrong ? ' right' : ' wrong') : ''}${locked && i === item.wrong ? ' right' : ''}`}>
              <span className="num">{i + 1}</span>{pretty(l)}
            </button>
          </li>
        ))}
      </ol>
      {line === null && <p className="hint">Tap the line with the mistake.</p>}
      {line === item.wrong && (
        <>
          <div className="seq-q">Good eye! What should that line say?</div>
          <div className="options">
            {fixes.map((f) => (
              <button key={f} type="button" disabled={locked || fix !== null} onClick={() => pickFix(f)}
                className={fix === null ? 'option' : f === item.fix ? 'option right' : f === fix ? 'option wrong' : 'option dim'}>{pretty(f)}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
