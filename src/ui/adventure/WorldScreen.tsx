// Plays one game world: the story, then level 1 (recognise it), level 2 (understand it), level 3 (use it).
// A wrong try shows why and a clue, then "Try again". Only the first try counts in the ring, like a round.
import { useEffect, useRef, useState } from 'react';
import { challengesOf, starsFor, type PartInfo, type World } from '../../content/adventure';
import { Confetti } from '../Confetti';
import { Mascot } from '../Mascot';
import { play } from '../sound';
import { ChallengeView, howTo, type Result } from './challenges';

export const POINTS_FIRST_TRY = 10;
export const POINTS_LATER = 3;

interface Props {
  world: World;
  parts: Record<string, PartInfo>;
  /** Her first try at a challenge, for the ring and Fix My Mistakes. */
  onAnswer: (concept: string, id: string, right: boolean) => void;
  onFinish: (right: number, total: number, stars: number, points: number) => void;
  onExit: () => void;
  /** True when this world is one of today's tasks. */
  guided?: boolean;
}

type Phase = { name: 'intro' } | { name: 'level'; level: number } | { name: 'play'; level: number; index: number } | { name: 'end' };

export function WorldScreen({ world, parts, onAnswer, onFinish, onExit, guided }: Props) {
  const [phase, setPhase] = useState<Phase>({ name: 'intro' });
  const [firstTry, setFirstTry] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [points, setPoints] = useState(0);
  const all = challengesOf(world);
  const right = Object.values(firstTry).filter(Boolean).length;
  // When the feedback appears, bring it (and its button) fully into view: on a small phone it can be tall.
  const footer = useRef<HTMLElement>(null);
  useEffect(() => {
    if (result) footer.current?.scrollIntoView?.({ block: 'end', behavior: 'smooth' });
  }, [result]);

  const position = phase.name === 'play'
    ? world.levels.slice(0, phase.level).reduce((n, l) => n + l.challenges.length, 0) + phase.index : phase.name === 'end' ? all.length : 0;

  if (phase.name === 'intro') {
    return (
      <div className="session adv" style={{ ['--world' as string]: world.colour }}>
        <header className="session-top">
          <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
          <span className="session-title">{world.emoji} {world.title}</span>
        </header>
        <main className="session-body">
          {/* A short animation of the world's picture: it plays once, then rests on its last frame. Tap to play again.
              The still picture shows until it loads (or if it cannot). */}
          <video className="world-video" src={`./art/${world.img}.mp4`} poster={`./img/${world.img}.webp`}
            autoPlay muted playsInline aria-label="The world's picture, moving. Tap to play it again."
            onClick={(e) => { const v = e.currentTarget; v.currentTime = 0; void v.play().catch(() => {}); }} />
          <p className="world-story">{world.story}</p>
          <ol className="level-list">
            {world.levels.map((l) => (
              <li key={l.stage}><span className="stage">Level {l.stage}</span> {l.title}</li>
            ))}
          </ol>
          <p className="muted small">A wrong move is OK: you see why, get a clue, and try again. Your first try counts for your ring.</p>
          <button type="button" className="btn primary big" onClick={() => setPhase({ name: 'level', level: 0 })}>Start</button>
        </main>
      </div>
    );
  }

  if (phase.name === 'level') {
    const l = world.levels[phase.level];
    return (
      <div className="session adv" style={{ ['--world' as string]: world.colour }}>
        <header className="session-top">
          <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
          <Bar done={position} total={all.length} />
        </header>
        <main className="session-body level-card">
          <div className="level-badge pop">Level {l.stage}</div>
          <h1>{l.title}</h1>
          <div className="hero">
            <Mascot mood={l.stage === 3 ? 'think' : 'happy'} size={84} />
            <div className="bubble">{l.intro}</div>
          </div>
          <button type="button" className="btn primary big" onClick={() => { setAttempt((a) => a + 1); setPhase({ name: 'play', level: phase.level, index: 0 }); }}>Go</button>
        </main>
      </div>
    );
  }

  if (phase.name === 'end') {
    const stars = starsFor(right, all.length);
    return (
      <div className="session adv" style={{ ['--world' as string]: world.colour }}>
        <Confetti />
        <main className="session-body end-card">
          <Mascot mood="cheer" size={110} />
          <h1>{world.title}: finished!</h1>
          <div className="stars" aria-label={`${stars} stars out of 3`}>
            {[1, 2, 3].map((n) => <span key={n} className={n <= stars ? 'star on pop' : 'star'}>★</span>)}
          </div>
          <p className="points-gain pop">+{points} points</p>
          <p className="bold">{right} of {all.length} right on the first try.</p>
          <p className="muted">{stars === 3 ? 'Amazing. You really know this.' : stars === 2 ? 'Good work. Play again to get three stars.' : 'You finished it! Play again: it gets easier every time.'}</p>
          <button type="button" className="btn primary big" onClick={onExit}>{guided ? 'Back to today\'s tasks' : 'Back to games'}</button>
        </main>
      </div>
    );
  }

  const level = world.levels[phase.level];
  const ch = level.challenges[phase.index];

  const handle = (r: Result) => {
    if (!(ch.id in firstTry)) {
      setFirstTry((f) => ({ ...f, [ch.id]: r.ok }));
      onAnswer(ch.concept, `play:${world.id}:${ch.id}`, r.ok);
      setPoints((p) => p + (r.ok ? POINTS_FIRST_TRY : POINTS_LATER));
    }
    play(r.ok ? 'right' : r.complete ? 'almost' : 'wrong');
    setResult(r);
  };

  const next = () => {
    setResult(null);
    setAttempt((a) => a + 1);
    if (phase.index + 1 < level.challenges.length) { setPhase({ name: 'play', level: phase.level, index: phase.index + 1 }); return; }
    if (phase.level + 1 < world.levels.length) { setPhase({ name: 'level', level: phase.level + 1 }); return; }
    const total = all.length;
    const finalRight = Object.values(firstTry).filter(Boolean).length;
    play('done');
    onFinish(finalRight, total, starsFor(finalRight, total), points);
    setPhase({ name: 'end' });
  };

  // Sorting, labelling and matching keep the right answers for the next try; the others start fresh.
  const retry = () => {
    setResult(null);
    if (!['sort', 'label', 'match'].includes(ch.kind)) setAttempt((a) => a + 1);
  };
  const solved = result && (result.ok || result.complete);

  return (
    <div className="session adv" style={{ ['--world' as string]: world.colour }}>
      <header className="session-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Close and go back">✕</button>
        <Bar done={position} total={all.length} />
        <span className="count">⭐ {points}</span>
      </header>
      <main className="session-body">
        <div className="kicker">Level {level.stage} · {level.title}</div>
        {ch.photo && <img className="adv-photo" src={`./img/${ch.photo}.webp`} alt="" />}
        {ch.story && <p className="adv-story">{ch.story}</p>}
        <h2>{ch.prompt}</h2>
        <p className="muted small">{howTo(ch.kind)}</p>
        <div className={result ? 'adv-locked' : undefined}>
          <ChallengeView key={`${ch.id}:${attempt}`} ch={ch} parts={parts} onResult={handle} />
        </div>
      </main>
      {result && (
        <footer ref={footer} className={`feedback ${solved && result.ok ? 'good' : 'retry'}`} role="status">
          <h2 className="feedback-head">{result.ok ? '✓ Great!' : result.complete ? '✓ Done! Some moves needed a second try.' : 'Not yet. Try again!'}</h2>
          <div className="why-list">
            {!result.ok && result.note && (
              <div className="why not"><span>{result.complete ? 'What to remember' : 'What went wrong'}</span>{result.note.split('\n').map((t) => <p key={t}>{t}</p>)}</div>
            )}
            {!solved && <div className="why hint"><span>💡 Clue</span><p>{ch.hint}</p></div>}
            {solved && <div className="why yes"><span>Why</span><p>{ch.why}</p></div>}
            {result.ok && result.note && result.complete && <p className="muted">{result.note}</p>}
          </div>
          {solved
            ? <button type="button" className="btn primary" onClick={next} autoFocus>Continue</button>
            : <button type="button" className="btn primary" onClick={retry} autoFocus>Try again</button>}
        </footer>
      )}
    </div>
  );
}

function Bar({ done, total }: { done: number; total: number }) {
  const pct = total ? (done / total) * 100 : 0;
  return (
    <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress through this game">
      <div className="bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
