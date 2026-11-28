// One view per kind of challenge. Each reports a result to the level runner:
//   ok: was this try right?
//   note: what went wrong (shown with the clue and "Try again").
//   complete: the challenge is finished even though mistakes were made on the way (building, the gate).
import { useEffect, useMemo, useState } from 'react';
import type {
  BuildChallenge, Challenge, CluesChallenge, DialChallenge, GateChallenge, LabelChallenge, MatchChallenge,
  OrderChallenge, PartInfo, PickChallenge, SortChallenge, SpotChallenge, TapChallenge,
} from '../../content/adventure';
import { shuffle } from '../../engine/rng';
import { play } from '../sound';
import { DiagramView, Molecule } from './diagrams';
import { useDragDrop } from './drag';

export interface Result { ok: boolean; note?: string; complete?: boolean }

interface Props<C> { ch: C; parts: Record<string, PartInfo>; onResult: (r: Result) => void }

export function ChallengeView({ ch, parts, onResult }: Props<Challenge>) {
  switch (ch.kind) {
    case 'sort': return <SortView ch={ch} parts={parts} onResult={onResult} />;
    case 'order': return <OrderView ch={ch} parts={parts} onResult={onResult} />;
    case 'match': return <MatchView ch={ch} parts={parts} onResult={onResult} />;
    case 'pick': return <PickView ch={ch} parts={parts} onResult={onResult} />;
    case 'label': return <LabelView ch={ch} parts={parts} onResult={onResult} />;
    case 'tap': return <TapView ch={ch} parts={parts} onResult={onResult} />;
    case 'build': return <BuildView ch={ch} parts={parts} onResult={onResult} />;
    case 'gate': return <GateView ch={ch} parts={parts} onResult={onResult} />;
    case 'dial': return <DialView ch={ch} parts={parts} onResult={onResult} />;
    case 'spot': return <SpotView ch={ch} parts={parts} onResult={onResult} />;
    case 'clues': return <CluesView ch={ch} parts={parts} onResult={onResult} />;
  }
}

const HOW: Record<Challenge['kind'], string> = {
  sort: 'Drag each card into a box. Or tap a card, then tap a box.',
  order: 'Tap the cards in the right order.',
  match: 'Tap a card on the left, then its partner on the right.',
  pick: 'Choose one.',
  label: 'Drag each name onto its number. Or tap a name, then tap a number.',
  tap: 'Tap the right part of the drawing.',
  build: 'Drag each part into the cell. Or tap a part, then tap the cell.',
  gate: 'For each molecule, choose: let it in, send it out, or block it.',
  dial: 'Turn the dials, then lock it in.',
  spot: 'Tap the sentence that is wrong.',
  clues: 'Read the clue. Solve it now, or ask for another clue.',
};

export function howTo(kind: Challenge['kind']): string {
  return HOW[kind];
}

// ---------- Sort ----------

function SortView({ ch, onResult }: Props<SortChallenge>) {
  const cards = useMemo(() => shuffle(ch.cards), [ch]);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const dd = useDragDrop((item, target) => {
    if (!ch.bins.includes(target)) return;
    play('almost');
    setPlaced((p) => ({ ...p, [item]: target }));
  });
  const tray = cards.filter((c) => !placed[c.text]);
  const check = () => {
    const wrong = cards.filter((c) => placed[c.text] !== c.bin);
    // The right ones stay; the wrong ones go back to the tray for the next try.
    setPlaced((p) => Object.fromEntries(Object.entries(p).filter(([t]) => !wrong.some((c) => c.text === t))));
    onResult({ ok: wrong.length === 0, note: wrong.map((c) => `${c.text}: ${c.why}`).join('\n') });
  };
  return (
    <div className="adv-stack">
      <div className="bins" style={{ gridTemplateColumns: `repeat(${ch.bins.length === 4 ? 2 : Math.min(ch.bins.length, 3)}, 1fr)` }}>
        {ch.bins.map((b) => (
          <div key={b} data-drop={b} className={`bin${dd.over === b ? ' over' : ''}${dd.selected ? ' ready' : ''}`}
            role="button" tabIndex={0} aria-label={`Box: ${b}`} onClick={() => dd.tapTarget(b)}
            onKeyDown={(e) => { if (e.key === 'Enter') dd.tapTarget(b); }}>
            <span className="bin-label">{b}</span>
            <div className="bin-tags">
              {cards.filter((c) => placed[c.text] === b).map((c) => (
                <button key={c.text} type="button" className="tag pop"
                  onClick={(e) => { e.stopPropagation(); setPlaced((p) => { const n = { ...p }; delete n[c.text]; return n; }); }}
                  aria-label={`${c.text}, in ${b}. Tap to take it back`}>{c.text}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="tray" aria-label="Cards to sort">
        {tray.length === 0 && <span className="muted small">All placed. Now check.</span>}
        {tray.map((c) => (
          <button key={c.text} type="button" className={`drag-card${dd.selected === c.text ? ' selected' : ''}`} {...dd.card(c.text, c.text)}>{c.text}</button>
        ))}
      </div>
      {dd.ghost}
      <button type="button" className="btn primary" disabled={tray.length > 0} onClick={check}>Check</button>
    </div>
  );
}

// ---------- Order ----------

function OrderView({ ch, onResult }: Props<OrderChallenge>) {
  const pool = useMemo(() => {
    const idx = ch.steps.map((_, i) => i);
    let mixed = shuffle(idx);
    if (mixed.every((v, i) => v === i)) mixed = [...idx.slice(1), idx[0]];
    return mixed;
  }, [ch]);
  const [placed, setPlaced] = useState<number[]>([]);
  const left = pool.filter((i) => !placed.includes(i));
  const check = () => {
    const ok = placed.every((v, i) => v === i);
    const firstWrong = placed.findIndex((v, i) => v !== i);
    onResult({ ok, note: ok ? undefined : `Card ${firstWrong + 1} is in the wrong place.` });
  };
  return (
    <div className="adv-stack">
      <ol className="order-list">
        {placed.map((i, pos) => (
          <li key={i}>
            <button type="button" className="order-card pop" onClick={() => setPlaced((p) => p.filter((x) => x !== i))}
              aria-label={`${pos + 1}: ${ch.steps[i]}. Tap to take it back`}>
              <span className="num">{pos + 1}</span>{ch.steps[i]}
            </button>
          </li>
        ))}
        {left.length > 0 && <li className="slot">{placed.length === 0 ? 'Tap the first card below' : 'Tap the next card'}</li>}
      </ol>
      <div className="tray">
        {left.map((i) => (
          <button key={i} type="button" className="drag-card" onClick={() => { play('almost'); setPlaced((p) => [...p, i]); }}>{ch.steps[i]}</button>
        ))}
      </div>
      <button type="button" className="btn primary" disabled={left.length > 0} onClick={check}>Check</button>
    </div>
  );
}

// ---------- Match ----------

const PAIR_COLOURS = ['#1cb0f6', '#ff9600', '#58cc02', '#ce82ff', '#ff4b4b', '#ffc800'];

function MatchView({ ch, onResult }: Props<MatchChallenge>) {
  const rights = useMemo(() => shuffle(ch.pairs.map((p) => p[1])), [ch]);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [from, setFrom] = useState<string | null>(null);
  const colourOf = (left: string) => PAIR_COLOURS[ch.pairs.findIndex((p) => p[0] === left) % PAIR_COLOURS.length];
  const leftOf = (right: string) => Object.keys(links).find((l) => links[l] === right);
  const tapLeft = (l: string) => {
    if (links[l]) { setLinks((x) => { const n = { ...x }; delete n[l]; return n; }); return; }
    setFrom(from === l ? null : l);
  };
  const tapRight = (r: string) => {
    if (!from) return;
    play('almost');
    setLinks((x) => {
      const n = { ...x };
      for (const k of Object.keys(n)) if (n[k] === r) delete n[k];
      n[from] = r;
      return n;
    });
    setFrom(null);
  };
  const check = () => {
    const wrong = ch.pairs.filter(([l, r]) => links[l] !== r);
    const note = wrong.map(([l]) => `"${l}" does not go with "${links[l]}".`).join('\n');
    setLinks((x) => Object.fromEntries(Object.entries(x).filter(([l]) => !wrong.some((w) => w[0] === l))));
    onResult({ ok: wrong.length === 0, note });
  };
  return (
    <div className="adv-stack">
      <div className="match-cols">
        <div className="match-col">
          {ch.pairs.map(([l]) => (
            <button key={l} type="button" className={`match-card${from === l ? ' selected' : ''}`}
              style={links[l] ? { borderColor: colourOf(l), background: `${colourOf(l)}22` } : undefined}
              aria-pressed={from === l} onClick={() => tapLeft(l)}>{l}</button>
          ))}
        </div>
        <div className="match-col">
          {rights.map((r) => {
            const l = leftOf(r);
            return (
              <button key={r} type="button" className={`match-card right${from ? ' ready' : ''}`}
                style={l ? { borderColor: colourOf(l), background: `${colourOf(l)}22` } : undefined}
                onClick={() => tapRight(r)}>{r}</button>
            );
          })}
        </div>
      </div>
      <button type="button" className="btn primary" disabled={Object.keys(links).length < ch.pairs.length} onClick={check}>Check</button>
    </div>
  );
}

// ---------- Pick ----------

function PickView({ ch, onResult }: Props<PickChallenge>) {
  const options = useMemo(() => shuffle(ch.options), [ch]);
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="options">
      {options.map((o) => (
        <button key={o} type="button" disabled={picked !== null}
          className={`option${picked === o ? (o === ch.answer ? ' right' : ' wrong') : ''}`}
          onClick={() => { setPicked(o); onResult({ ok: o === ch.answer, note: ch.whyNot[o] }); }}>{o}</button>
      ))}
    </div>
  );
}

// ---------- Label ----------

function LabelView({ ch, parts, onResult }: Props<LabelChallenge>) {
  const numbers = useMemo(() => Object.fromEntries(ch.spots.map((k, i) => [k, i + 1])), [ch]);
  const names = useMemo(() => shuffle(ch.spots), [ch]);
  const [placed, setPlaced] = useState<Record<string, string>>({}); // spot → name key
  const dd = useDragDrop((item, target) => {
    if (!(target in numbers)) return;
    play('almost');
    setPlaced((p) => {
      const n: Record<string, string> = {};
      for (const [s, v] of Object.entries(p)) if (v !== item && s !== target) n[s] = v;
      n[target] = item;
      return n;
    });
  });
  const used = new Set(Object.values(placed));
  const check = () => {
    const wrong = ch.spots.filter((s) => placed[s] !== s);
    const note = wrong.map((s) => `Number ${numbers[s]} is not the ${parts[placed[s]]?.name.toLowerCase() ?? placed[s]}.`).join('\n');
    setPlaced((p) => Object.fromEntries(Object.entries(p).filter(([s]) => !wrong.includes(s))));
    onResult({ ok: wrong.length === 0, note });
  };
  return (
    <div className="adv-stack">
      <div className="diagram-box" onClick={(e) => {
        const t = (e.target as Element).closest?.('[data-drop]')?.getAttribute('data-drop');
        if (t) dd.tapTarget(t);
      }}>
        <DiagramView diagram={ch.diagram} markers={numbers} label="A drawing with numbered parts" />
      </div>
      <ul className="label-slots">
        {ch.spots.map((s) => (
          <li key={s} data-drop={s} className={`label-slot${dd.over === s ? ' over' : ''}${dd.selected ? ' ready' : ''}`}
            onClick={() => (placed[s] && !dd.selected ? setPlaced((p) => { const n = { ...p }; delete n[s]; return n; }) : dd.tapTarget(s))}>
            <span className="num">{numbers[s]}</span>
            {placed[s] ? <span className="tag pop">{parts[placed[s]]?.name ?? placed[s]}</span> : <span className="muted small">Drop a name here</span>}
          </li>
        ))}
      </ul>
      <div className="tray">
        {names.filter((n) => !used.has(n)).map((n) => (
          <button key={n} type="button" className={`drag-card${dd.selected === n ? ' selected' : ''}`} {...dd.card(n, parts[n]?.name ?? n)}>{parts[n]?.name ?? n}</button>
        ))}
      </div>
      {dd.ghost}
      <button type="button" className="btn primary" disabled={used.size < ch.spots.length} onClick={check}>Check</button>
    </div>
  );
}

// ---------- Tap a part ----------

function TapView({ ch, parts, onResult }: Props<TapChallenge>) {
  const [mark, setMark] = useState<Record<string, 'right' | 'wrong'>>({});
  const tap = (k: string) => {
    if (Object.keys(mark).length > 0) return;
    const ok = k === ch.answer;
    setMark({ [k]: ok ? 'right' : 'wrong' });
    const info = parts[k];
    onResult({ ok, note: ch.whyNot?.[k] ?? (info ? `You tapped the ${info.name.toLowerCase()}. ${info.job}` : undefined) });
  };
  return (
    <div className="diagram-box">
      <DiagramView diagram={ch.diagram} onTap={tap} mark={mark} label="Tap a part of the drawing" />
    </div>
  );
}

// ---------- Build a cell ----------

function BuildView({ ch, parts, onResult }: Props<BuildChallenge>) {
  const offer = useMemo(() => shuffle(ch.offer), [ch]);
  const needed = ch.offer.filter((p) => !(p in ch.reject));
  const [placed, setPlaced] = useState<string[]>([]);
  const [bounced, setBounced] = useState<string[]>([]);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const place = (item: string) => {
    const why = ch.reject[item as keyof typeof ch.reject];
    if (why) {
      play('wrong');
      setBounced((b) => [...b, item]);
      setMistakes((m) => [...m, `${parts[item]?.name ?? item}: ${why}`]);
      setNote({ ok: false, text: `${parts[item]?.name ?? item} bounced out. ${why}` });
      return;
    }
    play('right');
    setNote({ ok: true, text: `${parts[item]?.name ?? item}: ${parts[item]?.job ?? ''}` });
    setPlaced((p) => [...p, item]);
  };
  const dd = useDragDrop((item, target) => { if (target === 'cell') place(item); });
  const done = needed.every((p) => placed.includes(p));
  useEffect(() => {
    if (done) onResult({ ok: mistakes.length === 0, complete: true, note: mistakes.join('\n') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const tray = offer.filter((p) => !placed.includes(p) && !bounced.includes(p));
  return (
    <div className="adv-stack">
      <div className={`diagram-box build${dd.over === 'cell' ? ' over' : ''}${dd.selected ? ' ready' : ''}`}
        onClick={() => dd.tapTarget('cell')}>
        <DiagramView diagram={ch.cell === 'animal' ? 'animal-cell' : 'plant-cell'} show={new Set(placed)} dropName="cell"
          label={`Your ${ch.cell} cell with ${placed.length} parts`} />
      </div>
      {note && <p key={note.text} className={`build-note pop${note.ok ? '' : ' no'}`} role="status">{note.text}</p>}
      {!done && (
        <div className="tray">
          {tray.map((p) => (
            <button key={p} type="button" className={`drag-card${dd.selected === p ? ' selected' : ''}`} {...dd.card(p, parts[p]?.name ?? p)}>{parts[p]?.name ?? p}</button>
          ))}
        </div>
      )}
      {dd.ghost}
    </div>
  );
}

// ---------- The membrane gate ----------

function GateView({ ch, onResult }: Props<GateChallenge>) {
  const queue = useMemo(() => shuffle(ch.molecules), [ch]);
  const [i, setI] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [left, setLeft] = useState(ch.seconds ?? 0);
  const [moving, setMoving] = useState<'in' | 'out' | 'block' | null>(null);
  const finished = i >= queue.length;

  useEffect(() => {
    if (!ch.seconds || finished) return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [ch.seconds, finished]);

  useEffect(() => {
    if (!finished) return;
    const fast = ch.seconds ? left > 0 : false;
    onResult({
      ok: mistakes.length === 0, complete: true,
      note: [...mistakes, ...(ch.seconds ? [fast ? `You beat the clock with ${left} seconds left!` : 'The clock ran out, but you finished. Well done.'] : [])].join('\n'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (finished) return null;
  const m = queue[i];
  const choose = (go: 'in' | 'out' | 'block') => {
    if (moving) return;
    if (go === m.go) {
      play('right');
      setMoving(go);
      setMsg({ ok: true, text: m.why });
      setTimeout(() => { setMoving(null); setMsg(null); setI((x) => x + 1); }, 1300);
    } else {
      play('wrong');
      setMistakes((x) => (x.some((t) => t.startsWith(`${m.name}:`)) ? x : [...x, `${m.name}: ${m.why}`]));
      setMsg({ ok: false, text: `Not that way. ${m.why}` });
    }
  };
  return (
    <div className="adv-stack">
      <div className="gate-head">
        <span>Molecule {i + 1} of {queue.length}</span>
        {ch.seconds ? <span className={`timer${left <= 5 ? ' low' : ''}`}>⏱ {left}s</span> : null}
      </div>
      <div className="gate-scene">
        <div className="gate-outside">Outside the cell</div>
        <div className={`gate-molecule${moving ? ` go-${moving}` : ''}`} key={m.name}>
          <Molecule look={m.look} />
          <b>{m.name}</b>
        </div>
        <div className="gate-wall" aria-hidden="true"><i /><i /><i /></div>
        <div className="gate-inside">Inside the cell (cytoplasm)</div>
      </div>
      {msg && <p className={`gate-msg ${msg.ok ? 'ok' : 'no'}`} role="status">{msg.text}</p>}
      <div className="gate-buttons">
        <button type="button" className="btn gate-in" disabled={!!moving} onClick={() => choose('in')}>⬇ Let it in</button>
        <button type="button" className="btn gate-out" disabled={!!moving} onClick={() => choose('out')}>⬆ Send it out</button>
        <button type="button" className="btn gate-block" disabled={!!moving} onClick={() => choose('block')}>✋ Block it</button>
      </div>
    </div>
  );
}

// ---------- Magnification dials ----------

function DialView({ ch, onResult }: Props<DialChallenge>) {
  const [eye, setEye] = useState(ch.eyepieces[0]);
  const [obj, setObj] = useState(ch.objectives[0]);
  const total = eye * obj;
  const off = Math.abs(Math.log(total / ch.target));
  const blur = Math.min(6, off * 6);
  const lock = () => onResult({
    ok: total === ch.target,
    note: `${eye} × ${obj} = ${total}×. That is ${total > ch.target ? 'too strong' : 'too weak'}. You need ${ch.target}×.`,
  });
  return (
    <div className="adv-stack">
      <div className="target-box">Target: <b>{ch.target}×</b></div>
      <div className="scope-view" aria-label={`The cells at ${total} times`}>
        <svg viewBox="0 0 200 200">
          <defs>
            <radialGradient id="slide-light" cx="50%" cy="45%" r="60%"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#d9ecff" /></radialGradient>
            <radialGradient id="stained" cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#efe8ff" /><stop offset="100%" stopColor="#a99af0" /></radialGradient>
          </defs>
          <rect width="200" height="200" fill="url(#slide-light)" />
          {/* Animal cells stained blue, as on a prepared slide. Sharp only at the right magnification. */}
          <g style={{ filter: `blur(${blur}px)` }} transform={`translate(100 100) scale(${Math.max(0.3, Math.min(2.6, total / 160))}) translate(-100 -100)`}>
            {[[70, 80, -10], [126, 70, 15], [96, 122, 5], [142, 124, -20], [52, 132, 30]].map(([x, y, r]) => (
              <g key={`${x}${y}`} transform={`rotate(${r} ${x} ${y})`}>
                <path d={`M${x - 22},${y} C${x - 22},${y - 16} ${x - 6},${y - 17} ${x + 4},${y - 15} C${x + 20},${y - 13} ${x + 23},${y - 2} ${x + 21},${y + 6} C${x + 18},${y + 16} ${x - 2},${y + 18} ${x - 12},${y + 14} C${x - 20},${y + 11} ${x - 22},${y + 6} ${x - 22},${y}Z`}
                  fill="url(#stained)" stroke="#6a55c9" strokeWidth="1.6" />
                <image href="./art/o-nucleus.webp" x={x - 9} y={y - 8} width="16" height="16" />
              </g>
            ))}
          </g>
        </svg>
        <span className="scope-total">{eye} × {obj} = <b>{total}×</b></span>
      </div>
      <DialRow label="Eyepiece" values={ch.eyepieces} value={eye} onChange={setEye} />
      <DialRow label="Objective lens" values={ch.objectives} value={obj} onChange={setObj} />
      <button type="button" className="btn primary" onClick={lock}>Lock it in</button>
    </div>
  );
}

function DialRow({ label, values, value, onChange }: { label: string; values: number[]; value: number; onChange: (v: number) => void }) {
  const angle = -40 + values.indexOf(value) * (80 / Math.max(1, values.length - 1));
  return (
    <div className="dial-row">
      <div className="dial" aria-hidden="true"><i style={{ transform: `rotate(${angle}deg)` }} /></div>
      <div className="dial-buttons">
        <span className="small muted">{label}</span>
        <div className="row-btns" role="radiogroup" aria-label={label}>
          {values.map((v) => (
            <button key={v} type="button" role="radio" aria-checked={v === value} className={`dial-btn${v === value ? ' on' : ''}`} onClick={() => onChange(v)}>{v}×</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Spot the mistake ----------

function SpotView({ ch, onResult }: Props<SpotChallenge>) {
  const fixes = useMemo(() => shuffle(ch.fixes), [ch]);
  const [found, setFound] = useState(false);
  return (
    <div className="adv-stack">
      <div className="notes-card">
        <span className="notes-author">{ch.author}'s notes</span>
        <ol>
          {ch.lines.map((l, i) => (
            <li key={l}>
              <button type="button" className={`note-line${found && i === ch.wrong ? ' found' : ''}`} disabled={found}
                onClick={() => {
                  if (i === ch.wrong) { play('almost'); setFound(true); }
                  else onResult({ ok: false, note: `"${l}" is correct. The mistake is in another sentence.` });
                }}>{l}</button>
            </li>
          ))}
        </ol>
      </div>
      {found && (
        <>
          <p className="bold">You found it! Now choose the correct sentence:</p>
          <div className="options">
            {fixes.map((f) => (
              <button key={f} type="button" className="option" onClick={() => onResult({ ok: f === ch.fix, note: f === ch.fix ? undefined : `"${f}" is not right either.` })}>{f}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Mystery clues ----------

function CluesView({ ch, onResult }: Props<CluesChallenge>) {
  const [shown, setShown] = useState(1);
  const options = useMemo(() => shuffle(ch.options), [ch]);
  return (
    <div className="adv-stack">
      <ol className="clues">
        {ch.clues.slice(0, shown).map((c, i) => <li key={c} className="clue pop"><span>Clue {i + 1}</span>{c}</li>)}
      </ol>
      {shown < ch.clues.length && (
        <button type="button" className="btn ghost" onClick={() => setShown((s) => s + 1)}>🔍 Show another clue</button>
      )}
      <p className="muted small">Solve it with fewer clues to be a better detective.</p>
      <div className="options">
        {options.map((o) => (
          <button key={o} type="button" className="option" onClick={() => onResult({ ok: o === ch.answer, note: ch.whyNot[o] })}>{o}</button>
        ))}
      </div>
    </div>
  );
}

