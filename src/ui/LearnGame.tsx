// The fun parts of a Learn card: a term drawn with its parts labelled, and a quick-fire game
// (one tap per round, a streak, a reason after every tap). Games teach; nothing here is marked.
import { useEffect, useRef, useState } from 'react';
import type { LearnGame } from '../content/types';
import { Confetti } from './Confetti';
import { Mascot } from './Mascot';
import { play } from './sound';

const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';

export interface TermPart { kind: 'coef' | 'letter' | 'exp'; text: string; invisible?: boolean }

/** Splits one term like "−5y³" or "m" into its parts. Invisible 1s are filled in and marked. */
export function termParts(term: string): TermPart[] | null {
  const m = term.trim().replace(/-/g, '−').match(/^(−?)(\d*)((?:[a-z][⁰-⁹¹²³]*)*)$/);
  if (!m) return null;
  const [, sign, digits, letters] = m;
  const parts: TermPart[] = [{ kind: 'coef', text: sign + (digits || '1'), invisible: !digits }];
  for (const [, l, e] of letters.matchAll(/([a-z])([⁰-⁹¹²³]*)/g)) {
    parts.push({ kind: 'letter', text: l });
    parts.push({ kind: 'exp', text: e ? [...e].map((c) => String(SUPER.indexOf(c))).join('') : '1', invisible: !e });
  }
  return parts;
}

const CAPTION: Record<TermPart['kind'], string> = { coef: 'coefficient', letter: 'variable', exp: 'exponent' };

/** A term with each part in its own colour and named underneath. */
export function TermAnatomy({ term }: { term: string }) {
  const parts = termParts(term);
  if (!parts) return null;
  return (
    <figure className="anatomy" aria-label={`The parts of ${term}`}>
      <div className="anatomy-row">
        {parts.map((p, i) => (
          <span key={i} className={`an an-${p.kind}${p.invisible ? ' invisible' : ''}`}>
            <span className="an-val">{p.text}</span>
            <span className="an-cap">{CAPTION[p.kind]}{p.invisible && <em>invisible!</em>}</span>
          </span>
        ))}
      </div>
      <figcaption>
        <span className="an-key coef">coefficient = how many</span>
        <span className="an-key exp">exponent = how many times it is multiplied</span>
      </figcaption>
    </figure>
  );
}

const CHEERS = ['Nice!', 'Yes!', 'Spot on!', 'Brilliant!', 'You got it!'];
const STREAK = ['', '', '🔥 2 in a row!', '🔥🔥 3 in a row!', '🔥🔥🔥 On fire!', '⚡ Unstoppable!'];

export function GameView({ game, locked, onDone }: { game: LearnGame; locked: boolean; onDone: (score: number) => void }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const r = game.rounds[round];
  const top = useRef<HTMLElement>(null);
  useEffect(() => { top.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }); }, [round, finished]);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const right = i === r.answer;
    play(right ? 'right' : 'almost');
    if (right) { setScore((s) => s + 1); setStreak((s) => s + 1); } else setStreak(0);
  };
  const next = () => {
    if (round + 1 >= game.rounds.length) { setFinished(true); play('done'); return; }
    setRound(round + 1);
    setPicked(null);
  };

  if (finished) {
    const all = score === game.rounds.length;
    return (
      <section className="game game-end" ref={top}>
        {all && <Confetti />}
        <Mascot mood={all ? 'cheer' : 'happy'} size={88} />
        <h3>{all ? 'Perfect score!' : score >= game.rounds.length - 2 ? 'Great playing!' : 'Good practice!'}</h3>
        <div className="game-stars" aria-label={`${score} out of ${game.rounds.length}`}>
          {game.rounds.map((_, i) => <span key={i}>{i < score ? '⭐' : '☆'}</span>)}
        </div>
        <p>{score} out of {game.rounds.length}. {all ? 'You know this one.' : 'Read the reasons again: the questions after the lesson give you more practice.'}</p>
        {!locked && <button type="button" className="btn primary" onClick={() => onDone(score)}>Continue ▶</button>}
      </section>
    );
  }

  const right = picked === r.answer;
  return (
    <section className="game" ref={top}>
      <div className="game-head">
        <h3>🎮 {game.title}</h3>
        <span className="game-count">{round + 1}/{game.rounds.length}</span>
      </div>
      {round === 0 && picked === null && <p className="game-intro">{game.intro}</p>}
      <div className="game-dots" aria-hidden="true">
        {game.rounds.map((_, i) => <span key={i} className={i < round ? 'done' : i === round ? 'now' : ''} />)}
      </div>
      <div className="game-show">{r.show}</div>
      <p className="game-ask">{r.ask}</p>
      <div className={r.options.every((o) => o.length <= 8) ? 'options game-grid' : 'options'}>
        {r.options.map((o, i) => (
          <button key={o} type="button" disabled={picked !== null}
            className={picked === null ? 'option' : i === r.answer ? 'option right' : i === picked ? 'option wrong' : 'option dim'}
            onClick={() => pick(i)}>{o}</button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className={right ? 'tap-why good' : 'tap-why'} role="status">
            <strong>{right ? `${CHEERS[round % CHEERS.length]} ` : 'Not quite. '}</strong>{r.why}
          </p>
          {right && STREAK[Math.min(streak, STREAK.length - 1)] && <div className="game-streak">{STREAK[Math.min(streak, STREAK.length - 1)]}</div>}
          {r.anatomy && <TermAnatomy term={r.anatomy} />}
          <button type="button" className="btn primary" onClick={next} autoFocus>
            {round + 1 >= game.rounds.length ? 'See my score ▶' : 'Next round ▶'}
          </button>
        </>
      )}
    </section>
  );
}
