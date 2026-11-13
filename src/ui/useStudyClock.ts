// Counts the seconds Adele is really working on a long piece of writing:
// only while the app is on screen, and only while she has typed, tapped or spoken in the last two minutes.
import { useCallback, useEffect, useRef, useState } from 'react';

const IDLE_AFTER_MS = 120_000;

export function useStudyClock(onReport: (seconds: number) => void, running = true) {
  const [seconds, setSeconds] = useState(0);
  const total = useRef(0);
  const reported = useRef(0);
  const lastActivity = useRef(Date.now());
  const report = useRef(onReport);
  report.current = onReport;

  /** Hands over the seconds counted since the last hand-over. */
  const flush = useCallback(() => {
    const fresh = total.current - reported.current;
    if (fresh > 0) {
      reported.current = total.current;
      report.current(fresh);
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    const bump = () => { lastActivity.current = Date.now(); };
    const events = ['pointerdown', 'keydown', 'input', 'study-activity'];
    events.forEach((e) => window.addEventListener(e, bump, true));
    bump();
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastActivity.current < IDLE_AFTER_MS) {
        total.current += 1;
        setSeconds(total.current);
      }
    }, 1000);
    return () => {
      window.clearInterval(id);
      events.forEach((e) => window.removeEventListener(e, bump, true));
      flush(); // leaving half-way still counts
    };
  }, [running, flush]);

  return { seconds, flush, total: () => total.current };
}

/** '7:05' */
export function clockText(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
