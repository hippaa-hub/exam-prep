export type Tab = 'home' | 'practise' | 'mistakes' | 'guide';

// Practise is not in the bar: it is extra, and Home offers it once the day's tasks are finished.
const TABS: { tab: Tab; label: string; icon: string }[] = [
  { tab: 'home', label: 'Home', icon: '🏠' },
  { tab: 'mistakes', label: 'Fix', icon: '🔧' },
  { tab: 'guide', label: 'Guide', icon: '📖' },
];

export function TabBar({ tab, onChange, mistakeCount }: { tab: Tab; onChange: (t: Tab) => void; mistakeCount: number }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((t) => (
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
