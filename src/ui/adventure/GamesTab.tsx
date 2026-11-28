// The Games tab: one card per game world, with her best stars. Today's game is marked.
import type { World } from '../../content/adventure';

interface Props {
  worlds: World[];
  best: Record<string, { best: number; plays: number }>;
  /** The world that is one of today's tasks, if any. */
  today?: string;
  onPlay: (id: string) => void;
}

export function GamesTab({ worlds, best, today, onPlay }: Props) {
  return (
    <>
      <header className="page-head">
        <h1>Games</h1>
        <p>Six worlds, three levels each. Every game counts as practice for the test.</p>
      </header>
      <div className="world-grid">
        {worlds.map((w) => {
          const b = best[w.id];
          return (
            <button key={w.id} type="button" className={`world-card${today === w.id ? ' today' : ''}`} style={{ ['--world' as string]: w.colour }} onClick={() => onPlay(w.id)}>
              <img src={`./img/${w.img}.webp`} alt="" loading="lazy" />
              <span className="world-text">
                {today === w.id && <span className="today-tag">Today's game</span>}
                <strong>{w.emoji} {w.title}</strong>
                <span className="muted small">{w.story.split('. ')[0]}.</span>
                <span className="world-stars" aria-label={b ? `Best: ${b.best} stars` : 'Not played yet'}>
                  {[1, 2, 3].map((n) => <span key={n} className={b && n <= b.best ? 'on' : ''}>★</span>)}
                  {b ? <span className="muted small"> · played {b.plays}×</span> : <span className="muted small"> · new</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
