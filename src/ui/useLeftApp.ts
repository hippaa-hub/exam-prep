// Notices when she leaves the app (switches to another app, or locks the phone) while a question is waiting.
// A phone cannot show a screenshot or notes without leaving the app, so an answer given after leaving is
// practice, not evidence that she knows it. Nothing here blocks anything: it only tells the screen.
import { useEffect, useRef } from 'react';

/** Calls `onLeft` each time the app is hidden while `active` is true. */
export function useLeftApp(active: boolean, onLeft: () => void): void {
  const live = useRef({ active, onLeft });
  live.current = { active, onLeft };
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && live.current.active) live.current.onLeft();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
}
