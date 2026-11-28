export type Tab = 'home' | 'practise' | 'mistakes' | 'guide' | 'games';

// Practise is not in the bar: it is extra, and Home offers it once the day's tasks are finished.
const TABS: { tab: Tab; label: string; icon: string }[] = [
  { tab: 'home', label: 'Home', icon: '🏠' },
  { tab: 'mistakes', label: 'Fix', icon: '🔧' },
  { tab: 'guide', label: 'Guide', icon: '📖' },
];

/** `only`: a pack with a daily journey shows just Home and the Guide: everything she does is on Home's list. */
export function TabBar({ tab, onChange, mistakeCount, only }: { tab: Tab; onChange: (t: Tab) => void; mistakeCount: number; only?: Tab[] }) {
  const tabs = only ? TABS.filter((t) => only.includes(t.tab)) : TABS;
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
