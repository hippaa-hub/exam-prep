export type Tab = 'home' | 'practise' | 'mistakes' | 'guide' | 'games';

// Practise is not in the bar: it is extra, and Home offers it once the day's tasks are finished.
const TABS: { tab: Tab; label: string; icon: string }[] = [
  { tab: 'home', label: 'Home', icon: '🏠' },
  { tab: 'mistakes', label: 'Fix', icon: '🔧' },
  { tab: 'guide', label: 'Guide', icon: '📖' },
];

/** A pack with game worlds gets a Games tab, after Home. */
const GAMES_TAB = { tab: 'games' as Tab, label: 'Games', icon: '🎮' };

export function TabBar({ tab, onChange, mistakeCount, games = false }: { tab: Tab; onChange: (t: Tab) => void; mistakeCount: number; games?: boolean }) {
  const tabs = games ? [TABS[0], GAMES_TAB, ...TABS.slice(1)] : TABS;
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map((t) => (
        <button key={t.tab} type="button" className={t.tab === tab ? 'tab active' : 'tab'}
          aria-current={t.tab === tab ? 'page' : undefined} onClick={() => onChange(t.tab)}>
          <span className="tab-icon" aria-hidden="true">
            {t.icon}
            {t.tab === 'mistakes' && mistakeCount > 0 && <span className="badge">{mistakeCount}</span>}
          </span>
          <span>{t.label}{t.tab === 'mistakes' && mistakeCount > 0 ? <span className="sr-only"> ({mistakeCount} to fix)</span> : null}</span>
        </button>
      ))}
    </nav>
  );
}
