import type { Game, Item, Pack } from '../content/types';
import { gameOf, itemsOf } from '../content/types';
import { READY_AT, readiness, topicReadiness, type ProgressMap } from '../engine/progress';

interface Props {
  pack: Pack;
  progress: ProgressMap;
  /** `game` is given when a whole game is started, so it can tick off today's task for that game. */
  onStart: (title: string, pool: Item[], game?: Game) => void;
  onTable: (group: string) => void;
}

const GAMES: { game: Game; title: string; blurb: string; icon: string; tone: string }[] = [
  { game: 'key-terms', title: 'Key Terms', blurb: 'Flashcards: say it, flip, rate yourself', icon: '🗂️', tone: 'blue' },
  { game: 'this-or-that', title: 'This or That', blurb: 'The pairs that are easy to mix up', icon: '⚖️', tone: 'purple' },
  { game: 'which-system', title: 'Which system?', blurb: 'Monarchy, democracy or dictatorship', icon: '🏛️', tone: 'green' },
  { game: 'which-responsibility', title: 'Which responsibility?', blurb: 'What is the government doing here?', icon: '🛡️', tone: 'orange' },
  { game: 'quiz', title: 'Quick Quiz', blurb: 'Why, how and who questions', icon: '💡', tone: 'yellow' },
];

export function Practise({ pack, progress, onStart, onTable }: Props) {
  const all = itemsOf(pack);
  const groups = [...new Set(all.flatMap((it) => (it.type === 'table' ? [it.group] : [])))];

  return (
    <>
      <header className="page-head">
        <h1>Practise</h1>
        <p>Pick a game. Each round starts with the questions you know least.</p>
      </header>

      <div className="tiles">
        {GAMES.map((g) => {
          const pool = all.filter((it) => gameOf(it) === g.game);
          if (pool.length === 0) return null;
          return (
            <Tile key={g.game} icon={g.icon} tone={g.tone} title={g.title} blurb={g.blurb} pct={readiness(pool, progress)}
              onClick={() => onStart(g.title, pool, g.game)} />
          );
        })}
        {groups.map((group) => {
          const pool = all.filter((it) => it.type === 'table' && it.group === group);
          return (
            <Tile key={group} icon="📋" tone="accent" title={`Table: ${group.replace(/^The /, '')}`} blurb="Fill the whole table from memory"
              pct={readiness(pool, progress)} onClick={() => onTable(group)} />
          );
        })}
      </div>

      <section className="card" aria-labelledby="topics-h">
        <h2 id="topics-h">By topic</h2>
        <ul className="topic-buttons">
          {pack.topics.map((t) => {
            const pct = topicReadiness(t, progress);
            return (
              <li key={t.id}>
                <button type="button" onClick={() => onStart(t.short, t.items)}>
                  <span className="topic-name">{t.title}</span>
                  <span className={pct >= READY_AT ? 'pct ready' : 'pct'}>{pct}%</span>
                  <span className="meter"><span className={pct >= READY_AT ? 'meter-fill ready' : 'meter-fill'} style={{ width: `${pct}%` }} /></span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

function Tile({ icon, tone, title, blurb, pct, onClick }: { icon: string; tone: string; title: string; blurb: string; pct: number; onClick: () => void }) {
  return (
    <button type="button" className="tile" onClick={onClick}>
      <span className={`tile-icon tone-${tone}`} aria-hidden="true">{icon}</span>
      <span className="tile-title">{title}</span>
      <span className="tile-blurb">{blurb}</span>
      <span className="meter" aria-label={`${pct}% ready`}><span className={pct >= READY_AT ? 'meter-fill ready' : 'meter-fill'} style={{ width: `${pct}%` }} /></span>
    </button>
  );
}
